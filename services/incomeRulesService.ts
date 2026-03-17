import { fetchJson } from "@/services/httpClient";
import { IncomeRule } from "@/features/incomes/types/incomes";
import { PaginatedResponse } from "@/types/pagination";

export interface SearchIncomeRulesParams {
   familyId?: string;
   familyMemberId?: string;
   page?: number;
   size?: number;
}

export interface SaveIncomeRulePayload {
   description: string;
   amount: number;
   familyMemberId: string;
   date: string;
   categoryId?: string;
   isActive: boolean;
}

export type SearchIncomeRulesResponse = PaginatedResponse<IncomeRule>;

export function buildIncomeRulesSearchPath(params: SearchIncomeRulesParams = {}): string {
   const {
      familyId = "",
      familyMemberId = "",
      page = 0,
      size = 10,
   } = params;

   const queryParams = new URLSearchParams();

   if (familyId) queryParams.append("familyId", familyId);
   if (familyMemberId) queryParams.append("familyMemberId", familyMemberId);
   queryParams.append("page", page.toString());
   queryParams.append("size", size.toString());

   const queryString = queryParams.toString();
   return `/api/income-rules${queryString ? `?${queryString}` : ""}`;
}

export async function searchIncomeRules(params: SearchIncomeRulesParams = {}): Promise<SearchIncomeRulesResponse> {
   return fetchJson<SearchIncomeRulesResponse>(buildIncomeRulesSearchPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

export async function createIncomeRule(payload: SaveIncomeRulePayload): Promise<IncomeRule> {
   return fetchJson<IncomeRule>("/api/income-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

export async function updateIncomeRule(ruleId: string, payload: SaveIncomeRulePayload): Promise<IncomeRule> {
   return fetchJson<IncomeRule>(`/api/income-rules/${ruleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
   });
}

export async function deleteIncomeRule(ruleId: string): Promise<void> {
   await fetchJson(`/api/income-rules/${ruleId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
   });
}
