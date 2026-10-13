"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    Award,
    Check,
    Clock,
    Flame,
    Headphones,
    Megaphone,
    Rocket,
    ShieldCheck,
    Sparkles,
    Star,
    Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Icon Registry (must match AnnouncementsManager) ───

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Zap, Flame, ShieldCheck, Award, Headphones, Sparkles, Rocket, Clock, Star, Megaphone, Check,
};

// ─── Fallback items (used when DB has no announcements yet) ───

const FALLBACK_ITEMS: BannerItem[] = [
    { text: "Now Accepting Q2 2027 Projects — Limited Slots", icon: "Flame", highlight: true },
    { text: "100% Client Retention Rate", icon: "ShieldCheck", highlight: false },
    { text: "Average Sprint Delivery: Under 1 Week", icon: "Zap", highlight: false },
    { text: "ISO 27001 Compliant Workflows", icon: "Award", highlight: false },
    { text: "24/7 Post-Launch Support & Monitoring", icon: "Headphones", highlight: false },
    { text: "Free Discovery Call — Let's Scope Your Vision", icon: "Sparkles", highlight: true },
    { text: "AI-Powered Product Analytics Integration", icon: "Rocket", highlight: false },
    { text: "99.99% Uptime Guarantee on All Platforms", icon: "Clock", highlight: false },
];

// ─── Types ───

interface BannerItem {
    text: string;
    icon: string;
    highlight: boolean;
    link?: string | null;
}

interface AnnouncementBannerProps {
    items?: BannerItem[];
}

// ─── Subcomponents ───

function Separator() {
    return (
        <span className="w-[3px] h-[3px] rounded-full bg-primary/50 flex-shrink-0 mx-4 md:mx-5" />
    );
}

function BannerItemDisplay({ item }: { item: BannerItem }) {
    const IconComponent = ICON_MAP[item.icon] || Zap;

    const content = (
        <div className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
            <IconComponent
                size={12}
                className={cn(
                    "flex-shrink-0",
                    item.highlight ? "text-primary" : "text-white/40 dark:text-white/50"
                )}
            />
            <span
                className={cn(
                    "text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.08em]",
                    item.highlight ? "text-primary" : "text-white/70 dark:text-white/60"
                )}
            >
                {item.text}
            </span>
        </div>
    );

    if (item.link) {
        return (
            <a href={item.link} className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity">
                {content}
            </a>
        );
    }

    return content;
}

// ─── Main Component ───

export function AnnouncementBanner({ items }: AnnouncementBannerProps) {
    const [scrolled, setScrolled] = useState(false);
    const [topPx, setTopPx] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const bannerRef = useRef<HTMLDivElement>(null);

    // Dynamically position exactly 10px below the navbar
    useEffect(() => {
        const measure = () => {
            const nav = document.querySelector("nav");
            if (nav) {
                const rect = nav.getBoundingClientRect();
                setTopPx(rect.bottom + 10);
            }
        };
        measure();
        const t = setTimeout(measure, 900); // re-measure after framer entrance anim
        window.addEventListener("resize", measure, { passive: true });
        window.addEventListener("scroll", () => {
            measure();
            setScrolled(window.scrollY > 20);
        }, { passive: true });
        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", measure);
        };
    }, []);

    const bannerItems = items && items.length > 0 ? items : FALLBACK_ITEMS;

    const renderItems = (keyPrefix: string) =>
        bannerItems.map((item, i) => (
            <div key={`${keyPrefix}-${i}`} className="flex items-center flex-shrink-0">
                {i > 0 && <Separator />}
                <BannerItemDisplay item={item} />
            </div>
        ));

    return (
        <>
            {/* Inline keyframes — immune to Tailwind v4 tree-shaking */}
            <style>{`
                @keyframes xinteck-banner-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            <div
                ref={bannerRef}
                id="announcement-banner"
                className="fixed left-0 w-full z-40 flex justify-center pointer-events-none px-1 md:px-2 lg:px-3"
                style={{ top: topPx > 0 ? `${topPx}px` : "80px" }}
            >
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
                    className={cn(
                        "pointer-events-auto",
                        "w-full max-w-7xl mx-auto",
                        "overflow-hidden",
                        "rounded-[10px]",
                        "transition-all duration-300",
                        scrolled
                            ? "bg-black/70 dark:bg-black/80 backdrop-blur-xl border border-primary/20 shadow-[0_4px_24px_-6px_rgba(212,175,55,0.12)]"
                            : "bg-black/50 dark:bg-black/60 backdrop-blur-md border border-primary/10"
                    )}
                >
                    <div className="relative py-[7px] md:py-2">
                        {/* Left gradient fade */}
                        <div
                            className={cn(
                                "absolute top-0 left-0 w-10 md:w-16 h-full z-10 pointer-events-none rounded-l-[10px] transition-all duration-300",
                                scrolled
                                    ? "bg-gradient-to-r from-black/70 dark:from-black/80 to-transparent"
                                    : "bg-gradient-to-r from-black/50 dark:from-black/60 to-transparent"
                            )}
                        />
                        {/* Right gradient fade */}
                        <div
                            className={cn(
                                "absolute top-0 right-0 w-10 md:w-16 h-full z-10 pointer-events-none rounded-r-[10px] transition-all duration-300",
                                scrolled
                                    ? "bg-gradient-to-l from-black/70 dark:from-black/80 to-transparent"
                                    : "bg-gradient-to-l from-black/50 dark:from-black/60 to-transparent"
                            )}
                        />

                        {/* Scrolling track — right to left, two copies for seamless loop */}
                        <div
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "max-content",
                                animation: "xinteck-banner-scroll 35s linear infinite",
                                animationPlayState: isPaused ? "paused" : "running",
                            }}
                        >
                            <div className="flex items-center flex-shrink-0">
                                {renderItems("a")}
                            </div>
                            <Separator />
                            <div className="flex items-center flex-shrink-0">
                                {renderItems("b")}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
