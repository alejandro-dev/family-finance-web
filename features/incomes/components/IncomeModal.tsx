"use client";

import { useMemo, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { FamilyMember } from "@/types/FamilyMember";
import { CategoryOption } from "@/features/users/types/userAnalytics";
import { Income } from "@/features/incomes/types/incomes";
import { SaveIncomePayload } from "@/services/incomesService";

interface IncomeModalProps {
   isOpen: boolean;
   isLoading?: boolean;
   income?: Income | null;
   categoriesOptions: CategoryOption[];
   familyMembersOptions: FamilyMember[];
   onClose: () => void;
   onSave: (payload: SaveIncomePayload) => Promise<void>;
}

export default function IncomeModal({
   isOpen,
   isLoading = false,
   income,
   categoriesOptions,
   familyMembersOptions,
   onClose,
   onSave,
}: IncomeModalProps) {
   const [familyMemberId, setFamilyMemberId] = useState(income?.familyMemberId ?? "");
   const [description, setDescription] = useState(income?.description ?? "");
   const [amount, setAmount] = useState(income?.amount !== undefined ? String(income.amount) : "");
   const [categoryId, setCategoryId] = useState(income?.categoryId ?? "");
   const [date, setDate] = useState(income?.date ?? "");
   const [touched, setTouched] = useState(false);

   const isEditMode = useMemo(() => Boolean(income?.id), [income]);
   const resetKey = income?.id ?? "new";
   const amountNumber = Number(amount);
   const isAmountInvalid = !amount.trim() || !Number.isFinite(amountNumber) || amountNumber <= 0;

   const familyMemberError = touched && familyMemberId.trim().length === 0;
   const descriptionError = touched && description.trim().length === 0;
   const amountError = touched && amount.trim().length === 0;
   const categoryError = touched && categoryId.trim().length === 0;
   const dateError = touched && date.trim().length === 0;

   // Evento que se dispara cuando se guarda o actualiza un ingreso.
   const handleSave = async () => {
      setTouched(true);

      // Verifica si hay campos invalidos.
      const hasInvalidFields =
         familyMemberId.trim().length === 0 ||
         description.trim().length === 0 ||
         !Number.isFinite(amountNumber) ||
         amountNumber <= 0 ||
         categoryId.trim().length === 0 ||
         date.trim().length === 0;

      // Si hay campos invalidos, no se guarda el ingreso.
      if (hasInvalidFields) return;

      // Se guarda el ingreso.
      await onSave({
         familyMemberId: familyMemberId.trim(),
         description: description.trim(),
         amount: amountNumber,
         categoryId: categoryId.trim(),
         date: date.trim(),
      });
   };

   // Normalizamos opciones de categorías.
   const categorySelectOptions = [
      ...categoriesOptions.map((category) => ({ value: category.id, label: category.name })),
   ];

   // Normalizamos opciones de miembros.
   const familyMemberSelectOptions = [
      ...familyMembersOptions.map((familyMember) => ({ value: familyMember.id, label: familyMember.name })),
   ];

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 space-y-6">
            <div className="mb-6">
               <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  {isEditMode ? "Edit income" : "New income"}
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEditMode
                     ? "Update the income information."
                     : "Complete the information to create a one-time income entry."}
               </p>
            </div>

            <div>
               <Label>Member</Label>
               <div className="relative">
                  <Select
                     key={`income-member-${resetKey}-${isOpen ? "open" : "closed"}`}
                     options={familyMemberSelectOptions}
                     defaultValue={familyMemberId}
                     onChange={(value) => setFamilyMemberId(value)}
                     placeholder="Select member"
                     error={familyMemberError}
                     hint={familyMemberError ? "Member is required" : undefined}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon />
                  </span>
               </div>
            </div>

            <div>
               <Label htmlFor="income-description">Description</Label>
               <Input
                  id="income-description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. Salary, Bonus, etc."
                  error={descriptionError}
                  hint={descriptionError ? "Description is required" : undefined}
               />
            </div>

            <div>
               <Label htmlFor="income-amount">Amount</Label>
               <Input
                  type="number"
                  id="income-amount"
                  name="amount"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="E.g. 1500"
                  error={amountError}
                  hint={amountError ? "Amount is required" : undefined}
               />
            </div>

            <div>
               <Label>Category</Label>
               <div className="relative">
                  <Select
                     key={`income-category-${resetKey}-${isOpen ? "open" : "closed"}`}
                     options={categorySelectOptions}
                     defaultValue={categoryId}
                     onChange={(value) => setCategoryId(value)}
                     placeholder="Select category"
                     error={categoryError}
                     hint={categoryError ? "Category is required" : undefined}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon />
                  </span>
               </div>
            </div>

            <div>
               <DatePicker
                  key={`income-date-${resetKey}-${isOpen ? "open" : "closed"}`}
                  id="incomeDate"
                  label="Date"
                  placeholder="Select date"
                  defaultDate={date || undefined}
                  onChange={(_, dateStr) => setDate(dateStr)}
                  error={dateError}
                  hint={dateError ? "Date is required" : undefined}
               />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancel
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading || isAmountInvalid}>
                  {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Create income"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
