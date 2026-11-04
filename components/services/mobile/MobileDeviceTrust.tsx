"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    Activity,
    CheckCircle2,
    Cpu,
    Database,
    DownloadCloud,
    Flame,
    Lock,
    ShieldCheck,
    Smartphone,
    Sparkles,
} from "lucide-react";

const TRUST_METRICS = [
    {
        title: "50+ Devices Verified",
        subtitle: "Budget to Flagship",
        description: "Tested thoroughly across Infinix, Tecno Spark, Samsung Galaxy A, Xiaomi Redmi, up to iPhone 16 Pro Max.",
        icon: Smartphone,
    },
    {
        title: "100% Store Approval",
        subtitle: "Zero Policy Headaches",
        description: "We handle Apple App Store guidelines, Google Play 14-day tester requirements, and privacy compliance.",
        icon: ShieldCheck,
    },
    {
        title: "60 FPS Fluid Motion",
        subtitle: "Zero Lag or Stutter",
        description: "GPU-accelerated native animations and efficient memory usage so your app never freezes or crashes.",
        icon: Activity,
    },
    {
        title: "Ultra-Low Data Use",
        subtitle: "Optimized for Kenya",
        description: "Intelligent asset compression and client caching prevent draining your customers' Safaricom bundles.",
        icon: DownloadCloud,
    },
];

const POPULAR_DEVICES = [
    "Infinix Hot / Note",
    "Tecno Spark / Camon",
    "Samsung Galaxy A14 / A24 / A54",
    "Xiaomi Redmi 12 / 13",
    "Oppo Reno / A-Series",
    "Apple iPhone 11 – 16 Pro",
];

export function MobileDeviceTrust() {
    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Kenyan Market Performance
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ENGINEERED FOR REAL KENYAN HARDWARE & NETWORKS.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Your app must run flawlessly on affordable smartphones under variable internet connectivity — not just in Silicon Valley simulators.
                    </p>
                </div>

                {/* 4 Trust Metric Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {TRUST_METRICS.map((metric, i) => {
                        const Icon = metric.icon;
                        return (
                            <motion.div
                                key={metric.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 flex flex-col gap-4 shadow-lg border border-transparent hover:border-primary/30 transition-all"
                            >
                                <div className="w-12 h-12 rounded-[10px] bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>
                                        {metric.title}
                                    </h4>
                                    <span className="text-xs font-bold text-primary block mt-0.5">
                                        {metric.subtitle}
                                    </span>
                                </div>
                                <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                                    {metric.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Device Badges Strip */}
                <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[8px] bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-foreground">Tested Hardware Spectrum</h4>
                            <p className="text-xs text-foreground/75 font-medium">Optimized for 2GB RAM budget chips to flagship A18 processors</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
                        {POPULAR_DEVICES.map((device) => (
                            <span
                                key={device}
                                className="text-xs font-semibold px-3 py-1.5 rounded-[8px] bg-muted/10 text-foreground border border-border/40"
                            >
                                ✓ {device}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

