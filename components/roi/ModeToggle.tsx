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
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            {modes.map((m) => {
                const isActive = mode === m.key;
                const Icon = m.icon;

                return (
                    <button
                        key={m.key}
                        onClick={() => onChange(m.key)}
                        type="button"
                        className={`relative flex-1 flex items-center gap-4 p-5 md:p-6 rounded-[10px] transition-all duration-300 text-left cursor-pointer bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg border ${
                            isActive
                                ? "border-primary ring-2 ring-primary/40 bg-primary/10"
                                : "border-transparent hover:border-primary/40 hover:bg-white/40 dark:hover:bg-black/90"
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mode-indicator"
                                className="absolute inset-0 rounded-[10px] border-2 border-primary pointer-events-none"
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                        <div className="w-12 h-12 rounded-[10px] bg-background/80 shrink-0 flex items-center justify-center text-primary">
                            <Icon size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span
                                className={`text-base font-bold tracking-tight ${
                                    isActive ? "text-primary" : "text-foreground"
                                }`}
                            >
                                {m.label}
                            </span>
                            <span className="text-xs text-foreground/80 font-medium mt-1 leading-snug">
                                {m.description}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

