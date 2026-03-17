interface TopMembersByExpenseCardProps {
   members: { id: string; name: string; total: number }[];
}

const formatCurrency = (value: number) =>
   new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
   }).format(value);

export default function TopMembersByExpenseCard({ members }: TopMembersByExpenseCardProps) {
   const maxMemberTotal = Math.max(...members.map((member) => member.total), 1);

   return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Top family members by expense</h2>
         <div className="space-y-3">
            {members.map((member) => (
               <div key={member.id}>
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                     <span>{member.name}</span>
                     <span>{formatCurrency(member.total)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                     <div
                        className="h-2 rounded-full bg-brand-500"
                        style={{ width: `${(member.total / maxMemberTotal) * 100}%` }}
                     />
                  </div>
               </div>
            ))}
            {members.length === 0 && (
               <p className="text-sm text-gray-500 dark:text-gray-400">There is no member data to display.</p>
            )}
         </div>
      </div>
   );
}
