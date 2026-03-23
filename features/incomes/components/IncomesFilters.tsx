"use client";

import { FamilyMember } from "@/types/FamilyMember";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";

interface IncomesFiltersProps {
   startDate: string;
   endDate: string;
   familyMemberIdFilter: string;
   familyMembersOptions: FamilyMember[];
   onFiltersChange: (payload: {
      startDate?: string;
      endDate?: string;
      familyMemberIdFilter?: string;
   }) => void;
}

export default function IncomesFilters({
   startDate,
   endDate,
   familyMemberIdFilter,
   familyMembersOptions,
   onFiltersChange,
}: IncomesFiltersProps) {
   // Normalizamos opciones de familiar.
   const familyMemberSelectOptions = [
      { value: "all", label: "All" },
      ...familyMembersOptions.map((familyMember) => ({ value: familyMember.id, label: familyMember.name })),
   ];

   // Evento que se dispara cuando se limpia el filtro.
   const handleClearFilters = () => {
      onFiltersChange({
         startDate: "",
         endDate: "",
         familyMemberIdFilter: "all",
      });
   };

   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Income filters</h2>
            <Button size="sm" variant="outline" onClick={handleClearFilters}>
               Clear
            </Button>
         </div>

         <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
               <DatePicker
                  key={`income-start-${startDate || "empty"}`}
                  id="incomeStartDate"
                  label="From"
                  placeholder="Select date"
                  defaultDate={startDate || undefined}
                  onChange={(_, dateStr) => onFiltersChange({ startDate: dateStr })}
               />
            </div>
            <div>
               <DatePicker
                  key={`income-end-${endDate || "empty"}`}
                  id="incomeEndDate"
                  label="To"
                  placeholder="Select date"
                  defaultDate={endDate || undefined}
                  onChange={(_, dateStr) => onFiltersChange({ endDate: dateStr })}
               />
            </div>
            <div>
               <Label htmlFor="income-family-member-filter">Family member</Label>
               <div className="relative">
                  <Select
                     key={`income-member-${familyMemberIdFilter}`}
                     options={familyMemberSelectOptions}
                     onChange={(value) => onFiltersChange({ familyMemberIdFilter: value })}
                     defaultValue={familyMemberIdFilter}
                     placeholder="Select family member"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon />
                  </span>
               </div>
            </div>
         </div>
      </section>
   );
}
