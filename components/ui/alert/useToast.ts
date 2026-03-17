"use client";

import { useState, useCallback } from "react";

export interface ToastData {
   variant: "success" | "error" | "warning" | "info";
   title: string;
   message: string;
   duration?: number;
}

export const useToast = () => {
   const [toast, setToast] = useState<ToastData | null>(null);

   const showToast = useCallback((data: ToastData) => {
      setToast(data);
   }, []);

   const hideToast = useCallback(() => {
      setToast(null);
   }, []);

   return {
      toast,
      showToast,
      hideToast,
   };
};

export default useToast;
