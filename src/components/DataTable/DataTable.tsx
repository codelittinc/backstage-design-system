import { type ReactNode } from "react";
import Pagination from "../Pagination/Pagination";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  headerClassName?: string;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  pagination?: DataTablePagination;
  rowClassName?: (row: T) => string;
  emptyMessage?: string;
  className?: string;
  bare?: boolean;
}

const alignClasses = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pagination,
  rowClassName,
  emptyMessage = "No data found.",
  className,
  bare = false,
}: DataTableProps<T>) {
  const wrapperClass = bare
    ? `overflow-x-auto ${className || ""}`
    : `overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card ${className || ""}`;

  if (data.length === 0) {
    return (
      <div className={wrapperClass}>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-700 ${alignClasses[col.align || "left"]} ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <div className={wrapperClass}>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-700 ${alignClasses[col.align || "left"]} ${col.headerClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className={`hover:bg-slate-50 transition-colors ${rowClassName ? rowClassName(row) : ""}`}
              >
                {columns.map((col, i) => (
                  <td
                    key={i}
                    className={`px-6 py-4 ${alignClasses[col.align || "left"]} ${col.className || ""}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
        />
      )}
    </>
  );
}
