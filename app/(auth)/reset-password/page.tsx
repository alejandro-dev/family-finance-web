import ResetPasswordForm from "@/features/auth/pages/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Set a new password to recover access to your Family Finance account securely.",
};

export default function ResetPassword() {
  return <ResetPasswordForm />;
}
