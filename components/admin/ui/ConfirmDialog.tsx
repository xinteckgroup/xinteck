"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
    destructive?: boolean;
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message,
    confirmLabel = "Confirm",
    loading,
    destructive = true,
}: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title={title}
            maxWidth="max-w-sm"
            footer={
                <>
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        variant={destructive ? "destructive" : "primary"}
                        size="sm"
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col items-center gap-4 text-center py-2">
                {destructive && (
                    <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertTriangle size={24} className="text-red-400" />
                    </div>
                )}
                <p className="text-sm text-[var(--admin-text)]/70">{message}</p>
            </div>
        </Modal>
    );
}
