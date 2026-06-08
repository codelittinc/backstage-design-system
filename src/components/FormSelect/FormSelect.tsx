"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export interface FormSelectOption {
  value: string;
  label: string;
}

export interface FormSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  options: FormSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  error?: boolean;
  id?: string;
  className?: string;
}

export default function FormSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  required = false,
  clearable = true,
  error = false,
  id,
  className = "",
}: FormSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const stringValue = String(value ?? "");
  const selectedOption = options.find((o) => o.value === stringValue) || null;

  const filteredOptions = filterText
    ? options.filter((o) =>
        o.label.toLowerCase().includes(filterText.toLowerCase())
      )
    : options;

  // When closed, the input shows the selected label; when open, it shows what
  // the user is actively typing (starts empty so all options are visible).
  const displayValue = isOpen ? filterText : selectedOption?.label ?? "";

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setFilterText("");
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(-1);
  }, [disabled]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setFilterText("");
    setHighlightedIndex(-1);
  }, []);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilterText(e.target.value);
      setIsOpen(true);
      setHighlightedIndex(-1);
    },
    []
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            openDropdown();
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          if (isOpen) {
            e.preventDefault();
            if (
              highlightedIndex >= 0 &&
              highlightedIndex < filteredOptions.length
            ) {
              handleSelect(filteredOptions[highlightedIndex].value);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          inputRef.current?.blur();
          break;
        case "Tab":
          closeDropdown();
          break;
      }
    },
    [
      disabled,
      isOpen,
      openDropdown,
      filteredOptions,
      highlightedIndex,
      handleSelect,
      closeDropdown,
    ]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onChange("");
      setFilterText("");
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.focus();
    },
    [onChange]
  );

  return (
    <div ref={containerRef} className={`relative ${className}`} id={id}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls={id ? `${id}-listbox` : undefined}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onClick={openDropdown}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={disabled}
          className={`w-full cursor-text rounded-xl border bg-white pl-4 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200"
          }`}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {selectedOption && clearable && !required && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onMouseDown={handleClear}
              className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Clear selection"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <svg
            className={`pointer-events-none h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {required && (
        <input
          type="text"
          required
          value={stringValue}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 h-0 w-0 opacity-0"
        />
      )}

      {isOpen && (
        <ul
          ref={listRef}
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-b-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-center text-sm text-slate-400">
              No matches found
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === stringValue}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm ${
                  highlightedIndex === index ? "bg-[#0066cc]/5" : ""
                } ${
                  option.value === stringValue
                    ? "font-medium text-[#0066cc]"
                    : "text-slate-700"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {option.value === stringValue && (
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-[#0066cc]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
