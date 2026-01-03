import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("caretaker"), // 'caretaker' | 'patient'
});

export const memories = pgTable("memories", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  aiQuestion: text("ai_question"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const routines = pgTable("routines", {
  id: serial("id").primaryKey(),
  task: text("task").notNull(),
  isCompleted: boolean("is_completed").default(false),
});

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  time: text("time").notNull(), // e.g. "08:00 AM"
  taken: boolean("taken").default(false),
});

export const emergencyLogs = pgTable("emergency_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow(),
  resolved: boolean("resolved").default(false),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertMemorySchema = createInsertSchema(memories).omit({ id: true, createdAt: true });
export const insertRoutineSchema = createInsertSchema(routines).omit({ id: true });
export const insertMedicationSchema = createInsertSchema(medications).omit({ id: true });
export const insertEmergencyLogSchema = createInsertSchema(emergencyLogs).omit({ id: true, timestamp: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Memory = typeof memories.$inferSelect;
export type InsertMemory = z.infer<typeof insertMemorySchema>;
export type Routine = typeof routines.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type EmergencyLog = typeof emergencyLogs.$inferSelect;
