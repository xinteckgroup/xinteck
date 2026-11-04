"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    Clock,
    DollarSign,
    Figma,
    HeartHandshake,
    Layers,
    MousePointer,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";

const ROI_METRICS = [
    {
        title: "40% Dev Cost Savings",
        subtitle: "Zero Coding Waste",
        desc: "Fixing an architectural or user flow flaw in Figma takes 2 hours. Fixing it after developers write the code takes 3 weeks.",
        icon: DollarSign,
        metric: "-40%",
    },
    {
        title: "Tested on Kenyan Users",
        subtitle: "Local User Intuition",
        desc: "We test navigation hierarchies and checkout flows with real local smartphone users to eliminate cognitive friction.",
        icon: Users,
        metric: "100%",
    },
    {
        title: "2.8x Conversion Lift",
        subtitle: "Frictionless Checkouts",
        desc: "By removing redundant form fields and clarifying M-Pesa prompts, mobile drop-off rates plunge dramatically.",
        icon: TrendingUp,
        metric: "+180%",
    },
    {
        title: "Design System Included",
        subtitle: "Developer Ready",
        desc: "Clean Figma auto-layout, tokenized color variables, responsive typography scales, and interactive states.",
        icon: Layers,
        metric: "100% .FIG",
    },
];

export function UiUxRoiMetrics() {
    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        The Zero Waste Guarantee
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        WHY PROTOTYPING SAVES MONTHS OF COSTLY REWRITES.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        A great product is not created by accident. We design and validate every interaction before writing a single line of code.
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {ROI_METRICS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col gap-4 p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-border/50 shadow-lg hover:border-primary/40 transition-all justify-between"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center font-bold">
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-xl md:text-2xl font-black text-primary font-mono">
                                        {item.metric}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>{item.title}</h4>
                                    <span className="text-xs text-primary font-semibold">{item.subtitle}</span>
                                </div>

                                <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Developer Handoff Guarantee Banner */}
                <div className="p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Figma size={26} />
                        </div>
                        <div>
                            <h4 className="text-sm md:text-base font-bold text-foreground">
                                Seamless Developer Handoff Included
                            </h4>
                            <p className="text-xs text-foreground/70 mt-0.5">
                                Your engineers receive fully organized Figma files with auto-layout, iOS & Android asset exports, and CSS properties.
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/book"
                        className={`${TYPOGRAPHY.button} shrink-0 px-6 py-3 bg-primary text-black font-extrabold text-xs rounded-[8px] hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md`}
                    >
                        <span>Request Design Sprint</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

