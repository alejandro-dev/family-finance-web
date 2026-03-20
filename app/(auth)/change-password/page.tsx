import ChangePasswordForm from "@/features/auth/pages/ChangePasswordForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Change password",
  description: "Choose a new password for your Family Finance account and keep your family data protected.",
};

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordForm />
    </Suspense>
  );
}
