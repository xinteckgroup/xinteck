import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { BlogFeaturedImage } from "@/components/blog/BlogFeaturedImage";
import { BlogViewTracker } from "@/components/blog/BlogViewTracker";
import { getPublicPost } from "@/lib/public-data";
import { clientMarkdownComponents } from "@/lib/markdown-components";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Calendar, ChevronLeft, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function getAbsoluteImageUrl(imagePath?: string): string {
  if (!imagePath) return "https://xinteck.co.ke/images/home-ui/fallback.webp";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `https://xinteck.co.ke${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
}

type BlogSlugParams = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateMetadata({ params }: BlogSlugParams): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPublicPost(slug);
    if (!post) {
      return { 
        title: "Post Not Found | Xinteck Blog",
        description: "The requested article could not be found."
      };
    }

    const postUrl = `https://xinteck.co.ke/blog/${post.slug}`;
    const postTitle = `${post.title} | Xinteck Insights`;
    const postDescription = post.excerpt || "Read technical architecture insights and engineering deep dives from Xinteck.";
    const imageUrl = getAbsoluteImageUrl(post.featuredImage || post.image);

    return {
      title: postTitle,
      description: postDescription,
      alternates: {
        canonical: `/blog/${post.slug}`,
      },
      openGraph: {
        title: post.title,
        description: postDescription,
        url: postUrl,
        siteName: "Xinteck",
        locale: "en_KE",
        type: "article",
        publishedTime: post.publishedAtISO,
        modifiedTime: post.updatedAtISO || post.publishedAtISO,
        authors: [post.author || "Xinteck Engineering Team"],
        section: post.tag,
        tags: [post.tag, "Kenyan Tech", "M-Pesa", "eTIMS", "Software Engineering", "Xinteck"],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: postDescription,
        images: [imageUrl],
        creator: "@xinteck",
        site: "@xinteck",
      },
    };
}

export default async function BlogPostPage({ params }: BlogSlugParams) {
  const { slug } = await params;
  const post = await getPublicPost(slug);

  if (!post) {
      notFound();
  }

  const postUrl = `https://xinteck.co.ke/blog/${post.slug}`;
  const imageUrl = getAbsoluteImageUrl(post.featuredImage || post.image);

  // Schema.org Article / BlogPosting structured data for Google and social crawlers
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl,
    },
    "headline": post.title,
    "description": post.excerpt,
    "image": [imageUrl],
    "datePublished": post.publishedAtISO || undefined,
    "dateModified": post.updatedAtISO || post.publishedAtISO || undefined,
    "author": {
      "@type": "Organization",
      "name": post.author || "Xinteck Engineering Team",
      "url": "https://xinteck.co.ke",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Xinteck",
      "url": "https://xinteck.co.ke",
      "logo": {
        "@type": "ImageObject",
        "url": "https://xinteck.co.ke/icon.png",
      },
    },
    "articleSection": post.tag,
    "keywords": `${post.tag}, Kenyan Tech, M-Pesa, eTIMS, Software Engineering Kenya, Xinteck`,
    "inLanguage": "en-KE",
  };

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
      {/* Session-debounced View Tracker */}
      <BlogViewTracker slug={post.slug} />

      {/* JSON-LD Article Schema for Google, WhatsApp, LinkedIn, and Rich Previews */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="py-20 px-6 max-w-7xl mx-auto my-12 md:my-20 flex flex-col gap-8 md:gap-12">
        <Link 
          href="/blog" 
          className="flex items-center gap-2 text-gold font-bold hover:-translate-x-2 transition-transform w-fit bg-white/5 dark:bg-white/5 px-4 py-2 rounded-full border border-primary/10 backdrop-blur-md"
        >
          <ChevronLeft size={20} /> Back to Insights
        </Link>

        {/* Header Card */}
        <header className="flex flex-col gap-6 md:gap-10 bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[20px] shadow-2xl p-8 md:p-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight md:leading-none text-foreground">
            {post.title}
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 italic leading-relaxed max-w-4xl border-l-4 border-gold pl-6">
            &quot;{post.excerpt}&quot;
          </p>
        </header>

        {/* Metadata Navigation Bar */}
        <div className="flex flex-wrap items-center gap-4 bg-white/60 dark:bg-[#0A0A0A] backdrop-blur-xl border border-primary/10 rounded-[12px] p-4 md:p-6 shadow-md text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/70">
          <div className="flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-[8px]">
            <User size={16} /> <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary/5 dark:bg-white/5 px-4 py-2 rounded-[8px]">
            <Calendar size={16} /> <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2 bg-primary/5 dark:bg-white/5 px-4 py-2 rounded-[8px]">
            <Clock size={16} /> <span>{post.readTime}</span>
          </div>
        </div>

        {/* Featured Image - prominently positioned above content */}
        {post.featuredImage && (
          <BlogFeaturedImage src={post.featuredImage} alt={post.title} />
        )}

        {/* Main Content Body */}
        <article className="bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[20px] shadow-2xl p-8 md:p-16 lg:px-24 clear-both break-words overflow-hidden">
          <div className="max-w-none break-words">
            {post.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={clientMarkdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-foreground/40 italic">
                    <p>No content to preview.</p>
                </div>
            )}
          </div>

          <div className="mt-24 pt-12 border-t border-primary/10 flex flex-col items-center gap-8 text-center text-foreground">
              <p className="max-w-md text-lg font-medium text-foreground">
                Want more engineering insights? Join our mission to build the future of software.
              </p>
              <Link href="/blog" className="px-8 py-3 bg-gold text-black rounded-full hover:bg-gold/80 transition-all font-black uppercase tracking-wider shadow-lg">
                Explore More Posts
              </Link>
          </div>
        </article>
      </div>
  </VideoScrollLayout>
  );
}
