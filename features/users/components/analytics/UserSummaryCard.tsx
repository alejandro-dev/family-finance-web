"use client";

interface UserSummaryCardProps {
   username: string;
   email: string;
   roleLabel: string;
   totalAmount: number;
}

export default function UserSummaryCard({
   username,
   email,
   roleLabel,
   totalAmount,
}: UserSummaryCardProps) {
   return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
         <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Perfil</h2>
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
               <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Username</p>
               <p className="mt-1 font-medium text-gray-800 dark:text-white/90">{username}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
               <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</p>
               <p className="mt-1 font-medium text-gray-800 dark:text-white/90">{email}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
               <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Rol</p>
               <p className="mt-1 font-medium text-gray-800 dark:text-white/90">{roleLabel}</p>
            </div>
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
               <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total filtrado</p>
               <p className="mt-1 font-medium text-gray-800 dark:text-white/90">{totalAmount.toFixed(2)} EUR</p>
            </div>
         </div>
      </section>
   );
}

