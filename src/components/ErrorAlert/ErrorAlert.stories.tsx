import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ErrorAlert from "./ErrorAlert";

const meta = {
  title: "Feedback/ErrorAlert",
  component: ErrorAlert,
  tags: ["autodocs"],
  argTypes: {
    message: {
      control: { type: "text" },
      description: "The error message to display",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
    onDismiss: {
      description: "Callback fired when the dismiss button is clicked",
    },
  },
} satisfies Meta<typeof ErrorAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "Something went wrong. Please try again later.",
  },
};

export const Dismissible: Story = {
  args: {
    message: "Failed to save changes. Please check your connection.",
    onDismiss: fn(),
  },
};

export const Gallery: Story = {
  args: {
    message: "Gallery",
  },
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "600px",
      }}
    >
      <ErrorAlert message="Something went wrong. Please try again later." />
      <ErrorAlert
        message="Failed to save changes. Please check your connection."
        onDismiss={() => {}}
      />
      <ErrorAlert message="Access denied. You do not have permission to view this resource." />
      <ErrorAlert
        message="Session expired. Please log in again to continue."
        onDismiss={() => {}}
      />
    </div>
  ),
};
