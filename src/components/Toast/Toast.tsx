'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastData {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toasts: ToastData[]) => void)[] = [];
let toasts: ToastData[] = [];

const notifyListeners = () => {
  toastListeners.forEach((listener) => listener([...toasts]));
};

export const toast = {
  show: (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts = [...toasts, { id, message, type }];
    notifyListeners();

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notifyListeners();
    }, 5000);
  },
  success: (message: string) => toast.show(message, 'success'),
  error: (message: string) => toast.show(message, 'error'),
  info: (message: string) => toast.show(message, 'info'),
  warning: (message: string) => toast.show(message, 'warning'),
};

export function ToastContainer() {
  const [toastList, setToastList] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (newToasts: ToastData[]) => {
      setToastList(newToasts);
    };
    toastListeners.push(listener);
    setToastList([...toasts]);

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  if (toastList.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toastList.map((t) => (
        <ToastItem
          key={t.id}
          toast={t}
          onClose={() => {
            toasts = toasts.filter((item) => item.id !== t.id);
            notifyListeners();
          }}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast: toastData, onClose }: { toast: ToastData; onClose: () => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const typeStyles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      icon: '\u2713',
      iconBg: 'bg-emerald-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '\u2715',
      iconBg: 'bg-red-100',
    },
    info: {
      bg: 'bg-[#0066cc]/5',
      border: 'border-[#0066cc]/20',
      text: 'text-[#0066cc]',
      icon: '\u2139',
      iconBg: 'bg-[#0066cc]/10',
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      icon: '\u26A0',
      iconBg: 'bg-amber-100',
    },
  };

  const styles = typeStyles[toastData.type];

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} ${styles.text}
        border rounded-xl shadow-lg p-4 flex items-start gap-3
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
      `}
      role="alert"
    >
      <div className={`${styles.iconBg} rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm font-bold`}>
        {styles.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{toastData.message}</p>
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Close"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
