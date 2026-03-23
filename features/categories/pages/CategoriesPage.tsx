"use client";

import { useCategoriesPage } from "../hooks/useCategoriesPage";
import CategoriesTable from "../components/CategoriesTable";
import { SearchCategoriesResponse } from "@/services/categoriesService";
import CategoryModal from "../components/CategoryModal";
import DeleteCategoryModal from "../components/DeleteCategoryModal";
import ToastService from "@/services/toastService";

interface CategoriesPageProps {
   initialData: SearchCategoriesResponse;
}

export default function CategoriesPage({ initialData }: CategoriesPageProps) {
   const {
         data,
         currentPage,
         pageSize,
         error,
         handlePageChange,
         handleSearch,
         handlePageSizeChange,
         isModalOpen,
         isDeleteModalOpen,
         selectedCategory,
         isSaving,
         isDeleting,
         openCreateModal,
         closeModal,
         closeDeleteModal,
         openEditModal,
         openDeleteModal,
         handleSaveCategory,
         handleDeleteCategory,
   } = useCategoriesPage({ initialData });

   return (
      <>
         {error && ( ToastService.error("The list could not be loaded") )}

         <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <CategoriesTable
               categories={data.content}
               totalItems={data.totalElements}
               currentPage={currentPage}
               totalPages={data.totalPages}
               onPageChange={handlePageChange}
               onSearch={handleSearch}
               onPageSizeChange={handlePageSizeChange}
               pageSize={pageSize}
               onEditCategory={openEditModal}
               onDeleteCategory={openDeleteModal}
               openCreateModal={openCreateModal}
               onCreate={true}
            />
         </div>
         
         <CategoryModal
            key={selectedCategory?.id ?? "new"}
            isOpen={isModalOpen}
            onClose={closeModal}
            category={selectedCategory}
            isLoading={isSaving}
            onSave={handleSaveCategory}
         />

         <DeleteCategoryModal
            isOpen={isDeleteModalOpen}
            category={selectedCategory}
            isLoading={isDeleting}
            onCancel={closeDeleteModal}
            onConfirm={handleDeleteCategory}
         />
      </>
   );
}
