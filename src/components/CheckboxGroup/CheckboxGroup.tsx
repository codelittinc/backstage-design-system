"use client";

export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: CheckboxGroupOption[];
  name?: string;
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  className?: string;
}

export default function CheckboxGroup({
  value,
  onChange,
  options,
  name,
  orientation = "horizontal",
  disabled = false,
  className = "",
}: CheckboxGroupProps) {
  const toggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      if (value.includes(optionValue)) return;
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

  const layoutClass =
    orientation === "vertical"
      ? "flex flex-col gap-2"
      : "flex flex-wrap items-center gap-4";

  return (
    <div role="group" className={`${layoutClass} ${className}`}>
      {options.map((option) => {
        const isChecked = value.includes(option.value);
        const isDisabled = disabled || option.disabled;
        return (
          <label
            key={option.value}
            className={`inline-flex items-center gap-2 text-sm font-medium text-slate-700 ${
              isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={isChecked}
              disabled={isDisabled}
              onChange={(e) => toggle(option.value, e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0066cc] focus:ring-[#0066cc] disabled:cursor-not-allowed"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
