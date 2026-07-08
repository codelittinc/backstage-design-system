import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import MonthCalendar from "./MonthCalendar";
import SegmentedChip from "../SegmentedChip";
import { getCategoricalSegments } from "../../tokens/categoricalColors";

interface DemoItem {
  id: number;
  name: string;
  categoryIds: number[];
}

function buildItems(month: string, entries: [number, DemoItem[]][]): Map<string, DemoItem[]> {
  return new Map(
    entries.map(([day, items]) => [`${month}-${String(day).padStart(2, "0")}`, items])
  );
}

function demoItem(id: number, name: string, categoryIds: number[] = [id]): DemoItem {
  return { id, name, categoryIds };
}

function renderDemoItem(item: DemoItem) {
  return (
    <SegmentedChip
      segments={getCategoricalSegments(item.categoryIds)}
      label={item.name}
      aria-label={item.name}
    />
  );
}

function CalendarDemo({
  itemsForMonth,
  loading = false,
}: {
  itemsForMonth: (month: string) => Map<string, DemoItem[]>;
  loading?: boolean;
}) {
  const [month, setMonth] = useState("2026-07");
  return (
    <MonthCalendar<DemoItem>
      month={month}
      onMonthChange={setMonth}
      itemsByDate={itemsForMonth(month)}
      renderItem={renderDemoItem}
      itemKey={(item) => item.id}
      loading={loading}
    />
  );
}

const meta = {
  title: "Components/MonthCalendar",
  component: MonthCalendar,
  tags: ["autodocs"],
  args: {
    month: "2026-07",
    onMonthChange: fn(),
    itemsByDate: new Map(),
    renderItem: () => null,
    itemKey: () => 0,
  },
} satisfies Meta<typeof MonthCalendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CalendarDemo
      itemsForMonth={(month) =>
        buildItems(month, [
          [3, [demoItem(1, "Jane D."), demoItem(2, "John S.")]],
          [8, [demoItem(3, "Alex M.", [])]],
          [14, [demoItem(4, "Sam K.", [1, 2, 3])]],
          [21, [demoItem(5, "Ana P."), demoItem(6, "Luis R.", [4, 5])]],
        ])
      }
    />
  ),
} satisfies Story;

export const OverflowingDay: Story = {
  render: () => (
    <CalendarDemo
      itemsForMonth={(month) =>
        buildItems(month, [
          [
            14,
            Array.from({ length: 7 }, (_, i) =>
              demoItem(i + 1, `Person ${i + 1}`, [i])
            ),
          ],
          [15, [demoItem(20, "Jane D.")]],
        ])
      }
    />
  ),
} satisfies Story;

export const Loading: Story = {
  render: () => (
    <CalendarDemo
      loading
      itemsForMonth={(month) =>
        buildItems(month, [[10, [demoItem(1, "Jane D."), demoItem(2, "John S.")]]])
      }
    />
  ),
} satisfies Story;
