"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ChevronDownIcon } from "@/icons";
import { SaveUserPayload } from "@/services/usersService";
import { User } from "@/types/User";

interface UserModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (payload: SaveUserPayload) => Promise<void>;
   isLoading?: boolean;
   user?: User | null;
}

const roleOptions = [
   { value: "admin", label: "Admin" },
   { value: "owner", label: "Owner" },
   { value: "user", label: "User" },
];

const statusOptions = [
   { value: "true", label: "Enabled" },
   { value: "false", label: "Disabled" },
];

export default function UserModal({
   isOpen,
   onClose,
   onSave,
   isLoading = false,
   user = null,
}: UserModalProps) {
   const [form, setForm] = useState<SaveUserPayload>({
      enable: user?.enable ?? false,
      admin: user?.isAdmin ?? false,
      isOwnerUser: user?.isOwnerUser ?? false,
   });

   const isEditMode = useMemo(() => Boolean(user?.id), [user]);

   useEffect(() => {
      if (!isOpen) return;

   }, [isOpen, user]);

   const selectedRole = form.admin ? "admin" : form.isOwnerUser ? "owner" : "user";
   const selectedStatus = form.enable ? "true" : "false";

   const handleRoleChange = (value: string) => {
      if (value === "admin") {
         setForm((prev) => ({ ...prev, admin: true, isOwnerUser: false }));
         return;
      }

      if (value === "owner") {
         setForm((prev) => ({ ...prev, admin: false, isOwnerUser: true }));
         return;
      }

      setForm((prev) => ({ ...prev, admin: false, isOwnerUser: false }));
   };

   const handleStatusChange = (value: string) => {
      setForm((prev) => ({ ...prev, enable: value === "true" }));
   };

   const handleSave = async () => {
      if (!user?.id) return;
      await onSave(form);
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
            <div className="mb-6">
               <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  {isEditMode ? "Edit user" : "New user"}
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEditMode
                     ? "Update the user information."
                     : "Complete the information to create a new user."}
               </p>
            </div>

            <div className="grid grid-cols-1 gap-y-5">
               <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                     id="email"
                     name="email"
                     placeholder="Ej. user@email.com"
                     disabled={isEditMode ? true : false}
                     value={user?.email}
                  />
               </div>
               <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                     id="username"
                     name="username"
                     disabled={isEditMode ? true : false}
                     placeholder="Ej. jdoe"
                     value={user?.username}
                  />
               </div>
               <div>
                  <Label htmlFor="role">Role</Label>
                  <div className="relative">
                     <Select
                        key={`role-${user?.id ?? "new"}-${isOpen ? "open" : "close"}`}
                        options={roleOptions}
                        placeholder="Select role"
                        onChange={handleRoleChange}
                        defaultValue={selectedRole}
                        className="dark:bg-dark-900"
                     />
                     <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon/>
                     </span>
                  </div>
               </div>
               <div>
                  <Label htmlFor="role">Status</Label>
                  <div className="relative">
                     <Select
                        key={`status-${user?.id ?? "new"}-${isOpen ? "open" : "close"}`}
                        options={statusOptions}
                        placeholder="Select status"
                        onChange={handleStatusChange}
                        defaultValue={selectedStatus}
                        className="dark:bg-dark-900"
                     />
                     <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon/>
                     </span>
                  </div>
               </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancelar
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Create user"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
