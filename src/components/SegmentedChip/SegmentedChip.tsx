"use client";

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";

export interface SegmentedChipSegment {
  color: string;
}

export interface SegmentedChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** At least 1 segment; each is rendered with an equal flex-1 width. */
  segments: SegmentedChipSegment[];
  label: ReactNode;
}

const SegmentedChip = forwardRef<HTMLButtonElement, SegmentedChipProps>(
  ({ segments, label, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        type="button"
        className={`relative flex h-6 w-full shrink-0 cursor-pointer items-center overflow-hidden rounded-md px-1.5 ring-1 ring-black/10 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0066cc] ${className}`}
      >
        <span aria-hidden="true" className="absolute inset-0 flex">
          {segments.map((segment, i) => (
            <span key={i} className="flex-1" style={{ backgroundColor: segment.color }} />
          ))}
        </span>
        <span
          className="relative z-10 truncate text-xs font-medium text-white"
          style={{ textShadow: "0 1px 2px rgb(0 0 0 / 0.45)" }}
        >
          {label}
        </span>
      </button>
    );
  }
);

SegmentedChip.displayName = "SegmentedChip";

export default SegmentedChip;
