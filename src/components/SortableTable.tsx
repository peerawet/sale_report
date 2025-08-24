import React, { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc" | null;

interface SortableTableProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
    render: (item: T, index: number) => React.ReactNode;
    align?: "left" | "center" | "right";
  }>;
  theme?: "default" | "sales" | "repeat" | "conversion" | "renewal";
  footer?: React.ReactNode;
}

const SortIcon = ({
  field,
  currentField,
  direction,
}: {
  field: string;
  currentField: string | null;
  direction: SortDirection;
}) => {
  if (currentField !== field) {
    return <span className="text-slate-400 ml-1">↕️</span>;
  }

  if (direction === "asc") {
    return <span className="text-sky-600 ml-1">↑</span>;
  } else if (direction === "desc") {
    return <span className="text-sky-600 ml-1">↓</span>;
  }

  return <span className="text-slate-400 ml-1">↕️</span>;
};

function SortableTable<T extends Record<string, any>>({
  title,
  subtitle,
  data,
  columns,
  theme = "default",
  footer,
}: SortableTableProps<T>) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return data;

    return [...data].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal, "th")
          : bVal.localeCompare(aVal, "th");
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortField, sortDirection]);

  const getThemeColors = () => {
    switch (theme) {
      case "sales":
        return {
          header: "bg-gradient-to-r from-slate-50 to-sky-50",
          tableHeader: "bg-slate-50",
          hoverColor: "hover:bg-slate-50",
          footerColor: "bg-slate-50",
        };
      case "repeat":
        return {
          header: "bg-gradient-to-r from-amber-50 to-orange-50",
          tableHeader: "bg-amber-50",
          hoverColor: "hover:bg-amber-50",
          footerColor: "bg-amber-50",
        };
      case "conversion":
        return {
          header: "bg-gradient-to-r from-rose-50 to-pink-50",
          tableHeader: "bg-rose-50",
          hoverColor: "hover:bg-rose-50",
          footerColor: "bg-rose-50",
        };
      case "renewal":
        return {
          header: "bg-gradient-to-r from-purple-50 to-pink-50",
          tableHeader: "bg-purple-50",
          hoverColor: "hover:bg-purple-50",
          footerColor: "bg-purple-50",
        };
      default:
        return {
          header: "bg-gradient-to-r from-slate-50 to-sky-50",
          tableHeader: "bg-slate-50",
          hoverColor: "hover:bg-slate-50",
          footerColor: "bg-slate-50",
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <div className="mb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div
          className={`px-8 py-6 ${themeColors.header} border-b border-slate-200`}
        >
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className={themeColors.tableHeader}>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-sm font-semibold text-slate-700 uppercase tracking-wider ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    } ${
                      column.sortable
                        ? "cursor-pointer hover:bg-slate-100 transition-colors"
                        : ""
                    }`}
                    onClick={
                      column.sortable ? () => handleSort(column.key) : undefined
                    }
                  >
                    <div
                      className={`flex items-center ${
                        column.align === "center"
                          ? "justify-center"
                          : column.align === "right"
                          ? "justify-end"
                          : ""
                      }`}
                    >
                      {column.label}
                      {column.sortable && (
                        <SortIcon
                          field={column.key}
                          currentField={sortField}
                          direction={sortDirection}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {sortedData.map((item, index) => (
                <tr
                  key={index}
                  className={`${themeColors.hoverColor} transition-colors duration-200`}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {column.render(item, index)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {footer && (
              <tfoot className={themeColors.footerColor}>{footer}</tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default SortableTable;
