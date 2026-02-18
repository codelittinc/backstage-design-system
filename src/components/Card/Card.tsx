import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-12",
};

export default function Card({
  children,
  padding = "md",
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-card ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
