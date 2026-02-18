import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import FormInput from "./FormInput";

const meta = {
  title: "Form/FormInput",
  component: FormInput,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Enter your name",
  },
} satisfies Story;

export const WithValue: Story = {
  args: {
    value: "Hello, World!",
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
    placeholder: "Disabled input",
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
      <FormInput placeholder="Default" />
      <FormInput placeholder="With placeholder" />
      <FormInput value="With value" readOnly />
      <FormInput error placeholder="Error state" />
      <FormInput disabled placeholder="Disabled" />
    </div>
  ),
} satisfies Story;
