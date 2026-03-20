import SignInForm from "@/features/auth/pages/AuthLogin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access your Family Finance account to review your household finances, expenses, and income activity.",
};

export default function SignIn() {
  return <SignInForm />;
}
