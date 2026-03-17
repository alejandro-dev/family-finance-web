import { Expense, ChartItem } from "@/features/users/types/userAnalytics";
import { fetchJson } from "@/services/httpClient";
import { PaginatedResponse } from "@/types/pagination";

// Filtros y paginación esperados para consultar gastos.
export interface SearchExpensesParams {
   userId?: string;
   familyId?: string;
   startDate?: string;
   endDate?: string;
   categoryId?: string;
   familyMemberId?: string;
   page?: number;
   size?: number;
   isEnabled?: boolean;
}

// Respuesta esperada desde backend para listado paginado de gastos.
// Campos agregados son opcionales para permitir compatibilidad progresiva.
export interface SearchExpensesResponse extends PaginatedResponse<Expense> {
   totalAmount?: number;
   chart?: ChartItem[];
   categoryOptions?: string[];
}

// Payload esperado para crear/actualizar un gasto.
export interface SaveExpensePayload {
   description: string;
   amount: number;
   categoryId: string;
   familyMemberId: string;
   date: string;
   isRecurring: boolean;
}

// Respuesta esperada desde backend para el total de gastos.
export interface SearchTotalExpensesResponse {
   totalGlobal: number;
   categories: CategoryTotal[];
}

export interface CategoryTotal{
   total: number;
   categoryName: string;
}

// Construye la URL para listar/buscar gastos con filtros y paginación.
export function buildExpensesSearchPath(params: SearchExpensesParams = {}): string {
   const {
      userId = "",
      familyId = "",
      startDate = "",
      endDate = "",
      categoryId = "",
      familyMemberId = "",
      page = 0,
      size = 10,
      isEnabled,
   } = params;

   const queryParams = new URLSearchParams();

   // Solo enviamos filtros con valor para mantener query string limpia.
   if (userId) queryParams.append("userId", userId);
   if (familyId) queryParams.append("familyId", familyId);
   if (startDate) queryParams.append("startDate", startDate);
   if (endDate) queryParams.append("endDate", endDate);
   if (categoryId) queryParams.append("categoryId", categoryId);
   if (familyMemberId) queryParams.append("familyMemberId", familyMemberId);
   if (typeof isEnabled === "boolean") queryParams.append("isEnabled", String(isEnabled));

   queryParams.append("page", page.toString());
   queryParams.append("size", size.toString());

   const queryString = queryParams.toString();
   return `/api/expenses${queryString ? `?${queryString}` : ""}`;
}

// Función para construir la URL para el total de gastos.
export function buildTotalExpensesPath(params: SearchExpensesParams = {}): string {
   const {
      userId = "",
      familyId = "",
      startDate = "",
      endDate = "",
      categoryId = "",
      familyMemberId = "",
   } = params;

   const queryParams = new URLSearchParams();

   // Solo enviamos filtros con valor para mantener query string limpia.
   if (userId) queryParams.append("userId", userId);
   if (familyId) queryParams.append("familyId", familyId);
   if (startDate) queryParams.append("startDate", startDate);
   if (endDate) queryParams.append("endDate", endDate);
   if (categoryId) queryParams.append("categoryId", categoryId);
   if (familyMemberId) queryParams.append("familyMemberId", familyMemberId);

   const queryString = queryParams.toString();
   return `/api/expenses/total${queryString ? `?${queryString}` : ""}`;
}

// Búsqueda desde cliente contra /api/expenses (proxy interno de Next).
export async function searchExpenses(params: SearchExpensesParams = {}): Promise<SearchExpensesResponse> {
   return fetchJson<SearchExpensesResponse>(buildExpensesSearchPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}

// Función para crear un gasto.
export async function createExpense(payload: SaveExpensePayload): Promise<Expense> {
   return fetchJson<Expense>("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         ...payload
      }),
   });
}

// Función para actualizar un gasto.
export async function updateExpense(expenseId: string, payload: SaveExpensePayload): Promise<Expense> {
   return fetchJson<Expense>(`/api/expenses/${expenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         ...payload,
      }),
   });
}

// Función para eliminar un gasto.
export async function deleteExpense(expenseId: string): Promise<void> {
   await fetchJson<Expense>(`/api/expenses/${expenseId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
   });
}

// Función para obtener el total de gastos.
export async function getTotalExpenses(params: SearchExpensesParams): Promise<SearchTotalExpensesResponse> {
   return fetchJson<SearchTotalExpensesResponse>(buildTotalExpensesPath(params), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
   });
}
