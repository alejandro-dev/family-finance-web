"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ToastData } from "@/components/ui/alert";

interface ToastContextValue {
   toast: ToastData | null;
   showToast: (data: ToastData) => void;
   hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [toast, setToast] = useState<ToastData | null>(null);

   // Mostrar toast
   const showToast = useCallback((data: ToastData) => {
      setToast(data);
   }, []);

   // Ocultar toast
   const hideToast = useCallback(() => {
      setToast(null);
   }, []);

   // Devolver el contexto
   return React.createElement(
      ToastContext.Provider,
      { value: { toast, showToast, hideToast } },
      children
   );
};

// Usar el contexto
export const useToastContext = () => {
   const context = useContext(ToastContext);
   if (!context) {
      throw new Error("useToastContext must be used within a ToastProvider");
   }
   return context;
};

export default ToastContext;
