import { db } from "./db";
import {
  users, memories, routines, medications, emergencyLogs,
  type User, type InsertUser, type InsertMemory, type InsertRoutine, type InsertMedication
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Scoped by patientId
  createMemory(memory: InsertMemory): Promise<typeof memories.$inferSelect>;
  getMemories(patientId: number): Promise<typeof memories.$inferSelect[]>;

  createRoutine(routine: InsertRoutine): Promise<typeof routines.$inferSelect>;
  getRoutines(patientId: number): Promise<typeof routines.$inferSelect[]>;
  toggleRoutine(id: number): Promise<typeof routines.$inferSelect | undefined>;

  createMedication(med: InsertMedication): Promise<typeof medications.$inferSelect>;
  getMedications(patientId: number): Promise<typeof medications.$inferSelect[]>;
  toggleMedication(id: number): Promise<typeof medications.$inferSelect | undefined>;

  triggerEmergency(patientId: number): Promise<typeof emergencyLogs.$inferSelect>;
  getEmergencyLogs(patientId: number): Promise<typeof emergencyLogs.$inferSelect[]>;
  getPatientsForCaretaker(caretakerId: number): Promise<User[]>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async createMemory(memory: InsertMemory): Promise<typeof memories.$inferSelect> {
    const [newMemory] = await db.insert(memories).values(memory).returning();
    return newMemory;
  }

  async getMemories(patientId: number): Promise<typeof memories.$inferSelect[]> {
    return await db.select().from(memories).where(eq(memories.patientId, patientId)).orderBy(desc(memories.createdAt));
  }

  async createRoutine(routine: InsertRoutine): Promise<typeof routines.$inferSelect> {
    const [newRoutine] = await db.insert(routines).values(routine).returning();
    return newRoutine;
  }

  async getRoutines(patientId: number): Promise<typeof routines.$inferSelect[]> {
    return await db.select().from(routines).where(eq(routines.patientId, patientId)).orderBy(desc(routines.id));
  }

  async toggleRoutine(id: number): Promise<typeof routines.$inferSelect | undefined> {
    const [routine] = await db.select().from(routines).where(eq(routines.id, id));
    if (!routine) return undefined;
    const [updated] = await db.update(routines).set({ isCompleted: !routine.isCompleted }).where(eq(routines.id, id)).returning();
    return updated;
  }

  async createMedication(med: InsertMedication): Promise<typeof medications.$inferSelect> {
    const [newMed] = await db.insert(medications).values(med).returning();
    return newMed;
  }

  async getMedications(patientId: number): Promise<typeof medications.$inferSelect[]> {
    return await db.select().from(medications).where(eq(medications.patientId, patientId)).orderBy(desc(medications.id));
  }

  async toggleMedication(id: number): Promise<typeof medications.$inferSelect | undefined> {
    const [med] = await db.select().from(medications).where(eq(medications.id, id));
    if (!med) return undefined;
    const [updated] = await db.update(medications).set({ taken: !med.taken }).where(eq(medications.id, id)).returning();
    return updated;
  }

  async triggerEmergency(patientId: number): Promise<typeof emergencyLogs.$inferSelect> {
    const [log] = await db.insert(emergencyLogs).values({ patientId }).returning();
    return log;
  }

  async getEmergencyLogs(patientId: number): Promise<typeof emergencyLogs.$inferSelect[]> {
    return await db.select().from(emergencyLogs).where(eq(emergencyLogs.patientId, patientId)).orderBy(desc(emergencyLogs.timestamp));
  }

  async getPatientsForCaretaker(caretakerId: number): Promise<User[]> {
    return await db.select().from(users).where(and(eq(users.caretakerId, caretakerId), eq(users.role, 'patient'))).orderBy(users.username);
  }
}

export const storage = new DatabaseStorage();
