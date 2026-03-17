import { Category } from "@/types/Category";
import { fetchJson } from "@/services/httpClient";
import { PaginatedResponse } from "@/types/pagination";

export interface SearchCategoriesParams { 
   search?: string; 
   page?: number; 
   size?: number 
}

export type SearchCategoriesResponse = PaginatedResponse<Category>;

export interface SaveCategoryPayload {
   name: string;
}

// Construye la URL para listar/buscar categorías con paginación.
export function buildCategoriesSearchPath(params: SearchCategoriesParams = {}): string {
   const { search = "", page = 0, size = 10 } = params;
   const queryParams = new URLSearchParams();

   if (search) queryParams.append("search", search);
   queryParams.append("page", page.toString());
   queryParams.append("size", size.toString());

   const queryString = queryParams.toString();
   return `/api/categories${queryString ? `?${queryString}` : ""}`;
}

// Función que realiza la llamada a la API de búsqueda de categorías.
export async function searchCategories(params: SearchCategoriesParams = {}): Promise<SearchCategoriesResponse> {
   return fetchJson<SearchCategoriesResponse>(buildCategoriesSearchPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

// Función que realiza la creación de una categoría.
export async function createCategory(payload: SaveCategoryPayload): Promise<Category> {
   return fetchJson<Category>("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

// Función que realiza la actualización de una categoría.
export async function updateCategory(id: string, payload: SaveCategoryPayload): Promise<Category> {
   return fetchJson<Category>(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

// Función que elimina una categoría.
export async function deleteCategory(id: string): Promise<void> {
   await fetchJson<Category>(`/api/categories/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
   });
}
