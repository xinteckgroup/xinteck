/**
 * Seed script: Create the "Graphic Design" service in the database.
 * 
 * Run with: npx tsx scripts/seed-graphic-design-service.ts
 * 
 * Idempotent — uses upsert so it's safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

async function main() {
    const slug = "graphic-design";

    // Count existing services to determine sort order
    const count = await prisma.service.count();

    const service = await prisma.service.upsert({
        where: { slug },
        update: {
            name: "Graphic Design",
            subName: "Visual Identity & Print",
            price: "Custom",
            description:
                "Professional graphic design services including business cards, brand identity, logos, marketing collateral, and digital assets — all crafted with precision to elevate your brand.",
            image: "/images/services/bs-card-front.webp",
            features: [
                "Business Card Design",
                "Brand Identity",
                "Logo Design",
                "Marketing Collateral",
                "Social Media Graphics",
                "Print Design",
            ],
            stats: [
                { label: "Print-Ready", val: "100%" },
                { label: "Design Concepts", val: "2–3" },
                { label: "Fast Turnaround", val: "48h" },
                { label: "Print Resolution", val: "300 DPI" },
            ],
            section1: {
                title: "VISUAL IDENTITY THAT COMMANDS ATTENTION.",
                subtitle:
                    "From business cards to full brand systems, we craft designs that leave lasting impressions. Every pixel is intentional, every color purposeful.",
                image: "/images/services/bs-card-front.webp",
            },
            section2: {
                title: "DESIGN THAT CONVERTS.",
                description:
                    "Great design isn't just aesthetic — it's strategic. We create visual assets that communicate your brand's value proposition at a glance, building trust and driving engagement from the first touchpoint.\n\nOur design philosophy combines modern minimalism with bold brand expression, ensuring your materials stand out in any context — digital or print.",
            },
            section3: {
                title: "PRINT-READY PRECISION.",
                description:
                    "Every design we deliver is production-ready. We handle bleeds, color profiles (CMYK/RGB), resolution standards, and die-cut specifications so your prints come out flawless every time.\n\nFrom premium card stocks to large-format banners, we optimize for the medium.",
            },
            section4: {
                title: "HOW WE DESIGN.",
                steps: [
                    {
                        title: "Discovery & Brief",
                        description:
                            "We learn your brand, audience, and goals. A detailed creative brief ensures alignment before any design work begins.",
                    },
                    {
                        title: "Concept Development",
                        description:
                            "Multiple design concepts are explored, each rooted in strategic thinking and contemporary design trends.",
                    },
                    {
                        title: "Refinement",
                        description:
                            "Your chosen concept is refined through iterative feedback rounds until every detail is perfect.",
                    },
                    {
                        title: "Final Delivery",
                        description:
                            "Print-ready and digital-ready files delivered in all required formats (PDF, AI, PNG, SVG, etc.).",
                    },
                ],
            },
            detailsSection: {
                title: "WHAT WE DESIGN.",
            },
            freshnessSection: {
                title: "DESIGN TRENDS, TIMELESS RESULTS.",
                description:
                    "We stay current with global design trends while building assets that won't feel dated in a year. Our work balances trend-awareness with timeless design principles — clean typography, purposeful whitespace, and cohesive color systems that scale across every touchpoint.",
            },
            buyNowSection: {
                title: "READY TO ELEVATE YOUR BRAND?",
                description:
                    "Let's craft visual assets that make your business unforgettable.",
                button: "Get a Design Quote",
                price: "From KES 5,000",
                unit: "per project",
                processingParams: ["Business Cards", "Logos", "Brand Kits"],
                deliveryPromise: "48-hour turnaround on standard designs.",
                returnPolicy: "Unlimited revisions during design phase.",
                pricingTiers: [
                    {
                        name: "Business Card Design",
                        price: "KES 5,000",
                        description: "Professional double-sided business card design, print-ready.",
                        includes: ["2 initial design concepts", "2 revision rounds", "Print-ready files (PDF, AI)", "CMYK color profile + bleed setup"],
                        turnaround: "48 hours",
                        popular: true,
                        note: "Design only — printing not included."
                    },
                    {
                        name: "Logo Design",
                        price: "KES 15,000",
                        description: "Custom professional logo with full file package.",
                        includes: ["3 initial concepts", "3 revision rounds", "All formats (SVG, PNG, AI, PDF)", "Brand color codes (HEX, RGB, CMYK)", "Light & dark versions"],
                        turnaround: "3–5 business days"
                    },
                    {
                        name: "Brand Identity Kit",
                        price: "KES 45,000",
                        description: "Complete visual brand system for a professional presence.",
                        includes: ["Logo design (full package)", "Business card design", "Letterhead & envelope templates", "Brand guidelines document", "2 social media profile templates"],
                        turnaround: "7–10 business days"
                    },
                    {
                        name: "Full Brand Package",
                        price: "KES 120,000",
                        description: "End-to-end brand identity and marketing collateral.",
                        includes: ["Everything in Brand Identity Kit", "Corporate presentation deck", "Email signature template", "Flyer / brochure design", "Social media kit (5 templates)", "Vehicle branding mockup"],
                        turnaround: "2–3 weeks"
                    }
                ]
            },
            status: "PUBLISHED",
        },
        create: {
            slug,
            name: "Graphic Design",
            subName: "Visual Identity & Print",
            price: "Custom",
            description:
                "Professional graphic design services including business cards, brand identity, logos, marketing collateral, and digital assets — all crafted with precision to elevate your brand.",
            image: "/images/services/bs-card-front.webp",
            features: [
                "Business Card Design",
                "Brand Identity",
                "Logo Design",
                "Marketing Collateral",
                "Social Media Graphics",
                "Print Design",
            ],
            stats: [
                { label: "Print-Ready", val: "100%" },
                { label: "Design Concepts", val: "2–3" },
                { label: "Fast Turnaround", val: "48h" },
                { label: "Print Resolution", val: "300 DPI" },
            ],
            section1: {
                title: "VISUAL IDENTITY THAT COMMANDS ATTENTION.",
                subtitle:
                    "From business cards to full brand systems, we craft designs that leave lasting impressions. Every pixel is intentional, every color purposeful.",
                image: "/images/services/bs-card-front.webp",
            },
            section2: {
                title: "DESIGN THAT CONVERTS.",
                description:
                    "Great design isn't just aesthetic — it's strategic. We create visual assets that communicate your brand's value proposition at a glance, building trust and driving engagement from the first touchpoint.\n\nOur design philosophy combines modern minimalism with bold brand expression, ensuring your materials stand out in any context — digital or print.",
            },
            section3: {
                title: "PRINT-READY PRECISION.",
                description:
                    "Every design we deliver is production-ready. We handle bleeds, color profiles (CMYK/RGB), resolution standards, and die-cut specifications so your prints come out flawless every time.\n\nFrom premium card stocks to large-format banners, we optimize for the medium.",
            },
            section4: {
                title: "HOW WE DESIGN.",
                steps: [
                    {
                        title: "Discovery & Brief",
                        description:
                            "We learn your brand, audience, and goals. A detailed creative brief ensures alignment before any design work begins.",
                    },
                    {
                        title: "Concept Development",
                        description:
                            "Multiple design concepts are explored, each rooted in strategic thinking and contemporary design trends.",
                    },
                    {
                        title: "Refinement",
                        description:
                            "Your chosen concept is refined through iterative feedback rounds until every detail is perfect.",
                    },
                    {
                        title: "Final Delivery",
                        description:
                            "Print-ready and digital-ready files delivered in all required formats (PDF, AI, PNG, SVG, etc.).",
                    },
                ],
            },
            detailsSection: {
                title: "WHAT WE DESIGN.",
            },
            freshnessSection: {
                title: "DESIGN TRENDS, TIMELESS RESULTS.",
                description:
                    "We stay current with global design trends while building assets that won't feel dated in a year. Our work balances trend-awareness with timeless design principles — clean typography, purposeful whitespace, and cohesive color systems that scale across every touchpoint.",
            },
            buyNowSection: {
                title: "READY TO ELEVATE YOUR BRAND?",
                description:
                    "Let's craft visual assets that make your business unforgettable.",
                button: "Get a Design Quote",
                price: "From KES 5,000",
                unit: "per project",
                processingParams: ["Business Cards", "Logos", "Brand Kits"],
                deliveryPromise: "48-hour turnaround on standard designs.",
                returnPolicy: "Unlimited revisions during design phase.",
                pricingTiers: [
                    {
                        name: "Business Card Design",
                        price: "KES 5,000",
                        description: "Professional double-sided business card design, print-ready.",
                        includes: ["2 initial design concepts", "2 revision rounds", "Print-ready files (PDF, AI)", "CMYK color profile + bleed setup"],
                        turnaround: "48 hours",
                        popular: true,
                        note: "Design only — printing not included."
                    },
                    {
                        name: "Logo Design",
                        price: "KES 15,000",
                        description: "Custom professional logo with full file package.",
                        includes: ["3 initial concepts", "3 revision rounds", "All formats (SVG, PNG, AI, PDF)", "Brand color codes (HEX, RGB, CMYK)", "Light & dark versions"],
                        turnaround: "3–5 business days"
                    },
                    {
                        name: "Brand Identity Kit",
                        price: "KES 45,000",
                        description: "Complete visual brand system for a professional presence.",
                        includes: ["Logo design (full package)", "Business card design", "Letterhead & envelope templates", "Brand guidelines document", "2 social media profile templates"],
                        turnaround: "7–10 business days"
                    },
                    {
                        name: "Full Brand Package",
                        price: "KES 120,000",
                        description: "End-to-end brand identity and marketing collateral.",
                        includes: ["Everything in Brand Identity Kit", "Corporate presentation deck", "Email signature template", "Flyer / brochure design", "Social media kit (5 templates)", "Vehicle branding mockup"],
                        turnaround: "2–3 weeks"
                    }
                ]
            },
            budgetRanges: ["KES 5,000 - 15,000", "KES 15,000 - 50,000", "KES 50,000 - 150,000", "KES 150,000+"],
            status: "PUBLISHED",
            sortOrder: count, // Append to end of list
        },
    });

    console.log(`✅ Service "${service.name}" upserted with slug: ${service.slug}`);
    console.log(`   ID: ${service.id}`);
    console.log(`   Status: ${service.status}`);
    console.log(`   Sort Order: ${service.sortOrder}`);
}

main()
    .catch((e) => {
        console.error("❌ Failed to seed service:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
