import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import MultiSelect from "./MultiSelect";
import Tag from "../Tag";

const sampleOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
  { value: "svelte", label: "Svelte" },
  { value: "solidjs", label: "SolidJS" },
  { value: "nextjs", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "gatsby", label: "Gatsby" },
];

const meta = {
  title: "Form/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  args: {
    value: [],
    onChange: fn(),
    options: sampleOptions,
    placeholder: "Search frameworks...",
  },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const WithSelection: Story = {
  args: {
    value: ["react", "vue"],
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
    value: ["react"],
  },
} satisfies Story;

export const Loading: Story = {
  args: {
    loading: true,
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<string[]>([]);
      const selectedLabels = sampleOptions
        .filter((o) => value.includes(o.value))
        .map((o) => o.label);
      return (
        <div style={{ maxWidth: 480 }}>
          <MultiSelect
            value={value}
            onChange={setValue}
            options={sampleOptions}
            placeholder="Pick frameworks..."
          />
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {selectedLabels.length === 0 ? (
              <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                Nothing selected yet.
              </span>
            ) : (
              selectedLabels.map((label, i) => (
                <Tag
                  key={i}
                  variant="blue"
                  onRemove={() => setValue(value.filter((v) => v !== sampleOptions[i].value))}
                >
                  {label}
                </Tag>
              ))
            )}
          </div>
        </div>
      );
    };
    return <Demo />;
  },
} satisfies Story;

export const WithCreate: Story = {
  render: () => {
    const Demo = () => {
      const [options, setOptions] = useState(sampleOptions);
      const [value, setValue] = useState<string[]>([]);
      return (
        <div style={{ maxWidth: 480 }}>
          <MultiSelect
            value={value}
            onChange={setValue}
            options={options}
            placeholder="Type to filter or create..."
            onCreate={(input) => {
              const newOption = {
                value: input.toLowerCase().replace(/\s+/g, "-"),
                label: input,
              };
              setOptions((o) => [...o, newOption]);
              setValue((v) => [...v, newOption.value]);
            }}
          />
          <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#64748b" }}>
            Try typing a name that doesn&apos;t exist in the list.
          </p>
        </div>
      );
    };
    return <Demo />;
  },
} satisfies Story;
