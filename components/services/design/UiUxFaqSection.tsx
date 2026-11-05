"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UiUxFaqItem {
    question: string;
    answer: string;
}

const UIUX_FAQS: UiUxFaqItem[] = [
    {
        question: "Do I receive full edit access to the raw Figma (.FIG) files?",
        answer: "Yes, 100%. You receive complete ownership of the Figma source files, including all component variants, interactive prototypes, auto-layouts, and design system token variables. There are no licensing restrictions.",
    },
    {
        question: "Can my engineering team easily build the product from your designs?",
        answer: "Yes. We design with developer sanity in mind using 8px grid systems, real responsive auto-layout, named component variables, and CSS token maps. We also host a live handoff session with your developers to walk them through screen states, modals, and edge cases.",
    },
    {
        question: "How do you test designs with real Kenyan users before coding begins?",
        answer: "We put clickable prototypes directly in front of representative target users on physical smartphones. We record their navigation, time to complete tasks (such as checkout or registration), and observe where hesitation happens, resolving friction before you spend money on engineering.",
    },
    {
        question: "How many revision cycles are included in a design sprint?",
        answer: "Every design sprint includes two structured milestone review cycles with unlimited iterative tweaks during those review windows. We ensure you and your leadership team are 100% satisfied with every screen before final export.",
    },
    {
        question: "Can you design for both iOS and Android native conventions?",
        answer: "Yes. We adhere strictly to Apple's Human Interface Guidelines (HIG) and Google's Material You (M3) specifications, ensuring your app feels completely natural and intuitive on both iPhones and Android devices.",
    },
];

export function UiUxFaqSection() {
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
                        How we structure design sprints, user testing, and developer handoff.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {UIUX_FAQS.map((faq, i) => {
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
                            <div className="text-sm font-bold text-foreground">Have an existing app that needs a redesign?</div>
                            <div className="text-xs text-foreground/70">
                                We can perform an initial UX audit and tear down your current conversion leaks.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a
                            href={`https://wa.me/254795213399?text=${encodeURIComponent(
                                "Hi Xinteck, I have a question regarding your UI/UX Design services."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${TYPOGRAPHY.button} px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-[8px] transition-all flex items-center gap-2 shadow-sm`}
                        >
                            <MessageCircle size={14} />
                            <span>Ask on WhatsApp</span>
                        </a>
                        <Link
                            href="/contact?service=UI%2FUX+Design"
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
