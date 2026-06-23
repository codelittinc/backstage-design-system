import { type ReactNode } from "react";
import Pagination from "../Pagination/Pagination";

export interface DataTableColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
  headerClassName?: string;
  /**
   * When set, the column header becomes clickable to sort by this key.
   * Requires `onSort` on the table; the active column/direction is driven by
   * the table's `sortBy`/`sortOrder` props (the table is controlled).
   */
  sortKey?: string;
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
  /** Currently active sort key (matches a column's `sortKey`). */
  sortBy?: string;
  /** Direction of the active sort. */
  sortOrder?: "asc" | "desc";
  /**
   * Called when a sortable column header is clicked, with that column's
   * `sortKey`. The consumer owns sort state (e.g. toggle order on repeat).
   */
  onSort?: (sortKey: string) => void;
}

const alignClasses = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

function SortIndicator({ direction }: { direction?: "asc" | "desc" }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-1 inline-block text-[0.65rem] leading-none ${
        direction ? "text-slate-700" : "text-slate-300"
      }`}
    >
      {direction === "desc" ? "▼" : "▲"}
    </span>
  );
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pagination,
  rowClassName,
  emptyMessage = "No data found.",
  className,
  bare = false,
  sortBy,
  sortOrder,
  onSort,
}: DataTableProps<T>) {
  const wrapperClass = bare
    ? `overflow-x-auto ${className || ""}`
    : `overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-card ${className || ""}`;

  const renderHeaderRow = () => (
    <tr>
      {columns.map((col, i) => {
        const baseClass = `px-6 py-3 text-xs font-medium uppercase tracking-wider text-slate-700 ${alignClasses[col.align || "left"]} ${col.headerClassName || ""}`;
        const sortable = Boolean(col.sortKey && onSort);
        if (!sortable) {
          return (
            <th key={i} className={baseClass}>
              {col.header}
            </th>
          );
        }
        const isActive = sortBy === col.sortKey;
        return (
          <th key={i} className={baseClass} aria-sort={isActive ? (sortOrder === "desc" ? "descending" : "ascending") : "none"}>
            <button
              type="button"
              onClick={() => onSort!(col.sortKey!)}
              className="inline-flex items-center uppercase tracking-wider hover:text-slate-900"
            >
              {col.header}
              <SortIndicator direction={isActive ? sortOrder || "asc" : undefined} />
            </button>
          </th>
        );
      })}
    </tr>
  );

  if (data.length === 0) {
    return (
      <div className={wrapperClass}>
        <table className="w-full">
          <thead className="bg-slate-50">{renderHeaderRow()}</thead>
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
          <thead className="bg-slate-50">{renderHeaderRow()}</thead>
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
