"use client";

import { useRef } from "react";
import type { KeyboardEvent, ReactElement } from "react";

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  /** `null` selects nothing; the control never picks a default of its own. */
  value: string | null;
  onChange: (value: string) => void;
  /** Submits the selected value with a surrounding form, through a hidden input. */
  name?: string;
  id?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  error?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
};

const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREVIOUS_KEYS = ["ArrowLeft", "ArrowUp"];

export default function SegmentedControl({
  options,
  value,
  onChange,
  name,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-required": ariaRequired,
  error = false,
  disabled = false,
  size = "md",
  className = "",
}: SegmentedControlProps): ReactElement {
  const segmentRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Roving tabindex: Tab lands on the selected segment, or the first when nothing is selected.
  const selectedIndex = options.findIndex((option) => option.value === value);
  const tabbableIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const select = (optionValue: string) => {
    if (optionValue === value) return;
    onChange(optionValue);
  };

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    let step: number;
    if (NEXT_KEYS.includes(e.key)) {
      step = 1;
    } else if (PREVIOUS_KEYS.includes(e.key)) {
      step = -1;
    } else {
      return;
    }
    e.preventDefault();

    const nextIndex = (index + step + options.length) % options.length;
    select(options[nextIndex].value);
    segmentRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      id={id}
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      aria-required={ariaRequired}
      aria-invalid={error || undefined}
      aria-disabled={disabled || undefined}
      className={`inline-flex gap-1 rounded-xl border p-1 ${
        error ? "border-red-400" : "border-slate-200"
      } ${disabled ? "bg-slate-50" : "bg-white"} ${className}`}
    >
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <button
            key={option.value}
            ref={(el) => {
              segmentRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={index === tabbableIndex ? 0 : -1}
            disabled={disabled}
            onClick={() => select(option.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex-1 whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
              sizeClasses[size]
            } ${error ? "focus-visible:outline-red-500" : "focus-visible:outline-[#0066cc]"} ${
              isSelected
                ? "bg-[#0066cc] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:hover:bg-transparent"
            }`}
          >
            {option.label}
          </button>
        );
      })}
      {name && <input type="hidden" name={name} value={value ?? ""} disabled={disabled} />}
    </div>
  );
}
