"use client";

import Link from "next/link";
import Button from "@/components/ui/button/Button";
import SuccessBackgroundIcon from "@/icons/success-background.svg";
import SuccessVerifyIcon from "@/icons/success-verify.svg";
import WarningIcon from "@/icons/warning.svg";
import useVerifyEmail from "../hooks/useVerifyEmail";

export default function VerifyEmailSuccess() {
   const { status, title, description, ctaLabel, ctaHref, showSecondaryHelp } = useVerifyEmail();

   return (
      <div className="flex flex-col flex-1 w-full">
         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10 mt-10">
            <div>
               <div className="mb-5 sm:mb-8 text-center">
                  <div className="relative mx-auto mb-6 w-22.5 h-22.5">
                     <div
                        className={`absolute inset-0 flex items-center justify-center ${
                           status === "error"
                              ? "text-error-50 dark:text-error-500/15"
                              : "text-success-50 dark:text-success-500/15"
                        }`}
                     >
                        <SuccessBackgroundIcon className="w-full h-full" />
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        {status === "error" ? (
                           <WarningIcon className="w-9 h-9 text-error-600 dark:text-error-500" />
                        ) : (
                           <SuccessVerifyIcon className="w-9 h-9 text-success-600 dark:text-success-500" />
                        )}
                     </div>
                  </div>

                  <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                     {title}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
               </div>

               <div className="space-y-4">
                  {status === "loading" ? (
                     <Button className="w-full" size="sm" disabled>
                        {ctaLabel}
                     </Button>
                  ) : (
                     <Link href={ctaHref} className="block">
                        <Button className="w-full" size="sm">
                           {ctaLabel}
                        </Button>
                     </Link>
                  )}

                  {showSecondaryHelp && (
                     <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                        ¿Necesitas ayuda?{" "}
                        <Link href="/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
                           Volver a inicio de sesión
                        </Link>
                     </p>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
