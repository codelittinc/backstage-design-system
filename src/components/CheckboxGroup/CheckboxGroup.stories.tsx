import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";

const statusOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const featureOptions = [
  { value: "billing", label: "Billing" },
  { value: "analytics", label: "Analytics" },
  { value: "exports", label: "Exports" },
  { value: "api", label: "API access" },
];

const meta = {
  title: "Form/CheckboxGroup",
  component: CheckboxGroup,
  tags: ["autodocs"],
  args: {
    value: [],
    onChange: fn(),
    options: statusOptions,
  },
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithSelection: Story = {
  args: {
    value: ["true"],
  },
} satisfies Story;

export const Vertical: Story = {
  args: {
    options: featureOptions,
    orientation: "vertical",
    value: ["billing", "analytics"],
  },
} satisfies Story;

export const DisabledOption: Story = {
  args: {
    options: [
      { value: "true", label: "Active" },
      { value: "false", label: "Inactive", disabled: true },
    ],
    value: ["true"],
  },
} satisfies Story;

export const AllDisabled: Story = {
  args: {
    disabled: true,
    value: ["true"],
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["true"]);
    return (
      <div style={{ maxWidth: 400 }}>
        <CheckboxGroup
          value={value}
          onChange={setValue}
          options={statusOptions}
        />
        <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
          Selected: {value.length === 0 ? "(none)" : value.join(", ")}
        </p>
      </div>
    );
  },
} satisfies Story;
