"use client";

interface ChartItem {
   label: string;
   total: number;
}

interface ExpensesByCategoryChartProps {
   chartData: ChartItem[];
   maxBar: number;
}

export default function ExpensesByCategoryChart({ chartData, maxBar }: ExpensesByCategoryChartProps) {
   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Expenses by category</h2>
         <div className="space-y-3">
            {chartData.map((item) => (
               <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                     <span>{item.label}</span>
                     <span>{item.total.toFixed(2)} EUR</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                     <div
                        // Normalizamos cada barra respecto al mayor total del período filtrado.
                        className="h-2 rounded-full bg-brand-500"
                        style={{ width: `${(item.total / maxBar) * 100}%` }}
                     />
                  </div>
               </div>
            ))}
            {chartData.length === 0 && (
               <p className="text-sm text-gray-500 dark:text-gray-400">No data available for this chart.</p>
            )}
         </div>
      </div>
   );
}
