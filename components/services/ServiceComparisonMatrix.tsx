"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  Clock,
  Globe2,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ServiceComparisonMatrixProps {
  slug: string;
  serviceTitle: string;
  brandedName?: string;
}

interface ServiceMetadata {
  brandedName: string;
  descriptor: string;
  kenyaSpecialization: string;
  turnaround: string;
}

const SERVICE_META_MAP: Record<string, ServiceMetadata> = {
  "web-development": {
    brandedName: "Launchpad",
    descriptor: "Web Platforms & M-Pesa Integrations",
    kenyaSpecialization: "Sub-2s loading on Safaricom networks, automated Daraja M-Pesa checkout, structured local SEO",
    turnaround: "4 – 8 Weeks",
  },
  "mobile-app-development": {
    brandedName: "Pulse",
    descriptor: "Android & iOS Applications",
    kenyaSpecialization: "Verified on Tecno/Infinix/Samsung, zero-drain offline caching, 100% Google Play & Apple approval",
    turnaround: "9 – 12 Weeks",
  },
  "custom-software-development": {
    brandedName: "Backbone",
    descriptor: "Custom Business Systems & Automation",
    kenyaSpecialization: "Multi-branch ledger sync, automated KRA eTIMS signing, automated bank & M-Pesa reconciliation",
    turnaround: "8 – 14 Weeks",
  },
  "ui-ux-design": {
    brandedName: "Canvas",
    descriptor: "UI/UX Design & Conversion Prototyping",
    kenyaSpecialization: "Checkout flows tuned for local user behavior, click-through testing, complete developer-ready Figma tokens",
    turnaround: "3 – 6 Weeks",
  },
  "cloud-devops": {
    brandedName: "Sentinel",
    descriptor: "Cloud Infrastructure & High-Grade Security",
    kenyaSpecialization: "Cost optimization buffering against KES/USD volatility, 24/7 uptime surveillance, daily backup snapshots",
    turnaround: "2 – 4 Weeks",
  },
  "graphic-design": {
    brandedName: "Imprint",
    descriptor: "Business Identity & Print Design",
    kenyaSpecialization: "Commercial press-ready CMYK proofing, scalable vector brand suites, tender & procurement presentation decks",
    turnaround: "2 – 4 Weeks",
  },
};

export function ServiceComparisonMatrix({
  slug,
  serviceTitle,
  brandedName: passedBrandedName,
}: ServiceComparisonMatrixProps) {
  const meta = SERVICE_META_MAP[slug] || {
    brandedName: passedBrandedName || "Xinteck Framework",
    descriptor: serviceTitle,
    kenyaSpecialization: "Engineered specifically for Kenyan infrastructure, local payment channels, and compliance standards",
    turnaround: "4 – 10 Weeks",
  };

  const finalBrandedName = passedBrandedName || meta.brandedName;
  const [selectedMobileTab, setSelectedMobileTab] = useState<number>(3); // Default to Xinteck option

  const options = [
    {
      id: "diy",
      name: "In-House DIY",
      badge: "Generic Templates & Builders",
      icon: Building2,
      isHighlighted: false,
      speed: "3 – 6+ Months (Frequent Stalls)",
      speedScore: "Slow",
      kenyaContext: "Missing: Generic templates lack Daraja API or eTIMS hooks; requires custom hacks.",
      kenyaContextPositive: false,
      operationalRisk: "High: Diverts executive leadership from core sales; maintenance often abandoned.",
      slaAndHandoff: "Zero documentation, fragmented architecture, no disaster recovery protocol.",
      summary: "Looks cheaper upfront, but hidden staff time and delayed launches compound costs quickly.",
    },
    {
      id: "freelancer",
      name: "Solo Freelancer",
      badge: "Independent Contractor",
      icon: User,
      isHighlighted: false,
      speed: "Unpredictable (Weeks to Months)",
      speedScore: "Variable",
      kenyaContext: "Inconsistent: May know basic scripts, but lacks formal security & compliance validation.",
      kenyaContextPositive: false,
      operationalRisk: "Severe: Single point of failure if they fall ill, take a job, or prioritize other clients.",
      slaAndHandoff: "Informal handover, no binding uptime SLA, billable hourly rates for emergency bugs.",
      summary: "Adequate for disposable prototypes, high operational risk for business-critical software.",
    },
    {
      id: "offshore",
      name: "Offshore Agency",
      badge: "Overseas Outsource Shop",
      icon: Globe2,
      isHighlighted: false,
      speed: "8 – 16 Weeks",
      speedScore: "Moderate",
      kenyaContext: "Zero: Unaware of Safaricom callback latencies, KRA tax regulations, or local bank gateways.",
      kenyaContextPositive: false,
      operationalRisk: "Medium-High: Timezone lags, communication barriers, and heavy dollar currency exchange costs.",
      slaAndHandoff: "Rigid change orders, costly monthly support retainers, offshore legal jurisdiction.",
      summary: "Higher fees with zero domestic operational context and cumbersome coordination.",
    },
    {
      id: "xinteck",
      name: `${finalBrandedName}`,
      badge: "Xinteck Branded Methodology",
      icon: Sparkles,
      isHighlighted: true,
      speed: `Guaranteed ${meta.turnaround}`,
      speedScore: "Fast & Predictable",
      kenyaContext: meta.kenyaSpecialization,
      kenyaContextPositive: true,
      operationalRisk: "Near-Zero: Turnkey multi-disciplinary engineering squad with structured weekly deliverables.",
      slaAndHandoff: "100% full code ownership, comprehensive architecture documentation, and dedicated Kenya-hours support.",
      summary: "Production-ready, localized compliance, and engineered for tangible business ROI.",
    },
  ];

  return (
    <section className="px-6 py-12 md:py-20" id="comparison-matrix">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 md:gap-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h2 className={`${TYPOGRAPHY.tableHeader} text-primary uppercase tracking-[0.2em]`}>
              Decision Matrix
            </h2>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
            4 WAYS TO SOLVE THIS.
          </h3>
          <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/80`}>
            Before committing capital, objectively evaluate the true timeline, regulatory exposure, and hidden engineering risks across your available paths.
          </p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="lg:hidden flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 bg-background/60 p-1.5 rounded-[10px] border border-border/50">
            {options.map((opt, idx) => {
              const Icon = opt.icon;
              const isActive = selectedMobileTab === idx;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedMobileTab(idx)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-[8px] text-xs font-bold transition-all ${
                    isActive
                      ? opt.isHighlighted
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-foreground/10 text-foreground"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  <Icon size={14} />
                  <span className="truncate">{opt.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Mobile Card */}
          {(() => {
            const active = options[selectedMobileTab];
            const Icon = active.icon;
            return (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-[10px] backdrop-blur-xl flex flex-col gap-5 ${
                  active.isHighlighted
                    ? "bg-white/40 dark:bg-black/90 border-2 border-primary shadow-xl ring-1 ring-primary/30"
                    : "bg-white/30 dark:bg-black/80 border border-border/50"
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${
                        active.isHighlighted ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground text-lg`}>{active.name}</h4>
                      <p className="text-xs text-foreground/60">{active.badge}</p>
                    </div>
                  </div>
                  {active.isHighlighted && (
                    <span className="px-2.5 py-1 rounded-[6px] bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-4 text-sm">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                      Turnaround & Velocity
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className={active.isHighlighted ? "text-primary" : "text-foreground/60"} />
                      <span className="font-semibold text-foreground">{active.speed}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                      Kenyan Infrastructure & Compliance
                    </span>
                    <div className="flex items-start gap-2">
                      {active.kenyaContextPositive ? (
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                      )}
                      <p className="text-foreground/80 leading-relaxed text-xs">{active.kenyaContext}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                      Operational Drag & Team Distraction
                    </span>
                    <p className="text-foreground/80 leading-relaxed text-xs">{active.operationalRisk}</p>
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                      Ownership, SLA & Support
                    </span>
                    <div className="flex items-start gap-2">
                      <ShieldCheck
                        size={16}
                        className={active.isHighlighted ? "text-primary mt-0.5 shrink-0" : "text-foreground/50 mt-0.5 shrink-0"}
                      />
                      <p className="text-foreground/80 leading-relaxed text-xs">{active.slaAndHandoff}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/50 block mb-1">
                      Verdict
                    </span>
                    <p className="text-xs italic text-foreground/70 leading-relaxed">{active.summary}</p>
                  </div>
                </div>

                {active.isHighlighted && (
                  <Link
                    href={`/contact?service=${encodeURIComponent(serviceTitle)}`}
                    className={`${TYPOGRAPHY.button} mt-2 w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-[8px] text-xs font-bold shadow-md hover:bg-primary/90 transition-all`}
                  >
                    Deploy with {finalBrandedName}
                    <ArrowRight size={14} />
                  </Link>
                )}
              </motion.div>
            );
          })()}
        </div>

        {/* Desktop Grid Layout (4 Parallel Comparative Columns) */}
        <div className="hidden lg:grid grid-cols-4 gap-5 items-stretch">
          {options.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col rounded-[10px] backdrop-blur-xl p-6 transition-all ${
                  opt.isHighlighted
                    ? "bg-white/40 dark:bg-black/90 border-2 border-primary shadow-2xl ring-1 ring-primary/30 -translate-y-2"
                    : "bg-white/30 dark:bg-black/80 border border-border/50 hover:border-border/80"
                }`}
              >
                {/* Highlighted Ribbon */}
                {opt.isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 whitespace-nowrap">
                    <Sparkles size={12} fill="currentColor" />
                    Engineered for Kenya
                  </div>
                )}

                {/* Card Header */}
                <div className="flex flex-col gap-3 pb-5 border-b border-border/40 min-h-[110px]">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-[8px] flex items-center justify-center ${
                        opt.isHighlighted
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-foreground/5 text-foreground"
                      }`}
                    >
                      <Icon size={22} />
                    </div>
                    {opt.isHighlighted ? (
                      <span className="text-xs font-black text-primary uppercase tracking-wider">Xinteck</span>
                    ) : (
                      <span className="text-[11px] font-medium text-foreground/50">Alternative</span>
                    )}
                  </div>

                  <div>
                    <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground text-lg`}>{opt.name}</h4>
                    <p className="text-xs text-foreground/60 leading-tight mt-0.5">{opt.badge}</p>
                  </div>
                </div>

                {/* Comparative Rows */}
                <div className="flex flex-col gap-5 py-5 flex-1">
                  {/* Speed */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                      Timeline to Launch
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={15}
                        className={opt.isHighlighted ? "text-primary shrink-0" : "text-foreground/50 shrink-0"}
                      />
                      <span className={`text-xs font-bold ${opt.isHighlighted ? "text-primary" : "text-foreground"}`}>
                        {opt.speed}
                      </span>
                    </div>
                  </div>

                  {/* Kenya Context */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                      Kenyan Localization
                    </span>
                    <div className="flex items-start gap-2">
                      {opt.kenyaContextPositive ? (
                        <Check size={16} className="text-primary mt-0.5 shrink-0" />
                      ) : (
                        <X size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <p className="text-xs text-foreground/80 leading-relaxed">{opt.kenyaContext}</p>
                    </div>
                  </div>

                  {/* Operational Risk */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                      Operational Strain
                    </span>
                    <p className="text-xs text-foreground/80 leading-relaxed">{opt.operationalRisk}</p>
                  </div>

                  {/* SLA & Code Ownership */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/50">
                      Ownership & Uptime SLA
                    </span>
                    <div className="flex items-start gap-2">
                      <ShieldCheck
                        size={15}
                        className={opt.isHighlighted ? "text-primary mt-0.5 shrink-0" : "text-foreground/40 mt-0.5 shrink-0"}
                      />
                      <p className="text-xs text-foreground/80 leading-relaxed">{opt.slaAndHandoff}</p>
                    </div>
                  </div>
                </div>

                {/* Verdict / Bottom */}
                <div className="pt-4 border-t border-border/40 mt-auto flex flex-col gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 block mb-1">
                      Verdict
                    </span>
                    <p className="text-xs italic text-foreground/70 leading-relaxed min-h-[48px]">
                      {opt.summary}
                    </p>
                  </div>

                  {opt.isHighlighted ? (
                    <Link
                      href={`/contact?service=${encodeURIComponent(serviceTitle)}`}
                      className={`${TYPOGRAPHY.button} w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-[8px] text-xs font-bold shadow-lg hover:bg-primary/90 transition-all`}
                    >
                      Choose {finalBrandedName}
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <div className="py-2.5 text-center text-[11px] text-foreground/40 font-medium">
                      High Operational Friction
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

