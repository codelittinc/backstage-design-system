import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import FormTextarea from "./FormTextarea";

const meta = {
  title: "Form/FormTextarea",
  component: FormTextarea,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
    rows: 3,
  },
} satisfies Meta<typeof FormTextarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Write a description...",
  },
} satisfies Story;

export const WithValue: Story = {
  args: {
    value:
      "This is a multi-line value.\nIt spans several lines to demonstrate the textarea rendering with content.",
  },
} satisfies Story;

export const ErrorState: Story = {
  args: {
    error: true,
    placeholder: "Invalid input",
  },
} satisfies Story;

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled textarea",
  },
} satisfies Story;

export const TallerRows: Story = {
  args: {
    rows: 6,
    placeholder: "Larger textarea (rows=6)",
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 480 }}>
      <FormTextarea placeholder="Default" rows={3} />
      <FormTextarea placeholder="With placeholder" rows={3} />
      <FormTextarea value="With value" readOnly rows={3} />
      <FormTextarea error placeholder="Error state" rows={3} />
      <FormTextarea disabled placeholder="Disabled" rows={3} />
    </div>
  ),
} satisfies Story;
