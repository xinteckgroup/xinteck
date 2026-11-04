"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { formatKES } from "@/lib/roi-calculator";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowRight,
    Calculator,
    Check,
    CheckCircle2,
    Clock,
    Cloud,
    Cpu,
    Database,
    DollarSign,
    Lock,
    Server,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface CloudTier {
    id: string;
    title: string;
    scope: string;
    description: string;
    cost: number;
    days: number;
}

interface CloudAddon {
    id: string;
    label: string;
    description: string;
    cost: number;
    days: number;
    popular?: boolean;
}

const CLOUD_TIERS: CloudTier[] = [
    {
        id: "container",
        title: "Docker Cloud Modernization",
        scope: "Single/Dual VPS Architecture",
        description: "Containerize web and API services, secure Nginx reverse proxy, automated SSL & Git deployments",
        cost: 120_000,
        days: 10,
    },
    {
        id: "cluster",
        title: "Kubernetes & Autoscaling Cluster",
        scope: "High-Traffic Multi-Node Setup",
        description: "Elastic load balancing, horizontal pod autoscaling, Redis caching & isolated database VPC",
        cost: 220_000,
        days: 20,
    },
    {
        id: "enterprise",
        title: "Multi-Region Enterprise Cloud",
        scope: "Mission-Critical 99.99% Uptime",
        description: "Multi-cloud redundancy (AWS + DigitalOcean), active-active database replication & SOC2 hardening",
        cost: 340_000,
        days: 30,
    },
];

const CLOUD_ADDONS: CloudAddon[] = [
    {
        id: "cicd",
        label: "Automated GitHub Actions CI/CD Pipeline",
        description: "Automated test suites, image building, and 60-second zero-downtime production rolling deploys",
        cost: 45_000,
        days: 3,
        popular: true,
    },
    {
        id: "monitoring",
        label: "24/7 Grafana & WhatsApp Alerting",
        description: "Real-time CPU/RAM/latency telemetry with instant incident push notifications to engineering leads",
        cost: 40_000,
        days: 3,
        popular: true,
    },
    {
        id: "waf",
        label: "Cloudflare Enterprise WAF & DDoS Shield",
        description: "Web application firewall rules, rate limiting, and bot traffic protection at global edge nodes",
        cost: 35_000,
        days: 2,
    },
    {
        id: "dr",
        label: "Disaster Recovery Standby & Daily Backups",
        description: "Automated encrypted database snapshots pushed to an off-site secondary cloud provider",
        cost: 50_000,
        days: 4,
    },
];

export function CloudScopeEstimator() {
    const [selectedTier, setSelectedTier] = useState<string>("cluster");
    const [selectedAddons, setSelectedAddons] = useState<string[]>([
        "cicd",
        "monitoring",
    ]);

    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const currentTier =
        CLOUD_TIERS.find((t) => t.id === selectedTier) || CLOUD_TIERS[1];

    const { totalCloudCost, totalCloudWeeks } = useMemo(() => {
        let cost = currentTier.cost;
        let days = currentTier.days;

        CLOUD_ADDONS.forEach((a) => {
            if (selectedAddons.includes(a.id)) {
                cost += a.cost;
                days += a.days;
            }
        });

        const weeks = Math.ceil(days / 5);
        return { totalCloudCost: cost, totalCloudWeeks: weeks };
    }, [currentTier, selectedAddons]);

    const bookHref = `/book?service=Cloud+%26+DevOps&budget=${encodeURIComponent(
        `KES ${totalCloudCost.toLocaleString("en-KE")}`
    )}`;

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        DevOps Project Estimator
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ESTIMATE YOUR CLOUD ARCHITECTURE SCOPE.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Choose your target infrastructure scale and reliability guarantees. Fixed scope, zero unexpected hourly consulting bills.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Tiers & Add-ons (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* 1. Base Tier */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 1: Select Infrastructure Scale
                            </span>
                            <div className="grid sm:grid-cols-3 gap-3 mt-1">
                                {CLOUD_TIERS.map((tier) => (
                                    <button
                                        key={tier.id}
                                        onClick={() => setSelectedTier(tier.id)}
                                        className={`p-4 rounded-[8px] text-left transition-all border flex flex-col justify-between gap-3 ${
                                            selectedTier === tier.id
                                                ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                                                : "bg-white/40 dark:bg-zinc-900/40 border-border/50 hover:border-foreground/30"
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-xs md:text-sm text-foreground">{tier.title}</h4>
                                                {selectedTier === tier.id && (
                                                    <Check size={16} className="text-primary font-black shrink-0" />
                                                )}
                                            </div>
                                            <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block">
                                                {tier.scope}
                                            </span>
                                            <p className="text-xs text-foreground/70 mt-2 leading-relaxed">
                                                {tier.description}
                                            </p>
                                        </div>
                                        <div className="text-xs font-black text-primary pt-2 border-t border-border/30">
                                            {formatKES(tier.cost)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Add-ons */}
                        <div className="flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 shadow-lg border border-border/50">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Step 2: High-Availability & DevOps Pipelines
                            </span>
                            <div className="grid sm:grid-cols-2 gap-3 mt-1">
                                {CLOUD_ADDONS.map((addon) => {
                                    const active = selectedAddons.includes(addon.id);
                                    return (
                                        <button
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={`p-4 rounded-[8px] text-left transition-all border flex items-start gap-3 ${
                                                active
                                                    ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                                                    : "bg-white/40 dark:bg-zinc-900/40 border-border/50 hover:border-foreground/30"
                                            }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-[4px] mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                                    active
                                                        ? "bg-primary border-primary text-black"
                                                        : "border-border/80 bg-background"
                                                }`}
                                            >
                                                {active && <Check size={14} className="font-black" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-foreground">
                                                        {addon.label}
                                                    </span>
                                                    <span className="text-xs font-black text-primary">
                                                        +{formatKES(addon.cost)}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-foreground/70 mt-0.5 leading-snug">
                                                    {addon.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary Card (4 cols) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <motion.div
                            layout
                            className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-xl border border-primary/30 flex flex-col gap-5"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-border/50">
                                <div className="flex items-center gap-2">
                                    <Calculator size={18} className="text-primary" />
                                    <span className="font-bold text-sm text-foreground">Cloud Setup Estimate</span>
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                    Zero Lock-In
                                </span>
                            </div>

                            {/* Base */}
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-foreground/80 font-medium">{currentTier.title}</span>
                                <span className="font-bold text-foreground">{formatKES(currentTier.cost)}</span>
                            </div>

                            {/* Addons List */}
                            {selectedAddons.length > 0 && (
                                <div className="flex flex-col gap-2 py-2 border-y border-border/40 text-xs">
                                    <span className="text-[10px] uppercase font-bold text-foreground/60">
                                        Selected Enhancements ({selectedAddons.length})
                                    </span>
                                    {selectedAddons.map((id) => {
                                        const a = CLOUD_ADDONS.find((item) => item.id === id);
                                        if (!a) return null;
                                        return (
                                            <div key={id} className="flex items-center justify-between text-foreground/70">
                                                <span className="truncate pr-2">{a.label}</span>
                                                <span className="font-semibold text-foreground/90 shrink-0">
                                                    +{formatKES(a.cost)}
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
                                    <span>Deployment Duration</span>
                                </div>
                                <span className="text-sm font-black text-primary">
                                    {totalCloudWeeks} Weeks
                                </span>
                            </div>

                            {/* Grand Total */}
                            <div className="flex flex-col gap-1 pt-2">
                                <span className="text-xs text-foreground/70 uppercase font-bold">Total Investment</span>
                                <span className="text-3xl font-black text-primary tracking-tight">
                                    {formatKES(totalCloudCost)}
                                </span>
                                <span className="text-[11px] text-foreground/60">
                                    Includes complete Terraform infrastructure code + handover documentation
                                </span>
                            </div>

                            {/* CTA */}
                            <Link
                                href={bookHref}
                                className={`${TYPOGRAPHY.button} w-full py-3.5 bg-primary text-black font-extrabold rounded-[8px] shadow-lg hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm`}
                            >
                                <span>Lock In DevOps Roadmap</span>
                                <ArrowRight size={16} />
                            </Link>

                            <div className="flex items-center justify-center gap-2 text-[11px] text-foreground/60 text-center">
                                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                <span>Includes 90-day post-launch emergency incident coverage</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
