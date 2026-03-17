import { FamilyMember } from "@/types/FamilyMember";
import { PaginatedResponse } from "@/types/pagination";

// Re-export para mantener compatibilidad con imports existentes.
export type { PaginatedResponse };

// Fila de la tabla de gastos.
export interface Expense {
   id: string;
   date: string;
   categoryName: string;
   familyMemberName: string;
   categoryId: string;
   description: string;
   amount: number;
   familyMemberId: string;
   isRecurring: boolean;
}

// Estructura del gráfico por categoría.
export interface ChartItem {
   label: string;
   total: number;
}

export interface CategoryOption {
   id: string;
   name: string;
}

// Metadata mínima del usuario mostrada en el header/summary.
export interface UserAnalyticsUserMeta {
   username: string;
   email: string;
   familyId: string;
   familyMemberId: string;
   isAdmin: boolean;
   isOwner: boolean;
   isEnabled: boolean;
}

// Filtros controlados por la UI.
export interface UserAnalyticsFilters {
   startDate: string;
   endDate: string;
   categoryIdFilter: string;
   familyMemberIdFilter: string;
}

// Query unificada para actions de analytics.
export interface UserAnalyticsQuery {
   userId?: string;
   familyId?: string;
   startDate?: string;
   endDate?: string;
   categoryId?: string;
   familyMemberId?: string;
   expensesPage?: number;
   expensesSize?: number;
   familyPage?: number;
   familySize?: number;
}

// Payload inicial que SSR le entrega al cliente.
export interface UserAnalyticsInitialData {
   summary: { totalAmount: number };
   chart: ChartItem[];
   expenses: PaginatedResponse<Expense>;
   familyMembers: PaginatedResponse<FamilyMember>;
   filtersMeta: {
      categoryOptions: CategoryOption[];
      familyMembersOptions: FamilyMember[];
   };
   filters: UserAnalyticsFilters;
}
