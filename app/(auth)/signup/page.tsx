import SignUpForm from "@/features/auth/pages/AuthRegister";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Family Finance account and start managing your family budget, expenses, and shared income.",
};

export default function SignUp() {
  return <SignUpForm />;
}
