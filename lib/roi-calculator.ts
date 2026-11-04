// ═══════════════════════════════════════════════════════════════
// ROI Calculator — Pure Calculation Functions
// ═══════════════════════════════════════════════════════════════

import type {
    CashflowDataPoint,
    RoiEfficiencyInputs,
    RoiEfficiencyOutputs,
    RoiMode,
    RoiRevenueInputs,
    RoiRevenueOutputs,
} from "@/types/roi";

// ── Constants ────────────────────────────────────────────────
const AUTOMATION_RATE = 0.75;        // 75% of manual hours can be automated
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;
const CONVERSION_LIFT = 0.35;        // 35% improvement in conversion rate
const MAX_PAYBACK_MONTHS = 999;      // Cap for display when savings ≈ 0

// ── Mode A: Operational Efficiency ───────────────────────────
export function calculateEfficiencyRoi(
    inputs: RoiEfficiencyInputs
): RoiEfficiencyOutputs {
    const { teamSize, weeklyHoursWasted, hourlyRate, investmentTier } = inputs;

    // Annual cost of manual/wasted work
    const annualWasteCost =
        teamSize * weeklyHoursWasted * hourlyRate * WEEKS_PER_YEAR;

    // Projected annual savings at 75% automation
    const annualSavings = annualWasteCost * AUTOMATION_RATE;
    const monthlySavings = annualSavings / MONTHS_PER_YEAR;

    // Payback period (guard against division by zero)
    const paybackMonths =
        monthlySavings > 0
            ? Math.min(Math.ceil(investmentTier / monthlySavings), MAX_PAYBACK_MONTHS)
            : MAX_PAYBACK_MONTHS;

    // 3-year ROI
    const threeYearNetValue = annualSavings * 3 - investmentTier;
    const threeYearRoi =
        investmentTier > 0 ? (threeYearNetValue / investmentTier) * 100 : 0;

    // Hours recovered per year
    const hoursRecoveredAnnually =
        teamSize * weeklyHoursWasted * AUTOMATION_RATE * WEEKS_PER_YEAR;

    return {
        annualWasteCost,
        annualSavings,
        monthlySavings,
        paybackMonths,
        threeYearRoi,
        threeYearNetValue,
        hoursRecoveredAnnually,
    };
}

// ── Mode B: Revenue & Conversion Lift ────────────────────────
export function calculateRevenueRoi(
    inputs: RoiRevenueInputs
): RoiRevenueOutputs {
    const { monthlyTraffic, currentConversionRate, averageOrderValue, investmentTier } = inputs;

    // New projected conversion rate after optimization
    const newConversionRate =
        currentConversionRate * (1 + CONVERSION_LIFT);

    // Current conversions vs new conversions per month
    const currentMonthlyDeals = monthlyTraffic * (currentConversionRate / 100);
    const newMonthlyDeals = monthlyTraffic * (newConversionRate / 100);
    const monthlyIncrementalDeals = newMonthlyDeals - currentMonthlyDeals;

    // Revenue calculations
    const monthlyIncrementalRevenue = monthlyIncrementalDeals * averageOrderValue;
    const annualIncrementalRevenue = monthlyIncrementalRevenue * MONTHS_PER_YEAR;

    // Payback period (guard against division by zero)
    const paybackMonths =
        monthlyIncrementalRevenue > 0
            ? Math.min(
                  Math.ceil(investmentTier / monthlyIncrementalRevenue),
                  MAX_PAYBACK_MONTHS
              )
            : MAX_PAYBACK_MONTHS;

    // Year 1 ROI
    const yearOneNetValue = annualIncrementalRevenue - investmentTier;
    const yearOneRoi =
        investmentTier > 0 ? (yearOneNetValue / investmentTier) * 100 : 0;

    return {
        newConversionRate,
        monthlyIncrementalDeals,
        monthlyIncrementalRevenue,
        annualIncrementalRevenue,
        paybackMonths,
        yearOneRoi,
        yearOneNetValue,
    };
}

// ── Cashflow Data Generator (for Recharts) ───────────────────
export function generateCashflowData(
    mode: RoiMode,
    investmentTier: number,
    monthlyValue: number,
    months: number = 24
): CashflowDataPoint[] {
    const data: CashflowDataPoint[] = [];

    for (let i = 0; i <= months; i++) {
        const label = i === 0 ? "Now" : `M${i}`;
        // Cost of inaction: cumulative losses (stays at 0 since it's baseline)
        // But we show it as growing negative opportunity cost
        const doNothing = -(monthlyValue * i);
        // Invest with Xinteck: pay investment upfront, then accumulate monthly gains
        const investWithXinteck = -investmentTier + monthlyValue * i;

        data.push({
            month: label,
            doNothing,
            investWithXinteck,
        });
    }

    return data;
}

// ── Currency Formatter (KES) ─────────────────────────────────
export function formatKES(value: number): string {
    const absValue = Math.abs(value);

    if (absValue >= 1_000_000) {
        const millions = absValue / 1_000_000;
        const formatted =
            millions % 1 === 0
                ? millions.toFixed(0)
                : millions.toFixed(1);
        return `${value < 0 ? "-" : ""}KES ${formatted}M`;
    }

    if (absValue >= 1_000) {
        const thousands = absValue / 1_000;
        const formatted =
            thousands % 1 === 0
                ? thousands.toFixed(0)
                : thousands.toFixed(1);
        return `${value < 0 ? "-" : ""}KES ${formatted}K`;
    }

    return `${value < 0 ? "-" : ""}KES ${absValue.toLocaleString("en-KE")}`;
}

// ── Full number formatter (for emails & reports) ─────────────
export function formatKESFull(value: number): string {
    return `KES ${Math.round(value).toLocaleString("en-KE")}`;
}

