"use client";

import { motion } from "framer-motion";
import { PenTool } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MockupProps {
    imageSrc?: string | null;
    service?: {
        title: string;
        features: string[];
        stats?: { label: string; val: string }[];
    };
}

const CARD_FRONT = "/images/services/business-card-front.webp";
const CARD_BACK = "/images/services/business-card-back.webp";

export function BusinessCardMockup({ imageSrc, service }: MockupProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const frontSrc = imageSrc || CARD_FRONT;
    const backSrc = CARD_BACK;

    return (
        <div className="relative w-full aspect-video md:aspect-square lg:aspect-auto md:h-[600px] border border-primary/10 rounded-[10px] bg-secondary/5 overflow-visible flex items-center justify-center group">
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-[420px] px-4 cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* 3D Card Container */}
                <div className="perspective-1200">
                    <motion.div
                        className="relative w-full preserve-3d"
                        style={{ aspectRatio: "1.75 / 1" }}
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Front Face */}
                        <div className="absolute inset-0 backface-hidden rounded-[12px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <Image
                                src={frontSrc}
                                alt={service?.title || "Business Card — Front"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 90vw, 420px"
                                priority
                            />
                        </div>

                        {/* Back Face */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-[12px] overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <Image
                                src={backSrc}
                                alt={service?.title ? `${service.title} — Back` : "Business Card — Back"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 90vw, 420px"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Flip Indicator */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="mt-4 text-center select-none"
                >
                    <span className="text-[10px] md:text-xs text-foreground/40 font-medium uppercase tracking-widest">
                        {isFlipped ? "Tap to see front" : "Tap to flip"}
                    </span>
                </motion.p>
            </motion.div>

            {/* Floating Feature Badge */}
            {service?.features && service.features[0] && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-md border border-white/10 shadow-xl rounded-[8px] px-4 py-2 flex items-center gap-2"
                >
                    <PenTool size={14} className="text-gold" />
                    <span className="text-white text-xs font-bold">{service.features[0]}</span>
                </motion.div>
            )}

            {/* Floating Stats Badge */}
            {service?.stats && service.stats[0] && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute top-10 left-10 bg-black/60 backdrop-blur-md border border-white/10 shadow-xl rounded-[8px] px-4 py-3 flex flex-col"
                >
                    <span className="text-gold text-lg font-black">{service.stats[0].val}</span>
                    <span className="text-white/80 text-[10px] uppercase font-bold">{service.stats[0].label}</span>
                </motion.div>
            )}

            {/* Subtle gold glow on hover */}
            <div
                className="absolute inset-0 rounded-[10px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 80px rgba(212, 175, 55, 0.06)" }}
            />
        </div>
    );
}
