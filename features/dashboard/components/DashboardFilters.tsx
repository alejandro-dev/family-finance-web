"use client";

import { useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import { ChevronDownIcon } from "@/icons";

interface DashboardFiltersProps {
   filters: {
      startDate: string;
      endDate: string;
      categoryId: string;
      familyMemberId: string;
      analyticsYear: number;
   };
   categories: { id: string; name: string }[];
   familyMembers: { id: string; name: string }[];
}

export default function DashboardFilters({
   filters,
   categories,
   familyMembers,
}: DashboardFiltersProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const categoryOptions = [
      { value: "all", label: "Todas" },
      ...categories.map((category) => ({ value: category.id, label: category.name })),
   ];
   const memberOptions = [
      { value: "all", label: "Todos" },
      ...familyMembers.map((member) => ({ value: member.id, label: member.name })),
   ];

   const replaceQuery = useCallback(
      (key: string, value: string) => {
         const params = new URLSearchParams(searchParams.toString());
         if (!value || value === "all") params.delete(key);
         else params.set(key, value);

         const queryString = params.toString();
         router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      },
      [pathname, router, searchParams]
   );

   const scheduleDateUpdate = useCallback(
      (key: "startDate" | "endDate", value: string) => {
         if (debounceRef.current) clearTimeout(debounceRef.current);
         debounceRef.current = setTimeout(() => {
            replaceQuery(key, value);
         }, 300);
      },
      [replaceQuery]
   );

   const handleClearFilters = useCallback(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      router.replace(pathname, { scroll: false });
   }, [pathname, router]);

   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Filtros</h2>
            <Button size="sm" variant="outline" onClick={handleClearFilters}>
               Limpiar
            </Button>
         </div>

         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
               <DatePicker
                  id="dashboard-start-date"
                  label="Desde"
                  placeholder="Select date"
                  defaultDate={filters.startDate || undefined}
                  onChange={(_, dateStr) => scheduleDateUpdate("startDate", dateStr)}
               />
            </div>
            <div>
               <DatePicker
                  id="dashboard-end-date"
                  label="Hasta"
                  placeholder="Select date"
                  defaultDate={filters.endDate || undefined}
                  onChange={(_, dateStr) => scheduleDateUpdate("endDate", dateStr)}
               />
            </div>
            <div>
               <Label htmlFor="dashboard-category">Category</Label>
               <div className="relative">
                  <Select
                     id="dashboard-category"
                     options={categoryOptions}
                     defaultValue={filters.categoryId || "all"}
                     onChange={(value) => replaceQuery("categoryId", value)}
                     placeholder="Select category"
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon />
                  </span>
               </div>
            </div>
            <div>
               <Label htmlFor="dashboard-member">Familiar</Label>
               <div className="relative">
                  <Select
                     id="dashboard-member"
                     options={memberOptions}
                     defaultValue={filters.familyMemberId || "all"}
                     onChange={(value) => replaceQuery("familyMemberId", value)}
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
