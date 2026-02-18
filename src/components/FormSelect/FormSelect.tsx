import { SelectHTMLAttributes, forwardRef, ReactNode } from "react";

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
  error?: boolean;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ children, className = "", error, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={`w-full appearance-none rounded-xl border border-slate-200 bg-white pl-4 pr-10 py-2.5 text-slate-900 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 ${
            error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
