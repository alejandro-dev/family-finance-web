"use client";

import { useMemo, useState } from "react";
import { useCallback } from "react";
import { useQuery } from "@/hooks/useQuery";
import { searchMyExpensesAction } from "@/app/(protected)/expenses/actions";
import { FamilyMember } from "@/types/FamilyMember";
import { getTotalExpenses, SearchTotalExpensesResponse } from "@/services/expensesService";
import { SearchMyExpensesResponse } from "@/features/expenses/types/expenses";

interface uuseShowFamilyMemberProps {
   familyMember: FamilyMember;
   analyticsExpenses: SearchTotalExpensesResponse;
   initialExpenses: SearchMyExpensesResponse;
}

export default function useShowFamilyMember({ familyMember, analyticsExpenses, initialExpenses }: uuseShowFamilyMemberProps) {
   const [expensesPage, setExpensesPageState] = useState(initialExpenses.number ?? 1);
   const [expensesPageSize, setExpensesPageSizeState] = useState(initialExpenses.size ?? 10);

   // FILTROS
   
   const initialFilters = /*initialData?.filters ?? */{
      startDate: "",
      endDate: "",
      categoryIdFilter: "all",
   };

   // Estado de filtros inicializado desde SSR.
   const [startDate, setStartDate] = useState(initialFilters.startDate);
   const [endDate, setEndDate] = useState(initialFilters.endDate);
   const [categoryIdFilter, setCategoryIdFilter] = useState(initialFilters.categoryIdFilter);

   const handleFiltersChange = (filters: {
      startDate?: string;
      endDate?: string;
      categoryFilter?: string;
   }) => {      
      setStartDate(filters.startDate ?? startDate);
      setEndDate(filters.endDate ?? endDate);
      setCategoryIdFilter(filters.categoryFilter ?? categoryIdFilter);
      setExpensesPageState(1);
   };
   // END FILTROS

   // TABLA DE GASTOS
   const queryFn = useCallback(
      () =>
         searchMyExpensesAction({
            page: expensesPage,
            size: expensesPageSize,
            familyMemberId: familyMember.id,
            categoryId: categoryIdFilter === "all" ? undefined : categoryIdFilter,
            startDate,
            endDate,
            isEnabled: undefined
         }),
      [expensesPage, expensesPageSize, familyMember.id, categoryIdFilter, startDate, endDate]
   );

   const { data, error } = useQuery({
      queryFn,
      deps: [expensesPage, expensesPageSize, familyMember.id, categoryIdFilter, startDate, endDate],
      initialData: initialExpenses,
      skipInitialFetch: true,
   });

   const handleExpensesPageChange = (page: number) => {
      setExpensesPageState(page);
   };

   const handleExpensesPageSizeChange = (pageSize: number) => {
      setExpensesPageSizeState(pageSize);
      setExpensesPageState(1);
   };
   // END TABLA DE GASTOS

   // CHART DE GASTOS POR CATEGORIA
   const totalsQueryFn = useCallback(
      () =>
         getTotalExpenses({
            familyMemberId: familyMember.id,
            categoryId: categoryIdFilter === "all" ? undefined : categoryIdFilter,
            startDate,
            endDate,
         }),
      [familyMember.id, categoryIdFilter, startDate, endDate]
   );

   const { data: totalsData } = useQuery({
      queryFn: totalsQueryFn,
      deps: [familyMember.id, categoryIdFilter, startDate, endDate],
      initialData: analyticsExpenses,
      skipInitialFetch: true,
   });

   const safeExpenses = data ?? initialExpenses;
   const safeTotals = totalsData ?? analyticsExpenses;
   const chartData = useMemo(
      () =>
         (safeTotals.categories ?? []).map((item) => ({
            label: item.categoryName,
            total: item.total,
         })),
      [safeTotals.categories]
   );

   const maxBar = useMemo(
      () => Math.max(...chartData.map((item) => item.total), 1),
      [chartData]
   );
   // END CHART DE GASTOS POR CATEGORIA
   
   return {
      chartData,
      maxBar,
      expensesRows: safeExpenses.content ?? [],
      expensesTotal: safeExpenses.totalElements ?? 0,
      expensesPage,
      expensesTotalPages: Math.max(1, safeExpenses.totalPages ?? 1),
      expensesPageSize,
      error,
      totalAmount: safeTotals.totalGlobal ?? 0,
      startDate,
      endDate,
      categoryIdFilter,
      handleExpensesPageChange,
      handleExpensesPageSizeChange,
      handleFiltersChange
   };
}
