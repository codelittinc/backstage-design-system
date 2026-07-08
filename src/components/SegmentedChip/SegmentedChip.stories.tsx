import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import SegmentedChip from "./SegmentedChip";
import {
  NEUTRAL_CATEGORICAL_COLOR,
  getCategoricalColor,
  getCategoricalSegments,
} from "../../tokens/categoricalColors";

const meta = {
  title: "Components/SegmentedChip",
  component: SegmentedChip,
  tags: ["autodocs"],
  args: {
    segments: [{ color: getCategoricalColor(0) }],
    label: "Jane D.",
    onClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SegmentedChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleColor: Story = {} satisfies Story;

export const ThreeSegments: Story = {
  args: {
    segments: getCategoricalSegments([0, 1, 2]),
    label: "John S.",
  },
} satisfies Story;

export const Neutral: Story = {
  args: {
    segments: [{ color: NEUTRAL_CATEGORICAL_COLOR }],
    label: "Alex M.",
  },
} satisfies Story;

export const WithOverflowSegment: Story = {
  args: {
    segments: getCategoricalSegments([0, 1, 2, 3, 4, 5]),
    label: "Sam K. · 4h",
  },
} satisfies Story;
