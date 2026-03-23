"use client";

import { DataTable } from "@/components/ui/table/DataTable";
import { IncomeRule } from "@/features/incomes/types/incomes";
import { PencilIcon, TrashBinIcon } from "@/icons";

export interface IncomeRulesDataTableProps {
   rows: IncomeRule[];
   totalItems: number;
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (pageSize: number) => void;
   openCreateModal?: () => void;
   onEditRule?: (rule: IncomeRule) => void;
   onDeleteRule?: (rule: IncomeRule) => void;
}

export default function IncomeRulesDataTable({
   rows,
   totalItems,
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onPageSizeChange,
   openCreateModal,
   onEditRule,
   onDeleteRule,
}: IncomeRulesDataTableProps) {
   const showActions = Boolean(onEditRule || onDeleteRule);
   const canCreateRule = Boolean(openCreateModal);

   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/3 lg:p-2">
         <DataTable
            title="Recurring rules"
            data={rows}
            columns={[
               { header: "Description", accessor: "description" },
               {
                  header: "Amount",
                  render: (row: IncomeRule) => `${row.amount.toFixed(2)} EUR`,
               },
               {
                  header: "Member",
                  render: (row: IncomeRule) => row.familyMemberName || "-",
               },
               {
                  header: "Date",
                  accessor: "date",
               },
               {
                  header: "Status",
                  render: (row: IncomeRule) => (row.isActive ? "Active" : "Inactive"),
               },
               ...(showActions
                  ? [
                       {
                          header: "Actions",
                          render: (rule: IncomeRule) => (
                             <div className="flex items-center gap-2">
                                {onEditRule && (
                                   <button
                                      className="hover:text-blue-500 dark:hover:text-blue-400"
                                      onClick={() => onEditRule(rule)}
                                   >
                                      <PencilIcon className="w-5 h-5" title="Edit Rule" />
                                   </button>
                                )}
                                {onDeleteRule && (
                                   <button
                                      className="hover:text-red-500 dark:hover:text-red-400"
                                      onClick={() => onDeleteRule(rule)}
                                   >
                                      <TrashBinIcon className="w-5 h-5" title="Delete Rule" />
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
            createButtonText="New rule"
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onCreate={canCreateRule}
            openCreateModal={openCreateModal}
         />
      </div>
   );
}
