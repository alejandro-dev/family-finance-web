"use client";

import React, { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLoginInput, login } from "@/services/authService";
import ToastService from "@/services/toastService";
import useMutation from "@/hooks/useMutation";
import { demoUser, isDemoMode } from "@/lib/demo";

export const useAuthLogin = () => {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [credentials, setCredentials] = useState({
      email: isDemoMode ? demoUser.email : "",
      password: isDemoMode ? "demo-access" : "",
   });

   // Almacenar lo que el usuario escribe en el state
   const readData = (e: ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   // Validación de campos
   const validate = (): boolean => {
      if (!credentials.email || !credentials.password) {
         ToastService.warning("Please complete all required fields");
         return false;
      }
      return true;
   };

   // Mensajes específicos para la llamadas
   const errorMessages: Record<number, string> = {
      401: "Incorrect email or password",
      403: "You cannot access this account",
   };

   // Hook de mutation para manejar la petición
   const { mutate: submitLogin, isLoading } = useMutation({
      mutationFn: async (input: AuthLoginInput) => {
         return await login(input);
      },
      successMessage: "",
      errorMessages: errorMessages,
      onSuccess: (data) => {
         // Si es admin, redirigir a la página de usuarios, si no, a dashboard
         if(data.isAdmin) router.push("/admin/users");
         else router.push("/dashboard");
         
         setCredentials({ email: '', password: '' });
      },
   });

   // Iniciar sesión
   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validar que los campos no estén vacíos
      if (!validate()) return;

      // Mandar la solicitud al backend
      await submitLogin({email: credentials.email, password: credentials.password});
   };

   return { showPassword, setShowPassword, handleSubmit, readData, credentials, isLoading }
}
