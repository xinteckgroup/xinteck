"use client";

import { updateServiceOrder } from "@/actions/service";
import { useToast } from "@/components/admin/ui/Toast";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Role } from "@prisma/client";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { RoleGate } from "../RoleGate";
import { ServiceSortableItem } from "./ServiceSortableItem";

interface ServiceListProps {
  initialServices: any[];
}

export function ServiceList({ initialServices }: ServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = services.findIndex((item) => item.id === active.id);
      const newIndex = services.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(services, oldIndex, newIndex);

      // Optimistically update UI first
      setServices(newItems);

      // Then persist the order change
      startTransition(async () => {
        try {
          const orderUpdate = newItems.map((item: any, index: number) => ({
            id: item.id,
            sortOrder: index,
          }));
          await updateServiceOrder(orderUpdate);
          toast("Service order updated", "success");
        } catch (error) {
          toast("Failed to save order", "error");
        }
      });
    }
  };

  if (services.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 admin-surface-primary backdrop-blur-xs rounded-[12px] border border-dashed border-[var(--admin-border)] text-center">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full admin-surface-input flex items-center justify-center mb-3 md:mb-4 text-[var(--admin-text)]">
          <Briefcase size={24} className="md:w-8 md:h-8" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-[var(--admin-text)] mb-1 md:mb-2">
          No services found
        </h3>
        <p className="text-xs md:text-sm text-[var(--admin-text)]/50 max-w-sm mx-auto mb-4 md:mb-6">
          Create your first service offering to display on the public site.
        </p>
        <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
            <Link
            href="/admin/services/new"
            className="px-4 py-2 md:px-6 md:py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-[8px] transition-all text-xs md:text-sm"
            >
            Create Service
            </Link>
        </RoleGate>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={services.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid gap-4">
          {services.map((service) => (
            <ServiceSortableItem key={service.id} service={service} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
