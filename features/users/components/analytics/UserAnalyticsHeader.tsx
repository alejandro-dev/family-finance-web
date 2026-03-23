"use client";

import Link from "next/link";
import Badge from "@/components/ui/badge/Badge";

interface UserAnalyticsHeaderProps {
   isEnabled: boolean;
   route: string;
   from: string
}

export default function UserAnalyticsHeader({ isEnabled, route, from }: UserAnalyticsHeaderProps) {
   return (
      <div className="flex items-center justify-between">
         <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
               <Link href={route} className="hover:underline">{from}</Link> / Details
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">User analytics viewer</h1>
         </div>
         <Badge size="sm" color={isEnabled ? "success" : "error"}>
            {isEnabled ? "Active" : "Inactive"}
         </Badge>
      </div>
   );
}
