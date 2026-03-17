import { Expense, PaginatedResponse } from "@/features/users/types/userAnalytics";

// Payload tolerante para mapear respuestas del backend con campos opcionales.
export type RawExpense = Expense & {
   createdAt?: string | null;
   categoryName?: string | null;
   categoryId?: string | null;
   name?: string | null;
   familyMemberId?: string | null;
};

// La UI usa páginas 1-based y el backend 0-based.
export const toBackendPage = (page?: number, fallback = 1) =>
   Math.max(0, (page ?? fallback) - 1);

export const normalizeUiPage = (backendPage?: number) => (backendPage ?? 0) + 1;

// "all" o vacío se traduce a sin filtro.
export const normalizeFilter = (value?: string) => {
   if (!value || value === "all") return "";
   return value;
};

// Garantiza que la tabla reciba siempre una estructura paginada consistente.
export const normalizePaginated = <T,>(
   data: PaginatedResponse<T>,
   fallbackSize = 10
): PaginatedResponse<T> => ({
   ...data,
   content: data.content ?? [],
   totalElements: data.totalElements ?? 0,
   number: data.number ?? 1,
   size: data.size ?? fallbackSize,
   totalPages: Math.max(1, data.totalPages ?? 1),
});

// Acepta fecha simple o timestamp ISO.
const normalizeExpenseDate = (row: RawExpense): string => {
   const rawDate = row.date ?? row.createdAt ?? "";
   if (!rawDate) return "";
   if (rawDate.includes("T")) return rawDate.split("T")[0];
   return rawDate;
};

// Homologamos filas crudas para que la UI no dependa del formato exacto del backend.
export const normalizeExpensesRows = (rows: RawExpense[]): Expense[] =>
   rows.map((row) => ({
      ...row,
      id: row.id ?? "",
      description: row.description ?? "",
      amount: Number(row.amount ?? 0),
      familyMemberId: row.familyMemberId ?? "",
      categoryId: row.categoryId ?? "",
      categoryName: row.categoryName ?? "Uncategorized",
      familyMemberName: row.familyMemberName ?? "-",
      date: normalizeExpenseDate(row),
   }));
