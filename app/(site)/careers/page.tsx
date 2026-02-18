import { getActiveCareerPositions } from "@/actions/careers";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { VIDEO_STATS } from "@/lib/videoStats";
import { Code, Coffee, Globe, Heart, Shield, Zap } from "lucide-react";
import { CareersPositionsList } from "./CareersPositionsList";

const benefits = [
  { title: "Remote First", desc: "Work from anywhere in the world with our global-first squad mindset.", icon: Globe },
  { title: "Health & Wellness", desc: "Full medical coverage and wellness stipends for your peak performance.", icon: Heart },
  { title: "Elite Gear", desc: "We provide the latest tech gear to ensure you have the best tools for the job.", icon: Zap },
  { title: "Continuous Learning", desc: "Annual budget for courses, conferences, and skill development.", icon: Coffee },
];

export default async function CareersPage() {
  const positions = await getActiveCareerPositions();

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
      <div className="flex flex-col gap-24 py-20">
      <section className="px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="flex flex-col gap-6 p-12 md:p-20 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/20 rounded-[10px] shadow-2xl text-center"
          >
            <h1 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">
              Join the Squad
            </h1>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-foreground">
              BUILD THE <br />
              <span className="text-gold">FUTURE WITH US.</span>
            </h2>
            <p className="text-xl text-foreground max-w-2xl mx-auto leading-relaxed">
              We are not just a software company; we are a lab of visionary engineers and 
              designers pushing the boundaries of what's possible in the digital space.
            </p>
          </div>
        </div>
      </section>

      {/* Values / Benefits Section */}
      <section className="bg-white/30 dark:bg-black/80 backdrop-blur-xl py-24 px-6 border-y border-primary/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 flex flex-col gap-4">
             <h3 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">Perks & Benefits</h3>
             <h4 className="text-4xl md:text-6xl font-black tracking-tighter">WHY WORK <span className="text-foreground/40">HERE.</span></h4>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="p-8 rounded-[10px] bg-white/50 dark:bg-background/50 border border-primary/10 hover:border-primary/40 transition-all flex flex-col gap-6 shadow-xl"
              >
                <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold">
                   <benefit.icon size={24} />
                </div>
                <h5 className="text-xl font-bold text-foreground">{benefit.title}</h5>
                <p className="text-foreground text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="p-12 md:p-16 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/20 rounded-[10px] shadow-2xl flex flex-col gap-4 text-center">
             <h3 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">Opportunities</h3>
             <h4 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">OPEN <span className="text-foreground/40">ROLES.</span></h4>
          </div>
          
          <CareersPositionsList positions={JSON.parse(JSON.stringify(positions))} />
        </div>
      </section>

      {/* Culture Section */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/20 rounded-[10px] overflow-hidden p-12 md:p-24 shadow-xl">
           <div className="flex flex-col gap-8">
              <h3 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground">
                 OUR CODE <br />
                 <span className="text-gold">IS OUR CRAFT.</span>
              </h3>
              <p className="text-lg text-foreground leading-relaxed">
                 At Xinteck, we don't believe in the corporate grind. We believe in the flow state. 
                 Our engineers are artists, and our codebases are galleries. We value deep work, 
                 asynchronous communication, and technical excellence over everything else.
              </p>
              <div className="flex gap-8 wrap opacity-100 text-gold">
                 <Code size={48} />
                 <Shield size={48} />
                 <Zap size={48} />
              </div>
           </div>
           <div className="aspect-square bg-secondary/10 rounded-[10px] border border-primary/10 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent" />
               <span className="text-gold/5 font-black text-[10rem] rotate-12">FLOW-STATE</span>
           </div>
        </div>
      </section>
    </div>
    </VideoScrollLayout>
  );
}
