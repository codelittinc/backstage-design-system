import { InputHTMLAttributes, forwardRef } from "react";

export interface FormDateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

const FormDateInput = forwardRef<HTMLInputElement, FormDateInputProps>(
  ({ className = "", error, value, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        value={value}
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 ${
          error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""
        } ${className}`}
        {...props}
      />
    );
  }
);

FormDateInput.displayName = "FormDateInput";

export default FormDateInput;
