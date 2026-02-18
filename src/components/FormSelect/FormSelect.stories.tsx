import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import FormSelect from "./FormSelect";

const meta = {
  title: "Form/FormSelect",
  component: FormSelect,
  tags: ["autodocs"],
  args: {
    children: null,
    onChange: fn(),
  },
  render: (args) => (
    <FormSelect {...args}>
      <option value="">Select an option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </FormSelect>
  ),
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const ErrorState: Story = {
  args: {
    error: true,
  },
} satisfies Story;

export const Disabled: Story = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
      <FormSelect>
        <option value="">Default</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </FormSelect>
      <FormSelect error>
        <option value="">Error state</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </FormSelect>
      <FormSelect disabled>
        <option value="">Disabled</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </FormSelect>
    </div>
  ),
} satisfies Story;
