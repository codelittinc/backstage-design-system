import type { Meta, StoryObj } from "@storybook/react";
import SectionHeader from "./SectionHeader";

const meta = {
  title: "Components/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: { type: "text" },
      description: "The heading text or content",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Section Header",
  },
};

export const Gallery: Story = {
  args: {
    children: "Gallery",
  },
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        maxWidth: "600px",
      }}
    >
      <SectionHeader>Overview</SectionHeader>
      <SectionHeader>Team Members</SectionHeader>
      <SectionHeader>Project Settings</SectionHeader>
      <SectionHeader>Activity Log</SectionHeader>
    </div>
  ),
};
