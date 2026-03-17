import { Expense, PaginatedResponse } from "@/features/users/types/userAnalytics";

// Filtros funcionales de la pantalla de gastos del usuario.
export interface ExpensesFilters {
   startDate?: string;
   endDate?: string;
   categoryId?: string;
   familyMemberId?: string;
   isEnabled?: boolean;
}

// Paginación requerida por la tabla.
export interface ExpensesPagination {
   page: number;
   size: number;
}

// Query final que consumen las actions de la vista user.
export interface SearchMyExpensesQuery extends ExpensesFilters, ExpensesPagination {}

// Respuesta normalizada que consume la tabla.
export type SearchMyExpensesResponse = PaginatedResponse<Expense>;
