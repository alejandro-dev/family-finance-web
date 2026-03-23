"use client";

import { DataTable } from "@/components/ui/table/DataTable";
import { Income } from "@/features/incomes/types/incomes";
import { PencilIcon, TrashBinIcon } from "@/icons";

export interface IncomesDataTableProps {
   rows: Income[];
   totalItems: number;
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (pageSize: number) => void;
   openCreateModal?: () => void;
   onEditIncome?: (income: Income) => void;
   onDeleteIncome?: (income: Income) => void;
}

export default function IncomesDataTable({
   rows,
   totalItems,
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onPageSizeChange,
   openCreateModal,
   onEditIncome,
   onDeleteIncome,
}: IncomesDataTableProps) {
   const showActions = Boolean(onEditIncome || onDeleteIncome);
   const canCreateIncome = Boolean(openCreateModal);

   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/3 lg:p-2">
         <DataTable
            title="Incomes"
            data={rows}
            columns={[
               { header: "Description", accessor: "description" },
               {
                  header: "Amount",
                  render: (row: Income) => `${row.amount.toFixed(2)} EUR`,
               },
               {
                  header: "Source",
                  render: (row: Income) => {
                     if (row.sourceType === "RECURRING_OVERRIDE") {
                        return "Override";
                     }
                     if (row.sourceType === "RECURRING_GENERATED") {
                        return "Recurring";
                     }
                     return "Manual";
                  },
               },
               {
                  header: "Member",
                  render: (row: Income) => row.familyMemberName || "-",
               },
               { header: "Date", accessor: "date" },
               ...(showActions
                  ? [
                       {
                          header: "Actions",
                          render: (income: Income) => (
                             <div className="flex items-center gap-2">
                                {onEditIncome && (
                                   <button
                                      className="hover:text-blue-500 dark:hover:text-blue-400"
                                      onClick={() => onEditIncome(income)}
                                   >
                                      <PencilIcon className="w-5 h-5" title="Edit Income" />
                                   </button>
                                )}
                                {onDeleteIncome && (
                                   <button
                                      className="hover:text-red-500 dark:hover:text-red-400"
                                      onClick={() => onDeleteIncome(income)}
                                   >
                                      <TrashBinIcon className="w-5 h-5" title="Delete Income" />
                                   </button>
                                )}
                             </div>
                          ),
                       },
                    ]
                  : []),
            ]}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            createButtonText="New income"
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onCreate={canCreateIncome}
            openCreateModal={openCreateModal}
         />
      </div>
   );
}
