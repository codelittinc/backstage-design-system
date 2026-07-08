import type { Meta, StoryObj } from "@storybook/react";
import {
  CATEGORICAL_PALETTE,
  NEUTRAL_CATEGORICAL_COLOR,
  OVERFLOW_SEGMENT_COLOR,
} from "./categoricalColors";

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex h-16 w-24 items-center justify-center rounded-lg text-xs font-medium text-white"
        style={{ backgroundColor: color }}
      >
        {color}
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

function PaletteGrid() {
  return (
    <div className="flex flex-wrap gap-3">
      {CATEGORICAL_PALETTE.map((color, i) => (
        <Swatch key={color} color={color} label={`index ${i}`} />
      ))}
      <Swatch color={NEUTRAL_CATEGORICAL_COLOR} label="neutral" />
      <Swatch color={OVERFLOW_SEGMENT_COLOR} label="overflow" />
    </div>
  );
}

const meta = {
  title: "Tokens/CategoricalColors",
  component: PaletteGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof PaletteGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {} satisfies Story;
