"use client";

import { exportAuditLogsCsv } from "@/actions/audit";
import { RoleGate } from "@/components/admin/RoleGate";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
import { format, parseISO } from "date-fns";
import { Calendar, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Calendar as CalendarComponent } from "./ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Select } from "./ui/Select";
import { useToast } from "./ui/Toast";

interface AuditFiltersProps {
  entities: string[];
  currentAction?: string;
  currentEntity?: string;
  currentDateFrom?: string;
  currentDateTo?: string;
}

export function AuditFilters({ entities, currentAction, currentEntity, currentDateFrom, currentDateTo }: AuditFiltersProps) {
  const router = useRouter();
  const { error } = useToast();
  const [isPending, startTransition] = useTransition(); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [isExporting, setIsExporting] = useState(false);
  const [dateFromOpen, setDateFromOpen] = useState(false);
  const [dateToOpen, setDateToOpen] = useState(false);

  const buildUrl = (params: Record<string, string | undefined>) => {
    const url = new URLSearchParams();
    const merged = { action: currentAction, entity: currentEntity, dateFrom: currentDateFrom, dateTo: currentDateTo, ...params };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "all") url.set(k, v);
    });
    return `/admin/audit${url.toString() ? `?${url}` : ""}`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await exportAuditLogsCsv({
        action: currentAction,
        entity: currentEntity,
        dateFrom: currentDateFrom,
        dateTo: currentDateTo,
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      error("Export failed: " + e.message);
    } finally {
      setIsExporting(false);
    }
  };

  const actionFilters = [
    { label: "All Events", value: undefined },
    { label: "Inquiries", value: "contact.submission", color: "bg-blue-400" },
    { label: "Logins", value: "login", color: "bg-purple-400" },
    { label: "Creates", value: "create", color: "bg-green-400" },
    { label: "Deletes", value: "delete", color: "bg-red-400" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Action Filters */}
      <div className="flex flex-row items-center gap-1 admin-surface-primary backdrop-blur-xs rounded-[10px] p-1.5 overflow-x-auto w-full md:w-fit no-scrollbar border border-[var(--admin-border)]">
        {actionFilters.map((f, i) => (
          <a
            key={i}
            href={buildUrl({ action: f.value, page: undefined })}
            className={cn(
              "px-3 py-1.5 rounded-[6px] text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5",
              currentAction === f.value || (!currentAction && !f.value)
                ? "bg-gold/90 text-[var(--admin-text)] shadow-md border border-[var(--admin-border)]"
                : "text-[var(--admin-text)]/40 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/10"
            )}
          >
            {f.color && <span className={`w-1.5 h-1.5 rounded-full ${f.color}`} />}
            {f.label}
          </a>
        ))}
      </div>

      {/* Entity + Date Filters */}
      <div className="flex flex-row items-center gap-2 flex-wrap">
        {/* Entity Dropdown */}
          <Select 
            value={currentEntity || "all"}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => router.push(buildUrl({ entity: e.target.value === "all" ? undefined : e.target.value, page: undefined }))}
            options={[
                { value: "all", label: "All Entities" },
                ...entities.map(e => ({ value: e, label: e }))
            ]}
            className="w-auto min-w-[120px] flex items-center gap-1.5 admin-surface-primary backdrop-blur-xs rounded-[10px] px-3 py-2 border border-[var(--admin-border)] h-auto min-h-0 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-none focus:ring-0 [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:text-[var(--admin-text)]"
          />

        {/* Date From */}
        <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 admin-surface-primary backdrop-blur-xs rounded-[10px] px-3 py-2 border border-[var(--admin-border)] text-[var(--admin-text)] text-[10px] md:text-xs font-black uppercase tracking-widest outline-none cursor-pointer bg-transparent min-w-[120px] text-left hover:bg-[var(--admin-text)]/5 transition-colors"
            >
              <Calendar size={14} className="text-[var(--admin-text)]" />
              {currentDateFrom ? format(parseISO(currentDateFrom), "MMM d, yyyy") : "Start Date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-[10px]" align="start">
            <CalendarComponent
              mode="single"
              selected={currentDateFrom ? parseISO(currentDateFrom) : undefined}
              onSelect={(date: Date | undefined) => {
                router.push(buildUrl({ dateFrom: date ? format(date, "yyyy-MM-dd") : undefined, page: undefined }));
                setDateFromOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 admin-surface-primary backdrop-blur-xs rounded-[10px] px-3 py-2 border border-[var(--admin-border)] text-[var(--admin-text)] text-[10px] md:text-xs font-black uppercase tracking-widest outline-none cursor-pointer bg-transparent min-w-[120px] text-left hover:bg-[var(--admin-text)]/5 transition-colors"
            >
               <Calendar size={14} className="text-[var(--admin-text)]" />
               {currentDateTo ? format(parseISO(currentDateTo), "MMM d, yyyy") : "End Date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-[10px]" align="start">
            <CalendarComponent
              mode="single"
              selected={currentDateTo ? parseISO(currentDateTo) : undefined}
              onSelect={(date: Date | undefined) => {
                router.push(buildUrl({ dateTo: date ? format(date, "yyyy-MM-dd") : undefined, page: undefined }));
                setDateToOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Export Button */}
        <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 bg-primary text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest rounded-[10px] hover:bg-gold transition-all shadow-lg shadow-primary/20 whitespace-nowrap",
              isExporting && "opacity-50 cursor-not-allowed grayscale"
            )}
          >
            <Download size={14} />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </RoleGate>
      </div>
    </div>
  );
}
