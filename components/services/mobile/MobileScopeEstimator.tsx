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
    Layers,
    MapPin,
    Radio,
    ShieldCheck,
    Smartphone,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface FeatureOption {
    id: string;
    label: string;
    description: string;
    cost: number;
    days: number;
    popular?: boolean;
}

const BASE_APP = {
    label: "Core Native App (iOS + Android)",
    cost: 200_000,
    days: 45, // 9 weeks baseline
};

const FEATURE_OPTIONS: FeatureOption[] = [
    {
        id: "mpesa",
        label: "In-App M-Pesa STK Push",
        description: "1-tap prompt for customers & instant payment verification",
        cost: 60_000,
        days: 4,
        popular: true,
    },
    {
        id: "offline",
        label: "Offline-First SQLite Database",
        description: "Keep working without internet; auto-syncs when online",
        cost: 70_000,
        days: 5,
        popular: true,
    },
    {
        id: "admin",
        label: "Web Admin Dashboard",
        description: "Manage users, inventory, orders, and view live analytics",
        cost: 90_000,
        days: 6,
        popular: true,
    },
    {
        id: "gps",
        label: "Live GPS & Rider Tracking",
        description: "Real-time map location updates and geo-fenced triggers",
        cost: 80_000,
        days: 5,
    },
    {
        id: "notifications",
        label: "Targeted Push Notifications",
        description: "Automated broadcast alerts, marketing promos, and order updates",
        cost: 40_000,
        days: 3,
    },
    {
        id: "biometrics",
        label: "Biometric Login & PIN Lock",
        description: "Hardware-level FaceID, TouchID, and encrypted PIN security",
        cost: 45_000,
        days: 3,
    },
];

export function MobileScopeEstimator() {
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
        "mpesa",
        "offline",
        "admin",
    ]);

    const toggleFeature = (id: string) => {
        setSelectedFeatures((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const { totalCost, totalWeeks } = useMemo(() => {
        let cost = BASE_APP.cost;
        let days = BASE_APP.days;

        FEATURE_OPTIONS.forEach((f) => {
            if (selectedFeatures.includes(f.id)) {
                cost += f.cost;
                days += f.days;
            }
        });

        // Guarantees no projected timeline is below 9 weeks in any user configuration
        const weeks = Math.max(9, Math.ceil(days / 5));
        return { totalCost: cost, totalWeeks: weeks };
    }, [selectedFeatures]);

    const bookHref = `/book?service=Mobile+App+Development&budget=${encodeURIComponent(
        `KES ${totalCost.toLocaleString("en-KE")}`
    )}`;

    return (
        <section id="scope-estimator" className="px-6 py-8 md:py-16 scroll-mt-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Interactive Project Planner
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        ESTIMATE YOUR APP SCOPE & TIMELINE.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Select the capabilities your mobile application needs. See real-time ballpark estimates and apply for a strategy session with your pre-configured scope.
                    </p>
                </div>

                {/* Calculator Grid */}
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Feature Checkboxes */}
                    <div className="lg:col-span-7 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-2xl flex flex-col gap-5">
                        <div className="flex items-center justify-between border-b border-border/40 pb-3">
                            <div>
                                <h4 className="text-sm md:text-base font-bold text-foreground">
                                    Base Foundation Included:
                                </h4>
                                <p className="text-xs text-foreground/75 font-medium">
                                    Native iOS & Android builds, App Store setup, and responsive UI
                                </p>
                            </div>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-[6px]">
                                Included
                            </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
                            {FEATURE_OPTIONS.map((f) => {
                                const isChecked = selectedFeatures.includes(f.id);

                                return (
                                    <button
                                        key={f.id}
                                        type="button"
                                        onClick={() => toggleFeature(f.id)}
                                        className={`p-4 rounded-[10px] text-left transition-all cursor-pointer border flex flex-col justify-between gap-3 ${
                                            isChecked
                                                ? "bg-primary/20 border-primary shadow-sm"
                                                : "bg-muted/10 border-transparent hover:border-border text-foreground"
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <span
                                                className={`text-sm font-bold leading-tight ${
                                                    isChecked ? "text-primary" : "text-foreground"
                                                }`}
                                            >
                                                {f.label}
                                            </span>
                                            <div
                                                className={`w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0 border transition-colors ${
                                                    isChecked
                                                        ? "bg-primary border-primary text-black"
                                                        : "border-border/60 bg-background/50"
                                                }`}
                                            >
                                                {isChecked && <Check size={14} className="stroke-[3]" />}
                                            </div>
                                        </div>
                                        <p className="text-xs text-foreground/75 font-medium leading-snug">
                                            {f.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Instant Estimate Summary */}
                    <div className="lg:col-span-5 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-2xl flex flex-col gap-6 sticky top-24">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary">
                                Estimated Scope Summary
                            </span>
                            <h4 className="text-2xl font-black text-foreground mt-1">
                                Ready for Production
                            </h4>
                        </div>

                        {/* Numbers */}
                        <div className="grid grid-cols-2 gap-3.5 bg-muted/10 p-4 rounded-[10px]">
                            <div>
                                <span className="text-[11px] font-bold uppercase text-foreground/70">
                                    Projected Timeline
                                </span>
                                <p className="text-2xl font-black text-foreground mt-0.5">
                                    {totalWeeks} Weeks
                                </p>
                                <span className="text-[10px] text-foreground/70 font-medium">To Store Launch</span>
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase text-foreground/70">
                                    Ballpark Estimate
                                </span>
                                <p className="text-2xl font-black text-primary mt-0.5">
                                    {formatKES(totalCost)}
                                </p>
                                <span className="text-[10px] text-foreground/70 font-medium">Transparent milestones</span>
                            </div>
                        </div>

                        {/* Deliverables Checklist */}
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                                Deliverables Included in this Scope:
                            </span>
                            <div className="flex flex-col gap-1.5 text-xs text-foreground/80 font-medium">
                                <p>✓ Full Source Code Ownership (React Native / Expo)</p>
                                <p>✓ Apple App Store & Google Play Store publishing</p>
                                <p>✓ 90 Days of post-launch crash monitoring & bug warranty</p>
                                <p>✓ In-person or remote admin dashboard staff training</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                            href={bookHref}
                            className={`w-full py-4 px-6 rounded-[10px] bg-primary text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 ${TYPOGRAPHY.button}`}
                        >
                            <Calendar size={18} />
                            <span>Lock In Estimate</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Calendar(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    );
}
