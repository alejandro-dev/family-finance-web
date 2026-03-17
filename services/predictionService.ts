// Interface para los parámetros de la API de predicciones
export interface PredictionParams {
   familyMemberId?: string;
   categoryId?: string;
}

// Interfaz para los elementos de la respuesta de la API de predicciones
export interface PredictionItem {
   date: string;
   predictedIncome: number;
   predictedExpenses: number;
   predictedBalance: number;
}

// Función para construir la URL de la API de predicciones
export function buildPredictionsPath(params: PredictionParams = {}): string {
   const {familyMemberId = "", categoryId = "" } = params;

   const queryParams = new URLSearchParams();

   if (familyMemberId) queryParams.append("familyMemberId", familyMemberId);
   if (categoryId) queryParams.append("categoryId", categoryId);

   const queryString = queryParams.toString();
   return `/api/predictions${queryString ? `?${queryString}` : ""}`;
}
