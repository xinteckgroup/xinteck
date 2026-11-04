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
    explanation?: string;
    highlight?: boolean;
}

export function MetricCard({
    label,
    value,
    suffix = "",
    prefix = "",
    isKES = false,
    subtitle,
    explanation,
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
            className={`relative rounded-[10px] border p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between shadow-lg ${
                highlight
                    ? "border-primary/60 bg-primary/15 shadow-primary/10"
                    : "bg-white/30 dark:bg-black/80 border-border/60"
            }`}
        >
            <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-foreground mb-1.5">
                    {label}
                </p>
                <motion.p
                    className={`text-xl sm:text-2xl font-black tracking-tight ${
                        highlight ? "text-primary" : "text-foreground"
                    }`}
                >
                    {displayValue}
                </motion.p>
            </div>
            
            {(subtitle || explanation) && (
                <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-col gap-0.5">
                    {subtitle && (
                        <p className="text-xs font-semibold text-foreground">
                            {subtitle}
                        </p>
                    )}
                    {explanation && (
                        <p className="text-[11px] text-foreground/80 leading-snug">
                            {explanation}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

