"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { searchMyExpensesAction } from "@/app/(protected)/expenses/actions";
import {
   SearchMyExpensesQuery,
   SearchMyExpensesResponse,
} from "@/features/expenses/types/expenses";
import useMutation from "@/hooks/useMutation";
import { createExpense, deleteExpense, SaveExpensePayload, updateExpense } from "@/services/expensesService";
import { Expense } from "@/features/users/types/userAnalytics";

interface ExpensesPageProps {
   initialData: SearchMyExpensesResponse;
}

export const useExpensesPage = ({ initialData }: ExpensesPageProps) => {
   // FILTROS
   const initialFilters = /*initialData?.filters ?? */{
      startDate: "",
      endDate: "",
      categoryIdFilter: "all",
      familyMemberIdFilter: "all",
   };

   // Estado de filtros inicializado desde SSR.
   const [startDate, setStartDate] = useState(initialFilters.startDate);
   const [endDate, setEndDate] = useState(initialFilters.endDate);
   const [categoryIdFilter, setCategoryIdFilter] = useState(initialFilters.categoryIdFilter);
   const [familyMemberIdFilter, setFamilyMemberIdFilter] = useState(initialFilters.familyMemberIdFilter);

   const handleFiltersChange = (filters: {
      startDate?: string;
      endDate?: string;
      categoryIdFilter?: string;
      familyMemberIdFilter?: string;
   }) => {
      setStartDate(filters.startDate ?? startDate);
      setEndDate(filters.endDate ?? endDate);
      setCategoryIdFilter(filters.categoryIdFilter ?? categoryIdFilter);
      setFamilyMemberIdFilter(filters.familyMemberIdFilter ?? familyMemberIdFilter);
      setExpensesPageState(1);
   };
   
   // END FILTROS

   // TABLA
   // Número de página actual.
   const [expensesPage, setExpensesPageState] = useState(initialData.number ?? 1);

   // Tamaño de página actual.
   const [expensesPageSize, setExpensesPageSize] = useState(initialData.size ?? 10);

   // Derivamos los parámetros del query desde el estado local de la pantalla.
   const queryParams = useMemo<SearchMyExpensesQuery>(
      () => ({
         page: expensesPage, // La action traduce a backend 0-based.
         size: expensesPageSize,
         startDate,
         endDate,
         categoryId: categoryIdFilter === "all" ? undefined : categoryIdFilter,
         familyMemberId: familyMemberIdFilter === "all" ? undefined : familyMemberIdFilter,
      }),
      [expensesPage, expensesPageSize, startDate, endDate, categoryIdFilter, familyMemberIdFilter] // Se ejecuta cuando se modifican estos valores.
   );

   // Encapsulamos la llamada para que useQuery pueda ejecutarla y re-ejecutarla.
   const queryFn = useCallback(
      () => searchMyExpensesAction(queryParams),
      [queryParams], // Se ejecuta cuando se modifican estos valores.
   );

   // Usamos useQuery para manejar la petición al backend.
   const { data, error, refetch } = useQuery<SearchMyExpensesResponse>({
      // Función que realiza la llamada al backend.
      queryFn,

      // Reaccionamos a cambios de filtros/paginación, es decir, cuando cambia el texto de búsqueda o la página.
      deps: [queryParams.page, queryParams.size, queryParams.startDate, queryParams.endDate, queryParams.categoryId, queryParams.familyMemberId],

      // Aprovechamos SSR y evitamos un segundo fetch al hidratar.
      initialData,

      // Evitamos un segundo fetch al montar la pantalla.
      skipInitialFetch: true,
   });

   // Si no hay data nueva, usamos el snapshot inicial de SSR.
   const safeData = data ?? initialData;

   // Eventos de cambio de página.
   const handlePageChange = (page: number) => {
      setExpensesPageState(page);
   };

   // Evento de cambio de tamaño de página.
   const handlePageSizeChange = (newPageSize: number) => {
      setExpensesPageSize(newPageSize);
      setExpensesPageState(1); // Reubicamos a la primera página al cambiar tamaño.
   };
   // END TABLA

   // MODAL CREAR/EDITAR GASTO
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

   // Función para cerrar el modal de creación y edición de categoría.
   const closeModal = useCallback(() => setIsModalOpen(false), []);

   // Función para abrir el modal de creación de gasto.
   const handleOpenCreateExpenseModal = useCallback(() => {
      setSelectedExpense(null);
      setIsModalOpen(true);
   }, []);

   // Evento para guardar el gasto.
   const handleSaveExpense = async (payload: SaveExpensePayload) => {
      await saveExpense(payload);
   };

   // Función para guardar una categoría.
   const { mutate: saveExpense, isLoading: isSaving } = useMutation<void, SaveExpensePayload>({
      mutationFn: async (payload) => {
         if (selectedExpense?.id) {
            await updateExpense(selectedExpense.id, payload);
            return;
         }

         await createExpense(payload);
      },
      successMessage: selectedExpense?.id
         ? "Gasto actualizado correctamente"
         : "Gasto creado correctamente",
      onSuccess: async () => {
         closeModal();
         await refetch();
      },
   });

   // Función para editar un gasto.
   const handleOpenEditExpenseModal = async (expense: Expense) => {
      setSelectedExpense(expense);
      setIsModalOpen(true);
   };

   // END MODAL CREAR/EDITAR GASTO

   // MODAL ELIMINAR GASTO
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

   // Función para abrir el modal de eliminar gasto.
   const openDeleteModal = useCallback((expense: Expense) => {
      setSelectedExpense(expense);
      setIsDeleteModalOpen(true);
   }, []);

   // Función para cerrar el modal de eliminar gasto.
   const closeDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

   // Evento para eliminar el gasto seleccionado.
   const handleDeleteExpense = async () => {
      if (!selectedExpense?.id) return;
      await removeExpense({ id: selectedExpense.id });
   };

   // Función para eliminar un gasto.
   const { mutate: removeExpense, isLoading: isDeleting } = useMutation<void, { id: string }>({
      mutationFn: async ({ id }) => {
         await deleteExpense(id);
      },
      successMessage: "Gasto eliminado correctamente",
      onSuccess: async () => {
         closeDeleteModal();
         await refetch();
      },
   });

   // END MODAL ELIMINAR GASTO

   return {
      dataExpenses: safeData.content ?? [],
      expensesTotal: safeData.totalElements ?? 0,
      expensesPage,
      expensesTotalPages: Math.max(1, safeData.totalPages ?? 1),
      expensesPageSize,
      startDate,
      endDate,
      categoryIdFilter,
      familyMemberIdFilter,
      error,
      isModalOpen,
      selectedExpense,
      isSaving,
      isDeleteModalOpen,
      isDeleting,
      handlePageChange,
      handlePageSizeChange,
      handleFiltersChange,
      handleOpenCreateExpenseModal,
      closeModal,
      handleSaveExpense,
      handleOpenEditExpenseModal,
      openDeleteModal,
      closeDeleteModal,
      handleDeleteExpense
   };
};
