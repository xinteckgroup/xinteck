"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, X, XCircle } from "lucide-react";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ 
    toast: () => {},
    success: () => {},
    error: () => {},
    info: () => {}
});

export function useToast() {
    return useContext(ToastContext);
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "success") => {
        const id = nextId++;
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
    const error = useCallback((message: string) => addToast(message, "error"), [addToast]);
    const info = useCallback((message: string) => addToast(message, "info"), [addToast]);

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const icons: Record<ToastType, ReactNode> = {
        success: <CheckCircle size={16} className="text-green-400 shrink-0" />,
        error: <XCircle size={16} className="text-red-400 shrink-0" />,
        info: <Info size={16} className="text-blue-400 shrink-0" />,
    };

    const borderColors: Record<ToastType, string> = {
        success: "border-green-500/30",
        error: "border-destructive/30",
        info: "border-blue-500/30",
    };

    return (
        <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-[10px] bg-[var(--admin-background)]/90 border ${borderColors[t.type]} shadow-xl backdrop-blur-md min-w-[250px] max-w-[400px]`}
                        >
                            {icons[t.type]}
                            <span className="text-xs text-[var(--admin-text)] flex-1">{t.message}</span>
                            <button onClick={() => removeToast(t.id)} className="text-[var(--admin-muted)]/60 hover:text-[var(--admin-text)] shrink-0">
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
