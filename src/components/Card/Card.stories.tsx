import type { Meta, StoryObj } from "@storybook/react";
import Card from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    padding: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "The internal padding of the card",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
    children: {
      control: { type: "text" },
      description: "The content inside the card",
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is a default card with medium padding.",
  },
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    children: "This card uses small padding.",
  },
};

export const MediumPadding: Story = {
  args: {
    padding: "md",
    children: "This card uses medium padding (the default).",
  },
};

export const LargePadding: Story = {
  args: {
    padding: "lg",
    children: "This card uses large padding for extra breathing room.",
  },
};

export const Gallery: Story = {
  args: {
    children: "Gallery",
  },
  parameters: {
    layout: "padded",
  },
  render: () => {
    const paddings = ["sm", "md", "lg"] as const;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1.5rem",
          maxWidth: "800px",
        }}
      >
        {paddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <h4
              style={{
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "0.5rem",
              }}
            >
              Padding: {padding}
            </h4>
            <p style={{ fontSize: "0.875rem", color: "#64748b" }}>
              This card demonstrates the <code>{padding}</code> padding variant.
            </p>
          </Card>
        ))}
      </div>
    );
  },
};
