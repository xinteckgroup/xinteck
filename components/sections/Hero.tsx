"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Server, Shield } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 px-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        
        {/* Glowing Orbs */}
        <motion.div 
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen" 
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-6 md:gap-8 relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-primary/10 border border-primary/20 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className={`${TYPOGRAPHY.badge} text-primary`}>
              Accepting Waitlist for Q2
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
            WE <span className="text-white/40">ENGINEER YOUR</span> <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-200 to-primary animate-gradient-x">
              DIGITAL FUTURE
            </span>
          </h1>

          <p className={`${TYPOGRAPHY.pageSubtitle} text-white max-w-lg`}>
            Xinteck is an elite software development collective. We build scalable platforms, intuitive interfaces, and robust infrastructure for the next generation of business.
          </p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/contact"
              className="group relative overflow-hidden rounded-[10px] transition-all"
            >
              <div className={`${TYPOGRAPHY.button} relative z-10 flex items-center gap-2 px-8 py-3 bg-primary text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-shadow`}>
                Start a Project
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </div>
            </Link>
            <Link
              href="/portfolio"
              className="group"
            >
              <div
                className="px-8 py-3 rounded-[10px] border-2 border-primary bg-white/30 dark:bg-black/70 hover:scale-105 transition-transform animate-gold-pulse"
              >
                <span className={`${TYPOGRAPHY.button} text-black dark:text-white flex items-center gap-2`}>
                  View Our Work
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-primary/10 mt-4">
            {[
              { label: "Average Sprint Cycle", val: "<1 Week" },
              { label: "Client Retention Rate", val: "100%" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className={`${TYPOGRAPHY.sectionTitle} text-primary font-mono`}>{stat.val}</div>
                <div className={`${TYPOGRAPHY.meta} text-foreground/50 uppercase tracking-widest font-bold`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual Side (Code Mockup) */}
        <motion.div style={{ y, opacity }} className="relative hidden lg:block perspective-1000">
           <motion.div 
             initial={{ rotateY: -10, rotateX: 5, scale: 0.9 }}
             animate={{ rotateY: 0, rotateX: 0, scale: 1 }}
             transition={{ duration: 1.5, ease: "easeOut" }}
             className="relative z-10 bg-[#0a0a0a] border border-white/10 rounded-[10px] shadow-2xl overflow-hidden"
           >
             {/* Window Controls */}
             <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-500/80" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                   <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex text-xs text-white/30 font-mono gap-4">
                   <span>server.go</span>
                   <span className="text-white/10">|</span>
                   <span>client.tsx</span>
                </div>
             </div>
             
             {/* Code Area */}
             <div className="p-6 font-mono text-sm leading-relaxed text-gray-400">
                <div className="flex gap-4">
                   <div className="flex flex-col text-right text-gray-700 select-none">
                      {Array.from({length: 12}).map((_, i) => <span key={i}>{i+1}</span>)}
                   </div>
                   <div className="flex flex-col gap-1 w-full">
                      <span className="text-purple-400">package</span> <span className="text-yellow-100">main</span>
                      <br />
                      <span className="text-purple-400">import</span> (
                      <span className="pl-4 text-green-400">&quot;fmt&quot;</span>
                      <span className="pl-4 text-green-400">&quot;net/http&quot;</span>
                      )
                      <br />
                      <span className="text-blue-400">func</span> <span className="text-yellow-200">Handler</span>(w http.ResponseWriter, r *http.Request) {"{"}
                      <span className="pl-4 text-gray-400">{`// Optimized for high-throughput`}</span>
                      <span className="pl-4 text-purple-400">go</span> <span className="text-blue-400">func</span>() {"{"}
                      <span className="pl-8 text-cyan-400">processAnalytics</span>(r.Context())
                      <span className="pl-4">{"}()"}</span>
                      <br />
                      <span className="pl-4">fmt.<span className="text-yellow-200">Fprintf</span>(w, <span className="text-green-400">&quot;Welcome to Xinteck&quot;</span>)</span>
                      {"}"}
                   </div>
                </div>
             </div>
             
             {/* Status Bar */}
             <div className={`bg-primary text-black ${TYPOGRAPHY.tableHeader} px-4 py-1 flex justify-between`}>
                <span>NORMAL MODE</span>
                <span>Ln 12, Col 44</span>
             </div>
           </motion.div>

           {/* Floating Cards */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute -right-8 -bottom-8 p-4 bg-white border border-primary/20 rounded-[10px] shadow-xl flex items-center gap-3 z-20"
           >
              <div className="p-2 bg-green-500/10 rounded-[8px] text-green-400">
                 <Shield size={20} />
              </div>
              <div className="flex flex-col">
                 <span className={`${TYPOGRAPHY.cardTitle} text-black`}>Security Audit</span>
                 <span className={`${TYPOGRAPHY.badge} text-green-400`}>PASSED</span>
              </div>
           </motion.div>

           <motion.div 
             animate={{ y: [0, 10, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -left-8 top-1/2 p-4 bg-white border border-primary/20 rounded-[10px] shadow-xl flex items-center gap-3 z-20"
           >
              <div className="p-2 bg-blue-500/10 rounded-[8px] text-blue-400">
                 <Server size={20} />
              </div>
              <div className="flex flex-col">
                 <span className={`${TYPOGRAPHY.cardTitle} text-black`}>API Latency</span>
                 <span className={`${TYPOGRAPHY.badge} text-gray-500`}>12ms (Global)</span>
              </div>
           </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
