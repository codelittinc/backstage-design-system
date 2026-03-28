import type { ViewMode } from "./types";

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
      {(["weekly", "monthly"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            viewMode === mode
              ? "bg-[#0066cc] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-800"
          }`}
        >
          {mode === "weekly" ? "Weekly" : "Monthly"}
        </button>
      ))}
    </div>
  );
}
