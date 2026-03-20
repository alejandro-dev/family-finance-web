
import { Metadata } from "next";

import { getCurrentUser } from "@/lib/auth";
import ProfilePage from "@/features/profile/pages/ProfilePage";

export const metadata: Metadata = {
   title: "Profile",
   description:
      "Review and update your personal profile information in Family Finance.",
};

export default async function Profile() {
   const user = await getCurrentUser();

   return (
      <ProfilePage user={user} />
   );
}
