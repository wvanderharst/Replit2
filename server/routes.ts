import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMathSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get math problems by type
  app.get("/api/problems/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const problems = await storage.getMathProblemsByType(type);
      res.json(problems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problems" });
    }
  });

  // Get specific math problem
  app.get("/api/problems/single/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const problem = await storage.getMathProblem(id);
      if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
      }
      res.json(problem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch problem" });
    }
  });

  // Create new math session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertMathSessionSchema.parse(req.body);
      const session = await storage.createMathSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create session" });
    }
  });

  // Get math session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const session = await storage.getMathSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Update math session (for step progress)
  app.patch("/api/sessions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await storage.updateMathSession(id, updates);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Validate transformation step
  app.post("/api/validate-step", async (req, res) => {
    try {
      const { equation, operation, operand } = req.body;
      
      // Basic validation logic - in a real app this would be more sophisticated
      const isValid = validateMathOperation(equation, operation, operand);
      const preview = generatePreview(equation, operation, operand);
      
      res.json({ 
        isValid, 
        preview,
        explanation: isValid ? "Valid operation" : "Invalid operation - equation would become unbalanced"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate step" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for math validation
function validateMathOperation(equation: string, operation: string, operand?: string): boolean {
  // Simplified validation - in a real app this would use a proper math parser
  const validOperations = ['multiply', 'divide', 'add', 'subtract', 'distribute', 'combine'];
  return validOperations.includes(operation);
}

function generatePreview(equation: string, operation: string, operand?: string): string {
  // Simplified preview generation - in a real app this would use a proper math engine
  switch (operation) {
    case 'multiply':
      if (operand) {
        return `${operand} × (${equation})`;
      }
      break;
    case 'divide':
      if (operand) {
        return `(${equation}) ÷ ${operand}`;
      }
      break;
    case 'simplify':
      // This would involve actual mathematical simplification
      return equation;
    default:
      return equation;
  }
  return equation;
}
