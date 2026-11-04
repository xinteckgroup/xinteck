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
            className={`relative rounded-[12px] border p-4 sm:p-5 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between ${
                highlight
                    ? "border-primary/60 bg-primary/10 dark:bg-primary/15 shadow-sm"
                    : "bg-white/80 dark:bg-black/75 border-border shadow-sm"
            }`}
        >
            <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
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
                <div className="mt-2.5 pt-2 border-t border-border/50 flex flex-col gap-0.5">
                    {subtitle && (
                        <p className="text-xs font-semibold text-foreground/90">
                            {subtitle}
                        </p>
                    )}
                    {explanation && (
                        <p className="text-[11px] text-muted-foreground leading-snug">
                            {explanation}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

