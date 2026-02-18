"use client";

import { motion } from "framer-motion";
import { Lightbulb, Monitor, Sparkles, Thermometer, ToggleRight, UserCheck } from "lucide-react";

export function UiUxMockup() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -top-8 left-0 text-muted-foreground text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-8 h-[1px] bg-border"></span>
        EXAMPLE: SMART HOME HUB
      </div>
      {/* Smart Home Hub Mockup */}
      <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8 }}
       className="aspect-square bg-background backdrop-blur-xl rounded-[30px] border border-border overflow-hidden shadow-2xl relative p-6 flex flex-col justify-between"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
           <div>
              <h4 className="text-foreground font-bold text-lg">Living Room</h4>
              <span className="text-muted-foreground text-xs">Connected • 4 Devices</span>
           </div>
           <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
           </div>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-4">
           <div className="relative w-48 h-48 rounded-full border-4 border-muted/30 flex items-center justify-center">
              {/* Active Arc */}
             <svg className="absolute inset-0 w-full h-full -rotate-90">
                 <circle cx="96" cy="96" r="90" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-primary" strokeDasharray="565" strokeDashoffset="140" strokeLinecap="round" />
              </svg>
              
              <div className="text-center">
                 <span className="text-xs text-muted-foreground block">TEMP</span>
                 <span className="text-5xl font-black text-foreground tracking-tighter">72°</span>
                 <span className="text-xs text-primary block mt-1">Heating...</span>
              </div>
           </div>
           
           {/* Floating Elements */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-4 p-2 bg-muted/50 rounded-lg border border-border backdrop-blur-md"
           >
             <Thermometer size={16} className="text-primary" />
           </motion.div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-3 group hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                 <Lightbulb size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                 <ToggleRight size={24} className="text-primary" />
              </div>
              <div>
                 <span className="text-foreground font-bold block text-sm">Focus Mode</span>
                 <span className="text-muted-foreground text-xs">On • 80%</span>
              </div>
           </div>
           <div className="bg-muted/30 rounded-2xl p-4 border border-border flex flex-col gap-3 group hover:border-border/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-center">
                 <Monitor size={20} className="text-muted-foreground" />
                 <div className="w-8 h-4 bg-muted rounded-full relative">
                    <div className="absolute left-1 top-1 w-2 h-2 bg-muted-foreground/50 rounded-full" />
                 </div>
              </div>
              <div>
                 <span className="text-foreground font-bold block text-sm">TV Ambient</span>
                 <span className="text-muted-foreground text-xs">Off</span>
              </div>
           </div>
        </div>
      </motion.div>
      
      {/* Floating Badge - Experience */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-12 p-4 bg-card backdrop-blur-xl border border-border rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-primary/10 rounded-[10px] text-primary">
          <Sparkles size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">Experience</span>
          <span className="text-[10px] text-primary font-bold">PREMIUM</span>
        </div>
      </motion.div>

      {/* Floating Badge - Accessibility */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-8 bottom-1/3 p-4 bg-card backdrop-blur-xl border border-border rounded-[10px] flex items-center gap-3 shadow-lg z-20"
      >
        <div className="p-2 bg-blue-500/10 rounded-[10px] text-blue-400">
          <UserCheck size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">Accessibility</span>
          <span className="text-[10px] text-blue-400 font-bold">WCAG 2.1 AA</span>
        </div>
      </motion.div>
    </div>
  );
}
