"use client";

import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import EyeIcon from "@/icons/eye.svg";
import EyeCloseIcon from "@/icons/eye-close.svg";
import { useAuthLogin } from "../hooks/useAuthLogin";

export default function SignInForm() {
   const { showPassword, setShowPassword, handleSubmit, readData, credentials, isLoading } = useAuthLogin();
   
   return (
      <div className="flex flex-col flex-1 w-full">
         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10 mt-10">
            <div>
               <div className="mb-5 sm:mb-8">
                  <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                     Sign In
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                     Enter your email and password to sign in!
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
                              onChange={readData} 
                              name="email" 
                              placeholder="info@gmail.com" 
                              type="email" 
                              value={credentials.email} 
                           />
                        </div>
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
                        <div className="flex items-center justify-between">
                           <Link
                              href="/reset-password"
                              className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 ml-auto"
                           >
                              Forgot password?
                           </Link>
                        </div>
                        <div>
                           <Button className="w-full" size="sm" disabled={isLoading}>
                              {isLoading ? "Signing in..." : "Sign in"}
                           </Button>
                        </div>
                     </div>
                  </form>

                  <div className="mt-5">
                     <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Don&apos;t have an account? {""}
                        <Link
                           href="/signup"
                           className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                           Sign Up
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
 }
