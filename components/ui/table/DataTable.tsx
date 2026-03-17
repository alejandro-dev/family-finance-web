"use client";

import { useState, useCallback } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import SearchIcon from "@/icons/search.svg";
import { Pagination } from "@/components/ui/table/Pagination";
import { Button } from "../button";
import { PlusIcon } from "@/icons";

type Column<T> = {
   header: string;
   accessor?: keyof T;
   render?: (row: T) => React.ReactNode;
   className?: string;
};

type DataTableProps<T> = {
   data: T[];
   columns: Column<T>[];
   currentPage: number;
   totalPages: number;
   pageSize: number;
   totalItems: number;
   createButtonText?: string;
   onCreate?: boolean;
   searchPlaceholder?: string;
   title?: string;
   onPageChange: (page: number) => void;
   onPageSizeChange: (pageSize: number) => void;
   onSearch?: (search: string) => void;
   openCreateModal?: () => void;
   onInviteFamilyMember?: () => void;
};

export function DataTable<T>({
   data,
   columns,
   currentPage,
   totalPages,
   pageSize,
   totalItems,
   createButtonText = "Nuevo",
   searchPlaceholder = "Search...",
   title = "Data",
   onCreate = false,
   onPageChange,
   onPageSizeChange,
   onSearch,
   openCreateModal,
   onInviteFamilyMember
}: DataTableProps<T>) {
   const [searchValue, setSearchValue] = useState("");

   const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      
      // Debounce: esperar 300ms antes de llamar onSearch
      if (onSearch) {
         const timeoutId = setTimeout(() => {
            onSearch(value);
         }, 300);
         
         return () => clearTimeout(timeoutId);
      }
   }, [onSearch]);

   return (
      <div className="flex flex-col">
         <div className="overflow-x-auto">
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between px-4 pb-3 pt-4">
               <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {title}
               </h3>
               <div className="flex gap-2">
                  {onSearch && (
                     <div className="flex-none relative my-auto">
                        <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                           <SearchIcon className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                           type="text"
                           value={searchValue}
                           onChange={handleSearchChange}
                           placeholder={searchPlaceholder}
                           className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-80"
                        />
                     </div>
                  )}

                  {onInviteFamilyMember && (
                     <div className="flex-none justify-end px-4">
                        <Button size="sm" onClick={onInviteFamilyMember}>
                           Invitar familiar
                        </Button>
                     </div>
                  )}

                  {onCreate && (
                     <div className="flex-none justify-end px-4">
                        <Button size="sm" onClick={openCreateModal} startIcon={<PlusIcon className="h-4 w-4" />}>
                           { createButtonText }
                        </Button>
                     </div>
                  )}
               </div>
            </div>
            <Table>
               <TableHeader>
                  <TableRow>
                     {columns.map((col, index) => (
                        <TableCell key={index} isHeader className="px-5 py-3">
                           {col.header}
                        </TableCell>
                     ))}
                  </TableRow>
               </TableHeader>

               <TableBody>
                  {data.map((row, rowIndex) => (
                     <TableRow key={rowIndex}>
                        {columns.map((col, colIndex) => (
                           <TableCell key={colIndex} className="px-4 py-3">
                              {col.render
                                 ? col.render(row)
                                 : col.accessor
                                    ? String(row[col.accessor])
                                    : null}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
         
         <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
         />
      </div>
   );
}
