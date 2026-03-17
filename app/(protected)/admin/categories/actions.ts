"use server";

import { backendFetch } from "@/services/backend";
import {
	buildCategoriesSearchPath,
	type SearchCategoriesParams,
	type SearchCategoriesResponse,
} from "@/services/categoriesService";

export type { SearchCategoriesParams, SearchCategoriesResponse } from "@/services/categoriesService";

// Función que realiza la llamada a la API de búsqueda de categorías.
export async function searchCategories(params: SearchCategoriesParams = {}): Promise<SearchCategoriesResponse> {
	// Reutilizamos la construcción de query params y ajustamos el prefijo para backend real.
	const path = buildCategoriesSearchPath(params).replace("/api", "");
	
	return backendFetch<SearchCategoriesResponse>(path);
}
