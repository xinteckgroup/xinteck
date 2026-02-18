"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
}

export function Modal({ open, onClose, title, subtitle, children, footer, maxWidth = "max-w-lg" }: ModalProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = ""; };
        }
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--admin-background)]/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`admin-surface-floating rounded-[16px] w-full ${maxWidth} relative overflow-hidden flex flex-col max-h-[90vh]`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 md:p-6 border-b border-[var(--admin-border)] admin-surface-secondary shrink-0 rounded-none">
                            <div className="flex flex-col gap-1 min-w-0">
                                <h3 className="text-lg md:text-xl font-bold text-[var(--admin-text)] truncate">{title}</h3>
                                {subtitle && <p className="text-xs text-[var(--admin-muted)] font-mono truncate">{subtitle}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors admin-surface-input p-2 rounded-full shrink-0 ml-3"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 md:p-6 overflow-y-auto flex-1">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex justify-end gap-2 p-4 md:p-6 pt-0 border-t border-[var(--admin-border)] shrink-0">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
