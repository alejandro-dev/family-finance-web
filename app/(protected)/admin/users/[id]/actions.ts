"use server";

import { backendFetch } from "@/services/backend";
import {
   buildFamilyMembersSearchPath,
   SearchFamilyMembersResponse,
} from "@/services/familyMembersService";
import {
   buildExpensesSearchPath,
   buildTotalExpensesPath,
   SearchExpensesResponse,
   SearchTotalExpensesResponse,
} from "@/services/expensesService";
import {
   CategoryOption,
   ChartItem,
   Expense,
   PaginatedResponse,
   UserAnalyticsFilters,
   UserAnalyticsInitialData,
   UserAnalyticsQuery,
} from "@/features/users/types/userAnalytics";
import {
   normalizeExpensesRows,
   normalizeFilter,
   normalizePaginated,
   normalizeUiPage,
   RawExpense,
   toBackendPage,
} from "@/features/expenses/lib/expensesMappers";
import { FamilyMember } from "@/types/FamilyMember";
import { User } from "@/types/User";
import { getCategoryOptions } from "@/services/categoryOptionsService";

const DEFAULT_EXPENSES_PAGE = 1;
const DEFAULT_EXPENSES_SIZE = 10;
const DEFAULT_FAMILY_PAGE = 1;
const DEFAULT_FAMILY_SIZE = 10;

// Fallback de chart si backend no devuelve agregado por categoría.
const buildChartFromExpenses = (rows: Expense[]): ChartItem[] => {
   const accumulator = rows.reduce<Record<string, number>>((acc, expense) => {
      const key = expense.categoryName || "Uncategorized";
      acc[key] = (acc[key] ?? 0) + expense.amount;
      return acc;
   }, {});

   return Object.entries(accumulator).map(([label, total]) => ({ label, total }));
};

// Fallback de categorías si backend no devuelve catálogo.
const buildCategoryOptions = (rows: Expense[]): CategoryOption[] => {
   const map = rows.reduce<Record<string, string>>((acc, item) => {
      if (item.categoryId) acc[item.categoryId] = item.categoryName || "Uncategorized";
      return acc;
   }, {});

   return Object.entries(map).map(([id, name]) => ({ id, name }));
};

const mapChartLabelsToCategoryName = (
   chart: ChartItem[],
   rows: Expense[],
   categoryOptions: CategoryOption[]
): ChartItem[] => {
   const categoryNameById = rows.reduce<Record<string, string>>((acc, row) => {
      if (row.categoryId) acc[row.categoryId] = row.categoryName || "Uncategorized";
      return acc;
   }, {});

   categoryOptions.forEach((option) => {
      categoryNameById[option.id] = option.name;
   });

   return chart.map((item) => ({
      ...item,
      label: categoryNameById[item.label] ?? item.label,
   }));
};

// Builders internos para mantener en un solo punto la traducción de query -> path backend.
const buildExpensesPath = (query: UserAnalyticsQuery, page: number, size: number) =>
   buildExpensesSearchPath({
      familyId: query.familyId!,
      startDate: normalizeFilter(query.startDate),
      endDate: normalizeFilter(query.endDate),
      categoryId: normalizeFilter(query.categoryId),
      familyMemberId: normalizeFilter(query.familyMemberId),
      page: toBackendPage(page, DEFAULT_EXPENSES_PAGE),
      size,
   }).replace("/api", "");

const buildFamilyPath = (familyId: string, page: number, size: number) =>
   buildFamilyMembersSearchPath({
      familyId,
      page: toBackendPage(page, DEFAULT_FAMILY_PAGE),
      size,
   }).replace("/api", "");

// Obtiene metadata confiable del usuario desde backend.
export async function getUserAnalyticsUserMetaAction(userId: string): Promise<{
   username: string;
   email: string;
   familyId: string;
   familyMemberId: string;
   isAdmin: boolean;
   isOwner: boolean;
   isEnabled: boolean;
}> {
   const user = await backendFetch<User>(`/users/${userId}`);

   return {
      username: user.username,
      email: user.email,
      familyId: user.familyId ?? "",
      familyMemberId: user.familyMemberId ?? "",
      isAdmin: Boolean(user.isAdmin),
      isOwner: Boolean(user.isOwnerUser),
      isEnabled: Boolean(user.enable),
   };
}

// Action para consultar gastos paginados con agregados de resumen y chart.
export async function searchUserExpensesAction(query: UserAnalyticsQuery): Promise<{
   summary: { totalAmount: number };
   chart: ChartItem[];
   expenses: PaginatedResponse<Expense>;
   filtersMeta: { categoryOptions: CategoryOption[] };
}> {
   // Numérico de página y tamaño de página para backend.
   const expensesPage = query.expensesPage ?? DEFAULT_EXPENSES_PAGE;
   const expensesSize = query.expensesSize ?? DEFAULT_EXPENSES_SIZE;

   // Path de backend para consultar gastos.
   const path = buildExpensesPath(query, expensesPage, expensesSize);
   const totalPath = buildTotalExpensesPath({
      familyId: query.familyId!,
      startDate: normalizeFilter(query.startDate),
      endDate: normalizeFilter(query.endDate),
      categoryId: normalizeFilter(query.categoryId),
      familyMemberId: normalizeFilter(query.familyMemberId),
   }).replace("/api", "");

   // Lee gastos + agregados en paralelo para mantener tabla y resumen sincronizados.
   const [data, totalData] = await Promise.all([
      backendFetch<SearchExpensesResponse>(path),
      backendFetch<SearchTotalExpensesResponse>(totalPath),
   ]);

   // Si backend aún no trae agregados, calculamos aquí para no romper la UI.
   const safeContent = (data.content ?? []) as RawExpense[];
   const enrichedContent = normalizeExpensesRows(safeContent);
   const normalizedExpenses = normalizePaginated<Expense>({
      ...data,
      content: enrichedContent,
      number: normalizeUiPage(data.number),
   }, DEFAULT_EXPENSES_SIZE);

   const categoryOptions = buildCategoryOptions(enrichedContent);
   const totalAmount =
      typeof totalData?.totalGlobal === "number"
         ? totalData.totalGlobal
         : data.totalAmount ?? enrichedContent.reduce((acc, expense) => acc + expense.amount, 0);
   const chartFromTotals = (totalData?.categories ?? []).map((item) => ({
      label: item.categoryName,
      total: item.total,
   }));
   const chart = chartFromTotals.length > 0
      ? chartFromTotals
      : data.chart
         ? mapChartLabelsToCategoryName(data.chart, enrichedContent, categoryOptions)
         : buildChartFromExpenses(enrichedContent);

   return {
      summary: { totalAmount },
      chart,
      expenses: normalizedExpenses,
      filtersMeta: { categoryOptions },
   };
}

// Action para consultar miembros de familia paginados.
export async function searchFamilyMembersAction(query: UserAnalyticsQuery): Promise<{familyMembers: PaginatedResponse<FamilyMember>;}> {
   const familyId = query.familyId!;
   const familyPage = query.familyPage ?? DEFAULT_FAMILY_PAGE;
   const familySize = query.familySize ?? DEFAULT_FAMILY_SIZE;
   const path = buildFamilyPath(familyId, familyPage, familySize);

   // Lee miembros paginados (tabla de family members).
   const data = await backendFetch<SearchFamilyMembersResponse>(path);
   const normalizedFamilyMembers = normalizePaginated<FamilyMember>({
      ...data,
      number: normalizeUiPage(data.number),
   }, DEFAULT_FAMILY_SIZE);

   return {
      familyMembers: normalizedFamilyMembers,
   };
}

// Carga inicial SSR con gastos y miembros en paralelo.
export async function getUserAnalyticsInitialData(
   query: UserAnalyticsQuery
): Promise<UserAnalyticsInitialData> {
   // Para el select de "Miembro familiar" pedimos un bloque amplio independiente
   // de la tabla paginada de miembros.
   const memberOptionsSize = 100;

   const queryWithFamilyId: UserAnalyticsQuery = { ...query, familyId: query.familyId ?? "" };

   // Primera carga: resolvemos en paralelo para reducir tiempo total.
   const [expensesData, familyData, familyMembersOptionsData, categoriesCatalog] = await Promise.all([
      searchUserExpensesAction(queryWithFamilyId),
      searchFamilyMembersAction(queryWithFamilyId),
      backendFetch<SearchFamilyMembersResponse>(
         buildFamilyPath(query.familyId!, DEFAULT_FAMILY_PAGE, memberOptionsSize)
      ),
      getCategoryOptions(),
   ]);

   const familyMembersOptions = familyMembersOptionsData.content ?? [];

   // Estado inicial de filtros en formato esperado por el hook cliente.
   const filters: UserAnalyticsFilters = {
      startDate: query.startDate ?? "",
      endDate: query.endDate ?? "",
      categoryIdFilter: normalizeFilter(query.categoryId) || "all",
      familyMemberIdFilter: normalizeFilter(query.familyMemberId) || "all",
   };

   return {
      summary: expensesData.summary,
      chart: expensesData.chart,
      expenses: expensesData.expenses,
      familyMembers: familyData.familyMembers,
      filtersMeta: {
         categoryOptions: categoriesCatalog.length > 0
            ? categoriesCatalog
            : expensesData.filtersMeta.categoryOptions,
         familyMembersOptions,
      },
      filters,
   };
}
