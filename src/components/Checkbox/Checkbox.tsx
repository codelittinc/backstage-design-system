"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  labelClassName?: string;
  wrapperClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, labelClassName = "", wrapperClassName = "", className = "", disabled, ...props },
    ref
  ) => {
    const input = (
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={`h-4 w-4 rounded border-slate-300 text-[#0066cc] focus:ring-[#0066cc] disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );

    if (!label) return input;

    return (
      <label
        className={`inline-flex items-center gap-2 text-sm font-medium text-slate-700 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } ${wrapperClassName}`}
      >
        {input}
        <span className={labelClassName}>{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
