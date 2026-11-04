"use client";

import {
    calculateEfficiencyRoi,
    calculateRevenueRoi,
    formatKES,
    generateCashflowData,
} from "@/lib/roi-calculator";
import type {
    InvestmentTier,
    RoiMode,
} from "@/types/roi";
import {
    EFFICIENCY_TIERS,
    REVENUE_TIERS,
} from "@/types/roi";
import { motion } from "framer-motion";
import { ArrowUpRight, Calculator, Mail } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ModeToggle } from "./ModeToggle";
import { RoiBarChart } from "./RoiBarChart";
import { SendReportModal } from "./SendReportModal";

// ── Slider Config ────────────────────────────────────────────
interface SliderConfig {
    label: string;
    key: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
    format?: (v: number) => string;
}

const EFFICIENCY_SLIDERS: SliderConfig[] = [
    {
        label: "Team Size",
        key: "teamSize",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        unit: " employees",
    },
    {
        label: "Weekly Hours Wasted per Person",
        key: "weeklyHoursWasted",
        min: 2,
        max: 30,
        step: 1,
        defaultValue: 8,
        unit: " hrs/week",
    },
    {
        label: "Avg. Hourly Rate",
        key: "hourlyRate",
        min: 300,
        max: 5000,
        step: 100,
        defaultValue: 800,
        unit: "",
        format: (v: number) => `KES ${v.toLocaleString("en-KE")}/hr`,
    },
];

const REVENUE_SLIDERS: SliderConfig[] = [
    {
        label: "Monthly Visitors / Leads",
        key: "monthlyTraffic",
        min: 200,
        max: 100000,
        step: 200,
        defaultValue: 5000,
        unit: "",
        format: (v: number) => v.toLocaleString("en-KE"),
    },
    {
        label: "Current Conversion Rate",
        key: "currentConversionRate",
        min: 0.2,
        max: 10,
        step: 0.1,
        defaultValue: 2,
        unit: "%",
    },
    {
        label: "Avg. Deal / Order Value",
        key: "averageOrderValue",
        min: 1000,
        max: 500000,
        step: 1000,
        defaultValue: 15000,
        unit: "",
        format: (v: number) => formatKES(v),
    },
];

export function RoiCalculatorClient() {
    // ── State ────────────────────────────────────────────────
    const [mode, setMode] = useState<RoiMode>("efficiency");
    const [showModal, setShowModal] = useState(false);

    // Efficiency inputs
    const [teamSize, setTeamSize] = useState(10);
    const [weeklyHoursWasted, setWeeklyHoursWasted] = useState(8);
    const [hourlyRate, setHourlyRate] = useState(800);
    const [efficiencyTierIdx, setEfficiencyTierIdx] = useState(1);

    // Revenue inputs
    const [monthlyTraffic, setMonthlyTraffic] = useState(5000);
    const [currentConversionRate, setCurrentConversionRate] = useState(2);
    const [averageOrderValue, setAverageOrderValue] = useState(15000);
    const [revenueTierIdx, setRevenueTierIdx] = useState(1);

    // ── Derived calculations ─────────────────────────────────
    const tiers: InvestmentTier[] =
        mode === "efficiency" ? EFFICIENCY_TIERS : REVENUE_TIERS;
    const selectedTierIdx =
        mode === "efficiency" ? efficiencyTierIdx : revenueTierIdx;
    const selectedTier = tiers[selectedTierIdx];

    const efficiencyResults = useMemo(
        () =>
            calculateEfficiencyRoi({
                teamSize,
                weeklyHoursWasted,
                hourlyRate,
                investmentTier: EFFICIENCY_TIERS[efficiencyTierIdx].value,
            }),
        [teamSize, weeklyHoursWasted, hourlyRate, efficiencyTierIdx]
    );

    const revenueResults = useMemo(
        () =>
            calculateRevenueRoi({
                monthlyTraffic,
                currentConversionRate,
                averageOrderValue,
                investmentTier: REVENUE_TIERS[revenueTierIdx].value,
            }),
        [monthlyTraffic, currentConversionRate, averageOrderValue, revenueTierIdx]
    );

    // Active results
    const annualValue =
        mode === "efficiency"
            ? efficiencyResults.annualSavings
            : revenueResults.annualIncrementalRevenue;
    const paybackMonths =
        mode === "efficiency"
            ? efficiencyResults.paybackMonths
            : revenueResults.paybackMonths;
    const roiPercentage =
        mode === "efficiency"
            ? efficiencyResults.threeYearRoi
            : revenueResults.yearOneRoi;
    const netValue =
        mode === "efficiency"
            ? efficiencyResults.threeYearNetValue
            : revenueResults.yearOneNetValue;
    const monthlyValue =
        mode === "efficiency"
            ? efficiencyResults.monthlySavings
            : revenueResults.monthlyIncrementalRevenue;

    const cashflowData = useMemo(
        () =>
            generateCashflowData(
                mode,
                selectedTier.value,
                monthlyValue,
                24
            ),
        [mode, selectedTier.value, monthlyValue]
    );

    // ── Slider value getters/setters ─────────────────────────
    const efficiencyValues: Record<string, number> = {
        teamSize,
        weeklyHoursWasted,
        hourlyRate,
    };
    const efficiencySetters: Record<string, (v: number) => void> = {
        teamSize: setTeamSize,
        weeklyHoursWasted: setWeeklyHoursWasted,
        hourlyRate: setHourlyRate,
    };
    const revenueValues: Record<string, number> = {
        monthlyTraffic,
        currentConversionRate,
        averageOrderValue,
    };
    const revenueSetters: Record<string, (v: number) => void> = {
        monthlyTraffic: setMonthlyTraffic,
        currentConversionRate: setCurrentConversionRate,
        averageOrderValue: setAverageOrderValue,
    };

    const sliders =
        mode === "efficiency" ? EFFICIENCY_SLIDERS : REVENUE_SLIDERS;
    const values =
        mode === "efficiency" ? efficiencyValues : revenueValues;
    const setters =
        mode === "efficiency" ? efficiencySetters : revenueSetters;

    // ── Book link with context ───────────────────────────────
    const bookHref = `/book?service=${encodeURIComponent(
        mode === "efficiency" ? "Custom Software Development" : "Web Development"
    )}`;

    return (
        <>
            <div className="flex flex-col gap-8 md:gap-10 w-full max-w-7xl mx-auto">
                {/* Mode Toggle */}
                <ModeToggle mode={mode} onChange={setMode} />

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* LEFT — Inputs */}
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Sliders */}
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[14px] p-5 md:p-6 flex flex-col gap-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Your Numbers
                            </h3>

                            {sliders.map((slider) => {
                                const val = values[slider.key];
                                const setter = setters[slider.key];
                                const displayVal = slider.format
                                    ? slider.format(val)
                                    : `${val}${slider.unit}`;

                                // Calculate fill percentage for the range slider
                                const pct =
                                    ((val - slider.min) /
                                        (slider.max - slider.min)) *
                                    100;

                                return (
                                    <div key={slider.key}>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs md:text-sm font-medium text-gray-300">
                                                {slider.label}
                                            </label>
                                            <span className="text-sm font-bold text-[#D4AF37] tabular-nums">
                                                {displayVal}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={slider.min}
                                            max={slider.max}
                                            step={slider.step}
                                            value={val}
                                            onChange={(e) =>
                                                setter(
                                                    parseFloat(e.target.value)
                                                )
                                            }
                                            className="w-full h-2 rounded-full appearance-none cursor-pointer"
                                            style={{
                                                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${pct}%, rgba(255,255,255,0.1) ${pct}%, rgba(255,255,255,0.1) 100%)`,
                                                WebkitAppearance: "none",
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Investment Tier Selector */}
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[14px] p-5 md:p-6 flex flex-col gap-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                                Investment Level
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {tiers.map((tier, idx) => {
                                    const isSelected =
                                        idx === selectedTierIdx;
                                    return (
                                        <button
                                            key={tier.label}
                                            onClick={() =>
                                                mode === "efficiency"
                                                    ? setEfficiencyTierIdx(idx)
                                                    : setRevenueTierIdx(idx)
                                            }
                                            className={`relative text-left p-3.5 rounded-[10px] border transition-all duration-200 cursor-pointer ${
                                                isSelected
                                                    ? "border-[#D4AF37]/60 bg-[#D4AF37]/10"
                                                    : "border-white/10 bg-white/5 hover:border-white/20"
                                            }`}
                                        >
                                            <p
                                                className={`text-sm font-bold ${
                                                    isSelected
                                                        ? "text-[#D4AF37]"
                                                        : "text-white"
                                                }`}
                                            >
                                                {tier.label}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {tier.description}
                                            </p>
                                            <p
                                                className={`text-xs font-bold mt-1.5 ${
                                                    isSelected
                                                        ? "text-[#D4AF37]"
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                {formatKES(tier.value)}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT — Results */}
                    <motion.div
                        key={`results-${mode}`}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <MetricCard
                                label={
                                    mode === "efficiency"
                                        ? "Annual Savings"
                                        : "Annual New Revenue"
                                }
                                value={annualValue}
                                isKES
                                highlight
                                subtitle={`${formatKES(monthlyValue)}/month`}
                            />
                            <MetricCard
                                label="Payback Period"
                                value={paybackMonths}
                                suffix=" mo"
                                subtitle={
                                    paybackMonths <= 6
                                        ? "Excellent payback"
                                        : paybackMonths <= 12
                                          ? "Strong payback"
                                          : "Moderate payback"
                                }
                            />
                            <MetricCard
                                label={
                                    mode === "efficiency"
                                        ? "3-Year ROI"
                                        : "Year 1 ROI"
                                }
                                value={roiPercentage}
                                suffix="%"
                                highlight
                                subtitle={
                                    roiPercentage > 500
                                        ? "Outstanding return"
                                        : roiPercentage > 200
                                          ? "Excellent return"
                                          : "Solid return"
                                }
                            />
                            <MetricCard
                                label={
                                    mode === "efficiency"
                                        ? "3-Year Net Value"
                                        : "Year 1 Net Gain"
                                }
                                value={netValue}
                                isKES
                                subtitle={`On ${formatKES(selectedTier.value)} investment`}
                            />
                            {mode === "efficiency" && (
                                <MetricCard
                                    label="Hours Recovered / Year"
                                    value={efficiencyResults.hoursRecoveredAnnually}
                                    suffix=" hrs"
                                    subtitle={`${Math.round(efficiencyResults.hoursRecoveredAnnually / 8)} working days`}
                                />
                            )}
                            {mode === "revenue" && (
                                <MetricCard
                                    label="New Conversion Rate"
                                    value={revenueResults.newConversionRate}
                                    suffix="%"
                                    subtitle={`Up from ${currentConversionRate}%`}
                                />
                            )}
                        </div>

                        {/* Chart */}
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-[14px] p-5 md:p-6">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                                24-Month Cashflow Comparison
                            </h3>
                            <RoiBarChart data={cashflowData} />
                        </div>
                    </motion.div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Link
                        href={bookHref}
                        className="group flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-black font-bold text-sm uppercase tracking-wider rounded-[10px] hover:scale-[1.02] transition-transform shadow-[0_4px_14px_0_rgba(212,175,55,0.3)]"
                    >
                        <Calculator size={18} />
                        Book a Free Strategy Call
                        <ArrowUpRight
                            size={18}
                            className="group-hover:rotate-45 transition-transform"
                        />
                    </Link>
                    <button
                        onClick={() => setShowModal(true)}
                        className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-[10px] hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                    >
                        <Mail size={18} />
                        Email My ROI Report
                    </button>
                </div>
            </div>

            {/* Modal */}
            <SendReportModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                mode={mode}
                investmentTier={selectedTier.label}
                investmentAmount={selectedTier.value}
                annualValue={annualValue}
                paybackMonths={paybackMonths}
                roiPercentage={roiPercentage}
            />
        </>
    );
}

