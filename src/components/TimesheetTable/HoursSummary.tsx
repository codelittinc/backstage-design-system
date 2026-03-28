interface HoursSummaryProps {
  loggedHours: number;
  expectedHours: number;
  ptoHours: number;
}

export default function HoursSummary({
  loggedHours,
  expectedHours,
  ptoHours,
}: HoursSummaryProps) {
  const hasExpected = expectedHours > 0;
  const percentage = hasExpected
    ? Math.min((loggedHours / expectedHours) * 100, 100)
    : 0;
  const remaining = Math.max(0, expectedHours - loggedHours);
  const isComplete = hasExpected && loggedHours >= expectedHours;
  const isOver = hasExpected && loggedHours > expectedHours;
  const overHours = Math.max(0, loggedHours - expectedHours);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-700">
          <span className="font-bold">{loggedHours}h</span> of{" "}
          <span className="font-bold">{expectedHours}h</span> expected
        </p>
        <div className="flex items-center gap-3">
          {ptoHours > 0 && (
            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">
              {ptoHours}h time off
            </span>
          )}
          {hasExpected &&
            (isComplete ? (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  isOver
                    ? "text-amber-700 bg-amber-50"
                    : "text-emerald-700 bg-emerald-50"
                }`}
              >
                {isOver ? `+${overHours}h over` : "Complete"}
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {remaining}h remaining
              </span>
            ))}
        </div>
      </div>
      {hasExpected && (
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOver
                ? "bg-amber-400"
                : isComplete
                  ? "bg-emerald-400"
                  : "bg-red-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
