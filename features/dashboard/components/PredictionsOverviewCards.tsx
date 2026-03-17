interface PredictionSummary {
   predictedIncome: number;
   predictedExpenses: number;
   predictedBalance: number;
}

interface PredictionsOverviewCardsProps {
   nextMonth: PredictionSummary | null;
   nextTwelveMonths: PredictionSummary;
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
   }).format(value);

export default function PredictionsOverviewCards({
   nextMonth,
   nextTwelveMonths,
}: PredictionsOverviewCardsProps) {
   const balancePositive = nextTwelveMonths.predictedBalance >= 0;

   return (
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
         <article className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-500/30 dark:bg-sky-500/10">
            <p className="text-xs uppercase tracking-wide text-sky-700 dark:text-sky-300">Projected income</p>
            <p className="mt-2 text-2xl font-semibold text-sky-950 dark:text-white">
               {formatCurrency(nextMonth?.predictedIncome ?? 0)}
            </p>
            <p className="mt-1 text-xs text-sky-800/80 dark:text-sky-200/80">Next month</p>
         </article>
         <article className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-500/30 dark:bg-rose-500/10">
            <p className="text-xs uppercase tracking-wide text-rose-700 dark:text-rose-300">Projected expense</p>
            <p className="mt-2 text-2xl font-semibold text-rose-950 dark:text-white">
               {formatCurrency(nextMonth?.predictedExpenses ?? 0)}
            </p>
            <p className="mt-1 text-xs text-rose-800/80 dark:text-rose-200/80">Next month</p>
         </article>
         <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10">
            <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Projected balance</p>
            <p className={`mt-2 text-2xl font-semibold ${balancePositive ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
               {formatCurrency(nextTwelveMonths.predictedBalance)}
            </p>
            <p className="mt-1 text-xs text-emerald-800/80 dark:text-emerald-200/80">12-month total</p>
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Accumulated income</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
               {formatCurrency(nextTwelveMonths.predictedIncome)}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
               Expenses: {formatCurrency(nextTwelveMonths.predictedExpenses)}
            </p>
         </article>
      </section>
   );
}
