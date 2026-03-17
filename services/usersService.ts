import { User } from "@/types/User";
import { fetchJson } from "@/services/httpClient";
import { PaginatedResponse } from "@/types/pagination";

export interface SearchUsersParams { 
   search?: string; 
   page?: number; 
   size?: number 
}

export type SearchUsersResponse = PaginatedResponse<User>;

export interface SaveUserPayload {
   enable: boolean;
   admin: boolean;
   isOwnerUser: boolean;
}

// Construye la URL para listar/buscar usuarios con paginación.
export function buildUsersSearchPath(params: SearchUsersParams = {}): string {
   const { search = "", page = 0, size = 10 } = params;
   const queryParams = new URLSearchParams();

   if (search) queryParams.append("search", search);
   queryParams.append("page", page.toString());
   queryParams.append("size", size.toString());

   const queryString = queryParams.toString();
   return `/api/users${queryString ? `?${queryString}` : ""}`;
}

// Función que realiza la búsqueda de usuarios.
export async function searchUsers(params: SearchUsersParams): Promise<SearchUsersResponse> {
   return fetchJson<SearchUsersResponse>(buildUsersSearchPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

// Función que actualiza un usuario. 
export async function updateUser(id: string, payload: SaveUserPayload): Promise<User> {
   return fetchJson<User>(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

// Función que elimina un usuario.
export async function deleteUser(id: string): Promise<void> {
   await fetchJson<unknown>(`/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
   });
}

// Función que elimina un usuario.
export async function changePassword(payload: {password: string}): Promise<void> {
   await fetchJson<unknown>(`/api/users/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

