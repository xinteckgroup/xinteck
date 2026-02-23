"use client";

import { Modal } from "@/components/admin/ui/Modal";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 p-4 admin-surface-primary backdrop-blur-xs rounded-[12px] border border-[var(--admin-border)]">
          <div className={cn(
            "p-3 rounded-full shrink-0",
            isDestructive ? "bg-red-500/10 text-red-500" : "bg-gold/10 text-gold"
          )}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-[var(--admin-text)]/80 leading-relaxed font-bold">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--admin-border)] pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-[12px] font-black uppercase tracking-widest text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 border border-transparent hover:border-[var(--admin-border)] rounded-[8px] transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 text-[12px] font-black uppercase tracking-widest rounded-[8px] transition-all disabled:opacity-50 whitespace-nowrap",
              isDestructive 
                ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20" 
                : "bg-primary text-[var(--admin-text)] hover:bg-gold shadow-lg shadow-primary/20"
            )}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
