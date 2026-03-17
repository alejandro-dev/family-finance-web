"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";

interface YearlyPoint {
   month: number;
   label: string;
   total: number;
}

interface YearlyExpensesChartProps {
   year: number;
   points: YearlyPoint[];
}

// Función para formatear el valor de un punto de datos.
const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
   }).format(value);

export default function YearlyExpensesChart({ year, points }: YearlyExpensesChartProps) {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const chartWidth = 900;
   const chartHeight = 320;
   const padding = { top: 20, right: 20, bottom: 48, left: 56 };
   const innerWidth = chartWidth - padding.left - padding.right;
   const innerHeight = chartHeight - padding.top - padding.bottom;

   // Puntos de datos para el gráfico.
   const safePoints = points.length > 0 ? points : Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      label: new Intl.DateTimeFormat("es-ES", { month: "short" }).format(new Date(year, index, 1)),
      total: 0,
   }));

   // Año actual.
   const currentYear = new Date().getFullYear();

   // Opciones de año para el selector de año.
   const yearOptions = Array.from({ length: 7 }, (_, index) => ({
      value: String(currentYear - index),
      label: String(currentYear - index),
   }));

   // Calculamos el máximo valor de los puntos de datos.
   const maxValue = Math.max(...safePoints.map((point) => point.total), 1);

   // Calculamos los valores de las marcas de eje.
   let levelsY = [];
   if (maxValue === 1) levelsY = [0, 1];
   else levelsY = [0, 0.25, 0.5, 0.75, 1];

   const yTicks = levelsY.map((ratio) => maxValue * ratio);

   // Calculamos las coordenadas X y Y de cada punto de datos.
   const getX = (index: number) =>
      padding.left + (safePoints.length === 1 ? innerWidth / 2 : (index / (safePoints.length - 1)) * innerWidth);
   const getY = (value: number) => padding.top + innerHeight - (value / maxValue) * innerHeight;

   // Construimos la ruta de línea de los puntos de datos.
   const linePath = safePoints
      .map((point, index) => `${index === 0 ? "M" : "L"} ${getX(index)} ${getY(point.total)}`)
      .join(" ");

   // Construimos la ruta de área de los puntos de datos.
   const areaPath = [
      linePath,
      `L ${getX(safePoints.length - 1)} ${padding.top + innerHeight}`,
      `L ${getX(0)} ${padding.top + innerHeight}`,
      "Z",
   ].join(" ");

   // Evento para cambiar el año de análisis.
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

   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
               <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Annual analytics</h2>
               <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Monthly expense evolution in {year}.</p>
            </div>
            <div className="min-w-44">
               <Label htmlFor="analytics-year-select">Analytics year</Label>
               <div className="relative">
                  <Select
                     id="analytics-year-select"
                     options={yearOptions}
                     defaultValue={String(year)}
                     onChange={handleYearChange}
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                     <ChevronDownIcon />
                  </span>
               </div>
            </div>
         </div>

         <div className="overflow-x-auto">
            <svg
               viewBox={`0 0 ${chartWidth} ${chartHeight}`}
               role="img"
               aria-label={`Annual expense chart for ${year}`}
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

               <path d={areaPath} className="fill-brand-500/10" />
               <path d={linePath} className="fill-none stroke-brand-500" strokeWidth="3" />

               {safePoints.map((point, index) => (
                  <g key={point.month}>
                     <circle cx={getX(index)} cy={getY(point.total)} r="4" className="fill-brand-500" />
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
