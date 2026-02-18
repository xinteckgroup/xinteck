"use client";

import { AuditLogWithUser } from "@/actions/audit";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import { Modal } from "@/components/admin/ui/Modal";
import { Pagination } from "@/components/admin/ui/Pagination";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Copy, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface AuditLogTableProps {
  logs: AuditLogWithUser[];
  currentPage: number;
  totalPages: number;
}

export function AuditLogTable({ logs, currentPage, totalPages }: AuditLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLogWithUser | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Table / Card View */}
      <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] overflow-hidden border border-[var(--admin-border)] shadow-2xl">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-[var(--admin-border)] bg-black/20 dark:bg-white/10">
          <div className="col-span-3 text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">Actor</div>
          <div className="col-span-2 text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">Action</div>
          <div className="col-span-3 text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">Entity</div>
          <div className="col-span-2 text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">Date</div>
          <div className="col-span-2 text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest text-right">Details</div>
        </div>

        {/* Rows */}
        {logs.length === 0 ? (
          <EmptyState
            icon={<Copy size={20} className="opacity-50" />}
            message="No audit logs found matching your criteria."
          />
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="group border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-text)]/5 transition-all duration-300"
            >
              {/* Desktop Row */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  {/* FIXED: Added `relative` so next/image with `fill` stays contained */}
                  <div className="w-8 h-8 rounded-full admin-surface-input flex items-center justify-center text-[var(--admin-text)] text-xs font-black border border-[var(--admin-border)] overflow-hidden relative shrink-0">
                    {log.user?.avatar ? (
                      <Image src={log.user.avatar} alt="User" fill className="rounded-full object-cover" />
                    ) : (
                      <span className="text-gold uppercase">{log.user?.name?.[0] || "?"}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-black text-[var(--admin-text)] truncate leading-tight">
                      {log.user?.name || "System"}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--admin-text)] font-mono truncate uppercase tracking-tighter">
                      {log.user?.email || log.ipAddress || "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap",
                    getActionColor(log.action)
                  )}>
                    {log.action.split('.')[1] || log.action}
                  </span>
                </div>

                <div className="col-span-3 flex flex-col min-w-0">
                  <span className="text-[12px] font-bold font-mono text-[var(--admin-text)] truncate">{log.entity}</span>
                  <span className="text-[10px] text-[var(--admin-text)] font-mono truncate max-w-[150px] uppercase tracking-tighter" title={log.entityId || ""}>
                     {log.entityId}
                  </span>
                </div>

                <div className="col-span-2">
                  <span className="text-[12px] font-bold text-[var(--admin-text)] font-mono whitespace-nowrap">
                    {format(new Date(log.createdAt), "MMM d, HH:mm")}
                  </span>
                </div>

                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="p-2 rounded-[8px] hover:bg-[var(--admin-text)]/5 text-[var(--admin-text)] hover:text-gold transition-all"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Mobile Card */}
              <div className="md:hidden p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      {/* FIXED: Added `relative` for mobile avatar too */}
                      <div className="w-8 h-8 rounded-full admin-surface-input flex items-center justify-center text-[var(--admin-text)] text-xs font-black border border-[var(--admin-border)] overflow-hidden relative shrink-0">
                        {log.user?.avatar ? (
                          <Image src={log.user.avatar} alt="User" fill className="rounded-full object-cover" />
                        ) : (
                          <span className="text-gold uppercase">{log.user?.name?.[0] || "?"}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-black text-[var(--admin-text)]">{log.user?.name || "System"}</div>
                        <div className="text-[10px] font-bold text-[var(--admin-text)] uppercase tracking-tighter whitespace-nowrap">{format(new Date(log.createdAt), "MMM d, HH:mm")}</div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedLog(log)} className="p-2 text-[var(--admin-text)] hover:text-gold transition-all">
                     <Eye size={18} />
                   </button>
                </div>
                <div className="flex flex-wrap gap-2 items-center text-xs">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border text-[10px] shadow-sm",
                      getActionColor(log.action)
                    )}>
                        {log.action}
                    </span>
                    <span className="text-[var(--admin-text)] font-bold">on</span>
                    <span className="font-mono bg-[var(--admin-text)]/5 px-2 py-0.5 rounded-md text-[var(--admin-text)] text-[10px] font-bold border border-[var(--admin-border)]">{log.entity}</span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Pagination Footer — Matches DataGrid / Staff page layout */}
        <div className="p-4 border-t border-[var(--admin-border)] flex flex-col md:flex-row gap-4 items-center justify-between">
            <span className="text-[12px] font-black text-[var(--admin-text)] uppercase tracking-widest">
              Showing Page <span className="text-gold">{currentPage}</span> of <span className="text-gold">{totalPages}</span>
            </span>
            <div className="flex gap-2">
              <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/audit" />
            </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Log Details"
        subtitle={selectedLog?.id}
      >
        {selectedLog && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)]">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">Actor</label>
                <div className="text-sm font-mono font-bold text-[var(--admin-text)]">{selectedLog.user?.email || "System"}</div>
              </div>
              <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)]">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">Timestamp</label>
                <div className="text-sm font-mono font-bold text-[var(--admin-text)]">{format(new Date(selectedLog.createdAt), "PPpp")}</div>
              </div>
            </div>

            <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)]">
              <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-3 opacity-50">Change Metadata</label>
              <div className="admin-surface-input rounded-[10px] p-4 border border-[var(--admin-border)] overflow-x-auto custom-scrollbar">
                <pre className="text-xs font-mono text-green-400 leading-relaxed">
                    {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
            
            <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)] flex justify-between items-center">
              <div>
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">Entity Reference</label>
                <div className="text-xs font-mono font-bold text-[var(--admin-text)]">{selectedLog.entity} : {selectedLog.entityId}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function getActionColor(action: string): string {
  if (action.includes("delete")) return "bg-red-500/10 text-red-500 border-red-500/20";
  if (action.includes("create")) return "bg-green-500/10 text-green-500 border-green-500/20";
  if (action.includes("update")) return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  if (action.includes("login")) return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  if (action.includes("subscribe")) return "bg-gold/10 text-gold border-gold/20";
  return "admin-surface-input text-[var(--admin-text)] border-[var(--admin-border)]";
}
