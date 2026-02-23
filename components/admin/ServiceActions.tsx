"use client";

import { deleteService, toggleServiceStatus } from "@/actions/service";
import { RoleGate } from "@/components/admin/RoleGate";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Role } from "@prisma/client";
import { CheckCircle2, Pencil, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

interface ServiceActionsProps {
  serviceId: string;
  isActive: boolean;
}

export function ServiceActions({ serviceId, isActive }: ServiceActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
      setIsConfirmOpen(false);
      startTransition(async () => { await deleteService(serviceId); });
  };

  return (
    <div className="flex items-center gap-3">
      <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
        <button
          onClick={() => startTransition(async () => { await toggleServiceStatus(serviceId, !isActive); })}
          disabled={isPending}
          className={`w-10 h-10 rounded-[8px] flex items-center justify-center border transition-all disabled:opacity-50 ${isActive ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'admin-surface-input border-[var(--admin-border)] text-[var(--admin-text)]/30 hover:text-[var(--admin-text)]/60 hover:bg-[var(--admin-text)]/5'}`}
          title={isActive ? "Deactivate" : "Activate"}
        >
          {isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        </button>

        <Link
          href={`/admin/services/${serviceId}`}
          className="w-10 h-10 rounded-[8px] admin-surface-input border border-[var(--admin-border)] flex items-center justify-center text-[var(--admin-text)]/60 hover:text-gold hover:bg-[var(--admin-text)]/5 transition-all"
          title="Edit"
        >
          <Pencil size={18} />
        </Link>

        <button
          onClick={() => setIsConfirmOpen(true)}
          disabled={isPending}
          className="w-10 h-10 rounded-[8px] bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </RoleGate>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Service"
        description="Are you absolutely sure you want to delete this service? This assumes you have already removed it from active projects and clients."
        confirmText="Delete"
        isDestructive={true}
        isLoading={isPending}
      />
    </div>
  );
}
