import RegisterFamilyMember from "@/features/register-family-member/pages/RegisterFamilyMember";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register family member",
  description: "Complete the invitation process and join your family workspace in Family Finance.",
};

export default function SignUp() {
  return <RegisterFamilyMember />;
}
