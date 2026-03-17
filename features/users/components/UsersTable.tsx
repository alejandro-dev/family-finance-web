"use client";

import Badge from "@/components/ui/badge/Badge";
import { DataTable } from "@/components/ui/table/DataTable";
import TrashIcon from '@/icons/trash.svg';
import PencilIcon from '@/icons/pencil.svg';
import EyeIcon from "@/icons/eye.svg";
import { User } from "@/types/User";

interface UsersTableProps {
   users: User[];
   totalItems: number;
   currentPage: number;
   totalPages: number;
   pageSize: number;
   onPageChange: (page: number) => void;
   onSearch?: (search: string) => void;
   onPageSizeChange: (pageSize: number) => void;
   onViewUser: (user: User) => void;
   onEditUser: (user: User) => void;
   onDeleteUser: (user: User) => void;
}

export default function UsersTable({
   users,
   totalItems,
   currentPage,
   totalPages,
   pageSize,
   onPageChange,
   onSearch,
   onPageSizeChange,
   onViewUser,
   onEditUser,
   onDeleteUser
}: UsersTableProps) {
   return (
      <DataTable
         data={users}
         columns={[
            {
               header: "Username",
               accessor: "username",
            },
            {
               header: "Email",
               accessor: "email",
            },
            {
               header: "Role",
               render: (user) => (
                  <Badge
                     size="sm"
                     color={user.isAdmin ? "primary" : user.isOwnerUser ? "info" : "warning"}
                  >
                     {user.isAdmin ? 'Admin' : user.isOwnerUser ? "Propietario" : 'User'}
                  </Badge>
               )
            },
            {
               header: "Status",
               render: (user) => (
                  <Badge
                     size="sm"
                     color={user.enable ? "success": "error"}
                  >
                     {user.enable ? 'Enabled': 'Disabled'}
                  </Badge>
               )
            },
            {
               header: "Actions",
               render: (user) => (
                  <>
                     {!user.isAdmin ?(
                        <div className="flex items-center gap-2">
                           <button className="hover:text-yellow-500 dark:hover:text-yellow-400" onClick={() => onViewUser(user)}>
                              <EyeIcon className="w-5 h-5" title="Show User" />
                           </button>
                  
                           <button className="hover:text-blue-500 dark:hover:text-blue-400" onClick={() => onEditUser(user)}>
                              <PencilIcon className="w-5 h-5" title="Edit User" />
                           </button>
                           
                           <button className="hover:text-red-500 dark:hover:text-red-400" onClick={() => onDeleteUser(user)}>
                              <TrashIcon className="w-5 h-5" title="Delete User" />
                           </button>
                        </div>
                     ): ''}
                  </>
               ),
            },
         ]}
         currentPage={currentPage}
         totalPages={totalPages}
         pageSize={pageSize}
         totalItems={totalItems}
         onPageChange={onPageChange}
         onPageSizeChange={onPageSizeChange}
         onSearch={onSearch}
         searchPlaceholder="Search users..."
         title="Users"
      />
   );
}
