"use client";

import { motion } from "framer-motion";
import { Sun, TrendingUp } from "lucide-react";

export function CustomSoftwareMockup() {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute -top-8 left-0 text-muted-foreground text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-8 h-[1px] bg-border"></span>
        EXAMPLE: SOLAR CALCULATOR
      </div>
      {/* Solar Calculator Mockup Card */}
      <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.8 }}
       className="aspect-square bg-background backdrop-blur-xl rounded-[20px] border border-border overflow-hidden shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
              <Sun size={18} />
            </div>
            <span className="text-foreground font-bold text-sm tracking-wide">SOLAR ROI ENGINE</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/50" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
            <div className="w-2 h-2 rounded-full bg-green-500/50" />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 flex flex-col gap-8 h-full">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <span className="text-xs text-muted-foreground font-bold uppercase block mb-1">Yearly Savings</span>
                <span className="text-2xl font-black text-green-500">$2,450</span>
             </div>
             <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <span className="text-xs text-muted-foreground font-bold uppercase block mb-1">Energy Offset</span>
                <span className="text-2xl font-black text-primary">105%</span>
             </div>
          </div>

          {/* Graph Animation */}
          <div className="flex-1 bg-muted/30 rounded-xl border border-border p-4 relative overflow-hidden flex items-end gap-3 px-6 pb-6">
              <div className="absolute top-4 left-4 text-xs text-muted-foreground font-bold uppercase">Projected Savings</div>
              {/* Bars */}
              {[30, 45, 60, 50, 75, 90, 100].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "backOut" }}
                  className="flex-1 bg-gradient-to-t from-gold/20 to-gold rounded-t-sm opacity-80"
                />
              ))}
              
              {/* Trend Line Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ padding: '24px' }}>
                <motion.path
                  d="M0 100 Q 50 80, 100 60 T 200 20"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </svg>
          </div>
        </div>
      </motion.div>
      
      {/* Floating Badge - Sun Analysis */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-8 top-8 p-4 bg-card backdrop-blur-xl border border-border rounded-[10px] flex items-center gap-3 shadow-xl z-20"
      >
        <div className="p-2 bg-orange-500/10 rounded-[10px] text-orange-500">
          <Sun size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">Sun Analysis</span>
          <span className="text-[10px] text-orange-500 font-bold">5.2 PEAK HRS</span>
        </div>
      </motion.div>

      {/* Floating Badge - Efficiency */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute -left-8 bottom-20 p-4 bg-card backdrop-blur-xl border border-border rounded-[10px] flex items-center gap-3 shadow-xl z-20"
      >
        <div className="p-2 bg-green-500/10 rounded-[10px] text-green-500">
          <TrendingUp size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">System ROI</span>
          <span className="text-[10px] text-green-500 font-bold">4.2 YEARS</span>
        </div>
      </motion.div>
    </div>
  );
}
