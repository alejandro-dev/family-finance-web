"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Income } from "@/features/incomes/types/incomes";

interface DeleteIncomeModalProps {
   isOpen: boolean;
   income: Income | null;
   isLoading?: boolean;
   onCancel: () => void;
   onConfirm: () => Promise<void>;
}

export default function DeleteIncomeModal({
   isOpen,
   income,
   isLoading = false,
   onCancel,
   onConfirm,
}: DeleteIncomeModalProps) {
   return (
      <Modal isOpen={isOpen} onClose={onCancel} className="max-w-lg m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">Confirmar eliminación</h4>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
               ¿Seguro que quieres eliminar el ingreso{" "}
               <span className="font-semibold text-gray-700 dark:text-gray-200">{income?.description ?? ""}</span>
               ? Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onCancel} disabled={isLoading}>
                  Cancelar
               </Button>
               <Button
                  size="sm"
                  className="bg-error-500 hover:bg-error-600 disabled:bg-error-300"
                  onClick={onConfirm}
                  disabled={isLoading}
               >
                  {isLoading ? "Eliminando..." : "Eliminar"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
