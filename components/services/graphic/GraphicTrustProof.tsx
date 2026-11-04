"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
    Award,
    CheckCircle2,
    FileCheck,
    Layers,
    Palette,
    Printer,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import Link from "next/link";

const PROOF_CARDS = [
    {
        title: "Commercial Press CMYK Ready",
        subtitle: "300 DPI + Bleed Marks",
        desc: "Engineered specifically for commercial printing presses in Nairobi (Heidelberg, Konica Minolta). Zero pixelation, zero muddy ink shifts.",
        icon: Printer,
    },
    {
        title: "100% Copyright Assignment",
        subtitle: "Full IP Ownership",
        desc: "From the moment the project concludes, all legal copyrights, trademarkable assets, and brand collateral belong strictly to your company.",
        icon: Award,
    },
    {
        title: "Pantone & Spot Color Calibrated",
        subtitle: "Zero Color Inconsistency",
        desc: "We calibrate exact Pantone Matching System (PMS) codes so your brand colors look identical on business cards, uniforms, and billboards.",
        icon: Palette,
    },
    {
        title: "Complete Vector Master Files",
        subtitle: "AI, EPS, SVG & PDF",
        desc: "You receive raw vector master files that scale infinitely from a tiny smartphone app icon to a 40-foot roadside billboard without losing crispness.",
        icon: FileCheck,
    },
];

export function GraphicTrustProof() {
    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Commercial Standards
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        COMMERCIAL PRINT & VECTOR INTEGRITY GUARANTEE.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Nothing looks worse than a logo that blurs on a banner or shifts colors when printed. We engineer boardroom-grade assets that uphold your reputation everywhere.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PROOF_CARDS.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col gap-4 p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-border/50 shadow-lg hover:border-primary/40 transition-all justify-between"
                            >
                                <div className="w-12 h-12 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    <Icon size={24} />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground text-base`}>
                                        {card.title}
                                    </h4>
                                    <span className="text-xs text-primary font-semibold">{card.subtitle}</span>
                                </div>

                                <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                                    {card.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
