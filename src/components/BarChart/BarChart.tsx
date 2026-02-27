"use client";

import { ReactNode } from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderInsideLabel(props: any) {
  const { x, y, width, height, value } = props as {
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
  };
  if (!value || width < 35) return null;
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {value % 1 === 0 ? value : value.toFixed(1)}
    </text>
  );
}

export interface BarChartSeries {
  /** The data key to read values from */
  dataKey: string;
  /** Bar fill color */
  color: string;
  /** Stack ID for stacked bars — bars sharing the same stackId will stack */
  stackId?: string;
  /** Border radius [topLeft, topRight, bottomRight, bottomLeft] */
  radius?: [number, number, number, number];
}

export interface BarChartProps {
  /** Array of data objects. Each object should have a category key and numeric value keys matching series dataKeys. Extra fields are passed through to tooltips. */
  data: Record<string, unknown>[];
  /** Series configuration for each bar */
  series: BarChartSeries[];
  /** The data key used for the category axis. Defaults to "name". */
  categoryKey?: string;
  /** Chart layout. "horizontal" renders vertical bars (default), "vertical" renders horizontal bars. */
  layout?: "horizontal" | "vertical";
  /** Chart height in pixels. Defaults to 300. */
  height?: number;
  /** Show the cartesian grid. Defaults to true. */
  showGrid?: boolean;
  /** Show the legend. Defaults to true. */
  showLegend?: boolean;
  /** Show value labels inside bars. Defaults to false. */
  showLabels?: boolean;
  /** Gap between bar groups. Defaults to 8. */
  barGap?: number;
  /** Label for the value axis (Y-axis for horizontal layout, X-axis for vertical layout). */
  valueAxisLabel?: string;
  /** Custom tooltip formatter: receives (value, name) and returns [formattedValue, formattedName]. */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Custom tooltip content renderer. When provided, replaces the default tooltip entirely. */
  tooltipContent?: (props: {
    active?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any[];
    label?: string;
  }) => ReactNode | null;
  /** Category axis width (for vertical/horizontal bar layout). Defaults to 140 for vertical layout. */
  categoryAxisWidth?: number;
  /** Additional CSS class name for the wrapper div. */
  className?: string;
}

export default function BarChart({
  data,
  series,
  categoryKey = "name",
  layout = "horizontal",
  height = 300,
  showGrid = true,
  showLegend = true,
  showLabels = false,
  barGap = 8,
  valueAxisLabel,
  tooltipFormatter,
  tooltipContent,
  categoryAxisWidth,
  className = "",
}: BarChartProps) {
  const isVerticalLayout = layout === "vertical";
  const defaultCategoryWidth = isVerticalLayout ? 140 : undefined;
  const catWidth = categoryAxisWidth ?? defaultCategoryWidth;

  const margin = isVerticalLayout
    ? { top: 20, right: 20, bottom: 40, left: 10 }
    : { top: 10, right: 20, bottom: 20, left: 10 };

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          layout={isVerticalLayout ? "vertical" : "horizontal"}
          barGap={barGap}
          stackOffset={series.some((s) => s.stackId) ? "none" : undefined}
          margin={margin}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={!isVerticalLayout ? false : undefined}
              horizontal={isVerticalLayout ? false : undefined}
            />
          )}

          {isVerticalLayout ? (
            <>
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={
                  valueAxisLabel
                    ? {
                        value: valueAxisLabel,
                        position: "insideBottom",
                        offset: -10,
                        style: { fontSize: 12 },
                      }
                    : undefined
                }
              />
              <YAxis
                type="category"
                dataKey={categoryKey}
                tick={{ fontSize: 12 }}
                width={catWidth}
                tickMargin={10}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={categoryKey}
                tick={{ fontSize: 13 }}
                tickMargin={10}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickMargin={8}
                label={
                  valueAxisLabel
                    ? {
                        value: valueAxisLabel,
                        angle: -90,
                        position: "insideLeft",
                        offset: -5,
                        style: { fontSize: 12 },
                      }
                    : undefined
                }
              />
            </>
          )}

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

          {showLegend &&
            (isVerticalLayout ? (
              <Legend wrapperStyle={{ paddingTop: 24 }} />
            ) : (
              <Legend />
            ))}

          {series.map((s) => (
            <Bar
              key={s.dataKey}
              dataKey={s.dataKey}
              fill={s.color}
              stackId={s.stackId}
              radius={s.radius || (s.stackId ? undefined : [4, 4, 0, 0])}
            >
              {showLabels && (
                <LabelList dataKey={s.dataKey} content={renderInsideLabel} />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
