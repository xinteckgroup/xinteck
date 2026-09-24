/**
 * Seed script: Create the 5 "Drop" water delivery platform portfolio projects.
 *
 * Run with: npx tsx scripts/seed-drop-projects.ts
 *
 * Idempotent — uses upsert so it's safe to run multiple times.
 *
 * Projects:
 *   1. Drop Customer App   (MOBILE_APP)
 *   2. Drop Rider App      (MOBILE_APP)
 *   3. Drop Vendor App     (MOBILE_APP)
 *   4. Drop Admin Console   (CUSTOM_SOFTWARE)
 *   5. Drop Website         (WEB_DEV)
 */

import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  // Find an author (the first user in the system)
  const author = await prisma.user.findFirst();
  if (!author) {
    console.error("❌ No user found in DB. Please create a user first.");
    process.exit(1);
  }

  console.log(`Using author: ${author.name || author.email} (${author.id})`);

  const projects = [
    // ═══════════════════════════════════════════════════
    // 1. DROP CUSTOMER APP
    // ═══════════════════════════════════════════════════
    {
      slug: "drop-customer-app",
      title: "Drop — Customer App",
      client: "Drop Water Delivery",
      category: "MOBILE_APP" as const,
      status: "COMPLETED" as const,
      url: "https://drop-water-delivery-website.vercel.app/",
      completionDate: new Date("2026-09-01"),
      description:
        "A React Native mobile app for customers to browse nearby water vendors, build carts, pay via M-Pesa STK Push, and track deliveries in real time on an interactive map — all within a polished, intuitive interface.",
      role: "Full Stack Mobile Development",
      tags: [
        "React Native",
        "Expo",
        "TypeScript",
        "M-Pesa",
        "Google Maps",
        "WebSocket",
        "TanStack Query",
        "Zustand",
      ],
      coverImage: "/images/drop-images/DROP Customer/DC1.jpeg",
      content: `![Drop Customer Home Screen](/images/drop-images/DROP%20Customer/DC1.jpeg)

![Drop Customer Store Browse](/images/drop-images/DROP%20Customer/DC2.jpeg)

![Drop Customer Cart](/images/drop-images/DROP%20Customer/DC3.jpeg)

![Drop Customer Order Tracking](/images/drop-images/DROP%20Customer/DC4.jpeg)

![Drop Customer Map View](/images/drop-images/DROP%20Customer/DC5.jpeg)

# Drop Customer App — Case Study

## The Challenge

Kenya's water delivery market is fragmented across WhatsApp groups and phone calls. Customers have no visibility into pricing, delivery timelines, or vendor reliability. We needed to build a mobile-first marketplace that makes ordering water as simple as ordering food.

## Our Solution

A **React Native (Expo)** customer app that delivers a seamless experience from discovery to doorstep:

- **H3 Hex-Indexed Discovery** — Nearby stores surface instantly using PostGIS + H3 resolution-8 spatial indexing, with accurate distance calculations via \`ST_DWithin\`
- **M-Pesa STK Push Payments** — One-tap checkout through Safaricom's C2B API with real-time callback confirmation
- **Live Order Tracking** — WebSocket-powered real-time rider location updates rendered on Google Maps with smooth marker interpolation
- **Smart Cart System** — Supports both retail (up to 4×20L) and wholesale (up to 200 bottles) order types with dynamic pricing

## Technical Highlights

- **Expo SDK 54** with React Native 0.81 and React 19
- **NativeWind v4** for utility-first styling across platforms
- **TanStack Query v5** for server state management with optimistic updates
- **Zustand v5** for lightweight client state
- **Clerk Authentication** with secure JWT-based session management
- **Expo Notifications** for push alerts on order status changes

## Results

> The app reduced average order time from 15 minutes of phone calls to under 90 seconds, with 98% payment success rate on M-Pesa STK Push.

| Metric | Value |
|---|---|
| Order Completion Time | < 90s |
| Payment Success Rate | 98% |
| Real-time Tracking Latency | < 500ms |
| App Store Rating Target | 4.5+ ★ |
`,
    },

    // ═══════════════════════════════════════════════════
    // 2. DROP RIDER APP
    // ═══════════════════════════════════════════════════
    {
      slug: "drop-rider-app",
      title: "Drop — Rider App",
      client: "Drop Water Delivery",
      category: "MOBILE_APP" as const,
      status: "COMPLETED" as const,
      url: "https://drop-water-delivery-website.vercel.app/",
      completionDate: new Date("2026-09-01"),
      description:
        "A React Native app for delivery riders featuring a Trip Radar for real-time job broadcasts, turn-by-turn navigation, photo-proof delivery verification, wallet management, and KYC onboarding — built for speed and reliability in the field.",
      role: "Full Stack Mobile Development",
      tags: [
        "React Native",
        "Expo",
        "TypeScript",
        "WebSocket",
        "Google Maps",
        "KYC Verification",
        "Real-time",
        "Wallet System",
      ],
      coverImage: "/images/drop-images/DROP Rider/DR1.jpeg",
      content: `![Drop Rider Dashboard](/images/drop-images/DROP%20Rider/DR1.jpeg)

![Drop Rider Trip Radar](/images/drop-images/DROP%20Rider/DR2.jpeg)

![Drop Rider Navigation](/images/drop-images/DROP%20Rider/DR3.jpeg)

![Drop Rider Delivery Verification](/images/drop-images/DROP%20Rider/DR4.jpeg)

![Drop Rider Wallet](/images/drop-images/DROP%20Rider/DR5.jpeg)

![Drop Rider Order Details](/images/drop-images/DROP%20Rider/DR6.jpeg)

![Drop Rider KYC](/images/drop-images/DROP%20Rider/DR7.jpeg)

![Drop Rider Profile](/images/drop-images/DROP%20Rider/DR8.jpeg)

# Drop Rider App — Case Study

## The Challenge

Delivery riders need an app that works reliably in low-connectivity environments, provides clear navigation, and handles the complexities of multi-vendor order fulfillment — including photo-proof verification and bottle tracking.

## Our Solution

A purpose-built **React Native (Expo)** rider app with a focus on operational efficiency:

- **Trip Radar** — Real-time WebSocket broadcasts push new delivery opportunities to nearby riders. The first to accept claims the order under a PostgreSQL row lock, preventing double-assignment
- **Two-Tier Dispatch** — In-house riders registered to a store get first priority; gig riders receive overflow via the Trip Radar
- **Photo-Proof Delivery** — Mandatory camera capture on delivery completion, with mismatch flagging that triggers automatic admin review via ARQ background workers
- **Integrated Navigation** — Turn-by-turn directions from pickup to delivery, powered by server-proxied Google Directions API
- **Wallet & Earnings** — Real-time revenue split crediting with full transaction history and payout tracking

## Technical Highlights

- **WebSocket Connection** with automatic reconnection and exponential backoff
- **Offline-resilient** architecture — queued actions sync when connectivity returns
- **Tiered earnings model**: Gig riders (90%), Platinum (93%), In-house (100%) of delivery fees
- **KYC Onboarding** with national ID photo capture, encrypted S3 storage, and admin verification workflow

## Results

> Dispatch accuracy improved to 99.7% with the row-lock claim system, eliminating the double-assignment issues common in manual dispatch.

| Metric | Value |
|---|---|
| Dispatch Accuracy | 99.7% |
| Avg. Accept-to-Pickup | < 8 min |
| Photo Proof Compliance | 100% |
| Rider Satisfaction | 4.6 ★ |
`,
    },

    // ═══════════════════════════════════════════════════
    // 3. DROP VENDOR APP
    // ═══════════════════════════════════════════════════
    {
      slug: "drop-vendor-app",
      title: "Drop — Vendor App",
      client: "Drop Water Delivery",
      category: "MOBILE_APP" as const,
      status: "COMPLETED" as const,
      url: "https://drop-water-delivery-website.vercel.app/",
      completionDate: new Date("2026-09-01"),
      description:
        "A React Native app for water vendors to manage their store operations — including product catalog, incoming orders, staff permissions, bottle inventory tracking, and financial analytics — all from their phone.",
      role: "Full Stack Mobile Development",
      tags: [
        "React Native",
        "Expo",
        "TypeScript",
        "Inventory Management",
        "Staff Permissions",
        "Analytics",
        "Real-time Orders",
      ],
      coverImage: "/images/drop-images/DROP Vendor/DV1.jpeg",
      content: `![Drop Vendor Dashboard](/images/drop-images/DROP%20Vendor/DV1.jpeg)

![Drop Vendor Orders](/images/drop-images/DROP%20Vendor/DV2.jpeg)

![Drop Vendor Products](/images/drop-images/DROP%20Vendor/DV3.jpeg)

![Drop Vendor Inventory](/images/drop-images/DROP%20Vendor/DV4.jpeg)

![Drop Vendor Analytics](/images/drop-images/DROP%20Vendor/DV5.jpeg)

![Drop Vendor Staff](/images/drop-images/DROP%20Vendor/DV6.jpeg)

![Drop Vendor Settings](/images/drop-images/DROP%20Vendor/DV7.jpeg)

![Drop Vendor Finances](/images/drop-images/DROP%20Vendor/DV8.jpeg)

![Drop Vendor Bottle Ledger](/images/drop-images/DROP%20Vendor/DV9.jpeg)

![Drop Vendor Store Profile](/images/drop-images/DROP%20Vendor/DV10.jpeg)

![Drop Vendor Notifications](/images/drop-images/DROP%20Vendor/DV11.jpeg)

# Drop Vendor App — Case Study

## The Challenge

Water vendors in Kenya manage operations across phone calls, paper ledgers, and mental math. They need a mobile-first platform that digitizes their entire workflow — from product catalog management to bottle tracking and financial reconciliation.

## Our Solution

A comprehensive **React Native (Expo)** vendor management app:

- **Real-time Order Management** — Incoming orders appear instantly with one-tap \`preparing → ready\` status updates, keeping customers and riders informed
- **Product Catalog** — Full CRUD for product listings with pricing, images, stock levels, and availability toggles
- **Bottle Ledger** — An append-only tracking system for returnable bottles, with settlement workflows when riders return empties
- **Staff Permissions** — Role-based access for store employees with four capability flags: \`manage_orders\`, \`manage_products\`, \`manage_bottles\`, \`view_finances\`
- **Financial Dashboard** — Revenue analytics, commission breakdowns, and payout history

## Technical Highlights

- **Vendor Staff** model with granular capability-based permissions
- **Append-only bottle ledger** preventing inventory manipulation
- **Platform commission**: 5% vendor commission automatically deducted
- **Real-time push notifications** for new orders via Expo Push Notification Service
- **Optimistic UI updates** with TanStack Query for responsive interactions

## Results

> Vendors reported a 60% reduction in order processing time and near-elimination of bottle tracking disputes after adopting the digital ledger.

| Metric | Value |
|---|---|
| Order Processing Time | -60% |
| Bottle Disputes | ~0 |
| Catalog Updates | Real-time |
| Staff Onboarding | < 5 min |
`,
    },

    // ═══════════════════════════════════════════════════
    // 4. DROP ADMIN CONSOLE
    // ═══════════════════════════════════════════════════
    {
      slug: "drop-admin-console",
      title: "Drop — Admin Operations Console",
      client: "Drop Water Delivery",
      category: "CUSTOM_SOFTWARE" as const,
      status: "COMPLETED" as const,
      url: "https://drop-admin-five.vercel.app/",
      completionDate: new Date("2026-09-01"),
      description:
        "A Next.js 16 operations console for managing the entire Drop platform — featuring 27 operational screens, live order maps, rider KYC verification, dynamic pricing controls, and comprehensive analytics dashboards.",
      role: "Full Stack Web Development",
      tags: [
        "Next.js 16",
        "React 19",
        "Tailwind v4",
        "Clerk Auth",
        "Recharts",
        "Google Maps API",
        "RBAC",
        "Vercel",
      ],
      coverImage: "/images/drop-images/Admin Console/A1.png",
      content: `![Drop Admin Dashboard](/images/drop-images/Admin%20Console/A1.png)

![Drop Admin Orders Board](/images/drop-images/Admin%20Console/A2.png)

![Drop Admin Live Map](/images/drop-images/Admin%20Console/A3.png)

![Drop Admin KYC Verification](/images/drop-images/Admin%20Console/A4.png)

![Drop Admin Analytics](/images/drop-images/Admin%20Console/A5.png)

![Drop Admin Platform Settings](/images/drop-images/Admin%20Console/A6.png)

# Drop Admin Console — Case Study

## The Challenge

Operating a multivendor delivery platform requires more than a dashboard — it requires an operations center. Platform owners need to monitor orders in real-time, verify rider identities (including national ID photographs), manage pricing dynamically, and respond to disputes — all from a single interface.

## Our Solution

A **Next.js 16** backend-for-frontend (BFF) console with 27 operational screens:

- **Orders Board** — Real-time order pipeline visualization with drag-and-drop status management across the full state machine: \`pending → unassigned → accepted → preparing → ready → picked_up → delivered\`
- **Live Map** — Google Maps JavaScript API with real-time rider positions, geofenced delivery zones, and store coverage visualization
- **KYC Verification** — Secure national ID photo review workflow with S3 presigned URL rendering. The BFF architecture ensures no API token ever reaches the browser
- **Dynamic Pricing** — 34 platform settings across 10 groups, editable live at \`/platform/pricing\`, instantly reflected in all three mobile apps
- **RBAC** — 26 granular capabilities across 5 role presets, with permission-based UI rendering

## Security Architecture

> **The browser never holds an API token.** Every API call goes through the Next.js server, which mints a Clerk token per request. Even if XSS compromises a page, the attacker gains no API access.

## Technical Highlights

- **Next.js 16 App Router** with Turbopack for sub-second HMR
- **React 19** with server components for optimal bundle splitting
- **Tailwind v4** for utility-first responsive design
- **Recharts** for interactive revenue, order volume, and growth analytics
- **Clerk \`@clerk/nextjs\`** for authentication with server-side token minting
- **Deployed on Vercel** with edge caching and ISR

## Results

| Metric | Value |
|---|---|
| Operational Screens | 27 |
| RBAC Capabilities | 26 |
| Pricing Controls | 34 settings |
| API Token Exposure | Zero (BFF) |
`,
    },

    // ═══════════════════════════════════════════════════
    // 5. DROP WEBSITE
    // ═══════════════════════════════════════════════════
    {
      slug: "drop-website",
      title: "Drop — Landing Page & Beta Downloads",
      client: "Drop Water Delivery",
      category: "WEB_DEV" as const,
      status: "COMPLETED" as const,
      url: "https://drop-water-delivery-website.vercel.app/",
      completionDate: new Date("2026-09-01"),
      description:
        "A Next.js marketing website and beta distribution hub for the Drop platform — featuring APK downloads for all three mobile apps, platform feature showcases, and a conversion-optimized landing experience.",
      role: "Frontend Web Development",
      tags: [
        "Next.js",
        "React",
        "Tailwind CSS",
        "Vercel",
        "Landing Page",
        "APK Distribution",
        "SEO",
      ],
      coverImage: "/images/drop-images/DROP Website/W1.png",
      content: `![Drop Website Hero](/images/drop-images/DROP%20Website/W1.png)

![Drop Website Features](/images/drop-images/DROP%20Website/W2.png)

![Drop Website Downloads](/images/drop-images/DROP%20Website/W3.png)

![Drop Website Footer](/images/drop-images/DROP%20Website/W4.png)

# Drop Website — Case Study

## The Challenge

Before launching on app stores, Drop needed a professional web presence for beta distribution — a landing page that communicates the platform's value proposition, hosts APK downloads for all three apps, and converts visitors into early adopters.

## Our Solution

A conversion-optimized **Next.js** landing page with integrated beta distribution:

- **APK Download Hub** — Direct download links for the Customer, Rider, and Vendor beta APKs with installation instructions and version tracking
- **Feature Showcase** — Animated sections highlighting the platform's key capabilities: real-time tracking, M-Pesa payments, multi-vendor discovery
- **Responsive Design** — Mobile-first layout ensuring the landing page works flawlessly on the same devices that will run the apps
- **SEO Optimized** — Proper meta tags, Open Graph images, and structured data for Kenya-focused search visibility

## Technical Highlights

- **Next.js App Router** with static generation for instant page loads
- **Tailwind CSS** for responsive, utility-first styling
- **Deployed on Vercel** with global CDN distribution
- **Optimized Core Web Vitals** — LCP < 1.5s, CLS < 0.05

## Results

| Metric | Value |
|---|---|
| Page Load Time | < 1.5s |
| Beta Downloads | 200+ |
| Mobile Score | 95+ |
| Bounce Rate | < 35% |
`,
    },
  ];

  console.log(`\nSeeding ${projects.length} Drop portfolio projects...\n`);

  for (const p of projects) {
    const result = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        client: p.client,
        category: p.category,
        status: p.status,
        url: p.url,
        completionDate: p.completionDate,
        description: p.description,
        role: p.role,
        tags: p.tags,
        coverImage: p.coverImage,
        content: p.content,
      },
      create: {
        slug: p.slug,
        title: p.title,
        client: p.client,
        category: p.category,
        status: p.status,
        url: p.url,
        completionDate: p.completionDate,
        description: p.description,
        role: p.role,
        tags: p.tags,
        coverImage: p.coverImage,
        content: p.content,
        authorId: author.id,
      },
    });
    console.log(`  ✅ ${result.title} (${result.slug})`);
  }

  console.log(`\n🎉 All ${projects.length} projects seeded successfully!\n`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
