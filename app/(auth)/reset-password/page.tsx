import ResetPasswordForm from "@/features/auth/pages/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js ResetPassword Page TailAdmin Dashboard Template",
};

export default function ResetPassword() {
  return <ResetPasswordForm />;
}