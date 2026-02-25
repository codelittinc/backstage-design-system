import type { Meta, StoryObj } from "@storybook/react";
import DataTable from "./DataTable";
import type { DataTableColumn } from "./DataTable";
import { useState } from "react";

interface SampleUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

const sampleUsers: SampleUser[] = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ["Admin", "Editor", "Viewer"][i % 3],
  status: i % 4 === 0 ? "inactive" : "active",
  createdAt: new Date(2024, 0, i + 1).toLocaleDateString(),
}));

const columns: DataTableColumn<SampleUser>[] = [
  {
    header: "Name",
    render: (row) => (
      <span className="font-medium text-[#0066cc]">{row.name}</span>
    ),
  },
  {
    header: "Email",
    render: (row) => (
      <span className="text-slate-600">{row.email}</span>
    ),
  },
  {
    header: "Role",
    render: (row) => <span className="text-slate-600">{row.role}</span>,
  },
  {
    header: "Status",
    render: (row) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          row.status === "active"
            ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
            : "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10"
        }`}
      >
        {row.status === "active" ? "Active" : "Inactive"}
      </span>
    ),
  },
  {
    header: "Created",
    render: (row) => (
      <span className="text-slate-600">{row.createdAt}</span>
    ),
  },
];

const meta = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["autodocs"],
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS_PER_PAGE = 10;

function PaginatedTable() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(sampleUsers.length / ITEMS_PER_PAGE);
  const pageData = sampleUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <DataTable
      columns={columns}
      data={pageData}
      keyExtractor={(row) => row.id}
      pagination={{
        page,
        totalPages,
        totalItems: sampleUsers.length,
        itemsPerPage: ITEMS_PER_PAGE,
        onPageChange: setPage,
      }}
    />
  );
}

export const WithPagination: Story = {
  render: () => <PaginatedTable />,
};

export const Empty: Story = {
  args: {
    columns: columns as DataTableColumn<unknown>[],
    data: [],
    keyExtractor: (row: unknown) => (row as SampleUser).id,
    emptyMessage: "No users found.",
  },
};

export const WithoutPagination: Story = {
  args: {
    columns: columns as DataTableColumn<unknown>[],
    data: sampleUsers.slice(0, 5) as unknown[],
    keyExtractor: (row: unknown) => (row as SampleUser).id,
  },
};
