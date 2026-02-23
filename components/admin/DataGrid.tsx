"use client";

import { ConfirmDialog } from "@/components/admin/ui";
import { Pagination } from "@/components/admin/ui/Pagination";
import { TYPOGRAPHY } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { Edit, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataGridProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: {
    onEdit?: (id: string) => void;
    onDelete?: (id: string[]) => void;
    onView?: (id: string) => void;
  };
  selectable?: boolean;
  editUrl?: string; // Optional URL pattern for edit links if onEdit not used
  hideSearch?: boolean; // Hide internal search bar if parent has its own
  hideBulkActions?: boolean; // Hide bulk action buttons (delete)
  searchPlaceholder?: string; // Customizable placeholder text
}

export interface PaginationConfig {
  page: number;
  totalPages: number;
  total?: number;
  onPageChange: (page: number) => void;
}

export function DataGrid<T extends { id: string }>({ 
  columns, 
  data, 
  actions, 
  selectable = true, 
  editUrl, 
  hideSearch = false, 
  hideBulkActions = false, 
  searchPlaceholder, 
  selectedIds, 
  onSelectionChange, 
  pagination 
}: DataGridProps<T> & { selectedIds?: string[], onSelectionChange?: (ids: string[]) => void, pagination?: PaginationConfig }) {
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>([]);
  
  // Use controlled state if provided, otherwise internal
  const selectedItems = selectedIds || internalSelectedItems;
  const setSelectedItems = (ids: string[]) => {
      if (onSelectionChange) {
          onSelectionChange(ids);
      } else {
          setInternalSelectedItems(ids);
      }
  };

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter Data (Client-side only if not server paginated)
  const isServerSide = !!pagination;

  const filteredData = isServerSide ? data : data.filter((row: any) => 
     Object.values(row).some(val => 
        String(val).toLowerCase().includes(search.toLowerCase())
     )
  );

  // Pagination Logic
  const totalPages = isServerSide ? pagination.totalPages : Math.ceil(filteredData.length / itemsPerPage);
  const displayedPage = isServerSide ? pagination.page : currentPage;
  
  const paginatedData = isServerSide ? filteredData : filteredData.slice(
     (currentPage - 1) * itemsPerPage,
     currentPage * itemsPerPage
  );

  const toggleSelect = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const toggleAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(row => row.id));
    }
  };

  const isAllSelected = paginatedData.length > 0 && selectedItems.length === paginatedData.length;
  const onDelete = actions?.onDelete;

  const showToolbar = !hideSearch || (!hideBulkActions && onDelete);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[] | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* Actions Bar */}
      {showToolbar && (
        <div className="w-auto inline-flex items-center gap-2 bg-[var(--admin-surface-primary)] backdrop-blur-xl p-2 rounded-[10px] self-start border border-[var(--admin-border)] shadow-xl">
          {!hideSearch && (
            <div className="relative w-full md:w-64 lg:w-96 block bg-[var(--admin-surface-input)] rounded-[10px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                <input 
                  type="text" 
                  placeholder={searchPlaceholder || "Search records..."} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    "w-full bg-transparent border border-transparent rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors",
                    TYPOGRAPHY.input
                  )}
                />
              </div>
            </div>
          )}
          
          {onDelete && !hideBulkActions && (
            <button 
              onClick={() => selectedItems.length > 0 && setConfirmDeleteIds(selectedItems)}
              disabled={selectedItems.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-red-500/60 border border-red-500/20 rounded-[8px] text-[var(--admin-text)] hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={16} />
              <span className={cn("hidden md:inline text-xs font-black uppercase tracking-widest")}>Delete</span>
            </button>
          )}
        </div>
      )}
      
      <ConfirmDialog 
        open={!!confirmDeleteIds} 
        onClose={() => setConfirmDeleteIds(null)}
        onConfirm={() => {
          if (confirmDeleteIds && onDelete) {
            onDelete(confirmDeleteIds);
            setSelectedItems([]);
            setConfirmDeleteIds(null);
          }
        }}
        title={`Delete ${confirmDeleteIds?.length} item${confirmDeleteIds?.length === 1 ? '' : 's'}?`}
        message="This action cannot be undone. Selected items will be permanently removed."
      />

      {/* Data Table */}
      <div className="bg-[var(--admin-surface-primary)] backdrop-blur-xl rounded-[10px] overflow-hidden border border-[var(--admin-border)] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0000000a] dark:bg-[#ffffff05] border-b border-[var(--admin-border)] text-[var(--admin-text)]">
              <tr>
                <th className="p-4 w-10">
                  <div className="w-4 h-4 rounded-[4px] border border-[var(--admin-border)] bg-[var(--admin-surface-input)] flex items-center justify-center cursor-pointer" onClick={toggleAll}>
                    {isAllSelected && <div className="w-2 h-2 bg-[var(--admin-brand)] rounded-[2px]" />}
                  </div>
                </th>
                {columns.map((col) => (
                  <th key={col.key} className={cn("p-4 text-left whitespace-nowrap", TYPOGRAPHY.tableHeader)}>
                    {col.label}
                  </th>
                ))}
                <th className={cn("p-4 text-right whitespace-nowrap", TYPOGRAPHY.tableHeader)}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {paginatedData.map((row: any) => (
                <tr key={row.id} className="hover:bg-[var(--admin-text)]/5 transition-colors group">
                  <td className="p-4">
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-[4px] border bg-[var(--admin-surface-input)] flex items-center justify-center cursor-pointer",
                        selectedItems.includes(row.id) ? 'border-primary' : 'border-[var(--admin-border)]'
                      )}
                      onClick={() => toggleSelect(row.id)}
                    >
                      {selectedItems.includes(row.id) && <div className="w-2 h-2 bg-[var(--admin-brand)] rounded-[2px]" />}
                    </div>
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-xs md:text-sm text-[var(--admin-text)] font-bold whitespace-nowrap">
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editUrl ? (
                        <Link href={`${editUrl}/${row.id}`}>
                          <button className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded-[6px] text-[var(--admin-text)] hover:text-gold transition-all">
                            <Edit size={16} />
                          </button>
                        </Link>
                      ) : actions?.onEdit && (
                        <button 
                          onClick={() => actions.onEdit!(row.id)}
                          className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded-[6px] text-[var(--admin-text)] hover:text-gold transition-all"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => setConfirmDeleteIds([row.id])}
                          className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded-[6px] text-[var(--admin-text)] hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--admin-border)] flex flex-col md:flex-row gap-4 items-center justify-between">
          {isServerSide ? (
            <span className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">
              Showing Page <span className="text-gold">{displayedPage}</span> of <span className="text-gold">{totalPages}</span> (Total <span className="font-black">{pagination.total || 'Unknown'}</span>)
            </span>
          ) : (
            <span className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">
              Showing <span className="text-gold">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredData.length)}</span> to <span className="text-gold">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-black">{filteredData.length}</span> results
            </span>
          )}
          
          <div className="flex gap-2">
            {isServerSide ? (
              <Pagination 
                currentPage={displayedPage}
                totalPages={totalPages}
                onPageChange={pagination.onPageChange}
              />
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-[6px] text-[12px] font-black uppercase tracking-widest border transition-all bg-[var(--admin-surface-input)] text-[var(--admin-text)] border-[var(--admin-border)] hover:bg-gold hover:text-[var(--admin-primary-foreground)] hover:border-gold/30 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-[6px] text-[12px] font-black uppercase tracking-widest border transition-all bg-[var(--admin-surface-input)] text-[var(--admin-text)] border-[var(--admin-border)] hover:bg-gold hover:text-[var(--admin-primary-foreground)] hover:border-gold/30 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
