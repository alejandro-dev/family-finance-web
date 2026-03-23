"use client";

import Link from "next/link";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import EyeIcon from "@/icons/eye.svg";
import EyeCloseIcon from "@/icons/eye-close.svg";
import { useAuthRegister } from "../hooks/useAuthRegister";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/form/date-picker";

export default function SignUpForm() {
   const {
      showPassword,
      setShowPassword,
      isChecked,
      setIsChecked,
      readData,
      handleBirthDateChange,
      handleSubmit,
      isLoading,
      credentials,
      fieldErrors,
      touched,
      usernameError,
      emailError,
      passwordError,
      familyNameError,
      birthDateError,
      termsError,
   } = useAuthRegister();

   return (
      <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">
         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10 mt-10">
            <div>
               <div className="mb-5 sm:mb-8">
                  <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"> Sign Up </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400"> Enter your email and password to sign up! </p>
               </div>
               <div>
                  <form onSubmit={handleSubmit}>
                     <div className="space-y-5">
                        <div>
                           <Label>
                              Username<span className="text-error-500">*</span>
                           </Label>
                           <Input
                              onChange={readData}
                              type="text"
                              id="username"
                              name="username"
                              placeholder="Enter your username"
                              value={credentials.username}
                              error={usernameError}
                              hint={touched ? fieldErrors.username : undefined}
                           />
                        </div>
                        {/* <!-- Email --> */}
                        <div>
                           <Label>
                              Email<span className="text-error-500">*</span>
                           </Label>
                           <Input
                              onChange={readData}
                              type="email"
                              id="email"
                              name="email"
                              placeholder="Enter your email"
                              value={credentials.email}
                              error={emailError}
                              hint={touched ? fieldErrors.email : undefined}
                           />
                        </div>
                        {/* <!-- Password --> */}
                        <div>
                           <Label>
                              Password<span className="text-error-500">*</span>
                           </Label>
                           <div className="relative">
                              <Input
                                 onChange={readData}
                                 placeholder="Enter your password"
                                 type={showPassword ? "text" : "password"}
                                 id="password"
                                 name="password"
                                 value={credentials.password}
                                 error={passwordError}
                                 hint={touched ? fieldErrors.password : undefined}
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
                              Family name<span className="text-error-500">*</span>
                           </Label>
                           <Input
                              onChange={readData}
                              type="text"
                              id="familyName"
                              name="familyName"
                              placeholder="Enter your family name"
                              value={credentials.familyName}
                              error={familyNameError}
                              hint={touched ? fieldErrors.familyName : undefined}
                           />
                        </div>
                        <div>
                           <DatePicker
                              id="birthDate"
                              name="birthDate"
                              label="Birth date"
                              placeholder="Select date"
                              onChange={handleBirthDateChange}
                              defaultDate={credentials.birthDate || undefined}
                              error={birthDateError}
                              hint={touched ? fieldErrors.birthDate : undefined}
                           />
                        </div>
                        {/* <!-- Checkbox --> */}
                        <div className="flex items-center gap-3">
                           <Checkbox
                              className="w-5 h-5"
                              checked={isChecked}
                              onChange={setIsChecked}
                           />
                           <p className={`inline-block font-normal ${termsError ? "text-error-500" : "text-gray-500 dark:text-gray-400"}`}>
                              By creating an account means you agree to the{" "}
                              <span className={termsError ? "text-error-500" : "text-gray-800 dark:text-white/90"}>
                                 Terms and Conditions,
                              </span>{" "}
                              and our{" "}
                              <span className={termsError ? "text-error-500" : "text-gray-800 dark:text-white"}>
                                 Privacy Policy
                              </span>
                           </p>
                        </div>
                        {termsError ? (
                           <p className="text-sm text-error-500">
                              {fieldErrors.terms}
                           </p>
                        ) : null}
                        {/* <!-- Button --> */}
                        <div>
                           <Button className="w-full" size="sm" disabled={isLoading || !isChecked}>
                              {isLoading ? "Signing up..." : "Sign up"}
                           </Button>
                        </div>
                     </div>
                  </form>

                  <div className="mt-5">
                     <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Already have an account? {""}
                        <Link
                           href="/signin"
                           className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                           Sign In
                        </Link>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
