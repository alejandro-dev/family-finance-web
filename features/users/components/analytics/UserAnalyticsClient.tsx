"use client";

import Alert from "@/components/ui/alert/Alert";
import ExpensesByCategoryChart from "@/features/users/components/analytics/ExpensesByCategoryChart";
import ExpensesDataTable from "@/features/expenses/components/ExpensesDataTable";
import UserAnalyticsFilters from "@/features/users/components/analytics/UserAnalyticsFilters";
import UserAnalyticsHeader from "@/features/users/components/analytics/UserAnalyticsHeader";
import UserSummaryCard from "@/features/users/components/analytics/UserSummaryCard";
import { useUserAnalyticsPage } from "@/features/users/hooks/useUserAnalyticsPage";
import {
   UserAnalyticsInitialData,
   UserAnalyticsUserMeta,
} from "@/features/users/types/userAnalytics";
import FamilyMembersDataTable from "@/features/family-members/components/FamilyMembersDataTable";

interface UserAnalyticsClientProps {
   initialData: UserAnalyticsInitialData;
   initialUserMeta: UserAnalyticsUserMeta;
}

export default function UserAnalyticsClient({
   initialData,
   initialUserMeta,
}: UserAnalyticsClientProps) {
   // El hook centraliza estado local + llamadas a server actions.
   const {
      username,
      email,
      roleLabel,
      isEnabled,
      startDate,
      endDate,
      categoryIdFilter,
      familyMemberIdFilter,
      categoryOptions,
      familyMembers,
      totalAmount,
      chartData,
      maxBar,
      expensesRows,
      expensesTotal,
      expensesPage,
      expensesTotalPages,
      expensesPageSize,
      familyRows,
      familyTotal,
      familyPage,
      familyTotalPages,
      familyPageSize,
      error,
      isLoading,
      handleFiltersChange,
      setExpensesPage,
      handleExpensesPageSizeChange,
      setFamilyPage,
      handleFamilyPageSizeChange,
   } = useUserAnalyticsPage({
      initialData,
      initialUserMeta,
   });

   return (
      // Indicador visual ligero mientras se refrescan bloques por filtros/paginación.
      <div className={`space-y-6 ${isLoading ? "opacity-80 transition-opacity" : ""}`}>
         {error && (
            <Alert
               variant="error"
               title="The data could not be loaded"
               message={error.message}
            />
         )}

         <UserAnalyticsHeader isEnabled={isEnabled} route={"/admin/users"} from="Users" />

         <UserSummaryCard
            username={username}
            email={email}
            roleLabel={roleLabel}
            totalAmount={totalAmount}
         />

         <UserAnalyticsFilters
            startDate={startDate}
            endDate={endDate}
            categoryFilter={categoryIdFilter}
            memberFilter={familyMemberIdFilter}
            categoryOptions={categoryOptions}
            familyMembers={familyMembers}
            onFiltersChange={handleFiltersChange}
         />

         <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
               <ExpensesDataTable
                  rows={expensesRows}
                  totalItems={expensesTotal}
                  currentPage={expensesPage}
                  totalPages={expensesTotalPages}
                  pageSize={expensesPageSize}
                  onPageChange={setExpensesPage}
                  onPageSizeChange={handleExpensesPageSizeChange}
               />
            </div>

            <div className="xl:col-span-2">
               <ExpensesByCategoryChart chartData={chartData} maxBar={maxBar} />
            </div>
         </section>

         <FamilyMembersDataTable
            rows={familyRows}
            totalItems={familyTotal}
            currentPage={familyPage}
            totalPages={familyTotalPages}
            pageSize={familyPageSize}
            onPageChange={setFamilyPage}
            onPageSizeChange={handleFamilyPageSizeChange}
         />
      </div>
   );
}
