import type { Meta, StoryObj } from "@storybook/react";
import { ToastContainer, toast } from "./Toast";

const meta = {
  title: "Feedback/Toast",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div>
        <ToastContainer />
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: () => (
    <button
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      onClick={() => toast.success("Operation completed successfully!")}
    >
      Show Success Toast
    </button>
  ),
} satisfies Story;

export const Error: Story = {
  render: () => (
    <button
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      onClick={() => toast.error("Something went wrong")}
    >
      Show Error Toast
    </button>
  ),
} satisfies Story;

export const Info: Story = {
  render: () => (
    <button
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      onClick={() => toast.info("Here's some information")}
    >
      Show Info Toast
    </button>
  ),
} satisfies Story;

export const Warning: Story = {
  render: () => (
    <button
      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
      onClick={() => toast.warning("Please be careful")}
    >
      Show Warning Toast
    </button>
  ),
} satisfies Story;

export const Gallery: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      <button
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100"
        onClick={() => toast.success("Operation completed successfully!")}
      >
        Success
      </button>
      <button
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
        onClick={() => toast.error("Something went wrong")}
      >
        Error
      </button>
      <button
        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
        onClick={() => toast.info("Here's some information")}
      >
        Info
      </button>
      <button
        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700 hover:bg-amber-100"
        onClick={() => toast.warning("Please be careful")}
      >
        Warning
      </button>
    </div>
  ),
} satisfies Story;
