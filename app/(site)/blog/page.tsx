import { BlogListClient } from "@/components/blog/BlogListClient";
import { BlogNewsletter } from "@/components/sections/BlogNewsletter";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicPosts } from "@/lib/public-data";
import { VIDEO_STATS } from "@/lib/videoStats";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights & Innovation | Xinteck Blog",
  description: "Deep dives into scalable web architecture, M-Pesa rails, KRA eTIMS compliance, and software engineering in Kenya.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Insights & Innovation | Xinteck Blog",
    description: "Deep dives into scalable web architecture, M-Pesa rails, KRA eTIMS compliance, and software engineering in Kenya.",
    url: "https://xinteck.co.ke/blog",
    siteName: "Xinteck",
    locale: "en_KE",
    type: "website",
    images: [
      {
        url: "https://xinteck.co.ke/images/home-ui/fallback.webp",
        width: 1200,
        height: 630,
        alt: "Xinteck Blog - Insights & Innovation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Innovation | Xinteck Blog",
    description: "Deep dives into scalable web architecture, M-Pesa rails, KRA eTIMS compliance, and software engineering in Kenya.",
    images: ["https://xinteck.co.ke/images/home-ui/fallback.webp"],
    creator: "@xinteck",
    site: "@xinteck",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const sortedPosts = await getPublicPosts();

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">
        
        {/* Client Side Search & List */}
        <BlogListClient allPosts={sortedPosts} />

        {/* Newsletter Section */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto">
            <BlogNewsletter />
          </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
