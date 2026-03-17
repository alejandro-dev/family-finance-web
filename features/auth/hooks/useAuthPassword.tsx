import { resetPassword } from "@/services/authService";
import { ToastService } from "@/services/toastService";
import { useMutation } from "@/hooks/useMutation";
import { ChangeEvent, useState } from "react";

export const useAuthPassword = () => {
   const [credentials, setCredentials] = useState({ email: "" });

   // Almacenar lo que el usuario escribe en el state
   const readData = (e: ChangeEvent<HTMLInputElement>) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   // Validación de campos
   const validate = (): boolean => {
      if (!credentials.email) {
         ToastService.warning("Please complete all required fields");
         return false;
      }
      return true;
   };

   // Mensajes específicos para la llamadas
   const errorMessages: Record<number, string> = {
      403: "Cuenta no verificada. Por favor, verifica tu email.",
      404: "Email no encontrado",
   };

   // Hook de mutation para manejar la petición
   const { mutate: submitResetPassword, isLoading } = useMutation({
      mutationFn: async (email: string) => {
         return await resetPassword(email);
      },
      successMessage: "An email with password reset instructions has been sent",
      errorMessages: errorMessages,
      onSuccess: () => {
         setCredentials({ email: "" });
      },
   });

   // Enviar la solicitud al backend
   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validate()) return;

      await submitResetPassword(credentials.email);
   };

   return {
      credentials,
      readData,
      handleSubmit,
      isLoading,
   };
};

export default useAuthPassword;
