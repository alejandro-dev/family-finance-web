import { Income, IncomeRule } from "@/features/incomes/types/incomes";

export type RawIncome = Partial<Income> & {
   familyMember?: { id?: string; name?: string } | null;
   category?: { id?: string; name?: string } | null;
};

export type RawIncomeRule = Partial<IncomeRule> & {
   familyMember?: { id?: string; name?: string } | null;
   category?: { id?: string; name?: string } | null;
};

const normalizeDate = (value?: string | null): string => {
   if (!value) return "";
   if (value.includes("T")) return value.split("T")[0];
   return value;
};

// Normaliza los datos de las filas de ingresos por si faltan campos.
export const normalizeIncomesRows = (rows: RawIncome[]): Income[] =>
   rows.map((row) => ({
      id: row.id ?? "",
      description: row.description ?? "",
      amount: Number(row.amount ?? 0),
      date: normalizeDate(row.date),
      familyMemberId: row.familyMemberId ?? row.familyMember?.id ?? "",
      familyMemberName: row.familyMemberName ?? row.familyMember?.name ?? "-",
      categoryId: row.categoryId ?? row.category?.id ?? "",
      categoryName: row.categoryName ?? row.category?.name ?? "Uncategorized",
      sourceType: row.sourceType,
      periodYearMonth: row.periodYearMonth,
      isActive: row.isActive,
   }));

   // Normaliza los datos de las filas de reglas por si faltan campos.
export const normalizeIncomeRulesRows = (rows: RawIncomeRule[]): IncomeRule[] =>
   rows.map((row) => ({
      id: row.id ?? "",
      description: row.description ?? "",
      amount: Number(row.amount ?? 0),
      date: normalizeDate(row.date),
      familyMemberId: row.familyMemberId ?? row.familyMember?.id ?? "",
      familyMemberName: row.familyMemberName ?? row.familyMember?.name ?? "-",
      categoryId: row.categoryId ?? row.category?.id,
      categoryName: row.categoryName ?? row.category?.name ?? "Uncategorized",
      isActive: Boolean(row.isActive),
   }));
