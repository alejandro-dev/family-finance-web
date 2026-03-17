"use client";

import React, { useEffect, useState } from "react";

interface Option {
   value: string;
   label: string;
}

interface SelectProps {
   id?: string;
   name?: string;
   options: Option[];
   placeholder?: string;
   onChange?: (value: string) => void;
   className?: string;
   defaultValue?: string;
   error?: boolean;
   hint?: string;
}

const Select: React.FC<SelectProps> = ({
   id,
   name,
   options,
   placeholder = "Select an option",
   onChange,
   className = "",
   defaultValue = "",
   error = false,
   hint
}) => {
   // Manage the selected value
   const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

   // Keep Select in sync when parent updates value from URL/navigation changes.
   useEffect(() => {
      setSelectedValue(defaultValue);
   }, [defaultValue]);

   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      setSelectedValue(value);
      onChange?.(value); // Trigger parent handler
   };

   return (
      <div>
         <select
            id={id}
            name={name}
            className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${selectedValue
                  ? "text-gray-800 dark:text-white/90"
                  : "text-gray-400 dark:text-gray-400"
               } ${className} ${error ? "text-error-800 border-error-500 focus:ring-3 focus:ring-error-500/10  dark:text-error-400 dark:border-error-500": ""}`}
            value={selectedValue}
            onChange={handleChange}
         >
            {/* Placeholder option */}
            <option
               value=""
               disabled
               className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
               {placeholder}
            </option>
            {/* Map over options */}
            {options.map((option) => (
               <option
                  key={option.value}
                  value={option.value}
                  className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
               >
                  {option.label}
               </option>
            ))}
            {/* Optional Hint Text */}
         </select>
         {hint && (
            <p
               className={`mt-1.5 text-xs ${
                  error
                  ? "text-error-500"
                  : "text-gray-500"
               }`}
            >
               {hint}
            </p>
         )}
      </div>
   );
};

export default Select;
