import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { analyzeImageWithVision, generateMemoryPrompt } from "./azure_services";
import { hashPassword } from "./auth";

async function seedDatabase() {
  const existingUser = await storage.getUserByUsername("caretaker");
  if (!existingUser) {
    const password = await hashPassword("password123");
    const caretaker = await storage.createUser({ username: "caretaker", password, role: "caretaker" });
    const patient = await storage.createUser({ username: "patient", password, role: "patient", caretakerId: caretaker.id });
    
    await storage.createMemory({
      patientId: patient.id,
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      description: "Family picnic at the park, 1985. Tags: park, family, picnic",
      aiQuestion: "Who is holding the frisbee in this picture?"
    });

    await storage.createRoutine({ patientId: patient.id, task: "Morning Walk", isCompleted: false });
    await storage.createRoutine({ patientId: patient.id, task: "Drink Water", isCompleted: true });

    await storage.createMedication({ patientId: patient.id, name: "Aspirin", time: "08:00 AM", taken: false });
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await seedDatabase();
  setupAuth(app);

  // Helper to ensure data isolation
  const verifyPatientAccess = async (req: any, patientId: number) => {
    if (req.user.role === 'patient') {
      return req.user.id === patientId;
    }
    // If caretaker, ensure the patient belongs to them
    const patient = await storage.getUser(patientId);
    return patient && patient.role === 'patient' && patient.caretakerId === req.user.id;
  };

  // Helper to get patientId
  const getTargetPatientId = async (req: any) => {
    if (req.user?.role === 'patient') return req.user.id;
    const queryPatientId = req.query.patientId ? Number(req.query.patientId) : undefined;
    if (queryPatientId) {
      const hasAccess = await verifyPatientAccess(req, queryPatientId);
      return hasAccess ? queryPatientId : undefined;
    }
    return undefined;
  };

  // Memories
  app.get(api.memories.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const patientId = await getTargetPatientId(req);
    if (!patientId) return res.json([]);

    const memories = await storage.getMemories(patientId);
    res.json(memories);
  });

  app.post(api.memories.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.memories.create.input.parse(req.body);
      // Determine patient ID (must be provided in body if caretaker, or derived)
      // The schema for creation doesn't enforce patientId in the Zod schema from *client* perspective if we omitted it, 
      // but we updated schema.ts to include it in the table. 
      // Let's assume the client sends it or we inject it.
      // The shared schema omitted it? Yes. So we need to handle it.
      
      let targetPatientId = req.user.role === 'patient' ? req.user.id : (req.body as any).patientId;
      if (!targetPatientId && req.user.role === 'caretaker') {
         // Try to find a patient for this caretaker?
         // For now, fail if not provided.
         return res.status(400).json({message: "patientId required"});
      }

      // Simulate AI analysis
      const description = await analyzeImageWithVision(input.imageUrl);
      const aiQuestion = await generateMemoryPrompt([description]); // simple pass-through
      
      const memory = await storage.createMemory({
        ...input,
        patientId: targetPatientId,
        description: input.description || description,
        aiQuestion: aiQuestion
      });
      res.status(201).json(memory);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Routines
  app.get(api.routines.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const patientId = await getTargetPatientId(req);
    if (!patientId) return res.json([]);
    const routines = await storage.getRoutines(patientId);
    res.json(routines);
  });

  app.post(api.routines.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.routines.create.input.parse(req.body);
      const patientId = req.user.role === 'patient' ? req.user.id : (req.body as any).patientId;
      if (!patientId) return res.status(400).json({message: "patientId required"});

      const routine = await storage.createRoutine({ ...input, patientId });
      res.status(201).json(routine);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.routines.toggle.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const updated = await storage.toggleRoutine(Number(req.params.id));
    if (!updated) return res.status(404).json({ message: "Routine not found" });
    res.json(updated);
  });

  // Medications
  app.get(api.medications.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const patientId = await getTargetPatientId(req);
    if (!patientId) return res.json([]);
    const meds = await storage.getMedications(patientId);
    res.json(meds);
  });

  app.post(api.medications.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const input = api.medications.create.input.parse(req.body);
      const patientId = req.user.role === 'patient' ? req.user.id : (req.body as any).patientId;
      if (!patientId) return res.status(400).json({message: "patientId required"});

      const med = await storage.createMedication({ ...input, patientId });
      res.status(201).json(med);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.medications.toggle.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const updated = await storage.toggleMedication(Number(req.params.id));
    if (!updated) return res.status(404).json({ message: "Medication not found" });
    res.json(updated);
  });

  // Emergency
  app.get(api.emergency.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const patientId = await getTargetPatientId(req);
    if (!patientId) return res.json([]);
    const logs = await storage.getEmergencyLogs(patientId);
    res.json(logs);
  });

  app.post(api.emergency.trigger.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (req.user.role !== 'patient') return res.status(403).send("Only patients can trigger SOS");
    
    const patientId = req.user.id; 
    const log = await storage.triggerEmergency(patientId);
    res.status(201).json(log);
  });

  return httpServer;
}
