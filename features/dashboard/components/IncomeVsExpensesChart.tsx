"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

interface ComparisonPoint {
   month: number;
   label: string;
   expenses: number;
   incomes: number;
}

interface IncomeVsExpensesChartProps {
   year: number;
   points: ComparisonPoint[];
   isMockData?: boolean;
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   }).format(value);

export default function IncomeVsExpensesChart({ year, points, isMockData = false }: IncomeVsExpensesChartProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const chartWidth = 900;
   const chartHeight = 320;
   const padding = { top: 24, right: 20, bottom: 48, left: 56 };
   const innerWidth = chartWidth - padding.left - padding.right;
   const innerHeight = chartHeight - padding.top - padding.bottom;

   const safePoints = points.length > 0 ? points : Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      label: new Intl.DateTimeFormat("es-ES", { month: "short" }).format(new Date(year, index, 1)),
      expenses: 0,
      incomes: 0,
   }));
   const currentYear = new Date().getFullYear();
   const yearOptions = Array.from({ length: 7 }, (_, index) => ({
      value: String(currentYear - index),
      label: String(currentYear - index),
   }));

   const handleYearChange = useCallback(
      (value: string) => {
         const params = new URLSearchParams(searchParams.toString());
         if (!value) params.delete("analyticsYear");
         else params.set("analyticsYear", value);

         const queryString = params.toString();
         router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      },
      [pathname, router, searchParams]
   );

   const maxValue = Math.max(
      ...safePoints.flatMap((point) => [point.expenses, point.incomes]),
      1
   );

   const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => maxValue * ratio);

   const getX = (index: number) =>
      padding.left + (safePoints.length === 1 ? innerWidth / 2 : (index / (safePoints.length - 1)) * innerWidth);
   const getY = (value: number) => padding.top + innerHeight - (value / maxValue) * innerHeight;

   const buildPath = (selector: (point: ComparisonPoint) => number) =>
      safePoints
         .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(selector(point))}`)
         .join(" ");

   const expensesPath = buildPath((point) => point.expenses);
   const incomesPath = buildPath((point) => point.incomes);

   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Income vs Expenses</h2>
               <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Monthly comparison of income and expenses during {year}.</p>
            </div>
            <div className="flex items-end gap-3">
               <div className="min-w-44">
                  <Label htmlFor="income-vs-expenses-year-select">Analytics year</Label>
                  <div className="relative">
                     <Select
                        id="income-vs-expenses-year-select"
                        options={yearOptions}
                        defaultValue={String(year)}
                        onChange={handleYearChange}
                     />
                     <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                     </span>
                  </div>
               </div>
               {isMockData && (
                  <span className="mb-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs text-amber-700 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-300">
                     Mock data
                  </span>
               )}
            </div>
         </div>

         <div className="mb-3 flex items-center gap-5 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
               Income
            </span>
            <span className="inline-flex items-center gap-2">
               <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
               Expenses
            </span>
         </div>

         <div className="overflow-x-auto">
            <svg
               viewBox={`0 0 ${chartWidth} ${chartHeight}`}
               role="img"
               aria-label={`Income and expenses comparison chart for ${year}`}
               className="min-w-190"
            >
               {yTicks.map((tick, index) => {
                  const y = getY(tick);
                  return (
                     <g key={`tick-${index}`}>
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

               <path d={incomesPath} className="fill-none stroke-emerald-500" strokeWidth="3" />
               <path d={expensesPath} className="fill-none stroke-rose-500" strokeWidth="3" />

               {safePoints.map((point, index) => (
                  <g key={point.month}>
                     <circle cx={getX(index)} cy={getY(point.incomes)} r="3.5" className="fill-emerald-500" />
                     <circle cx={getX(index)} cy={getY(point.expenses)} r="3.5" className="fill-rose-500" />
                     <text
                        x={getX(index)}
                        y={padding.top + innerHeight + 20}
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
