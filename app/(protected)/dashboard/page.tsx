import { requireUser } from "@/lib/authorize";
import type { Metadata } from "next";
import { getFamilyDashboardData } from "./actions";
import FamilyExpensesDashboardPage from "@/features/dashboard/pages/FamilyExpensesDashboardPage";

export const metadata: Metadata = {
   title: "Dashboard",
   description:
      "View your family financial dashboard with expense trends, income summaries, and predictive insights.",
};

interface DashboardPageProps {
   searchParams: Promise<{
      startDate?: string;
      endDate?: string;
      categoryId?: string;
      familyMemberId?: string;
      analyticsYear?: string;
   }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
   // La autorización de navegación se resuelve en middleware/layout; aquí solo cargamos datos de la pantalla.
   const user = await requireUser();

   const filters = await searchParams;
   const data = await getFamilyDashboardData(user.familyId ?? "", filters);

   return <FamilyExpensesDashboardPage data={data} />;
}
