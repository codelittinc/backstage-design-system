import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import FormDateInput from "./FormDateInput";

const meta = {
  title: "Form/FormDateInput",
  component: FormDateInput,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof FormDateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithValue: Story = {
  args: {
    value: "2026-02-24",
  },
} satisfies Story;

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

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("2026-02-24");
    return (
      <div style={{ maxWidth: 400 }}>
        <FormDateInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#64748b" }}>
          Value (YYYY-MM-DD): {value}
        </p>
      </div>
    );
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
      <FormDateInput />
      <FormDateInput value="2026-02-24" readOnly />
      <FormDateInput error />
      <FormDateInput disabled />
    </div>
  ),
} satisfies Story;
