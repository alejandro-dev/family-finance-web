import { ToastData } from "@/components/ui/alert";

class ToastServiceClass {
   private showToastFn: ((data: ToastData) => void) | null = null;

   // Registrar el callback de mostrar el toast
   register(showToast: (data: ToastData) => void) {
      this.showToastFn = showToast;
   }

   // Mostrar el toast
   private show(data: ToastData) {
      if (this.showToastFn) {
         this.showToastFn(data);
      } else {
         console.warn("ToastService: No toast handler registered");
      }
   }

   // Mostrar un toast de tipo "success"
   success(message: string, title: string = "Success", duration: number = 3000) {
      this.show({
         variant: "success",
         title,
         message,
         duration,
      });
   }

   // Mostrar un toast de tipo "error"
   error(message: string, title: string = "Error", duration: number = 3000) {
      this.show({
         variant: "error",
         title,
         message,
         duration,
      });
   }

   // Mostrar un toast de tipo "warning"
   warning(message: string, title: string = "Warning", duration: number = 3000) {
      this.show({
         variant: "warning",
         title,
         message,
         duration,
      });
   }

   // Mostrar un toast de tipo "info"
   info(message: string, title: string = "Information", duration: number = 3000) {
      this.show({
         variant: "info",
         title,
         message,
         duration,
      });
   }
}

export const ToastService = new ToastServiceClass();
export default ToastService;
