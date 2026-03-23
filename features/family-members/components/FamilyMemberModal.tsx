"use client";

import { useMemo, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { FamilyMember } from "@/types/FamilyMember";
import { SaveFamilyMemberPayload } from "@/services/familyMembersService";
import DatePicker from "@/components/form/date-picker";

interface FamilyMemberModalProps {
   isOpen: boolean;
   isLoading?: boolean;
   familyMember?: FamilyMember | null;
   onClose: () => void;
   onSave: (payload: SaveFamilyMemberPayload) => Promise<void>;
}

export default function FamilyMemberModal({
   isOpen,
   isLoading = false,
   familyMember,
   onClose,
   onSave,
}: FamilyMemberModalProps) {

   const [name, setName] = useState(familyMember?.name ?? "");
   const [birthDate, setBirthDate] = useState(familyMember?.birthDate ?? "");
   const [isEnabled, setIsEnabled] = useState(familyMember?.isEnabled ? "true": "false");
   const [touched, setTouched] = useState(false);

   const isEditMode = useMemo(() => Boolean(familyMember?.id), [familyMember]);
   const resetKey = familyMember?.id ?? "new";

   const statusOptions = [
      { value: "true", label: "Enabled" },
      { value: "false", label: "Disabled" },
   ];

   const nameError = touched && name.trim().length === 0;
   const birthDateError = touched && birthDate.trim().length === 0;
   const statusError = isEditMode && touched && isEnabled.trim().length === 0;

   const handleSave = async () => {
      setTouched(true);

      // Verificamos que los campos no estén vacíos y sean numéricos.
      const hasInvalidFields =
         name.trim().length === 0
         || birthDate.trim().length === 0
         || (isEditMode && isEnabled.trim().length === 0);

      // Si hay campos inválidos, no se puede guardar el familiar.
      if (hasInvalidFields) return;

      // Creamos el payload para guardar el familiar.
      const payload: SaveFamilyMemberPayload = {
         name: name.trim(),
         birthDate: birthDate.trim(),
      };

      // Si es un edit, se agrega el estado del familiar.
      if (isEditMode) payload.isEnabled = isEnabled === "true";

      // Guardamos el familiar.
      await onSave(payload);
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 space-y-6">
            <div className="mb-6">
               <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  {isEditMode ? "Edit family member" : "New family member"}
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEditMode
                     ? "Update the family member information."
                     : "Complete the information to create a new family member."}
               </p>
            </div>

            <div>
               <Label htmlFor="name">Name</Label>
               <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Alex, Emma, etc."
                  error={nameError}
                  hint={nameError ? "Name is required" : undefined}
               />
            </div>

            <div>
               <DatePicker
                  key={`birthDate-${resetKey}-${isOpen ? "open" : "closed"}`}
                  id="birthDate"
                  label="Birth date"
                  placeholder="Select date"
                  defaultDate={birthDate || undefined}
                  onChange={(_, birthDateStr) => setBirthDate(birthDateStr)}
                  error={birthDateError}
                  hint={birthDateError ? "Birth date is required" : undefined}
               />
            </div>

            {isEditMode ? (
               <>
                  {familyMember?.email ? (
                     <div>
                        <Label htmlFor="name">Email</Label>
                        <Input
                           id="email"
                           name="email"
                           value={familyMember?.email ?? ""}
                           disabled
                           placeholder="E.g. email@gmail.com"
                        />
                     </div>
                  ) : null}
                  <div>
                     <Label>Status</Label>
                     <div className="relative">
                        <Select
                           key={`status-${resetKey}-${isOpen ? "open" : "closed"}`}
                           options={statusOptions}
                           defaultValue={isEnabled}
                           onChange={(value) => setIsEnabled(value)}
                           placeholder="Select status"
                           error={statusError}
                           hint={statusError ? "Status is required" : undefined}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                           <ChevronDownIcon/>
                        </span>
                     </div>
                  </div>
               </>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancel
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Create family member"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
