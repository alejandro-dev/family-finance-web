"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/services/authService";
import { useMutation } from "@/hooks/useMutation";

type VerifyStatus = "loading" | "success" | "error";

interface VerifyEmailViewModel {
   status: VerifyStatus;
   title: string;
   description: string;
   ctaLabel: string;
   ctaHref: string;
   showSecondaryHelp: boolean;
}

export const useVerifyEmail = (): VerifyEmailViewModel => {
   const searchParams = useSearchParams();
   const token = searchParams.get("token");
   const hasTriggeredRef = useRef(false);

   // Mensajes específicos para la llamadas
   const errorMessages: Record<number, string> = {
      400: "The verification link is invalid.",
      401: "The verification link has expired.",
      404: "Verification was not found.",
   };

   // Hook de mutation para manejar la petición
   const { mutate, isLoading, isSuccess, isError, error } = useMutation({
      mutationFn: async (safeToken: string) => verifyEmail(safeToken),
      errorMessages,
      showSuccessToast: false,
      showErrorToast: false,
   });

   useEffect(() => {
      if (!token || hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      void mutate(token);
   }, [token, mutate]);

   // Validación de campos
   if (!token) {
      return {
         status: "error",
         title: "Your account could not be verified",
         description: "The link does not contain a verification token.",
         ctaLabel: "Go to Sign In",
         ctaHref: "/signin",
         showSecondaryHelp: false,
      };
   }

   // Validación de estado de la petición
   if (isLoading || (!isSuccess && !isError)) {
      return {
         status: "loading",
         title: "Verifying your account...",
         description: "We are confirming your email address. This may take a few seconds.",
         ctaLabel: "Verificando...",
         ctaHref: "#",
         showSecondaryHelp: false,
      };
   }

   if (isSuccess) {
      return {
         status: "success",
         title: "Account Verified!",
         description:
            "Your email address has been confirmed successfully. You can now sign in and start managing your family finances.",
         ctaLabel: "Sign In",
         ctaHref: "/signin",
         showSecondaryHelp: true,
      };
   }

   if(isError) {
      console.log(error);
   }

   return {
      status: "error",
      title: "Your account could not be verified",
      description: error?.message ?? "The link is invalid or has expired. Request a new one.",
      ctaLabel: "Go to Sign In",
      ctaHref: "/signin",
      showSecondaryHelp: false,
   };
};

export default useVerifyEmail;
