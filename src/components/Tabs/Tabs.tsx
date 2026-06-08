"use client";

import { ReactNode, useRef } from "react";

export interface TabItem<T extends string = string> {
  key: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  value: T;
  onChange: (key: T) => void;
  className?: string;
  ariaLabel?: string;
}

export default function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  className = "",
  ariaLabel,
}: TabsProps<T>) {
  const buttonRefs = useRef<Map<T, HTMLButtonElement | null>>(new Map());

  const focusableTabs = tabs.filter((t) => !t.disabled);

  const handleKeyDown = (e: React.KeyboardEvent, currentKey: T) => {
    if (focusableTabs.length === 0) return;
    const currentIndex = focusableTabs.findIndex((t) => t.key === currentKey);

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % focusableTabs.length;
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nextIndex =
        (currentIndex - 1 + focusableTabs.length) % focusableTabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = focusableTabs.length - 1;
    } else {
      return;
    }

    const nextTab = focusableTabs[nextIndex];
    if (nextTab) {
      onChange(nextTab.key);
      buttonRefs.current.get(nextTab.key)?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50 p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.key;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              buttonRefs.current.set(tab.key, el);
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange(tab.key)}
            onKeyDown={(e) => handleKeyDown(e, tab.key)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
