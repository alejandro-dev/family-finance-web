"use client";

import React, { useCallback, useEffect, useState } from "react";
import Alert, { AlertProps } from "./Alert";

interface ToastProps extends AlertProps {
   duration?: number;
   onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
   variant,
   title,
   message,
   duration = 3000,
   onClose,
}) => {
   const [isVisible, setIsVisible] = useState(false);
   const [isLeaving, setIsLeaving] = useState(false);

   // Cierra el modal
   const handleClose = useCallback(() => {
      // Marcar que se está saliendo
      setIsLeaving(true);

      // Esperar 300 ms para que el efecto de animación se complete
      setTimeout(() => {
         onClose();
      }, 300);
   }, [onClose]);

   useEffect(() => {
      // Trigger entrance animation
      const enterTimeout = setTimeout(() => {
         setIsVisible(true);
      }, 50);

      // Agregar un timeout para que el efecto de animación se complete
      let dismissTimeout: NodeJS.Timeout;
      if (duration && duration > 0) {
         dismissTimeout = setTimeout(() => {
            handleClose();
         }, duration);
      }

      // Limpiar los timeouts cuando el componente se desmonte
      return () => {
         clearTimeout(enterTimeout);
         if (dismissTimeout) {
            clearTimeout(dismissTimeout);
         }
      };
   }, [duration, handleClose]);

   return (
      <div
         className={`fixed top-4 right-4 z-99999 w-80 transition-all duration-300 ease-out transform ${
            isVisible && !isLeaving
               ? "translate-x-0 opacity-100"
               : isLeaving
               ? "translate-x-full opacity-0"
               : "translate-x-full opacity-0"
         }`}
      >
         <Alert
            variant={variant}
            title={title}
            message={message}
            onClose={handleClose}
         />
      </div>
   );
};

export default Toast;
