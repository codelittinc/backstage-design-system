import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import Checkbox from "./Checkbox";

const meta = {
  title: "Form/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Accept terms",
  },
} satisfies Story;

export const Checked: Story = {
  args: {
    label: "I'm subscribed",
    defaultChecked: true,
  },
} satisfies Story;

export const NoLabel: Story = {
  args: {},
} satisfies Story;

export const Disabled: Story = {
  args: {
    label: "Disabled option",
    disabled: true,
  },
} satisfies Story;

export const DisabledChecked: Story = {
  args: {
    label: "Locked in",
    disabled: true,
    defaultChecked: true,
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label={`Checkbox is ${checked ? "on" : "off"}`}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    };
    return <Demo />;
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Checkbox label="Default" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
    </div>
  ),
} satisfies Story;
