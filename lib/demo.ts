import type { Expense, CategoryOption } from "@/features/users/types/userAnalytics";
import type { Income, IncomeRule } from "@/features/incomes/types/incomes";
import type { Category } from "@/types/Category";
import type { FamilyMember } from "@/types/FamilyMember";
import type { PaginatedResponse } from "@/types/pagination";
import type { User } from "@/types/User";
import { ErrorCode } from "@/services/errors/ErrorCode";
import type { SearchTotalExpensesResponse } from "@/services/expensesService";
import type { SearchTotalIncomeEntriesResponse } from "@/services/incomesService";
import type { PredictionItem } from "@/services/predictionService";

const DAY_MS = 24 * 60 * 60 * 1000;

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
export const DEMO_READ_ONLY_MESSAGE =
   "Demo mode is read-only. Changes are simulated and are not persisted.";
export const DEMO_AUTH_TOKEN = "demo-session";

export const demoUser: User = {
   id: "user-demo-owner",
   username: "Alex Portfolio",
   email: "alex@demo.familyfinance.app",
   familyId: "family-demo",
   familyMemberId: "member-alex",
   isAdmin: false,
   isOwnerUser: true,
   enable: true,
};

const demoCategories: Category[] = [
   { id: "cat-housing", name: "Housing" },
   { id: "cat-groceries", name: "Groceries" },
   { id: "cat-education", name: "Education" },
   { id: "cat-transport", name: "Transport" },
   { id: "cat-leisure", name: "Leisure" },
   { id: "cat-health", name: "Health" },
   { id: "cat-salary", name: "Salary" },
   { id: "cat-freelance", name: "Freelance" },
];

const demoFamilyMembers: FamilyMember[] = [
   {
      id: "member-alex",
      name: "Alex",
      birthDate: "1988-05-14",
      email: "alex@demo.familyfinance.app",
      userId: "user-demo-owner",
      familyId: "family-demo",
      isEnabled: true,
      isOwner: true,
   },
   {
      id: "member-sam",
      name: "Sam",
      birthDate: "1990-09-21",
      email: "sam@demo.familyfinance.app",
      userId: "user-demo-partner",
      familyId: "family-demo",
      isEnabled: true,
      isOwner: false,
   },
   {
      id: "member-mia",
      name: "Mia",
      birthDate: "2016-02-11",
      familyId: "family-demo",
      isEnabled: true,
      isOwner: false,
   },
];

const demoUsers: User[] = [
   demoUser,
   {
      id: "user-demo-partner",
      username: "Sam Portfolio",
      email: "sam@demo.familyfinance.app",
      familyId: "family-demo",
      familyMemberId: "member-sam",
      isAdmin: false,
      isOwnerUser: false,
      enable: true,
   },
];

function addDays(base: Date, days: number) {
   return new Date(base.getTime() + days * DAY_MS);
}

function addMonths(base: Date, months: number) {
   return new Date(base.getFullYear(), base.getMonth() + months, 1);
}

function toDateInput(value: Date) {
   const year = value.getFullYear();
   const month = String(value.getMonth() + 1).padStart(2, "0");
   const day = String(value.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}

function toYearMonth(value: Date) {
   const year = value.getFullYear();
   const month = String(value.getMonth() + 1).padStart(2, "0");
   return `${year}-${month}`;
}

function startOfCurrentMonth() {
   const now = new Date();
   return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getCategoryName(categoryId: string) {
   return demoCategories.find((category) => category.id === categoryId)?.name ?? "Uncategorized";
}

function getFamilyMemberName(familyMemberId: string) {
   return demoFamilyMembers.find((member) => member.id === familyMemberId)?.name ?? "-";
}

function buildDemoExpenses(): Expense[] {
   const month0 = startOfCurrentMonth();
   const month1 = addMonths(month0, -1);
   const month2 = addMonths(month0, -2);

   const rows: Expense[] = [
      {
         id: "exp-001",
         date: toDateInput(addDays(month0, 2)),
         description: "Rent",
         amount: 1240,
         categoryId: "cat-housing",
         categoryName: getCategoryName("cat-housing"),
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         isRecurring: true,
      },
      {
         id: "exp-002",
         date: toDateInput(addDays(month0, 4)),
         description: "Supermarket weekly shop",
         amount: 132.4,
         categoryId: "cat-groceries",
         categoryName: getCategoryName("cat-groceries"),
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         isRecurring: false,
      },
      {
         id: "exp-003",
         date: toDateInput(addDays(month0, 8)),
         description: "After-school activities",
         amount: 74,
         categoryId: "cat-education",
         categoryName: getCategoryName("cat-education"),
         familyMemberId: "member-mia",
         familyMemberName: getFamilyMemberName("member-mia"),
         isRecurring: false,
      },
      {
         id: "exp-004",
         date: toDateInput(addDays(month0, 11)),
         description: "Fuel",
         amount: 58.6,
         categoryId: "cat-transport",
         categoryName: getCategoryName("cat-transport"),
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         isRecurring: false,
      },
      {
         id: "exp-005",
         date: toDateInput(addDays(month1, 1)),
         description: "Electricity bill",
         amount: 93.5,
         categoryId: "cat-housing",
         categoryName: getCategoryName("cat-housing"),
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         isRecurring: true,
      },
      {
         id: "exp-006",
         date: toDateInput(addDays(month1, 6)),
         description: "Pediatric check-up",
         amount: 48,
         categoryId: "cat-health",
         categoryName: getCategoryName("cat-health"),
         familyMemberId: "member-mia",
         familyMemberName: getFamilyMemberName("member-mia"),
         isRecurring: false,
      },
      {
         id: "exp-007",
         date: toDateInput(addDays(month1, 9)),
         description: "Cinema night",
         amount: 39.9,
         categoryId: "cat-leisure",
         categoryName: getCategoryName("cat-leisure"),
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         isRecurring: false,
      },
      {
         id: "exp-008",
         date: toDateInput(addDays(month1, 13)),
         description: "Groceries bulk purchase",
         amount: 169.2,
         categoryId: "cat-groceries",
         categoryName: getCategoryName("cat-groceries"),
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         isRecurring: false,
      },
      {
         id: "exp-009",
         date: toDateInput(addDays(month2, 3)),
         description: "School supplies",
         amount: 81.75,
         categoryId: "cat-education",
         categoryName: getCategoryName("cat-education"),
         familyMemberId: "member-mia",
         familyMemberName: getFamilyMemberName("member-mia"),
         isRecurring: false,
      },
      {
         id: "exp-010",
         date: toDateInput(addDays(month2, 7)),
         description: "Train card top-up",
         amount: 44,
         categoryId: "cat-transport",
         categoryName: getCategoryName("cat-transport"),
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         isRecurring: false,
      },
      {
         id: "exp-011",
         date: toDateInput(addDays(month2, 10)),
         description: "Weekend family outing",
         amount: 96.5,
         categoryId: "cat-leisure",
         categoryName: getCategoryName("cat-leisure"),
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         isRecurring: false,
      },
      {
         id: "exp-012",
         date: toDateInput(addDays(month2, 16)),
         description: "Pharmacy essentials",
         amount: 27.9,
         categoryId: "cat-health",
         categoryName: getCategoryName("cat-health"),
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         isRecurring: false,
      },
   ];

   return rows.sort((a, b) => b.date.localeCompare(a.date));
}

function buildDemoIncomes(): Income[] {
   const month0 = startOfCurrentMonth();
   const month1 = addMonths(month0, -1);
   const month2 = addMonths(month0, -2);

   const rows: Income[] = [
      {
         id: "inc-001",
         date: toDateInput(addDays(month0, 0)),
         description: "Product salary",
         amount: 3250,
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         sourceType: "RECURRING_GENERATED",
         periodYearMonth: toYearMonth(month0),
         isActive: true,
      },
      {
         id: "inc-002",
         date: toDateInput(addDays(month0, 2)),
         description: "Operations salary",
         amount: 2140,
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         sourceType: "RECURRING_GENERATED",
         periodYearMonth: toYearMonth(month0),
         isActive: true,
      },
      {
         id: "inc-003",
         date: toDateInput(addDays(month1, 0)),
         description: "Product salary",
         amount: 3250,
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         sourceType: "RECURRING_GENERATED",
         periodYearMonth: toYearMonth(month1),
         isActive: true,
      },
      {
         id: "inc-004",
         date: toDateInput(addDays(month1, 2)),
         description: "Operations salary",
         amount: 2140,
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         sourceType: "RECURRING_GENERATED",
         periodYearMonth: toYearMonth(month1),
         isActive: true,
      },
      {
         id: "inc-005",
         date: toDateInput(addDays(month2, 0)),
         description: "Product salary",
         amount: 3200,
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         sourceType: "RECURRING_GENERATED",
         periodYearMonth: toYearMonth(month2),
         isActive: true,
      },
      {
         id: "inc-006",
         date: toDateInput(addDays(month2, 5)),
         description: "Freelance landing page",
         amount: 780,
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         categoryId: "cat-freelance",
         categoryName: getCategoryName("cat-freelance"),
         sourceType: "MANUAL",
         periodYearMonth: toYearMonth(month2),
         isActive: true,
      },
   ];

   return rows.sort((a, b) => b.date.localeCompare(a.date));
}

function buildDemoIncomeRules(): IncomeRule[] {
   const month0 = startOfCurrentMonth();

   return [
      {
         id: "rule-001",
         description: "Monthly salary Alex",
         amount: 3250,
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         date: toDateInput(month0),
         isActive: true,
      },
      {
         id: "rule-002",
         description: "Monthly salary Sam",
         amount: 2140,
         familyMemberId: "member-sam",
         familyMemberName: getFamilyMemberName("member-sam"),
         categoryId: "cat-salary",
         categoryName: getCategoryName("cat-salary"),
         date: toDateInput(month0),
         isActive: true,
      },
      {
         id: "rule-003",
         description: "Freelance retainer",
         amount: 450,
         familyMemberId: "member-alex",
         familyMemberName: getFamilyMemberName("member-alex"),
         categoryId: "cat-freelance",
         categoryName: getCategoryName("cat-freelance"),
         date: toDateInput(addDays(month0, 10)),
         isActive: true,
      },
   ];
}

function buildDemoPredictions(): PredictionItem[] {
   const firstPredictionMonth = addMonths(startOfCurrentMonth(), 1);

   return Array.from({ length: 12 }, (_, index) => {
      const date = addMonths(firstPredictionMonth, index);
      const predictedIncome = 5600 + index * 35;
      const predictedExpenses = 1780 + ((index + 1) % 4) * 85;
      return {
         date: toYearMonth(date),
         predictedIncome,
         predictedExpenses,
         predictedBalance: predictedIncome - predictedExpenses,
      };
   });
}

type DemoExpenseFilters = {
   userId?: string;
   familyId?: string;
   startDate?: string;
   endDate?: string;
   categoryId?: string;
   familyMemberId?: string;
};

type DemoIncomeFilters = {
   familyId?: string;
   startDate?: string;
   endDate?: string;
   familyMemberId?: string;
};

function withinDateRange(date: string, startDate?: string, endDate?: string) {
   if (startDate && date < startDate) return false;
   if (endDate && date > endDate) return false;
   return true;
}

function paginate<T>(items: T[], page = 0, size = 10): PaginatedResponse<T> {
   const safePage = Number.isFinite(page) && page >= 0 ? Math.floor(page) : 0;
   const safeSize = Number.isFinite(size) && size > 0 ? Math.floor(size) : 10;
   const startIndex = safePage * safeSize;
   const content = items.slice(startIndex, startIndex + safeSize);
   const totalElements = items.length;
   const totalPages = Math.max(1, Math.ceil(totalElements / safeSize));

   return {
      content,
      totalElements,
      totalPages,
      number: safePage,
      size: safeSize,
   };
}

function buildCategoryTotals(rows: Array<{ categoryId: string; amount: number }>) {
   const totals = new Map<string, number>();

   rows.forEach((row) => {
      totals.set(row.categoryId, (totals.get(row.categoryId) ?? 0) + Number(row.amount ?? 0));
   });

   return Array.from(totals.entries())
      .map(([categoryId, total]) => ({
         categoryName: getCategoryName(categoryId),
         total: Number(total.toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total);
}

export function getDemoCategoryOptions(): CategoryOption[] {
   return demoCategories.map((category) => ({
      id: String(category.id),
      name: category.name,
   }));
}

export function getDemoFamilyMembers() {
   return [...demoFamilyMembers];
}

export function getDemoUsers() {
   return [...demoUsers];
}

export function getDemoExpenses(filters: DemoExpenseFilters = {}) {
   return buildDemoExpenses().filter((expense) => {
      if (filters.familyId && filters.familyId !== demoUser.familyId) return false;
      if (filters.categoryId && expense.categoryId !== filters.categoryId) return false;
      if (filters.familyMemberId && expense.familyMemberId !== filters.familyMemberId) return false;
      return withinDateRange(expense.date, filters.startDate, filters.endDate);
   });
}

export function getDemoExpenseSearch(params: DemoExpenseFilters & { page?: number; size?: number } = {}) {
   return paginate(getDemoExpenses(params), params.page, params.size);
}

export function getDemoExpenseTotals(filters: DemoExpenseFilters = {}): SearchTotalExpensesResponse {
   const rows = getDemoExpenses(filters);
   const totalGlobal = rows.reduce((sum, row) => sum + row.amount, 0);

   return {
      totalGlobal: Number(totalGlobal.toFixed(2)),
      categories: buildCategoryTotals(rows),
   };
}

export function getDemoIncomes(filters: DemoIncomeFilters = {}) {
   return buildDemoIncomes().filter((income) => {
      if (filters.familyId && filters.familyId !== demoUser.familyId) return false;
      if (filters.familyMemberId && income.familyMemberId !== filters.familyMemberId) return false;
      return withinDateRange(income.date, filters.startDate, filters.endDate);
   });
}

export function getDemoIncomeSearch(params: DemoIncomeFilters & { page?: number; size?: number } = {}) {
   return paginate(getDemoIncomes(params), params.page, params.size);
}

export function getDemoIncomeTotals(filters: DemoIncomeFilters = {}): SearchTotalIncomeEntriesResponse {
   const rows = getDemoIncomes(filters);
   const totalGlobal = rows.reduce((sum, row) => sum + row.amount, 0);

   return {
      totalGlobal: Number(totalGlobal.toFixed(2)),
      categories: buildCategoryTotals(rows),
   };
}

export function getDemoIncomeRulesSearch(params: {
   familyId?: string;
   familyMemberId?: string;
   page?: number;
   size?: number;
} = {}) {
   const rows = buildDemoIncomeRules().filter((rule) => {
      if (params.familyId && params.familyId !== demoUser.familyId) return false;
      if (params.familyMemberId && rule.familyMemberId !== params.familyMemberId) return false;
      return true;
   });

   return paginate(rows, params.page, params.size);
}

export function getDemoFamilyMembersSearch(params: {
   familyId?: string;
   enabled?: boolean;
   page?: number;
   size?: number;
} = {}) {
   const rows = getDemoFamilyMembers().filter((member) => {
      if (params.familyId && params.familyId !== demoUser.familyId) return false;
      if (params.enabled !== undefined && member.isEnabled !== params.enabled) return false;
      return true;
   });

   return paginate(rows, params.page, params.size);
}

export function getDemoFamilyMemberById(id: string) {
   const member = demoFamilyMembers.find((item) => item.id === id);
   if (!member) {
      throw new ErrorCode("Family member not found", 404);
   }
   return member;
}

export function getDemoCategoriesSearch(params: {
   search?: string;
   page?: number;
   size?: number;
} = {}) {
   const search = params.search?.trim().toLowerCase();
   const rows = demoCategories.filter((category) =>
      search ? category.name.toLowerCase().includes(search) : true,
   );

   return paginate(rows, params.page, params.size);
}

export function getDemoUsersSearch(params: {
   search?: string;
   page?: number;
   size?: number;
} = {}) {
   const search = params.search?.trim().toLowerCase();
   const rows = demoUsers.filter((user) =>
      search
         ? user.username.toLowerCase().includes(search) ||
           user.email.toLowerCase().includes(search)
         : true,
   );

   return paginate(rows, params.page, params.size);
}

export function getDemoUserById(id: string) {
   const user = demoUsers.find((item) => item.id === id);
   if (!user) {
      throw new ErrorCode("User not found", 404);
   }
   return user;
}

export function getDemoPredictions(params: {
   familyMemberId?: string;
   categoryId?: string;
} = {}) {
   const multiplier = params.familyMemberId ? 0.55 : 1;
   const categoryPenalty = params.categoryId === "cat-housing" ? 140 : 0;

   return buildDemoPredictions().map((item) => {
      const predictedIncome = Number((item.predictedIncome * multiplier).toFixed(2));
      const predictedExpenses = Number(
         ((item.predictedExpenses - categoryPenalty) * multiplier).toFixed(2),
      );
      return {
         ...item,
         predictedIncome,
         predictedExpenses,
         predictedBalance: Number((predictedIncome - predictedExpenses).toFixed(2)),
      };
   });
}

function parseJsonBody(body?: BodyInit | null) {
   if (!body || typeof body !== "string") return {};

   try {
      return JSON.parse(body);
   } catch {
      return {};
   }
}

function normalizeBackendPath(path: string) {
   const url = path.startsWith("http")
      ? new URL(path)
      : new URL(path, "https://demo.familyfinance.local");
   const pathname = url.pathname.replace(/^\/api/, "") || "/";
   return { pathname, searchParams: url.searchParams };
}

function createDemoEntity<T extends Record<string, unknown>>(
   prefix: string,
   payload: T,
   extra: Record<string, unknown> = {},
) {
   return {
      id: `${prefix}-${Date.now()}`,
      ...payload,
      ...extra,
      demo: true,
      message: DEMO_READ_ONLY_MESSAGE,
   };
}

export async function demoBackendFetch<T>(path: string, options?: RequestInit): Promise<T> {
   const method = (options?.method ?? "GET").toUpperCase();
   const body = parseJsonBody(options?.body);
   const { pathname, searchParams } = normalizeBackendPath(path);

   if (pathname === "/auth/me" && method === "GET") {
      return demoUser as T;
   }

   if (pathname === "/predictions" && method === "GET") {
      return getDemoPredictions({
         familyMemberId: searchParams.get("familyMemberId") ?? "",
         categoryId: searchParams.get("categoryId") ?? "",
      }) as T;
   }

   if (pathname === "/expenses" && method === "GET") {
      return getDemoExpenseSearch({
         userId: searchParams.get("userId") ?? "",
         familyId: searchParams.get("familyId") ?? "",
         startDate: searchParams.get("startDate") ?? "",
         endDate: searchParams.get("endDate") ?? "",
         categoryId: searchParams.get("categoryId") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
         page: Number(searchParams.get("page") ?? "0"),
         size: Number(searchParams.get("size") ?? "10"),
      }) as T;
   }

   if (pathname === "/expenses/total" && method === "GET") {
      return getDemoExpenseTotals({
         familyId: searchParams.get("familyId") ?? "",
         startDate: searchParams.get("startDate") ?? "",
         endDate: searchParams.get("endDate") ?? "",
         categoryId: searchParams.get("categoryId") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
      }) as T;
   }

   if (pathname === "/expenses" && method === "POST") {
      const payload = body as Partial<Expense>;
      return createDemoEntity("expense", payload, {
         categoryName: getCategoryName(String(payload.categoryId ?? "")),
         familyMemberName: getFamilyMemberName(String(payload.familyMemberId ?? "")),
         isRecurring: Boolean(payload.isRecurring),
      }) as T;
   }

   if (pathname.startsWith("/expenses/") && method === "PUT") {
      const expenseId = pathname.split("/")[2];
      const payload = body as Partial<Expense>;
      return {
         id: expenseId,
         ...payload,
         categoryName: getCategoryName(String(payload.categoryId ?? "")),
         familyMemberName: getFamilyMemberName(String(payload.familyMemberId ?? "")),
         message: DEMO_READ_ONLY_MESSAGE,
      } as T;
   }

   if (pathname.startsWith("/expenses/") && method === "DELETE") {
      return { success: true, message: DEMO_READ_ONLY_MESSAGE } as T;
   }

   if (pathname === "/income-entries" && method === "GET") {
      return getDemoIncomeSearch({
         familyId: searchParams.get("familyId") ?? "",
         startDate: searchParams.get("startDate") ?? "",
         endDate: searchParams.get("endDate") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
         page: Number(searchParams.get("page") ?? "0"),
         size: Number(searchParams.get("size") ?? "10"),
      }) as T;
   }

   if (pathname === "/income-entries/total" && method === "GET") {
      return getDemoIncomeTotals({
         familyId: searchParams.get("familyId") ?? "",
         startDate: searchParams.get("startDate") ?? "",
         endDate: searchParams.get("endDate") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
      }) as T;
   }

   if (pathname === "/income-entries" && method === "POST") {
      const payload = body as Partial<Income>;
      return createDemoEntity("income", payload, {
         categoryName: getCategoryName(String(payload.categoryId ?? "")),
         familyMemberName: getFamilyMemberName(String(payload.familyMemberId ?? "")),
      }) as T;
   }

   if (pathname.startsWith("/income-entries/") && method === "PUT") {
      const incomeId = pathname.split("/")[2];
      const payload = body as Partial<Income>;
      return {
         id: incomeId,
         ...payload,
         categoryName: getCategoryName(String(payload.categoryId ?? "")),
         familyMemberName: getFamilyMemberName(String(payload.familyMemberId ?? "")),
         message: DEMO_READ_ONLY_MESSAGE,
      } as T;
   }

   if (pathname.startsWith("/income-entries/") && method === "DELETE") {
      return { success: true, message: DEMO_READ_ONLY_MESSAGE } as T;
   }

   if (pathname === "/income-rules" && method === "GET") {
      return getDemoIncomeRulesSearch({
         familyId: searchParams.get("familyId") ?? "",
         familyMemberId: searchParams.get("familyMemberId") ?? "",
         page: Number(searchParams.get("page") ?? "0"),
         size: Number(searchParams.get("size") ?? "10"),
      }) as T;
   }

   if (pathname === "/income-rules" && method === "POST") {
      const payload = body as Partial<IncomeRule>;
      return createDemoEntity("income-rule", payload, {
         categoryName: getCategoryName(String(payload.categoryId ?? "")),
         familyMemberName: getFamilyMemberName(String(payload.familyMemberId ?? "")),
         isActive: payload.isActive ?? true,
      }) as T;
   }

   if (pathname.startsWith("/income-rules/") && method === "PUT") {
      const ruleId = pathname.split("/")[2];
      const payload = body as Partial<IncomeRule>;
      return {
         id: ruleId,
         ...payload,
         categoryName: getCategoryName(String(payload.categoryId ?? "")),
         familyMemberName: getFamilyMemberName(String(payload.familyMemberId ?? "")),
         message: DEMO_READ_ONLY_MESSAGE,
      } as T;
   }

   if (pathname.startsWith("/income-rules/") && method === "DELETE") {
      return { success: true, message: DEMO_READ_ONLY_MESSAGE } as T;
   }

   if (pathname === "/family-members" && method === "GET") {
      return getDemoFamilyMembersSearch({
         familyId: searchParams.get("familyId") ?? "",
         enabled:
            searchParams.get("enabled") === null
               ? undefined
               : searchParams.get("enabled") === "true",
         page: Number(searchParams.get("page") ?? "0"),
         size: Number(searchParams.get("size") ?? "10"),
      }) as T;
   }

   if (pathname === "/family-members" && method === "POST") {
      const payload = body as Partial<FamilyMember>;
      return createDemoEntity("family-member", payload, {
         familyId: demoUser.familyId,
         isEnabled: payload.isEnabled ?? true,
         isOwner: false,
      }) as T;
   }

   if (pathname.startsWith("/family-members/") && method === "GET") {
      const memberId = pathname.split("/")[2];
      return getDemoFamilyMemberById(memberId) as T;
   }

   if (pathname.startsWith("/family-members/") && method === "PUT") {
      const memberId = pathname.split("/")[2];
      const payload = body as Partial<FamilyMember>;
      return {
         ...getDemoFamilyMemberById(memberId),
         ...payload,
         message: DEMO_READ_ONLY_MESSAGE,
      } as T;
   }

   if (pathname === "/family-member-invitations/invitation" && method === "POST") {
      return {
         success: true,
         email: String((body as { email?: string }).email ?? ""),
         message: "Demo mode: invitation simulated successfully.",
      } as T;
   }

   if (pathname === "/family-member-invitations/register" && method === "POST") {
      return {
         success: true,
         message: "Demo mode: family member registration simulated successfully.",
      } as T;
   }

   if (pathname === "/categories" && method === "GET") {
      return getDemoCategoriesSearch({
         search: searchParams.get("search") ?? "",
         page: Number(searchParams.get("page") ?? "0"),
         size: Number(searchParams.get("size") ?? "10"),
      }) as T;
   }

   if (pathname === "/categories" && method === "POST") {
      const payload = body as Partial<Category>;
      return createDemoEntity("category", payload) as T;
   }

   if (pathname.startsWith("/categories/") && method === "PUT") {
      const categoryId = pathname.split("/")[2];
      return {
         id: categoryId,
         ...(body as Partial<Category>),
         message: DEMO_READ_ONLY_MESSAGE,
      } as T;
   }

   if (pathname.startsWith("/categories/") && method === "DELETE") {
      return { success: true, message: DEMO_READ_ONLY_MESSAGE } as T;
   }

   if (pathname === "/users" && method === "GET") {
      return getDemoUsersSearch({
         search: searchParams.get("search") ?? "",
         page: Number(searchParams.get("page") ?? "0"),
         size: Number(searchParams.get("size") ?? "10"),
      }) as T;
   }

   if (pathname === "/users" && method === "POST") {
      const payload = body as Partial<User>;
      return createDemoEntity("user", payload, {
         familyId: demoUser.familyId,
         enable: payload.enable ?? true,
      }) as T;
   }

   if (pathname.startsWith("/users/") && method === "GET") {
      const userId = pathname.split("/")[2];
      return getDemoUserById(userId) as T;
   }

   if (pathname.startsWith("/users/") && method === "PUT") {
      const userId = pathname.split("/")[2];
      return {
         ...getDemoUserById(userId),
         ...(body as Partial<User>),
         message: DEMO_READ_ONLY_MESSAGE,
      } as T;
   }

   if (pathname.startsWith("/users/") && method === "DELETE") {
      return { success: true, message: DEMO_READ_ONLY_MESSAGE } as T;
   }

   if (pathname === "/users/change-password" && method === "POST") {
      return {
         success: true,
         message: "Demo mode: password change simulated successfully.",
      } as T;
   }

   if (pathname === "/reset-password" && method === "POST") {
      return {
         success: true,
         message: "Demo mode: password reset email simulated successfully.",
      } as T;
   }

   if (pathname === "/reset-password" && method === "PUT") {
      return {
         success: true,
         message: "Demo mode: password reset simulated successfully.",
      } as T;
   }

   throw new ErrorCode(`Unsupported demo backend path: ${pathname}`, 501);
}
