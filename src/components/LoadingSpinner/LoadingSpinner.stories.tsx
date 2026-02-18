import type { Meta, StoryObj } from "@storybook/react";
import LoadingSpinner from "./LoadingSpinner";

const meta = {
  title: "Feedback/LoadingSpinner",
  component: LoadingSpinner,
  tags: ["autodocs"],
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const Small: Story = {
  args: {
    size: "sm",
  },
} satisfies Story;

export const Medium: Story = {
  args: {
    size: "md",
  },
} satisfies Story;

export const Large: Story = {
  args: {
    size: "lg",
  },
} satisfies Story;

export const CustomMessage: Story = {
  args: {
    message: "Fetching data, please wait...",
  },
} satisfies Story;

export const NoMessage: Story = {
  args: {
    message: "",
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <LoadingSpinner size="sm" message="Small spinner" />
      <LoadingSpinner size="md" message="Medium spinner" />
      <LoadingSpinner size="lg" message="Large spinner" />
      <LoadingSpinner message="Custom message" />
      <LoadingSpinner message="" />
    </div>
  ),
} satisfies Story;
