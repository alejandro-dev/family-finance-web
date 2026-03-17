"use client";

import { useMemo, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { CategoryOption, Expense } from "@/features/users/types/userAnalytics";
import { SaveExpensePayload } from "@/services/expensesService";
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { FamilyMember } from "@/types/FamilyMember";
import Switch from "@/components/form/switch/Switch";

interface ExpenseModalProps {
   isOpen: boolean;
   isLoading?: boolean;
   expense?: Expense | null;
   categoriesOptions: CategoryOption[];
   familyMembersOptions: FamilyMember[];
   onClose: () => void;
   onSave: (payload: SaveExpensePayload) => Promise<void>;
}

export default function ExpenseModal({
   isOpen,
   isLoading = false,
   expense,
   categoriesOptions,
   familyMembersOptions,
   onClose,
   onSave,
}: ExpenseModalProps) {

   const [familyMemberId, setFamilyMemberId] = useState(expense?.familyMemberId ?? "");
   const [description, setDescription] = useState(expense?.description ?? "");
   const [amount, setAmount] = useState(expense?.amount !== undefined ? String(expense.amount) : "");
   const [categoryId, setCategoryId] = useState(expense?.categoryId ?? "");
   const [date, setDate] = useState(expense?.date ?? "");
   const [isRecurring, setIsRecurring] = useState(expense?.isRecurring ?? false);
   const [touched, setTouched] = useState(false);

   const isEditMode = useMemo(() => Boolean(expense?.id), [expense]);
   const resetKey = expense?.id ?? "new";
   const amountNumber = Number(amount);
   const isAmountInvalid = !amount.trim() || !Number.isFinite(amountNumber) || amountNumber <= 0;

   const familyMemberError = touched && familyMemberId.trim().length === 0;
   const descriptionError = touched && description.trim().length === 0;
   const amountError = touched && amount.trim().length === 0;
   const categoryError = touched && categoryId.trim().length === 0;
   const dateError = touched && date.trim().length === 0;

   // Evento para cambiar el estado del switch de recurrencia.
   const handleSwitchChange = (checked: boolean) => {
      setIsRecurring(checked);
   };

   // Evento para guardar el gasto.
   const handleSave = async () => {
      setTouched(true);

      // Verificamos que los campos no estén vacíos y sean numéricos.
      const hasInvalidFields =
         familyMemberId.trim().length === 0 ||
         description.trim().length === 0 ||
         !Number.isFinite(amountNumber) ||
         amountNumber <= 0 ||
         categoryId.trim().length === 0 ||
         date.trim().length === 0 ||
         isRecurring === undefined;

      // Si hay campos inválidos, no se puede guardar el gasto.
      if (hasInvalidFields) return;

      // Guardamos el gasto.
      await onSave({
         familyMemberId: familyMemberId.trim(),
         description: description.trim(),
         amount: amountNumber,
         categoryId: categoryId.trim(),
         date: date.trim(),
         isRecurring: isRecurring,
      });
   };

   // Transformamos las opciones de categoría y miembros de familia a un tipo Option que es un formato compatible con el Select.
   const categorySelectOptions = [
      ...categoriesOptions.map((category) => ({ value: category.id, label: category.name })),
   ];
   const familyMemberSelectOptions = [
      ...familyMembersOptions.map((familyMember) => ({ value: familyMember.id, label: familyMember.name })),
   ];

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900 space-y-6">
            <div className="mb-6">
               <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  {isEditMode ? "Edit expense" : "New expense"}
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEditMode
                     ? "Update the expense information."
                     : "Complete the information to create a new expense."}
               </p>
            </div>

            <div>
               <Label>Member</Label>
               <div className="relative">
                  <Select
                     key={`member-${resetKey}-${isOpen ? "open" : "closed"}`}
                     options={familyMemberSelectOptions}
                     defaultValue={familyMemberId}
                     onChange={(value) => setFamilyMemberId(value)}
                     placeholder="Select member"
                     error={familyMemberError}
                     hint={familyMemberError ? "Member is required" : undefined}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon/>
                  </span>
               </div>
            </div>

            <div>
               <Label htmlFor="description">Description</Label>
               <Input
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. Netflix, Grocery store, etc."
                  error={descriptionError}
                  hint={descriptionError ? "Description is required" : undefined}
               />
            </div>

            <div>
               <Label htmlFor="amount">Amount</Label>
               <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="E.g. 100"
                  error={amountError}
                  hint={amountError ? "Amount is required" : undefined}
               />
            </div>

            <div>
               <Label>Category</Label>
               <div className="relative">
                  <Select
                     key={`category-${resetKey}-${isOpen ? "open" : "closed"}`}
                     options={categorySelectOptions}
                     defaultValue={categoryId}
                     onChange={(value) => setCategoryId(value)}
                     placeholder="Select category"
                     error={categoryError}
                     hint={categoryError ? "Category is required" : undefined}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon/>
                  </span>
               </div>
            </div>

            <div>
               <DatePicker
                  key={`date-${resetKey}-${isOpen ? "open" : "closed"}`}
                  id="expenseDate"
                  label="Date"
                  placeholder="Select date"
                  defaultDate={date || undefined}
                  onChange={(_, dateStr) => setDate(dateStr)}
                  error={dateError}
                  hint={dateError ? "Date is required" : undefined}
               />
            </div>

            <div>
                <Switch
                  label="Is recurring"
                  defaultChecked={expense?.isRecurring ?? false}
                  onChange={handleSwitchChange}
               />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancel
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading || isAmountInvalid}>
                  {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Create expense"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
