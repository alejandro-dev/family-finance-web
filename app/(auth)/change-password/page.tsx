import ChangePasswordForm from "@/features/auth/pages/ChangePasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js ChangePassword Page TailAdmin Dashboard Template",
};

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordForm />
    </Suspense>
  );
}
