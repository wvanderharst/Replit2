import { MemStorage } from "../../../server/storage";
import { insertMathSessionSchema } from "@shared/schema";

// In the standalone (mobile) build there is no Express server, so /api requests
// are answered in-process by the same in-memory storage the server uses.
const storage = new MemStorage();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handle(method: string, path: string, body: any): Promise<Response> {
  let match: RegExpMatchArray | null;

  if (method === "GET" && (match = path.match(/^\/api\/problems\/single\/([^/]+)$/))) {
    const problem = await storage.getMathProblem(match[1]);
    return problem ? json(problem) : json({ message: "Problem not found" }, 404);
  }

  if (method === "GET" && (match = path.match(/^\/api\/problems\/([^/]+)$/))) {
    return json(await storage.getMathProblemsByType(match[1]));
  }

  if (method === "POST" && path === "/api/sessions") {
    const parsed = insertMathSessionSchema.safeParse(body);
    if (!parsed.success) {
      return json({ message: "Invalid session data", errors: parsed.error.errors }, 400);
    }
    return json(await storage.createMathSession(parsed.data));
  }

  if ((match = path.match(/^\/api\/sessions\/([^/]+)$/))) {
    if (method === "GET") {
      const session = await storage.getMathSession(match[1]);
      return session ? json(session) : json({ message: "Session not found" }, 404);
    }
    if (method === "PATCH") {
      const session = await storage.updateMathSession(match[1], body);
      return session ? json(session) : json({ message: "Session not found" }, 404);
    }
  }

  return json({ message: "Not found" }, 404);
}

export function installLocalApi() {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : input.toString(), window.location.href);
    if (!url.pathname.startsWith("/api/")) {
      return originalFetch(input, init);
    }

    const method = (init?.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
    const rawBody = init?.body ?? (input instanceof Request ? await input.text() : undefined);
    const body = typeof rawBody === "string" && rawBody ? JSON.parse(rawBody) : undefined;
    return handle(method, url.pathname, body);
  };
}
