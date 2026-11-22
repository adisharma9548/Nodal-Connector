import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptySubtext?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    totalItems?: number;
  };
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found',
  emptySubtext = 'Try adjusting your search filters or check back later.',
  pagination,
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  return (
    <div
      className={`bg-[var(--card-bg)] border border-[var(--border-default)] rounded-[14px] overflow-hidden shadow-xs ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--table-header-bg)] border-b border-[var(--border-default)] text-[11px] font-heading font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {columns.map((col) => (
                <th key={col.key} className={`py-3 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-default)] text-xs font-ui font-medium text-[var(--text-primary)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={`skel-row-${rIdx}`} className="animate-pulse">
                  {columns.map((col, cIdx) => (
                    <td key={`skel-cell-${rIdx}-${cIdx}`} className="py-3.5 px-4">
                      <div className="h-3.5 bg-[var(--table-header-bg)] rounded-[6px] w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-9 h-9 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-secondary)]">
                      <Inbox className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-heading font-semibold text-[var(--text-primary)]">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-body max-w-sm">
                      {emptySubtext}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowKey = keyExtractor(item, index);
                const isClickable = !!onRowClick;
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`transition-colors even:bg-[var(--table-row-zebra)] hover:bg-[var(--table-row-hover)] ${
                      isClickable ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td key={`${rowKey}-${col.key}`} className={`py-3 px-4 ${col.className || ''}`}>
                        {col.render ? col.render(item, index) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="py-2.5 px-4 flex items-center justify-between border-t border-[var(--border-default)] text-xs font-ui text-[var(--text-secondary)]">
          <div>
            {pagination.totalItems !== undefined ? (
              <span>
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
              </span>
            ) : (
              <span>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage <= 1}
              aria-label="Previous Page"
              className="p-1 rounded-[8px] border border-[var(--border-default)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-heading font-semibold text-[var(--text-primary)]">
              {pagination.currentPage}
            </span>
            <button
              onClick={() =>
                pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))
              }
              disabled={pagination.currentPage >= pagination.totalPages}
              aria-label="Next Page"
              className="p-1 rounded-[8px] border border-[var(--border-default)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer outline-none focus-visible:outline-[var(--focus-ring)]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
