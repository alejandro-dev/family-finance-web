"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useChangePassword } from "../hooks/useChangePassword";

export default function ChangePasswordForm() {

   const { 
      credentials, 
      readData, 
      showPassword, 
      setShowPassword, 
      showPasswordConfirm, 
      setShowPasswordConfirm, 
      isLoading, 
      handleSubmit 
   } = useChangePassword();

   return (
      <div className="flex flex-col flex-1 w-full">
         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10 mt-10">
            <div>
               <div className="mb-5 sm:mb-8">
                  <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                     Change Password
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     Enter your new password.
                  </p>
               </div>
               <div>
                  <form onSubmit={handleSubmit}>
                     <div className="space-y-6">
                        <div>
                           <Label>
                              Password <span className="text-error-500">*</span>{" "}
                           </Label>
                           <div className="relative">
                              <Input
                                 onChange={readData}
                                 name="password"
                                 type={showPassword ? "text" : "password"}
                                 placeholder="Enter your password"
                                 value={credentials.password}
                              />
                              <span
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                              >
                                 {showPassword ? (
                                    <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                 ) : (
                                    <EyeCloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                 )}
                              </span>
                           </div>
                        </div>
                        <div>
                           <Label>
                              Confirm password <span className="text-error-500">*</span>{" "}
                           </Label>
                           <div className="relative">
                              <Input
                                 onChange={readData}
                                 name="password_confirm"
                                 type={showPasswordConfirm ? "text" : "password"}
                                 placeholder="Confirm your password"
                                 value={credentials.password_confirm}
                              />
                              <span
                                 onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                 className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                              >
                                 {showPasswordConfirm ? (
                                    <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                 ) : (
                                    <EyeCloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                 )}
                              </span>
                           </div>
                        </div>
                        <div>
                           <Button className="w-full" size="sm" disabled={isLoading}>
                              {isLoading ? "Changing..." : "Change Password"}
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
