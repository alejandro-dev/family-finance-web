"use client";

import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { changePassword } from "@/services/authService";
import { ToastService } from "@/services/toastService";
import { useMutation } from "@/hooks/useMutation";

export const useChangePassword = () => {
   const [credentials, setCredentials] = useState({ password: "", password_confirm: "" });
   const [showPassword, setShowPassword] = useState(false);
   const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
   const searchParams = useSearchParams();

   // Obtener el token de la URL
   const token = searchParams.get("token");

   // Almacenar lo que el usuario escribe en el state
   const readData = (e: ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   // Validación de campos
   const validate = (): boolean => {
      if (!credentials.password || !credentials.password_confirm || !token) {
         ToastService.warning("Please complete all required fields");
         return false;
      }

      if (credentials.password !== credentials.password_confirm) {
         ToastService.warning("Passwords do not match");
         return false;
      }

      return true;
   };

   // Mensajes específicos para la llamadas
   const changePasswordErrorMessages: Record<number, string> = {
      400: "The password must be at least 5 characters long",
      410: "The URL token is not valid",
   };

   // Hook de mutation para manejar la petición
   const { mutate: submitChangePassword, isLoading } = useMutation({
      mutationFn: async ({ password, token }: { password: string; token: string }) => {
         return await changePassword(password, token);
      },
      successMessage: "Your password has been changed successfully",
      errorMessages: changePasswordErrorMessages,
      onSuccess: () => {
         setCredentials({ password: "", password_confirm: "" });
      },
   });

   // Cambiar la contraseña
   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validate()) return;

      await submitChangePassword({ password: credentials.password, token: token! });
   };

   return {
      credentials,
      readData,
      showPassword,
      setShowPassword,
      showPasswordConfirm,
      setShowPasswordConfirm,
      isLoading,
      handleSubmit,
   };
};

export default useChangePassword;
