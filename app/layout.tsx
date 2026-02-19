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
    default: "Xinteck | Software Development Company in Kenya",
    template: "%s | Xinteck",
  },
  description: "Xinteck is a premium software development company in Nairobi, Kenya. We build high-performing websites, mobile apps, and custom software for businesses across East Africa.",
  keywords: ["software development Kenya", "web development Nairobi", "mobile app development Kenya", "custom software Kenya", "UI/UX design Nairobi", "Next.js developer Kenya", "software company East Africa", "Xinteck"],
  metadataBase: new URL("https://xinteck.co.ke"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Xinteck | Software Development Company in Kenya",
    description: "Premium web, mobile, and custom software solutions for modern businesses in Kenya and East Africa.",
    url: "https://xinteck.co.ke",
    siteName: "Xinteck",
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xinteck | Software Development Company in Kenya",
    description: "Premium web, mobile, and custom software solutions for modern businesses in Kenya and East Africa.",
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
              description: "Premium software development company in Nairobi, Kenya. Web development, mobile apps, custom software, and UI/UX design.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "info@xinteck.co.ke",
                contactType: "customer service",
                availableLanguage: ["English", "Swahili"],
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
