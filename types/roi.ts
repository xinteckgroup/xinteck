// ═══════════════════════════════════════════════════════════════
// ROI Calculator — Type Definitions
// ═══════════════════════════════════════════════════════════════

export type RoiMode = "efficiency" | "revenue";

// ── Mode A: Operational Efficiency & Automation ──────────────
export interface RoiEfficiencyInputs {
    teamSize: number;           // Number of employees (1–100)
    weeklyHoursWasted: number;  // Hours per employee per week (2–30)
    hourlyRate: number;         // KES per hour (300–5000)
    investmentTier: number;     // Project cost in KES
}

export interface RoiEfficiencyOutputs {
    annualWasteCost: number;        // Total current annual cost of manual work
    annualSavings: number;          // Projected annual savings (75% automation rate)
    monthlySavings: number;         // Monthly savings
    paybackMonths: number;          // Months to break even
    threeYearRoi: number;           // 3-year ROI percentage
    threeYearNetValue: number;      // 3-year net capital value added
    hoursRecoveredAnnually: number; // Total hours recovered per year
}

// ── Mode B: Revenue & Conversion Lift ────────────────────────
export interface RoiRevenueInputs {
    monthlyTraffic: number;         // Monthly visitors/leads (200–100000)
    currentConversionRate: number;  // Current conversion % (0.2–10)
    averageOrderValue: number;      // Average deal value in KES (1000–500000)
    investmentTier: number;         // Project cost in KES
}

export interface RoiRevenueOutputs {
    newConversionRate: number;          // Projected conversion rate after optimization
    monthlyIncrementalDeals: number;    // Additional deals per month
    monthlyIncrementalRevenue: number;  // Additional monthly revenue
    annualIncrementalRevenue: number;   // Additional annual revenue
    paybackMonths: number;              // Months to break even
    yearOneRoi: number;                 // Year 1 ROI percentage
    yearOneNetValue: number;            // Year 1 net gain
}

// ── Investment Tier Options ──────────────────────────────────
export interface InvestmentTier {
    label: string;
    value: number;
    description: string;
}

export const EFFICIENCY_TIERS: InvestmentTier[] = [
    { label: "Starter Automation",        value: 300_000,   description: "Workflow automations, dashboards" },
    { label: "Core Business System",      value: 700_000,   description: "Custom ERP modules, integrations" },
    { label: "Advanced Custom Platform",  value: 2_000_000, description: "Full-scale internal tools" },
    { label: "Enterprise Modernization",  value: 5_000_000, description: "Legacy system overhaul" },
];

export const REVENUE_TIERS: InvestmentTier[] = [
    { label: "Growth Web App",            value: 200_000,   description: "Marketing site, landing pages" },
    { label: "Full Mobile / Platform",    value: 600_000,   description: "Mobile app, M-Pesa integration" },
    { label: "High-Scale Platform",       value: 1_500_000, description: "E-commerce, SaaS application" },
    { label: "Enterprise Ecosystem",      value: 3_500_000, description: "Multi-tenant, API-first platform" },
];

// ── Cashflow Chart Data Point ────────────────────────────────
export interface CashflowDataPoint {
    month: string;
    doNothing: number;      // Cumulative cost of doing nothing
    investWithXinteck: number; // Net cumulative return after investment
}

// ── Lead Capture Payload ─────────────────────────────────────
export interface RoiLeadPayload {
    name: string;
    email: string;
    phone: string;
    company?: string;
    mode: RoiMode;
    investmentTier: string;
    investmentAmount: number;
    annualValue: number;
    paybackMonths: number;
    roiPercentage: number;
    captchaToken?: string;
    captchaAnswer?: number;
    honeypot?: string;
}

