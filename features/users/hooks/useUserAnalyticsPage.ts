"use client";

import { useMemo, useState } from "react";
import {
   searchFamilyMembersAction,
   searchUserExpensesAction,
} from "@/app/(protected)/admin/users/[id]/actions";
import { getTotalExpenses } from "@/services/expensesService";
import {
   UserAnalyticsInitialData,
   UserAnalyticsUserMeta,
} from "@/features/users/types/userAnalytics";

interface UseUserAnalyticsPageArgs {
   initialUserMeta: UserAnalyticsUserMeta;
   initialData: UserAnalyticsInitialData;
}

const normalizeAnalyticsFilter = (value: string) => (value === "all" ? "" : value);

export const useUserAnalyticsPage = ({
   initialUserMeta,
   initialData,
}: UseUserAnalyticsPageArgs) => {

   // Fallbacks defensivos ante payloads parciales del backend.
   const initialFilters = initialData?.filters ?? {
      startDate: "",
      endDate: "",
      categoryIdFilter: "all",
      familyMemberIdFilter: "all",
   };
   const initialFiltersMeta = initialData?.filtersMeta ?? {
      categoryOptions: [],
      familyMembersOptions: [],
   };
   const initialSummary = initialData?.summary ?? { totalAmount: 0 };
   const initialChart = initialData?.chart ?? [];
   const initialExpenses = initialData?.expenses ?? {
      content: [],
      totalElements: 0,
      totalPages: 1,
      number: 1,
      size: 10,
   };
   const initialFamilyMembers = initialData?.familyMembers ?? {
      content: [],
      totalElements: 0,
      totalPages: 1,
      number: 1,
      size: 10,
   };

   // Estado de filtros inicializado desde SSR.
   const [startDate, setStartDate] = useState(initialFilters.startDate);
   const [endDate, setEndDate] = useState(initialFilters.endDate);
   const [categoryIdFilter, setCategoryIdFilter] = useState(initialFilters.categoryIdFilter);
   const [familyMemberIdFilter, setFamilyMemberIdFilter] = useState(initialFilters.familyMemberIdFilter);

   // Catálogos de filtros (categorías y miembros).
   const [categoryOptions] = useState(initialFiltersMeta.categoryOptions ?? []);
   const [familyMembersOptions] = useState(initialFiltersMeta.familyMembersOptions ?? []);

   // Agregados de gastos (resumen + chart).
   const [summaryTotal, setSummaryTotal] = useState(initialSummary.totalAmount ?? 0);
   const [chartData, setChartData] = useState(initialChart ?? []);

   // Estado de tabla de gastos.
   const [expensesRows, setExpensesRows] = useState(initialExpenses.content ?? []);
   const [expensesTotal, setExpensesTotal] = useState(initialExpenses.totalElements ?? 0);
   const [expensesPage, setExpensesPageState] = useState(initialExpenses.number ?? 1);
   const [expensesTotalPages, setExpensesTotalPages] = useState(Math.max(1, initialExpenses.totalPages ?? 1));
   const [expensesPageSize, setExpensesPageSizeState] = useState(initialExpenses.size ?? 10);

   // Estado de tabla de miembros.
   const [familyRows, setFamilyRows] = useState(initialFamilyMembers.content ?? []);
   const [familyTotal, setFamilyTotal] = useState(initialFamilyMembers.totalElements ?? 0);
   const [familyPage, setFamilyPageState] = useState(initialFamilyMembers.number ?? 1);
   const [familyTotalPages, setFamilyTotalPages] = useState(Math.max(1, initialFamilyMembers.totalPages ?? 1));
   const [familyPageSize, setFamilyPageSizeState] = useState(initialFamilyMembers.size ?? 10);

   const [error, setError] = useState<Error | null>(null);
   const [isLoading, setIsLoading] = useState(false);

   // Priorizamos ADMIN, luego OWNER y finalmente USER.
   const roleLabel = initialUserMeta.isAdmin ? "ADMIN" : initialUserMeta.isOwner ? "OWNER" : "USER";

   // Mapa auxiliar memberId -> nombre para render de tabla de gastos.
   const memberNameById = useMemo(() => {
      const mapper: Record<string, string> = {};
      (familyMembersOptions ?? []).forEach((familyMember) => {
         mapper[familyMember.id] = familyMember.name;
      });
      return mapper;
   }, [familyMembersOptions]);

   const maxBar = useMemo(
      () => Math.max(...chartData.map((item) => item.total), 1),
      [chartData]
   );

   // Query base compartida entre llamadas relacionadas a gastos.
   const buildBaseQuery = () => ({
      familyId: initialUserMeta.familyId,
      startDate,
      endDate,
      categoryId: normalizeAnalyticsFilter(categoryIdFilter),
      familyMemberId: normalizeAnalyticsFilter(familyMemberIdFilter),
   });

   // Refresca solo bloque de gastos (tabla + summary + chart + categorías).
   const loadExpenses = async (
      page: number,
      size: number,
      filtersOverride?: {
         familyId: string;
         startDate: string;
         endDate: string;
         categoryId: string;
         familyMemberId: string;
      }
   ) => {
      const filters = filtersOverride ?? buildBaseQuery();
      const [response, totalResponse] = await Promise.all([
         searchUserExpensesAction({
            ...filters,
            expensesPage: page,
            expensesSize: size,
         }),
         getTotalExpenses(filters),
      ]);

      const totalAmountFromTotals =
         typeof totalResponse?.totalGlobal === "number"
            ? totalResponse.totalGlobal
            : response.summary?.totalAmount ?? 0;
      const chartFromTotals = (totalResponse?.categories ?? []).map((item) => ({
         label: item.categoryName,
         total: item.total,
      }));
      const nextChartData = chartFromTotals.length > 0 ? chartFromTotals : (response.chart ?? []);

      setExpensesRows(response.expenses?.content ?? []);
      setExpensesTotal(response.expenses?.totalElements ?? 0);
      setExpensesPageState(response.expenses?.number ?? 1);
      setExpensesTotalPages(Math.max(1, response.expenses?.totalPages ?? 1));
      setExpensesPageSizeState(response.expenses?.size ?? size);
      setSummaryTotal(totalAmountFromTotals);
      setChartData(nextChartData);
   };

   // Refresca solo bloque de miembros.
   const loadFamilyMembers = async (page: number, size: number) => {
      const response = await searchFamilyMembersAction({
         familyId: initialUserMeta.familyId,
         familyPage: page,
         familySize: size,
      });

      setFamilyRows(response.familyMembers?.content ?? []);
      setFamilyTotal(response.familyMembers?.totalElements ?? 0);
      setFamilyPageState(response.familyMembers?.number ?? 1);
      setFamilyTotalPages(Math.max(1, response.familyMembers?.totalPages ?? 1));
      setFamilyPageSizeState(response.familyMembers?.size ?? size);
   };

   const handleFiltersChange = async (payload: {
      startDate?: string;
      endDate?: string;
      categoryFilter?: string;
      memberFilter?: string;
   }) => {
      // Aplicamos cambios parciales de filtros y conservamos el resto.
      const nextFilters = {
         startDate: payload.startDate ?? startDate,
         endDate: payload.endDate ?? endDate,
         categoryIdFilter: payload.categoryFilter ?? categoryIdFilter,
         familyMemberIdFilter: payload.memberFilter ?? familyMemberIdFilter,
      };

      setStartDate(nextFilters.startDate);
      setEndDate(nextFilters.endDate);
      setCategoryIdFilter(nextFilters.categoryIdFilter);
      setFamilyMemberIdFilter(nextFilters.familyMemberIdFilter);
      setError(null);
      setIsLoading(true);

      try {
         // En filtros refrescamos solo gastos/chart/resumen (no miembros).
         await loadExpenses(1, expensesPageSize, {
            familyId: initialUserMeta.familyId,
            startDate: nextFilters.startDate,
            endDate: nextFilters.endDate,
            categoryId: normalizeAnalyticsFilter(nextFilters.categoryIdFilter),
            familyMemberId: normalizeAnalyticsFilter(nextFilters.familyMemberIdFilter),
         });
      } catch (e) {
         setError(e as Error);
      } finally {
         setIsLoading(false);
      }
   };

   const setExpensesPage = async (page: number) => {
      setError(null);
      setIsLoading(true);
      try {
         await loadExpenses(page, expensesPageSize);
      } catch (e) {
         setError(e as Error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleExpensesPageSizeChange = async (size: number) => {
      setError(null);
      setIsLoading(true);
      try {
         await loadExpenses(1, size); // Al cambiar size, reiniciamos a página 1.
      } catch (e) {
         setError(e as Error);
      } finally {
         setIsLoading(false);
      }
   };

   const setFamilyPage = async (page: number) => {
      setError(null);
      setIsLoading(true);
      try {
         await loadFamilyMembers(page, familyPageSize);
      } catch (e) {
         setError(e as Error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleFamilyPageSizeChange = async (size: number) => {
      setError(null);
      setIsLoading(true);
      try {
         await loadFamilyMembers(1, size); // Al cambiar size, reiniciamos a página 1.
      } catch (e) {
         setError(e as Error);
      } finally {
         setIsLoading(false);
      }
   };

   return {
      username: initialUserMeta.username,
      email: initialUserMeta.email,
      roleLabel,
      isEnabled: initialUserMeta.isEnabled,
      startDate,
      endDate,
      categoryIdFilter,
      familyMemberIdFilter,
      categoryOptions,
      familyMembers: familyMembersOptions,
      memberNameById,
      totalAmount: summaryTotal,
      chartData,
      maxBar,
      expensesRows,
      expensesTotal,
      expensesPage,
      expensesTotalPages,
      expensesPageSize,
      familyRows,
      familyTotal,
      familyPage,
      familyTotalPages,
      familyPageSize,
      error,
      isLoading,
      handleFiltersChange,
      setExpensesPage,
      handleExpensesPageSizeChange,
      setFamilyPage,
      handleFamilyPageSizeChange,
   };
};
