import type { Meta, StoryObj } from "@storybook/react";
import FormLabel from "./FormLabel";

const meta = {
  title: "Form/FormLabel",
  component: FormLabel,
  tags: ["autodocs"],
  args: {
    children: "Label text",
  },
} satisfies Meta<typeof FormLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Email address",
  },
} satisfies Story;

export const Required: Story = {
  args: {
    children: "Email address",
    required: true,
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <FormLabel>Default label</FormLabel>
      <FormLabel required>Required label</FormLabel>
    </div>
  ),
} satisfies Story;
