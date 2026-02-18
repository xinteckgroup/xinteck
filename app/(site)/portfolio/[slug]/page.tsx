import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicProject } from "@/lib/public-data";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { ArrowRight, ChevronLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const project = await getPublicProject(slug);
    if (!project) return { title: "Project Not Found" };
    return {
      title: project.title,
      description: project.description,
    };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const project = await getPublicProject(slug);

  if (!project) {
      notFound();
  }

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">

        {/* Hero Section */}
        <section className="px-6 pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="">

              {/* Back Link */}
              <Link
                href="/portfolio"
                className={`${TYPOGRAPHY.button} inline-flex items-center gap-2 text-white p-2 hover:text-gold-hover hover:-translate-x-1 transition-all mb-8 md:mb-12 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-primary/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]`}
              >
                <ChevronLeft size={16} /> Back to Projects
              </Link>

              <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
                {/* Main Info */}
                <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-primary/10 p-6 md:p-12 lg:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] lg:col-span-2 flex flex-col gap-6">
                  {/* Category + Year Badges */}
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={`${TYPOGRAPHY.badge} px-3 py-1 rounded-[10px] bg-primary/10 text-white border border-primary/20`}>
                      {project.category}
                    </span>
                    <span className={`${TYPOGRAPHY.badge} px-3 py-1 rounded-[10px] bg-white dark:bg-white/5 text-foreground border border-primary/10`}>
                      {project.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-foreground uppercase">
                    {project.title}
                  </h1>

                  {/* Description */}
                  <p className="text-sm md:text-base text-foreground leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-2">
                    <Link
                      href="/contact"
                      className={`${TYPOGRAPHY.button} px-8 py-3 bg-primary text-primary-foreground rounded-[10px] hover:bg-gold-hover transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]`}
                    >
                      Live View <ExternalLink size={16} />
                    </Link>
                    <Link
                      href="/contact"
                      className={`${TYPOGRAPHY.button} px-8 py-3 border-2 border-primary/20 text-foreground rounded-[10px] hover:border-primary/60 hover:text-primary transition-all flex items-center gap-2`}
                    >
                      Source <Github size={16} />
                    </Link>
                  </div>
                </div>

                {/* Project Info Sidebar */}
                <aside className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-primary/10 p-6 md:p-12 lg:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] lg:col-span-1 flex flex-col gap-6 h-fit">
                  <div className="flex flex-col gap-2">
                    <span className={`${TYPOGRAPHY.badge} text-primary`}>The Mission</span>
                    <p className={`${TYPOGRAPHY.cardTitle} text-foreground`}>{project.client}</p>
                  </div>
                  <div className="border-t border-primary/10" />
                  <div className="flex flex-col gap-2">
                    <span className={`${TYPOGRAPHY.badge} text-primary`}>Our Contribution</span>
                    <p className={`${TYPOGRAPHY.cardTitle} text-foreground`}>{project.role}</p>
                  </div>
                  <div className="border-t border-primary/10" />
                  <div className="flex flex-col gap-3">
                    <span className={`${TYPOGRAPHY.badge} text-primary`}>Core Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className={`${TYPOGRAPHY.badge} px-3 py-1 rounded-[10px] bg-white/50 dark:bg-white/5 border border-primary/10 text-foreground/60`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        {project.content && (
          <section className="px-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-primary/10 p-6 md:p-12 lg:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <div
                  className="prose dark:prose-invert max-w-none
                    prose-headings:text-foreground prose-headings:font-black prose-headings:tracking-tight
                    prose-h2:text-lg prose-h2:md:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-primary
                    prose-h3:text-base prose-h3:md:text-lg prose-h3:mt-6 prose-h3:mb-3
                    prose-p:!text-sm prose-p:md:!text-base prose-p:text-foreground/70 prose-p:leading-relaxed
                    prose-strong:text-primary prose-a:text-primary hover:prose-a:underline
                    prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:md:p-8 prose-blockquote:rounded-[10px] prose-blockquote:italic prose-blockquote:text-sm
                    prose-li:text-foreground/70 prose-li:!text-sm prose-li:md:!text-base
                    prose-img:rounded-[10px] prose-img:border prose-img:border-primary/10
                    prose-ul:my-4 prose-ol:my-4"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-primary/10 p-8 md:p-16 lg:p-24 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
              <h4 className={`${TYPOGRAPHY.pageTitle} text-foreground mb-6 md:mb-8 !text-2xl md:!text-4xl`}>
                READY TO <span className="text-primary">SCALE?</span>
              </h4>
              <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/60 max-w-2xl mx-auto mb-8 md:mb-10`}>
                Let&apos;s build something extraordinary together. Our team is ready to bring your vision to life.
              </p>
              <Link
                href="/contact"
                className={`${TYPOGRAPHY.button} inline-flex items-center gap-2 px-8 md:px-12 py-4 md:py-5 bg-foreground text-background rounded-[10px] hover:bg-primary hover:text-primary-foreground transition-all`}
              >
                Start Your Project <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </VideoScrollLayout>
  );
}
