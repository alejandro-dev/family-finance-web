"use client";

import { FamilyMember } from "@/types/FamilyMember";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";
import { CategoryOption } from "@/features/users/types/userAnalytics";

interface ExpensesFiltersProps {
   startDate: string;
   endDate: string;
   categoryFilter: string;
   categoriesOptions: CategoryOption[];
   familyMemberIdFilter: string;
   familyMembersOptions: FamilyMember[];
   onFiltersChange: (payload: {
      startDate?: string;
      endDate?: string;
      categoryIdFilter?: string;
      familyMemberIdFilter?: string;
   }) => void;
}

export default function ExpensesFilters({
   startDate,
   endDate,
   categoryFilter,
   categoriesOptions,
   familyMemberIdFilter,
   familyMembersOptions,
   onFiltersChange,
}: ExpensesFiltersProps) {
   const categorySelectOptions = [
      { value: "all", label: "Todas" },
      ...categoriesOptions.map((category) => ({ value: category.id, label: category.name })),
   ];

   const familyMemberSelectOptions = [
      { value: "all", label: "Todos" },
      ...familyMembersOptions.map((familyMember) => ({ value: familyMember.id, label: familyMember.name })),
   ];

   const handleClearFilters = () => {
      onFiltersChange({
         startDate: "",
         endDate: "",
         categoryIdFilter: "all",
         familyMemberIdFilter: "all",
      });
   };

   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Filtros</h2>
            <Button size="sm" variant="outline" onClick={handleClearFilters}>
               Limpiar
            </Button>
         </div>
         {/* Filtros de alcance global que impactan total, chart y tabla de gastos. */}
         <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            <div>
               <DatePicker
                  key={`startDate-${startDate || "empty"}`}
                  id="startDate"
                  label="Desde"
                  placeholder="Select date"
                  defaultDate={startDate || undefined}
                  onChange={(_, dateStr) => onFiltersChange({ startDate: dateStr })}
               />
            </div>
            <div>
               <DatePicker
                  key={`endDate-${endDate || "empty"}`}
                  id="endDate"
                  label="Hasta"
                  placeholder="Select date"
                  defaultDate={endDate || undefined}
                  onChange={(_, dateStr) => onFiltersChange({ endDate: dateStr })}
               />
            </div>
            <div>
               <Label htmlFor="categoryFilter">Categoría</Label>
               <div className="relative">
                  <Select
                     key={`category-${categoryFilter}`}
                     options={categorySelectOptions}
                     onChange={(value) => onFiltersChange({ categoryIdFilter: value })}
                     defaultValue={categoryFilter}
                     placeholder="Select category"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon/>
                  </span>
               </div>
            </div>
            <div>
               <Label htmlFor="familyMemberFilter">Familiar</Label>
               <div className="relative">
                  <Select
                     key={`family-member--${familyMemberIdFilter}`}
                     options={familyMemberSelectOptions}
                     onChange={(value) => onFiltersChange({ familyMemberIdFilter: value })}
                     defaultValue={familyMemberIdFilter}
                     placeholder="Select family member"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon/>
                  </span>
               </div>
            </div>
         </div>
      </section>
   );
}
