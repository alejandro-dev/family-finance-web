"use server";

import { backendFetch } from "@/services/backend";
import { SearchTotalExpensesResponse } from "@/services/expensesService";
import ToastService from "@/services/toastService";
import { FamilyMember } from "@/types/FamilyMember";
import { getCategoryOptions as getCategoryOptionsService } from "@/services/categoryOptionsService";

// Función que realiza la llamada a la API de búsqueda de familiar.
export async function searchFamilyMemberId(id: string): Promise<FamilyMember> {
   // Validamos que el id sea válido.
   const safeId = id?.trim();
   if (!safeId) ToastService.error("Invalid family member ID");

   return backendFetch<FamilyMember>(`/family-members/${safeId}`, {
      method: "GET",
   });
}

// Función para obtener el total de gastos de un familiar.
export async function getTotalExpenses(id: string): Promise<SearchTotalExpensesResponse> {
   // Validamos que el id sea válido.
   const safeId = id?.trim();
   if (!safeId) ToastService.error("Invalid family member ID");

   return backendFetch<SearchTotalExpensesResponse>(`/expenses/total?familyMemberId=${safeId}`, {
      method: "GET",
   });
}

// Wrapper async para cumplir la restricción de exports en archivos "use server".
export async function getCategoryOptions() {
   return getCategoryOptionsService();
}