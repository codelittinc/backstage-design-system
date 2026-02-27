import type { Meta, StoryObj } from "@storybook/react";
import LineChart from "./LineChart";

const meta = {
  title: "Charts/LineChart",
  component: LineChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const monthlyData = [
  { name: "Jan", Alice: 160, Bob: 152, Carol: 140 },
  { name: "Feb", Alice: 155, Bob: 148, Carol: 160 },
  { name: "Mar", Alice: 168, Bob: 160, Carol: 155 },
  { name: "Apr", Alice: 150, Bob: 170, Carol: 148 },
  { name: "May", Alice: 165, Bob: 158, Carol: 162 },
  { name: "Jun", Alice: 172, Bob: 164, Carol: 158 },
];

const multiLines = [
  { dataKey: "Alice", color: "#4caf50" },
  { dataKey: "Bob", color: "#2196f3" },
  { dataKey: "Carol", color: "#e91e63" },
];

export const Default: Story = {
  args: {
    data: monthlyData,
    lines: multiLines,
    yAxisLabel: "Hours",
    tooltipFormatter: (value, name) => [`${Number(value).toFixed(1)}h`, name],
  },
};

const singleLineData = [
  { name: "Jan 2025", count: 5 },
  { name: "Feb 2025", count: 7 },
  { name: "Mar 2025", count: 8 },
  { name: "Apr 2025", count: 6 },
  { name: "May 2025", count: 9 },
  { name: "Jun 2025", count: 11 },
];

export const SingleLine: Story = {
  args: {
    data: singleLineData,
    lines: [{ dataKey: "count", color: "#0066cc" }],
    height: 256,
    showLegend: false,
    yAxisAllowDecimals: false,
    xAxisAngle: -45,
    xAxisInterval: 0,
    showTickLines: false,
    gridStrokeColor: "#e2e8f0",
  },
};

export const WithoutGrid: Story = {
  args: {
    data: monthlyData,
    lines: multiLines,
    showGrid: false,
  },
};

export const WithoutLegend: Story = {
  args: {
    data: monthlyData,
    lines: multiLines,
    showLegend: false,
  },
};
