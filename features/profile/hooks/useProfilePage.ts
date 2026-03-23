"use client"

import useMutation from "@/hooks/useMutation";
import ToastService from "@/services/toastService";
import { changePassword } from "@/services/usersService";
import { useMemo, useState } from "react";

export const useProfilePage = () => {
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [touched, setTouched] = useState(false);

   const passwordError = touched && (password.trim().length === 0 || password.length < 6);
   const confirmPasswordError = touched && (confirmPassword.trim().length === 0 || confirmPassword.length < 6 || confirmPassword !== password);

   // Mensajes específicos para los errores de los inputs.
   const fieldErrors = useMemo(() => ({
      password: passwordError
         ? (!password.trim()
            ? "Password is required"
            : "Password must be at least 6 characters")
         : undefined,
      confirmPassword: confirmPasswordError
         ? (!confirmPassword.trim()
            ? "Confirm password is required"
            : confirmPassword !== password ? "Passwords do not match"
            : "Confirm password must be at least 6 characters")
         : undefined,
   }), [
      password,
      passwordError,
      confirmPassword,
      confirmPasswordError,
   ]);

   // Validación de campos
   const validate = (): boolean => {
      setTouched(true);

      const hasErrors = password.length < 6 || confirmPassword.length < 6;

      if (hasErrors) {
         ToastService.warning("Please review the highlighted fields in the form");
         return false;
      }

      return true;
   };

   // Limpiar el formulario de los cambios.
   const clearFormChangePassword = () => {
      setPassword("");
      setConfirmPassword("");
      setTouched(false);
   }

   // Hook de mutation para manejar la petición
   const { mutate: submitChangePassword, isLoading } = useMutation({
      mutationFn: async (input: { password: string }) => {
         return await changePassword(input);
      },
      successMessage: "Your password has been changed successfully",
      // errorMessages: errorMessages,
      onSuccess: () => {
         clearFormChangePassword();
         setTouched(false);
      },
   });

   // Evento para enviar el formulario.
   const handleSubmit = () => {
      // Validación de campos
      if (!validate()) return;

      // Mandar la solicitud al backend
      submitChangePassword({ password });
   };

   return {
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
   }
}
