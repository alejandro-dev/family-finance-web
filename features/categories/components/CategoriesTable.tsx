"use client";

import { DataTable } from "@/components/ui/table/DataTable";
import TrashIcon from '@/icons/trash.svg';
import PencilIcon from '@/icons/pencil.svg';
import { Category } from "@/types/Category";

interface CategoriesTableProps {
   categories: Category[];
   totalItems: number;
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onSearch?: (search: string) => void;
   onPageSizeChange: (pageSize: number) => void;
   onEditCategory: (category: Category) => void;
   onDeleteCategory: (category: Category) => void;
   openCreateModal: () => void;
   onCreate?: boolean;
}

export default function CategoriesTable({
   categories,
   totalItems,
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onSearch,
   onPageSizeChange,
   onEditCategory,
   onDeleteCategory,
   openCreateModal,
   onCreate = false
}: CategoriesTableProps) {
   return (
      <DataTable
         data={categories}
         columns={[
            {
               header: "Name",
               accessor: "name",
            },
            {
               header: "Actions",
               render: (category) => (
                  <div className="flex items-center gap-2">
                     <button
                        className="hover:text-blue-500 dark:hover:text-blue-400"
                        onClick={() => onEditCategory(category)}
                     >
                        <PencilIcon className="w-5 h-5" title="Edit category" />
                     </button>
                     <button
                        className="hover:text-red-500 dark:hover:text-red-400"
                        onClick={() => onDeleteCategory(category)}
                     >
                        <TrashIcon className="w-5 h-5" title="Delete category" />
                     </button>
                  </div>
               ),
            },
         ]}
         currentPage={currentPage}
         totalPages={totalPages}
         pageSize={pageSize}
         totalItems={totalItems}
         onCreate={onCreate}
         searchPlaceholder="Search categories..."
         title="Categories"
         createButtonText="New category"
         onPageChange={onPageChange}
         onPageSizeChange={onPageSizeChange}
         onSearch={onSearch}
         openCreateModal={openCreateModal}
      />
   );
}
