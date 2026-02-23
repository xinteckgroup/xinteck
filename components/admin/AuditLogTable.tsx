"use client";

import { AuditLogWithUser, deleteAuditLogs } from "@/actions/audit";
import { DataGrid } from "@/components/admin/DataGrid";
import { Modal } from "@/components/admin/ui/Modal";
import { useToast } from "@/components/admin/ui/Toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface AuditLogTableProps {
  logs: AuditLogWithUser[];
  currentPage: number;
  totalPages: number;
}

export function AuditLogTable({ logs, currentPage, totalPages }: AuditLogTableProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const [isPending, startTransition] = useTransition();
  const [selectedLog, setSelectedLog] = useState<AuditLogWithUser | null>(null);

  const handleDelete = (ids: string[]) => {
    startTransition(async () => {
      try {
        const res = await deleteAuditLogs(ids);
        if (!res.success) {
            error("Failed to delete records");
            return;
        }
        success(`${ids.length} record(s) deleted successfully.`);
        router.refresh();
      } catch (e: any) {
        error("Failed to delete log: " + e.message);
      }
    });
  };

  const columns = [
    {
      key: "actor",
      label: "Actor",
      render: (log: AuditLogWithUser) => (
        <div className="flex items-center gap-3">
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
      )
    },
    {
      key: "action",
      label: "Action",
      render: (log: AuditLogWithUser) => (
          <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap",
            getActionColor(log.action)
          )}>
            {log.action.split('.')[1] || log.action}
          </span>
      )
    },
    {
      key: "entity",
      label: "Entity Target",
      render: (log: AuditLogWithUser) => (
        <div className="flex flex-col min-w-0">
          <span className="text-[12px] font-bold font-mono text-[var(--admin-text)] truncate">{log.entity}</span>
          <span className="text-[10px] text-[var(--admin-text)] font-mono truncate max-w-[150px] uppercase tracking-tighter" title={log.entityId || ""}>
             {log.entityId}
          </span>
        </div>
      )
    },
    {
      key: "date",
      label: "Timestamp",
      render: (log: AuditLogWithUser) => (
          <span className="text-[12px] font-bold text-[var(--admin-text)] font-mono whitespace-nowrap">
            {format(new Date(log.createdAt), "MMM d, HH:mm")}
          </span>
      )
    },
    {
      key: "actions",
      label: "",
      align: "right" as const,
      render: (log: AuditLogWithUser) => (
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
            className="p-2 rounded-[8px] hover:bg-[var(--admin-text)]/5 text-[var(--admin-text)] hover:text-gold transition-all"
            title="View Raw Log"
          >
            <Eye size={16} />
          </button>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Table Layer using Standard DataGrid */}
      <div className="rounded-[12px] overflow-hidden shadow-2xl relative">
        {/* We use an overlay if a transition is pending so we don't duplicate state locally */}
        {isPending && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
        <DataGrid 
            columns={columns}
            data={logs}
            hideSearch={true}
            actions={{
                // Explicitly gating delete behind Super Admin
                onDelete: (ids: string[]) => handleDelete(ids)
            }}
            pagination={{
                page: currentPage,
                totalPages: totalPages,
                onPageChange: (p) => {
                    const url = new URL(window.location.href);
                    url.searchParams.set("page", p.toString());
                    router.push(url.pathname + url.search)
                }
            }}
        />
      </div>

      {/* Extreme Detail Modal */}
      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Dossier"
        subtitle={`Log ID: ${selectedLog?.id}`}
      >
        {selectedLog && (
          <div className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)] flex flex-col justify-center">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">Identity Actor</label>
                <div className="text-sm font-mono font-bold text-[var(--admin-text)] truncate" title={selectedLog.user?.email || "System/Anonymous"}>
                    {selectedLog.user?.email || "System/Anonymous"}
                </div>
              </div>
              <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)] flex flex-col justify-center">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">Timestamp (UTC)</label>
                <div className="text-sm font-mono font-bold text-[var(--admin-text)] truncate">{format(new Date(selectedLog.createdAt), "PPpp")}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)] flex flex-col justify-center min-w-0">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">Network Origin (IP)</label>
                <div className="text-[11px] font-mono font-bold text-[var(--admin-text)] text-gold truncate" title={selectedLog.ipAddress || "N/A"}>
                    {selectedLog.ipAddress || "N/A"}
                </div>
              </div>
              <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)] flex flex-col justify-center min-w-0">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-2 opacity-50">User Agent</label>
                <div className="text-[10px] font-mono font-bold text-[var(--admin-text)] truncate uppercase tracking-tighter" title={selectedLog.userAgent || "Unknown"}>
                    {selectedLog.userAgent?.substring(0, 45)}{selectedLog.userAgent && selectedLog.userAgent.length > 45 ? "..." : ""}
                    {!selectedLog.userAgent && "Unknown"}
                </div>
              </div>
            </div>

            <div className="admin-surface-primary backdrop-blur-xs p-4 rounded-[12px] border border-[var(--admin-border)]">
              <div className="flex items-center justify-between mb-3 border-b border-[var(--admin-border)] pb-2">
                <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block opacity-50">Entity Target</label>
                <div className="text-xs font-mono font-bold text-[var(--admin-text)] text-right">
                    <span className="text-gold">{selectedLog.entity}</span> <br/> 
                    <span className="text-[10px] opacity-60 uppercase">{selectedLog.entityId}</span>
                </div>
              </div>
              <label className="text-[10px] uppercase text-[var(--admin-text)] font-black tracking-widest block mb-3 opacity-50 mt-4">Payload Difference / Metadata</label>
              <div className="admin-surface-input rounded-[10px] p-4 border border-[var(--admin-border)] overflow-x-auto custom-scrollbar">
                <pre className="text-xs font-mono text-green-400 leading-relaxed tabular-nums">
                    {JSON.stringify(selectedLog.metadata || {}, null, 2)}
                </pre>
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
