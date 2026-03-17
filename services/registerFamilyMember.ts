import { AuthMessageResponse } from "./authService";
import { fetchJson } from "./httpClient";

export interface InvitationAuthRegisterInput {
   username: string;
   email: string;
   password: string;
   birthDate?: string;
}


// Función para registrar un familiar.
export async function createFamilyMember(input: InvitationAuthRegisterInput) {
   return fetchJson<AuthMessageResponse>("/api/family-member-invitations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:  JSON.stringify(input)
   });
}