"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { PublicService } from "@/lib/public-data";
import { SERVICE_UI_MAP } from "@/lib/service-ui-map";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Code } from "lucide-react"; // Default icon
import Link from "next/link";

export function ServicePageClient({ service }: { service: PublicService }) {
  
  const ui = SERVICE_UI_MAP[service.slug] || SERVICE_UI_MAP["default"];
  const HeroIcon = ui.icon;
  const MockupComponent = ui.mockup;

  // Split title for styling
  const titleParts = service.title.split("\n"); // Or split by space if needed. For now assuming name is short.

  return (
    <VideoScrollLayout 
      videoSrc={VIDEO_STATS.services.src}
      videoStats={VIDEO_STATS.services}
    >
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">
        {/* Hero Section */}
        <section className="px-6 pt-12 md:pt-20">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 md:gap-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-12 shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-[10px] bg-primary/10 flex items-center justify-center text-primary">
                  {service.section1?.image ? (
                     <img src={service.section1.image} alt={service.title} className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-[4px]" />
                  ) : (
                     <HeroIcon size={24} className="md:w-7 md:h-7" />
                  )}
                </div>
                <h1 className={`${TYPOGRAPHY.tableHeader} text-primary`}>
                  {service.subName || "SERVICE"}
                </h1>
              </div>
              
              <h2 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                {service.section1?.title || service.title}
              </h2>
              
              <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/80`}>
                {service.section1?.subtitle || service.description}
              </p>
              
              <div className="flex flex-col gap-3 md:gap-4">
                {service.features.slice(0, 4).map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary" size={20} />
                    <span className={`${TYPOGRAPHY.body} text-foreground font-bold`}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <Link
                  href="/contact"
                  className={`${TYPOGRAPHY.button} group flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-[10px] hover:bg-primary/90 transition-all`}
                >
                  Start Your Project
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link
                  href="/portfolio"
                  className={`${TYPOGRAPHY.button} px-6 md:px-8 py-3 md:py-4 border border-border text-foreground rounded-[10px] hover:bg-muted/50 hover:border-foreground/40 transition-all`}
                >
                  View Case Studies
                </Link>
              </div>
            </motion.div>

            {/* Injected Mockup Component */}
            <MockupComponent imageSrc={service.image} />
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 flex flex-col gap-4 md:gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
              <h2 className={`${TYPOGRAPHY.tableHeader} text-foreground`}>
                Capabilities
              </h2>
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                {service.capabilitiesTitle || "WHAT WE BUILD."}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl transition-all flex flex-col gap-4 md:gap-6 shadow-lg"
                >
                  <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-primary">
                    <Code size={24} />
                  </div>
                  <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>{feature}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Key Stats */}
        {service.stats && service.stats.length > 0 && (
          <section className="px-6 py-12 md:py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {service.stats.map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center justify-center p-6 bg-background border border-border rounded-[10px] shadow-sm text-center"
                  >
                    <span className="text-3xl md:text-5xl font-black text-primary mb-2 tracking-tight block">
                      {stat.val}
                    </span>
                    <span className={`${TYPOGRAPHY.body} text-foreground/80 font-bold uppercase tracking-wider text-xs md:text-sm`}>
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Content Blocks (Section 2 & 3) */}
        {(service.section2?.title || service.section3?.title) && (
          <section className="px-6">
            <div className="max-w-5xl mx-auto flex flex-col gap-12 md:gap-24">
              
              {service.section2?.title && (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="flex flex-col gap-4 md:gap-6"
                >
                  <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                    {service.section2.title}
                  </h3>
                  {service.section2.description && (
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/80 leading-relaxed whitespace-pre-wrap`}>
                      {service.section2.description}
                    </p>
                  )}
                </motion.div>
              )}

              {service.section3?.title && (
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="flex flex-col gap-4 md:gap-6 border-t border-border pt-12 md:pt-24"
                >
                  <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                    {service.section3.title}
                  </h3>
                  {service.section3.description && (
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/80 leading-relaxed whitespace-pre-wrap`}>
                      {service.section3.description}
                    </p>
                  )}
                </motion.div>
              )}

            </div>
          </section>
        )}

        {/* Freshness / Innovation */}
        {service.freshnessSection?.title && (
          <section className="px-6 py-6 md:py-12">
            <div className="max-w-7xl mx-auto">
               <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="bg-primary/5 border border-primary/20 rounded-[20px] p-8 md:p-16 flex flex-col md:flex-row gap-8 md:gap-16 items-center"
               >
                  <div className="md:w-1/3 shrink-0">
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground leading-tight`}>
                      {service.freshnessSection.title}
                    </h3>
                  </div>
                  <div className="md:w-2/3">
                     <p className={`${TYPOGRAPHY.body} text-foreground/80 md:text-xl leading-relaxed`}>
                        {service.freshnessSection.description}
                     </p>
                  </div>
               </motion.div>
            </div>
          </section>
        )}

        {/* Process Section */}
        {service.process && service.process.length > 0 && (
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 flex flex-col gap-4 md:gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
              <h2 className={`${TYPOGRAPHY.tableHeader} text-foreground`}>
                The Process
              </h2>
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                 HOW WE DELIVER.
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step: any, i: number) => (
                <motion.div
                  key={step.title || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl transition-all flex flex-col gap-4 shadow-lg"
                >
                  <span className={`${TYPOGRAPHY.pageTitle} text-primary/10 absolute top-4 right-6`}>{i + 1}</span>
                  <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground z-10`}>{step.title}</h4>
                  <p className={`${TYPOGRAPHY.body} text-foreground z-10`}>{step.description || step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* CTA Section */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-8 md:p-24 text-center shadow-lg">
            <h3 className={`${TYPOGRAPHY.pageTitle} mb-6 md:mb-8 max-w-4xl mx-auto text-foreground`}>
               {service.cta?.title || "READY TO BUILD?"}
            </h3>
            <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground max-w-2xl mx-auto mb-8 md:mb-10`}>
              {service.cta?.desc || "Let's discuss your project."}
            </p>
            <Link 
              href="/contact"
              className={`${TYPOGRAPHY.button} inline-flex items-center gap-2 px-8 md:px-12 py-4 md:py-5 bg-primary text-primary-foreground rounded-[10px] hover:bg-primary/90 transition-all`}
            >
              {service.cta?.button || "Start Now"}
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
