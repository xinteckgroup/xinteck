"use client";

import { useServices } from "@/components/providers/ServicesContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    FileText,
    Home,
    Layers,
    LayoutGrid,
    Mail,
    User,
    Zap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { 
    name: "Services", 
    href: "/services", 
    icon: Zap,
    trigger: true 
  },
  { name: "Portfolio", href: "/portfolio", icon: Layers },
  { name: "Blog", href: "/blog", icon: FileText },
  { name: "Contact", href: "/contact", icon: Mail },
];

// Map service slugs to icons for display
import { SERVICE_UI_MAP } from "@/lib/service-ui-map";

export function FloatingDock() {
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dynamicServices = useServices();

  // Build the services list: "All Services" first, then dynamic services from DB
  const services = [
    { name: "All Services", href: "/services", icon: LayoutGrid },
    ...dynamicServices.map(s => {
      const ui = SERVICE_UI_MAP[s.slug as keyof typeof SERVICE_UI_MAP] || SERVICE_UI_MAP["default"];
      return {
        name: s.name,
        href: `/services/${s.slug}`,
        icon: ui.icon,
      }
    }),
  ];

  return (
    <>
      <div className="fixed z-50 flex flex-col gap-4 w-full pointer-events-none">
        {/* Services Side Menu - Staggered from Left */}
        <AnimatePresence>
          {isServicesOpen && (
            <div className="fixed top-1/2 -translate-y-1/2 left-[20px] flex flex-col gap-3 pointer-events-auto items-start">
              {services.map((service, i) => (
                <motion.div
                  key={service.name}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ 
                    delay: i * 0.1, 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 25 
                  }}
                >
                  <Link
                    href={service.href}
                    onClick={() => setIsServicesOpen(false)}
                    className="flex items-center gap-4 px-6 py-3 rounded-[10px] bg-primary border border-primary/20 hover:bg-primary/90 transition-all group shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)]"
                  >
                      <div className="p-2 rounded-[10px] bg-background/20 text-primary-foreground transition-colors">
                        <service.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-primary-foreground tracking-wide">
                          {service.name}
                      </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main Dock */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div 
          className="flex items-center gap-2 p-2 bg-[#000000]/80 backdrop-blur-xl border-2 border-[#D4AF37]/50 rounded-[10px] shadow-2xl animate-gold-pulse"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            const IsIcon = link.icon;

            return (
              <div key={link.name} className="relative">
                {link.trigger ? (
                    <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        className={cn(
                            "relative w-12 h-12 flex items-center justify-center rounded-[8px] transition-all duration-300",
                            isServicesOpen || isActive ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <IsIcon size={24} className={cn("transition-colors", isServicesOpen || isActive ? "text-white" : "text-primary")} />
                        {(isServicesOpen || isActive) && (
                            <motion.div layoutId="dock-active" className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />
                        )}
                    </button>
                ) : (
                    <Link
                        href={link.href}
                        onMouseEnter={() => setHoveredIndex(i)}
                        className={cn(
                        "relative w-12 h-12 flex items-center justify-center rounded-[8px] transition-all duration-300",
                        isActive ? "bg-[#D4AF37] text-black" : "text-gray-400 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <IsIcon size={24} className={cn("transition-colors", isActive ? "text-black" : "text-primary")} />
                    </Link>
                )}
                
                {/* Peer Name Tooltip */}
                <AnimatePresence>
                    {hoveredIndex === i && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: -45 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                        >
                            <div className="px-3 py-1 bg-black/90 border border-white/10 text-white text-xs font-bold rounded-[6px] whitespace-nowrap shadow-xl">
                                {link.name}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </>
  );
}
