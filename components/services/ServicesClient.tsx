"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import {
    BarChart,
    ChevronRight,
    Code,
    Lock,
    Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PublicService {
    slug: string;
    title: string;
    subName?: string;
    description: string;
    features: string[];
    image?: string | null;
}

export default function ServicesClient({ services }: { services: PublicService[] }) {

  return (
    <VideoScrollLayout 
      videoSrc={VIDEO_STATS.services.src}
      videoStats={VIDEO_STATS.services}
    >
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">
      {/* Hero Section */}
      <section className="px-6 pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center text-center gap-6 md:gap-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
            >
            <h1 className="text-sm md:text-base font-bold text-gold uppercase tracking-[0.2em] mb-2">
                Our Capabilities
            </h1>
            <h2 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-foreground uppercase">
                FULL-STACK <span className="text-gold">EXCELLENCE.</span>
            </h2>
            <p className={`${TYPOGRAPHY.pageSubtitle} max-w-3xl mx-auto`}>
                We provide end-to-end technology solutions. From initial architectural 
                prototyping to global cloud deployment, we cover every byte of the 
                development lifecycle.
            </p>
            </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          {services.map((service, i) => (
            <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${
                    i % 2 !== 0 ? "lg:direction-rtl" : ""
                }`}
            >
                {/* Text Card */}
                <div className={`lg:col-span-8 ${i % 2 !== 0 ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="h-full p-8 md:p-12 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl transition-all shadow-lg flex flex-col justify-between">
                        <div className="flex flex-col gap-6">
                            {service.subName && (
                                <span className={`${TYPOGRAPHY.tableHeader} text-gold`}>
                                    {service.subName}
                                </span>
                            )}
                            <h3 className={`${TYPOGRAPHY.sectionTitle} text-foreground`}>
                                {service.title}
                            </h3>
                            <p className={`${TYPOGRAPHY.body} text-foreground leading-relaxed`}>
                                {service.description}
                            </p>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {service.features.map((feature) => (
                                    <span 
                                        key={feature} 
                                        className={`${TYPOGRAPHY.badge} px-3 py-1 bg-primary/5 rounded-[10px] text-foreground`}
                                    >
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Link
                            href={`/services/${service.slug}`}
                            className={`${TYPOGRAPHY.button} mt-8 pt-6 border-t border-primary/10 flex items-center gap-2 text-gold transition-all w-fit hover:gap-4`}
                        >
                            Explore Details <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>

                {/* Image Card */}
                <div className={`lg:col-span-4 ${i % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                    <div className="h-full min-h-[300px] flex items-center justify-center relative">
                        {service.image ? (
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="relative w-full aspect-square flex items-center justify-center"
                            >
                                <div className="relative w-full h-full rounded-[10px] overflow-hidden shadow-2xl">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-full aspect-square flex items-center justify-center rounded-[10px] bg-white/5 backdrop-blur-sm">
                                <Code size={80} className="text-primary/20" />
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Icons */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Code, title: "Clean Code", desc: "Maintainable, scalable, documented." },
              { icon: Zap, title: "High Speed", desc: "Optimized for performance." },
              { icon: Lock, title: "Elite Security", desc: "Bank-grade data protection." },
              { icon: BarChart, title: "Data Driven", desc: "Built with analytics in mind." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-4 text-center items-center bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 transition-all shadow-lg">
                 <div className="w-16 h-16 rounded-[10px] flex items-center justify-center text-gold mb-2 bg-primary/5">
                    <item.icon size={28} />
                 </div>
                  <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>{item.title}</h4>
                  <p className={`${TYPOGRAPHY.cardSubtitle} text-foreground`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Prompt */}
      <section className="px-6 mb-20">
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-10 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-8 md:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
            <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
              NEED A CUSTOM <br />
              <span className="text-gold">TECH SOLUTION?</span>
            </h3>
            <Link 
              href="/contact"
              className={`${TYPOGRAPHY.button} px-12 py-2 bg-foreground text-background rounded-[10px] hover:bg-gold-hover transition-all mx-auto`}
            >
              Contact Our Engineers
            </Link>
        </div>
      </section>
    </div>
    </VideoScrollLayout>
  );
}
