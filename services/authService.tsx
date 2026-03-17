import { fetchJson } from "@/services/httpClient";

// Respuesta mínima esperada al iniciar sesión.
export interface LoginResponse {
   isAdmin: boolean;
   token?: string;
}

export interface AuthLoginInput {
   email: string;
   password: string;
}

export interface AuthRegisterInput {
   username: string;
   email: string;
   password: string;
   familyName: string;
   birthDate?: string;
}

// Respuesta genérica para endpoints auth sin contrato fuerte en frontend.
export interface AuthMessageResponse {
   message?: string;
}

export async function login(input: AuthLoginInput) {
   return fetchJson<LoginResponse>("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
   });
}

export async function register(input: AuthRegisterInput) {
   return fetchJson<AuthMessageResponse>("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
   });
}

export async function verifyEmail(token: string) {
   return fetchJson<AuthMessageResponse>("/api/auth/verify-email?token=" + token, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

export async function resetPassword(email: string) {
   return fetchJson<AuthMessageResponse>("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
   });
}

export async function changePassword(password: string, token: string) {
   return fetchJson<AuthMessageResponse>(`/api/reset-password?token=${token}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
   });
}

export async function logout() {
   return fetchJson<AuthMessageResponse>("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
   });
}
