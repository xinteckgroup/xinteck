"use client";

import { useServices } from "@/components/providers/ServicesContext";
import { TYPOGRAPHY } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
    ArrowUpRight,
    Briefcase,
    Cloud,
    Globe,
    Palette,
    Smartphone
} from "lucide-react";
import Link from "next/link";

// Map service slugs to icons and visual config
const slugConfig: Record<string, { icon: React.ComponentType<{ size?: number }>; colSpan: string; bg: string }> = {
  "web-development": { icon: Globe, colSpan: "md:col-span-2", bg: "bg-blue-500/5" },
  "mobile-app-development": { icon: Smartphone, colSpan: "md:col-span-1", bg: "bg-purple-500/5" },
  "cloud-devops": { icon: Cloud, colSpan: "md:col-span-1", bg: "bg-orange-500/5" },
  "ui-ux-design": { icon: Palette, colSpan: "md:col-span-2", bg: "bg-primary/5" },
  "custom-software-development": { icon: Briefcase, colSpan: "md:col-span-1", bg: "bg-green-500/5" },
};

// Default config for unknown slugs
const defaultConfig = { icon: Briefcase, colSpan: "md:col-span-1", bg: "bg-secondary/5" };

// Alternating col-span pattern for services not in slugConfig
const colSpanPattern = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

export function ServicesFeatured() {
  const dynamicServices = useServices();

  // Build service cards from context
  const services = dynamicServices.map((s, i) => {
    const config = slugConfig[s.slug] || defaultConfig;
    return {
      title: s.name,
      desc: "", // Brief descriptions are not stored in nav items — the card still looks good without
      icon: config.icon,
      href: `/services/${s.slug}`,
      colSpan: slugConfig[s.slug]?.colSpan || colSpanPattern[i % colSpanPattern.length],
      bg: config.bg,
    };
  });

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <div className={`${TYPOGRAPHY.badge} inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-secondary/5 w-fit text-primary`}>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="tracking-widest uppercase">Our Capabilities</span>
            </div>
            <h3 className="text-2xl md:text-5xl font-bold tracking-tight text-white">
              ENGINEERED <span className="text-white">FOR</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-600 dark:to-yellow-200">IMPACT.</span>
            </h3>
          </div>
          <Link
            href="/services"
            className={`${TYPOGRAPHY.button} group flex items-center gap-2 text-white hover:text-primary transition-colors`}
          >
            Explore All Services
            <div className="w-8 h-8 rounded-[10px] bg-secondary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all">
                <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative p-8 rounded-[10px] transition-all duration-300 flex flex-col gap-6",
                service.colSpan,
                "backdrop-blur-sm",
                service.bg
              )}
            >
              <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-[10px] bg-background shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <service.icon size={24} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
                    <ArrowUpRight size={20} className="text-primary" />
                  </div>
              </div>
              
              <div className="mt-auto flex flex-col gap-2">
                <h4 className={`${TYPOGRAPHY.sectionTitle} text-white group-hover:text-primary transition-colors`}>
                  {service.title}
                </h4>
                {service.desc && (
                  <p className={`${TYPOGRAPHY.body} text-white leading-relaxed max-w-sm`}>
                    {service.desc}
                  </p>
                )}
              </div>

              <Link href={service.href} className="absolute inset-0 z-10" />
            </motion.div>
          ))}
          
           {/* CTA Card */}
           <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1 p-8 rounded-[10px] bg-primary flex flex-col justify-center items-center text-center gap-6 relative overflow-hidden group"
            >
               <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
               <h4 className={`${TYPOGRAPHY.sectionTitle} text-background relative z-10`}>
                   BUILD YOUR VISION
               </h4>
               <Link 
                 href="/contact"
                 className={`${TYPOGRAPHY.button} px-6 py-2 bg-black/20 hover:bg-black/30 text-black rounded-[10px] w-full relative z-10 transition-colors`}
               >
                 Start Now
               </Link>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
