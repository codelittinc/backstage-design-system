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

  // Close on outside click
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

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll highlighted item into view
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
    setFilterText("");
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

  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDropdown();
      }
    },
    [disabled, openDropdown]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredOptions.length
          ) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
        case "Tab":
          closeDropdown();
          break;
      }
    },
    [filteredOptions, highlightedIndex, handleSelect, closeDropdown]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange("");
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  return (
    <div ref={containerRef} className={`relative ${className}`} id={id}>
      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : openDropdown())}
        onKeyDown={handleTriggerKeyDown}
        className={`flex w-full items-center justify-between rounded-xl border bg-white pl-4 pr-3 py-2.5 text-left text-slate-900 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
            : "border-slate-200"
        }`}
      >
        <span
          className={`block truncate ${!selectedOption ? "text-slate-400" : ""}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedOption && clearable && !required && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={handleClear}
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
            </span>
          )}
          <svg
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
      </button>

      {/* Hidden input for form validation */}
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

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-slate-200 bg-white shadow-lg">
          {/* Search input */}
          {options.length > 5 && (
            <div className="border-b border-slate-200 p-2">
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Search..."
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none focus:ring-1 focus:ring-[#0066cc]/20"
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-y-auto py-1"
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
                  onClick={() => handleSelect(option.value)}
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
        </div>
      )}
    </div>
  );
}
