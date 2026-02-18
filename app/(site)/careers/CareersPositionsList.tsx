"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Position {
    id: string;
    title: string;
    department: string;
    type: string;
    location: string;
    description: string | null;
    salaryRange: string | null;
}

export function CareersPositionsList({ positions }: { positions: Position[] }) {
    if (positions.length === 0) {
        return (
            <div className="p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl text-center shadow-lg">
                <p className="text-foreground text-lg font-bold">No open positions at the moment.</p>
                <p className="text-foreground/60 text-sm mt-2">
                    Check back soon or reach out to us directly.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {positions.map((pos, i) => (
                <motion.div
                    key={pos.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-8 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl hover:border-primary/40 hover:bg-white/50 dark:hover:bg-black/90 transition-all flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg"
                >
                    <div className="flex flex-col gap-2">
                        <h5 className="text-2xl font-bold text-foreground group-hover:text-gold transition-colors">
                            {pos.title}
                        </h5>
                        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-foreground">
                            <span>{pos.department}</span>
                            <span className="text-gold">•</span>
                            <span>{pos.type}</span>
                            <span className="text-gold">•</span>
                            <span>{pos.location}</span>
                        </div>
                        {pos.salaryRange && (
                            <span className="text-sm text-gold/80 font-bold">{pos.salaryRange}</span>
                        )}
                    </div>
                    <Link
                        href={`/contact?ref=career&position=${encodeURIComponent(pos.title)}`}
                        className="flex items-center gap-2 text-sm font-bold bg-foreground text-background px-8 py-3 rounded-[10px] hover:bg-gold hover:text-primary-foreground transition-all shrink-0"
                    >
                        Apply Now <ArrowRight size={16} />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
