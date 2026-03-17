"use client";

import ExpensesDataTable from "@/features/expenses/components/ExpensesDataTable";
import ExpensesByCategoryChart from "@/features/users/components/analytics/ExpensesByCategoryChart";
import UserAnalyticsHeader from "@/features/users/components/analytics/UserAnalyticsHeader";
import UserSummaryCard from "@/features/users/components/analytics/UserSummaryCard";
import useShowFamilyMember from "../hooks/useShowFamilyMember";
import { SearchTotalExpensesResponse } from "@/services/expensesService";
import { FamilyMember } from "@/types/FamilyMember";
import { SearchMyExpensesResponse } from "@/features/expenses/types/expenses";
import UserAnalyticsFilters from "@/features/users/components/analytics/UserAnalyticsFilters";
import { CategoryOption } from "@/features/users/types/userAnalytics";

export interface ShowFamilyMemberPageProps {
   familyMember: FamilyMember;
   analyticsExpenses: SearchTotalExpensesResponse;
   initialExpenses: SearchMyExpensesResponse;
   categoriesOptions: CategoryOption[];
}

export default function ShowFamilyMemberPage({ familyMember, analyticsExpenses, initialExpenses, categoriesOptions }: ShowFamilyMemberPageProps) {
   const {
      chartData,
      maxBar,
      totalAmount,
      expensesRows,
      expensesTotal,
      expensesPage,
      expensesTotalPages,
      expensesPageSize,
      startDate,
      endDate,
      categoryIdFilter,
      handleExpensesPageChange,
      handleExpensesPageSizeChange,
      handleFiltersChange
   } = useShowFamilyMember({ familyMember, analyticsExpenses, initialExpenses });

   return (
      <div className={`space-y-6`}>
         <UserAnalyticsHeader isEnabled={familyMember.isEnabled} route="/family-members" from="Family members" />

         <UserSummaryCard
            username={familyMember.name}
            email={familyMember.email ?? "-"}
            roleLabel={familyMember.isOwner ? "OWNER" : "USER"}
            totalAmount={totalAmount}
         />

         <UserAnalyticsFilters
            startDate={startDate}
            endDate={endDate}
            categoryFilter={categoryIdFilter}
            categoryOptions={categoriesOptions}
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
                  onPageChange={handleExpensesPageChange}
                  onPageSizeChange={handleExpensesPageSizeChange}
               />
            </div>

            <div className="xl:col-span-2">
               <ExpensesByCategoryChart chartData={chartData} maxBar={maxBar} />
            </div>
         </section>
      </div>
   );
}
