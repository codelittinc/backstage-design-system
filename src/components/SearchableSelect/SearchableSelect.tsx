'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface SearchableSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchableSelectProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  options: SearchableSelectOption[];
  onSelect: (option: SearchableSelectOption) => void;
  onClear: () => void;
  selectedOption: SearchableSelectOption | null;
  loading?: boolean;
  placeholder?: string;
  error?: string | null;
  minChars?: number;
}

export default function SearchableSelect({
  searchValue,
  onSearchChange,
  options,
  onSelect,
  onClear,
  selectedOption,
  loading = false,
  placeholder = 'Search...',
  error = null,
  minChars = 2,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (option: SearchableSelectOption) => {
      onSelect(option);
      setIsOpen(false);
      setHighlightedIndex(-1);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'ArrowDown') {
          setIsOpen(true);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            handleSelect(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [isOpen, options, highlightedIndex, handleSelect]
  );

  const handleClear = () => {
    onClear();
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const showDropdown =
    isOpen &&
    (loading ||
      error ||
      options.length > 0 ||
      (searchValue.length > 0 && searchValue.length < minChars) ||
      (searchValue.length >= minChars && !loading && options.length === 0));

  if (selectedOption) {
    return (
      <div className="flex w-full items-center justify-between rounded-xl border border-[#0066cc]/30 bg-[#0066cc]/5 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <svg
            className="h-4 w-4 flex-shrink-0 text-[#0066cc]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.06a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
            />
          </svg>
          <div className="min-w-0">
            <span className="block truncate text-sm font-medium text-slate-900">
              {selectedOption.label}
            </span>
            {selectedOption.sublabel && (
              <span className="block truncate text-xs text-slate-500">
                {selectedOption.sublabel}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="ml-2 flex-shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-200/50 hover:text-slate-600"
          aria-label="Clear selection"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-controls="searchable-select-listbox"
          value={searchValue}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setHighlightedIndex(-1);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchValue.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#0066cc] border-r-transparent" />
          ) : (
            <svg
              className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
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

      {showDropdown && (
        <ul
          id="searchable-select-listbox"
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {searchValue.length > 0 && searchValue.length < minChars && (
            <li className="px-4 py-4 text-center text-sm text-slate-400">
              Type at least {minChars} characters to search...
            </li>
          )}

          {loading && (
            <li className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-slate-400">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-[#0066cc] border-r-transparent" />
              Searching...
            </li>
          )}

          {error && !loading && (
            <li className="px-4 py-6 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-50">
                <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-sm text-slate-600">{error}</p>
            </li>
          )}

          {!loading &&
            !error &&
            searchValue.length >= minChars &&
            options.length === 0 && (
              <li className="px-4 py-6 text-center">
                <p className="text-sm text-slate-500">
                  No results found for &ldquo;{searchValue}&rdquo;
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try a different search term.
                </p>
              </li>
            )}

          {!loading &&
            !error &&
            options.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={highlightedIndex === index}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`cursor-pointer border-b border-slate-100 px-4 py-3 last:border-0 ${
                  highlightedIndex === index ? 'bg-[#0066cc]/5' : ''
                }`}
              >
                <span className="block text-sm font-medium text-slate-900">
                  {option.label}
                </span>
                {option.sublabel && (
                  <span className="mt-0.5 block text-xs text-slate-400">
                    {option.sublabel}
                  </span>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
