import React from "react";
import SuccessIcon from "@/icons/success.svg";
import ErrorIcon from "@/icons/error.svg";
import WarningIcon from "@/icons/warning.svg";
import InfoIcon from "@/icons/info.svg";

export interface AlertProps {
   variant: "success" | "error" | "warning" | "info";
   title: string;
   message: string;
   className?: string;
   onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({
   variant,
   title,
   message,
   className = "",
   onClose
}) => {

   // Tailwind clases para cada variante
   const variantClasses = {
      success: {
         container:
            "border-success-500 bg-success-50 dark:border-success-500/30 dark:bg-success-500/15",
         icon: "text-success-500",
      },
      error: {
         container:
            "border-error-500 bg-error-50 dark:border-error-500/30 dark:bg-error-500/15",
         icon: "text-error-500",
      },
      warning: {
         container:
            "border-warning-500 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/15",
         icon: "text-warning-500",
      },
      info: {
         container:
            "border-blue-light-500 bg-blue-light-50 dark:border-blue-light-500/30 dark:bg-blue-light-500/15",
         icon: "text-blue-light-500",
      },
   };

   // Icono para cada variante
   const icons = {
      success: <SuccessIcon className="w-6 h-6" />,
      error: <ErrorIcon className="w-6 h-6" />,
      warning: <WarningIcon className="w-6 h-6" />,
      info: <InfoIcon className="w-6 h-6" />,
   };

    return (
       <div
          className={`rounded-xl border p-4 ${variantClasses[variant].container} ${className}`}
       >
          <div className="flex items-start gap-3">
             <div className={`-mt-0.5 ${variantClasses[variant].icon}`}>
                {icons[variant]}
             </div>

             <div className="flex-1">
                <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                   {title}
                </h4>

                <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
             </div>
             
             {onClose && (
                <button 
                   onClick={onClose}
                   className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                   aria-label="Close"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
             )}
          </div>
       </div>
    );
};

export default Alert;
