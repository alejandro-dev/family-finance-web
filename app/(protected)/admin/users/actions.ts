"use server";

import { backendFetch } from "@/services/backend";
import { requireAdmin } from "@/lib/authorize";
import {
	buildUsersSearchPath,
	type SearchUsersParams,
	type SearchUsersResponse,
} from "@/services/usersService";

export type { SearchUsersParams, SearchUsersResponse } from "@/services/usersService";

// Función que realiza la llamada a la API de búsqueda de usuarios.
export async function searchUsers(params: SearchUsersParams = {}): Promise<SearchUsersResponse> {
	await requireAdmin();

	// Reutilizamos la construcción de query params y ajustamos el prefijo para backend real.
	const path = buildUsersSearchPath(params).replace("/api", "");
	return backendFetch<SearchUsersResponse>(path);
}
