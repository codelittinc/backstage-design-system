import type { Meta, StoryObj } from "@storybook/react";
import Tooltip from "./Tooltip";

const meta = {
  title: "Feedback/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Tooltip text",
    children: (
      <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700">
        Hover me
      </button>
    ),
  },
} satisfies Story;

export const TopPosition: Story = {
  args: {
    label: "This tooltip appears on top",
    children: (
      <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700">
        Hover me
      </button>
    ),
  },
} satisfies Story;

export const Gallery: Story = {
  args: {
    label: "Gallery",
    children: null,
  },
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", paddingTop: "3rem" }}>
      <Tooltip label="Short tip">
        <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700">
          Short
        </button>
      </Tooltip>
      <Tooltip label="This is a longer tooltip message">
        <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700">
          Long text
        </button>
      </Tooltip>
      <Tooltip label="Action hint">
        <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-700">
          Action
        </button>
      </Tooltip>
    </div>
  ),
} satisfies Story;
