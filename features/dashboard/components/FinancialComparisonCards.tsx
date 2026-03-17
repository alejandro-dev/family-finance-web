interface FinancialComparisonCardsProps {
   totalIncomeGlobal: number;
   totalIncomeCurrentMonth: number;
   balanceGlobal: number;
   savingsRate: number;
   isMockData?: boolean;
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
   }).format(value);

export default function FinancialComparisonCards({
   totalIncomeGlobal,
   totalIncomeCurrentMonth,
   balanceGlobal,
   savingsRate,
   isMockData = false,
}: FinancialComparisonCardsProps) {
   const balancePositive = balanceGlobal >= 0;

   return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Ingreso total</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{formatCurrency(totalIncomeGlobal)}</p>
            {isMockData && <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">dato mock</p>}
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Ingreso mes actual</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{formatCurrency(totalIncomeCurrentMonth)}</p>
            {isMockData && <p className="mt-1 text-xs text-amber-600 dark:text-amber-300">dato mock</p>}
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Balance</p>
            <p className={`mt-2 text-2xl font-semibold ${balancePositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
               {formatCurrency(balanceGlobal)}
            </p>
         </article>
         <article className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Tasa de ahorro</p>
            <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white/90">{savingsRate.toFixed(1)}%</p>
         </article>
      </section>
   );
}
