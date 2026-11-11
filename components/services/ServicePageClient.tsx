"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { PublicService, PricingTier } from "@/lib/public-data";
import { SERVICE_UI_MAP } from "@/lib/service-ui-map";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Code, Star, Video } from "lucide-react"; // Default icon
import Link from "next/link";
import { MobileIndustryPacks } from "./mobile/MobileIndustryPacks";
import { MobileDeviceTrust } from "./mobile/MobileDeviceTrust";
import { MobileScopeEstimator } from "./mobile/MobileScopeEstimator";
import { MobileFaqSection } from "./mobile/MobileFaqSection";
import { WebSpeedBenchmark } from "./web/WebSpeedBenchmark";
import { WebTechStackShowcase } from "./web/WebTechStackShowcase";
import { WebScopeEstimator } from "./web/WebScopeEstimator";
import { WebFaqSection } from "./web/WebFaqSection";
import { CustomSoftwareBeforeAfter } from "./custom/CustomSoftwareBeforeAfter";
import { CustomSoftwareScopeEstimator } from "./custom/CustomSoftwareScopeEstimator";
import { CustomSoftwareFaqSection } from "./custom/CustomSoftwareFaqSection";
import { UiUxRoiMetrics } from "./design/UiUxRoiMetrics";
import { UiUxScopeEstimator } from "./design/UiUxScopeEstimator";
import { UiUxFaqSection } from "./design/UiUxFaqSection";
import { CloudCostOptimizer } from "./cloud/CloudCostOptimizer";
import { CloudScopeEstimator } from "./cloud/CloudScopeEstimator";
import { CloudFaqSection } from "./cloud/CloudFaqSection";
import { GraphicTrustProof } from "./graphic/GraphicTrustProof";
import { GraphicScopeEstimator } from "./graphic/GraphicScopeEstimator";
import { GraphicFaqSection } from "./graphic/GraphicFaqSection";
import { ServiceComparisonMatrix } from "./ServiceComparisonMatrix";

export function ServicePageClient({ service }: { service: PublicService }) {
  
  const ui = SERVICE_UI_MAP[service.slug as keyof typeof SERVICE_UI_MAP] || SERVICE_UI_MAP["default"];
  const HeroIcon = ui.icon;
  const MockupComponent = ui.mockup;
  const isMobileApp = service.slug === "mobile-app-development";
  const isWebDev = service.slug === "web-development";
  const isCustomSoftware = service.slug === "custom-software-development";
  const isUiUx = service.slug === "ui-ux-design";
  const isCloud = service.slug === "cloud-devops";
  const isGraphicDesign = service.slug === "graphic-design";

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
                  Start a Project
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
            <MockupComponent imageSrc={service.image} service={service} />
          </div>
        </section>

        {/* Mobile Industry Solutions Showcase */}
        {isMobileApp && <MobileIndustryPacks />}

        {/* Web Speed & 3-Second Benchmark */}
        {isWebDev && <WebSpeedBenchmark />}

        {/* Custom Software Before vs After Transformation */}
        {isCustomSoftware && <CustomSoftwareBeforeAfter />}

        {/* UI/UX Prototyping & Zero-Waste ROI */}
        {isUiUx && <UiUxRoiMetrics />}

        {/* Cloud Cost Optimizer & Security Radar */}
        {isCloud && <CloudCostOptimizer />}

        {/* Graphic Design Commercial Press Proof */}
        {isGraphicDesign && <GraphicTrustProof />}

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

        {/* Mobile Real Device & Store Approval Proof */}
        {isMobileApp && <MobileDeviceTrust />}

        {/* Web Search Engine & Architecture Foundation */}
        {isWebDev && <WebTechStackShowcase />}

        {/* Interactive Scope & Cost Estimator */}
        {isMobileApp && <MobileScopeEstimator />}
        {isWebDev && <WebScopeEstimator />}
        {isCustomSoftware && <CustomSoftwareScopeEstimator />}
        {isUiUx && <UiUxScopeEstimator />}
        {isCloud && <CloudScopeEstimator />}
        {isGraphicDesign && <GraphicScopeEstimator />}

        {/* Process Section */}
        {service.section4?.steps && service.section4.steps.length > 0 && (
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 flex flex-col gap-4 md:gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
              <h2 className={`${TYPOGRAPHY.tableHeader} text-foreground`}>
                The Process
              </h2>
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                 {service.section4?.title || "HOW WE DELIVER."}
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.section4?.steps?.map((step: any, i: number) => (
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
                  <p className={`${TYPOGRAPHY.body} text-foreground/80 z-10 mt-2 text-sm leading-relaxed`}>{step.description || step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 4 Ways to Solve This Comparison Framework */}
        <ServiceComparisonMatrix
          slug={service.slug}
          serviceTitle={service.title}
          brandedName={service.subName}
        />

        {/* Pricing Packages */}
        {service.buyNowSection?.pricingTiers && service.buyNowSection.pricingTiers.length > 0 && (
          <section className="px-6 py-6 md:py-12" id="pricing">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 flex flex-col gap-4 md:gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                <h2 className={`${TYPOGRAPHY.tableHeader} text-primary`}>
                  Transparent Pricing
                </h2>
                <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                  CHOOSE YOUR PACKAGE.
                </h3>
                <p className={`${TYPOGRAPHY.body} text-foreground/70`}>
                  Clear pricing for every deliverable. No hidden fees.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {service.buyNowSection.pricingTiers.map((tier: PricingTier, i: number) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className={`relative flex flex-col rounded-[10px] backdrop-blur-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1 ${
                      tier.popular
                        ? "bg-primary/5 dark:bg-primary/10 border-2 border-primary ring-1 ring-primary/20"
                        : "bg-white/30 dark:bg-black/80 border border-border/50"
                    }`}
                  >
                    {/* Popular Badge */}
                    {tier.popular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-[10px] flex items-center gap-1.5">
                        <Star size={12} fill="currentColor" />
                        Most Popular
                      </div>
                    )}

                    <div className="flex flex-col gap-5 p-6 md:p-8 flex-1">
                      {/* Tier Name & Price */}
                      <div className="flex flex-col gap-2">
                        <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground pr-20`}>
                          {tier.name}
                        </h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                            {tier.price}
                          </span>
                        </div>
                        <p className={`${TYPOGRAPHY.body} text-foreground/60 text-sm leading-relaxed`}>
                          {tier.description}
                        </p>
                      </div>

                      {/* Includes List */}
                      <div className="flex flex-col gap-2.5 flex-1">
                        {tier.includes.map((item: string) => (
                          <div key={item} className="flex items-start gap-2.5">
                            <CheckCircle2 className="text-primary mt-0.5 shrink-0" size={16} />
                            <span className="text-sm text-foreground/80 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Turnaround */}
                      <div className="flex items-center gap-2 text-foreground/60 text-sm pt-2 border-t border-border/30">
                        <Clock size={14} className="text-primary" />
                        <span className="font-medium">{tier.turnaround}</span>
                      </div>

                      {/* Note (e.g. "Design only — printing not included.") */}
                      {tier.note && (
                        <p className="text-xs text-foreground/50 italic">
                          {tier.note}
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                      <Link
                        href={`/contact?service=${encodeURIComponent(service.title)}&package=${encodeURIComponent(tier.name)}`}
                        className={`${TYPOGRAPHY.button} w-full flex items-center justify-center gap-2 py-3 rounded-[10px] transition-all text-sm ${
                          tier.popular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border/50"
                        }`}
                      >
                        Get Started
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mobile Objection-Buster FAQ Section */}
        {isMobileApp && <MobileFaqSection />}
        {isWebDev && <WebFaqSection />}
        {isCustomSoftware && <CustomSoftwareFaqSection />}
        {isUiUx && <UiUxFaqSection />}
        {isCloud && <CloudFaqSection />}
        {isGraphicDesign && <GraphicFaqSection />}

        {/* CTA Section */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-8 md:p-24 text-center shadow-lg">
            <h3 className={`${TYPOGRAPHY.pageTitle} mb-6 md:mb-8 max-w-4xl mx-auto text-foreground`}>
               {service.buyNowSection?.title || "READY TO BUILD?"}
            </h3>
            <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/80 max-w-2xl mx-auto mb-8 md:mb-10`}>
              {service.buyNowSection?.description || "Let's discuss your project."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/book"
                className={`${TYPOGRAPHY.button} inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-primary text-black font-extrabold rounded-[10px] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:scale-105 transition-all text-sm md:text-base`}
              >
                <Video size={18} className="text-black" />
                <span>Apply for Strategy Session</span>
              </Link>
              <Link 
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className={`${TYPOGRAPHY.button} inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 border border-white/20 hover:border-white/40 text-foreground rounded-[10px] hover:bg-white/5 transition-all text-sm md:text-base`}
              >
                <span>Submit Project Brief</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
