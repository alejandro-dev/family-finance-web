interface DashboardSummaryCardsProps {
   totalGlobal: number;
   totalCurrentMonth: number;
   activeMembers: number;
   averagePerMember: number;
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
   }).format(value);

export default function DashboardSummaryCards({
   totalGlobal,
   totalCurrentMonth,
   activeMembers,
   averagePerMember,
}: DashboardSummaryCardsProps) {
   return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total expenses</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
               {formatCurrency(totalGlobal)}
            </p>
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Current month</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
               {formatCurrency(totalCurrentMonth)}
            </p>
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Active members</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{activeMembers}</p>
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Average per member</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
               {formatCurrency(averagePerMember)}
            </p>
         </article>
      </section>
   );
}
