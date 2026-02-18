export interface StatusIndicatorProps {
  status:
    | "currently_working"
    | "completed_hiring"
    | "started_hiring"
    | "worked_with_us"
    | "blocked"
    | "incomplete_profile";
  showLabel?: boolean;
  size?: "sm" | "md";
}

const statusConfig = {
  currently_working: {
    bgClass: "bg-[#f97316]",
    label: "Currently working",
  },
  completed_hiring: {
    bgClass: "bg-[#10b981]",
    label: "Completed hiring process",
  },
  started_hiring: {
    bgClass: "bg-[#3b82f6]",
    label: "Started hiring process",
  },
  worked_with_us: {
    bgClass: "bg-[#a855f7]",
    label: "Already worked with us",
  },
  blocked: {
    bgClass: "bg-[#ef4444]",
    label: "Blocked from future work",
  },
  incomplete_profile: {
    bgClass: "bg-[#eab308]",
    label: "Incomplete profile",
  },
};

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
};

export default function StatusIndicator({
  status,
  showLabel = false,
  size = "md",
}: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} rounded-full ${config.bgClass}`}
        title={config.label}
      />
      {showLabel && <span className="text-sm text-slate-700">{config.label}</span>}
    </div>
  );
}

export function StatusLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
      {Object.entries(statusConfig).map(([key, config]) => (
        <div key={key} className="flex items-center gap-2">
          <div
            className={`h-4 w-4 rounded-full ${config.bgClass}`}
          />
          <span>{config.label}</span>
        </div>
      ))}
    </div>
  );
}
