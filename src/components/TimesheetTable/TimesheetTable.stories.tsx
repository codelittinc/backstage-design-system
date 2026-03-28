import type { Meta, StoryObj } from "@storybook/react";
import TimesheetTable from "./TimesheetTable";
import { ToastContainer } from "../Toast";
import type { TimesheetApi, TimesheetContract } from "./types";

// --- Mock Data ---

const today = new Date();
const year = today.getUTCFullYear();
const month = today.getUTCMonth();

const mockContracts: TimesheetContract[] = [
  {
    id: 1,
    name: "Development Contract",
    projectName: "Backstage Platform",
    customerName: "Codelitt",
    startDate: new Date(Date.UTC(year, 0, 1)).toISOString(),
    endDate: new Date(Date.UTC(year, 11, 31)).toISOString(),
    projectActive: true,
  },
  {
    id: 2,
    name: "Consulting Contract",
    projectName: "Mobile App Redesign",
    customerName: "Acme Corp",
    startDate: new Date(Date.UTC(year, month - 1, 1)).toISOString(),
    endDate: new Date(Date.UTC(year, month + 3, 0)).toISOString(),
    projectActive: true,
  },
  {
    id: 3,
    name: "Support Contract",
    projectName: "Legacy System",
    customerName: "Globex Inc",
    startDate: new Date(Date.UTC(year, 0, 1)).toISOString(),
    endDate: new Date(Date.UTC(year, 11, 31)).toISOString(),
    projectActive: true,
  },
];

// Generate some mock time entries for the current week
function getMondayOfWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  d.setUTCDate(diff);
  return d;
}

function toISO(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function generateMockEntries(startDate: string, endDate: string) {
  const entries: { id: number; date: string; hours: number; userId: number; contractId: number }[] = [];
  let id = 1;
  const start = new Date(startDate + "T00:00:00.000Z");
  const end = new Date(endDate + "T00:00:00.000Z");
  const current = new Date(start);

  while (current <= end) {
    const dow = current.getUTCDay();
    if (dow !== 0 && dow !== 6) {
      // Weekday — add some hours for contracts 1 and 2
      entries.push({ id: id++, date: current.toISOString(), hours: 6, userId: 1, contractId: 1 });
      entries.push({ id: id++, date: current.toISOString(), hours: 2, userId: 1, contractId: 2 });
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return entries;
}

const mockApi: TimesheetApi = {
  async fetchTimeEntries({ startDate, endDate }) {
    await new Promise((r) => setTimeout(r, 500));
    return { timeEntries: generateMockEntries(startDate, endDate) };
  },
  async fetchExpectedHours() {
    await new Promise((r) => setTimeout(r, 300));
    return {
      expectedHours: 40,
      ptoHours: 0,
      timeOffs: [],
    };
  },
  async saveTimesheet(entries) {
    await new Promise((r) => setTimeout(r, 800));
    const upserted = entries.filter((e) => e.hours !== null).length;
    const deleted = entries.filter((e) => e.hours === null).length;
    return { success: true, upserted, deleted };
  },
};

const mockApiWithPTO: TimesheetApi = {
  ...mockApi,
  async fetchExpectedHours() {
    await new Promise((r) => setTimeout(r, 300));
    const monday = getMondayOfWeek(today);
    const wed = new Date(monday);
    wed.setUTCDate(monday.getUTCDate() + 2);
    const thu = new Date(monday);
    thu.setUTCDate(monday.getUTCDate() + 3);
    return {
      expectedHours: 32,
      ptoHours: 8,
      timeOffs: [
        {
          id: 1,
          type: "Vacation",
          startsAt: toISO(wed),
          endsAt: toISO(thu),
        },
      ],
    };
  },
};

const emptyApi: TimesheetApi = {
  async fetchTimeEntries() {
    await new Promise((r) => setTimeout(r, 300));
    return { timeEntries: [] };
  },
  async fetchExpectedHours() {
    await new Promise((r) => setTimeout(r, 200));
    return { expectedHours: 40, ptoHours: 0, timeOffs: [] };
  },
  async saveTimesheet(entries) {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, upserted: entries.length, deleted: 0 };
  },
};

// --- Stories ---

const meta = {
  title: "Components/TimesheetTable",
  component: TimesheetTable,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div>
        <ToastContainer />
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TimesheetTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WeeklyView: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: mockContracts,
    api: mockApi,
    defaultView: "weekly",
  },
};

export const MonthlyView: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: mockContracts,
    api: mockApi,
    defaultView: "monthly",
  },
};

export const WithTimeOff: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: mockContracts,
    api: mockApiWithPTO,
    defaultView: "weekly",
  },
};

export const EmptyTimesheet: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: mockContracts,
    api: emptyApi,
    defaultView: "weekly",
  },
};

export const SingleContract: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: [mockContracts[0]],
    api: mockApi,
    defaultView: "weekly",
  },
};

export const NoContracts: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: [],
    api: emptyApi,
    defaultView: "weekly",
  },
};

export const CustomTitle: Story = {
  args: {
    userId: 1,
    userFullName: "Jane Smith",
    contracts: mockContracts,
    api: mockApi,
    defaultView: "weekly",
    title: "Timesheet — This Week",
  },
};
