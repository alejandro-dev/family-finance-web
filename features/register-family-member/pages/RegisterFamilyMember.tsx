"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import EyeIcon from "@/icons/eye.svg";
import EyeCloseIcon from "@/icons/eye-close.svg";
import { Button } from "@/components/ui/button";
import { useRegisterFamilyMember } from "../hooks/useRegisterFamilyMember";
import DatePicker from "@/components/form/date-picker";

export default function RegisterFamilyMember() {
   const { 
      showPassword, 
      isChecked, 
      isLoading, 
      credentials,
      touched,
      fieldErrors,
      usernameError,
      emailError,
      passwordError,
      birthDateError,
      setShowPassword, 
      setIsChecked, 
      readData, 
      handleSubmit, 
      handleBirthDateChange 
   } = useRegisterFamilyMember();

   return (
      <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">
         <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto sm:pt-10 mt-10">
            <div>
               <div className="mb-5 sm:mb-8">
                  <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md"> Register </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400"> Enter your details to register! </p>
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
                           <DatePicker
                              id="birthDate"
                              name="birthDate"
                              label="Fecha de nacimiento"
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
                           <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                              By creating an account means you agree to the{" "}
                              <span className="text-gray-800 dark:text-white/90">
                                 Terms and Conditions,
                              </span>{" "}
                              and our{" "}
                              <span className="text-gray-800 dark:text-white">
                                 Privacy Policy
                              </span>
                           </p>
                        </div>
                        {/* <!-- Button --> */}
                        <div>
                           <Button className="w-full" size="sm" disabled={isLoading}>
                              {isLoading ? "Registering..." : "Register"}
                           </Button>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
      </div>
   );
}
