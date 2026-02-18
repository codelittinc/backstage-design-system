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
      className={`text-xl font-semibold text-slate-900 border-b border-slate-200 pb-3 ${className}`}
    >
      {children}
    </h2>
  );
}
