"use client";

import type { RoiMode } from "@/types/roi";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";

interface ModeToggleProps {
    mode: RoiMode;
    onChange: (mode: RoiMode) => void;
}

const modes = [
    {
        key: "efficiency" as const,
        label: "Automate & Save",
        icon: BarChart3,
        description: "Cut manual work & reclaim hours",
    },
    {
        key: "revenue" as const,
        label: "Grow Revenue",
        icon: TrendingUp,
        description: "Boost conversions & increase sales",
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
                        className={`relative flex-1 flex items-center gap-3 px-5 py-4 rounded-[10px] border transition-all duration-300 cursor-pointer ${
                            isActive
                                ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="mode-indicator"
                                className="absolute inset-0 rounded-[10px] border-2 border-[#D4AF37]/50"
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                        <div
                            className={`p-2 rounded-lg ${
                                isActive
                                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                                    : "bg-white/10 text-gray-400"
                            }`}
                        >
                            <Icon size={20} />
                        </div>
                        <div className="text-left">
                            <p
                                className={`text-sm font-bold ${
                                    isActive ? "text-[#D4AF37]" : "text-white"
                                }`}
                            >
                                {m.label}
                            </p>
                            <p className="text-xs text-gray-500">
                                {m.description}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

