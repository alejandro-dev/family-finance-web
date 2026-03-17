"use client";

import { useEffect, useMemo, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SaveCategoryPayload } from "@/services/categoriesService";
import { Category } from "@/types/Category";

interface CategoryModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (payload: SaveCategoryPayload) => Promise<void>;
   isLoading?: boolean;
   category?: Category | null;
}

export default function CategoryModal({
   isOpen,
   onClose,
   onSave,
   isLoading = false,
   category = null,
}: CategoryModalProps) {
   const [name, setName] = useState(category?.name ?? "");
   const [touched, setTouched] = useState(false);

   const isEditMode = useMemo(() => Boolean(category?.id), [category]);
   const hasError = touched && name.trim().length === 0;

   useEffect(() => {
      if (!isOpen) return;
      
   }, [isOpen, category]);

   const handleSave = async () => {
      setTouched(true);

      const normalizedName = name.trim();
      if (!normalizedName) return;

      await onSave({ name: normalizedName });
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
         <div className="relative w-full rounded-3xl bg-white p-6 dark:bg-gray-900">
            <div className="mb-6">
               <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                  {isEditMode ? "Edit category" : "New category"}
               </h4>
               <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {isEditMode
                     ? "Update the category information."
                     : "Complete the information to create a new category."}
               </p>
            </div>

            <div>
               <Label htmlFor="category-name">Name</Label>
               <Input
                  id="category-name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Groceries"
                  error={hasError}
                  hint={hasError ? "Name is required" : undefined}
               />
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
               <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                  Cancel
               </Button>
               <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : isEditMode ? "Save changes" : "Create category"}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
