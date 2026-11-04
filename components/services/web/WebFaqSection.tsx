"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Video } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface WebFaqItem {
    question: string;
    answer: string;
}

const WEB_FAQS: WebFaqItem[] = [
    {
        question: "Can my internal team update content, products, and articles without coding?",
        answer: "Yes, 100%. We configure an intuitive, visual content management system (Sanity or Payload CMS). Your team can publish blog articles, edit product pricing, and upload images as simply as typing an email, without risking breaking the site layout.",
    },
    {
        question: "Will our website actually rank on Google Kenya for our key business terms?",
        answer: "Yes. Every website we construct includes comprehensive technical SEO: structured JSON-LD Schema.org data, lightning-fast Core Web Vitals (<1s load times), clean OpenGraph preview cards for WhatsApp and LinkedIn sharing, and automatic XML sitemaps registered directly with Google Search Console.",
    },
    {
        question: "Who owns the website domain, source code, and assets?",
        answer: "You retain 100% full legal ownership of your domain, complete source code repository, design assets, and database. We never lock you into proprietary hosting traps. You can deploy it anywhere or hand it to an internal engineer at any point.",
    },
    {
        question: "How do customer M-Pesa payments work on the website?",
        answer: "We connect your website to Safaricom Daraja 2.0 API. When a customer enters their Safaricom phone number and clicks 'Pay with M-Pesa', an instant STK PIN prompt appears on their phone. Once they enter their PIN, payment verifies on screen in 2 seconds without full-page reloads.",
    },
    {
        question: "What happens if there are bugs or questions after our website goes live?",
        answer: "Every web build includes 90 days of complimentary post-launch bug warranty, security patches, and direct WhatsApp support. We also provide dedicated video walkthroughs and a 1-on-1 handover session with your team.",
    },
];

export function WebFaqSection() {
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
                        Straightforward answers to the questions our clients ask most before starting a web project.
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="flex flex-col gap-4">
                    {WEB_FAQS.map((faq, i) => {
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
                            <div className="text-sm font-bold text-foreground">Have a unique technical question?</div>
                            <div className="text-xs text-foreground/70">
                                Talk directly to our lead software architect — no pushy sales reps.
                            </div>
                        </div>
                    </div>
                    <Link
                        href="/book"
                        className={`${TYPOGRAPHY.button} shrink-0 px-5 py-2.5 bg-primary text-black font-bold text-xs rounded-[8px] hover:bg-primary/90 transition-all flex items-center gap-2`}
                    >
                        <Video size={14} />
                        <span>Book 15-Min Chat</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

