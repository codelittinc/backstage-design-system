"use client";

import { ReactNode } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";

const DEFAULT_COLORS = [
  "#0066cc",
  "#4a90e2",
  "#00a676",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

export interface DonutChartDataItem {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface DonutChartProps {
  /** Array of data items with name and value fields. */
  data: DonutChartDataItem[];
  /** Array of colors to cycle through for segments. Falls back to a default palette. */
  colors?: string[];
  /** Map of item names to specific colors. Takes priority over the colors array. */
  colorMap?: Map<string, string>;
  /** Inner radius of the donut. Set to 0 for a full pie. Defaults to 60. */
  innerRadius?: number;
  /** Outer radius of the donut. Defaults to 90. */
  outerRadius?: number;
  /** Padding angle between segments in degrees. Defaults to 2. */
  paddingAngle?: number;
  /** Chart height in pixels. Defaults to 256. */
  height?: number;
  /** Show a center label (typically a total). Defaults to false. */
  showCenterLabel?: boolean;
  /** The value to display in the center. Only used when showCenterLabel is true. */
  centerLabelValue?: string | number;
  /** CSS class for the center label text. Defaults to a bold slate style. */
  centerLabelClassName?: string;
  /** Custom tooltip formatter: receives (value, name) and returns [formattedValue, formattedName]. */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Custom tooltip content renderer. When provided, replaces the default tooltip entirely. */
  tooltipContent?: (props: {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any[];
  }) => ReactNode | null;
  /** Additional CSS class name for the wrapper div. */
  className?: string;
}

export default function DonutChart({
  data,
  colors = DEFAULT_COLORS,
  colorMap,
  innerRadius = 60,
  outerRadius = 90,
  paddingAngle = 2,
  height = 256,
  showCenterLabel = false,
  centerLabelValue,
  centerLabelClassName = "text-2xl font-bold fill-slate-900",
  tooltipFormatter,
  tooltipContent,
  className = "",
}: DonutChartProps) {
  const getColor = (item: DonutChartDataItem, index: number): string => {
    if (colorMap?.has(item.name)) {
      return colorMap.get(item.name)!;
    }
    return colors[index % colors.length];
  };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
          >
            {data.map((item, index) => (
              <Cell key={`cell-${index}`} fill={getColor(item, index)} />
            ))}
            {showCenterLabel && centerLabelValue !== undefined && (
              <Label
                value={centerLabelValue}
                position="center"
                className={centerLabelClassName}
              />
            )}
          </Pie>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Tooltip
            formatter={tooltipFormatter as any}
            content={tooltipContent as any}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
