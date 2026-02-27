"use client";

import { ReactNode } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface LineChartLine {
  /** The data key to read values from */
  dataKey: string;
  /** Line stroke color */
  color: string;
  /** Line stroke width. Defaults to 2. */
  strokeWidth?: number;
  /** Curve type. Defaults to "monotone". */
  type?: "monotone" | "linear" | "basis" | "step";
  /** Dot radius. Defaults to 4. */
  dotRadius?: number;
  /** Active dot radius. Defaults to 6. */
  activeDotRadius?: number;
}

export interface LineChartProps {
  /** Array of data objects. Each object should have a category key and numeric value keys matching line dataKeys. Extra fields are passed through to tooltips. */
  data: Record<string, unknown>[];
  /** Line configuration for each line in the chart */
  lines: LineChartLine[];
  /** The data key used for the X-axis category. Defaults to "name". */
  categoryKey?: string;
  /** Chart height in pixels. Defaults to 400. */
  height?: number;
  /** Show the cartesian grid. Defaults to true. */
  showGrid?: boolean;
  /** Show the legend. Defaults to true. */
  showLegend?: boolean;
  /** Label for the Y-axis. */
  yAxisLabel?: string;
  /** Whether to allow decimals on the Y-axis. Defaults to true. */
  yAxisAllowDecimals?: boolean;
  /** Whether to show tick lines on axes. Defaults to true. */
  showTickLines?: boolean;
  /** X-axis tick angle in degrees (e.g., -45 for angled labels). */
  xAxisAngle?: number;
  /** X-axis text anchor when angle is set. Defaults to "end". */
  xAxisTextAnchor?: "start" | "middle" | "end" | "inherit";
  /** X-axis tick interval. Defaults to "preserveEnd". */
  xAxisInterval?: number | "preserveEnd" | "preserveStart" | "preserveStartEnd" | "equidistantPreserveStart";
  /** Grid stroke color. */
  gridStrokeColor?: string;
  /** Custom tooltip formatter: receives (value, name) and returns [formattedValue, formattedName]. */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Custom tooltip content renderer. When provided, replaces the default tooltip entirely. */
  tooltipContent?: (props: {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any[];
    label?: string;
  }) => ReactNode | null;
  /** Additional CSS class name for the wrapper div. */
  className?: string;
}

export default function LineChart({
  data,
  lines,
  categoryKey = "name",
  height = 400,
  showGrid = true,
  showLegend = true,
  yAxisLabel,
  yAxisAllowDecimals = true,
  showTickLines = true,
  xAxisAngle,
  xAxisTextAnchor = "end",
  xAxisInterval,
  gridStrokeColor,
  tooltipFormatter,
  tooltipContent,
  className = "",
}: LineChartProps) {
  const hasAngle = xAxisAngle !== undefined;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            bottom: hasAngle ? 20 : 20,
            left: 10,
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={gridStrokeColor}
            />
          )}

          <XAxis
            dataKey={categoryKey}
            tick={{ fontSize: hasAngle ? 10 : 13, fill: "#64748b" }}
            tickMargin={10}
            tickLine={showTickLines ? undefined : false}
            interval={xAxisInterval}
            angle={xAxisAngle}
            textAnchor={hasAngle ? xAxisTextAnchor : undefined}
          />

          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            tickMargin={8}
            tickLine={showTickLines ? undefined : false}
            allowDecimals={yAxisAllowDecimals}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    offset: -5,
                    style: { fontSize: 12 },
                  }
                : undefined
            }
          />

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Tooltip
            formatter={tooltipFormatter as any}
            content={tooltipContent as any}
            contentStyle={
              !tooltipContent
                ? { borderRadius: 8, border: "1px solid #e2e8f0" }
                : undefined
            }
          />

          {showLegend && <Legend />}

          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type={line.type || "monotone"}
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={line.strokeWidth ?? 2}
              dot={{ fill: line.color, r: line.dotRadius ?? 4 }}
              activeDot={{ r: line.activeDotRadius ?? 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
