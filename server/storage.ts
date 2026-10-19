import { type User, type InsertUser, type MathSession, type InsertMathSession, type MathProblem, type InsertMathProblem } from "@shared/schema";
// Web Crypto works in both Node and the browser, so this storage can also run inside the mobile app
const randomUUID = () => globalThis.crypto.randomUUID();

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getMathSession(id: string): Promise<MathSession | undefined>;
  createMathSession(session: InsertMathSession): Promise<MathSession>;
  updateMathSession(id: string, updates: Partial<MathSession>): Promise<MathSession | undefined>;
  getMathSessionsByUser(userId: string): Promise<MathSession[]>;
  
  getMathProblem(id: string): Promise<MathProblem | undefined>;
  getMathProblemsByType(type: string): Promise<MathProblem[]>;
  createMathProblem(problem: InsertMathProblem): Promise<MathProblem>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mathSessions: Map<string, MathSession>;
  private mathProblems: Map<string, MathProblem>;

  constructor() {
    this.users = new Map();
    this.mathSessions = new Map();
    this.mathProblems = new Map();
    
    // Initialize with some sample problems
    this.initializeSampleProblems();
  }

  private initializeSampleProblems() {
    const sampleProblems: (InsertMathProblem & { id: string })[] = [
      {
        id: randomUUID(),
        type: "linear_equations",
        difficulty: "intermediate",
        equation: "½x + ⅓ = ¼x - ⅙",
        solution: "x = -2",
        steps: [
          {
            stepNumber: 1,
            description: "Identify equation type",
            operation: "identify",
            equation: "½x + ⅓ = ¼x - ⅙",
            explanation: "This is a linear equation with fractions that needs to be solved for x."
          },
          {
            stepNumber: 2,
            description: "Clear fractions",
            operation: "multiply",
            equation: "12 × (½x + ⅓) = 12 × (¼x - ⅙)",
            explanation: "Multiply both sides by the LCD (12) to eliminate fractions."
          },
          {
            stepNumber: 3,
            description: "Simplify expressions",
            operation: "simplify",
            equation: "6x + 4 = 3x - 2",
            explanation: "Distribute the multiplication and simplify each side."
          },
          {
            stepNumber: 4,
            description: "Isolate variable",
            operation: "subtract",
            equation: "3x = -6",
            explanation: "Subtract 3x from both sides and subtract 4 from both sides."
          },
          {
            stepNumber: 5,
            description: "Solve for x",
            operation: "divide",
            equation: "x = -2",
            explanation: "Divide both sides by 3 to get the final answer."
          }
        ],
        hints: [
          {
            stepNumber: 2,
            hintText: "When you have fractions in an equation, multiplying both sides by the LCD (Least Common Denominator) will eliminate all fractions at once.",
            triggerCondition: "step_start"
          },
          {
            stepNumber: 2,
            hintText: "The denominators are 2, 3, 4, and 6. The LCD of these numbers is 12.",
            triggerCondition: "hint_request"
          },
          {
            stepNumber: 3,
            hintText: "Remember to distribute the 12 to each term inside the parentheses.",
            triggerCondition: "step_start"
          }
        ]
      }
    ];

    sampleProblems.forEach(problem => {
      const { id, ...problemData } = problem;
      const fullProblem: MathProblem = { ...problemData, id };
      this.mathProblems.set(id, fullProblem);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMathSession(id: string): Promise<MathSession | undefined> {
    return this.mathSessions.get(id);
  }

  async createMathSession(insertSession: InsertMathSession): Promise<MathSession> {
    const id = randomUUID();
    const now = new Date();
    const session: MathSession = { 
      ...insertSession, 
      id, 
      createdAt: now,
      updatedAt: now 
    };
    this.mathSessions.set(id, session);
    return session;
  }

  async updateMathSession(id: string, updates: Partial<MathSession>): Promise<MathSession | undefined> {
    const session = this.mathSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession: MathSession = { 
      ...session, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.mathSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getMathSessionsByUser(userId: string): Promise<MathSession[]> {
    return Array.from(this.mathSessions.values()).filter(
      session => session.userId === userId
    );
  }

  async getMathProblem(id: string): Promise<MathProblem | undefined> {
    return this.mathProblems.get(id);
  }

  async getMathProblemsByType(type: string): Promise<MathProblem[]> {
    return Array.from(this.mathProblems.values()).filter(
      problem => problem.type === type
    );
  }

  async createMathProblem(insertProblem: InsertMathProblem): Promise<MathProblem> {
    const id = randomUUID();
    const problem: MathProblem = { ...insertProblem, id };
    this.mathProblems.set(id, problem);
    return problem;
  }
}

export const storage = new MemStorage();
