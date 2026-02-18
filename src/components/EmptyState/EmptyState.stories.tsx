import type { Meta, StoryObj } from "@storybook/react";
import EmptyState from "./EmptyState";
import Button from "../Button/Button";

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  argTypes: {
    message: {
      control: { type: "text" },
      description: "The main message to display",
    },
    description: {
      control: { type: "text" },
      description: "Optional supporting description text",
    },
    icon: {
      control: false,
      description: "Optional icon rendered above the message",
    },
    action: {
      control: false,
      description: "Optional action element rendered below the description",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "No results found",
  },
};

export const WithDescription: Story = {
  args: {
    message: "No results found",
    description:
      "Try adjusting your search or filters to find what you are looking for.",
  },
};

export const WithIcon: Story = {
  args: {
    message: "No data available",
    description: "There is nothing here yet. Check back later.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    ),
  },
};

export const WithAction: Story = {
  args: {
    message: "No projects found",
    description: "Get started by creating your first project.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    action: <Button variant="primary">Create Project</Button>,
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
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "1.5rem",
        maxWidth: "900px",
      }}
    >
      <EmptyState message="No results found" />

      <EmptyState
        message="No results found"
        description="Try adjusting your search or filters to find what you are looking for."
      />

      <EmptyState
        message="No data available"
        description="There is nothing here yet. Check back later."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
        }
      />

      <EmptyState
        message="No projects found"
        description="Get started by creating your first project."
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        }
        action={<Button variant="primary">Create Project</Button>}
      />
    </div>
  ),
};
