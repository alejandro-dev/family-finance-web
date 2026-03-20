import InfoFamilyMemberPage from "@/features/family-members/pages/InfoFamilyMemberPage";
import type { Metadata } from "next";
import { requireUser } from "@/lib/authorize";
import { getCategoryOptions, getTotalExpenses, searchFamilyMemberId } from "./actions";
import { searchMyExpensesAction } from "@/app/(protected)/expenses/actions";

export const metadata: Metadata = {
   title: "Family member details",
   description:
      "Review a family member profile, expense analytics, and related transactions in Family Finance.",
};

interface FamilyMemberDetailPageProps {
   params: Promise<{ id: string }>;
}

export default async function ShowFamilyMember({ params }: FamilyMemberDetailPageProps) {
   await requireUser();

   const { id } = await params;
   const categoriesOptions = await getCategoryOptions();

   const familyMember = await searchFamilyMemberId(id);
   const analyticsExpenses = await getTotalExpenses(id);
   const initialExpenses = await searchMyExpensesAction({
      page: 1,
      size: 10,
      familyMemberId: id,
   });

   return (
      <InfoFamilyMemberPage
         familyMember={familyMember}
         analyticsExpenses={analyticsExpenses}
         initialExpenses={initialExpenses}
         categoriesOptions={categoriesOptions}
      />
   );
}
