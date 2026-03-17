"use server";

import { backendFetch } from "@/services/backend";
import { buildFamilyMembersSearchPath, SearchFamilyMembersParams, SearchFamilyMembersResponse } from "@/services/familyMembersService";

// Función que realiza la llamada a la API de búsqueda de usuarios.
export async function searchFamilyMembers(params: SearchFamilyMembersParams = {}): Promise<SearchFamilyMembersResponse> {
   // Reutilizamos la construcción de query params y ajustamos el prefijo para backend real.
   const path = buildFamilyMembersSearchPath(params).replace("/api", "");
   return backendFetch<SearchFamilyMembersResponse>(path);
}