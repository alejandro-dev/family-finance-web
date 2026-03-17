import { fetchJson } from "@/services/httpClient";
import { PaginatedResponse } from "@/types/pagination";
import { Income } from "@/features/incomes/types/incomes";

export interface SearchIncomesParams {
   familyId?: string;
   startDate?: string;
   endDate?: string;
   familyMemberId?: string;
   page?: number;
   size?: number;
}

export interface SaveIncomePayload {
   description: string;
   amount: number;
   familyMemberId: string;
   date: string;
   categoryId: string;
}

export type SearchIncomesResponse = PaginatedResponse<Income>;

export interface SearchTotalIncomeEntriesResponse {
   totalGlobal: number;
   categories: {
      total: number;
      categoryName: string;
   }[];
}

export function buildIncomesSearchPath(params: SearchIncomesParams = {}): string {
   const {
      familyId = "",
      startDate = "",
      endDate = "",
      familyMemberId = "",
      page = 0,
      size = 10,
   } = params;

   const queryParams = new URLSearchParams();

   if (familyId) queryParams.append("familyId", familyId);
   if (startDate) queryParams.append("startDate", startDate);
   if (endDate) queryParams.append("endDate", endDate);
   if (familyMemberId) queryParams.append("familyMemberId", familyMemberId);
   queryParams.append("page", page.toString());
   queryParams.append("size", size.toString());

   const queryString = queryParams.toString();
   return `/api/income-entries${queryString ? `?${queryString}` : ""}`;
}

export function buildTotalIncomeEntriesPath(params: SearchIncomesParams = {}): string {
   const {
      familyId = "",
      startDate = "",
      endDate = "",
      familyMemberId = "",
   } = params;

   const queryParams = new URLSearchParams();

   if (familyId) queryParams.append("familyId", familyId);
   if (startDate) queryParams.append("startDate", startDate);
   if (endDate) queryParams.append("endDate", endDate);
   if (familyMemberId) queryParams.append("familyMemberId", familyMemberId);

   const queryString = queryParams.toString();
   return `/api/income-entries/total${queryString ? `?${queryString}` : ""}`;
}

export async function searchIncomes(params: SearchIncomesParams = {}): Promise<SearchIncomesResponse> {
   return fetchJson<SearchIncomesResponse>(buildIncomesSearchPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

export async function createIncome(payload: SaveIncomePayload): Promise<Income> {
   return fetchJson<Income>("/api/income-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

export async function updateIncome(incomeId: string, payload: SaveIncomePayload): Promise<Income> {
   return fetchJson<Income>(`/api/income-entries/${incomeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

export async function deleteIncome(incomeId: string): Promise<void> {
   await fetchJson(`/api/income-entries/${incomeId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
   });
}
