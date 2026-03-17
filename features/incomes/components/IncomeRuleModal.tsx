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
import { IncomeRule } from "@/features/incomes/types/incomes";
import { SaveIncomeRulePayload } from "@/services/incomeRulesService";
import Switch from "@/components/form/switch/Switch";

interface IncomeRuleModalProps {
   isOpen: boolean;
   isLoading?: boolean;
   incomeRule?: IncomeRule | null;
   categoriesOptions: CategoryOption[];
   familyMembersOptions: FamilyMember[];
   onClose: () => void;
   onSave: (payload: SaveIncomeRulePayload) => Promise<void>;
}

export default function IncomeRuleModal({
   isOpen,
   isLoading = false,
   incomeRule,
   categoriesOptions,
   familyMembersOptions,
   onClose,
   onSave,
}: IncomeRuleModalProps) {
   const [familyMemberId, setFamilyMemberId] = useState(incomeRule?.familyMemberId ?? "");
   const [description, setDescription] = useState(incomeRule?.description ?? "");
   const [amount, setAmount] = useState(incomeRule?.amount !== undefined ? String(incomeRule.amount) : "");
   const [categoryId, setCategoryId] = useState(incomeRule?.categoryId ?? "");
   const [date, setDate] = useState(incomeRule?.date ?? "");
   const [isActive, setIsActive] = useState(incomeRule?.isActive ?? true);
   const [touched, setTouched] = useState(false);

   const isEditMode = useMemo(() => Boolean(incomeRule?.id), [incomeRule]);
   const resetKey = incomeRule?.id ?? "new";

   const amountNumber = Number(amount);

   const isAmountInvalid = !amount.trim() || !Number.isFinite(amountNumber) || amountNumber <= 0;

   const familyMemberError = touched && familyMemberId.trim().length === 0;
   const descriptionError = touched && description.trim().length === 0;
   const amountError = touched && isAmountInvalid;
   const dateError = touched && date.trim().length === 0;

   // Evento que se dispara cuando se guarda o actualiza una regla.
   const handleSave = async () => {
      setTouched(true);

      // Verifica si hay campos invalidos.
      const hasInvalidFields =
         familyMemberId.trim().length === 0 ||
         description.trim().length === 0 ||
         isAmountInvalid ||
         date.trim().length === 0;

      // Si hay campos invalidos, no se guarda la regla.
      if (hasInvalidFields) return;

      // Se guarda la regla.
      await onSave({
         familyMemberId: familyMemberId.trim(),
         description: description.trim(),
         amount: amountNumber,
         categoryId: categoryId.trim() || undefined,
         date: date.trim(),
         isActive,
      });
   };

   // Normalizamos opciones de categorías.
   const categorySelectOptions = [
      { value: "", label: "Uncategorized" },
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
                  {isEditMode ? "Edit rule" : "New recurring rule"}
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEditMode
                     ? "Update the recurring rule information."
                     : "Set up recurring income to generate months automatically."}
               </p>
            </div>

            <div>
               <Label>Member</Label>
               <div className="relative">
                  <Select
                     key={`rule-member-${resetKey}-${isOpen ? "open" : "closed"}`}
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
               <Label htmlFor="rule-description">Description</Label>
               <Input
                  id="rule-description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="E.g. Company X salary"
                  error={descriptionError}
                  hint={descriptionError ? "Description is required" : undefined}
               />
            </div>

            <div>
               <Label htmlFor="rule-amount">Amount</Label>
               <Input
                  type="number"
                  id="rule-amount"
                  name="amount"
                  value={amount}
                  min={0}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="E.g. 1500"
                  error={amountError}
                  hint={amountError ? "Amount must be greater than 0" : undefined}
               />
            </div>

            <div>
               <Label>Category</Label>
               <div className="relative">
                  <Select
                     key={`rule-category-${resetKey}-${isOpen ? "open" : "closed"}`}
                     options={categorySelectOptions}
                     defaultValue={categoryId}
                     onChange={(value) => setCategoryId(value)}
                     placeholder="Select category"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon />
                  </span>
               </div>
            </div>

            <div>
               <DatePicker
                  key={`rule-date-${resetKey}-${isOpen ? "open" : "closed"}`}
                  id="ruleDate"
                  label="Reference date"
                  placeholder="Select date"
                  defaultDate={date || undefined}
                  onChange={(_, dateStr) => setDate(dateStr)}
                  error={dateError}
                  hint={dateError ? "Date is required" : undefined}
               />
            </div>

            <div>
               <Switch label="Active rule" defaultChecked={incomeRule?.isActive ?? true} onChange={setIsActive} />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancel
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading || isAmountInvalid}>
                  {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Create rule"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
