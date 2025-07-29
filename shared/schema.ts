import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const mathSessions = pgTable("math_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  equationType: text("equation_type").notNull(), // "linear", "quadratic", etc.
  originalEquation: text("original_equation").notNull(),
  currentStep: integer("current_step").notNull().default(1),
  totalSteps: integer("total_steps").notNull(),
  stepsCompleted: json("steps_completed").notNull().$type<Array<{
    stepNumber: number;
    operation: string;
    equation: string;
    isValid: boolean;
    timestamp: string;
  }>>(),
  hints: json("hints").notNull().$type<Array<{
    stepNumber: number;
    hintText: string;
    shown: boolean;
  }>>(),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const mathProblems = pgTable("math_problems", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "linear_equations", "quadratic_equations", etc.
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  equation: text("equation").notNull(),
  solution: text("solution").notNull(),
  steps: json("steps").notNull().$type<Array<{
    stepNumber: number;
    description: string;
    operation: string;
    equation: string;
    explanation: string;
  }>>(),
  hints: json("hints").notNull().$type<Array<{
    stepNumber: number;
    hintText: string;
    triggerCondition: string;
  }>>(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMathSessionSchema = createInsertSchema(mathSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMathProblemSchema = createInsertSchema(mathProblems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMathSession = z.infer<typeof insertMathSessionSchema>;
export type MathSession = typeof mathSessions.$inferSelect;
export type InsertMathProblem = z.infer<typeof insertMathProblemSchema>;
export type MathProblem = typeof mathProblems.$inferSelect;
