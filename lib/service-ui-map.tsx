import { motion } from "framer-motion";
import {
    Cloud,
    Code,
    Globe,
    Palette,
    Smartphone
} from "lucide-react";
import Image from "next/image";

interface MockupProps {
    imageSrc?: string | null;
    service?: {
        title: string;
        features: string[];
        stats?: { label: string; val: string }[];
    };
}

// Mockups placeholders
const WebDevMockup = ({ imageSrc, service }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt={service?.title || "Web Development"} 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Globe size={120} className="text-primary/20" />
         )}

         {/* Dynamic Floating Badges */}
         {service?.features && service.features[0] && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-md border border-[var(--admin-border)] shadow-xl rounded-[8px] px-4 py-2 flex items-center gap-2">
                <Code size={14} className="text-gold" />
                <span className="text-white text-xs font-bold">{service.features[0]}</span>
            </motion.div>
         )}
         {service?.stats && service.stats[0] && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="absolute top-10 left-10 bg-black/60 backdrop-blur-md border border-[var(--admin-border)] shadow-xl rounded-[8px] px-4 py-3 flex flex-col">
                <span className="text-gold text-lg font-black">{service.stats[0].val}</span>
                <span className="text-white/80 text-[10px] uppercase font-bold">{service.stats[0].label}</span>
            </motion.div>
         )}
    </div>
);

const MobileMockup = ({ imageSrc, service }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt={service?.title || "Mobile App Development"} 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Smartphone size={120} className="text-primary/20" />
         )}
         
         {/* Dynamic Floating Badges */}
         {service?.features && service.features[0] && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="absolute bottom-12 left-8 bg-black/60 backdrop-blur-md border border-[var(--admin-border)] shadow-xl rounded-[8px] px-4 py-2 flex items-center gap-2">
                <Smartphone size={14} className="text-gold" />
                <span className="text-white text-xs font-bold">{service.features[0]}</span>
            </motion.div>
         )}
    </div>
);

const CustomSoftwareMockup = ({ imageSrc, service }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt={service?.title || "Custom Software"} 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Code size={120} className="text-primary/20" />
         )}

         {/* Dynamic Floating Badges */}
         {service?.stats && service.stats[0] && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="absolute bottom-16 right-12 bg-black/60 backdrop-blur-md border border-[var(--admin-border)] shadow-xl rounded-[8px] px-5 py-3 flex flex-col items-center">
                <span className="text-gold text-xl font-black">{service.stats[0].val}</span>
                <span className="text-white/80 text-[10px] uppercase font-bold">{service.stats[0].label}</span>
            </motion.div>
         )}
    </div>
);

const DesignMockup = ({ imageSrc, service }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt={service?.title || "UI/UX Design"} 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Palette size={120} className="text-primary/20" />
         )}

         {/* Dynamic Floating Badges */}
         {service?.features && service.features[0] && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-md border border-[var(--admin-border)] shadow-xl rounded-[8px] px-4 py-2 flex items-center gap-2">
                <Palette size={14} className="text-gold" />
                <span className="text-white text-xs font-bold">{service.features[0]}</span>
            </motion.div>
         )}
    </div>
);

const CloudMockup = ({ imageSrc, service }: MockupProps) => (
    <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-hidden flex items-center justify-center group">
         {imageSrc ? (
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-[10px] overflow-hidden shadow-2xl bg-white"
            >
                 <Image 
                    src={imageSrc} 
                    alt={service?.title || "Cloud & DevOps"} 
                    width={400}
                    height={400}
                    className="object-cover"
                 />
            </motion.div>
         ) : (
            <Cloud size={120} className="text-primary/20" />
         )}

         {/* Dynamic Floating Badges */}
         {service?.stats && service.stats[0] && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="absolute top-10 left-10 bg-black/60 backdrop-blur-md border border-[var(--admin-border)] shadow-xl rounded-[8px] px-4 py-3 flex flex-col">
                <span className="text-gold text-lg font-black">{service.stats[0].val}</span>
                <span className="text-white/80 text-[10px] uppercase font-bold">{service.stats[0].label}</span>
            </motion.div>
         )}
    </div>
);


export const SERVICE_UI_MAP: Record<string, { icon: any, mockup: any }> = {
    "web-development": {
        icon: Globe,
        mockup: WebDevMockup
    },
    "mobile-app-development": {
        icon: Smartphone,
        mockup: MobileMockup
    },
    "custom-software-development": {
        icon: Code,
        mockup: CustomSoftwareMockup
    },
    "ui-ux-design": {
        icon: Palette,
        mockup: DesignMockup
    },
    "cloud-devops": {
        icon: Cloud,
        mockup: CloudMockup
    },
    // Defaults for others
    "default": {
        icon: Code,
        mockup: WebDevMockup
    }
};
