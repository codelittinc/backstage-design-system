"use client";

import { ReactNode } from "react";

export interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  message,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-card ${className}`}
    >
      {icon && <div className="mb-4 flex justify-center text-slate-400">{icon}</div>}
      <p className="text-slate-600 font-medium">{message}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
