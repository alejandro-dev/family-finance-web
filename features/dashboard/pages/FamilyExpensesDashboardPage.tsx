import ExpensesByCategoryChart from "@/features/users/components/analytics/ExpensesByCategoryChart";
import { FamilyDashboardData } from "@/app/(protected)/dashboard/actions";
import DashboardFilters from "@/features/dashboard/components/DashboardFilters";
import DashboardSummaryCards from "@/features/dashboard/components/DashboardSummaryCards";
import TopMembersByExpenseCard from "@/features/dashboard/components/TopMembersByExpenseCard";
import RecentExpensesTable from "@/features/dashboard/components/RecentExpensesTable";
import FinancialComparisonCards from "@/features/dashboard/components/FinancialComparisonCards";
import IncomeVsExpensesChart from "@/features/dashboard/components/IncomeVsExpensesChart";
import PredictionsOverviewCards from "@/features/dashboard/components/PredictionsOverviewCards";
import PredictionsTrendChart from "@/features/dashboard/components/PredictionsTrendChart";

interface FamilyExpensesDashboardPageProps { data: FamilyDashboardData; }

export default function FamilyExpensesDashboardPage({ data }: FamilyExpensesDashboardPageProps) {
   const maxCategoryTotal = Math.max(...data.chartData.map((item) => item.total), 1);
   const hasPredictionData = data.predictions.points.length > 0 && !data.predictions.errorMessage;

   return (
      <div className="space-y-6">
         <DashboardFilters
            filters={data.filters}
            categories={data.filterOptions.categories}
            familyMembers={data.filterOptions.familyMembers}
         />

         <DashboardSummaryCards
            totalGlobal={data.totalGlobal}
            totalCurrentMonth={data.totalCurrentMonth}
            activeMembers={data.activeMembers}
            averagePerMember={data.averagePerMember}
         />
         <FinancialComparisonCards
            totalIncomeGlobal={data.totalIncomeGlobal}
            totalIncomeCurrentMonth={data.totalIncomeCurrentMonth}
            balanceGlobal={data.balanceGlobal}
            savingsRate={data.savingsRate}
            isMockData={data.usesMockedIncomeData}
         />
         <IncomeVsExpensesChart
            year={data.filters.analyticsYear}
            points={data.monthlyComparison}
            isMockData={data.usesMockedIncomeData}
         />
         {hasPredictionData && (
            <PredictionsOverviewCards
               nextMonth={data.predictions.nextMonth}
               nextTwelveMonths={data.predictions.nextTwelveMonths}
            />
         )}
         <PredictionsTrendChart
            points={data.predictions.points}
            nextMonth={data.predictions.nextMonth}
            nextTwelveMonths={data.predictions.nextTwelveMonths}
            errorMessage={data.predictions.errorMessage}
         />

         <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
               <TopMembersByExpenseCard members={data.topMembers} />
            </div>
            <div className="xl:col-span-2">
               <ExpensesByCategoryChart chartData={data.chartData} maxBar={maxCategoryTotal} />
            </div>
         </section>

         <RecentExpensesTable expenses={data.recentExpenses} />
      </div>
   );
}
