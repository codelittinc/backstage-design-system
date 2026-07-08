import type { Meta, StoryObj } from "@storybook/react";
import Popover from "./Popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  tags: ["autodocs"],
  args: {
    content: (
      <>
        <p className="text-sm font-semibold text-slate-900">Jane Doe</p>
        <p className="mt-0.5 text-xs text-slate-500">Vacation · Jul 7 – Jul 11, 2026</p>
      </>
    ),
    ariaLabel: "Jane Doe",
    children: ({ triggerProps, open }) => (
      <button
        type="button"
        {...triggerProps}
        className={`rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 ${
          open ? "ring-2 ring-[#0066cc]/30" : ""
        }`}
      >
        Hover or click me
      </button>
    ),
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Hover the trigger to open after a short delay; move away to close.",
      },
    },
  },
} satisfies Story;

export const PinnedOnClick: Story = {
  args: {
    ariaLabel: "Pinned popover",
    children: ({ triggerProps, open, pinned }) => (
      <button
        type="button"
        {...triggerProps}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
      >
        {pinned ? "Pinned (click again or press Escape)" : open ? "Open" : "Click to pin"}
      </button>
    ),
  },
} satisfies Story;

export const LongContent: Story = {
  args: {
    ariaLabel: "Long content",
    className: "max-h-64 space-y-1 overflow-y-auto p-2",
    content: (
      <>
        <div className="pb-1 text-xs font-semibold text-slate-700">
          Tue, Jul 14 — 12 items
        </div>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="rounded-md bg-slate-100 px-1.5 py-1 text-xs text-slate-700">
            Item {i + 1}
          </div>
        ))}
      </>
    ),
  },
} satisfies Story;
