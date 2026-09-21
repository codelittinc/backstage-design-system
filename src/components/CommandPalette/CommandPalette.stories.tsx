import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import CommandPalette, { type CommandPaletteItem } from "./CommandPalette";

const PEOPLE: CommandPaletteItem[] = [
  { id: "a1", label: "Katie Galvan", sublabel: "katie@example.com · Senior Engineer", group: "Applicants" },
  { id: "a2", label: "Jose Garcia", sublabel: "jose@example.com · Product Designer", group: "Applicants" },
  { id: "a3", label: "Margaret Nguyen", sublabel: "margaret@example.com", group: "Applicants" },
  { id: "u1", label: "Ana Ruiz", sublabel: "ana@codelitt.com · Admin", group: "Users" },
  { id: "u2", label: "Tom Becker", sublabel: "tom@codelitt.com · Interviewer", group: "Users" },
];

const meta = {
  title: "Components/CommandPalette",
  component: CommandPalette,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A ⌘K search overlay. The palette does no filtering of its own — the caller hands it the rows to draw, in the order to draw them, so the same component backs a client-side list and a debounced server-side search.",
      },
    },
  },
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The caller owns the query and the narrowing; here it is a substring match. */
function Demo({ loading = false }: { loading?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const items = PEOPLE.filter((item) => {
    const haystack = `${item.label} ${item.sublabel ?? ""}`.toLowerCase();
    return words.every((word) => haystack.includes(word));
  });

  return (
    <div className="p-6">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Search… <span className="ml-2 text-xs text-slate-400">⌘K</span>
      </button>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        value={query}
        onValueChange={setQuery}
        items={loading ? [] : items}
        onSelect={(item) => window.alert(`Selected ${item.label}`)}
        label="Search applicants and users"
        placeholder="Search applicants and users…"
        loading={loading}
        emptyMessage="No matches."
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <Demo />,
};

/** While a query is in flight there is nothing to claim about the results yet. */
export const Loading: Story = {
  render: () => <Demo loading />,
};
