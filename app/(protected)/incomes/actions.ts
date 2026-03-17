"use server";

import { backendFetch } from "@/services/backend";
import { getCategoryOptions as getCategoryOptionsService } from "@/services/categoryOptionsService";
import { buildFamilyMembersSearchPath, SearchFamilyMembersParams, SearchFamilyMembersResponse } from "@/services/familyMembersService";
import { buildIncomesSearchPath, SearchIncomesResponse } from "@/services/incomesService";
import { buildIncomeRulesSearchPath, SearchIncomeRulesResponse } from "@/services/incomeRulesService";
import { FamilyMember } from "@/types/FamilyMember";
import { normalizeFilter, normalizePaginated, normalizeUiPage, toBackendPage } from "@/features/expenses/lib/expensesMappers";
import { Income, IncomeRule, SearchMyIncomeRulesQuery, SearchMyIncomesQuery } from "@/features/incomes/types/incomes";
import { PaginatedResponse } from "@/types/pagination";
import { normalizeIncomeRulesRows, normalizeIncomesRows, RawIncome, RawIncomeRule } from "@/features/incomes/lib/incomesMappers";

// Cantidad de elementos por defecto en las páginas.
const DEFAULT_SIZE = 10;

// Consultamos las categorías
export async function getCategoryOptions() {
   return getCategoryOptionsService();
}

// Buscamos los ingresos de mi familia
export async function searchMyIncomesAction(
   query: SearchMyIncomesQuery
): Promise<PaginatedResponse<Income>> {
   // Creamos la ruta con los filtros de la llamada
   const path = buildIncomesSearchPath({
      startDate: normalizeFilter(query.startDate),
      endDate: normalizeFilter(query.endDate),
      familyMemberId: normalizeFilter(query.familyMemberId),
      page: toBackendPage(query.page),
      size: query.size ?? DEFAULT_SIZE,
   }).replace("/api", "");

   const data = await backendFetch<SearchIncomesResponse>(path);
   const safeRows = (data.content ?? []) as RawIncome[];

   // Normalizamos los datos para que no se rompa la UI si falta algún campo.
   const normalizedRows = normalizeIncomesRows(safeRows);

   // Normalizamos los datos de la tabla para que no se rompa la UI si falta algún campo.
   return normalizePaginated<Income>(
      {
         ...data,
         content: normalizedRows,
         number: normalizeUiPage(data.number),
      },
      DEFAULT_SIZE
   );
}

// Consultamos las reglas de ingresos de mi familia
export async function searchMyIncomeRulesAction(
   query: SearchMyIncomeRulesQuery
): Promise<PaginatedResponse<IncomeRule>> {
   // Creamos la ruta con los filtros de la llamada
   const path = buildIncomeRulesSearchPath({
      familyMemberId: normalizeFilter(query.familyMemberId),
      page: toBackendPage(query.page),
      size: query.size ?? DEFAULT_SIZE,
   }).replace("/api", "");

   const data = await backendFetch<SearchIncomeRulesResponse>(path);
   const safeRows = (data.content ?? []) as RawIncomeRule[];

   // Normalizamos los datos para que no se rompa la UI si falta algún campo.
   const normalizedRows = normalizeIncomeRulesRows(safeRows);

   // Normalizamos los datos de la tabla para que no se rompa la UI si falta algún campo.
   return normalizePaginated<IncomeRule>(
      {
         ...data,
         content: normalizedRows,
         number: normalizeUiPage(data.number),
      },
      DEFAULT_SIZE
   );
}

// Consultamos los miembros de la familia
export async function searchMyFamilyMembersAction(familyId: string): Promise<FamilyMember[]> {
   const params: SearchFamilyMembersParams = { familyId, enabled: true };

   const path = buildFamilyMembersSearchPath(params).replace("/api", "");

   const data = await backendFetch<SearchFamilyMembersResponse>(path);

   return data.content ?? [];
}
