import { useRef, useEffect } from "react";
import type { TimesheetContract, GridData, TimeOff } from "./types";
import { getDaysInMonth } from "./date-utils";

interface MonthlyCalendarGridProps {
  monthDate: Date;
  gridData: GridData;
  contracts: TimesheetContract[];
  timeOffs: TimeOff[];
  today: string;
  selectedDay: string | null;
  onDaySelect: (date: string) => void;
  onCellChange: (contractId: number, date: string, value: string) => void;
}

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function isTimeOffDay(dateStr: string, timeOffs: TimeOff[]): boolean {
  return timeOffs.some((to) => {
    const start = to.startsAt.split("T")[0];
    const end = to.endsAt.split("T")[0];
    // endsAt is exclusive (return date), so use strict < instead of <=
    return dateStr >= start && dateStr < end;
  });
}

function getContractsForDay(
  dateStr: string,
  contracts: TimesheetContract[]
): TimesheetContract[] {
  return contracts.filter((c) => {
    const start = c.startDate.split("T")[0];
    const end = c.endDate.split("T")[0];
    return dateStr >= start && dateStr <= end;
  });
}

export default function MonthlyCalendarGrid({
  monthDate,
  gridData,
  contracts,
  timeOffs,
  today,
  selectedDay,
  onDaySelect,
  onCellChange,
}: MonthlyCalendarGridProps) {
  const year = monthDate.getUTCFullYear();
  const month = monthDate.getUTCMonth();
  const daysInMonth = getDaysInMonth(monthDate);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedDay && inlineInputRef.current) {
      inlineInputRef.current.focus();
      inlineInputRef.current.select();
    }
  }, [selectedDay]);

  const firstDayOfMonth = new Date(Date.UTC(year, month, 1));
  let startDow = firstDayOfMonth.getUTCDay() - 1;
  if (startDow < 0) startDow = 6;

  const calendarCells: (string | null)[] = [];
  for (let i = 0; i < startDow; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push(dateStr);
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const getDayTotal = (dateStr: string): number => {
    return contracts.reduce((sum, c) => {
      const val = gridData[`${c.id}::${dateStr}`];
      return sum + (val || 0);
    }, 0);
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-px mb-px">
        {DAY_HEADERS.map((label, i) => (
          <div
            key={label}
            className={`text-center text-xs font-medium uppercase tracking-wider py-2 ${
              i >= 5 ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
        {calendarCells.map((dateStr, idx) => {
          if (!dateStr) {
            return (
              <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[72px]" />
            );
          }

          const dayNum = parseInt(dateStr.split("-")[2]);
          const dayOfWeek = new Date(dateStr + "T00:00:00.000Z").getUTCDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDay;
          const isPast = dateStr < today;
          const total = getDayTotal(dateStr);
          const hasTimeOff = isTimeOffDay(dateStr, timeOffs);
          const isMissingHours =
            !isWeekend && isPast && total === 0 && !hasTimeOff;
          const dayContracts = getContractsForDay(dateStr, contracts);
          const isSingleContract = dayContracts.length === 1;
          const showInlineInput = isSelected && isSingleContract;

          let bgClass = "bg-white";
          if (isMissingHours) bgClass = "bg-red-50";
          else if (isToday) bgClass = "bg-[#0066cc]/5";
          else if (isWeekend) bgClass = "bg-slate-50/50";

          if (showInlineInput) {
            const contract = dayContracts[0];
            const key = `${contract.id}::${dateStr}`;
            const value = gridData[key];

            return (
              <div
                key={dateStr}
                className={`min-h-[72px] p-2 text-left transition-all ${bgClass} ring-2 ring-inset ring-[#0066cc]`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-sm font-medium ${
                      isToday
                        ? "text-[#0066cc]"
                        : isWeekend
                          ? "text-slate-400"
                          : "text-slate-700"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {hasTimeOff && (
                    <span className="text-[10px] font-medium text-violet-600 bg-violet-50 px-1 py-0.5 rounded">
                      PTO
                    </span>
                  )}
                </div>
                <input
                  ref={inlineInputRef}
                  type="number"
                  step="0.25"
                  min="0"
                  max="24"
                  value={value ?? ""}
                  onChange={(e) =>
                    onCellChange(contract.id, dateStr, e.target.value)
                  }
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") onDaySelect(dateStr);
                  }}
                  className="mt-1 w-full text-center text-sm rounded-lg border border-slate-300 bg-white py-1 px-1 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-colors
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="\u2013"
                />
              </div>
            );
          }

          return (
            <button
              key={dateStr}
              onClick={() => onDaySelect(dateStr)}
              className={`min-h-[72px] p-2 text-left transition-all hover:bg-slate-100 ${bgClass} ${
                isSelected ? "ring-2 ring-inset ring-[#0066cc]" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`text-sm font-medium ${
                    isToday
                      ? "text-[#0066cc]"
                      : isWeekend
                        ? "text-slate-400"
                        : "text-slate-700"
                  }`}
                >
                  {dayNum}
                </span>
                {hasTimeOff && (
                  <span className="text-[10px] font-medium text-violet-600 bg-violet-50 px-1 py-0.5 rounded">
                    PTO
                  </span>
                )}
              </div>
              {total > 0 && (
                <div className="mt-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {total}h
                  </span>
                </div>
              )}
              {isMissingHours && (
                <div className="mt-1">
                  <span className="text-[10px] text-red-400">No hours</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
