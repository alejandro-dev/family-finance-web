"use client";

interface PredictionPoint {
   date: string;
   label: string;
   predictedIncome: number;
   predictedExpenses: number;
   predictedBalance: number;
}

interface PredictionSummary {
   predictedIncome: number;
   predictedExpenses: number;
   predictedBalance: number;
}

interface PredictionsTrendChartProps {
   points: PredictionPoint[];
   nextMonth: PredictionSummary | null;
   nextTwelveMonths: PredictionSummary;
   errorMessage?: string | null;
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   }).format(value);

export default function PredictionsTrendChart({
   points,
   nextMonth,
   nextTwelveMonths,
   errorMessage,
}: PredictionsTrendChartProps) {
   if (errorMessage) {
      return (
         <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10 lg:p-6">
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Financial prediction</h2>
            <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">{errorMessage}</p>
         </section>
      );
   }

   if (points.length === 0) {
      return (
         <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Financial prediction</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
               No predictions are available for the selected filters.
            </p>
         </section>
      );
   }

   const chartWidth = 960;
   const chartHeight = 340;
   const padding = { top: 24, right: 20, bottom: 56, left: 64 };
   const innerWidth = chartWidth - padding.left - padding.right;
   const innerHeight = chartHeight - padding.top - padding.bottom;

   const maxValue = Math.max(
      ...points.flatMap((point) => [point.predictedIncome, point.predictedExpenses, point.predictedBalance]),
      1
   );
   const minValue = Math.min(
      ...points.flatMap((point) => [point.predictedIncome, point.predictedExpenses, point.predictedBalance]),
      0
   );
   const valueRange = Math.max(maxValue - minValue, 1);

   const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => minValue + valueRange * ratio);
   const getX = (index: number) =>
      padding.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth);
   const getY = (value: number) => padding.top + innerHeight - ((value - minValue) / valueRange) * innerHeight;

   const buildPath = (selector: (point: PredictionPoint) => number) =>
      points
         .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(selector(point))}`)
         .join(" ");

   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
               <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Financial prediction</h2>
               <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Estimated income, expenses, and balance for the next 12 months.
               </p>
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-2">
               <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-900/40">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Next month</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                     {nextMonth ? formatCurrency(nextMonth.predictedBalance) : formatCurrency(0)}
                  </p>
               </div>
               <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-900/40">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">12-month balance</p>
                  <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                     {formatCurrency(nextTwelveMonths.predictedBalance)}
                  </p>
               </div>
            </div>
         </div>

         <div className="mb-3 flex flex-wrap items-center gap-5 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
               Projected income
            </span>
            <span className="inline-flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
               Projected expenses
            </span>
            <span className="inline-flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
               Projected balance
            </span>
         </div>

         <div className="overflow-x-auto">
            <svg
               viewBox={`0 0 ${chartWidth} ${chartHeight}`}
               role="img"
               aria-label="Financial prediction chart for the next 12 months"
               className="min-w-[960px]"
            >
               {yTicks.map((tick, index) => {
                  const y = getY(tick);
                  return (
                     <g key={`prediction-tick-${index}`}>
                        <line
                           x1={padding.left}
                           y1={y}
                           x2={padding.left + innerWidth}
                           y2={y}
                           className="stroke-gray-200 dark:stroke-gray-800"
                           strokeDasharray="3 5"
                        />
                        <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-gray-500 text-[11px]">
                           {formatCurrency(tick)}
                        </text>
                     </g>
                  );
               })}

               <path d={buildPath((point) => point.predictedIncome)} className="fill-none stroke-sky-500" strokeWidth="3" />
               <path d={buildPath((point) => point.predictedExpenses)} className="fill-none stroke-rose-500" strokeWidth="3" />
               <path d={buildPath((point) => point.predictedBalance)} className="fill-none stroke-emerald-500" strokeWidth="3" />

               {points.map((point, index) => (
                  <g key={point.date}>
                     <circle cx={getX(index)} cy={getY(point.predictedIncome)} r="3.5" className="fill-sky-500" />
                     <circle cx={getX(index)} cy={getY(point.predictedExpenses)} r="3.5" className="fill-rose-500" />
                     <circle cx={getX(index)} cy={getY(point.predictedBalance)} r="3.5" className="fill-emerald-500" />
                     <text
                        x={getX(index)}
                        y={padding.top + innerHeight + 22}
                        textAnchor="middle"
                        className="fill-gray-600 text-[11px] dark:fill-gray-300"
                     >
                        {point.label}
                     </text>
                  </g>
               ))}
            </svg>
         </div>
      </section>
   );
}
