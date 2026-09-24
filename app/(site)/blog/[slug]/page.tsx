import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { BlogFeaturedImage } from "@/components/blog/BlogFeaturedImage";
import { getPublicPost } from "@/lib/public-data";
import { clientMarkdownComponents } from "@/lib/markdown-components";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Calendar, ChevronLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// export const dynamic = "force-static"; // Disabled to prevent build failure if DB is unreachable
// export async function generateStaticParams() { ... }


export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const post = await getPublicPost(slug);
    if (!post) return { title: "Post Not Found" };
    return {
      title: post.title,
      description: post.excerpt,
    };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const post = await getPublicPost(slug);

  if (!post) {
      notFound();
  }

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
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
