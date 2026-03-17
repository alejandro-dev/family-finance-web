"use client";

import React from "react";
import { ToastProvider, useToastContext } from "@/services/toastStore";
import { ToastService } from "@/services/toastService";
import { Toast } from "@/components/ui/alert";

// Componente interno que conecta el servicio con el contexto
const ToastContainer: React.FC = () => {
   const { toast, showToast, hideToast } = useToastContext();

   // Registrar el servicio al montar
   React.useEffect(() => {
      ToastService.register(showToast);
   }, [showToast]);

   if (!toast) return null;

   return React.createElement(Toast, {
      variant: toast.variant,
      title: toast.title,
      message: toast.message,
      duration: toast.duration,
      onClose: hideToast,
   });
};

// Provider que envuelve la app y renderiza el ToastContainer
export const GlobalToastProvider: React.FC<{ children: React.ReactNode }> = ({
   children,
}) => {
   return React.createElement(
      ToastProvider,
      null,
      React.createElement(React.Fragment, null, children, React.createElement(ToastContainer))
   );
};

export default GlobalToastProvider;
