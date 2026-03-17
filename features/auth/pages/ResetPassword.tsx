"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { useAuthPassword } from "../hooks/useAuthPassword";

export default function ResetPasswordForm() {

   const { credentials, readData, handleSubmit, isLoading } = useAuthPassword();

   return (
      <div className="flex flex-col flex-1 w-full">
         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10 mt-10">
            <div>
               <div className="mb-5 sm:mb-8">
                  <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                     Forgot Your Password?
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     Enter the email address linked to your account, and we&apos;ll send you a link to reset your password.
                  </p>
               </div>
               <div>
                  <form onSubmit={handleSubmit}>
                     <div className="space-y-6">
                        <div>
                           <Label>
                              Email <span className="text-error-500">*</span>{" "}
                           </Label>
                           <Input 
                              placeholder="info@gmail.com" 
                              name="email" 
                              id="email" 
                              type="email" 
                              value={credentials.email}
                              onChange={readData} 
                           />
                        </div>
                        <div>
                           <Button className="w-full" size="sm" disabled={isLoading}>
                              {isLoading ? "Sending..." : "Reset Password"}
                           </Button>
                        </div>
                     </div>
                  </form>

                  <div className="mt-5">
                     <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Wait, I remember my password...  {""}
                        <Link
                           href="/signin"
                           className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                           Click here
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
