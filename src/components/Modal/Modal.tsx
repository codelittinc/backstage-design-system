"use client";

import { ReactNode, useEffect, useId } from "react";

export type ModalSize = "sm" | "md" | "lg";

export interface ModalProps {
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  ariaLabelledBy?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  closeOnEscape = true,
  ariaLabelledBy,
}: ModalProps) {
  const generatedId = useId();
  const titleId = ariaLabelledBy ?? (title ? generatedId : undefined);

  useEffect(() => {
    if (!closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`w-full ${sizeClasses[size]} max-h-full overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:max-h-[90vh] sm:p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h3
            id={titleId}
            className="mb-4 text-lg font-semibold text-slate-900"
          >
            {title}
          </h3>
        )}
        <div>{children}</div>
        {footer && (
          <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
