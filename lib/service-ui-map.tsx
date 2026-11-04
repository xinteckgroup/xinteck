import { CloudDevOpsSimulator } from "@/components/services/mockups/CloudDevOpsSimulator";
import { CustomSoftwareSimulator } from "@/components/services/mockups/CustomSoftwareSimulator";
import { GraphicDesignSimulator } from "@/components/services/mockups/GraphicDesignSimulator";
import { MobileAppSimulator } from "@/components/services/mockups/MobileAppSimulator";
import { UiUxDesignSimulator } from "@/components/services/mockups/UiUxDesignSimulator";
import { WebDevStudioSimulator } from "@/components/services/mockups/WebDevStudioSimulator";
import { motion } from "framer-motion";
import {
    Cloud,
    Code,
    Globe,
    Palette,
    PenTool,
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

// Default fallback mockup
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

export const SERVICE_UI_MAP: Record<string, { icon: any, mockup: any }> = {
    "web-development": {
        icon: Globe,
        mockup: WebDevStudioSimulator
    },
    "mobile-app-development": {
        icon: Smartphone,
        mockup: MobileAppSimulator
    },
    "custom-software-development": {
        icon: Code,
        mockup: CustomSoftwareSimulator
    },
    "ui-ux-design": {
        icon: Palette,
        mockup: UiUxDesignSimulator
    },
    "cloud-devops": {
        icon: Cloud,
        mockup: CloudDevOpsSimulator
    },
    "graphic-design": {
        icon: PenTool,
        mockup: GraphicDesignSimulator
    },
    // Defaults for others
    "default": {
        icon: Code,
        mockup: WebDevMockup
    }
};
