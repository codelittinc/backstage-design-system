import type { Meta, StoryObj } from "@storybook/react";
import DonutChart from "./DonutChart";

const meta = {
  title: "Charts/DonutChart",
  component: DonutChart,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const customerData = [
  { name: "Acme Corp", value: 5 },
  { name: "Globex Inc", value: 3 },
  { name: "Initech", value: 2 },
  { name: "Umbrella Co", value: 4 },
  { name: "Stark Industries", value: 1 },
];

export const Default: Story = {
  args: {
    data: customerData,
    showCenterLabel: true,
    centerLabelValue: customerData.reduce((sum, d) => sum + d.value, 0),
    tooltipFormatter: (value) => [
      `${value} contract${value !== 1 ? "s" : ""}`,
      "Active",
    ],
  },
};

export const CustomColors: Story = {
  args: {
    data: customerData,
    colors: ["#4caf50", "#2196f3", "#e91e63", "#ff9800", "#9c27b0"],
    showCenterLabel: true,
    centerLabelValue: customerData.reduce((sum, d) => sum + d.value, 0),
  },
};

export const FullPie: Story = {
  args: {
    data: customerData,
    innerRadius: 0,
    outerRadius: 100,
    showCenterLabel: false,
  },
};

export const WithColorMap: Story = {
  args: {
    data: customerData,
    colorMap: new Map([
      ["Acme Corp", "#0066cc"],
      ["Globex Inc", "#00a676"],
      ["Initech", "#f59e0b"],
      ["Umbrella Co", "#ef4444"],
      ["Stark Industries", "#8b5cf6"],
    ]),
    showCenterLabel: true,
    centerLabelValue: customerData.reduce((sum, d) => sum + d.value, 0),
  },
};

export const NoCenterLabel: Story = {
  args: {
    data: customerData,
    showCenterLabel: false,
  },
};
