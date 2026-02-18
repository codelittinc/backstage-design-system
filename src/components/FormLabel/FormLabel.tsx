import { LabelHTMLAttributes, ReactNode } from "react";

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
}

export default function FormLabel({
  children,
  required,
  className = "",
  ...props
}: FormLabelProps) {
  return (
    <label
      className={`mb-2 block text-sm font-medium text-slate-700 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}
