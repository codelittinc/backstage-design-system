"use client";

export interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  message = "Loading...",
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div
          className={`mb-4 inline-block animate-spin rounded-full border-solid border-[#0066cc] border-r-transparent ${sizeClasses[size]}`}
        />
        {message && <p className="text-sm text-slate-500">{message}</p>}
      </div>
    </div>
  );
}
