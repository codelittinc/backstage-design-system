"use client";

import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

export interface MultiSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  className?: string;
  loading?: boolean;
  onSearchChange?: (search: string) => void;
  onCreate?: (input: string) => void | Promise<void>;
  createLabel?: (input: string) => ReactNode;
  emptyMessage?: ReactNode;
}

export default function MultiSelect({
  value,
  onChange,
  options,
  placeholder = "Search...",
  disabled = false,
  error = false,
  id,
  className = "",
  loading = false,
  onSearchChange,
  onCreate,
  createLabel,
  emptyMessage = "No matches found",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // When onSearchChange is provided, parent owns filtering; we just show options.
  // Otherwise filter locally.
  const filteredOptions = onSearchChange
    ? options
    : search
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.toLowerCase()),
        )
      : options;

  const valueSet = new Set(value);
  const trimmedSearch = search.trim();
  const hasExactMatch = options.some(
    (o) => o.label.toLowerCase() === trimmedSearch.toLowerCase(),
  );
  const showCreateOption = !!onCreate && trimmedSearch.length > 0 && !hasExactMatch;

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
        onSearchChange?.("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onSearchChange]);

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
    setSearch("");
    setHighlightedIndex(-1);
    onSearchChange?.("");
  }, [onSearchChange]);

  const toggleValue = useCallback(
    (optionValue: string) => {
      const next = valueSet.has(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange(next);
      // Keep dropdown open so user can keep picking
      setSearch("");
      setHighlightedIndex(-1);
      onSearchChange?.("");
      inputRef.current?.focus();
    },
    [value, valueSet, onChange, onSearchChange],
  );

  const handleCreate = useCallback(async () => {
    if (!onCreate || !trimmedSearch) return;
    await onCreate(trimmedSearch);
    setSearch("");
    setHighlightedIndex(-1);
    onSearchChange?.("");
    inputRef.current?.focus();
  }, [onCreate, trimmedSearch, onSearchChange]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      setSearch(next);
      setIsOpen(true);
      setHighlightedIndex(-1);
      onSearchChange?.(next);
    },
    [onSearchChange],
  );

  // Total navigable rows = options + (create row if shown)
  const navigableCount = filteredOptions.length + (showCreateOption ? 1 : 0);

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
              prev < navigableCount - 1 ? prev + 1 : prev,
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
            if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
              toggleValue(filteredOptions[highlightedIndex].value);
            } else if (
              showCreateOption &&
              highlightedIndex === filteredOptions.length
            ) {
              handleCreate();
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
        case "Backspace":
          // If empty input, remove last selected value
          if (!search && value.length > 0) {
            e.preventDefault();
            onChange(value.slice(0, -1));
          }
          break;
      }
    },
    [
      disabled,
      isOpen,
      openDropdown,
      navigableCount,
      filteredOptions,
      highlightedIndex,
      showCreateOption,
      toggleValue,
      handleCreate,
      closeDropdown,
      search,
      value,
      onChange,
    ],
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
          value={search}
          onChange={handleInputChange}
          onFocus={openDropdown}
          onClick={openDropdown}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full cursor-text rounded-xl border bg-white pl-4 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 disabled:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200"
          }`}
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#0066cc] border-r-transparent" />
          ) : (
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
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
          )}
        </div>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          id={id ? `${id}-listbox` : undefined}
          role="listbox"
          aria-multiselectable="true"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-b-xl border border-slate-200 bg-white py-1 shadow-lg"
        >
          {filteredOptions.length === 0 && !showCreateOption ? (
            <li className="px-4 py-3 text-center text-sm text-slate-400">
              {loading ? "Loading..." : emptyMessage}
            </li>
          ) : (
            <>
              {filteredOptions.map((option, index) => {
                const isSelected = valueSet.has(option.value);
                const isHighlighted = highlightedIndex === index;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      if (option.disabled) return;
                      toggleValue(option.value);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-sm ${
                      isHighlighted ? "bg-[#0066cc]/5" : ""
                    } ${
                      option.disabled
                        ? "cursor-not-allowed text-slate-400"
                        : isSelected
                          ? "font-medium text-[#0066cc]"
                          : "text-slate-700"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <span className="block truncate">{option.label}</span>
                      {option.sublabel && (
                        <span className="mt-0.5 block truncate text-xs text-slate-400">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                    {isSelected && (
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
                );
              })}
              {showCreateOption && (
                <li
                  role="option"
                  aria-selected={false}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCreate();
                  }}
                  onMouseEnter={() =>
                    setHighlightedIndex(filteredOptions.length)
                  }
                  className={`flex cursor-pointer items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm text-[#0066cc] ${
                    highlightedIndex === filteredOptions.length
                      ? "bg-[#0066cc]/5"
                      : ""
                  }`}
                >
                  <span className="font-medium">
                    {createLabel
                      ? createLabel(trimmedSearch)
                      : `+ Create "${trimmedSearch}"`}
                  </span>
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
