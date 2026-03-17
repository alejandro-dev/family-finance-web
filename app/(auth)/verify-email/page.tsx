import { Suspense } from "react";
import VerifyEmailSuccess from "@/features/auth/pages/VerifyEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verification Successful | Family Finance",
  description: "Your account has been verified successfully",
};

export default function VerifyEmail() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <VerifyEmailSuccess />
    </Suspense>
  );
}
