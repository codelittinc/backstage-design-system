import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import Tabs from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  args: {
    tabs: [
      { key: "overview", label: "Overview" },
      { key: "details", label: "Details" },
      { key: "history", label: "History" },
    ],
    value: "overview",
    onChange: fn(),
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const Many: Story = {
  args: {
    tabs: [
      { key: "details", label: "Details" },
      { key: "projects", label: "Projects" },
      { key: "requirements", label: "Requirements" },
      { key: "contracts", label: "Contracts" },
      { key: "org-chart", label: "Org Chart" },
      { key: "audit", label: "Audit Log" },
    ],
    value: "projects",
  },
} satisfies Story;

export const WithCounts: Story = {
  args: {
    tabs: [
      {
        key: "all",
        label: (
          <span className="inline-flex items-center gap-2">
            All <span className="rounded-full bg-slate-200 px-1.5 text-xs">42</span>
          </span>
        ),
      },
      {
        key: "active",
        label: (
          <span className="inline-flex items-center gap-2">
            Active <span className="rounded-full bg-slate-200 px-1.5 text-xs">12</span>
          </span>
        ),
      },
      {
        key: "archived",
        label: (
          <span className="inline-flex items-center gap-2">
            Archived <span className="rounded-full bg-slate-200 px-1.5 text-xs">30</span>
          </span>
        ),
      },
    ],
    value: "active",
  },
} satisfies Story;

export const WithDisabled: Story = {
  args: {
    tabs: [
      { key: "overview", label: "Overview" },
      { key: "details", label: "Details" },
      { key: "history", label: "History", disabled: true },
    ],
    value: "overview",
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const tabs = [
        { key: "details" as const, label: "Details" },
        { key: "projects" as const, label: "Projects" },
        { key: "requirements" as const, label: "Requirements" },
        { key: "org-chart" as const, label: "Org Chart" },
      ];
      const [value, setValue] = useState<(typeof tabs)[number]["key"]>("details");
      return (
        <div>
          <Tabs tabs={tabs} value={value} onChange={setValue} />
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">
              Active tab: <span className="font-mono font-medium">{value}</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Try arrow keys, Home, End to navigate.
            </p>
          </div>
        </div>
      );
    };
    return <Demo />;
  },
} satisfies Story;
