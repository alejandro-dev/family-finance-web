"use client";

import { useCallback, useMemo, useState } from "react";
import {
   createCategory,
   deleteCategory,
   SaveCategoryPayload,
   SearchCategoriesParams,
   SearchCategoriesResponse,
   searchCategories as searchCategoriesService,
   updateCategory,
} from "@/services/categoriesService";
import { useQuery } from "@/hooks/useQuery";
import useMutation from "@/hooks/useMutation";
import { Category } from "@/types/Category";

interface CategoriesPageProps {
   initialData: SearchCategoriesResponse;
}

export const useCategoriesPage = ({ initialData }: CategoriesPageProps) => {
   const [currentPage, setCurrentPage] = useState(1);
   const [searchQuery, setSearchQuery] = useState("");
   const [pageSize, setPageSize] = useState(10);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

   // Función para abrir el modal de creación de categoría.
   const openCreateModal = useCallback(() => {
      setSelectedCategory(null);
      setIsModalOpen(true);
   }, []);

   // Función para abrir el modal de edición de categoría.
   const openEditModal = useCallback((category: Category) => {
      setSelectedCategory(category);
      setIsModalOpen(true);
   }, []);

   // Función para cerrar el modal de creación y edición de categoría.
   const closeModal = useCallback(() => setIsModalOpen(false), []);

   // Función para abrir el modal de eliminar categoría.
   const openDeleteModal = useCallback((category: Category) => {
      setSelectedCategory(category);
      setIsDeleteModalOpen(true);
   }, []);

   // Función para cerrar el modal de eliminar categoría.
   const closeDeleteModal = useCallback(() => setIsDeleteModalOpen(false), []);

   // Derivamos los parámetros del query desde el estado local de la pantalla.
   const queryParams = useMemo<SearchCategoriesParams>(
      () => ({
         search: searchQuery,
         page: currentPage - 1, // El backend usa índice base 0.
         size: pageSize,
      }),
      [searchQuery, currentPage, pageSize] // Se ejecuta cuando se modifican estos valores.
   );

   // Encapsulamos la llamada para que useQuery pueda ejecutarla y re-ejecutarla.
   const queryFn = useCallback(
      () => searchCategoriesService(queryParams),
      [queryParams], // Se ejecuta cuando se modifican estos valores.
   );

   // Usamos useQuery para manejar la petición al backend.
   const { data, error, refetch } = useQuery<SearchCategoriesResponse>({
      // Función que realiza la llamada al backend.
      queryFn,

      // Reaccionamos a cambios de filtros/paginación, es decir, cuando cambia el texto de búsqueda o la página.
      deps: [queryParams.search, queryParams.page, queryParams.size],

      // Aprovechamos SSR y evitamos un segundo fetch al hidratar.
      initialData,

      // Evitamos un segundo fetch al montar la pantalla.
      skipInitialFetch: true,
   });

   // Función para guardar una categoría.
   const { mutate: saveCategory, isLoading: isSaving } = useMutation<void,  SaveCategoryPayload>({
      mutationFn: async (payload) => {
         if (selectedCategory?.id) {
            await updateCategory(selectedCategory.id, payload);
            return;
         }

         await createCategory(payload);
      },
      successMessage: selectedCategory?.id
         ? "Category updated successfully"
         : "Category created successfully",
      onSuccess: async () => {
         closeModal();
         await refetch();
      },
   });

   // Función para eliminar una categoría.
   const { mutate: removeCategory, isLoading: isDeleting } = useMutation<void, { id: string }>({
      mutationFn: async ({ id }) => {
         await deleteCategory(id);
      },
      successMessage: "Category deleted successfully",
      onSuccess: async () => {
         closeDeleteModal();
         await refetch();
      },
   });

   // Eventos de cambio de página.
   const handlePageChange = (page: number) => {
      setCurrentPage(page);
   };

   // Evento de búsqueda.
   const handleSearch = (search: string) => {
      setSearchQuery(search);
      setCurrentPage(1); // Siempre volvemos a página 1 al cambiar búsqueda.
   };

   // Evento de cambio de tamaño de página.
   const handlePageSizeChange = (newPageSize: number) => {
      setPageSize(newPageSize);
      setCurrentPage(1); // Reubicamos a la primera página al cambiar tamaño.
   };

   // Evento para guardar la categoría seleccionada.
   const handleSaveCategory = async (payload: SaveCategoryPayload) => {
      await saveCategory(payload);
   };

   // Evento para eliminar la categoría seleccionada.
   const handleDeleteCategory = async () => {
      if (!selectedCategory?.id) return;
      await removeCategory({ id: selectedCategory.id });
   };

   return {
      data: data ?? initialData,
      currentPage,
      pageSize,
      error,
      refetch,
      handlePageChange,
      handleSearch,
      handlePageSizeChange,
      isModalOpen,
      isDeleteModalOpen,
      selectedCategory,
      isSaving,
      isDeleting,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      closeModal,
      closeDeleteModal,
      handleSaveCategory,
      handleDeleteCategory,
   };
};
