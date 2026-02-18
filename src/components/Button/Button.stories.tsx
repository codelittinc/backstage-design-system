import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["primary", "secondary", "danger"],
      description: "The visual style of the button",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      description: "The size of the button",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Whether the button is disabled",
    },
    children: {
      control: { type: "text" },
      description: "The content inside the button",
    },
    onClick: {
      description: "Click handler",
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
};

export const Danger: Story = {
  args: {
    children: "Danger",
    variant: "danger",
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
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
    const variants = ["primary", "secondary", "danger"] as const;
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {variants.map((variant) => (
          <div key={variant}>
            <h3
              style={{
                marginBottom: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#475569",
                textTransform: "capitalize",
              }}
            >
              {variant}
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {sizes.map((size) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size}>
                  {size.toUpperCase()}
                </Button>
              ))}
              <Button variant={variant} disabled>
                Disabled
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
