import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import FormCurrencyInput from "./FormCurrencyInput";
import FormLabel from "../FormLabel";

const meta = {
  title: "Form/FormCurrencyInput",
  component: FormCurrencyInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormCurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: null,
    onChange: () => {},
    placeholder: "$0",
  },
};

export const WithValue: Story = {
  args: {
    value: 1500000,
    onChange: () => {},
  },
};

export const WithSmallValue: Story = {
  args: {
    value: 250,
    onChange: () => {},
  },
};

export const ErrorState: Story = {
  args: {
    value: 0,
    onChange: () => {},
    error: true,
    placeholder: "$0",
  },
};

export const Disabled: Story = {
  args: {
    value: 75000,
    onChange: () => {},
    disabled: true,
  },
};

export const CustomPlaceholder: Story = {
  args: {
    value: null,
    onChange: () => {},
    placeholder: "Enter amount",
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(50000);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <FormLabel>Revenue Goal</FormLabel>
        <FormCurrencyInput value={value} onChange={setValue} />
        <p style={{ fontSize: 12, color: "#64748b" }}>
          Raw value: {value === null ? "null" : value}
        </p>
      </div>
    );
  },
};

export const AllowNull: Story = {
  render: () => {
    const [value, setValue] = useState<number | null>(null);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <FormLabel>Optional Revenue</FormLabel>
        <FormCurrencyInput
          value={value}
          onChange={setValue}
          allowNull
          placeholder="Optional"
        />
        <p style={{ fontSize: 12, color: "#64748b" }}>
          Raw value: {value === null ? "null" : value}
        </p>
      </div>
    );
  },
};

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
      <div>
        <FormLabel>Default (empty)</FormLabel>
        <FormCurrencyInput value={null} onChange={() => {}} />
      </div>
      <div>
        <FormLabel>With value</FormLabel>
        <FormCurrencyInput value={1250000} onChange={() => {}} />
      </div>
      <div>
        <FormLabel>Small value</FormLabel>
        <FormCurrencyInput value={99} onChange={() => {}} />
      </div>
      <div>
        <FormLabel>Error state</FormLabel>
        <FormCurrencyInput value={0} onChange={() => {}} error />
      </div>
      <div>
        <FormLabel>Disabled</FormLabel>
        <FormCurrencyInput value={500000} onChange={() => {}} disabled />
      </div>
    </div>
  ),
};
