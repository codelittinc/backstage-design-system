"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

export interface PopoverTriggerProps {
  ref: (el: HTMLElement | null) => void;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  "aria-haspopup": "dialog";
  "aria-expanded": boolean;
}

export interface PopoverProps {
  content: ReactNode;
  children: (api: {
    triggerProps: PopoverTriggerProps;
    open: boolean;
    pinned: boolean;
  }) => ReactNode;
  ariaLabel?: string;
  /** Extra classes appended to the panel. */
  className?: string;
  hoverOpenDelayMs?: number;
  hoverCloseDelayMs?: number;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface PopoverAnchor {
  top: number;
  bottom: number;
  left: number;
}

interface RegistryEntry {
  close: () => void;
  pinned: boolean;
}

// Module-scoped registry: at most one popover is open across the app.
// Opening any popover closes the current one; hover never opens a popover
// while another popover is pinned. SSR-safe (no window access here).
let activePopover: RegistryEntry | null = null;

function anchorOf(el: HTMLElement): PopoverAnchor {
  const rect = el.getBoundingClientRect();
  return { top: rect.top, bottom: rect.bottom, left: rect.left };
}

function popoverStyle(anchor: PopoverAnchor): CSSProperties {
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;
  const left = Math.max(8, Math.min(anchor.left, viewportWidth - 264));
  if (anchor.top < 300) {
    return { position: "fixed", top: anchor.bottom + 6, left };
  }
  return {
    position: "fixed",
    top: anchor.top - 6,
    left,
    transform: "translateY(-100%)",
  };
}

export default function Popover({
  content,
  children,
  ariaLabel,
  className = "",
  hoverOpenDelayMs = 150,
  hoverCloseDelayMs = 120,
  disabled = false,
  onOpenChange,
}: PopoverProps) {
  const [state, setState] = useState<{
    anchor: PopoverAnchor;
    pinned: boolean;
  } | null>(null);

  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entryRef = useRef<RegistryEntry>({ close: () => {}, pinned: false });

  const open = state !== null;
  const pinned = state?.pinned ?? false;

  const clearTimers = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  // Keep the registry entry's close callback current.
  useEffect(() => {
    entryRef.current.close = () => {
      clearTimers();
      setState(null);
    };
  }, [clearTimers]);

  // Register/unregister with the module-scoped single-open registry.
  useEffect(() => {
    const entry = entryRef.current;
    entry.pinned = pinned;
    if (open) {
      if (activePopover && activePopover !== entry) activePopover.close();
      activePopover = entry;
    } else if (activePopover === entry) {
      activePopover = null;
    }
  }, [open, pinned]);

  // Notify open/close transitions.
  const prevOpen = useRef(false);
  useEffect(() => {
    if (prevOpen.current === open) return;
    prevOpen.current = open;
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // Escape closes and returns focus to the trigger; outside mousedown closes.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = triggerRef.current;
      clearTimers();
      setState(null);
      if (trigger?.isConnected) trigger.focus();
    };
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.isConnected && triggerRef.current.contains(target)) {
        return;
      }
      clearTimers();
      setState(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [open, clearTimers]);

  // Clean up timers and the registry slot on unmount.
  useEffect(() => {
    const entry = entryRef.current;
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (activePopover === entry) activePopover = null;
    };
  }, []);

  const handleClick = () => {
    if (disabled) return;
    clearTimers();
    if (state?.pinned) {
      setState(null);
      return;
    }
    const el = triggerRef.current;
    if (!el) return;
    setState({ anchor: anchorOf(el), pinned: true });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    // Never hover-open while any popover (this or another) is pinned.
    if (state?.pinned || activePopover?.pinned) return;
    clearTimers();
    const el = triggerRef.current;
    if (!el) return;
    const anchor = anchorOf(el);
    openTimer.current = setTimeout(() => {
      openTimer.current = null;
      if (activePopover?.pinned && activePopover !== entryRef.current) return;
      setState((current) => (current?.pinned ? current : { anchor, pinned: false }));
    }, hoverOpenDelayMs);
  };

  const scheduleHoverClose = () => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (!state || state.pinned) return;
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setState((current) => (current && !current.pinned ? null : current));
    }, hoverCloseDelayMs);
  };

  const cancelHoverClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const triggerProps: PopoverTriggerProps = {
    ref: (el) => {
      triggerRef.current = el;
    },
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: scheduleHoverClose,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
  };

  return (
    <>
      {children({ triggerProps, open, pinned })}
      {state &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label={ariaLabel}
            style={popoverStyle(state.anchor)}
            onMouseEnter={cancelHoverClose}
            onMouseLeave={scheduleHoverClose}
            className={`z-50 w-64 rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-left ${className}`}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
