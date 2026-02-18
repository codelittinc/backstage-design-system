import type { Meta, StoryObj } from "@storybook/react";
import StatusIndicator, { StatusLegend } from "./StatusIndicator";

const meta = {
  title: "Data Display/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: "currently_working",
  },
} satisfies Story;

export const WithLabel: Story = {
  args: {
    status: "currently_working",
    showLabel: true,
  },
} satisfies Story;

export const SmallSize: Story = {
  args: {
    status: "currently_working",
    size: "sm",
  },
} satisfies Story;

export const CurrentlyWorking: Story = {
  args: {
    status: "currently_working",
    showLabel: true,
  },
} satisfies Story;

export const CompletedHiring: Story = {
  args: {
    status: "completed_hiring",
    showLabel: true,
  },
} satisfies Story;

export const StartedHiring: Story = {
  args: {
    status: "started_hiring",
    showLabel: true,
  },
} satisfies Story;

export const WorkedWithUs: Story = {
  args: {
    status: "worked_with_us",
    showLabel: true,
  },
} satisfies Story;

export const Blocked: Story = {
  args: {
    status: "blocked",
    showLabel: true,
  },
} satisfies Story;

export const IncompleteProfile: Story = {
  args: {
    status: "incomplete_profile",
    showLabel: true,
  },
} satisfies Story;

export const StatusLegendStory: Story = {
  args: {
    status: "currently_working",
  },
  render: () => <StatusLegend />,
} satisfies Story;

export const Gallery: Story = {
  args: {
    status: "currently_working",
  },
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <StatusIndicator status="currently_working" showLabel />
        <StatusIndicator status="completed_hiring" showLabel />
        <StatusIndicator status="started_hiring" showLabel />
        <StatusIndicator status="worked_with_us" showLabel />
        <StatusIndicator status="blocked" showLabel />
        <StatusIndicator status="incomplete_profile" showLabel />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "0.5rem 0" }} />
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <StatusIndicator status="currently_working" size="sm" />
        <StatusIndicator status="completed_hiring" size="sm" />
        <StatusIndicator status="started_hiring" size="sm" />
        <StatusIndicator status="worked_with_us" size="sm" />
        <StatusIndicator status="blocked" size="sm" />
        <StatusIndicator status="incomplete_profile" size="sm" />
      </div>
      <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "0.5rem 0" }} />
      <StatusLegend />
    </div>
  ),
} satisfies Story;
