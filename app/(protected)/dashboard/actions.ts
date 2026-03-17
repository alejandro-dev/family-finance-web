"use server";

import { backendFetch } from "@/services/backend";
import { buildExpensesSearchPath, buildTotalExpensesPath, SearchExpensesResponse, SearchTotalExpensesResponse } from "@/services/expensesService";
import { buildTotalIncomeEntriesPath, SearchTotalIncomeEntriesResponse } from "@/services/incomesService";
import { FamilyMember } from "@/types/FamilyMember";
import { buildFamilyMembersSearchPath, SearchFamilyMembersResponse } from "@/services/familyMembersService";
import { normalizeExpensesRows } from "@/features/expenses/lib/expensesMappers";
import { CategoryOption, Expense } from "@/features/users/types/userAnalytics";
import { getCategoryOptions } from "@/services/categoryOptionsService";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { buildPredictionsPath, PredictionItem } from "@/services/predictionService";

// Interfaz para los datos de la página de dashboard de familia
export interface FamilyDashboardData {
   filters: {
      startDate: string;
      endDate: string;
      categoryId: string;
      familyMemberId: string;
      analyticsYear: number;
   };
   filterOptions: {
      categories: CategoryOption[];
      familyMembers: { id: string; name: string }[];
   };
   totalGlobal: number;
   totalCurrentMonth: number;
   totalIncomeGlobal: number;
   totalIncomeCurrentMonth: number;
   balanceGlobal: number;
   savingsRate: number;
   usesMockedIncomeData: boolean;
   averagePerMember: number;
   activeMembers: number;
   chartData: { label: string; total: number }[];
   topMembers: { id: string; name: string; total: number }[];
   recentExpenses: Expense[];
   monthlyAnalytics: { month: number; label: string; total: number }[];
   monthlyIncomeAnalytics: { month: number; label: string; total: number }[];
   monthlyComparison: {
      month: number;
      label: string;
      expenses: number;
      incomes: number;
   }[];
   predictions: {
      points: {
         date: string;
         label: string;
         predictedIncome: number;
         predictedExpenses: number;
         predictedBalance: number;
      }[];
      nextMonth: {
         predictedIncome: number;
         predictedExpenses: number;
         predictedBalance: number;
      } | null;
      nextTwelveMonths: {
         predictedIncome: number;
         predictedExpenses: number;
         predictedBalance: number;
      };
      errorMessage: string | null;
   };
}

// Función para convertir una fecha en formato de entrada de la API
const toDateInput = (value: Date) => {
   const year = value.getFullYear();
   const month = String(value.getMonth() + 1).padStart(2, "0");
   const day = String(value.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
};

// Función para normalizar un filtro de fecha
const normalizeFilter = (value?: string) => {
   if (!value || value === "all") return "";
   return value.trim();
};

// Función para normalizar un filtro de año
const normalizeYear = (value?: string) => {
   const parsed = Number(value);
   const currentYear = new Date().getFullYear();
   if (!Number.isInteger(parsed) || parsed < 2000 || parsed > currentYear + 1) {
      return currentYear;
   }
   return parsed;
};

// Función para obtener el rango de fechas actual
const getCurrentMonthRange = () => {
   const now = new Date();
   const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
   const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

   return { startDate: toDateInput(firstDay), endDate: toDateInput(lastDay) };
};

// Función para construir la URL de la API de totales de gastos
const buildBackendTotalPath = (params: {
   familyId: string;
   startDate?: string;
   endDate?: string;
   categoryId?: string;
   familyMemberId?: string;
}) =>
   buildTotalExpensesPath({
      familyId: params.familyId,
      startDate: params.startDate ?? "",
      endDate: params.endDate ?? "",
      categoryId: params.categoryId ?? "",
      familyMemberId: params.familyMemberId ?? "",
   }).replace("/api", "");

// Función para construir la URL de la API de totales de ingresos
const buildBackendIncomeTotalPath = (params: {
   familyId: string;
   startDate?: string;
   endDate?: string;
   familyMemberId?: string;
}) =>
   buildTotalIncomeEntriesPath({
      familyId: params.familyId,
      startDate: params.startDate ?? "",
      endDate: params.endDate ?? "",
      familyMemberId: params.familyMemberId ?? "",
   }).replace("/api", "");

// Función para construir la URL de la API de predicciones
const buildBackendPredictionsPath = (params: {
   familyMemberId?: string;
   categoryId?: string;
}) =>
   buildPredictionsPath({
      familyMemberId: params.familyMemberId ?? "",
      categoryId: params.categoryId ?? "",
   }).replace("/api", "");

// Función para obtener los datos de la página de dashboard de familia
export async function getFamilyDashboardData(
   familyId: string,
   filters?: {
      startDate?: string;
      endDate?: string;
      categoryId?: string;
      familyMemberId?: string;
      analyticsYear?: string;
   },
): Promise<FamilyDashboardData> {
   const safeFamilyId = familyId?.trim();
   const startDate = normalizeFilter(filters?.startDate);
   const endDate = normalizeFilter(filters?.endDate);
   const categoryId = normalizeFilter(filters?.categoryId);
   const familyMemberId = normalizeFilter(filters?.familyMemberId);
   const analyticsYear = normalizeYear(filters?.analyticsYear);

   // Si el ID de la familia no es válido, devolvemos un objeto vacío
   if (!safeFamilyId) {
      return {
         filters: {
            startDate,
            endDate,
            categoryId,
            familyMemberId,
            analyticsYear,
         },
         filterOptions: { categories: [], familyMembers: [] },
         totalGlobal: 0,
         totalCurrentMonth: 0,
         totalIncomeGlobal: 0,
         totalIncomeCurrentMonth: 0,
         balanceGlobal: 0,
         savingsRate: 0,
         usesMockedIncomeData: true,
         averagePerMember: 0,
         activeMembers: 0,
         chartData: [],
         topMembers: [],
         recentExpenses: [],
         monthlyAnalytics: [],
         monthlyIncomeAnalytics: [],
         monthlyComparison: [],
         predictions: {
            points: [],
            nextMonth: null,
            nextTwelveMonths: {
               predictedIncome: 0,
               predictedExpenses: 0,
               predictedBalance: 0,
            },
            errorMessage: null,
         },
      };
   }

   // Obtenemos la lista de miembros de la familia
   const familyMembersPath = buildFamilyMembersSearchPath({
      familyId: safeFamilyId,
      enabled: true,
      page: 0,
      size: 100,
   }).replace("/api", "");

   // Obtenemos los gastos recientes
   const recentExpensesPath = buildExpensesSearchPath({
      familyId: safeFamilyId,
      startDate,
      endDate,
      categoryId,
      familyMemberId,
      page: 0,
      size: 8,
      isEnabled: true,
   }).replace("/api", "");

   // Obtenemos el rango de fechas actual
   const currentMonthRange = getCurrentMonthRange();
   const monthlyRanges = Array.from({ length: 12 }, (_, monthIndex) => {
      const firstDay = new Date(analyticsYear, monthIndex, 1);
      const lastDay = new Date(analyticsYear, monthIndex + 1, 0);

      return {
         month: monthIndex + 1,
         label: new Intl.DateTimeFormat("es-ES", { month: "short" }).format(
            firstDay,
         ),
         startDate: toDateInput(firstDay),
         endDate: toDateInput(lastDay),
      };
   });

   // Obtenemos los totales de gastos, ingresos y categorías
   const [
      totals,
      totalsCurrentMonth,
      membersData,
      recentExpensesData,
      categoriesOptions,
      monthlyTotals,
   ] = await Promise.all([
      backendFetch<SearchTotalExpensesResponse>(
         buildBackendTotalPath({
            familyId: safeFamilyId,
            startDate,
            endDate,
            categoryId,
            familyMemberId,
         }),
      ),
      backendFetch<SearchTotalExpensesResponse>(
         buildBackendTotalPath({
            familyId: safeFamilyId,
            startDate: currentMonthRange.startDate,
            endDate: currentMonthRange.endDate,
            categoryId,
            familyMemberId,
         }),
      ),
      backendFetch<SearchFamilyMembersResponse>(familyMembersPath),
      backendFetch<SearchExpensesResponse>(recentExpensesPath),
      getCategoryOptions(),
      Promise.all(
         monthlyRanges.map((range) =>
            backendFetch<SearchTotalExpensesResponse>(
               buildBackendTotalPath({
                  familyId: safeFamilyId,
                  startDate: range.startDate,
                  endDate: range.endDate,
                  categoryId,
                  familyMemberId,
               }),
            ),
         ),
      ),
   ]);

   // Obtenemos los miembros habilitados y los que se van a analizar
   const enabledMembers: FamilyMember[] = membersData.content ?? [];
   const membersToAnalyze = familyMemberId
      ? enabledMembers.filter((member) => member.id === familyMemberId)
      : enabledMembers;

   // Obtenemos los totales de gastos de cada miembro
   const membersTotals = await Promise.allSettled(
      membersToAnalyze.map(async (member) => {
         const memberTotals = await backendFetch<SearchTotalExpensesResponse>(
            buildBackendTotalPath({
               familyId: safeFamilyId,
               startDate,
               endDate,
               categoryId,
               familyMemberId: member.id,
            }),
         );

         return {
            id: member.id,
            name: member.name,
            total: memberTotals.totalGlobal ?? 0,
         };
      }),
   );

   // Obtenemos los miembros más activos
   const topMembers = membersTotals
      .filter(
         (
            result,
         ): result is PromiseFulfilledResult<{
            id: string;
            name: string;
            total: number;
         }> => result.status === "fulfilled",
      )
      .map((result) => result.value)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

   const totalGlobal = totals.totalGlobal ?? 0;
   const activeMembers = enabledMembers.length;
   const averagePerMember = activeMembers > 0 ? totalGlobal / activeMembers : 0;
   const totalCurrentMonth = totalsCurrentMonth.totalGlobal ?? 0;
   let usesMockedIncomeData = false;
   let totalIncomeGlobal = 0;
   let totalIncomeCurrentMonth = 0;
   let monthlyIncomeAnalytics: {
      month: number;
      label: string;
      total: number;
   }[] = [];

   try {
      // Obtenemos los totales de ingresos, los totales de ingresos del mes actual y los totales de ingresos mensuales
      const [incomeTotals, incomeTotalsCurrentMonth, monthlyIncomeTotals] =
         await Promise.all([
            backendFetch<SearchTotalIncomeEntriesResponse>(
               buildBackendIncomeTotalPath({
                  familyId: safeFamilyId,
                  startDate,
                  endDate,
                  familyMemberId,
               }),
            ),
            backendFetch<SearchTotalIncomeEntriesResponse>(
               buildBackendIncomeTotalPath({
                  familyId: safeFamilyId,
                  startDate: currentMonthRange.startDate,
                  endDate: currentMonthRange.endDate,
                  familyMemberId,
               }),
            ),
            Promise.all(
               monthlyRanges.map((range) =>
                  backendFetch<SearchTotalIncomeEntriesResponse>(
                     buildBackendIncomeTotalPath({
                        familyId: safeFamilyId,
                        startDate: range.startDate,
                        endDate: range.endDate,
                        familyMemberId,
                     }),
                  ),
               ),
            ),
         ]);

      totalIncomeGlobal = incomeTotals.totalGlobal ?? 0;
      totalIncomeCurrentMonth = incomeTotalsCurrentMonth.totalGlobal ?? 0;
      monthlyIncomeAnalytics = monthlyRanges.map((range, index) => ({
         month: range.month,
         label: range.label,
         total: monthlyIncomeTotals[index]?.totalGlobal ?? 0,
      }));
   } catch {
      // Si no se pueden cargar los totales de ingresos, se usan los datos simulados
      usesMockedIncomeData = true;
      const householdBaseIncome = Math.max(1800, activeMembers * 1200);
      monthlyIncomeAnalytics = monthlyRanges.map((range, index) => {
         const expensesForMonth = monthlyTotals[index]?.totalGlobal ?? 0;
         const seasonalOffset = ((index % 4) - 1.5) * 120;
         const mockedIncome = Math.max(
            expensesForMonth + 400,
            householdBaseIncome + seasonalOffset,
         );
         return {
            month: range.month,
            label: range.label,
            total: Number(mockedIncome.toFixed(2)),
         };
      });
      totalIncomeGlobal = Math.max(
         Number((totalGlobal * 1.35).toFixed(2)),
         Number((totalGlobal + activeMembers * 900).toFixed(2)),
      );
      totalIncomeCurrentMonth = Math.max(
         Number((totalCurrentMonth * 1.3).toFixed(2)),
         Number((totalCurrentMonth + activeMembers * 300).toFixed(2)),
      );
   }

   // Obtenemos el saldo global y el tasa de ahorros
   const balanceGlobal = Number((totalIncomeGlobal - totalGlobal).toFixed(2));
   const savingsRate =
      totalIncomeGlobal > 0
         ? Number(((balanceGlobal / totalIncomeGlobal) * 100).toFixed(2))
         : 0;
   let predictionPoints: FamilyDashboardData["predictions"]["points"] = [];
   let predictionErrorMessage: string | null = null;

   // Obtenemos las predicciones financieras
   try {
      const predictions = await backendFetch<PredictionItem[]>(
         buildBackendPredictionsPath({
            familyMemberId,
            categoryId,
         }),
      );

      // Formateamos los datos de predicción
      predictionPoints = predictions.map((item) => {
         const [year, month] = item.date.split("-").map(Number);
         const date = new Date(year, (month || 1) - 1, 1);

         return {
            date: item.date,
            label: new Intl.DateTimeFormat("es-ES", {
               month: "short",
               year: "2-digit",
            }).format(date),
            predictedIncome: item.predictedIncome,
            predictedExpenses: item.predictedExpenses,
            predictedBalance: item.predictedBalance,
         };
      });
   } catch (error) {
      // Si hay un error, establecemos el mensaje de error
      if (error instanceof ErrorCode && error.status === 400) {
         predictionErrorMessage = "You need at least 6 months of data to generate the prediction.";

      } else {
         predictionErrorMessage = "The financial prediction could not be loaded at this time.";
      }
   }

   // Obtenemos las predicciones para el próximo mes y los 12 meses
   const nextMonthPrediction = predictionPoints[0]
      ? {
         predictedIncome: predictionPoints[0].predictedIncome,
         predictedExpenses: predictionPoints[0].predictedExpenses,
         predictedBalance: predictionPoints[0].predictedBalance,
      }
      : null;
   const nextTwelveMonthsPrediction = predictionPoints.reduce(
      (acc, point) => ({
         predictedIncome: acc.predictedIncome + point.predictedIncome,
         predictedExpenses: acc.predictedExpenses + point.predictedExpenses,
         predictedBalance: acc.predictedBalance + point.predictedBalance,
      }),
      {
         predictedIncome: 0,
         predictedExpenses: 0,
         predictedBalance: 0,
      },
   );

   return {
      filters: { startDate, endDate, categoryId, familyMemberId, analyticsYear },
      filterOptions: {
         categories: categoriesOptions,
         familyMembers: enabledMembers.map((member) => ({
            id: member.id,
            name: member.name,
         })),
      },
      totalGlobal,
      totalCurrentMonth,
      totalIncomeGlobal,
      totalIncomeCurrentMonth,
      balanceGlobal,
      savingsRate,
      usesMockedIncomeData,
      averagePerMember,
      activeMembers,
      chartData: (totals.categories ?? []).map((item) => ({
         label: item.categoryName,
         total: item.total,
      })),
      topMembers,
      recentExpenses: normalizeExpensesRows(recentExpensesData.content ?? []),
      monthlyAnalytics: monthlyRanges.map((range, index) => ({
         month: range.month,
         label: range.label,
         total: monthlyTotals[index]?.totalGlobal ?? 0,
      })),
      monthlyIncomeAnalytics,
      monthlyComparison: monthlyRanges.map((range, index) => ({
         month: range.month,
         label: range.label,
         expenses: monthlyTotals[index]?.totalGlobal ?? 0,
         incomes: monthlyIncomeAnalytics[index]?.total ?? 0,
      })),
      predictions: {
         points: predictionPoints,
         nextMonth: nextMonthPrediction,
         nextTwelveMonths: nextTwelveMonthsPrediction,
         errorMessage: predictionErrorMessage,
      },
   };
}
