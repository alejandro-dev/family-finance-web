import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ToastService from "@/services/toastService";
import useMutation from "@/hooks/useMutation";
import { createFamilyMember, InvitationAuthRegisterInput } from "@/services/registerFamilyMember";


interface InvitationAuthRegisterFormState {
   username: string;
   email: string;
   password: string;
   birthDate: string;
}

const EMPTY_FORM: InvitationAuthRegisterFormState = {
   username: "",
   email: "",
   password: "",
   birthDate: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useRegisterFamilyMember = () => {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);
   const [isChecked, setIsChecked] = useState(false);
   const [credentials, setCredentials] = useState<InvitationAuthRegisterFormState>(EMPTY_FORM);

   // Validación de campos
   const [touched, setTouched] = useState(false);
   const usernameError = touched && credentials.username.trim().length === 0;
   const emailError = touched && (!credentials.email.trim() || !EMAIL_REGEX.test(credentials.email));
   const passwordError = touched && (credentials.password.trim().length === 0 || credentials.password.length < 8);
   const birthDateError = touched && credentials.birthDate.trim().length === 0;

   // Almacenar lo que el usuario escribe en el state
   const readData = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const field = name as keyof InvitationAuthRegisterFormState;

      setCredentials((prev) => ({ ...prev, [field]: value }));
   };
   
   // Flatpickr no emite ChangeEvent<HTMLInputElement>, por eso manejamos la fecha en un callback dedicado.
   const handleBirthDateChange = useCallback((_: Date[], dateStr: string) => {
      setCredentials((prev) => ({ ...prev, birthDate: dateStr }));
   }, []);
   
   // Mensajes específicos para los errores de los inputs.
   const fieldErrors = useMemo(() => ({
      username: usernameError ? "Username is required" : undefined,
      email: emailError
         ? (!credentials.email.trim() ? "Email is required" : "Enter a valid email")
         : undefined,
      password: passwordError
         ? (!credentials.password.trim()
            ? "Password is required"
            : "Password must be at least 8 characters long")
         : undefined,
      birthDate: birthDateError ? "Birth date is required" : undefined,
   }), [
      birthDateError,
      credentials.email,
      credentials.password,
      emailError,
      passwordError,
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
         credentials.password.length < 8 ||
         credentials.birthDate.trim().length === 0;

      if (hasErrors) {
         ToastService.warning("Revisa los campos marcados en el formulario");
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
   const { mutate: submitRegisterFamilyMember, isLoading } = useMutation({
      mutationFn: async (input: InvitationAuthRegisterInput) => {
         return await createFamilyMember(input);
      },
      successMessage: "Your account has been created successfully. A confirmation email has just been sent",
      errorMessages: errorMessages,
      onSuccess: () => {
         router.push("/signin");
         setCredentials(EMPTY_FORM);
      },
   });

   // Registrar familiar
   const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Validar que los campos no estén vacíos
      if (!validate()) return;

      // Mandar la solicitud al backend
      await submitRegisterFamilyMember({username: credentials.username, email: credentials.email, password: credentials.password, birthDate: credentials.birthDate});
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
      birthDateError,
      setShowPassword, 
      setIsChecked, 
      readData, 
      handleSubmit, 
      handleBirthDateChange 
   };
}
