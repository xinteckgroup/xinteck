import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Xinteck | Software Development & Graphic Design Company in Kenya",
    template: "%s | Xinteck",
  },
  description: "Xinteck builds M-Pesa-ready websites, mobile apps, custom software, and graphic design for businesses in Kenya. eTIMS-compliant. Based in Nairobi.",
  keywords: [
    "software development Kenya",
    "web development Nairobi",
    "mobile app development Kenya",
    "custom software Kenya",
    "UI/UX design Nairobi",
    "graphic design Kenya",
    "business card design Nairobi",
    "M-Pesa integration developer",
    "eTIMS integration Kenya",
    "Next.js developer Kenya",
    "software company East Africa",
    "Xinteck",
    "logo design Kenya",
    "brand identity Nairobi"
  ],
  metadataBase: new URL("https://xinteck.co.ke"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Xinteck | Software Development & Graphic Design Company in Kenya",
    description: "M-Pesa-ready websites, mobile apps, custom software, and graphic design for businesses in Kenya. eTIMS-compliant. Based in Nairobi.",
    url: "https://xinteck.co.ke",
    siteName: "Xinteck",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xinteck | Software Development & Graphic Design Company in Kenya",
    description: "M-Pesa-ready websites, mobile apps, custom software, and graphic design for businesses in Kenya. eTIMS-compliant. Based in Nairobi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Xinteck",
              url: "https://xinteck.co.ke",
              logo: "https://xinteck.co.ke/icon.png",
              description: "M-Pesa-ready websites, mobile apps, custom software, and graphic design for businesses in Kenya. eTIMS-compliant. Based in Nairobi.",
              foundingDate: "2018",
              telephone: "+254795213399",
              priceRange: "KES 5,000 - KES 5,000,000",
              areaServed: {
                "@type": "Country",
                name: "Kenya",
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+254795213399",
                email: "info@xinteck.co.ke",
                contactType: "customer service",
                availableLanguage: ["English", "Swahili"],
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Services",
                itemListElement: [
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Web Development" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Mobile App Development" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "UI/UX Design" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Cloud & DevOps" } },
                  { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Graphic Design" } },
                ],
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body
        className={`${outfit.variable} font-sans antialiased text-foreground transition-colors duration-300`}
      >
        <NextTopLoader 
          color="#B8860B"
          initialPosition={0.08}
          crawlSpeed={50}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={50}
          shadow="0 0 10px #B8860B,0 0 5px #B8860B"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider gaId={gaId}>
             {children}
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
