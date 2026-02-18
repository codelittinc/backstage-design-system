import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Tag from "./Tag";

const meta = {
  title: "Components/Tag",
  component: Tag,
  tags: ["autodocs"],
  args: {
    children: "Tag",
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Tag",
  },
} satisfies Story;

export const Blue: Story = {
  args: {
    children: "Blue",
    variant: "blue",
  },
} satisfies Story;

export const Green: Story = {
  args: {
    children: "Green",
    variant: "green",
  },
} satisfies Story;

export const Gray: Story = {
  args: {
    children: "Gray",
    variant: "gray",
  },
} satisfies Story;

export const Red: Story = {
  args: {
    children: "Red",
    variant: "red",
  },
} satisfies Story;

export const Yellow: Story = {
  args: {
    children: "Yellow",
    variant: "yellow",
  },
} satisfies Story;

export const Purple: Story = {
  args: {
    children: "Purple",
    variant: "purple",
  },
} satisfies Story;

export const Removable: Story = {
  args: {
    children: "Removable",
    variant: "blue",
    onRemove: fn(),
  },
} satisfies Story;

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
      <Tag variant="blue">Blue</Tag>
      <Tag variant="green">Green</Tag>
      <Tag variant="gray">Gray</Tag>
      <Tag variant="red">Red</Tag>
      <Tag variant="yellow">Yellow</Tag>
      <Tag variant="purple">Purple</Tag>
      <Tag variant="blue" onRemove={() => {}}>Removable</Tag>
    </div>
  ),
} satisfies Story;
