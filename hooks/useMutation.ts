"use client";

import { useState, useCallback } from "react";
import { ErrorCode } from "@/services/errors/ErrorCode";
import { ToastService } from "@/services/toastService";
import { getErrorMessage } from "@/services/errorMessages";

// Interface para definir las opciones de uso de useMutation
interface UseMutationOptions<TData, TVariables> {
   mutationFn: (variables: TVariables) => Promise<TData>;
   onSuccess?: (data: TData, variables: TVariables) => void;
   onError?: (error: ErrorCode, variables: TVariables) => void;
   successMessage?: string;
   errorMessages?: Record<number, string>;
   showSuccessToast?: boolean;
   showErrorToast?: boolean;
}

// Interface para devolver el resultado de useMutation
interface UseMutationResult<TData, TVariables> {
   mutate: (variables: TVariables) => Promise<void>;
   data: TData | null;
   error: ErrorCode | null;
   isLoading: boolean;
   isSuccess: boolean;
   isError: boolean;
   reset: () => void;
}

export function useMutation<TData = unknown, TVariables = unknown>(
   options: UseMutationOptions<TData, TVariables>
): UseMutationResult<TData, TVariables> {
   const [data, setData] = useState<TData | null>(null);
   const [error, setError] = useState<ErrorCode | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [isSuccess, setIsSuccess] = useState(false);
   const [isError, setIsError] = useState(false);

   // Resetea los estados cuando se cambia la URL
   const reset = useCallback(() => {
      setData(null);
      setError(null);
      setIsLoading(false);
      setIsSuccess(false);
      setIsError(false);
   }, []);

   // Función para invocar la función de mutation
   const mutate = useCallback(
      async (variables: TVariables) => {
         // Ponemos el estado en "cargando"
         setIsLoading(true);
         setIsSuccess(false);
         setIsError(false);
         setError(null);

         try {
            // Ejecutar la función que hace la petición al backend
            const result = await options.mutationFn(variables);

            // Guardamos el resultado y marcamos como exitoso
            setData(result);
            setIsSuccess(true);

            // Mostrar toast de éxito si está configurado
            if (options.showSuccessToast !== false && options.successMessage) {
               ToastService.success(options.successMessage);
            }

            // Llamar callback de éxito si existe
            options.onSuccess?.(result, variables);

         } catch (e) {
            const errorCode = e instanceof ErrorCode ? e : new ErrorCode("Error desconocido", 500);

            // Guardar el error y marcar como error
            setError(errorCode);
            setIsError(true);

            // Mostrar toast de error si está configurado
            if (options.showErrorToast !== false) {
               const errorMessage = getErrorMessage(errorCode, options.errorMessages);
               ToastService.error(errorMessage);
            }

            // Llamar callback de error si existe
            options.onError?.(errorCode, variables);

         } finally {
            // Dejar de cargar
            setIsLoading(false);
         }
      },
      [options]
   );

   return {
      mutate,
      data,
      error,
      isLoading,
      isSuccess,
      isError,
      reset,
   };
}

export default useMutation;
