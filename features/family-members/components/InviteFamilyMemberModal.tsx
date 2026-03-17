"use client";

import { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Category } from "@/types/Category";
import { InviteFamilyMemberPayload } from "@/services/familyMembersService";

interface InviteFamilyMemberModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (payload: InviteFamilyMemberPayload) => Promise<void>;
   isLoading?: boolean;
   category?: Category | null;
}

export default function InviteFamilyMemberModal({
   isOpen,
   onClose,
   onSave,
   isLoading = false,
}: InviteFamilyMemberModalProps) {
   const [email, setEmail] = useState("");
   const [touched, setTouched] = useState(false);

   const hasError = touched && email.trim().length === 0;

   const handleClose = () => {
      setEmail("");
      setTouched(false);
      onClose();
   };

   const handleSave = async () => {
      setTouched(true);

      const normalizedEmail = email.trim();
      if (!normalizedEmail) return;

      await onSave({ email: normalizedEmail });
   };

   return (
      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-xl m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
            <div className="mb-6">
               <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  Invitar familiar
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Ingresa el email del familiar que deseas invitar a tu familia.
               </p>
            </div>

            <div>
               <Label htmlFor="email">Email</Label>
               <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej. email@gmail.com"
                  error={hasError}
                  hint={hasError ? "El email es obligatorio" : undefined}
               />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={handleClose} disabled={isLoading}>
                  Cancelar
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Sending invitation..." : "Send invitation"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
