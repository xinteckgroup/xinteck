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
                    className="admin-modal-root fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-white"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className={`bg-white/30 dark:bg-white/20 backdrop-blur-md transition-colors rounded-[10px] w-full ${maxWidth} max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between bg-transparent shrink-0">
                            <div className="flex flex-col gap-1 min-w-0">
                                <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2 truncate">{title}</h3>
                                {subtitle && <p className="text-[12px] text-[var(--admin-text)] truncate">{subtitle}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-[var(--admin-text)] hover:text-gold transition-colors shrink-0 ml-3"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 overflow-y-auto flex-1 bg-transparent text-[var(--admin-text)]">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="p-4 border-t border-[var(--admin-border)] bg-transparent flex justify-end gap-2 items-center shrink-0">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
