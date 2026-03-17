
import { Metadata } from "next";

import { getCurrentUser } from "@/lib/auth";
import ProfilePage from "@/features/profile/pages/ProfilePage";

export const metadata: Metadata = {
   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
   description:
      "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function Profile() {
   const user = await getCurrentUser();

   return (
      <ProfilePage user={user} />
   );
}
