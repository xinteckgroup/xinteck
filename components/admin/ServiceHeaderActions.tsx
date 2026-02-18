"use client";

import { RoleGate } from "@/components/admin/RoleGate";
import { Role } from "@prisma/client";
import { Plus } from "lucide-react";
import Link from "next/link";

export function ServiceHeaderActions() {
  return (
    <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
      <Link 
        href="/admin/services/new"
        className="inline-flex items-center justify-center gap-1 md:gap-2 px-3 py-1.5 md:px-6 md:py-3 bg-primary text-primary-foreground font-bold rounded-[10px] hover:bg-primary/80 transition-all shadow-[0_0_20px_-5px_rgba(255,215,0,0.3)] text-[10px] md:text-sm"
      >
        <Plus size={14} className="md:w-[18px] md:h-[18px]" />
        New Service
      </Link>
    </RoleGate>
  );
}
