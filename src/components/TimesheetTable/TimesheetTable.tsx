"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Button from "../Button";
import Card from "../Card";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "../Toast";
import HoursSummary from "./HoursSummary";
import ViewToggle from "./ViewToggle";
import MonthlyCalendarGrid from "./MonthlyCalendarGrid";
import DayDetailPanel from "./DayDetailPanel";
import { createDefaultApi } from "./default-api";
import {
  parseUTCDate,
  toISODate,
  formatMonthYear,
  getMonday,
  addDays,
  formatShortDate,
  formatWeekRange,
  getFirstOfMonth,
  getLastOfMonth,
  cellKey,
  parseCellKey,
} from "./date-utils";
import type {
  TimesheetTableProps,
  TimesheetApi,
  TimesheetEntry,
  ViewMode,
  GridData,
  TimeOff,
} from "./types";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function TimesheetTable({
  userId,
  userFullName,
  contracts,
  api: apiOverrides,
  baseUrl = "",
  apiHeaders,
  defaultView = "weekly",
  onViewChange,
  onNavigate,
  initialWeek,
  initialMonth,
  title = "My Timesheets",
  className = "",
}: TimesheetTableProps) {
  const api = useMemo<TimesheetApi>(() => {
    const defaultApi = createDefaultApi(baseUrl, apiHeaders);
    return {
      fetchTimeEntries:
        apiOverrides?.fetchTimeEntries ?? defaultApi.fetchTimeEntries,
      fetchExpectedHours:
        apiOverrides?.fetchExpectedHours ?? defaultApi.fetchExpectedHours,
      saveTimesheet: apiOverrides?.saveTimesheet ?? defaultApi.saveTimesheet,
    };
  }, [apiOverrides, baseUrl, apiHeaders]);

  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [weekStart, setWeekStart] = useState<Date>(() => {
    if (initialWeek) {
      const parsed = parseUTCDate(initialWeek);
      if (!isNaN(parsed.getTime())) return getMonday(parsed);
    }
    return getMonday(new Date());
  });
  const [monthDate, setMonthDate] = useState<Date>(() => {
    if (initialMonth) {
      const parsed = parseUTCDate(initialMonth + "-01");
      if (!isNaN(parsed.getTime())) return getFirstOfMonth(parsed);
    }
    return getFirstOfMonth(new Date());
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [gridData, setGridData] = useState<GridData>({});
  const [originalData, setOriginalData] = useState<GridData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expectedHours, setExpectedHours] = useState<number | null>(null);
  const [ptoHours, setPtoHours] = useState<number>(0);
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>([]);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const weekDates = Array.from({ length: 7 }, (_, i) =>
    toISODate(addDays(weekStart, i))
  );
  const weekEnd = addDays(weekStart, 6);
  const today = toISODate(new Date());

  const rangeStart = viewMode === "weekly" ? weekStart : getFirstOfMonth(monthDate);
  const rangeEnd = viewMode === "weekly" ? weekEnd : getLastOfMonth(monthDate);

  const activeContracts = contracts.filter((c) => {
    if (!c.projectActive) return false;
    const contractStart = new Date(c.startDate);
    const contractEnd = new Date(c.endDate);
    return contractStart <= rangeEnd && contractEnd >= rangeStart;
  });

  const selectedDayContracts = selectedDay
    ? contracts.filter((c) => {
        if (!c.projectActive) return false;
        const contractStart = c.startDate.split("T")[0];
        const contractEnd = c.endDate.split("T")[0];
        return selectedDay >= contractStart && selectedDay <= contractEnd;
      })
    : [];

  const isDirty = JSON.stringify(gridData) !== JSON.stringify(originalData);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      let startDate: string;
      let endDate: string;

      if (viewMode === "weekly") {
        startDate = toISODate(weekStart);
        endDate = toISODate(addDays(weekStart, 6));
      } else {
        startDate = toISODate(getFirstOfMonth(monthDate));
        endDate = toISODate(getLastOfMonth(monthDate));
      }

      const [entriesRes, expectedRes] = await Promise.all([
        api.fetchTimeEntries({ userId, startDate, endDate }),
        api.fetchExpectedHours({ startDate, endDate }),
      ]);

      const newGrid: GridData = {};
      for (const entry of entriesRes.timeEntries) {
        const date = entry.date.split("T")[0];
        const key = cellKey(entry.contractId, date);
        newGrid[key] = entry.hours;
      }

      setGridData(newGrid);
      setOriginalData(newGrid);
      setExpectedHours(expectedRes.expectedHours);
      setPtoHours(expectedRes.ptoHours);
      setTimeOffs(expectedRes.timeOffs || []);
    } catch (error) {
      console.error("Error fetching time entries:", error);
      toast.error("Failed to load time entries");
    } finally {
      setLoading(false);
    }
  }, [viewMode, weekStart, monthDate, userId, api]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Notify parent of navigation changes
  useEffect(() => {
    if (!onNavigate) return;
    const params: Record<string, string> = {};
    if (viewMode === "monthly") {
      params.view = "monthly";
      const y = monthDate.getFullYear();
      const m = String(monthDate.getMonth() + 1).padStart(2, "0");
      params.month = `${y}-${m}`;
    } else {
      params.view = "weekly";
      params.week = toISODate(weekStart);
    }
    onNavigate(params);
  }, [viewMode, weekStart, monthDate, onNavigate]);

  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleCellChange = (
    contractId: number,
    date: string,
    value: string
  ) => {
    const key = cellKey(contractId, date);
    if (value === "" || value === null) {
      setGridData((prev) => ({ ...prev, [key]: null }));
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0 && num <= 24) {
        setGridData((prev) => ({ ...prev, [key]: num }));
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const changedEntries: TimesheetEntry[] = [];
      const allKeys = new Set([
        ...Object.keys(gridData),
        ...Object.keys(originalData),
      ]);

      for (const key of allKeys) {
        const currentVal = gridData[key] ?? null;
        const originalVal = originalData[key] ?? null;

        if (currentVal !== originalVal) {
          const { contractId, date } = parseCellKey(key);
          changedEntries.push({ contractId, date, hours: currentVal });
        }
      }

      if (changedEntries.length === 0) {
        toast.info("No changes to save");
        setSaving(false);
        return;
      }

      await api.saveTimesheet(changedEntries);
      setOriginalData({ ...gridData });
      toast.success("Timesheet saved successfully");
    } catch (error: unknown) {
      console.error("Error saving timesheet:", error);
      const message =
        error instanceof Error ? error.message : "Failed to save timesheet";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const getRowTotal = (contractId: number): number => {
    return weekDates.reduce((sum, date) => {
      const val = gridData[cellKey(contractId, date)];
      return sum + (val || 0);
    }, 0);
  };

  const getColumnTotal = (date: string): number => {
    return activeContracts.reduce((sum, contract) => {
      const val = gridData[cellKey(contract.id, date)];
      return sum + (val || 0);
    }, 0);
  };

  const getGrandTotal = (): number => {
    if (viewMode === "weekly") {
      return activeContracts.reduce(
        (sum, contract) => sum + getRowTotal(contract.id),
        0
      );
    }
    return Object.entries(gridData).reduce((sum, [key, val]) => {
      const { contractId } = parseCellKey(key);
      if (activeContracts.some((c) => c.id === contractId)) {
        return sum + (val || 0);
      }
      return sum;
    }, 0);
  };

  const goToPrevWeek = () => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    setWeekStart((prev) => addDays(prev, -7));
  };
  const goToNextWeek = () => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    setWeekStart((prev) => addDays(prev, 7));
  };
  const goToToday = () => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    setWeekStart(getMonday(new Date()));
  };

  const goToPrevMonth = () => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    setSelectedDay(null);
    setMonthDate(
      (prev) =>
        new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() - 1, 1))
    );
  };
  const goToNextMonth = () => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    setSelectedDay(null);
    setMonthDate(
      (prev) =>
        new Date(Date.UTC(prev.getUTCFullYear(), prev.getUTCMonth() + 1, 1))
    );
  };
  const goToCurrentMonth = () => {
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    setSelectedDay(null);
    setMonthDate(getFirstOfMonth(new Date()));
  };

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === viewMode) return;
    if (isDirty && !confirm("You have unsaved changes. Discard them?")) return;
    if (mode === "monthly") {
      setMonthDate(getFirstOfMonth(weekStart));
      setSelectedDay(null);
    } else {
      setWeekStart(getMonday(monthDate));
    }
    setViewMode(mode);
    onViewChange?.(mode);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    contractIdx: number,
    dayIdx: number
  ) => {
    let targetContract = contractIdx;
    let targetDay = dayIdx;

    if (e.key === "ArrowUp") {
      targetContract = Math.max(0, contractIdx - 1);
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      targetContract = Math.min(activeContracts.length - 1, contractIdx + 1);
      e.preventDefault();
    } else if (
      e.key === "ArrowLeft" &&
      e.currentTarget.selectionStart === 0
    ) {
      targetDay = Math.max(0, dayIdx - 1);
      e.preventDefault();
    } else if (
      e.key === "ArrowRight" &&
      e.currentTarget.selectionStart === e.currentTarget.value.length
    ) {
      targetDay = Math.min(6, dayIdx + 1);
      e.preventDefault();
    } else if (e.key === "Enter") {
      targetContract = Math.min(activeContracts.length - 1, contractIdx + 1);
      e.preventDefault();
    } else {
      return;
    }

    const targetKey = cellKey(
      activeContracts[targetContract].id,
      weekDates[targetDay]
    );
    inputRefs.current[targetKey]?.focus();
    inputRefs.current[targetKey]?.select();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{userFullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle viewMode={viewMode} onChange={handleViewModeChange} />
          {isDirty && (
            <span className="text-sm text-amber-600 font-medium">
              Unsaved changes
            </span>
          )}
          <Button onClick={handleSave} disabled={saving || !isDirty}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <Card padding="sm">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={viewMode === "weekly" ? goToPrevWeek : goToPrevMonth}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Prev
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={
                viewMode === "weekly" ? goToToday : goToCurrentMonth
              }
            >
              Today
            </Button>
            <span className="text-sm font-medium text-slate-700">
              {viewMode === "weekly"
                ? formatWeekRange(weekStart)
                : formatMonthYear(monthDate)}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={viewMode === "weekly" ? goToNextWeek : goToNextMonth}
          >
            Next
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>
      </Card>

      {/* Hours Summary */}
      {!loading && (
        <HoursSummary
          loggedHours={getGrandTotal()}
          expectedHours={expectedHours ?? 0}
          ptoHours={ptoHours}
        />
      )}

      {/* Timesheet Grid / Calendar */}
      {loading ? (
        <LoadingSpinner message="Loading timesheet..." />
      ) : viewMode === "weekly" ? (
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-3 min-w-[200px]">
                    Contract
                  </th>
                  {weekDates.map((date, i) => {
                    const isToday = date === today;
                    const dayDate = addDays(weekStart, i);
                    const isWeekend = i >= 5;
                    return (
                      <th
                        key={date}
                        className={`text-center text-xs font-medium uppercase tracking-wider py-3 px-2 w-[90px] ${
                          isToday
                            ? "text-[#0066cc] bg-[#0066cc]/5"
                            : isWeekend
                              ? "text-slate-400"
                              : "text-slate-500"
                        }`}
                      >
                        <div>{DAY_LABELS[i]}</div>
                        <div className="text-[10px] font-normal normal-case mt-0.5">
                          {formatShortDate(dayDate)}
                        </div>
                      </th>
                    );
                  })}
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-3 px-2 w-[70px]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeContracts.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-8 text-center text-sm text-slate-500"
                    >
                      No active contracts for this week.
                    </td>
                  </tr>
                )}
                {activeContracts.map((contract, contractIdx) => {
                  const rowTotal = getRowTotal(contract.id);
                  return (
                    <tr
                      key={contract.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50"
                    >
                      <td className="py-2 px-3">
                        <div className="text-sm font-medium text-slate-800 truncate">
                          {contract.projectName}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {contract.customerName} &middot; {contract.name}
                        </div>
                      </td>
                      {weekDates.map((date, dayIdx) => {
                        const key = cellKey(contract.id, date);
                        const value = gridData[key];
                        const isToday = date === today;
                        const isWeekend = dayIdx >= 5;
                        const contractStartDate =
                          contract.startDate.split("T")[0];
                        const contractEndDate = contract.endDate.split("T")[0];
                        const isOutsideContract =
                          date < contractStartDate || date > contractEndDate;
                        return (
                          <td
                            key={date}
                            className={`py-2 px-1 ${
                              isToday ? "bg-[#0066cc]/5" : ""
                            }`}
                          >
                            <input
                              ref={(el) => {
                                inputRefs.current[key] = el;
                              }}
                              type="number"
                              step="0.25"
                              min="0"
                              max="24"
                              value={value ?? ""}
                              disabled={isOutsideContract}
                              onChange={(e) =>
                                handleCellChange(
                                  contract.id,
                                  date,
                                  e.target.value
                                )
                              }
                              onFocus={(e) => e.target.select()}
                              onKeyDown={(e) =>
                                handleKeyDown(e, contractIdx, dayIdx)
                              }
                              className={`w-full text-center text-sm rounded-lg border py-1.5 px-1 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-colors
                                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                                ${
                                  isOutsideContract
                                    ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                                    : value
                                      ? "border-slate-300 bg-white text-slate-800"
                                      : isWeekend
                                        ? "border-slate-100 bg-slate-50/50 text-slate-400"
                                        : "border-slate-200 bg-white text-slate-400"
                                }`}
                              placeholder={isOutsideContract ? "" : "\u2013"}
                            />
                          </td>
                        );
                      })}
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`text-sm font-medium ${
                            rowTotal > 0 ? "text-slate-800" : "text-slate-300"
                          }`}
                        >
                          {rowTotal > 0 ? rowTotal : "\u2013"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200">
                  <td className="py-3 px-3 text-xs font-medium text-slate-500 uppercase">
                    Daily Total
                  </td>
                  {weekDates.map((date) => {
                    const colTotal = getColumnTotal(date);
                    const isToday = date === today;
                    const isOver = colTotal > 24;
                    return (
                      <td
                        key={date}
                        className={`py-3 px-2 text-center ${
                          isToday ? "bg-[#0066cc]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-sm font-semibold ${
                            isOver
                              ? "text-amber-600"
                              : colTotal > 0
                                ? "text-slate-700"
                                : "text-slate-300"
                          }`}
                          title={
                            isOver
                              ? "More than 24 hours in a day"
                              : undefined
                          }
                        >
                          {colTotal > 0 ? colTotal : "\u2013"}
                          {isOver && " !"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm font-bold text-slate-800">
                      {getGrandTotal() > 0 ? getGrandTotal() : "\u2013"}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      ) : (
        <>
          <MonthlyCalendarGrid
            monthDate={monthDate}
            gridData={gridData}
            contracts={activeContracts}
            timeOffs={timeOffs}
            today={today}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            onCellChange={handleCellChange}
          />
          {selectedDay && selectedDayContracts.length > 1 && (
            <DayDetailPanel
              selectedDay={selectedDay}
              contracts={selectedDayContracts}
              gridData={gridData}
              onCellChange={handleCellChange}
              onClose={() => setSelectedDay(null)}
            />
          )}
        </>
      )}

      {/* Time Offs */}
      {!loading && timeOffs.length > 0 && (
        <Card padding="sm">
          <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 pt-2 pb-3">
            Time Off This {viewMode === "weekly" ? "Week" : "Month"}
          </h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-2 px-3">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-2 px-3">
                  From
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-2 px-3">
                  To
                </th>
              </tr>
            </thead>
            <tbody>
              {timeOffs.map((to) => (
                <tr key={to.id} className="border-b border-slate-100">
                  <td className="py-2 px-3 text-sm text-slate-800">
                    {to.type}
                  </td>
                  <td className="py-2 px-3 text-sm text-slate-600">
                    {new Date(to.startsAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </td>
                  <td className="py-2 px-3 text-sm text-slate-600">
                    {new Date(to.endsAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
