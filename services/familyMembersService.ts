import { FamilyMember } from "@/types/FamilyMember";
import { fetchJson } from "@/services/httpClient";
import { PaginatedResponse } from "@/types/pagination";

export interface SearchFamilyMembersParams { 
   familyId?: string;
   enabled?: boolean;
   page?: number;
   size?: number;
}

// Payload esperado para crear/actualizar un familiar.
export interface SaveFamilyMemberPayload {
   name: string;
   birthDate: string;
   familyId?: string;
   isEnabled?: boolean;
}

// Payload esperado para enviar la invitación de un familiar.
export interface InviteFamilyMemberPayload {
   email: string;
}

export type SearchFamilyMembersResponse = PaginatedResponse<FamilyMember>;

// Construye la URL para listar/buscar miembros de la familia con paginación.
export function buildFamilyMembersSearchPath(params: SearchFamilyMembersParams = {}): string {
   const { familyId = "", page = 0, size = 10 } = params;
   const queryParams = new URLSearchParams();

   if (familyId) queryParams.append("familyId", familyId);
   if (params.enabled !== undefined) queryParams.append("enabled", params.enabled.toString());
   // Conservamos paginación para tablas y selectors que piden tamaños distintos.
   queryParams.append("page", page.toString());
   queryParams.append("size", size.toString());

   const queryString = queryParams.toString();
   return `/api/family-members${queryString ? `?${queryString}` : ""}`;
}

// Función que realiza la búsqueda de miembros de la familia.
export async function searchFamilyMembers(params: SearchFamilyMembersParams): Promise<SearchFamilyMembersResponse> {
   return fetchJson<SearchFamilyMembersResponse>(buildFamilyMembersSearchPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

// Función para crear un familiar.
export async function createFamilyMember(payload: SaveFamilyMemberPayload): Promise<FamilyMember> {
   return fetchJson<FamilyMember>("/api/family-members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

// Función para actualizar un familiar.
export async function updateFamilyMember(familyMemberId: string, payload: SaveFamilyMemberPayload): Promise<FamilyMember> {
   return fetchJson<FamilyMember>(`/api/family-members/${familyMemberId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

// Función para invitar un familiar.
export async function inviteFamilyMember(payload: InviteFamilyMemberPayload): Promise<FamilyMember> {
   return fetchJson<FamilyMember>("/api/family-member-invitations/invitation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

// Función para obtener información de un familiar.
export async function getFamilyMember(familyMemberId: string): Promise<FamilyMember> {
   return fetchJson<FamilyMember>(`/api/family-members/${familyMemberId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}