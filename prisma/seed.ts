import { ContentStatus, PrismaClient, ProjectCategory, ProjectStatus, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL,
});

// Initial Data
const services = [
    {
        slug: "web-development",
        name: "Launchpad",
        subName: "Web Platforms & API Integrations",
        price: "Custom Scope",
        description: "We build modern web platforms with instant M-Pesa checkout, KRA eTIMS readiness, and sub-100ms load speeds. Built for Kenyan companies that need direct mobile payment rails, bulletproof uptime, and a digital storefront engineered to convert visitors into repeat customers.",

        features: [
            "M-Pesa STK Push & Daraja Checkout",
            "KRA eTIMS Tax Compliant Invoicing",
            "Sub-100ms Mobile Load Speeds",
            "Client Admin & Content Dashboard",
            "WhatsApp Lead & Order Integration",
            "99.9% High-Availability Uptime"
        ],
        stats: [{ label: "Lighthouse", val: "100" }, { label: "Uptime", val: "99.9%" }, { label: "Speed", val: "<100ms" }],
        section1: { title: "Launchpad.", subtitle: "Web Platforms Engineered for Revenue." },
        section2: { title: "Blazing fast performance.", subtitle: "Built on the latest Next.js infrastructure for instant page loads and superior SEO." },
        section3: { title: "Pixel-perfect engineering.", subtitle: "Every interaction is crafted with precision, ensuring a premium user experience across all devices." },
        section4: { title: "Scalable architecture.", subtitle: "" },
        detailsSection: {
            title: "Architecture First",
            description: "We don't just write code; we architect solutions. Using modern frameworks like React and Next.js, we build web applications that scale effortlessly from 100 to 1 million users. Our component-driven development ensures maintainability and rapid iteration.",
            imageAlt: "Web Dev Architecture"
        },
        freshnessSection: {
            title: "Clean Code Guarantee",
            description: "Our codebases are strictly typed with TypeScript and linted for consistency. We adhere to SOLID principles, ensuring that your application remains robust, readable, and easy to extend for years to come."
        },
        buyNowSection: {
            price: "Custom Scope",
            unit: "per engagement",
            processingParams: ["M-Pesa STK", "eTIMS Invoicing", "CMS Integration"],
            deliveryPromise: "Agile delivery with weekly progress demos. Full source code ownership.",
            returnPolicy: "30-day post-launch warranty included."
        },
        budgetRanges: [
            "Accelerated Sprint (M-Pesa Checkout & Fast Go-To-Market)",
            "Commercial Web Platform (Direct Daraja + eTIMS Integration)",
            "High-Scale Custom Web Architecture",
            "To Be Determined During Strategy Session"
        ],
        status: ContentStatus.PUBLISHED,
        sortOrder: 1,
        image: "/images/services/web_dev_caricature_1771020665861.webp"
    },
    {
        slug: "mobile-app-development",
        name: "Pulse",
        subName: "Android & iOS Applications",
        price: "Custom Scope",
        description: "Put your business directly into your customers' hands. We engineer high-performance mobile apps for Android and iOS with native M-Pesa STK push, offline capabilities, and instant push notifications—built to perform flawlessly on any device across Kenya.",

        features: [
            "Unified Android & iPhone Codebase",
            "Instant In-App M-Pesa STK Push",
            "Offline-First Data Synchronization",
            "Targeted Push Notifications & SMS",
            "Google Play & App Store Publication",
            "Zero-Lag High Performance UX"
        ],
        stats: [{ label: "Platforms", val: "2" }, { label: "Code Share", val: "90%" }, { label: "FPS", val: "60" }],
        section1: { title: "Pulse.", subtitle: "Mobile Architecture in Your Customer's Hands." },
        section2: { title: "One codebase, everywhere.", subtitle: "React Native allows us to deploy to iOS and Android simultaneously without compromising quality." },
        section3: { title: "Silky smooth animations.", subtitle: "Optimized for 60fps performance with native driver integrations and gesture handling." },
        section4: { title: "Offline-first design.", subtitle: "" },
        detailsSection: {
            title: "Native Experience",
            description: "Users expect performant, responsive apps. We bridge the gap between web and native, accessing device features like Camera, GPS, and Haptics directly to create immersive mobile experiences that feel at home on any device.",
            imageAlt: "Mobile App Logic"
        },
        freshnessSection: {
            title: "Store Approval Support",
            description: "We handle the entire submission process for Apple App Store and Google Play Store, ensuring your app meets all guidelines and gets approved quickly."
        },
        buyNowSection: {
            price: "Custom Scope",
            unit: "per engagement",
            processingParams: ["iOS + Android", "M-Pesa Push", "Biometrics"],
            deliveryPromise: "Weekly demo builds delivered directly to your device.",
            returnPolicy: "Post-launch crash monitoring included."
        },
        budgetRanges: [
            "MVP Mobile Build (Android + iOS)",
            "Commercial App (Native Daraja STK + Push & Offline Support)",
            "High-Volume Fintech / Enterprise Mobile Platform",
            "To Be Determined During Strategy Session"
        ],
        status: ContentStatus.PUBLISHED,
        sortOrder: 2,
        image: "/images/services/mobile_app_caricature_1771020693351.webp"
    },
    {
        slug: "custom-software-development",
        name: "Backbone",
        subName: "Custom Business Systems & Automation",
        price: "Custom Scope",
        description: "When generic off-the-shelf tools slow you down, we engineer custom operations software tailored to your company's exact workflow. Replace disorganized spreadsheets with unified management portals, automated stock tracking, and native eTIMS invoicing that saves your team dozens of manual hours every week.",

        features: [
            "Engineered for Your Exact Operations",
            "Automated eTIMS / KRA Invoicing",
            "Real-Time Stock & Warehouse Tracking",
            "Granular Role & Staff Permissions",
            "Automated Executive Financial Reports",
            "End-to-End Encryption & Daily Backups"
        ],
        stats: [{ label: "Security", val: "AES-256" }, { label: "Scale", val: "Unltd" }, { label: "API", val: "REST/QL" }],
        section1: { title: "Backbone.", subtitle: "The System Your Operations Run On." },
        section2: { title: "Complex problems, solved.", subtitle: "We maintain rigorous logic to handle intricate business rules and data flows." },
        section3: { title: "Integrated ecosystems.", subtitle: "Seamlessly connect with your existing CRM, ERP, and third-party tools." },
        section4: { title: "Data-driven insights.", subtitle: "" },
        detailsSection: {
            title: "Business Logic Core",
            description: "Off-the-shelf software rarely fits perfectly. We build custom engines tailored to your specific workflows, automating manual processes and unlocking efficiency that generic tools can't match.",
            imageAlt: "Custom Logic"
        },
        freshnessSection: {
            title: "Security by Design",
            description: "We implement defense-in-depth strategies, including role-based access control (RBAC), data encryption at rest and in transit, and regular security audits."
        },
        buyNowSection: {
            price: "Custom Scope",
            unit: "per engagement",
            processingParams: ["Cloud Native", "Dockerized", "eTIMS Fiscal Core"],
            deliveryPromise: "Phased rollout with team training sessions.",
            returnPolicy: "SLA-backed support agreements."
        },
        budgetRanges: [
            "Internal Operations System (Inventory / Staff / Workflow)",
            "Custom ERP & Automated eTIMS Invoicing Core",
            "Enterprise Multi-Branch Operations & Financial Engine",
            "To Be Determined During Strategy Session"
        ],
        status: ContentStatus.PUBLISHED,
        sortOrder: 3,
        image: "/images/services/custom_software_caricature_1771020721906.webp"
    },
    {
        slug: "ui-ux-design",
        name: "Canvas",
        subName: "UI/UX Design & Prototyping",
        price: "Custom Scope",
        description: "Before writing a single line of code, we design high-converting user journeys and interactive clickable prototypes. Eliminate developer waste, validate workflows with real Kenyan users, and guarantee seamless customer checkout before engineering begins.",

        features: [
            "High-Fidelity Interactive Prototypes",
            "Friction-Free Checkout Journey Mapping",
            "Conversion-Optimized UI Systems",
            "Reusable Figma Component Libraries",
            "Accessibility & Mobile Usability Testing",
            "Developer-Ready Implementation Handoff"
        ],
        stats: [{ label: "Users", val: "Happy" }, { label: "Conversion", val: "+40%" }, { label: "Awards", val: "Yes" }],
        section1: { title: "Canvas.", subtitle: "Design Engineered to Convert." },
        section2: { title: "Designs that convert.", subtitle: "Aesthetics meet function. We design interfaces that guide users naturally towards your goals." },
        section3: { title: "Interactive prototypes.", subtitle: "Visualize the product before writing a single line of code with clickable high-fidelity prototypes." },
        section4: { title: "Accessibility included.", subtitle: "" },
        detailsSection: {
            title: "The Design System",
            description: "We don't just design pages; we build design systems. Reusable components, consistent typography, and unified color palettes ensure your brand remains cohesive across all digital touchpoints.",
            imageAlt: "Design System"
        },
        freshnessSection: {
            title: "Empathy Driven",
            description: "We start with the user. Through persona layout and journey mapping, we identify pain points and design solutions that truly solve user problems."
        },
        buyNowSection: {
            price: "Custom Scope",
            unit: "per engagement",
            processingParams: ["Figma Master Files", "Style Guide", "Developer Handoff"],
            deliveryPromise: "Interactive prototypes you can click through on mobile.",
            returnPolicy: "Iterative revisions during design phase."
        },
        budgetRanges: [
            "Interactive Clickable Prototype (Figma Master)",
            "Full Product Design System & Zero-Waste Developer Handoff",
            "Multi-Platform UX Architecture & User Testing",
            "To Be Determined During Strategy Session"
        ],
        status: ContentStatus.PUBLISHED,
        sortOrder: 4,
        image: "/images/services/ui_ux_caricature_1771020743886.webp"
    },
    {
        slug: "cloud-devops",
        name: "Sentinel",
        subName: "Cloud Infrastructure & Security",
        price: "SLA Retainer",
        description: "24/7 infrastructure protection and cloud optimization. We deploy and manage resilient server environments with automated daily backups, threat mitigation, and instant auto-scaling—guaranteeing 99.9% uptime during your highest-traffic sales peaks.",

        features: [
            "24/7 Telemetry & Health Monitoring",
            "Automated Daily Redundant Backups",
            "Threat Shield & Attack Mitigation",
            "Auto-Scaling Traffic Peak Resilience",
            "Cloud Cost Optimization & Audits",
            "Sub-15 Minute Disaster Recovery SLA"
        ],
        stats: [{ label: "Uptime", val: "99.99%" }, { label: "Deploy", val: "Auto" }, { label: "Cost", val: "-30%" }],
        section1: { title: "Sentinel.", subtitle: "Your Infrastructure, Always Guarded." },
        section2: { title: "Scale without fear.", subtitle: "Kubernetes clusters that grow with your traffic, handling millions of requests automatically." },
        section3: { title: "GitOps workflows.", subtitle: "Push to git, and let our pipelines handle testing, building, and deploying to production." },
        section4: { title: "Resilient systems.", subtitle: "" },
        detailsSection: {
            title: "Infrastructure as Code",
            description: "We define your entire infrastructure using Terraform or CDKTF. This means your environments are reproducible, version-controlled, and transparent. No more 'it works on my machine'.",
            imageAlt: "Cloud Infra"
        },
        freshnessSection: {
            title: "24/7 Monitoring",
            description: "We set up comprehensive observability with tools like Prometheus and Grafana, giving you real-time insights into system health and alerting you before issues affect users."
        },
        buyNowSection: {
            price: "SLA Retainer",
            unit: "per month",
            processingParams: ["AWS/GCP/DigitalOcean", "CI/CD Pipeline", "Security Audits"],
            deliveryPromise: "Zero-downtime migrations & proactive patch management.",
            returnPolicy: "Monthly executive performance reports."
        },
        budgetRanges: [
            "Infrastructure Audit & Threat Hardening",
            "High-Availability Cloud Migration & Auto-Scaling",
            "24/7 Managed Cloud Operations & SLA Retainer",
            "To Be Determined During Strategy Session"
        ],
        status: ContentStatus.PUBLISHED,
        sortOrder: 5,
        image: "/images/services/cloud_devops_caricature_1771021166591.webp"
    },
    {
        slug: "graphic-design",
        name: "Imprint",
        subName: "Business Identity & Print Design",
        price: "Custom Scope",
        description: "Make your business unforgettable from the very first handshake. We craft executive visual identities that command authority in boardrooms and tenders—including luxury business cards, distinctive logos, corporate profiles, and 100% press-ready print collateral.",
        features: [
            "Executive Business Card Architecture",
            "Distinctive Logos & Brand Guidelines",
            "Tender-Ready Corporate Company Profiles",
            "100% Press-Ready CMYK & Bleed Specs",
            "Professional Marketing & Pitch Decks",
            "High-Resolution Vector Master Files"
        ],
        stats: [
            { label: "Print-Ready", val: "100%" },
            { label: "Design Concepts", val: "2–3" },
            { label: "Fast Turnaround", val: "48h" },
            { label: "Print Resolution", val: "300 DPI" }
        ],
        section1: {
            title: "Imprint.",
            subtitle: "The Mark Your Business Leaves in Every Meeting.",
            image: "/images/services/bs-card-front.webp"
        },
        section2: {
            title: "DESIGN THAT COMMANDS RESPECT.",
            description: "Executive design isn't just decoration — it's commercial leverage. When presenting to corporate clients, investors, or tender committees, your print collateral and brand presentation establish authority before you say a single word.\n\nWe craft cohesive identities engineered to build institutional trust."
        },
        section3: {
            title: "PRESS-READY CMYK PRECISION.",
            description: "Every file we deliver is production-ready for professional press. We handle bleeds, color calibration (CMYK/Pantone), spot UV layers, and die-cut specifications so what you approve is exactly what comes off the printer."
        },
        section4: {
            title: "HOW WE DELIVER.",
            steps: [
                {
                    title: "Brand Brief & Objective",
                    description: "We understand your target audience, meeting contexts, and commercial positioning."
                },
                {
                    title: "Concept Development",
                    description: "2-3 distinct visual concepts exploring clean typography and executive aesthetics."
                },
                {
                    title: "Iterative Refinement",
                    description: "Polishing your selected concept to pixel and print perfection."
                },
                {
                    title: "Press-Ready Handoff",
                    description: "Vector masters, print-ready PDFs with bleed markers, and digital asset packages."
                }
            ]
        },
        detailsSection: {
            title: "WHAT WE CRAFT.",
            description: "Luxury business cards, tender-ready company profiles, executive stationery, logos, and digital presentation decks.",
            imageAlt: "Executive Brand Assets"
        },
        freshnessSection: {
            title: "ENDURING IDENTITY.",
            description: "We avoid short-lived design fads in favor of timeless, authoritative aesthetics that remain modern and respectable for years to come."
        },
        buyNowSection: {
            price: "Custom Scope",
            unit: "per engagement",
            processingParams: ["Executive Cards", "Company Profiles", "Brand Systems"],
            deliveryPromise: "Fast turnaround with 100% press-ready specifications.",
            returnPolicy: "Revision rounds included."
        },
        budgetRanges: [
            "Executive Identity Kit (Business Cards, Letterhead & Brand Assets)",
            "Tender-Ready Corporate Profile & Presentation Deck",
            "Complete Commercial Brand Architecture",
            "To Be Determined During Strategy Session"
        ],
        status: ContentStatus.PUBLISHED,
        sortOrder: 6,
        image: "/images/services/bs-card-front.webp"
    }
];

const contactConfig = {
    services: [
        "Launchpad",
        "Pulse",
        "Backbone",
        "Canvas",
        "Sentinel",
        "Imprint"
    ],
    budgets: {
        "Launchpad": [
            "Accelerated Sprint (M-Pesa Checkout & Fast Go-To-Market)",
            "Commercial Web Platform (Direct Daraja + eTIMS Integration)",
            "High-Scale Custom Web Architecture",
            "To Be Determined During Strategy Session"
        ],
        "Pulse": [
            "MVP Mobile Build (Android + iOS)",
            "Commercial App (Native Daraja STK + Push & Offline Support)",
            "High-Volume Fintech / Enterprise Mobile Platform",
            "To Be Determined During Strategy Session"
        ],
        "Backbone": [
            "Internal Operations System (Inventory / Staff / Workflow)",
            "Custom ERP & Automated eTIMS Invoicing Core",
            "Enterprise Multi-Branch Operations & Financial Engine",
            "To Be Determined During Strategy Session"
        ],
        "Canvas": [
            "Interactive Clickable Prototype (Figma Master)",
            "Full Product Design System & Zero-Waste Developer Handoff",
            "Multi-Platform UX Architecture & User Testing",
            "To Be Determined During Strategy Session"
        ],
        "Sentinel": [
            "Infrastructure Audit & Threat Hardening",
            "High-Availability Cloud Migration & Auto-Scaling",
            "24/7 Managed Cloud Operations & SLA Retainer",
            "To Be Determined During Strategy Session"
        ],
        "Imprint": [
            "Executive Identity Kit (Business Cards, Letterhead & Brand Assets)",
            "Tender-Ready Corporate Profile & Presentation Deck",
            "Complete Commercial Brand Architecture",
            "To Be Determined During Strategy Session"
        ]
    }
};

const contactPhones = [
    { label: "Main", value: "+254 795 213 399" },
    { label: "Support", value: "+254 782 063 736" },
    { label: "Sales", value: "+254 110 861 797" }
];

async function main() {
    console.log('Start seeding ...');

    // 1. Create Default Admin User
    console.log('Creating admin user...');

    // Hash password "admin123"
    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminEmail = 'admin@xinteck.co.ke';

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            passwordHash, // Update password if already exists
        },
        create: {
            email: adminEmail,
            name: 'Xinteck Admin',
            role: Role.SUPER_ADMIN,
            status: UserStatus.ACTIVE,
            passwordHash,
        },
    });
    console.log(`Admin user created: ${adminUser.id}`);

    // 2. Seed Services
    console.log('Seeding Services...');
    // Clean up duplicate/legacy service if present
    await prisma.service.deleteMany({
        where: { slug: 'business-card-design' }
    });
    for (const service of services) {
        // Prepare data matching the schema exactly
        // Note: The schema for Service has Json fields, arrays, etc.
        // We need to ensure the data matches the type expected by Prisma.
        const serviceData = {
            ...service,
            // Ensure section fields are treated as JSON input
            stats: service.stats as any,
            section1: service.section1 as any,
            section2: service.section2 as any,
            section3: service.section3 as any,
            section4: service.section4 as any,
            detailsSection: service.detailsSection as any,
            freshnessSection: service.freshnessSection as any,
            buyNowSection: service.buyNowSection as any,
        };

        const s = await prisma.service.upsert({
            where: { slug: service.slug },
            update: serviceData,
            create: serviceData,
        });
        console.log(`Created service: ${s.slug}`);
    }

    // 3. Migrate Media/Blog Posts from MDX
    const blogDir = path.join(process.cwd(), 'content/blog');
    if (fs.existsSync(blogDir)) {
        console.log('Migrating Blog Posts from MDX...');
        const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
            const { data, content: body } = matter(content);
            const slug = file.replace('.mdx', '');

            // Upsert Category if present
            // Logic: if frontmatter has `tag`, treat as category name
            let categoryId: string | undefined;
            if (data.tag) {
                const categorySlug = data.tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const category = await prisma.blogCategory.upsert({
                    where: { slug: categorySlug },
                    update: {},
                    create: {
                        name: data.tag,
                        slug: categorySlug,
                    },
                });
                categoryId = category.id;
            }

            await prisma.blogPost.upsert({
                where: { slug },
                update: {
                    title: data.title || 'Untitled Post',
                    excerpt: data.excerpt,
                    content: body,
                    status: ContentStatus.PUBLISHED,
                    publishedAt: data.date ? new Date(data.date) : new Date(),
                    authorId: adminUser.id, // Assign to admin
                    categoryId: categoryId,
                },
                create: {
                    slug,
                    title: data.title || 'Untitled Post',
                    excerpt: data.excerpt,
                    content: body,
                    status: ContentStatus.PUBLISHED,
                    publishedAt: data.date ? new Date(data.date) : new Date(),
                    authorId: adminUser.id, // Assign to admin
                    categoryId: categoryId,
                },
            });
            console.log(`Migrated blog post: ${slug}`);
        }
    }

    // 4. Migrate Projects from MDX
    const projectDir = path.join(process.cwd(), 'content/projects');
    if (fs.existsSync(projectDir)) {
        console.log('Migrating Projects from MDX...');
        const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.mdx'));

        for (const file of files) {
            const content = fs.readFileSync(path.join(projectDir, file), 'utf8');
            const { data, content: body } = matter(content);
            const slug = file.replace('.mdx', '');

            // Map category string to Enum
            // Default to WEB_DEV if not matched or custom logic
            // data.category might be "Fintech" which isn't in Enum
            // Enum: WEB_DEV, MOBILE_APP, UI_UX_DESIGN, CUSTOM_SOFTWARE, CONSULTING
            let projectCategory: ProjectCategory = ProjectCategory.WEB_DEV;
            const catLower = (data.category || '').toLowerCase();

            if (catLower.includes('mobile') || catLower.includes('app')) projectCategory = ProjectCategory.MOBILE_APP;
            else if (catLower.includes('design') || catLower.includes('ux')) projectCategory = ProjectCategory.UI_UX_DESIGN;
            else if (catLower.includes('consulting')) projectCategory = ProjectCategory.CONSULTING;
            else if (catLower.includes('software') || catLower.includes('fintech')) projectCategory = ProjectCategory.CUSTOM_SOFTWARE;

            await prisma.project.upsert({
                where: { slug },
                update: {
                    title: data.title || 'Untitled Project',
                    description: data.description ? `${data.description}\n\n${body}` : body,
                    client: data.client,
                    category: projectCategory,
                    status: ProjectStatus.COMPLETED,
                    authorId: adminUser.id,
                },
                create: {
                    slug,
                    title: data.title || 'Untitled Project',
                    description: data.description ? `${data.description}\n\n${body}` : body,
                    client: data.client,
                    category: projectCategory,
                    status: ProjectStatus.COMPLETED,
                    authorId: adminUser.id,
                },
            });
            console.log(`Migrated project: ${slug}`);
        }
    }

    // 5. Seed Site Settings (Contact Options & Phones)
    console.log('Seeding Site Settings...');

    await prisma.siteSetting.upsert({
        where: { key: "contact_options" },
        update: {
            value: JSON.stringify(contactConfig, null, 2),
            type: "JSON",
            category: "forms",
            isPublic: true,
            description: "Configuration for Contact Form Services and Budget Ranges (KES)"
        },
        create: {
            key: "contact_options",
            value: JSON.stringify(contactConfig, null, 2),
            type: "JSON",
            category: "forms",
            isPublic: true,
            description: "Configuration for Contact Form Services and Budget Ranges (KES)"
        }
    });

    await prisma.siteSetting.upsert({
        where: { key: "contact_phones" },
        update: {
            value: JSON.stringify(contactPhones, null, 2),
            type: "JSON",
            category: "contact",
            isPublic: true,
            description: "List of contact phone numbers displayed on the Contact page."
        },
        create: {
            key: "contact_phones",
            value: JSON.stringify(contactPhones, null, 2),
            type: "JSON",
            category: "contact",
            isPublic: true,
            description: "List of contact phone numbers displayed on the Contact page."
        }
    });
    console.log('✅ Site settings seeded.');

    // ═══════════════════════════════════════════════════════════════
    // DISCOVERY CALL AVAILABILITY & HOLIDAYS SEED
    // ═══════════════════════════════════════════════════════════════
    console.log('Seeding Discovery Call availability and holidays...');

    const defaultAvailabilities = [
        { dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isActive: true }, // Mon
        { dayOfWeek: 2, startTime: "09:00", endTime: "17:00", isActive: true }, // Tue
        { dayOfWeek: 3, startTime: "09:00", endTime: "17:00", isActive: true }, // Wed
        { dayOfWeek: 4, startTime: "09:00", endTime: "17:00", isActive: true }, // Thu
        { dayOfWeek: 5, startTime: "09:00", endTime: "12:00", isActive: true }, // Fri (Half-day)
        { dayOfWeek: 6, startTime: "00:00", endTime: "00:00", isActive: false }, // Sat
        { dayOfWeek: 0, startTime: "00:00", endTime: "00:00", isActive: false }, // Sun
    ];

    for (const item of defaultAvailabilities) {
        await prisma.bookingAvailability.upsert({
            where: { dayOfWeek: item.dayOfWeek },
            update: {
                startTime: item.startTime,
                endTime: item.endTime,
                isActive: item.isActive,
            },
            create: item,
        });
    }
    console.log('✅ Weekly availability seeded (Mon-Thu 9-5, Fri 9-12 EAT).');

    const statutoryHolidays = [
        { date: new Date("2026-01-01"), reason: "New Year's Day" },
        { date: new Date("2026-04-03"), reason: "Good Friday" },
        { date: new Date("2026-04-06"), reason: "Easter Monday" },
        { date: new Date("2026-05-01"), reason: "Labour Day" },
        { date: new Date("2026-06-01"), reason: "Madaraka Day" },
        { date: new Date("2026-10-10"), reason: "Utamaduni Day" },
        { date: new Date("2026-10-20"), reason: "Mashujaa Day" },
        { date: new Date("2026-12-12"), reason: "Jamhuri Day" },
        { date: new Date("2026-12-25"), reason: "Christmas Day" },
        { date: new Date("2026-12-26"), reason: "Boxing Day" },
        { date: new Date("2027-01-01"), reason: "New Year's Day" },
        { date: new Date("2027-03-26"), reason: "Good Friday" },
        { date: new Date("2027-03-29"), reason: "Easter Monday" },
        { date: new Date("2027-05-01"), reason: "Labour Day" },
        { date: new Date("2027-06-01"), reason: "Madaraka Day" },
        { date: new Date("2027-10-10"), reason: "Utamaduni Day" },
        { date: new Date("2027-10-20"), reason: "Mashujaa Day" },
        { date: new Date("2027-12-12"), reason: "Jamhuri Day" },
        { date: new Date("2027-12-25"), reason: "Christmas Day" },
        { date: new Date("2027-12-26"), reason: "Boxing Day" },
    ];

    for (const holiday of statutoryHolidays) {
        await prisma.bookingBlockedDate.upsert({
            where: { date: holiday.date },
            update: { reason: holiday.reason },
            create: {
                date: holiday.date,
                reason: holiday.reason,
            },
        });
    }
    console.log('✅ Kenya statutory holidays seeded.');

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
