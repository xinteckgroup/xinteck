/**
 * THEME AUTHORITY FILE
 * Single source of truth for all application colors and typography.
 * 
 * DIRECTIVES:
 * 1. Do NOT use hex codes directly in components.
 * 2. Use `text-foreground` or `bg-muted` etc. via Tailwind classes.
 * 3. Use these constants only when inline styles or canvas manipulation is required.
 */

export const THEME = {
    colors: {
        light: {
            background: "#ffffff",
            foreground: "#0a0a0a", // Dark Readable
            card: "#ffffff",
            cardForeground: "#0a0a0a",
            popover: "#ffffff",
            popoverForeground: "#0a0a0a",
            primary: "#D4AF37", // Gold
            primaryForeground: "#ffffff",
            secondary: "#f4f4f5", // Zinc-100
            secondaryForeground: "#18181b", // Zinc-900
            muted: "#f4f4f5", // Zinc-100
            mutedForeground: "#71717a", // Zinc-500
            accent: "#f4f4f5",
            accentForeground: "#18181b",
            destructive: "#ef4444",
            destructiveForeground: "#ffffff",
            border: "#e4e4e7", // Zinc-200
            input: "#e4e4e7",
            ring: "#D4AF37", // Gold
        },
        dark: {
            background: "#000000", // Pure Black
            foreground: "#ffffff", // Light Readable
            card: "#09090b", // Zinc-950
            cardForeground: "#ffffff",
            popover: "#09090b",
            popoverForeground: "#ffffff",
            primary: "#D4AF37", // Gold
            primaryForeground: "#000000",
            secondary: "#27272a", // Zinc-800
            secondaryForeground: "#ffffff",
            muted: "#27272a", // Zinc-800
            mutedForeground: "#a1a1aa", // Zinc-400
            accent: "#27272a",
            accentForeground: "#ffffff",
            destructive: "#7f1d1d", // Red-900
            destructiveForeground: "#ffffff",
            border: "#27272a", // Zinc-800
            input: "#27272a",
            ring: "#D4AF37",
        }
    },
    typography: {
        pageTitle: "text-3xl md:text-4xl font-bold tracking-tight text-foreground",
        sectionTitle: "text-2xl font-semibold tracking-tight text-foreground",
        cardTitle: "text-xl font-bold text-foreground",
        subheading: "text-lg font-medium text-foreground",
        body: "text-base text-muted-foreground leading-relaxed",
        small: "text-sm text-muted-foreground",
        meta: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
        link: "font-medium text-primary hover:underline",
    }
} as const;

export type ThemeColors = typeof THEME.colors.light;
export type TypographyRole = keyof typeof THEME.typography;

// Helper to get CSS variable names for these colors if needed in JS
export const CSS_VARS = {
    background: "--background",
    foreground: "--foreground",
    card: "--card",
    cardForeground: "--card-foreground",
    popover: "--popover",
    popoverForeground: "--popover-foreground",
    primary: "--primary",
    primaryForeground: "--primary-foreground",
    secondary: "--secondary",
    secondaryForeground: "--secondary-foreground",
    muted: "--muted",
    mutedForeground: "--muted-foreground",
    accent: "--accent",
    accentForeground: "--accent-foreground",
    destructive: "--destructive",
    destructiveForeground: "--destructive-foreground",
    border: "--border",
    input: "--input",
    ring: "--ring",
    radius: "--radius",
};
