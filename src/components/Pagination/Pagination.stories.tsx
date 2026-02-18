import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import Pagination from "./Pagination";

const meta = {
  title: "Data Display/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    onPageChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 1,
    totalPages: 10,
    totalItems: 100,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange(p);
        }}
      />
    );
  },
} satisfies Story;

export const FewPages: Story = {
  args: {
    page: 1,
    totalPages: 3,
    totalItems: 30,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange(p);
        }}
      />
    );
  },
} satisfies Story;

export const ManyPages: Story = {
  args: {
    page: 1,
    totalPages: 20,
    totalItems: 200,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange(p);
        }}
      />
    );
  },
} satisfies Story;

export const WithoutInfo: Story = {
  args: {
    page: 1,
    totalPages: 10,
    totalItems: 100,
    showInfo: false,
  },
  render: function PaginationStory(args) {
    const [page, setPage] = useState(args.page);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(p) => {
          setPage(p);
          args.onPageChange(p);
        }}
      />
    );
  },
} satisfies Story;

export const Gallery: Story = {
  args: {
    page: 1,
    totalPages: 10,
  },
  parameters: {
    layout: "padded",
  },
  render: function PaginationGallery() {
    const [page1, setPage1] = useState(1);
    const [page2, setPage2] = useState(1);
    const [page3, setPage3] = useState(5);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Few pages</p>
          <Pagination page={page1} totalPages={3} totalItems={30} onPageChange={setPage1} />
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Standard</p>
          <Pagination page={page2} totalPages={10} totalItems={100} onPageChange={setPage2} />
        </div>
        <div>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>Many pages (starting at page 5)</p>
          <Pagination page={page3} totalPages={20} totalItems={200} onPageChange={setPage3} />
        </div>
      </div>
    );
  },
} satisfies Story;
