"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import useMutation from "@/hooks/useMutation";
import { SearchMyIncomeRulesQuery, SearchMyIncomeRulesResponse, SearchMyIncomesQuery, SearchMyIncomesResponse, Income, IncomeRule } from "@/features/incomes/types/incomes";
import { createIncome, deleteIncome, SaveIncomePayload, updateIncome } from "@/services/incomesService";
import { createIncomeRule, deleteIncomeRule, SaveIncomeRulePayload, updateIncomeRule } from "@/services/incomeRulesService";
import { searchMyIncomeRulesAction, searchMyIncomesAction } from "@/app/(protected)/incomes/actions";

interface IncomesPageProps {
   initialIncomes: SearchMyIncomesResponse;
   initialRules: SearchMyIncomeRulesResponse;
}

export const useIncomesPage = ({ initialIncomes, initialRules }: IncomesPageProps) => {
   const initialFilters = {
      startDate: "",
      endDate: "",
      familyMemberIdFilter: "all",
   };

   const [startDate, setStartDate] = useState(initialFilters.startDate);
   const [endDate, setEndDate] = useState(initialFilters.endDate);
   const [familyMemberIdFilter, setFamilyMemberIdFilter] = useState(initialFilters.familyMemberIdFilter);

   // Evento que se dispara cuando cambia alguno de los filtros.
   const handleFiltersChange = (filters: {
      startDate?: string;
      endDate?: string;
      familyMemberIdFilter?: string;
   }) => {
      setStartDate(filters.startDate ?? startDate);
      setEndDate(filters.endDate ?? endDate);
      setFamilyMemberIdFilter(filters.familyMemberIdFilter ?? familyMemberIdFilter);
      setIncomesPageState(1);
      setRulesPageState(1);
   };

   // Valores iniciales de la paginación de ingresos.
   const [incomesPage, setIncomesPageState] = useState(initialIncomes.number ?? 1);
   const [incomesPageSize, setIncomesPageSize] = useState(initialIncomes.size ?? 10);

   // Valores iniciales de la paginación de reglas.
   const [rulesPage, setRulesPageState] = useState(initialRules.number ?? 1);
   const [rulesPageSize, setRulesPageSize] = useState(initialRules.size ?? 10);

   // Parámetros de búsqueda de ingresos.
   const incomesQueryParams = useMemo<SearchMyIncomesQuery>(
      () => ({
         page: incomesPage,
         size: incomesPageSize,
         startDate,
         endDate,
         familyMemberId: familyMemberIdFilter === "all" ? undefined : familyMemberIdFilter,
      }),
      [incomesPage, incomesPageSize, startDate, endDate, familyMemberIdFilter]
   );

   // Parámetros de búsqueda de reglas.
   const rulesQueryParams = useMemo<SearchMyIncomeRulesQuery>(
      () => ({
         page: rulesPage,
         size: rulesPageSize,
         familyMemberId: familyMemberIdFilter === "all" ? undefined : familyMemberIdFilter,
      }),
      [rulesPage, rulesPageSize, familyMemberIdFilter]
   );

   // Función para consultar ingresos.
   const incomesQueryFn = useCallback(() => searchMyIncomesAction(incomesQueryParams), [incomesQueryParams]);

   // Función para consultar reglas.
   const rulesQueryFn = useCallback(() => searchMyIncomeRulesAction(rulesQueryParams), [rulesQueryParams]);

   // Consulta de ingresos cuando cambia alguno de los filtros.
   const {
      data: incomesData,
      error: incomesError,
      refetch: refetchIncomes,
   } = useQuery<SearchMyIncomesResponse>({
      queryFn: incomesQueryFn,
      deps: [
         incomesQueryParams.page,
         incomesQueryParams.size,
         incomesQueryParams.startDate,
         incomesQueryParams.endDate,
         incomesQueryParams.familyMemberId,
      ],
      initialData: initialIncomes,
      skipInitialFetch: true,
   });

   // Consulta de ingresos cuando cambia alguno de los filtros.
   const {
      data: rulesData,
      error: rulesError,
      refetch: refetchRules,
   } = useQuery<SearchMyIncomeRulesResponse>({
      queryFn: rulesQueryFn,
      deps: [rulesQueryParams.page, rulesQueryParams.size, rulesQueryParams.familyMemberId],
      initialData: initialRules,
      skipInitialFetch: true,
   });

   // Datos seguros de ingresos y reglas.
   const safeIncomesData = incomesData ?? initialIncomes;
   const safeRulesData = rulesData ?? initialRules;

   // Evento que se dispara cuando cambia la página de ingresos y reglas.
   const handleIncomesPageChange = (page: number) => setIncomesPageState(page);
   const handleRulesPageChange = (page: number) => setRulesPageState(page);

   // Evento que se dispara cuando cambia el tamaño de la página de ingresos.
   const handleIncomesPageSizeChange = (newPageSize: number) => {
      setIncomesPageSize(newPageSize);
      setIncomesPageState(1);
   };

   // Evento que se dispara cuando cambia el tamaño de la página de reglas.
   const handleRulesPageSizeChange = (newPageSize: number) => {
      setRulesPageSize(newPageSize);
      setRulesPageState(1);
   };

   // Estado de la ventana modal para crear un ingreso.
   const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
   const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

   // Función para cerrar la ventana modal.
   const closeIncomeModal = useCallback(() => setIsIncomeModalOpen(false), []);

   // Evento para abrir la ventana modal para crear un ingreso.
   const handleOpenCreateIncomeModal = useCallback(() => {
      setSelectedIncome(null);
      setIsIncomeModalOpen(true);
   }, []);

   // Evento para abrir la ventana modal para editar un ingreso.
   const handleOpenEditIncomeModal = async (income: Income) => {
      setSelectedIncome(income);
      setIsIncomeModalOpen(true);
   };

   // Función para guardar un ingreso.
   const { mutate: saveIncome, isLoading: isSavingIncome } = useMutation<void, SaveIncomePayload>({
      mutationFn: async (payload) => {
         if (selectedIncome?.id) {
            await updateIncome(selectedIncome.id, payload);
            return;
         }

         await createIncome(payload);
      },
      successMessage: selectedIncome?.id ? "Income updated successfully" : "Income created successfully",
      onSuccess: async () => {
         closeIncomeModal();
         await refetchIncomes();
      },
   });

   // Evento que se dispara cuando se guarda un ingreso.
   const handleSaveIncome = async (payload: SaveIncomePayload) => {
      await saveIncome(payload);
   };

   // Estado de la ventana modal para eliminar un ingreso.
   const [isDeleteIncomeModalOpen, setIsDeleteIncomeModalOpen] = useState(false);

   // Función para abrir la ventana modal para eliminar un ingreso.
   const openDeleteIncomeModal = useCallback((income: Income) => {
      setSelectedIncome(income);
      setIsDeleteIncomeModalOpen(true);
   }, []);

   // Función para cerrar la ventana modal.
   const closeDeleteIncomeModal = useCallback(() => setIsDeleteIncomeModalOpen(false), []);

   // Función para eliminar un ingreso.
   const { mutate: removeIncome, isLoading: isDeletingIncome } = useMutation<void, { id: string }>({
      mutationFn: async ({ id }) => {
         await deleteIncome(id);
      },
      successMessage: "Income deleted successfully",
      onSuccess: async () => {
         closeDeleteIncomeModal();
         await refetchIncomes();
      },
   });

   // Evento que se dispara cuando se elimina un ingreso.
   const handleDeleteIncome = async () => {
      if (!selectedIncome?.id) return;
      await removeIncome({ id: selectedIncome.id });
   };

   // Estado de la ventana modal para crear una regla.
   const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
   const [selectedRule, setSelectedRule] = useState<IncomeRule | null>(null);

   // Función para cerrar la ventana modal.
   const closeRuleModal = useCallback(() => setIsRuleModalOpen(false), []);

   // Evento para abrir la ventana modal para crear una regla.
   const handleOpenCreateRuleModal = useCallback(() => {
      setSelectedRule(null);
      setIsRuleModalOpen(true);
   }, []);

   // Evento para abrir la ventana modal para editar una regla.
   const handleOpenEditRuleModal = async (rule: IncomeRule) => {
      setSelectedRule(rule);
      setIsRuleModalOpen(true);
   };

   // Función para guardar una regla.
   const { mutate: saveRule, isLoading: isSavingRule } = useMutation<void, SaveIncomeRulePayload>({
      mutationFn: async (payload) => {
         if (selectedRule?.id) {
            await updateIncomeRule(selectedRule.id, payload);
            return;
         }

         await createIncomeRule(payload);
      },
      successMessage: selectedRule?.id ? "Rule updated successfully" : "Rule created successfully",
      onSuccess: async () => {
         closeRuleModal();
         await refetchRules();
         await refetchIncomes();
      },
   });

   // Evento que se dispara cuando se guarda una regla.
   const handleSaveRule = async (payload: SaveIncomeRulePayload) => {
      await saveRule(payload);
   };

   // Estado de la ventana modal para eliminar una regla.
   const [isDeleteRuleModalOpen, setIsDeleteRuleModalOpen] = useState(false);

   // Función para abrir la ventana modal para eliminar una regla.
   const openDeleteRuleModal = useCallback((rule: IncomeRule) => {
      setSelectedRule(rule);
      setIsDeleteRuleModalOpen(true);
   }, []);

   // Función para cerrar la ventana modal.
   const closeDeleteRuleModal = useCallback(() => setIsDeleteRuleModalOpen(false), []);

   // Función para eliminar una regla.
   const { mutate: removeRule, isLoading: isDeletingRule } = useMutation<void, { id: string }>({
      mutationFn: async ({ id }) => {
         await deleteIncomeRule(id);
      },
      successMessage: "Rule deleted successfully",
      onSuccess: async () => {
         closeDeleteRuleModal();
         await refetchRules();
         await refetchIncomes();
      },
   });

   // Evento que se dispara cuando se elimina una regla.
   const handleDeleteRule = async () => {
      if (!selectedRule?.id) return;
      await removeRule({ id: selectedRule.id });
   };

   return {
      incomesRows: safeIncomesData.content ?? [],
      incomesTotal: safeIncomesData.totalElements ?? 0,
      incomesPage,
      incomesTotalPages: Math.max(1, safeIncomesData.totalPages ?? 1),
      incomesPageSize,
      rulesRows: safeRulesData.content ?? [],
      rulesTotal: safeRulesData.totalElements ?? 0,
      rulesPage,
      rulesTotalPages: Math.max(1, safeRulesData.totalPages ?? 1),
      rulesPageSize,
      startDate,
      endDate,
      familyMemberIdFilter,
      error: incomesError ?? rulesError,
      isIncomeModalOpen,
      isSavingIncome,
      selectedIncome,
      isDeleteIncomeModalOpen,
      isDeletingIncome,
      isRuleModalOpen,
      isSavingRule,
      selectedRule,
      isDeleteRuleModalOpen,
      isDeletingRule,
      handleFiltersChange,
      handleIncomesPageChange,
      handleIncomesPageSizeChange,
      handleRulesPageChange,
      handleRulesPageSizeChange,
      handleOpenCreateIncomeModal,
      handleOpenEditIncomeModal,
      closeIncomeModal,
      handleSaveIncome,
      openDeleteIncomeModal,
      closeDeleteIncomeModal,
      handleDeleteIncome,
      handleOpenCreateRuleModal,
      handleOpenEditRuleModal,
      closeRuleModal,
      handleSaveRule,
      openDeleteRuleModal,
      closeDeleteRuleModal,
      handleDeleteRule,
   };
};
