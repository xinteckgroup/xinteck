import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicPost } from "@/lib/public-data";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Calendar, ChevronLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <article className="py-20 px-6 max-w-4xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] shadow-lg my-12 md:my-20 md:p-12">
      <Link 
        href="/blog" 
        className="flex items-center gap-2 text-gold font-bold mb-12 hover:-translate-x-2 transition-transform w-fit"
      >
        <ChevronLeft size={20} /> Back to Insights
      </Link>
      
      <header className="flex flex-col gap-8 mb-16">
        <div className="flex flex-wrap items-center gap-6 text-sm text-foreground/40 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-2 text-gold"><User size={16} /> {post.author}</span>
          <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
          <span className="flex items-center gap-2"><Clock size={16} /> {post.readTime}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          {post.title}
        </h1>
        
        <p className="text-2xl text-foreground/60 italic leading-relaxed">
          "{post.excerpt}"
        </p>
      </header>

      <div className="prose dark:prose-invert prose-headings:text-foreground prose-gold max-w-none 
        prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic
        prose-p:text-foreground/70 prose-p:text-lg prose-p:leading-relaxed
        prose-strong:text-gold prose-a:text-gold hover:prose-a:underline
        prose-blockquote:border-l-gold prose-blockquote:bg-primary/5 prose-blockquote:p-8 prose-blockquote:rounded-[10px]
        prose-li:text-foreground/70 prose-img:rounded-[10px] prose-img:border prose-img:border-primary/20"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      <div className="mt-24 pt-12 border-t border-primary/10 flex flex-col items-center gap-8 text-center text-foreground/40">
          <p className="max-w-md">
            Want more engineering insights? Join our mission to build the future of software.
          </p>
          <Link href="/blog" className="px-8 py-2 border border-primary/20 rounded-full hover:border-gold hover:text-gold transition-all font-bold">
            Explore More Posts
          </Link>
      </div>
    </article>
  </VideoScrollLayout>
  );
}
