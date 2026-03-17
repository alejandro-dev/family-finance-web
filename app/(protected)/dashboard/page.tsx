import { requireUser } from "@/lib/authorize";
import { getFamilyDashboardData } from "./actions";
import FamilyExpensesDashboardPage from "@/features/dashboard/pages/FamilyExpensesDashboardPage";

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
