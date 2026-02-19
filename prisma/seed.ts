import { ContentStatus, PrismaClient, ProjectCategory, ProjectStatus, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

const prisma = new PrismaClient();

// Initial Data
const services = [
    {
        slug: "web-development",
        name: "Web Development",
        subName: "Digital Excellence.",
        price: "Custom",
        description: "Next.js 14+ - High Performance - SEO Optimized",
        themeColor: "#00B4D8", // Cyan

        features: ["Next.js App Router", "Server Components", "Edge Caching"],
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
            price: "From $5k",
            unit: "per project",
            processingParams: ["SEO Ready", "Analytics", "CMS Integration"],
            deliveryPromise: "Agile delivery with bi-weekly demos. Full source code ownership.",
            returnPolicy: "30-day bug fix warranty included."
        },
        isActive: true,
        sortOrder: 1,
        image: "/images/services/web_dev_caricature_1771020665861.png"
    },
    {
        slug: "mobile-app-development",
        name: "Mobile Apps",
        subName: "Native Performance.",
        price: "Custom",
        description: "React Native - iOS & Android - Smooth 60FPS",
        themeColor: "#AF52DE", // Purple

        features: ["Cross-Platform", "Native Modules", "Offline Mode"],
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
            price: "From $8k",
            unit: "per project",
            processingParams: ["iOS + Android", "Push Notifs", "Biometrics"],
            deliveryPromise: "TestFlight builds delivered weekly.",
            returnPolicy: "Post-launch crash monitoring included."
        },
        isActive: true,
        sortOrder: 2,
        image: "/images/services/mobile_app_caricature_1771020693351.png"
    },
    {
        slug: "custom-software-development",
        name: "Custom Software",
        subName: "Tailored Solutions.",
        price: "Enterprise",
        description: "Microservices - Scalable - Secure",
        themeColor: "#FF9500", // Orange

        features: ["Enterprise Grade", "SaaS Ready", "API First"],
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
            price: "Contact Us",
            unit: "per scope",
            processingParams: ["Cloud Native", "Dockerized", "CI/CD Pipeline"],
            deliveryPromise: "Phased rollout with user training.",
            returnPolicy: "SLA-backed support agreements."
        },
        isActive: true,
        sortOrder: 3,
        image: "/images/services/custom_software_caricature_1771020721906.png"
    },
    {
        slug: "ui-ux-design",
        name: "UI/UX Design",
        subName: "User Centric.",
        price: "Custom",
        description: "Figma - Prototyping - Design Systems",
        themeColor: "#FF2D55", // Pinkish Red

        features: ["User Research", "Wireframing", "Hi-Fi Visuals"],
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
            price: "From $3k",
            unit: "per sprint",
            processingParams: ["Figma Files", "Style Guide", "Assets"],
            deliveryPromise: "Developer-ready handover files.",
            returnPolicy: "Unlimited revisions during design phase."
        },
        isActive: true,
        sortOrder: 4,
        image: "/images/services/ui_ux_caricature_1771020743886.png"
    },
    {
        slug: "cloud-devops",
        name: "Cloud & DevOps",
        subName: "Infrastructure.",
        price: "Retainer",
        description: "AWS/Azure - Kubernetes - Terraform",
        themeColor: "#34C759", // Green

        features: ["Auto Scaling", "Cost Optics", "Security Ops"],
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
            price: "Contact Us",
            unit: "monthly",
            processingParams: ["AWS/GCP/Azure", "CI/CD Setup", "Audits"],
            deliveryPromise: "Zero-downtime migrations.",
            returnPolicy: "Monthly performance reports."
        },
        isActive: true,
        sortOrder: 5,
        image: "/images/services/cloud_devops_caricature_1771021166591.png"
    }
];

const contactConfig = {
    services: [
        "Web Development",
        "Mobile App Dev",
        "Custom Software",
        "UI/UX Design",
        "Cloud & DevOps"
    ],
    budgets: {
        "Web Development": ["15k - 25k", "25k - 50k", "50k - 100k", "100k+"],
        "Mobile App Dev": ["80k - 100k", "100k+"],
        "Custom Software": ["25k - 50k", "50k - 100k", "100k+"],
        "UI/UX Design": ["15k - 25k", "25k - 50k", "50k - 100k", "100k+"],
        "Cloud & DevOps": ["15k - 25k", "25k - 50k", "50k - 100k", "100k+"]
    }
};

const contactPhones = [
    { label: "Main", value: "+254 782 063 736" },
    { label: "Support", value: "+254 795 213 399" },
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
