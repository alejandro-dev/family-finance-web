import { requireUser } from "@/lib/authorize";
import { searchFamilyMembers } from "./actions";
import FamilyMembersPage from "@/features/family-members/pages/FamilyMemberPage";

export default async function Expenses() {
   // La restricción admin/user ya se aplica de forma global.
   const user = await requireUser();

   const initialData = await searchFamilyMembers({ familyId: user.familyId });

   return (
      <FamilyMembersPage initialData={initialData} familyId={user.familyId ? user.familyId : ""} />
   );
}
