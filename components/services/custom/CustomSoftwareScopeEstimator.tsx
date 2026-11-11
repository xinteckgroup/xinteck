"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { formatKES } from "@/lib/roi-calculator";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Calculator,
    Check,
    CheckCircle2,
    Clock,
    Database,
    DollarSign,
    FileCheck,
    Layers,
    Lock,
    QrCode,
    ShieldCheck,
    Sparkles,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface SoftwareModule {
    id: string;
    label: string;
    description: string;
    cost: number;
    days: number;
    popular?: boolean;
}

const BASE_SYSTEM = {
    title: "Core Enterprise Database Engine",
    description: "PostgreSQL schema, secure authentication, API architecture & cloud hosting setup",
    cost: 250_000,
    days: 20,
};

const SOFTWARE_MODULES: SoftwareModule[] = [
    {
        id: "inventory",
        label: "Multi-Branch Inventory & POS",
        description: "Real-time stock sync across multiple stores with barcode scanner support",
        cost: 80_000,
        days: 5,
        popular: true,
    },
    {
        id: "etims",
        label: "KRA eTIMS Automated Invoicing",
        description: "Automated tax compliance, QR generation & direct KRA VSCU API integration",
        cost: 65_000,
        days: 4,
        popular: true,
    },
    {
        id: "mpesa",
        label: "Daraja M-Pesa STK & B2C Payouts",
        description: "Automated payment prompt to customer phone & instant vendor/staff payouts",
        cost: 55_000,
        days: 4,
        popular: true,
    },
    {
        id: "rbac",
        label: "Granular Role Permissions (RBAC)",
        description: "Branch manager, cashier & executive roles with strict audit event logs",
        cost: 40_000,
        days: 3,
    },
    {
        id: "whatsapp",
        label: "Automated WhatsApp Alerts",
        description: "Instant order receipts, dispatch updates & low stock alerts to manager phones",
        cost: 35_000,
        days: 3,
    },
    {
        id: "offline",
        label: "Offline-First Local POS Sync",
        description: "Cashiers continue ringing up sales during internet cuts; auto-syncs when online",
        cost: 60_000,
        days: 4,
    },
];

export function CustomSoftwareScopeEstimator() {
    const [selectedModules, setSelectedModules] = useState<string[]>([
        "inventory",
        "etims",
        "mpesa",
    ]);

    const toggleModule = (id: string) => {
        setSelectedModules((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const { totalEstimatedCost, totalEstimatedWeeks } = useMemo(() => {
        let cost = BASE_SYSTEM.cost;
        let days = BASE_SYSTEM.days;

        SOFTWARE_MODULES.forEach((mod) => {
            if (selectedModules.includes(mod.id)) {
                cost += mod.cost;
                days += mod.days;
            }
        });

        const weeks = Math.ceil(days / 5);
        return { totalEstimatedCost: cost, totalEstimatedWeeks: weeks };
    }, [selectedModules]);

    const bookHref = `/book?service=Custom+Software+Development&budget=${encodeURIComponent(
        `KES ${totalEstimatedCost.toLocaleString("en-KE")}`
    )}`;

    return (
        <section id="scope-estimator" className="px-6 py-8 md:py-16 scroll-mt-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Interactive Systems Planner
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ESTIMATE YOUR CUSTOM SOFTWARE INVESTMENT.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Select the operational modules your company needs. Get instant cost transparency and clear deployment timelines.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Modules Checklist (8 cols) */}
                    <div className="lg:col-span-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-2xl flex flex-col gap-5">
                        {/* Base Core Banner */}
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                                    <Database size={22} />
                                </div>
                                <div>
                                    <h4 className="text-sm md:text-base font-bold text-foreground">{BASE_SYSTEM.title}</h4>
                                    <p className="text-xs text-foreground/75 font-medium">{BASE_SYSTEM.description}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-[6px] font-mono shrink-0">
                                {formatKES(BASE_SYSTEM.cost)}
                            </span>
                        </div>

                        {/* Interactive Modules */}
                        <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                            {SOFTWARE_MODULES.map((mod) => {
                                const active = selectedModules.includes(mod.id);
                                return (
                                    <button
                                        key={mod.id}
                                        type="button"
                                        onClick={() => toggleModule(mod.id)}
                                        className={`p-4 rounded-[10px] text-left transition-all cursor-pointer border flex flex-col justify-between gap-3 ${
                                            active
                                                ? "bg-primary/20 border-primary shadow-sm"
                                                : "bg-muted/10 border-transparent hover:border-border text-foreground"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span
                                                className={`text-sm font-bold leading-tight ${
                                                    active ? "text-primary" : "text-foreground"
                                                }`}
                                            >
                                                {mod.label}
                                            </span>
                                            <div
                                                className={`w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0 border transition-colors ${
                                                    active
                                                        ? "bg-primary border-primary text-black"
                                                        : "border-border/60 bg-background/50"
                                                }`}
                                            >
                                                {active && <Check size={14} className="stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-xs text-foreground/75 font-medium leading-snug">
                                            {mod.description}
                                        </p>
                                        <div className={`text-xs font-black pt-2 border-t border-border/30 flex items-center justify-between ${active ? "text-primary" : "text-foreground/70"}`}>
                                            <span className="text-[11px] font-semibold text-foreground/60">Module Scope</span>
                                            <span>+{formatKES(mod.cost)}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Cost Summary Card (4 cols) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <motion.div
                            layout
                            className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-xl border border-primary/30 flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Calculator size={18} className="text-primary" />
                                    <span className="font-bold text-sm text-foreground">Software Scope Receipt</span>
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                    Full IP Ownership
                                </span>
                            </div>

                            {/* Base */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground/80 font-medium">Core Enterprise Backend</span>
                                <span className="font-bold text-foreground">{formatKES(BASE_SYSTEM.cost)}</span>
                            </div>

                            {/* Selected Modules */}
                            {selectedModules.length > 0 && (
                                <div className="flex flex-col gap-2 py-2 border-y border-border/40 text-xs">
                                    <span className="text-[10px] uppercase font-bold text-foreground/60">
                                        Custom Integrations ({selectedModules.length})
                                    </span>
                                    {selectedModules.map((id) => {
                                        const mod = SOFTWARE_MODULES.find((m) => m.id === id);
                                        if (!mod) return null;
                                        return (
                                            <div key={id} className="flex items-center justify-between text-foreground/70">
                                                <span className="truncate pr-2">{mod.label}</span>
                                                <span className="font-semibold text-foreground/90 shrink-0">
                                                    +{formatKES(mod.cost)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="flex items-center justify-between p-3 rounded-[8px] bg-white/40 dark:bg-zinc-900/60 border border-border/40">
                                <div className="flex items-center gap-2 text-xs text-foreground/80">
                                    <Clock size={16} className="text-primary" />
                                    <span>Deployment Timeline</span>
                                </div>
                                <span className="text-sm font-black text-primary">
                                    {totalEstimatedWeeks} Weeks
                                </span>
                            </div>

                            {/* Grand Total */}
                            <div className="flex flex-col gap-1 pt-2">
                                <span className="text-xs text-foreground/70 uppercase font-bold">Total Estimated Budget</span>
                                <span className="text-3xl font-black text-primary tracking-tight">
                                    {formatKES(totalEstimatedCost)}
                                </span>
                                <span className="text-[11px] text-foreground/60">
                                    Milestone-based billing: 40% Kick-off · 30% Staging · 30% Go-Live
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={bookHref}
                                className={`${TYPOGRAPHY.button} w-full py-3.5 bg-primary text-black font-extrabold rounded-[8px] shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm`}
                            >
                                <span>Discuss System Scope</span>
                                <ArrowRight size={16} />
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-foreground/60 text-center">
                                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                <span>Includes 90-day bug warranty & on-site staff training</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

