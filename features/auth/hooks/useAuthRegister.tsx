import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { AuthRegisterInput, register } from "@/services/authService";
import { useRouter } from "next/navigation";
import ToastService from "@/services/toastService";
import useMutation from "@/hooks/useMutation";

interface AuthRegisterFormState {
   username: string;
   email: string;
   password: string;
   familyName: string;
   birthDate: string;
}

const EMPTY_FORM: AuthRegisterFormState = {
   username: "",
   email: "",
   password: "",
   familyName: "",
   birthDate: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useAuthRegister = () => {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [isChecked, setIsChecked] = useState(false);
   const [credentials, setCredentials] = useState<AuthRegisterFormState>(EMPTY_FORM);
   const [touched, setTouched] = useState(false);

   // Almacenar lo que el usuario escribe en el state
   const readData = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const field = name as keyof AuthRegisterFormState;

      setCredentials((prev) => ({ ...prev, [field]: value }));
   };

   // Flatpickr no emite ChangeEvent<HTMLInputElement>, por eso manejamos la fecha en un callback dedicado.
   const handleBirthDateChange = useCallback((_: Date[], dateStr: string) => {
      setCredentials((prev) => ({ ...prev, birthDate: dateStr }));
   }, []);

   // Validación de campos
   const usernameError = touched && credentials.username.trim().length === 0;
   const emailError = touched && (!credentials.email.trim() || !EMAIL_REGEX.test(credentials.email));
   const passwordError = touched && (credentials.password.trim().length === 0 || credentials.password.length < 6);
   const familyNameError = touched && credentials.familyName.trim().length === 0;
   const birthDateError = touched && credentials.birthDate.trim().length === 0;
   const termsError = touched && !isChecked;

   // Mensajes específicos para los errores de los inputs.
   const fieldErrors = useMemo(() => ({
      username: usernameError ? "Username is required" : undefined,
      email: emailError
         ? (!credentials.email.trim() ? "Email is required" : "Enter a valid email")
         : undefined,
      password: passwordError
         ? (!credentials.password.trim()
            ? "Password is required"
            : "Password must be at least 6 characters long")
         : undefined,
      familyName: familyNameError ? "Family name is required" : undefined,
      birthDate: birthDateError ? "Birth date is required" : undefined,
      terms: termsError ? "You must accept the terms and conditions" : undefined,
   }), [
      birthDateError,
      credentials.email,
      credentials.password,
      emailError,
      familyNameError,
      passwordError,
      termsError,
      usernameError,
   ]);

   // Validación de campos
   const validate = (): boolean => {
      setTouched(true);

      const hasErrors =
         credentials.username.trim().length === 0 ||
         !credentials.email.trim() ||
         !EMAIL_REGEX.test(credentials.email) ||
         credentials.password.trim().length === 0 ||
         credentials.password.length < 6 ||
         credentials.familyName.trim().length === 0 ||
         credentials.birthDate.trim().length === 0 ||
         !isChecked;

      if (hasErrors) {
         ToastService.warning("Please review the highlighted fields in the form");
         return false;
      }

      return true;
   };

   const errorMessages: Record<number, string> = {
      400: "Enter a valid email",
      409: "An account with this email already exists",
      422: "The password does not meet the minimum requirements",
   };

   // Hook de mutation para manejar la petición
   const { mutate: submitRegister, isLoading } = useMutation({
      mutationFn: async (input: AuthRegisterInput) => {
         return await register(input);
      },
      successMessage: "Your account has been created successfully. A confirmation email has just been sent",
      errorMessages: errorMessages,
      onSuccess: () => {
         router.push("/signin");
         setCredentials(EMPTY_FORM);
         setIsChecked(false);
         setTouched(false);
      },
   });

   // Registrar usuario
   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validar que los campos no estén vacíos
      if (!validate()) return;

      // Mandar la solicitud al backend
      await submitRegister({
         username: credentials.username,
         email: credentials.email,
         password: credentials.password,
         familyName: credentials.familyName,
         birthDate: credentials.birthDate,
      });
   };

   return {
      showPassword,
      isChecked,
      credentials,
      isLoading,
      fieldErrors,
      touched,
      usernameError,
      emailError,
      passwordError,
      familyNameError,
      birthDateError,
      termsError,
      setShowPassword,
      setIsChecked,
      readData,
      handleBirthDateChange,
      handleSubmit,
   };
}
