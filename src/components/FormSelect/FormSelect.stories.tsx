import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import FormSelect from "./FormSelect";

const sampleOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
];

const manyOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "gatsby", label: "Gatsby" },
  { value: "solidjs", label: "SolidJS" },
];

const meta = {
  title: "Form/FormSelect",
  component: FormSelect,
  tags: ["autodocs"],
  args: {
    value: "",
    onChange: fn(),
    options: sampleOptions,
  },
} satisfies Meta<typeof FormSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithSelection: Story = {
  args: {
    value: "react",
  },
} satisfies Story;

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Choose a framework...",
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
    value: "react",
  },
} satisfies Story;

export const Required: Story = {
  args: {
    required: true,
    value: "react",
  },
} satisfies Story;

export const WithSearch: Story = {
  args: {
    options: manyOptions,
    placeholder: "Select a framework (with search)...",
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div style={{ maxWidth: 400 }}>
        <FormSelect
          value={value}
          onChange={setValue}
          options={manyOptions}
          placeholder="Select a framework..."
        />
        <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#64748b" }}>
          Selected: {value || "(none)"}
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: 400,
      }}
    >
      <FormSelect
        value=""
        onChange={() => {}}
        options={sampleOptions}
        placeholder="Default"
      />
      <FormSelect
        value="react"
        onChange={() => {}}
        options={sampleOptions}
      />
      <FormSelect
        value=""
        onChange={() => {}}
        options={sampleOptions}
        error
        placeholder="Error state"
      />
      <FormSelect
        value="react"
        onChange={() => {}}
        options={sampleOptions}
        disabled
      />
    </div>
  ),
} satisfies Story;
