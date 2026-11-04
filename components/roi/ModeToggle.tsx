"use client";

import type { RoiMode } from "@/types/roi";
import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

interface ModeToggleProps {
    mode: RoiMode;
    onChange: (mode: RoiMode) => void;
}

const modes = [
    {
        key: "efficiency" as const,
        label: "Automate & Save Time",
        icon: Clock,
        description: "Cut manual repetitive work and reclaim productive team hours",
    },
    {
        key: "revenue" as const,
        label: "Grow Sales & Revenue",
        icon: TrendingUp,
        description: "Turn more website or app visitors into paying customers",
    },
];

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
            {modes.map((m) => {
                const isActive = mode === m.key;
                const Icon = m.icon;

                return (
                    <button
                        key={m.key}
                        onClick={() => onChange(m.key)}
                        type="button"
                        className={`relative flex-1 flex items-center gap-3.5 px-5 py-4 rounded-[12px] border transition-all duration-300 text-left cursor-pointer ${
                            isActive
                                ? "border-primary bg-primary/10 shadow-md"
                                : "bg-white/80 dark:bg-black/75 backdrop-blur-xl border-border hover:border-primary/40 hover:bg-white/90 dark:hover:bg-black/90 shadow-sm"
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mode-indicator"
                                className="absolute inset-0 rounded-[12px] border-2 border-primary/60 pointer-events-none"
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                        <div
                            className={`p-2.5 rounded-[10px] shrink-0 transition-colors ${
                                isActive
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            <Icon size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`text-sm font-bold tracking-tight ${
                                    isActive ? "text-primary" : "text-foreground"
                                }`}
                            >
                                {m.label}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                {m.description}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

