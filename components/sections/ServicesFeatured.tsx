"use client";

import { useServices } from "@/components/providers/ServicesContext";
import { TYPOGRAPHY } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    Briefcase,
    Cloud,
    Globe,
    Palette,
    PenTool,
    Smartphone,
    Activity,
    ShieldCheck,
    Video
} from "lucide-react";
import Link from "next/link";

// Map service slugs to icons and visual config
const slugConfig: Record<
  string,
  {
    icon: React.ComponentType<{ size?: number }>;
    colSpan: string;
    translucentBg: string;
    hoverBorder: string;
  }
> = {
  "web-development": {
    icon: Globe,
    colSpan: "md:col-span-2",
    translucentBg: "bg-blue-500/10",
    hoverBorder: "border-blue-500/30",
  },
  "mobile-app-development": {
    icon: Smartphone,
    colSpan: "md:col-span-1",
    translucentBg: "bg-purple-500/10",
    hoverBorder: "border-purple-500/30",
  },
  "cloud-devops": {
    icon: Cloud,
    colSpan: "md:col-span-1",
    translucentBg: "bg-orange-500/10",
    hoverBorder: "border-orange-500/30",
  },
  "ui-ux-design": {
    icon: Palette,
    colSpan: "md:col-span-2",
    translucentBg: "bg-cyan-500/15",
    hoverBorder: "border-cyan-500/30",
  },
  "custom-software-development": {
    icon: Briefcase,
    colSpan: "md:col-span-1",
    translucentBg: "bg-green-500/10",
    hoverBorder: "border-green-500/30",
  },
  "graphic-design": {
    icon: PenTool,
    colSpan: "md:col-span-2",
    translucentBg: "bg-pink-500/10",
    hoverBorder: "border-pink-500/30",
  },
};

// Default config for unknown slugs
const defaultConfig = {
  icon: Briefcase,
  colSpan: "md:col-span-1",
  translucentBg: "bg-white/5",
  hoverBorder: "border-white/20",
};

// Canonical fallback service config matching exact approved methodologies & taglines
const CANONICAL_SERVICES = [
  {
    name: "Launchpad",
    slug: "web-development",
    subName: "Web Platforms & API Integrations",
  },
  {
    name: "Pulse",
    slug: "mobile-app-development",
    subName: "Android & iOS Applications",
  },
  {
    name: "Backbone",
    slug: "custom-software-development",
    subName: "Custom Business Systems & Automation",
  },
  {
    name: "Canvas",
    slug: "ui-ux-design",
    subName: "UI/UX Design & Prototyping",
  },
  {
    name: "Sentinel",
    slug: "cloud-devops",
    subName: "Cloud Infrastructure & Security",
  },
  {
    name: "Imprint",
    slug: "graphic-design",
    subName: "Business Identity & Print Design",
  },
];

// Alternating col-span pattern for services not in slugConfig
const colSpanPattern = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

export function ServicesFeatured() {
  const dynamicServices = useServices();
  const sourceServices = dynamicServices && dynamicServices.length > 0 ? dynamicServices : CANONICAL_SERVICES;

  // Build service cards from context with exact approved taglines
  const services = sourceServices.map((s, i) => {
    const config = slugConfig[s.slug] || defaultConfig;
    const canonical = CANONICAL_SERVICES.find((c) => c.slug === s.slug);
    const exactTagline = s.subName || canonical?.subName || "";
    return {
      title: s.name,
      desc: exactTagline,
      icon: config.icon,
      href: `/services/${s.slug}`,
      colSpan: slugConfig[s.slug]?.colSpan || colSpanPattern[i % colSpanPattern.length],
      translucentBg: config.translucentBg,
      hoverBorder: config.hoverBorder,
    };
  });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <div className={`${TYPOGRAPHY.badge} inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-secondary/5 w-fit text-primary`}>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="tracking-widest uppercase">Our Capabilities</span>
            </div>
            <h3 className="text-2xl md:text-5xl font-bold tracking-tight text-white">
              ENGINEERED <span className="text-white">FOR</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600 dark:to-yellow-200">IMPACT.</span>
            </h3>
          </div>
          <Link
            href="/services"
            className={`${TYPOGRAPHY.button} group flex items-center gap-2 text-white hover:text-primary transition-colors`}
          >
            Explore All Services
            <div className="w-8 h-8 rounded-[10px] bg-secondary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative p-8 md:p-10 rounded-[16px] transition-all duration-300 flex flex-col gap-6 overflow-hidden border border-white/10 hover:border-white/25 hover:shadow-2xl",
                service.colSpan
              )}
            >
              {/* Layer 1: Translucent background active on hover */}
              <div
                className={cn(
                  "absolute inset-0 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  service.translucentBg
                )}
              />

              {/* Layer 2: Default Yellowish Background 50% Translucent */}
              <div className="absolute inset-0 bg-[#D4AF37]/50 backdrop-blur-md opacity-100 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

              {/* Card Header: Icon + Arrow with high contrast */}
              <div className="flex justify-between items-start relative z-10">
                <div className="w-12 h-12 rounded-[12px] bg-black/85 text-white border border-white/15 shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
                  <service.icon size={24} />
                </div>
                <div className="w-9 h-9 rounded-full bg-black/40 text-white border border-white/15 flex items-center justify-center transition-all duration-300 group-hover:bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Card Footer: Title with high contrast */}
              <div className="mt-auto flex flex-col gap-2 relative z-10">
                <h4 className={`${TYPOGRAPHY.sectionTitle} text-white font-black tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}>
                  {service.title}
                </h4>
                {service.desc && (
                  <p className={`${TYPOGRAPHY.body} text-white/90 group-hover:text-white/80 leading-relaxed max-w-sm`}>
                    {service.desc}
                  </p>
                )}
              </div>

              <Link href={service.href} className="absolute inset-0 z-20" aria-label={`Explore ${service.title}`} />
            </motion.div>
          ))}
          
          {/* BUILD YOUR VISION CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="col-span-1 md:col-span-3 p-8 md:p-12 rounded-[18px] bg-[#D4AF37] relative overflow-hidden group shadow-2xl border border-transparent"
          >
            {/* Ambient Background Gradient Shift */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-black/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex flex-col gap-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/15 text-black font-mono text-xs uppercase tracking-widest font-black w-fit">
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                  Controlled Capacity · Q1 2027
                </div>
                <h4 className="text-3xl md:text-5xl font-black text-black tracking-tight leading-tight">
                  BUILD WITH FOCUS.
                </h4>
                <p className="text-black/85 text-base md:text-lg font-medium leading-relaxed">
                  We work with a maximum of 4 clients per quarter to guarantee dedicated engineering attention. Next available project start: Q1 2027.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
                <Link 
                  href="/book"
                  className={`${TYPOGRAPHY.button} px-8 py-4 bg-black text-white hover:bg-black/85 rounded-[12px] transition-all flex items-center justify-center gap-2.5 font-black shadow-xl hover:scale-105 text-sm md:text-base tracking-wide`}
                >
                  <Video size={18} className="text-[#D4AF37] shrink-0" />
                  <span>Reserve a Q1 Slot</span>
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  href="/contact"
                  className={`${TYPOGRAPHY.button} px-8 py-4 border border-black/30 hover:border-black bg-black/5 hover:bg-black hover:text-white text-black rounded-[12px] transition-all text-center font-bold text-sm md:text-base`}
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 4 STATS IMPLEMENTED DIRECTLY BELOW BUILD YOUR VISION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-8 p-6 md:p-8 rounded-[18px] bg-white/30 dark:bg-black/80 backdrop-blur-xl relative overflow-hidden shadow-2xl dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]"
        >
          {/* Subtle Top Ambient Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 via-blue-500/40 via-amber-500/40 to-primary/40 opacity-70" />

          {/* Console Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 pb-5 border-b border-border/60 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <span className="text-[11px] uppercase font-mono tracking-[0.2em] text-foreground/80 dark:text-white/70 font-bold">
                Core Engineering Specifications · Active Telemetry
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-foreground/75 dark:text-white/60 bg-white/50 dark:bg-white/5 px-3 py-1 rounded-full border border-border dark:border-white/10 w-fit">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Timezone: Kenya (EAT · UTC+3)</span>
            </div>
          </div>

          {/* 4 Warm & Welcoming Client-Friendly Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {/* 1. M-Pesa STK & Daraja */}
            <div className="group relative p-6 rounded-[14px] bg-white/50 dark:bg-background/50 hover:bg-white/70 dark:hover:bg-background/80 border border-border dark:border-white/[0.07] hover:border-emerald-500/50 dark:hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden shadow-sm dark:shadow-lg hover:shadow-[0_10px_30px_rgba(16,185,129,0.12)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    💳
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/10 border border-emerald-500/30 dark:border-emerald-500/25 px-2.5 py-1 rounded-full tracking-wider uppercase">
                    EASY PAYMENTS
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-black text-foreground dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  M-Pesa STK & Daraja
                </h4>
                <p className="text-xs text-foreground/80 dark:text-white/80 mt-2 leading-relaxed font-medium">
                  Smooth mobile checkout for your customers. They get an instant prompt on their phone to pay safely, and you receive immediate confirmation.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-foreground/70 dark:text-white/60">
                <span>Prompt: Instant on Phone</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ready to Use
                </span>
              </div>
            </div>

            {/* 2. eTIMS Tax Compliant */}
            <div className="group relative p-6 rounded-[14px] bg-white/50 dark:bg-background/50 hover:bg-white/70 dark:hover:bg-background/80 border border-border dark:border-white/[0.07] hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden shadow-sm dark:shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.12)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    📋
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/15 dark:bg-blue-500/10 border border-blue-500/30 dark:border-blue-500/25 px-2.5 py-1 rounded-full tracking-wider uppercase">
                    TAX READY
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-black text-foreground dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  eTIMS Tax Compliant
                </h4>
                <p className="text-xs text-foreground/80 dark:text-white/80 mt-2 leading-relaxed font-medium">
                  Automatic KRA tax receipts for every sale. Your system stays 100% legally compliant with zero extra stress or manual bookkeeping work.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-foreground/70 dark:text-white/60">
                <span>Invoicing: Automatic KRA</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Fully Compliant
                </span>
              </div>
            </div>

            {/* 3. High-Grade Data Security */}
            <div className="group relative p-6 rounded-[14px] bg-white/50 dark:bg-background/50 hover:bg-white/70 dark:hover:bg-background/80 border border-border dark:border-white/[0.07] hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden shadow-sm dark:shadow-lg hover:shadow-[0_10px_30px_rgba(245,158,11,0.12)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    🛡️
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/25 px-2.5 py-1 rounded-full tracking-wider uppercase">
                    SAFE &amp; PRIVATE
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-black text-foreground dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  High-Grade Data Security
                </h4>
                <p className="text-xs text-foreground/80 dark:text-white/80 mt-2 leading-relaxed font-medium">
                  Your customer data and company records are safe with us. We use strong encryption, daily automatic backups, and 24/7 security safeguards.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-foreground/70 dark:text-white/60">
                <span>Backups: Daily Automated</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Safe &amp; Guarded
                </span>
              </div>
            </div>

            {/* 4. Rapid Sprint Velocity */}
            <div className="group relative p-6 rounded-[14px] bg-white/50 dark:bg-background/50 hover:bg-white/70 dark:hover:bg-background/80 border border-border dark:border-white/[0.07] hover:border-primary/50 dark:hover:border-primary/40 transition-all duration-300 flex flex-col justify-between gap-5 overflow-hidden shadow-sm dark:shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.12)]">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                    ⚡
                  </div>
                  <span className="text-[10px] font-mono font-bold text-primary bg-primary/15 dark:bg-primary/10 border border-primary/30 dark:border-primary/25 px-2.5 py-1 rounded-full tracking-wider uppercase">
                    QUICK RESULTS
                  </span>
                </div>
                <h4 className="text-base md:text-lg font-black text-foreground dark:text-white tracking-tight group-hover:text-primary transition-colors">
                  Rapid Sprint Velocity
                </h4>
                <p className="text-xs text-foreground/80 dark:text-white/80 mt-2 leading-relaxed font-medium">
                  We build and launch fast so you never wait. You get working progress to review every week, direct access to your engineers, and zero delays.
                </p>
              </div>
              <div className="pt-3 border-t border-border/60 dark:border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-foreground/70 dark:text-white/60">
                <span>Updates: Weekly Demos</span>
                <span className="text-primary font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Fast Delivery
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
