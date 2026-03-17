"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/table/DataTable";
import { EyeIcon, PencilIcon } from "@/icons";
import { FamilyMember } from "@/types/FamilyMember";

export interface FamilyMembersDataTableProps {
   rows: FamilyMember[];
   totalItems: number;
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onPageSizeChange: (pageSize: number) => void;
   openCreateModal?: () => void;
   onEditFamilyMember?: (familyMember: FamilyMember) => void;
   onInviteFamilyMember?: () => void;
   onViewFamilyMember?: (familyMember: FamilyMember) => void;
}

export default function FamilyMembersDataTable({
   rows,
   totalItems,
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onPageSizeChange,
   openCreateModal,
   onEditFamilyMember,
   onInviteFamilyMember,
   onViewFamilyMember
}: FamilyMembersDataTableProps) {

   // Si no se pueden editar ni eliminar, no mostramos las acciones.
   const showActions = Boolean(onEditFamilyMember);

   // Si no se puede crear, no mostramos el botón de crear.
   const canCreateExpense = Boolean(openCreateModal);

   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-white/3 lg:p-2">
         {/* Esta tabla ya está preparada para paginación y grandes volúmenes de datos. */}
         <DataTable
            title="Family members"
            data={rows}
            columns={[
               { header: "Name", accessor: "name" },
               { header: "Role", 
                  render: (row) => (
                     <Badge size="sm"  color={row.isOwner ? "info" : "warning"}>
                        {row.isOwner ? 'Owner': 'User'}
                     </Badge>
                  )
               },
               {
                  header: "Enable",
                  render: (row) => (
                     <Badge
                        size="sm"
                        color={row.isEnabled ? "success": "error"}
                     >
                        {row.isEnabled ? 'Enabled': 'Disabled'}
                     </Badge>
               )
               },
               ...(showActions ? [{
                  header: "Actions",
                  render: (familyMember: FamilyMember) => (
                     <div className="flex items-center gap-2">
                        {onViewFamilyMember && (
                           <button className="hover:text-yellow-500 dark:hover:text-yellow-400" onClick={() => onViewFamilyMember(familyMember)}>
                              <EyeIcon className="w-5 h-5" title="Show User" />
                           </button>
                        )}
                        {onEditFamilyMember && (
                        <button
                           className="hover:text-blue-500 dark:hover:text-blue-400"
                           onClick={() => onEditFamilyMember(familyMember)}
                        >
                           <PencilIcon className="w-5 h-5" title="Edit User" />
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
            createButtonText="New family member"
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            onCreate={canCreateExpense}
            openCreateModal={openCreateModal}
            onInviteFamilyMember={onInviteFamilyMember}
         />
      </div>
   );
}
