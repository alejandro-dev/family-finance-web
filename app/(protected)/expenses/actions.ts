"use server";

import { backendFetch } from "@/services/backend";
import {
   buildExpensesSearchPath,
   SearchExpensesResponse,
} from "@/services/expensesService";
import {
   Expense,
   PaginatedResponse,
} from "@/features/users/types/userAnalytics";
import { SearchMyExpensesQuery } from "@/features/expenses/types/expenses";
import {
   normalizeExpensesRows,
   normalizeFilter,
   normalizePaginated,
   normalizeUiPage,
   RawExpense,
   toBackendPage,
} from "@/features/expenses/lib/expensesMappers";
import { getCategoryOptions as getCategoryOptionsService } from "@/services/categoryOptionsService";
import { buildFamilyMembersSearchPath, SearchFamilyMembersParams, SearchFamilyMembersResponse } from "@/services/familyMembersService";
import { FamilyMember } from "@/types/FamilyMember";

// Número de filas por defecto en la tabla de gastos.
const DEFAULT_SIZE = 10;

// Wrapper async para cumplir la restricción de exports en archivos "use server".
export async function getCategoryOptions() {
   return getCategoryOptionsService();
}

// Action de la vista user: devuelve solo paginación de gastos para la tabla.
export async function searchMyExpensesAction(
   query: SearchMyExpensesQuery
): Promise<PaginatedResponse<Expense>> {
   // Construye la ruta de búsqueda con los parámetros normalizados.
   const path = buildExpensesSearchPath({
      startDate: normalizeFilter(query.startDate),
      endDate: normalizeFilter(query.endDate),
      categoryId: normalizeFilter(query.categoryId),
      familyMemberId: normalizeFilter(query.familyMemberId),
      page: toBackendPage(query.page),
      size: query.size ?? DEFAULT_SIZE,
      isEnabled: query.isEnabled
   }).replace("/api", "");

   // Realizamos la llamada
   const data = await backendFetch<SearchExpensesResponse>(path);
   
   // Si backend aún no trae filas, calculamos aquí para no romper la UI.
   const safeRows = (data.content ?? []) as RawExpense[];
   const normalizedRows = normalizeExpensesRows(safeRows);

   return normalizePaginated<Expense>({
      ...data,
      content: normalizedRows,
      number: normalizeUiPage(data.number),
   }, DEFAULT_SIZE);
}

// Action para buscar miembros de la familia, usada en el filtro y en el modal de gastos.
export async function searchMyFamilyMembersAction(familyId: string): Promise<FamilyMember[]> {
   const params: SearchFamilyMembersParams = { familyId, enabled: true };

   const path = buildFamilyMembersSearchPath(
      params
   ).replace("/api", "");

   // Realizamos la llamada
   const data = await backendFetch<SearchFamilyMembersResponse>(path);

   return data.content ?? [];
}
