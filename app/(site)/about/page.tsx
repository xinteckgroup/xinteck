"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Rocket, Shield, Target, Users, Wrench } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Shared animation config for synchronized pulsing
const pulseAnimation = {
  animate: {
    boxShadow: ["0 0 0px rgba(212,175,55,0.2)", "0 0 15px rgba(212,175,55,0.6)", "0 0 0px rgba(212,175,55,0.2)"],
    borderColor: ["rgba(212,175,55,0.3)", "rgba(212,175,55,1)", "rgba(212,175,55,0.3)"]
  },
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as const }
};

// Collaboration tools data — split into two rows for the dual-direction marquee
const toolsRow1 = [
  { name: "Slack", logo: "/logos/tools/slack.webp" },
  { name: "GitHub", logo: "/logos/tools/github.webp" },
  { name: "Figma", logo: "/logos/tools/figma.webp" },
  { name: "Jira", logo: "/logos/tools/jira.webp" },
  { name: "Notion", logo: "/logos/tools/notion.webp" },
];

const toolsRow2 = [
  { name: "Trello", logo: "/logos/tools/trello.webp" },
  { name: "Zoom", logo: "/logos/tools/zoom.webp" },
  { name: "Teams", logo: "/logos/tools/teams.webp" },
  { name: "Confluence", logo: "/logos/tools/confluence.webp" },
  { name: "Asana", logo: "/logos/tools/asana.webp" },
];

const stats = [
  { label: "Successful Projects", value: "250+" },
  { label: "Global Clients", value: "85+" },
  { label: "Awards Won", value: "12" },
  { label: "Tech Experts", value: "45" },
];

const values = [
  {
    title: "Excellence",
    desc: "We don't just build software; we craft digital masterpieces with unmatched precision.",
    icon: Target,
  },
  {
    title: "Innovation",
    desc: "Staying ahead of the curve is in our DNA. We embrace emerging techs early.",
    icon: Rocket,
  },
  {
    title: "Partnership",
    desc: "Your success is our success. We work as an extension of your core team.",
    icon: Users,
  },
  {
    title: "Integrity",
    desc: "Transparent communication and absolute security are the foundations of our work.",
    icon: Shield,
  },
];

export default function AboutPage() {
  return (
    <VideoScrollLayout 
      videoSrc={VIDEO_STATS.about.src}
      videoStats={VIDEO_STATS.about}
    >
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20">
        {/* Hero Section */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-6 md:gap-8 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-6 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
            >
              <h1 className="text-xs md:text-sm font-bold tracking-[0.3em] text-gold uppercase text-foreground">
                Our Story
              </h1>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-white">
                ENGINEERING THE <br />
                <span className="text-gold">DIGITAL FRONTIER.</span>
              </h2>
              <p className="text-lg md:text-xl text-foreground/60 leading-relaxed">
                Founded in 2018, Xinteck was born from a simple realization: 
                most technology solutions lack the soul of design and the 
                rigor of elite engineering. We closed that gap.
              </p>
              <div className="flex flex-col gap-3 md:gap-4">
                {[
                  "Pioneering cloud-native architectures",
                  "World-class UI/UX design philosophy",
                  "Agile development at enterprise scale",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="text-gold" size={20} />
                    <span className="font-bold text-foreground text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="hidden lg:flex items-center justify-center h-full relative min-h-[500px]">
              <div className="absolute inset-0 bg-secondary/10 rounded-[10px] border border-primary/20 backdrop-blur-sm overflow-hidden -z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent" />
              </div>
               <motion.div
                 animate={{ y: [-15, 15, -15] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10"
               >
                  <motion.div 
                    animate={pulseAnimation.animate}
                    transition={pulseAnimation.transition}
                    className="rounded-full border-2 border-primary p-2 bg-white/30 dark:bg-black/70 shadow-2xl"
                  >
                    <Image
                      src="/logos/logo-light.webp"
                      alt="Xinteck"
                      width={200}
                      height={200}
                      className="dark:hidden rounded-full"
                    />
                    <Image
                      src="/logos/logo-dark.webp"
                      alt="Xinteck"
                      width={200}
                      height={200}
                      className="hidden dark:block rounded-full"
                    />
                  </motion.div>
               </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
             <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center md:text-left"
                    >
                      <div className="text-3xl md:text-6xl font-black tracking-tighter text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-60 mt-2 text-foreground">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 flex flex-col gap-4 md:gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-6 md:p-8">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-foreground">
                Core Philosophy
              </h2>
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground !text-6xl`}>
                WHAT DRIVES <span className="text-foreground/40">US.</span>
              </h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 hover:border-primary/40 transition-all flex flex-col gap-4 md:gap-6"
                >
                  <div className="w-12 h-12 rounded-[10px] bg-white/50 dark:bg-bg-black/50 flex items-center justify-center text-gold">
                    <value.icon size={24} />
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground">{value.title}</h4>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Work Section */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20 flex flex-col gap-4 md:gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-6 md:p-8">
              <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-foreground">
                How We Deliver
              </h2>
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground !text-5xl`}>
                OUR <span className="text-foreground/40">PROCESS.</span>
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Card 1: Project Communication Structure */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-10 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 hover:border-primary/40 transition-all flex flex-col gap-8"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[10px] bg-white/50 dark:bg-black/50 flex items-center justify-center text-gold border border-primary/20">
                    <MessageSquare size={24} />
                  </div>
                  <h4 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    Project Communication Structure
                  </h4>
                </div>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Frequent Scrum Standup", desc: "Daily sync to unblock, align, and ship faster.", icon: "🔄" },
                    { label: "Weekly Review", desc: "Demo, feedback, and course-correct every sprint.", icon: "📊" },
                    { label: "Sprint Delivery", desc: "Iterative releases with clear milestones.", icon: "🚀" },
                    { label: "Code Reviews", desc: "Peer-reviewed code for quality and knowledge sharing.", icon: "✅" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 }}
                      className="flex items-start gap-4 p-4 rounded-[10px] bg-white/40 dark:bg-white/5 border border-primary/10 hover:border-gold/40 transition-all group"
                    >
                      <span className="text-2xl mt-0.5 shrink-0">{item.icon}</span>
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-foreground group-hover:text-gold transition-colors">
                          {item.label}
                        </span>
                        <span className="text-sm text-foreground/50">
                          {item.desc}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Card 2: Collaboration Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="p-8 md:p-10 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 hover:border-primary/40 transition-all flex flex-col gap-8 overflow-hidden"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[10px] bg-white/50 dark:bg-black/50 flex items-center justify-center text-gold border border-primary/20">
                    <Wrench size={24} />
                  </div>
                  <h4 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
                    Collaboration Tools
                  </h4>
                </div>
                <p className="text-foreground/50 text-sm leading-relaxed">
                  We leverage industry-leading platforms to keep teams connected, code reviewed, and projects on track — wherever you are.
                </p>

                {/* Infinite Marquee Slideshow */}
                <div className="relative w-full overflow-hidden py-4">
                  {/* Gradient Masks */}
                  <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white/30 dark:from-black/80 to-transparent z-10 pointer-events-none" />
                  <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white/30 dark:from-black/80 to-transparent z-10 pointer-events-none" />
                  
                  {/* Row 1 — moves left */}
                  <div className="flex gap-6 mb-6 animate-marquee-left">
                    {[...toolsRow1, ...toolsRow1].map((tool, i) => (
                      <div
                        key={`r1-${i}`}
                        className="flex-shrink-0 w-[120px] h-[80px] rounded-[10px] bg-white/60 dark:bg-white/10 border border-primary/10 hover:border-gold/50 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 group"
                      >
                        <Image
                          src={tool.logo}
                          alt={tool.name}
                          width={36}
                          height={36}
                          className="object-contain rounded-md group-hover:scale-110 transition-transform"
                        />
                        <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Row 2 — moves right */}
                  <div className="flex gap-6 animate-marquee-right">
                    {[...toolsRow2, ...toolsRow2].map((tool, i) => (
                      <div
                        key={`r2-${i}`}
                        className="flex-shrink-0 w-[120px] h-[80px] rounded-[10px] bg-white/60 dark:bg-white/10 border border-primary/10 hover:border-gold/50 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 group"
                      >
                        <Image
                          src={tool.logo}
                          alt={tool.name}
                          width={36}
                          height={36}
                          className="object-contain rounded-md group-hover:scale-110 transition-transform"
                        />
                        <span className="text-[10px] font-bold text-foreground/60 uppercase tracking-wider">
                          {tool.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team CTA */}
        <section className="px-6 mb-12 md:mb-20">
          <div className="max-w-7xl mx-auto bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-24 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground !text-5xl mb-6 md:mb-8 max-w-4xl mx-auto`}>
                PASSIONATE ABOUT <span className="text-gold">CODE?</span>
              </h3>
              <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-8 md:mb-10">
                We are always looking for visionary engineers and designers to join our elite squad.
              </p>
              <Link 
                href="/careers"
                className="inline-block px-8 md:px-10 py-4 md:py-5 bg-foreground text-background font-black rounded-[10px] hover:bg-gold-hover transition-all text-sm md:text-base"
              >
                Join the Team
              </Link>
          </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}

