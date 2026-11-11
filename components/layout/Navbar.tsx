"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Rocket, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";



export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-1 md:p-2 lg:p-3 flex justify-center pointer-events-none">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn(
          "pointer-events-auto",
          "w-full max-w-7xl mx-auto rounded-[10px]",
          "flex items-center justify-between",
          "px-4 sm:px-6 py-2 transition-all duration-300",
          scrolled 
            ? "bg-black/80 dark:bg-white/30 backdrop-blur-xl border border-primary/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]" 
            : "bg-transparent border border-transparent"
        )}
      >
        {/* Logo with circular border and animation */}
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <motion.div
            initial={{ width: "52px", borderRadius: "9999px" }}
            whileHover={{ width: "130px", borderRadius: "10px" }}
            transition={{
              width: { type: "spring", stiffness: 300, damping: 20 },
              borderRadius: { type: "spring", stiffness: 300, damping: 20 }
            }}
            className="relative border-2 border-primary p-1 bg-white/30 dark:bg-black/70 overflow-hidden h-[52px] flex items-center justify-center animate-gold-pulse"
          >
            {/* Light Mode Container */}
            <div className="absolute inset-0 flex items-center justify-center dark:hidden">
              <div className="relative w-[44px] h-[44px] transition-opacity duration-300 group-hover:opacity-0">
                  <Image
                    src="/logos/logo-light.webp"
                    alt="Xinteck"
                    fill
                    className="object-contain"
                  />
              </div>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <Image
                    src="/logos/logo-light-full.webp"
                    alt="Xinteck Full"
                    fill
                    className="object-cover" 
                  />
              </div>
            </div>

            {/* Dark Mode Container */}
            <div className="absolute inset-0 flex items-center justify-center hidden dark:flex">
              <div className="relative w-[44px] h-[44px] transition-opacity duration-300 group-hover:opacity-0">
                  <Image
                    src="/logos/logo-dark.webp"
                    alt="Xinteck"
                    fill
                    className="object-contain"
                  />
              </div>
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                  <Image
                    src="/logos/logo-dark-full.webp"
                    alt="Xinteck Full"
                    fill
                    className="object-cover" 
                  />
              </div>
            </div>
          </motion.div>
        </Link>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/contact" className="group relative">
                <div className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[10px] bg-primary text-black font-extrabold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:scale-105 transition-all">
                   <Rocket size={15} className="text-black shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   <span className="whitespace-nowrap">Start a Project</span>
                </div>
            </Link>

            <Link href="/book" className="hidden lg:block group relative">
                <div className="px-4 py-2 sm:px-4 sm:py-2 rounded-[10px] border border-primary/30 hover:border-primary bg-white/20 dark:bg-black/40 hover:scale-105 transition-all">
                   <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors">
                     <Video size={14} className="text-primary" /> Strategy Session
                   </span>
                </div>
            </Link>

            <ThemeToggle />
        </div>
      </motion.div>
    </nav>
  );
}
