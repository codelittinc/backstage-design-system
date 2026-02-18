"use client";

export interface ErrorAlertProps {
  message: string;
  className?: string;
  onDismiss?: () => void;
}

export default function ErrorAlert({
  message,
  className = "",
  onDismiss,
}: ErrorAlertProps) {
  return (
    <div
      className={`rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 ${className}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{message}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-red-400 hover:text-red-600"
            aria-label="Dismiss"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
