import { ErrorCode } from "@/services/errors/ErrorCode";

// Mapeo centralizado de códigos HTTP a mensajes de error
export const errorMessages: Record<number, string> = {
   400: "The request is invalid. Please check the entered data.",
   401: "You are not authorized to perform this action.",
   403: "You do not have permission to access this resource.",
   404: "The requested resource was not found.",
   409: "A resource with these details already exists.",
   422: "The provided data is invalid.",
   429: "Too many requests. Please try again later.",
   500: "Internal server error. Please try again later.",
   502: "Service unavailable. Please try again later.",
   503: "Servicio temporalmente no disponible.",
};

// Mensaje por defecto para errores no mapeados
export const DEFAULT_ERROR_MESSAGE = "It looks like something went wrong. Please try again later";

// Función para obtener mensaje de error personalizado según el contexto
export const getErrorMessage = (
   error: ErrorCode,
   customMessages?: Record<number, string>
): string => {
   // Primero buscar en mensajes personalizados si se proporcionan
   if (customMessages && customMessages[error.status]) return customMessages[error.status];

   // Luego buscar en el mapeo global
   if (errorMessages[error.status]) return errorMessages[error.status];

   // Si el error tiene un mensaje específico, usarlo
   if (error.message && error.message !== "Unexpected error") return error.message;

   // Fallback al mensaje por defecto
   return DEFAULT_ERROR_MESSAGE;
};

export default errorMessages;
