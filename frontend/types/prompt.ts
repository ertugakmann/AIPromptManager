export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PromptInput {
  title: string;
  content: string;
  tags: string[];
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends AuthPayload {
  confirmPassword?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type?: string;
}
