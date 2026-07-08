"use client";

import { Fragment, ReactNode, useMemo } from "react";
import LoadingSpinner from "../LoadingSpinner";
import Popover from "../Popover";

export interface MonthCalendarProps<T> {
  /** Displayed month as "YYYY-MM" (controlled). */
  month: string;
  onMonthChange: (month: string) => void;
  /** Items keyed by "YYYY-MM-DD"; items are assumed pre-sorted. */
  itemsByDate: ReadonlyMap<string, T[]>;
  renderItem: (item: T, isoDate: string) => ReactNode;
  itemKey: (item: T, isoDate: string) => string | number;
  /** Items shown per cell before collapsing into "+N more" (default 3). */
  maxVisibleItems?: number;
  /** Shows a translucent overlay + spinner over the grid and disables nav. */
  loading?: boolean;
  overflowPopoverTitle?: (isoDate: string, count: number) => ReactNode;
  overflowAriaLabel?: (isoDate: string, count: number) => string;
  ariaLabel?: string;
  className?: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseUTCDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function toISODate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftMonth(month: string, delta: number): string {
  const start = parseUTCDate(`${month}-01`);
  const shifted = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + delta, 1));
  return toISODate(shifted).slice(0, 7);
}

function monthTitleOf(month: string): string {
  return parseUTCDate(`${month}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const fmtShortWeekday = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const fmtLongDay = (d: Date) =>
  d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

export default function MonthCalendar<T>({
  month,
  onMonthChange,
  itemsByDate,
  renderItem,
  itemKey,
  maxVisibleItems = 3,
  loading = false,
  overflowPopoverTitle,
  overflowAriaLabel,
  ariaLabel,
  className = "",
}: MonthCalendarProps<T>) {
  const currentMonth = toISODate(new Date()).slice(0, 7);
  const todayIso = toISODate(new Date());
  const monthTitle = monthTitleOf(month);
  const isCurrentMonth = month === currentMonth;

  const cells = useMemo(() => {
    const monthStart = parseUTCDate(`${month}-01`);
    const year = monthStart.getUTCFullYear();
    const monthIndex = monthStart.getUTCMonth();
    const firstDow = monthStart.getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const total = Math.ceil((firstDow + daysInMonth) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const date = new Date(Date.UTC(year, monthIndex, 1 - firstDow + i));
      const dow = date.getUTCDay();
      return {
        date,
        iso: toISODate(date),
        inMonth: date.getUTCMonth() === monthIndex,
        isWeekend: dow === 0 || dow === 6,
      };
    });
  }, [month]);

  const defaultOverflowTitle = (isoDate: string, count: number): ReactNode =>
    `${fmtShortWeekday(parseUTCDate(isoDate))} — ${count} ${count === 1 ? "item" : "items"}`;

  const defaultOverflowAriaLabel = (isoDate: string, count: number): string =>
    `Show ${count} more items on ${fmtLongDay(parseUTCDate(isoDate))}`;

  const titleOf = overflowPopoverTitle ?? defaultOverflowTitle;
  const ariaLabelOf = overflowAriaLabel ?? defaultOverflowAriaLabel;

  const navButtonClass =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className={className}>
      {/* Calendar header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
        <h2 className="text-lg font-semibold text-slate-900" aria-live="polite">
          {monthTitle}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isCurrentMonth || loading}
            onClick={() => onMonthChange(currentMonth)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous month"
            disabled={loading}
            onClick={() => onMonthChange(shiftMonth(month, -1))}
            className={navButtonClass}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 3L5.5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next month"
            disabled={loading}
            onClick={() => onMonthChange(shiftMonth(month, 1))}
            className={navButtonClass}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 3L10.5 8L6 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200" />

      <div className="relative pt-4">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60">
            <LoadingSpinner size="sm" />
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Weekday header */}
            <div className="grid grid-cols-7">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="py-2 text-center text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Month grid: cells are grouped into role="row" weeks so the
                ARIA grid structure is valid (grid > row > gridcell). */}
            <div
              role="grid"
              aria-label={ariaLabel ?? `Calendar, ${monthTitle}`}
              className="overflow-hidden rounded-lg border border-slate-200 divide-y divide-slate-200"
            >
              {Array.from({ length: cells.length / 7 }, (_, weekIndex) => (
                <div
                  key={weekIndex}
                  role="row"
                  className="grid grid-cols-7 divide-x divide-slate-200"
                >
                  {cells.slice(weekIndex * 7, weekIndex * 7 + 7).map((cell) => {
                    const items = cell.inMonth ? itemsByDate.get(cell.iso) || [] : [];
                    const visibleItems = items.slice(0, maxVisibleItems);
                    const overflowCount = items.length - visibleItems.length;
                    const isToday = cell.inMonth && cell.iso === todayIso;
                    const cellBg = !cell.inMonth
                      ? "bg-slate-50/60"
                      : cell.isWeekend
                        ? "bg-slate-50"
                        : "bg-white";

                    return (
                      <div
                        key={cell.iso}
                        role="gridcell"
                        aria-label={cell.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        })}
                        aria-current={isToday ? "date" : undefined}
                        className={`flex min-h-[96px] flex-col gap-1 p-1.5 lg:min-h-[112px] ${cellBg}`}
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                            isToday
                              ? "bg-[#0066cc] font-semibold text-white"
                              : cell.inMonth
                                ? "font-medium text-slate-600"
                                : "font-medium text-slate-300"
                          }`}
                        >
                          {cell.date.getUTCDate()}
                        </span>

                        {visibleItems.map((item) => (
                          <Fragment key={itemKey(item, cell.iso)}>
                            {renderItem(item, cell.iso)}
                          </Fragment>
                        ))}

                        {overflowCount > 0 && (
                          <Popover
                            ariaLabel={`Items on ${fmtLongDay(cell.date)}`}
                            className="max-h-64 space-y-1 overflow-y-auto p-2 w-64"
                            content={
                              <>
                                <div className="pb-1 text-xs font-semibold text-slate-700">
                                  {titleOf(cell.iso, items.length)}
                                </div>
                                {items.map((item) => (
                                  <Fragment key={itemKey(item, cell.iso)}>
                                    {renderItem(item, cell.iso)}
                                  </Fragment>
                                ))}
                              </>
                            }
                          >
                            {({ triggerProps, open }) => (
                              <button
                                type="button"
                                ref={triggerProps.ref}
                                onClick={triggerProps.onClick}
                                aria-haspopup="dialog"
                                aria-expanded={open}
                                aria-label={ariaLabelOf(cell.iso, overflowCount)}
                                className="h-6 w-full rounded-md px-1.5 text-left text-xs font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
                              >
                                +{overflowCount} more
                              </button>
                            )}
                          </Popover>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
