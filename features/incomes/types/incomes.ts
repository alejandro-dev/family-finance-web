import { PaginatedResponse } from "@/types/pagination";

export type IncomeSourceType = "MANUAL" | "RECURRING_GENERATED" | "RECURRING_OVERRIDE";

export interface Income {
   id: string;
   date: string;
   description: string;
   amount: number;
   familyMemberId: string;
   familyMemberName?: string;
   categoryId: string;
   categoryName?: string;
   sourceType?: IncomeSourceType;
   periodYearMonth?: string;
   isActive?: boolean;
}

export interface IncomeRule {
   id: string;
   description: string;
   amount: number;
   familyMemberId: string;
   familyMemberName?: string;
   categoryId?: string;
   categoryName?: string;
   date: string;
   isActive: boolean;
}

export interface IncomesFilters {
   startDate?: string;
   endDate?: string;
   familyMemberId?: string;
}

export interface IncomesPagination {
   page: number;
   size: number;
}

export interface SearchMyIncomesQuery extends IncomesFilters, IncomesPagination {}

export type SearchMyIncomesResponse = PaginatedResponse<Income>;

export interface IncomeRulesFilters {
   familyMemberId?: string;
}

export interface IncomeRulesPagination {
   page: number;
   size: number;
}

export interface SearchMyIncomeRulesQuery extends IncomeRulesFilters, IncomeRulesPagination {}

export type SearchMyIncomeRulesResponse = PaginatedResponse<IncomeRule>;
