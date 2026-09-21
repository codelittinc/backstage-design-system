"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface CommandPaletteItem {
  /** Stable identity. Keys the row and decides what `onSelect` hands back. */
  id: string;
  label: string;
  sublabel?: string | null;
  /** Heading this row sits under. Rows with no group are drawn ungrouped, first. */
  group?: string;
  icon?: ReactNode;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The query. Owned by the caller so it can search a server with it. */
  value: string;
  onValueChange: (value: string) => void;
  /**
   * The rows to draw, in the order to draw them.
   *
   * The palette does NOT filter or re-order these. Narrowing is the caller's,
   * which is what lets the same component back a client-side list and a
   * server-side search without the two disagreeing about what matches.
   */
  items: CommandPaletteItem[];
  onSelect: (item: CommandPaletteItem) => void;
  /** Accessible name for the dialog and its input. */
  label: string;
  placeholder?: string;
  /** Draws "Searching…" instead of the empty message while a query is in flight. */
  loading?: boolean;
  emptyMessage?: ReactNode;
  /** Binds ⌘K / Ctrl+K on the window. Default true. */
  shortcut?: boolean;
}

/**
 * Whether something else already owns the screen.
 *
 * Consulted only before OPENING, which is what stops it from matching the
 * palette's own dialog once that is up. `Modal` renders `role="dialog"`, so a
 * ⌘K pressed behind an open modal is ignored rather than stacking a second
 * layer over one the reader cannot see past.
 */
function dialogIsOpen(): boolean {
  return document.querySelector('[role="dialog"]') !== null;
}

export default function CommandPalette({
  open,
  onOpenChange,
  value,
  onValueChange,
  items,
  onSelect,
  label,
  placeholder = "Search…",
  loading = false,
  emptyMessage,
  shortcut = true,
}: CommandPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  /** Who had focus when the palette opened, so closing can give it back. */
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const [highlighted, setHighlighted] = useState(0);
  /**
   * The rows the highlight was last reset against. See below.
   */
  const [lastItems, setLastItems] = useState(items);

  /*
   * Back to the top whenever the rows change, so Enter always takes the best
   * hit for what has been typed rather than whatever happened to sit at the old
   * index — which, with rows arriving from a server mid-query, is a different
   * record every time.
   *
   * Adjusted during render rather than in an effect: React re-runs this
   * component before touching the DOM, so the highlight is never painted
   * against the wrong list, and no cascading second render is scheduled.
   */
  if (items !== lastItems) {
    setLastItems(items);
    setHighlighted(0);
  }

  useEffect(() => {
    if (!shortcut) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "k" || !(e.metaKey || e.ctrlKey)) return;
      // Browsers bind ⌘K themselves (the location bar in Chrome), so this has
      // to be claimed rather than merely observed.
      e.preventDefault();
      if (open) {
        onOpenChange(false);
        return;
      }
      if (dialogIsOpen()) return;
      onOpenChange(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcut, open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    inputRef.current?.focus();

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
      // Focus would otherwise fall to <body>, where a host app's window-level
      // key handlers start reading the reader's next keystroke.
      restoreFocusTo.current?.focus();
    };
  }, [open]);

  /** The rows in the order drawn, with their headings resolved. */
  const groups = useMemo(() => {
    const out: { name: string | null; items: CommandPaletteItem[] }[] = [];
    for (const item of items) {
      const name = item.group ?? null;
      const last = out[out.length - 1];
      if (last && last.name === name) last.items.push(item);
      else out.push({ name, items: [item] });
    }
    return out;
  }, [items]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const choose = useCallback(
    (item: CommandPaletteItem) => {
      onSelect(item);
      onOpenChange(false);
    },
    [onSelect, onOpenChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        // No wrapping: on a short list, ArrowDown jumping back to the first row
        // reads as the list moving under you.
        setHighlighted((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter": {
        e.preventDefault();
        const item = items[highlighted];
        if (item) choose(item);
        break;
      }
      case "Escape":
        e.preventDefault();
        close();
        break;
    }
  };

  useEffect(() => {
    if (!open) return;
    listRef.current
      ?.querySelector('[data-highlighted="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  /*
   * `createPortal` needs a DOM node, which does not exist while rendering on
   * the server. There is no hydration mismatch to guard against beyond that:
   * opening the palette takes a keystroke or a click, so `open` is false on the
   * server and on the first client pass alike, and both render null.
   */
  if (!open || typeof document === "undefined") return null;

  let flatIndex = -1;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[15vh]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-slate-100">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
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
            aria-expanded
            aria-controls="command-palette-listbox"
            aria-autocomplete="list"
            aria-label={label}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent py-4 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <ul
          ref={listRef}
          id="command-palette-listbox"
          role="listbox"
          aria-label={label}
          className="max-h-80 overflow-y-auto py-2"
        >
          {items.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-slate-500">
              {loading ? "Searching…" : emptyMessage}
            </li>
          )}

          {groups.map((group) => (
            // `presentation`, so the heading and the wrapper drop out of the
            // accessibility tree and the listbox owns the `group` directly.
            <li key={group.name ?? "__ungrouped"} role="presentation">
              {group.name && (
                <p className="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.name}
                </p>
              )}
              <ul role="group" aria-label={group.name ?? undefined}>
                {group.items.map((item) => {
                  flatIndex += 1;
                  const index = flatIndex;
                  const isHighlighted = index === highlighted;

                  return (
                    <li
                      key={item.id}
                      role="option"
                      aria-selected={isHighlighted}
                      data-highlighted={isHighlighted}
                      onClick={() => choose(item)}
                      onMouseEnter={() => setHighlighted(index)}
                      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${
                        isHighlighted ? "bg-[#0066cc]/5" : ""
                      }`}
                    >
                      {item.icon && (
                        <span className="flex-shrink-0 text-slate-400">
                          {item.icon}
                        </span>
                      )}
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium text-slate-900">
                          {item.label}
                        </span>
                        {item.sublabel && (
                          <span className="truncate text-xs text-slate-500">
                            {item.sublabel}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
