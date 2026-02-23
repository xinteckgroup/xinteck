import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicPost } from "@/lib/public-data";
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
            "{post.excerpt}"
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
            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden border border-primary/20 shadow-2xl flex-shrink-0">
               <img 
                   src={post.featuredImage} 
                   alt={post.title} 
                   className="object-cover w-full h-full"
                   onError={(e) => { e.currentTarget.src = "/images/placeholder.jpg"; e.currentTarget.onerror = null; }}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            </div>
        )}

        {/* Main Content Body */}
        <article className="bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[20px] shadow-2xl p-8 md:p-16 lg:px-24 clear-both break-words overflow-hidden">
          <div className="prose dark:prose-invert prose-emerald max-w-none text-foreground break-words prose-p:break-words prose-a:break-all">
            {post.content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }: any) => {
                    // Extract alignment tag from alt text: "My beautiful img#left" -> left
                    const parts = (props.alt || "").split("#");
                    const altText = parts[0];
                    const align = parts.length > 1 ? parts[1].toLowerCase() : "center";
                    
                    let alignmentClass = "block mx-auto max-w-full"; // Default
                    if (align === "left") alignmentClass = "float-left md:mr-8 mb-6 max-w-full md:max-w-[45%]";
                    if (align === "right") alignmentClass = "float-right md:ml-8 mb-6 max-w-full md:max-w-[45%]";

                    return (
                        <img 
                            {...props} 
                            alt={altText}
                            className={`rounded-[16px] shadow-xl my-6 border border-primary/20 object-cover ${alignmentClass}`} 
                        />
                    );
                  },
                  h1: ({ node, ...props }: any) => (
                    <h1 {...props} className="clear-both text-3xl md:text-5xl font-black tracking-tighter italic text-gold mb-6 pb-2 border-b border-primary/10" />
                  ),
                  h2: ({ node, ...props }: any) => (
                    <h2 {...props} className="clear-both text-2xl md:text-3xl font-black tracking-tighter italic text-foreground mt-8 mb-4" />
                  ),
                  h3: ({ node, ...props }: any) => (
                    <h3 {...props} className="clear-both text-xl md:text-2xl font-bold tracking-tight text-foreground/90 mt-6 mb-3" />
                  ),
                  p: ({ node, ...props }: any) => (
                    <p {...props} className="text-lg leading-relaxed mb-4 text-foreground/80" />
                  ),
                  a: ({ node, ...props }: any) => (
                    <a {...props} className="text-gold hover:underline underline-offset-4" target="_blank" rel="noopener noreferrer" />
                  ),
                  blockquote: ({ node, ...props }: any) => (
                    <blockquote {...props} className="clear-both border-l-4 border-gold bg-primary/5 p-8 my-6 rounded-[10px] text-foreground/90 italic" />
                  ),
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code {...props} className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-[4px] font-mono text-sm text-foreground" />
                    ) : (
                      <pre className="clear-both bg-[#0D0D0D] p-4 rounded-[12px] border border-primary/20 overflow-x-auto my-6 shadow-xl">
                        <code {...props} className="font-mono text-sm text-white" />
                      </pre>
                    ),
                  ul: ({ node, ...props }: any) => (
                    <ul {...props} className="clear-both list-disc list-outside ml-6 mb-4 space-y-2 text-foreground/80" />
                  ),
                  ol: ({ node, ...props }: any) => (
                    <ol {...props} className="clear-both list-decimal list-outside ml-6 mb-4 space-y-2 text-foreground/80" />
                  ),
                  li: ({ node, ...props }: any) => <li {...props} className="pl-2 marker:text-gold" />,
                  strong: ({ node, ...props }: any) => <strong {...props} className="font-bold text-gold" />,
                }}
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
