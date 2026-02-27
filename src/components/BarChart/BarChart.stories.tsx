import type { Meta, StoryObj } from "@storybook/react";
import BarChart from "./BarChart";

const meta = {
  title: "Charts/BarChart",
  component: BarChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { name: "Project Total", Worked: 120, Expected: 160, Overworked: 8, "Time Off": 16 },
];

const sampleSeries = [
  { dataKey: "Worked", color: "#4caf50" },
  { dataKey: "Expected", color: "#e91e63" },
  { dataKey: "Overworked", color: "#455a64" },
  { dataKey: "Time Off", color: "#2196f3" },
];

export const Default: Story = {
  args: {
    data: sampleData,
    series: sampleSeries,
    valueAxisLabel: "Hours",
    showLabels: true,
  },
};

const memberData = [
  { name: "Alice Smith", Worked: 38, "Time Off": 0, Remaining: 2, Overworked: 0 },
  { name: "Bob Jones", Worked: 42, "Time Off": 0, Remaining: 0, Overworked: 2 },
  { name: "Carol White", Worked: 32, "Time Off": 8, Remaining: 0, Overworked: 0 },
  { name: "Dave Brown", Worked: 40, "Time Off": 0, Remaining: 0, Overworked: 0 },
];

const stackedSeries = [
  { dataKey: "Worked", color: "#4caf50", stackId: "stack" },
  { dataKey: "Time Off", color: "#2196f3", stackId: "stack" },
  { dataKey: "Remaining", color: "#e91e63", stackId: "stack" },
  { dataKey: "Overworked", color: "#455a64", stackId: "stack", radius: [0, 4, 4, 0] as [number, number, number, number] },
];

export const HorizontalStacked: Story = {
  args: {
    data: memberData,
    series: stackedSeries,
    layout: "vertical",
    height: 320,
    valueAxisLabel: "Hours",
    showLabels: true,
    tooltipFormatter: (value, name) => [`${Number(value).toFixed(1)}h`, name],
  },
};

export const WithoutLegend: Story = {
  args: {
    data: sampleData,
    series: sampleSeries,
    showLegend: false,
    valueAxisLabel: "Hours",
  },
};

export const WithoutGrid: Story = {
  args: {
    data: sampleData,
    series: sampleSeries,
    showGrid: false,
  },
};
