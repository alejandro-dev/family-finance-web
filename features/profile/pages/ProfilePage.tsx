"use client";

import UserMetaCard from "@/features/profile/components/UserMetaCard";
import ChangePasswordCard from "@/features/profile/components/ChangePasswordCard";
import { User } from "@/types/User";

interface ProfilePageProps {
   user: User | null;
}

export default function ProfilePage({ user }: ProfilePageProps) {
   return (
      <div>
         <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
               Profile
            </h3>
            <div className="space-y-6">
               <UserMetaCard user={user} />
               <ChangePasswordCard />
            </div>
         </div>
      </div>
   );
}
