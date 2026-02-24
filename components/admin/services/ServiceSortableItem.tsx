"use client";

import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { GripVertical } from "lucide-react";
import { ServiceActions } from "../ServiceActions";

interface ServiceSortableItemProps {
  service: any;
}

export function ServiceSortableItem({ service }: ServiceSortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative backdrop-blur-xs group admin-surface-primary rounded-[12px] p-4 md:p-6 transition-all overflow-hidden",
        isDragging && "border-gold/50 shadow-lg ring-1 ring-gold/20"
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        {/* Drag Handle & Content Wrapper */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1.5 rounded-[6px] text-[var(--admin-text)]/70 hover:text-gold hover:bg-[var(--admin-text)]/5 cursor-grab active:cursor-grabbing transition-colors md:mt-2"
            title="Drag to reorder"
          >
            <GripVertical size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <h3 className="text-base md:text-xl font-bold text-[var(--admin-text)] truncate">
                {service.name}
              </h3>
              <span
                className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                  service.isActive
                    ? "bg-green-500/40 text-green-400 border-green-500/20"
                    : "admin-surface-input text-[var(--admin-text)]/50 border-[var(--admin-border)]"
                )}
              >
                {service.isActive ? "Active" : "Draft"}
              </span>
            </div>
            <p className="text-[var(--admin-text)]/80 text-xs md:text-sm line-clamp-1 max-w-2xl">
              {service.description}
            </p>
            <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-3 text-[10px] md:text-xs text-[var(--admin-text)]/80 font-mono">
              <span>/{service.slug}</span>
              <span>•</span>
              <span>Updated {format(service.updatedAt, "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Actions - Prevent drag events here */}
        <div className="pl-11 md:pl-0" onPointerDown={(e) => e.stopPropagation()}>
          <ServiceActions serviceId={service.id} isActive={service.isActive} />
        </div>
      </div>
    </div>
  );
}
