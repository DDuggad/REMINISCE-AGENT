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
    await storage.createUser({ username: "caretaker", password, role: "caretaker" });
    await storage.createUser({ username: "patient", password, role: "patient" });
    
    await storage.createMemory({
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
      description: "Family picnic at the park, 1985",
      aiQuestion: "Who is holding the frisbee in this picture?"
    });

    await storage.createRoutine({ task: "Morning Walk", isCompleted: false });
    await storage.createRoutine({ task: "Drink Water", isCompleted: true });

    await storage.createMedication({ name: "Aspirin", time: "08:00 AM", taken: false });
  }
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  await seedDatabase();
  setupAuth(app);

  // Memories
  app.get(api.memories.list.path, async (_req, res) => {
    const memories = await storage.getMemories();
    res.json(memories);
  });

  app.post(api.memories.create.path, async (req, res) => {
    try {
      const input = api.memories.create.input.parse(req.body);
      // Simulate AI analysis
      const description = await analyzeImageWithVision(input.imageUrl);
      const aiQuestion = await generateMemoryPrompt(["placeholder", "tags"]);
      
      const memory = await storage.createMemory({
        ...input,
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
  app.get(api.routines.list.path, async (_req, res) => {
    const routines = await storage.getRoutines();
    res.json(routines);
  });

  app.post(api.routines.create.path, async (req, res) => {
    try {
      const input = api.routines.create.input.parse(req.body);
      const routine = await storage.createRoutine(input);
      res.status(201).json(routine);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.routines.toggle.path, async (req, res) => {
    const updated = await storage.toggleRoutine(Number(req.params.id));
    if (!updated) return res.status(404).json({ message: "Routine not found" });
    res.json(updated);
  });

  // Medications
  app.get(api.medications.list.path, async (_req, res) => {
    const meds = await storage.getMedications();
    res.json(meds);
  });

  app.post(api.medications.create.path, async (req, res) => {
    try {
      const input = api.medications.create.input.parse(req.body);
      const med = await storage.createMedication(input);
      res.status(201).json(med);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.medications.toggle.path, async (req, res) => {
    const updated = await storage.toggleMedication(Number(req.params.id));
    if (!updated) return res.status(404).json({ message: "Medication not found" });
    res.json(updated);
  });

  // Emergency
  app.get(api.emergency.list.path, async (_req, res) => {
    const logs = await storage.getEmergencyLogs();
    res.json(logs);
  });

  app.post(api.emergency.trigger.path, async (_req, res) => {
    const log = await storage.triggerEmergency();
    res.status(201).json(log);
  });

  return httpServer;
}
