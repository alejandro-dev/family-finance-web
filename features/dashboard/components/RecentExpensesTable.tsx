import { Expense } from "@/features/users/types/userAnalytics";

interface RecentExpensesTableProps {
   expenses: Expense[];
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
   }).format(value);

export default function RecentExpensesTable({ expenses }: RecentExpensesTableProps) {
   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Recent expenses</h2>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
               <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                     <th className="px-3 py-2 font-medium">Date</th>
                     <th className="px-3 py-2 font-medium">Description</th>
                     <th className="px-3 py-2 font-medium">Category</th>
                     <th className="px-3 py-2 font-medium">Member</th>
                     <th className="px-3 py-2 font-medium">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                  {expenses.map((expense) => (
                     <tr key={expense.id} className="text-sm text-gray-700 dark:text-gray-200">
                        <td className="px-3 py-3">{expense.date || "-"}</td>
                        <td className="px-3 py-3">{expense.description || "-"}</td>
                        <td className="px-3 py-3">{expense.categoryName || "-"}</td>
                        <td className="px-3 py-3">{expense.familyMemberName || "-"}</td>
                        <td className="px-3 py-3 font-medium">{formatCurrency(expense.amount ?? 0)}</td>
                     </tr>
                  ))}
                  {expenses.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                           There are no recent expenses to display.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </section>
   );
}
