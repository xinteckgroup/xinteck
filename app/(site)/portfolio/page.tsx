import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getPublicProjects } from "@/lib/public-data";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import Link from "next/link";

export const metadata = {
  title: "Portfolio | Our Work",
  description: "Explore our portfolio of premium software solutions and digital experiences.",
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const projects = await getPublicProjects();

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.portfolio.src} videoStats={VIDEO_STATS.portfolio}>
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">
        {/* Hero Section */}
        <section className="px-6 pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center gap-6 md:gap-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-4 md:gap-6">
                <h1 className="text-sm md:text-base font-bold text-gold uppercase tracking-[0.2em] mb-2">
                  Proof of Excellence
                </h1>
                <h2 className="text-2xl md:text-7xl font-extrabold tracking-tighter text-foreground uppercase">
                  OUR <span className="text-gold">LEGACY.</span>
                </h2>
                <p className={`${TYPOGRAPHY.pageSubtitle} max-w-3xl mx-auto`}>
                  We don&apos;t talk about features; we talk about results. 
                  Explore the digital landscapes we&apos;ve shaped for industry leaders and disruptors.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { val: "99.9%", label: "Uptime Delivered" },
                { val: "100%", label: "Client Retention" },
                { val: "<1 Week", label: "Sprint Delivery Cycle" },
                { val: "24/7", label: "Support & Monitoring" },
                { val: "10+", label: "Tech Stack Integrations" },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="flex flex-col gap-4 text-center bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 transition-all shadow-lg"
                >
                  <div className={`${TYPOGRAPHY.pageTitle} text-gold`}>
                    {item.val}
                  </div>
                  <div className={`${TYPOGRAPHY.tableHeader} text-foreground`}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 md:mb-16 text-center bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
              <h3 className="text-sm md:text-base font-bold text-foreground uppercase tracking-[0.2em] mb-4">
                Featured Work
              </h3>
              <h4 className="text-xl md:text-4xl font-extrabold tracking-tighter text-foreground uppercase">
                PROJECTS WE <span className="text-foreground">BUILT.</span>
              </h4>
            </div>
            <ProjectGrid initialProjects={projects} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-8 md:p-24 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
            <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground mb-6 md:mb-8`}>
              HAVE A VISION? <br />
              <span className="text-gold">LET&apos;S CODE IT.</span>
            </h3>
            <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground max-w-2xl mx-auto mb-8 md:mb-10`}>
              Join the ranks of industry leaders who trust us to turn their boldest ideas into reality.
            </p>
            <Link 
              href="/contact"
              className={`inline-flex items-center gap-2 px-8 md:px-12 py-4 md:py-5 bg-foreground text-background font-black rounded-[10px] hover:bg-gold-hover transition-all ${TYPOGRAPHY.button}`}
            >
              Start Your Journey
            </Link>
          </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
