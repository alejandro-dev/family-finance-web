"use client";

import { DataTable } from "@/components/ui/table/DataTable";
import { Expense } from "@/features/users/types/userAnalytics";
import { PencilIcon, TrashBinIcon } from "@/icons";

export interface ExpensesDataTableProps {
   rows: Expense[];
   totalItems: number;
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (pageSize: number) => void;
   openCreateModal?: () => void;
   onEditExpense?: (expense: Expense) => void;
   onDeleteExpense?: (expense: Expense) => void;
}

export default function ExpensesDataTable({
   rows,
   totalItems,
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onPageSizeChange,
   openCreateModal,
   onEditExpense,
   onDeleteExpense
}: ExpensesDataTableProps) {

   // Si no se pueden editar ni eliminar, no mostramos las acciones.
   const showActions = Boolean(onEditExpense || onDeleteExpense);

   // Si no se puede crear, no mostramos el botón de crear.
   const canCreateExpense = Boolean(openCreateModal);

   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/3 lg:p-2">
         {/* Esta tabla ya está preparada para paginación y grandes volúmenes de datos. */}
         <DataTable
            title="Expenses"
            data={rows}
            columns={[
               { header: "Concepto", accessor: "description" },
               { header: "Category", accessor: "categoryName" },
               {
                  header: "Importe",
                  render: (row) => `${row.amount.toFixed(2)} EUR`,
               },
               { header: "Miembro", accessor: "familyMemberName" },
               { header: "Fecha", accessor: "date" },
               ...(showActions ? [{
                  header: "Actions",
                  render: (expense: Expense) => (
                     <div className="flex items-center gap-2">
                        {onEditExpense && (
                        <button
                           className="hover:text-blue-500 dark:hover:text-blue-400"
                           onClick={() => onEditExpense(expense)}
                        >
                           <PencilIcon className="w-5 h-5" title="Edit User" />
                        </button>
                        )}
                        {onDeleteExpense && (
                        <button
                           className="hover:text-red-500 dark:hover:text-red-400"
                           onClick={() => onDeleteExpense(expense)}
                        >
                           <TrashBinIcon className="w-5 h-5" title="Delete User" />
                        </button>
                        )}
                     </div>
                  ),
                  }]
               : []),
            ]}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            createButtonText="New expense"
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onCreate={canCreateExpense}
            openCreateModal={openCreateModal}
         />
      </div>
   );
}
