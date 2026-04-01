"use client";

import {
  InputHTMLAttributes,
  ChangeEvent,
  forwardRef,
  useState,
  useRef,
  useCallback,
} from "react";

export interface FormDateInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

/**
 * Converts YYYY-MM-DD to MM/DD/YYYY for display.
 */
function toDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${m}/${d}/${y}`;
}

/**
 * Converts MM/DD/YYYY to YYYY-MM-DD.
 */
function toISO(display: string): string {
  const match = display.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return "";
  return `${match[3]}-${match[1]}-${match[2]}`;
}

/**
 * Auto-inserts slashes as the user types digits.
 */
function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0, 2) + "/" + digits.slice(2);
  return (
    digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 8)
  );
}

/**
 * Date input that always displays in US format (MM/DD/YYYY) regardless of
 * the user's locale. Accepts and emits values in YYYY-MM-DD format, keeping
 * the same API contract as a native `<input type="date">`.
 */
const FormDateInput = forwardRef<HTMLInputElement, FormDateInputProps>(
  ({ className = "", error, value, onChange, disabled, id, ...props }, ref) => {
    const hiddenRef = useRef<HTMLInputElement>(null);
    const [displayValue, setDisplayValue] = useState(() =>
      toDisplay(String(value ?? ""))
    );

    // Keep display in sync when value prop changes externally
    const prevValueRef = useRef(value);
    if (value !== prevValueRef.current) {
      prevValueRef.current = value;
      const newDisplay = toDisplay(String(value ?? ""));
      if (newDisplay !== displayValue) {
        setDisplayValue(newDisplay);
      }
    }

    const emitChange = useCallback(
      (isoValue: string) => {
        if (!onChange || !hiddenRef.current) return;
        hiddenRef.current.value = isoValue;
        onChange({
          target: hiddenRef.current,
          currentTarget: hiddenRef.current,
        } as ChangeEvent<HTMLInputElement>);
      },
      [onChange]
    );

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
      const masked = applyMask(e.target.value);
      setDisplayValue(masked);

      const iso = toISO(masked);
      if (iso) {
        const d = new Date(iso + "T00:00:00");
        if (!isNaN(d.getTime())) {
          emitChange(iso);
        }
      } else if (masked === "") {
        emitChange("");
      }
    };

    const handleCalendarChange = (e: ChangeEvent<HTMLInputElement>) => {
      const iso = e.target.value;
      setDisplayValue(toDisplay(iso));
      emitChange(iso);
    };

    const baseClasses =
      "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400";
    const errorClasses = error
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
      : "";

    return (
      <div className="relative">
        {/* Hidden input that holds the YYYY-MM-DD value for synthetic events */}
        <input
          ref={hiddenRef}
          type="hidden"
          name={id}
          value={String(value ?? "")}
        />

        {/* Visible text input — always shows MM/DD/YYYY */}
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="MM/DD/YYYY"
          value={displayValue}
          onChange={handleTextChange}
          maxLength={10}
          disabled={disabled}
          id={id}
          className={`${baseClasses} ${errorClasses} ${className} pr-10`}
          {...props}
        />

        {/* Invisible native date picker triggered by clicking the calendar area */}
        <input
          type="date"
          value={String(value ?? "")}
          onChange={handleCalendarChange}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 cursor-pointer"
        />
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75"
          />
        </svg>
      </div>
    );
  }
);

FormDateInput.displayName = "FormDateInput";

export default FormDateInput;
