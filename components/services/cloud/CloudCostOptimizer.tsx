"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { formatKES } from "@/lib/roi-calculator";
import { motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Cloud,
    Cpu,
    DollarSign,
    Lock,
    Percent,
    ShieldCheck,
    Sparkles,
    TrendingDown,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CloudCostOptimizer() {
    const [monthlySpendUSD, setMonthlySpendUSD] = useState<number>(1200);

    // 40% typical savings
    const projectedSavingsUSD = Math.round(monthlySpendUSD * 0.4);
    const optimizedSpendUSD = monthlySpendUSD - projectedSavingsUSD;

    // Approximate conversion to KES (1 USD ~ 130 KES)
    const annualSavingsKES = projectedSavingsUSD * 12 * 130;

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Cloud Efficiency
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        SLASH YOUR CLOUD INVOICE BY 35% TO 50%.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Most Kenyan tech teams pay for oversized servers running idle 70% of the day. Our cloud architects right-size your architecture without sacrificing an ounce of performance.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Interactive Cost Slider (7 cols) */}
                    <div className="lg:col-span-7 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 border border-border/50 shadow-xl flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase font-bold tracking-wider text-primary">
                                Interactive Cloud Bill Auditor
                            </span>
                            <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                                ~40% Average Reduction
                            </span>
                        </div>

                        {/* Slider */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-foreground">
                                    Current Monthly AWS / GCP / DigitalOcean Bill:
                                </label>
                                <span className="text-2xl font-black text-primary font-mono">
                                    ${monthlySpendUSD.toLocaleString()} /mo
                                </span>
                            </div>
                            <input
                                type="range"
                                min={300}
                                max={10000}
                                step={100}
                                value={monthlySpendUSD}
                                onChange={(e) => setMonthlySpendUSD(Number(e.target.value))}
                                className="w-full accent-primary h-2 bg-zinc-800 rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[11px] text-foreground/60 font-mono">
                                <span>$300/mo (Startups)</span>
                                <span>$5,000/mo (Mid-Scale)</span>
                                <span>$10,000+/mo (Enterprise)</span>
                            </div>
                        </div>

                        {/* Before vs After Cards */}
                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                            <div className="p-4 rounded-[8px] bg-red-500/5 border border-red-500/30 flex flex-col">
                                <span className="text-xs text-red-500 uppercase font-bold">Current Unoptimized</span>
                                <span className="text-2xl font-black text-red-500 font-mono mt-1">
                                    ${monthlySpendUSD.toLocaleString()} /mo
                                </span>
                                <span className="text-[11px] text-foreground/60 mt-1">
                                    Over-provisioned RAM & idle CPU cycles
                                </span>
                            </div>

                            <div className="p-4 rounded-[8px] bg-emerald-500/5 border border-emerald-500/30 flex flex-col">
                                <span className="text-xs text-emerald-500 uppercase font-bold">Xinteck Engineered</span>
                                <span className="text-2xl font-black text-emerald-500 font-mono mt-1">
                                    ${optimizedSpendUSD.toLocaleString()} /mo
                                </span>
                                <span className="text-[11px] text-foreground/60 mt-1">
                                    Autoscaling + serverless container rightsizing
                                </span>
                            </div>
                        </div>

                        {/* Annual Savings Highlight */}
                        <div className="p-4 rounded-[8px] bg-primary/10 border border-primary/30 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Projected Annual Capital Saved</span>
                                <span className="text-xs text-foreground/70">Reinvest into growth instead of cloud vendor invoices</span>
                            </div>
                            <span className="text-xl md:text-2xl font-black text-primary font-mono shrink-0">
                                {formatKES(annualSavingsKES)} /yr
                            </span>
                        </div>
                    </div>

                    {/* Right: Security & Compliance Checklist (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-3">
                        <div className="p-6 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-border/50 shadow-lg flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    <ShieldCheck size={22} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">Bank-Grade Infrastructure Security</h4>
                                    <p className="text-xs text-foreground/70">Included in every cloud architecture contract</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2.5 text-xs text-foreground/80">
                                {[
                                    "Automated daily off-site database backups with 1-click restore",
                                    "Zero-trust VPC networks with private subnets & bastion access",
                                    "Cloudflare Enterprise DDoS mitigation & Web Application Firewall",
                                    "Automated CI/CD pipelines: Git push to production in 60s",
                                    "24/7 uptime monitoring & instant WhatsApp incident alerting",
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2.5">
                                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                href="/book"
                                className={`${TYPOGRAPHY.button} mt-2 w-full py-3 bg-primary text-black font-extrabold text-xs rounded-[8px] hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-md`}
                            >
                                <span>Schedule Cloud Architecture Audit</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
