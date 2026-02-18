import { ReactNode } from "react";

export interface TagProps {
  children: ReactNode;
  variant?: "blue" | "green" | "gray" | "red" | "yellow" | "purple";
  onRemove?: () => void;
  className?: string;
}

const variantClasses = {
  blue: "bg-[#0066cc]/5 text-[#0066cc] border-[#0066cc]/10",
  green: "bg-emerald-50 text-emerald-700 border-emerald-100",
  gray: "bg-slate-50 text-slate-700 border-slate-100",
  red: "bg-red-50 text-red-700 border-red-100",
  yellow: "bg-amber-50 text-amber-700 border-amber-100",
  purple: "bg-purple-50 text-purple-700 border-purple-100",
};

const removeButtonClasses = {
  blue: "text-[#0066cc]/70 hover:text-[#0066cc]",
  green: "text-emerald-500 hover:text-emerald-700",
  gray: "text-slate-500 hover:text-slate-700",
  red: "text-red-500 hover:text-red-700",
  yellow: "text-amber-500 hover:text-amber-700",
  purple: "text-purple-500 hover:text-purple-700",
};

export default function Tag({
  children,
  variant = "blue",
  onRemove,
  className = "",
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`ml-1 ${removeButtonClasses[variant]}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
