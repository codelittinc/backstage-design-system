import { useRef, useEffect } from "react";
import Card from "../Card";
import type { TimesheetContract, GridData } from "./types";
import { cellKey } from "./date-utils";

interface DayDetailPanelProps {
  selectedDay: string;
  contracts: TimesheetContract[];
  gridData: GridData;
  onCellChange: (contractId: number, date: string, value: string) => void;
  onClose: () => void;
}

export default function DayDetailPanel({
  selectedDay,
  contracts,
  gridData,
  onCellChange,
  onClose,
}: DayDetailPanelProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, contracts.length);
  }, [contracts.length]);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedDay]);

  const dateObj = new Date(selectedDay + "T00:00:00.000Z");
  const dateLabel = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
      if (idx > 0) {
        e.preventDefault();
        inputRefs.current[idx - 1]?.focus();
        inputRefs.current[idx - 1]?.select();
      }
    } else if (
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      (e.key === "Tab" && !e.shiftKey)
    ) {
      if (idx < contracts.length - 1) {
        e.preventDefault();
        inputRefs.current[idx + 1]?.focus();
        inputRefs.current[idx + 1]?.select();
      }
    }
  };

  const dayTotal = contracts.reduce((sum, c) => {
    const val = gridData[cellKey(c.id, selectedDay)];
    return sum + (val || 0);
  }, 0);

  return (
    <div ref={panelRef}>
      <Card padding="sm">
        <div className="flex items-center justify-between px-3 pt-2 pb-3">
          <h3 className="text-sm font-semibold text-slate-800">{dateLabel}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider py-2 px-3">
                Contract
              </th>
              <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-2 px-3 w-[100px]">
                Hours
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="py-6 text-center text-sm text-slate-500"
                >
                  No active contracts for this day.
                </td>
              </tr>
            )}
            {contracts.map((contract, idx) => {
              const key = cellKey(contract.id, selectedDay);
              const value = gridData[key];
              const contractStart = contract.startDate.split("T")[0];
              const contractEnd = contract.endDate.split("T")[0];
              const isOutsideContract =
                selectedDay < contractStart || selectedDay > contractEnd;

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
                  <td className="py-2 px-3">
                    <input
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="number"
                      step="0.25"
                      min="0"
                      max="24"
                      value={value ?? ""}
                      disabled={isOutsideContract}
                      onChange={(e) =>
                        onCellChange(contract.id, selectedDay, e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className={`w-full text-center text-sm rounded-lg border py-1.5 px-1 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/30 focus:border-[#0066cc] transition-colors
                        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                        ${
                          isOutsideContract
                            ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                            : value
                              ? "border-slate-300 bg-white text-slate-800"
                              : "border-slate-200 bg-white text-slate-400"
                        }`}
                      placeholder={isOutsideContract ? "" : "\u2013"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-200">
              <td className="py-2 px-3 text-xs font-medium text-slate-500 uppercase">
                Total
              </td>
              <td className="py-2 px-3 text-center">
                <span
                  className={`text-sm font-bold ${dayTotal > 0 ? "text-slate-800" : "text-slate-300"}`}
                >
                  {dayTotal > 0 ? `${dayTotal}h` : "\u2013"}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </div>
  );
}
