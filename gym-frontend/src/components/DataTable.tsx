import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Eye, EyeOff, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
};

/**
 * Enhanced data table with pagination, column toggle, sticky headers, and modern UI.
 */
export default function DataTable<T extends { id: string }>({
  data,
  columns,
  rowActions,
  pageSize = 10
}: {
  data: T[];
  columns: Column<T>[];
  rowActions?: (row: T) => React.ReactNode;
  pageSize?: number;
}) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [asc, setAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<Set<keyof T>>(
    new Set(columns.filter(c => c.visible !== false).map(c => c.key))
  );
  const [showColumnToggle, setShowColumnToggle] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const base = q ? data.filter((r) => JSON.stringify(r).toLowerCase().includes(q)) : data;
    if (!sortKey) return base;
    return [...base].sort((a, b) => {
      const av = String(a[sortKey] ?? '');
      const bv = String(b[sortKey] ?? '');
      return asc ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [data, query, sortKey, asc]);

  const visibleCols = columns.filter(c => visibleColumns.has(c.key));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filtered.slice(startIndex, endIndex);

  const toggleColumn = (key: keyof T) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setAsc(!asc);
    } else {
      setSortKey(key);
      setAsc(true);
    }
    setCurrentPage(1);
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            className="input w-full pl-10"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowColumnToggle(!showColumnToggle)}
              className="btn-secondary flex items-center gap-2"
            >
              <MoreHorizontal className="h-4 w-4" />
              Columns
            </button>
            
            <AnimatePresence>
              {showColumnToggle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 z-10"
                >
                  <div className="p-2">
                    {columns.map((col) => (
                      <label key={String(col.key)} className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(col.key)}
                          onChange={() => toggleColumn(col.key)}
                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{col.header}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
              <tr>
                {visibleCols.map((c) => (
                  <th 
                    key={String(c.key)} 
                    className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700"
                    style={{ width: c.width }}
                  >
                    <button
                      className={`inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
                        c.sortable ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      onClick={() => c.sortable && handleSort(c.key)}
                    >
                      {c.header}
                      {c.sortable && sortKey === c.key && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-primary-600 dark:text-primary-400"
                        >
                          {asc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </motion.div>
                      )}
                    </button>
                  </th>
                ))}
                {rowActions && (
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {visibleCols.map((c) => (
                      <td key={String(c.key)} className="px-4 py-3">
                        {c.render ? c.render(row) : (row[c.key] as any)}
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {rowActions(row)}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
              
              {!paginatedData.length && (
                <tr>
                  <td
                    className="px-4 py-12 text-center text-slate-500 dark:text-slate-400"
                    colSpan={visibleCols.length + (rowActions ? 1 : 0)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl">📊</div>
                      <div>No data found</div>
                      {query && <div className="text-sm">Try adjusting your search</div>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-slate-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'bg-primary-600 text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}