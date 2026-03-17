"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useProfilePage } from "../hooks/useProfilePage";

export default function ChangePasswordCard() {
   
   const { 
      password, 
      confirmPassword, 
      showPassword, 
      showConfirmPassword, 
      fieldErrors, 
      touched,
      passwordError,
      confirmPasswordError,
      isLoading,
      setPassword, 
      setConfirmPassword, 
      setShowPassword, 
      setShowConfirmPassword, 
      handleSubmit 
   } = useProfilePage();

   return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
         <div className="mb-5 lg:mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
               Change Password
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
               Update your account password.
            </p>
         </div>

         <div className="space-y-5">
            <div>
               <Label htmlFor="profile-password">
                  Password <span className="text-error-500">*</span>
               </Label>
               <div className="relative">
                  <Input
                     id="profile-password"
                     name="password"
                     type={showPassword ? "text" : "password"}
                     placeholder="Enter your new password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
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
               <Label htmlFor="profile-confirm-password">
                  Confirm Password <span className="text-error-500">*</span>
               </Label>
               <div className="relative">
                  <Input
                     id="profile-confirm-password"
                     name="confirm-password"
                     type={showConfirmPassword ? "text" : "password"}
                     placeholder="Confirm your new password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     error={confirmPasswordError}
                     hint={touched ? fieldErrors.confirmPassword : undefined}
                  />
                  <span
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                     {showConfirmPassword ? (
                        <EyeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                     ) : (
                        <EyeCloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                     )}
                  </span>
               </div>
            </div>

            <div>
               <Button onClick={handleSubmit} type="button" size="sm" disabled={isLoading}>
                  { isLoading ? "Updating..." : "Update Password" }
               </Button>
            </div>
         </div>
      </div>
   );
}
