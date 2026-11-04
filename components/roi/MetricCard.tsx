"use client";

import { formatKES } from "@/lib/roi-calculator";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface MetricCardProps {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    isKES?: boolean;
    subtitle?: string;
    highlight?: boolean;
}

export function MetricCard({
    label,
    value,
    suffix = "",
    prefix = "",
    isKES = false,
    subtitle,
    highlight = false,
}: MetricCardProps) {
    const springValue = useSpring(0, {
        stiffness: 80,
        damping: 20,
        mass: 1,
    });

    const displayValue = useTransform(springValue, (latest) => {
        if (isKES) return formatKES(latest);
        if (suffix === "%") return `${prefix}${Math.round(latest)}%`;
        if (suffix === " months" || suffix === " mo") return `${prefix}${Math.round(latest)}${suffix}`;
        return `${prefix}${Math.round(latest).toLocaleString("en-KE")}${suffix}`;
    });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    return (
        <div
            className={`relative rounded-[10px] border p-4 md:p-5 backdrop-blur-xl transition-all duration-300 ${
                highlight
                    ? "border-[#D4AF37]/40 bg-[#D4AF37]/5"
                    : "border-white/10 bg-black/60"
            }`}
        >
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                {label}
            </p>
            <motion.p
                className={`text-xl md:text-2xl font-black tracking-tight ${
                    highlight ? "text-[#D4AF37]" : "text-white"
                }`}
            >
                {displayValue}
            </motion.p>
            {subtitle && (
                <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

