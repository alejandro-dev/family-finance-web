import type { Metadata } from "next";
import UserAnalyticsClient from "@/features/users/components/analytics/UserAnalyticsClient";
import { getUserAnalyticsInitialData, getUserAnalyticsUserMetaAction } from "./actions";

export const metadata: Metadata = {
   title: "User Management | Admin Dashboard",
   description: "User administration panel",
};

interface PageProps {
   params: Promise<{ id: string }>;
}

export default async function UserShowPage({ params }: PageProps) {
   const { id } = await params;

   // Metadata del usuario obtenida del backend para evitar manipulación por URL.
   const initialUserMeta = await getUserAnalyticsUserMetaAction(id);

   // Primera carga SSR de toda la pantalla (gastos + miembros + agregados).
   const initialData = await getUserAnalyticsInitialData({
      familyId: initialUserMeta.familyId,
      startDate: "",
      endDate: "",
      categoryId: "all",
      familyMemberId: "all",
      expensesPage: 1,
      expensesSize: 10,
      familyPage: 1,
      familySize: 10,
   });

   return (
      // El componente cliente se encarga de la interacción (filtros/paginación).
      <UserAnalyticsClient
         initialData={initialData}
         initialUserMeta={initialUserMeta}
      />
   );
}
