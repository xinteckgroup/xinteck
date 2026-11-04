"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    Bike,
    CheckCircle2,
    DollarSign,
    Layers,
    MapPin,
    Package,
    ShieldCheck,
    ShoppingBag,
    Smartphone,
    Truck,
    Users,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface IndustryPack {
    id: string;
    title: string;
    tagline: string;
    icon: typeof Smartphone;
    description: string;
    features: string[];
    timeline: string;
    techHighlights: string[];
    exampleOutcome: string;
}

const INDUSTRY_PACKS: IndustryPack[] = [
    {
        id: "delivery",
        title: "On-Demand Delivery & Rides",
        tagline: "Live GPS tracking, rider dispatch & customer SMS notifications",
        icon: Bike,
        description:
            "A complete Uber/Glovo-style ecosystem with dedicated apps for customers, dispatchers, and riders. Built for low-battery drain and resilient GPS location tracking even through dense city centers.",
        features: [
            "Live turn-by-turn map tracking with estimated arrival time",
            "Automated rider assignment & proximity dispatching",
            "In-app M-Pesa automated customer payment & driver cashouts",
            "Direct in-app WhatsApp / phone calling with number masking",
        ],
        timeline: "5 – 7 Weeks to Store Launch",
        techHighlights: ["Background GPS", "Daraja B2C Auto-Payouts", "WebSockets"],
        exampleOutcome: "Streamlines 200+ daily orders without manual phone calls",
    },
    {
        id: "fintech",
        title: "Fintech & SACCO Wallets",
        tagline: "Secure digital banking, member savings & instant loans",
        icon: DollarSign,
        description:
            "Bank-grade mobile applications with end-to-end data encryption, biometric authentication, and instant M-Pesa float management. Ideal for Microfinance, SACCOs, and digital investment clubs.",
        features: [
            "Biometric FaceID / Fingerprint login with hardware Keychain encryption",
            "Automated instant loan scoring, disbursement & repayments",
            "Member savings goals with scheduled standing orders",
            "Instant PDF mini-statement generation & SMS transaction alerts",
        ],
        timeline: "6 – 8 Weeks to Store Launch",
        techHighlights: ["256-Bit SSL", "M-Pesa C2B/B2C API", "PIN Hashing"],
        exampleOutcome: "Allows members to access services 24/7 without visiting branches",
    },
    {
        id: "distribution",
        title: "Field Sales & Van Distribution",
        tagline: "Offline route orders, Bluetooth printing & stock reconciliation",
        icon: Truck,
        description:
            "Empower your van drivers, distributors, and merchandisers to record sales in deep rural routes with zero Safaricom internet. All data queues locally and syncs automatically when signal returns.",
        features: [
            "100% Offline order writing and stock level checks",
            "Bluetooth thermal receipt & invoice printing on the go",
            "GPS geo-fenced customer store check-ins & route planning",
            "Daily cash, credit, and M-Pesa sales reconciliation",
        ],
        timeline: "4 – 6 Weeks to Store Launch",
        techHighlights: ["SQLite Offline DB", "Bluetooth POS SDK", "Geo-Fencing"],
        exampleOutcome: "Eliminates lost invoices and manual evening bookkeeping",
    },
    {
        id: "retail",
        title: "Retail & Customer Loyalty",
        tagline: "Turn casual buyers into habitual repeat customers",
        icon: ShoppingBag,
        description:
            "A direct brand presence on your customers' home screens. Announce flash sales through instant push notifications and let customers browse, reorder, and earn reward points in seconds.",
        features: [
            "One-tap visual catalog with smart search & favorites",
            "Automated push notifications for promotions and discounts",
            "Customer loyalty points, discount coupons & referral rewards",
            "Integrated M-Pesa express checkout in under 10 seconds",
        ],
        timeline: "4 – 5 Weeks to Store Launch",
        techHighlights: ["FCM Push Alerts", "M-Pesa STK Push", "Smart Cache"],
        exampleOutcome: "Increases 30-day repeat purchases by up to 40%",
    },
];

export function MobileIndustryPacks() {
    const [activeId, setActiveId] = useState("delivery");
    const activePack = INDUSTRY_PACKS.find((p) => p.id === activeId) || INDUSTRY_PACKS[0];
    const ActiveIcon = activePack.icon;

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Kenyan Industry Solutions
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        TAILORED APPS FOR YOUR EXACT BUSINESS MODEL.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        We don't build generic apps. Choose your industry below to see how we engineer workflows that match how business is actually conducted in Kenya.
                    </p>
                </div>

                {/* Vertical Switcher Tabs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {INDUSTRY_PACKS.map((pack) => {
                        const isSelected = pack.id === activeId;
                        const Icon = pack.icon;

                        return (
                            <button
                                key={pack.id}
                                type="button"
                                onClick={() => setActiveId(pack.id)}
                                className={`p-4 md:p-5 rounded-[10px] text-left transition-all duration-200 cursor-pointer flex flex-col gap-2.5 backdrop-blur-xl shadow-lg border ${
                                    isSelected
                                        ? "bg-primary/20 border-primary ring-2 ring-primary/40 text-primary"
                                        : "bg-white/30 dark:bg-black/80 border-transparent hover:border-primary/40 text-foreground"
                                }`}
                            >
                                <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center transition-colors ${
                                    isSelected ? "bg-primary text-black" : "bg-background/80 text-primary"
                                }`}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold tracking-tight">{pack.title}</h4>
                                    <p className="text-[11px] text-foreground/75 font-medium line-clamp-1 mt-0.5">
                                        {pack.tagline}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Active Pack Detailed Spotlight Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePack.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-12 shadow-2xl grid lg:grid-cols-12 gap-8 items-center"
                    >
                        {/* Left Details */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-[10px] bg-primary/20 flex items-center justify-center text-primary">
                                    <ActiveIcon size={24} />
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                        Industry Blueprint
                                    </span>
                                    <h4 className="text-2xl md:text-3xl font-black text-foreground">
                                        {activePack.title}
                                    </h4>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-foreground font-medium leading-relaxed">
                                {activePack.description}
                            </p>

                            {/* Core Capabilities Checklist */}
                            <div className="grid sm:grid-cols-2 gap-3 pt-2">
                                {activePack.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2.5">
                                        <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                                        <span className="text-xs md:text-sm text-foreground font-semibold leading-snug">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Tech Highlights Badge Row */}
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                                <span className="text-xs text-foreground/70 font-semibold mr-1">Architecture:</span>
                                {activePack.techHighlights.map((t) => (
                                    <span
                                        key={t}
                                        className="text-[11px] font-bold px-2.5 py-1 rounded-[6px] bg-background/80 text-primary border border-primary/20"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right Summary Card & Direct CTA */}
                        <div className="lg:col-span-5 bg-muted/10 rounded-[10px] p-6 md:p-8 flex flex-col gap-5 border border-border/40">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
                                    Typical Launch Window
                                </span>
                                <p className="text-xl font-black text-primary mt-0.5">
                                    {activePack.timeline}
                                </p>
                            </div>

                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
                                    Proven Business Impact
                                </span>
                                <p className="text-sm font-bold text-foreground mt-0.5">
                                    💡 {activePack.exampleOutcome}
                                </p>
                            </div>

                            <div className="pt-2 flex flex-col gap-3">
                                <Link
                                    href={`/book?service=Mobile+App+Development&package=${encodeURIComponent(activePack.title)}`}
                                    className={`w-full py-3.5 px-6 rounded-[10px] bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 ${TYPOGRAPHY.button}`}
                                >
                                    <span>Plan This App With Us</span>
                                    <ArrowRight size={16} />
                                </Link>
                                <p className="text-[11px] text-foreground/70 text-center font-medium">
                                    Includes complete Apple App Store & Google Play Store publishing.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}

