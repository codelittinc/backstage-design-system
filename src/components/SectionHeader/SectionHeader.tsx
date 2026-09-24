import { ReactNode } from "react";

export interface SectionHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function SectionHeader({
  children,
  className = "",
}: SectionHeaderProps) {
  return (
    <h2
      className={`mb-4 text-xl font-semibold text-slate-900 ${className}`}
    >
      {children}
    </h2>
  );
}
