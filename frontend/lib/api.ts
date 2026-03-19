import type {
  AuthPayload,
  AuthResponse,
  Prompt,
  PromptInput,
  RegisterPayload,
} from "@/types/prompt";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const TOKEN_KEY = "ai_prompt_manager_token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  withAuth = true,
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(
      "Missing NEXT_PUBLIC_API_URL. Add it to your frontend environment.",
      500,
    );
  }

  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (withAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message =
      payload?.detail ??
      payload?.message ??
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    false,
  );
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>(
    "/register",
    {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    },
    false,
  );
}

export async function getPrompts(): Promise<Prompt[]> {
  return request<Prompt[]>("/prompts");
}

export async function createPrompt(payload: PromptInput): Promise<Prompt> {
  return request<Prompt>("/prompts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPromptById(id: string): Promise<Prompt> {
  return request<Prompt>(`/prompts/${id}`);
}

export async function deletePrompt(id: string): Promise<void> {
  await request<null>(
    `/prompts/${id}`,
    {
      method: "DELETE",
    },
    true,
  );
}
