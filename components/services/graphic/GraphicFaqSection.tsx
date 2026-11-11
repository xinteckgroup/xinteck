"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface GraphicFaqItem {
    question: string;
    answer: string;
}

const GRAPHIC_FAQS: GraphicFaqItem[] = [
    {
        question: "Do I receive full legal copyright ownership and raw vector source files?",
        answer: "Yes, 100%. Upon final project delivery, all intellectual property rights and copyrights are formally transferred to your organization. You receive the complete master vector suite: Adobe Illustrator (.AI), Scalable Vector Graphics (.SVG), Encapsulated PostScript (.EPS), and high-resolution print-ready PDFs.",
    },
    {
        question: "Are your design files ready for commercial printing presses in Nairobi?",
        answer: "Yes. All print deliverables are calibrated in CMYK at 300 DPI with industry-standard 3mm bleed margins, crop marks, and embedded fonts. We also specify exact Pantone Matching System (PMS) color formulas so any local printer (e.g. in Industrial Area or Westlands) prints exact colors without guesswork.",
    },
    {
        question: "How many design concepts do you present during the branding sprint?",
        answer: "We present 3 completely distinct creative directions for your identity. Each concept is showcased in real-world contexts (stationery, mobile screens, signage, and boardroom materials). Once you choose your preferred direction, we refine it through collaborative feedback rounds until it is flawless.",
    },
    {
        question: "Can you design corporate merchandise, uniforms, and fleet vehicle branding?",
        answer: "Yes. We produce technical vector die-cuts and measurement templates for vehicle wraps, corporate embroidery, promotional banners, 3D acrylic office reception signage, and bespoke packaging.",
    },
    {
        question: "What if we have an existing logo and simply want a modern executive refresh?",
        answer: "We specialize in brand modernization. We preserve the brand equity, recognition, and heritage your customers already trust, while refining typography, geometry, balance, and color profiles to project modern authority.",
    },
];

export function GraphicFaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="px-6 py-8 md:py-16">
            <div className="max-w-5xl mx-auto flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto flex flex-col gap-3 bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg">
                    <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
                        Clear Answers
                    </h2>
                    <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground`}>
                        FREQUENTLY ASKED QUESTIONS.
                    </h3>
                    <p className={`${TYPOGRAPHY.pageSubtitle} text-foreground/85 font-medium`}>
                        Straight answers on copyrights, revisions, print press coordination, and file formats.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {GRAPHIC_FAQS.map((faq, i) => {
                        const isOpen = openIndex === i;
                        return (
                            <motion.div
                                key={faq.question}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className={`rounded-[10px] backdrop-blur-xl border transition-all overflow-hidden ${
                                    isOpen
                                        ? "bg-white/40 dark:bg-black/90 border-primary/40 shadow-lg"
                                        : "bg-white/20 dark:bg-black/60 border-border/40 hover:border-foreground/30"
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4"
                                >
                                    <span className="font-bold text-sm md:text-base text-foreground flex items-center gap-3">
                                        <HelpCircle
                                            size={18}
                                            className={`shrink-0 transition-colors ${
                                                isOpen ? "text-primary" : "text-foreground/40"
                                            }`}
                                        />
                                        <span>{faq.question}</span>
                                    </span>
                                    <div
                                        className={`w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                                            isOpen
                                                ? "bg-primary text-black rotate-180"
                                                : "bg-black/5 dark:bg-white/5 text-foreground/70"
                                        }`}
                                    >
                                        <ChevronDown size={16} />
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div className="px-5 pb-6 md:px-6 md:pb-6 pt-1 text-xs md:text-sm text-foreground/80 leading-relaxed border-t border-border/30">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Sub-CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-border/50 shadow-md">
                    <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <MessageCircle size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-foreground">Have a custom corporate rebrand in mind?</div>
                            <div className="text-xs text-foreground/70">
                                Apply for a strategy session with our Creative Director.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a
                            href={`https://wa.me/254795213399?text=${encodeURIComponent(
                                "Hi Xinteck, I have a question regarding your Graphic Design & Branding services."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${TYPOGRAPHY.button} px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-[8px] transition-all flex items-center gap-2 shadow-sm`}
                        >
                            <MessageCircle size={14} />
                            <span>Ask on WhatsApp</span>
                        </a>
                        <Link
                            href="/contact?service=Graphic+Design"
                            className={`${TYPOGRAPHY.button} px-4 py-2.5 bg-white/40 dark:bg-zinc-800/60 hover:bg-white/60 dark:hover:bg-zinc-800 border border-border/50 text-foreground font-bold text-xs rounded-[8px] transition-all flex items-center gap-2`}
                        >
                            <Send size={14} />
                            <span>Send Quick Question</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
