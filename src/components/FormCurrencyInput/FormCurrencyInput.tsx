"use client";

import { useCallback, useRef } from "react";
import FormInput from "../FormInput";

export interface FormCurrencyInputProps {
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  allowNull?: boolean;
  error?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

function formatCurrencyDisplay(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) return "";
  return "$" + value.toLocaleString("en-US");
}

function parseCurrencyInput(raw: string): number | null {
  const stripped = raw.replace(/[^0-9.]/g, "");
  if (stripped === "") return null;
  const parsed = parseFloat(stripped);
  return isNaN(parsed) ? null : parsed;
}

function formatWithMask(raw: string): string {
  const stripped = raw.replace(/[^0-9.]/g, "");
  if (stripped === "") return "";

  const parts = stripped.split(".");
  const intPart = parts[0].replace(/^0+(?=\d)/, "");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (parts.length > 1) {
    return "$" + formatted + "." + parts[1];
  }
  return "$" + formatted;
}

export default function FormCurrencyInput({
  value,
  onChange,
  placeholder = "$0",
  min = 0,
  allowNull = false,
  error,
  disabled,
  id,
  className,
}: FormCurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const parsed = parseCurrencyInput(raw);

      if (parsed === null) {
        onChange(allowNull ? null : 0);
      } else if (parsed >= min) {
        onChange(parsed);
      }

      requestAnimationFrame(() => {
        if (!inputRef.current) return;
        const formatted = parsed !== null ? formatWithMask(raw) : "";
        const prevLen = inputRef.current.value.length;
        const cursorPos = inputRef.current.selectionStart ?? 0;
        inputRef.current.value = formatted;
        const diff = formatted.length - prevLen;
        const newPos = Math.max(0, cursorPos + diff);
        inputRef.current.setSelectionRange(newPos, newPos);
      });
    },
    [onChange, min, allowNull]
  );

  return (
    <FormInput
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={formatCurrencyDisplay(value)}
      onChange={handleChange}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      id={id}
      className={className}
    />
  );
}
