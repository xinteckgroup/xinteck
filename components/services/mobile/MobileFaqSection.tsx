"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FaqItem {
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    {
        question: "Do I own 100% of the mobile app source code and intellectual property?",
        answer: "Yes, absolutely. From day one, you retain full legal ownership of all proprietary code, database schemas, and intellectual property. Upon project completion, we push the complete repository to your organization's GitHub or GitLab account.",
    },
    {
        question: "Will the app work smoothly on budget phones like Tecno, Infinix, and Samsung A-series?",
        answer: "Yes. In Kenya, over 70% of smartphones have 2GB to 4GB of RAM. We optimize assets, employ intelligent local caching, and avoid bloated dependencies. We run physical test suites on real Tecno, Infinix, Xiaomi, and Samsung devices to ensure solid 60fps performance.",
    },
    {
        question: "How does the Apple App Store and Google Play Store approval process work?",
        answer: "We manage the entire submission lifecycle for you. From generating cryptographic signing certificates and drafting privacy policies to meeting Google's 14-day closed tester requirement and resolving Apple human review notes, we handle it until your app is officially live on both stores.",
    },
    {
        question: "What happens if a bug appears after the mobile app is launched?",
        answer: "Every custom mobile build comes with 90 days of complimentary post-launch bug warranty and active crash monitoring. If an unexpected error or OS update issue arises, our engineering team fixes and deploys a hotfix at no additional cost.",
    },
    {
        question: "Can the app process automated M-Pesa payments without human intervention?",
        answer: "Yes. We integrate directly with Safaricom Daraja 2.0 API for automated STK Push (customer enters PIN on phone) and B2C instant payouts (e.g. paying drivers, vendors, or loan disbursements). All transactions reconcile automatically in real time.",
    },
];

export function MobileFaqSection() {
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
                        Straightforward answers to the most common questions business leaders have before starting a mobile project.
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="flex flex-col gap-3">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-border/40 overflow-hidden shadow-md transition-all"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFaq(index)}
                                    className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <span className="text-sm md:text-base font-bold text-foreground">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-primary shrink-0 transition-transform duration-200 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-1 text-xs md:text-sm text-foreground/85 font-medium leading-relaxed border-t border-border/20">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Direct Question CTA */}
                <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-6 md:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-[10px] bg-primary/20 flex items-center justify-center text-primary shrink-0">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-foreground">Have a specific question not covered here?</h4>
                            <p className="text-xs text-foreground/75 font-medium">Speak directly with one of our software architects.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/book"
                            className={`px-5 py-2.5 rounded-[10px] bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center gap-2 ${TYPOGRAPHY.button}`}
                        >
                            <Video size={14} />
                            <span>Book 15-Min Call</span>
                        </Link>
                        <a
                            href="https://wa.me/254782063736"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`px-5 py-2.5 rounded-[10px] bg-green-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-green-500 transition-all flex items-center gap-2 ${TYPOGRAPHY.button}`}
                        >
                            <MessageCircle size={14} />
                            <span>Chat on WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

