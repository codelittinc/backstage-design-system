import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { useState } from "react";
import SegmentedControl from "./SegmentedControl";

const verdictOptions = [
  { value: "strong_yes", label: "Strong yes" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "strong_no", label: "Strong no" },
];

const meta = {
  title: "Form/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: {
    options: verdictOptions,
    value: null,
    onChange: fn(),
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithSelection: Story = {
  args: {
    value: "yes",
    name: "verdict",
  },
  play: async ({ canvasElement }) => {
    const radios = within(canvasElement).getAllByRole("radio");

    // The selected segment takes the tab stop and the brand fill.
    await expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1, -1]);
    await expect(radios[1]).toHaveClass("bg-[#0066cc]", "text-white");
    await expect(
      canvasElement.querySelector('input[type="hidden"][name="verdict"]')
    ).toHaveValue("yes");
  },
} satisfies Story;

export const Small: Story = {
  args: {
    size: "sm",
    value: "yes",
  },
} satisfies Story;

export const ErrorState: Story = {
  args: {
    error: true,
  },
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole("radiogroup");

    await expect(group).toHaveAttribute("aria-invalid", "true");
    await expect(group).toHaveClass("border-red-400");
  },
} satisfies Story;

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "no",
  },
  play: async ({ args, canvasElement }) => {
    const radios = within(canvasElement).getAllByRole("radio");

    for (const radio of radios) {
      await expect(radio).toBeDisabled();
    }
    await userEvent.click(radios[0]);
    await expect(args.onChange).not.toHaveBeenCalled();
  },
} satisfies Story;

export const FullWidth: Story = {
  parameters: {
    layout: "padded",
  },
  args: {
    className: "w-full",
    value: "strong_yes",
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div>
        <p id="verdict-label" style={{ marginBottom: "0.5rem", fontSize: "0.875rem" }}>
          Verdict
        </p>
        <SegmentedControl
          options={verdictOptions}
          value={value}
          onChange={setValue}
          aria-labelledby="verdict-label"
        />
        <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
          Selected: {value ?? "(none)"}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", { name: "Verdict" });
    const radios = within(group).getAllByRole("radio");
    const [strongYes, yes, , strongNo] = radios;

    // Nothing selected: only the first segment is in the tab order.
    await expect(radios.map((r) => r.getAttribute("aria-checked"))).toEqual([
      "false",
      "false",
      "false",
      "false",
    ]);
    await expect(radios.map((r) => r.tabIndex)).toEqual([0, -1, -1, -1]);

    await userEvent.tab();
    await expect(strongYes).toHaveFocus();

    await userEvent.keyboard(" ");
    await expect(strongYes).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard("{ArrowRight}");
    await expect(yes).toHaveFocus();
    await expect(yes).toHaveAttribute("aria-checked", "true");
    await expect(strongYes).toHaveAttribute("aria-checked", "false");
    await expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1, -1]);

    await userEvent.keyboard("{ArrowUp}{ArrowLeft}");
    await expect(strongNo).toHaveFocus();
    await expect(strongNo).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard("{ArrowDown}");
    await expect(strongYes).toHaveFocus();
    await expect(strongYes).toHaveAttribute("aria-checked", "true");

    await userEvent.click(strongNo);
    await userEvent.click(yes);
    await userEvent.keyboard("{ArrowLeft}{Enter}");
    await expect(strongYes).toHaveAttribute("aria-checked", "true");
    await expect(canvas.getByText("Selected: strong_yes")).toBeInTheDocument();
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <SegmentedControl options={verdictOptions} value={null} onChange={() => {}} />
      <SegmentedControl options={verdictOptions} value="yes" onChange={() => {}} />
      <SegmentedControl options={verdictOptions} value="yes" size="sm" onChange={() => {}} />
      <SegmentedControl options={verdictOptions} value={null} error onChange={() => {}} />
      <SegmentedControl options={verdictOptions} value="no" disabled onChange={() => {}} />
    </div>
  ),
} satisfies Story;
