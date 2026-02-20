import { Hero } from "@/components/sections/Hero";
import { ServicesFeatured } from "@/components/sections/ServicesFeatured";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { getFeaturedProject } from "@/lib/public-data";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProject = await getFeaturedProject();

  return (
    <VideoScrollLayout
      videoSrc={VIDEO_STATS.homepage.src}
      videoStats={VIDEO_STATS.homepage}
    >
      <Hero />
      <ServicesFeatured />
      
      {/* Featured Project Teaser */}
      {featuredProject && (
      <section className="py-12 md:py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="group relative glass-panel p-1 md:p-2 rounded-[10px] overflow-hidden shadow-lg">
             {/* Glowing Border Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
             
            <div className="bg-white/50 dark:bg-background/50 rounded-[8px] p-6 md:p-12 flex flex-col md:flex-row items-center gap-12 relative z-10 h-full">
              <div className="flex-1 flex flex-col gap-6">
                <div className={`${TYPOGRAPHY.badge} inline-flex items-center gap-2 px-3 py-1 rounded-[10px] bg-primary/10 w-fit text-primary`}>
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <h2 className="tracking-widest uppercase text-foreground dark:text-primary">
                      Featured Case Study
                    </h2>
                </div>
                
                <h3 className={`${TYPOGRAPHY.pageTitle} text-2xl md:text-4xl text-foreground`}>
                  {featuredProject.title.toUpperCase()}
                </h3>
                <p className={`${TYPOGRAPHY.body} text-foreground/60 leading-relaxed max-w-md line-clamp-3`}>
                  {featuredProject.description}
                </p>
                
                <div className="pt-4">
                    <Link href={`/portfolio/${featuredProject.slug}`} className={`${TYPOGRAPHY.button} px-8 py-3 bg-foreground text-background rounded-[10px] hover:bg-primary transition-colors flex items-center gap-2 group/btn w-fit`}>
                    Read Case Study
                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </Link>
                </div>
              </div>
              
              <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[400px]">
                <div className="w-full h-full bg-secondary/10 rounded-[10px] border border-primary/10 flex items-center justify-center relative overflow-hidden group/image">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                  {/* Ideally show project image here */}
                  <span className="text-primary/10 font-black text-[10rem] select-none scale-150 group-hover/image:scale-100 transition-transform duration-700">01</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Tech Stack Section */}
      <section className="py-12 md:py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto glass-panel rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-8 mb-12 md:mb-16">
            <div className="flex flex-col gap-4">
              <h2 className={`${TYPOGRAPHY.tableHeader} text-primary`}>
                Our Arsenal
              </h2>
              <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground text-2xl md:text-4xl`}>
                BUILT WITH <span className="text-foreground/40">THE BEST.</span>
              </h3>
            </div>
          </div>

          <div className="relative w-full overflow-hidden py-6">
            {/* Gradient Masks */}
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-white/80 dark:from-black/90 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/80 dark:from-black/90 to-transparent z-10 pointer-events-none" />

            {/* Row 1 — moves left */}
            <div className="flex gap-5 mb-5 animate-marquee-left">
              {[...[
                { name: "React", logo: "/images/home-ui/tech/react.svg" },
                { name: "Next.js", logo: "/images/home-ui/tech/nextjs-dark.svg" },
                { name: "JavaScript", logo: "/images/home-ui/tech/javascript.svg" },
                { name: "Python", logo: "/images/home-ui/tech/python.svg" },
                { name: "Node.js", logo: "/images/home-ui/tech/nodejs.svg" },
                { name: "Flask", logo: "/images/home-ui/tech/flask.svg" },
                { name: "HTML5", logo: "/images/home-ui/tech/HTML5.webp" },
                { name: "CSS3", logo: "/images/home-ui/tech/CSS3.webp" },
                { name: "Tailwind", logo: "/images/home-ui/tech/Tailwind.webp" },
                { name: "Git", logo: "/images/home-ui/tech/Git.webp" },
                { name: "Figma", logo: "/images/home-ui/tech/Figma.webp" },
              ], ...[
                { name: "React", logo: "/images/home-ui/tech/react.svg" },
                { name: "Next.js", logo: "/images/home-ui/tech/nextjs-dark.svg" },
                { name: "JavaScript", logo: "/images/home-ui/tech/javascript.svg" },
                { name: "Python", logo: "/images/home-ui/tech/python.svg" },
                { name: "Node.js", logo: "/images/home-ui/tech/nodejs.svg" },
                { name: "Flask", logo: "/images/home-ui/tech/flask.svg" },
                { name: "HTML5", logo: "/images/home-ui/tech/HTML5.webp" },
                { name: "CSS3", logo: "/images/home-ui/tech/CSS3.webp" },
                { name: "Tailwind", logo: "/images/home-ui/tech/Tailwind.webp" },
                { name: "Git", logo: "/images/home-ui/tech/Git.webp" },
                { name: "Figma", logo: "/images/home-ui/tech/Figma.webp" },
              ]].map((tech, i) => (
                <div
                  key={`r1-${i}`}
                  className="flex-shrink-0 w-[120px] h-[80px] rounded-[10px] bg-white/50 dark:bg-white/5 border border-primary/10 hover:border-gold/50 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 group cursor-default"
                >
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={32}
                    height={32}
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-wider group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Row 2 — moves right */}
            <div className="flex gap-5 animate-marquee-right">
              {[...[
                { name: "PostgreSQL", logo: "/images/home-ui/tech/postgresql.svg" },
                { name: "MongoDB", logo: "/images/home-ui/tech/MongoDB.svg" },
                { name: "MySQL", logo: "/images/home-ui/tech/mysql.svg" },
                { name: "SQLite", logo: "/images/home-ui/tech/sqlite.webp" },
                { name: "SQLAlchemy", logo: "/images/home-ui/tech/sqlalchemy.webp" },
                { name: "Jest", logo: "/images/home-ui/tech/Jest.svg" },
                { name: "Postman", logo: "/images/home-ui/tech/Postman.svg" },
                { name: "Heroku", logo: "/images/home-ui/tech/Heroku.webp" },
                { name: "Linux", logo: "/images/home-ui/tech/Linux.webp" },
                { name: "Ruby", logo: "/images/home-ui/tech/Ruby.webp" },
              ], ...[
                { name: "PostgreSQL", logo: "/images/home-ui/tech/postgresql.svg" },
                { name: "MongoDB", logo: "/images/home-ui/tech/MongoDB.svg" },
                { name: "MySQL", logo: "/images/home-ui/tech/mysql.svg" },
                { name: "SQLite", logo: "/images/home-ui/tech/sqlite.webp" },
                { name: "SQLAlchemy", logo: "/images/home-ui/tech/sqlalchemy.webp" },
                { name: "Jest", logo: "/images/home-ui/tech/Jest.svg" },
                { name: "Postman", logo: "/images/home-ui/tech/Postman.svg" },
                { name: "Heroku", logo: "/images/home-ui/tech/Heroku.webp" },
                { name: "Linux", logo: "/images/home-ui/tech/Linux.webp" },
                { name: "Ruby", logo: "/images/home-ui/tech/Ruby.webp" },
              ]].map((tech, i) => (
                <div
                  key={`r2-${i}`}
                  className="flex-shrink-0 w-[120px] h-[80px] rounded-[10px] bg-white/50 dark:bg-white/5 border border-primary/10 hover:border-gold/50 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 group cursor-default"
                >
                  <Image
                    src={tech.logo}
                    alt={tech.name}
                    width={32}
                    height={32}
                    className="object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-wider group-hover:text-primary transition-colors">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-24 px-6 relative">
        <div className="max-w-7xl mx-auto glass-panel rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-8 mb-16">
            <div className="flex flex-col gap-4">
                <h2 className={`${TYPOGRAPHY.tableHeader} text-primary`}>
                Client Feedback
                </h2>
                <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground text-2xl md:text-4xl`}>
                <span className="text-foreground">TESTIMONIALS.</span>
                </h3>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-2 px-2">
            {[
              {
                text: "Building a healthcare platform that handles sensitive patient data required a developer we could trust completely. Xinteck understood the complexity of the task from day one and translated it into a clean, intuitive product. We recommend their work.",
                author: "Edwin Lubanga",
                role: "Co-Founder, Snark Health",
              },
              {
                text: "Absolutely reliable and highly efficient! Not only was our project completed on schedule, but the quality of work delivered surpassed our expectations. Exceptional service from start to finish.",
                author: "Kimathi I.",
                role: "Founder, Plutus Capital",
              },
              {
                text: "Xinteck provided unparalleled expertise and support throughout the entire development process. The attention to detail and commitment to delivering high-quality results. Highly recommended for anyone looking for top-notch tech solutions.",
                author: "Jeremy Omare",
                role: "Project Manager, Best Energy",
              },
              {
                text: "We needed a platform that could present our products to international buyers while handling quote requests with ease. Xinteck delivered exactly that — a polished, professional solution built with real understanding of our export business. Very impressed with the quality of work.",
                author: "Francis Salaton",
                role: "Managing Director, Al-Barka Halali Meats",
              },
            ].map((testimonial, i) => (
              <div 
                key={i}
                className="min-w-[300px] md:min-w-[350px] flex-shrink-0 snap-start p-8 rounded-[10px] bg-white/50 dark:bg-background/50 border border-primary/10 hover:border-primary/30 transition-all flex flex-col gap-6 group"
              >
                <div className="text-primary/20 group-hover:text-primary transition-colors">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z" />
                    </svg>
                </div>
                <p className={`${TYPOGRAPHY.body} text-foreground/80 italic leading-relaxed`}>
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex flex-col gap-1 mt-auto pt-6 border-t border-primary/5">
                  <span className={`${TYPOGRAPHY.cardTitle} text-foreground dark:text-foreground`}>{testimonial.author}</span>
                  <span className={`${TYPOGRAPHY.meta} text-foreground dark:text-foreground`}>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-24 px-6 relative">
        <div className="max-w-4xl mx-auto glass-panel rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="text-center mb-12 md:mb-20 flex flex-col gap-4">
            <h2 className={`${TYPOGRAPHY.tableHeader} text-primary`}>
              Common Questions
            </h2>
            <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground text-2xl md:text-4xl`}>
              CLEAR <span className="text-foreground/40">ANSWERS.</span>
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "What is your typical project timeline?",
                a: "Timelines vary depending on complexity. Small projects take 4-6 weeks, while large-scale enterprise solutions typically range from 3-6 months.",
              },
              {
                q: "Do you offer post-launch support?",
                a: "Absolutely. We provide dedicated support packages for maintenance, updates, and 24/7 monitoring to ensure 99.99% uptime.",
              },
              {
                q: "Can you work with our existing internal team?",
                a: "Yes, we often act as an extension of internal teams, providing specialized expertise in cloud architecture, DevOps, or UI/UX.",
              },
            ].map((faq, i) => (
              <div 
                key={i}
                className="group p-6 md:p-8 rounded-[10px] border border-primary/10 bg-white/50 dark:bg-secondary/5 hover:bg-white/70 dark:hover:bg-secondary/10 hover:border-primary/20 transition-all flex flex-col gap-4 cursor-pointer"
              >
                <h4 className={`${TYPOGRAPHY.cardTitle} flex justify-between items-center text-foreground group-hover:text-primary transition-colors`}>
                  {faq.q}
                  <Plus className="text-primary/20 group-hover:text-primary transition-colors" />
                </h4>
                <p className={`${TYPOGRAPHY.body} text-foreground/60 leading-relaxed max-w-2xl`}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 px-6 relative overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
         
        <div className="max-w-4xl mx-auto text-center flex flex-col gap-8 relative z-10 glass-panel rounded-[10px] p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <h2 className={`${TYPOGRAPHY.pageTitle} text-white`}>
            READY TO BUILD THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">NEXT BIG THING?</span>
          </h2>
          <p className={`${TYPOGRAPHY.pageSubtitle} max-w-2xl mx-auto text-white`}>
            Our team of world-class engineers and designers are ready to bring
            your vision to life with precision and speed.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link 
              href="/contact"
              className={`${TYPOGRAPHY.button} px-12 py-4 bg-primary text-primary-foreground rounded-[10px] shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:scale-105 transition-all text-center`}
            >
              Book a Discovery Call
            </Link>
          </div>
        </div>
      </section>
    </VideoScrollLayout>
  );
}
