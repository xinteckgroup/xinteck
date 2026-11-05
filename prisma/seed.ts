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
        name: "Web Development",
        subName: "Modern Websites & Web Platforms",
        price: "From KES 80,000",
        description: "Your website is often the first impression a customer has of your business. We design and build clean, fast, and mobile-friendly websites that look world-class and actively convert visitors into paying clients. Whether you need a corporate company site, an online store with direct M-Pesa checkout, or a custom booking portal, we make sure it loads instantly on any phone and ranks high on Google.",

        features: [
            "M-Pesa & Card Checkout",
            "Fast on All Mobile Networks",
            "Google SEO Optimized",
            "Simple Admin Dashboard",
            "WhatsApp Chat Integration",
            "99.9% Reliable Uptime"
        ],
        stats: [{ label: "Lighthouse", val: "100" }, { label: "Uptime", val: "99.9%" }, { label: "Speed", val: "<100ms" }],
        section1: { title: "Web Development.", subtitle: "Digital Excellence." },
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
            price: "From KES 80,000",
            unit: "per project",
            processingParams: ["SEO Ready", "Analytics", "CMS Integration"],
            deliveryPromise: "Agile delivery with bi-weekly demos. Full source code ownership.",
            returnPolicy: "30-day bug fix warranty included."
        },
        status: ContentStatus.PUBLISHED,
        sortOrder: 1,
        image: "/images/services/web_dev_caricature_1771020665861.webp"
    },
    {
        slug: "mobile-app-development",
        name: "Mobile Apps",
        subName: "Android & iOS Applications",
        price: "From KES 200,000",
        description: "Put your business directly into your customers' pockets. We build intuitive, easy-to-use mobile apps for both Android and iPhone from a single codebase. Whether you're launching an on-demand delivery app, a customer loyalty program, or an internal tool for your field team, our apps run smoothly, work reliably even with weak internet, and make doing business with you effortless.",

        features: [
            "Android & iPhone in One App",
            "Instant Push Notifications",
            "Works Offline & Low Data Use",
            "In-App M-Pesa & SMS Alerts",
            "Google Play & App Store Setup",
            "Easy for Anyone to Use"
        ],
        stats: [{ label: "Platforms", val: "2" }, { label: "Code Share", val: "90%" }, { label: "FPS", val: "60" }],
        section1: { title: "Mobile Apps.", subtitle: "Native Performance." },
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
            price: "From KES 200,000",
            unit: "per project",
            processingParams: ["iOS + Android", "Push Notifs", "Biometrics"],
            deliveryPromise: "TestFlight builds delivered weekly.",
            returnPolicy: "Post-launch crash monitoring included."
        },
        status: ContentStatus.PUBLISHED,
        sortOrder: 2,
        image: "/images/services/mobile_app_caricature_1771020693351.webp"
    },
    {
        slug: "custom-software-development",
        name: "Custom Software",
        subName: "Business Systems & Automation",
        price: "From KES 300,000",
        description: "When off-the-shelf software doesn't fit the way your company actually runs, we build custom systems tailored to your unique operations. We help businesses replace disorganized spreadsheets and manual paperwork with unified management portals, inventory trackers, and eTIMS-ready invoicing—giving your team peace of mind and saving hours of administrative time every single week.",

        features: [
            "Built for Your Exact Workflow",
            "eTIMS Invoicing & KRA Ready",
            "Inventory & Stock Tracking",
            "Staff Portals & Role Permissions",
            "Automated Reports & Analytics",
            "Full Data Privacy & Backups"
        ],
        stats: [{ label: "Security", val: "AES-256" }, { label: "Scale", val: "Unltd" }, { label: "API", val: "REST/QL" }],
        section1: { title: "Custom Software.", subtitle: "Tailored Solutions." },
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
            price: "From KES 300,000",
            unit: "per project",
            processingParams: ["Cloud Native", "Dockerized", "CI/CD Pipeline"],
            deliveryPromise: "Phased rollout with user training.",
            returnPolicy: "SLA-backed support agreements."
        },
        status: ContentStatus.PUBLISHED,
        sortOrder: 3,
        image: "/images/services/custom_software_caricature_1771020721906.webp"
    },
    {
        slug: "ui-ux-design",
        name: "UI/UX Design",
        subName: "Product Design & Prototyping",
        price: "From KES 50,000",
        description: "Before writing any code, we test and perfect how your app or website will look and feel. We craft intuitive screens and clickable prototypes so you and your team can test the complete user experience before development begins. By putting your customers' needs first, we create digital journeys that are enjoyable to navigate, keep users engaged, and drive higher sales.",

        features: [
            "Interactive Clickable Prototypes",
            "User-Friendly Journey Flows",
            "Modern Visual Aesthetics",
            "High-Conversion Screen Layouts",
            "Tested for Low Customer Friction",
            "Complete Design System Handoff"
        ],
        stats: [{ label: "Users", val: "Happy" }, { label: "Conversion", val: "+40%" }, { label: "Awards", val: "Yes" }],
        section1: { title: "UI/UX Design.", subtitle: "User Centric." },
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
            price: "From KES 50,000",
            unit: "per project",
            processingParams: ["Figma Files", "Style Guide", "Assets"],
            deliveryPromise: "Developer-ready handover files.",
            returnPolicy: "Unlimited revisions during design phase."
        },
        status: ContentStatus.PUBLISHED,
        sortOrder: 4,
        image: "/images/services/ui_ux_caricature_1771020743886.webp"
    },
    {
        slug: "cloud-devops",
        name: "Cloud & DevOps",
        subName: "Cloud Hosting & Security",
        price: "From KES 80,000 / mo",
        description: "Keep your digital platforms running smoothly around the clock without sudden crashes, slow loading times, or security worries. We set up and manage secure cloud servers with automatic daily backups, real-time monitoring, and enterprise-grade security. Whether you're handling 20 visitors or 20,000 during a big promotion, your platform stays fast, stable, and cost-efficient.",

        features: [
            "24/7 Uptime & Monitoring",
            "Automatic Daily Data Backups",
            "Advanced Security & Threat Shield",
            "Handles High Traffic Without Crashing",
            "Cloud Cost Optimization",
            "Fast Disaster Recovery Plan"
        ],
        stats: [{ label: "Uptime", val: "99.99%" }, { label: "Deploy", val: "Auto" }, { label: "Cost", val: "-30%" }],
        section1: { title: "Cloud & DevOps.", subtitle: "Infrastructure." },
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
            price: "From KES 80,000",
            unit: "per month",
            processingParams: ["AWS/GCP/Azure", "CI/CD Setup", "Audits"],
            deliveryPromise: "Zero-downtime migrations.",
            returnPolicy: "Monthly performance reports."
        },
        status: ContentStatus.PUBLISHED,
        sortOrder: 5,
        image: "/images/services/cloud_devops_caricature_1771021166591.webp"
    },
    {
        slug: "graphic-design",
        name: "Graphic Design",
        subName: "Brand Identity & Print Design",
        price: "From KES 5,000",
        description: "Make your business unforgettable from the very first handshake. We create distinctive visual identities that build instant credibility—including executive business cards that command respect in meetings, memorable logos, company profiles, and branded marketing materials. Everything we design is 100% print-ready with accurate color setups, so what you approve on screen is exactly what comes off the press.",
        features: [
            "Premium Business Card Design",
            "Memorable Logos & Brand Style Guides",
            "Professional Company Profiles",
            "100% Print-Ready (CMYK & Bleeds)",
            "Social Media & Marketing Graphics",
            "High-Resolution Vector Files"
        ],
        stats: [
            { label: "Print-Ready", val: "100%" },
            { label: "Design Concepts", val: "2–3" },
            { label: "Fast Turnaround", val: "48h" },
            { label: "Print Resolution", val: "300 DPI" }
        ],
        section1: {
            title: "VISUAL IDENTITY THAT COMMANDS ATTENTION.",
            subtitle: "From business cards to full brand systems, we craft designs that leave lasting impressions. Every pixel is intentional, every color purposeful.",
            image: "/images/services/bs-card-front.webp"
        },
        section2: {
            title: "DESIGN THAT CONVERTS.",
            description: "Great design isn't just aesthetic — it's strategic. We create visual assets that communicate your brand's value proposition at a glance, building trust and driving engagement from the first touchpoint.\n\nOur design philosophy combines modern minimalism with bold brand expression, ensuring your materials stand out in any context — digital or print."
        },
        section3: {
            title: "PRINT-READY PRECISION.",
            description: "Every design we deliver is production-ready. We handle bleeds, color profiles (CMYK/RGB), resolution standards, and die-cut specifications so your prints come out flawless every time.\n\nFrom premium card stocks to large-format banners, we optimize for the medium."
        },
        section4: {
            title: "HOW WE DESIGN.",
            steps: [
                {
                    title: "Discovery & Brief",
                    description: "We learn your brand, audience, and goals. A detailed creative brief ensures alignment before any design work begins."
                },
                {
                    title: "Concept Development",
                    description: "Multiple design concepts are explored, each rooted in strategic thinking and contemporary design trends."
                },
                {
                    title: "Refinement",
                    description: "Your chosen concept is refined through iterative feedback rounds until every detail is perfect."
                },
                {
                    title: "Final Delivery",
                    description: "Print-ready and digital-ready files delivered in all required formats (PDF, AI, PNG, SVG, etc.)."
                }
            ]
        },
        detailsSection: {
            title: "WHAT WE DESIGN.",
            description: "From luxury business cards and executive stationery to comprehensive brand identity systems, logos, corporate pitch decks, and digital collateral.",
            imageAlt: "Graphic Design Assets"
        },
        freshnessSection: {
            title: "DESIGN TRENDS, TIMELESS RESULTS.",
            description: "We stay current with global design trends while building assets that won't feel dated in a year. Our work balances trend-awareness with timeless design principles — clean typography, purposeful whitespace, and cohesive color systems that scale across every touchpoint."
        },
        buyNowSection: {
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
                    includes: [
                        "2 initial design concepts",
                        "2 revision rounds",
                        "Print-ready files (PDF, AI)",
                        "CMYK color profile + bleed setup"
                    ],
                    turnaround: "48 hours",
                    popular: true,
                    note: "Design only — printing not included."
                },
                {
                    name: "Logo Design",
                    price: "KES 15,000",
                    description: "Custom professional logo with full file package.",
                    includes: [
                        "3 initial concepts",
                        "3 revision rounds",
                        "All formats (SVG, PNG, AI, PDF)",
                        "Brand color codes (HEX, RGB, CMYK)",
                        "Light & dark versions"
                    ],
                    turnaround: "3–5 business days"
                },
                {
                    name: "Brand Identity Kit",
                    price: "KES 45,000",
                    description: "Complete visual brand system for a professional presence.",
                    includes: [
                        "Logo design (full package)",
                        "Business card design",
                        "Letterhead & envelope templates",
                        "Brand guidelines document",
                        "2 social media profile templates"
                    ],
                    turnaround: "7–10 business days",
                    popular: false
                },
                {
                    name: "Full Brand Package",
                    price: "KES 120,000",
                    description: "End-to-end brand identity and marketing collateral.",
                    includes: [
                        "Everything in Brand Identity Kit",
                        "Corporate presentation deck",
                        "Email signature template",
                        "Flyer / brochure design",
                        "Social media kit (5 templates)",
                        "Vehicle branding mockup"
                    ],
                    turnaround: "2–3 weeks"
                }
            ]
        },
        status: ContentStatus.PUBLISHED,
        sortOrder: 6,
        image: "/images/services/bs-card-front.webp"
    }
];

const contactConfig = {
    services: [
        "Web Development",
        "Mobile App Dev",
        "Custom Software",
        "UI/UX Design",
        "Cloud & DevOps",
        "Graphic Design"
    ],
    budgets: {
        "Web Development": ["KES 80k - 200k", "KES 200k - 600k", "KES 600k - 2M", "KES 2M+"],
        "Mobile App Dev": ["KES 200k - 400k", "KES 400k - 1M", "KES 1M - 3M", "KES 3M+"],
        "Custom Software": ["KES 300k - 700k", "KES 700k - 2M", "KES 2M - 5M", "KES 5M+"],
        "UI/UX Design": ["KES 50k - 150k", "KES 150k - 400k", "KES 400k - 800k", "KES 800k+"],
        "Cloud & DevOps": ["KES 80k - 200k", "KES 200k - 500k", "KES 500k+"],
        "Graphic Design": ["KES 5k - 15k", "KES 15k - 50k", "KES 50k - 150k", "KES 150k+"]
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
