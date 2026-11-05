"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SoftwareFaqItem {
    question: string;
    answer: string;
}

const SOFTWARE_FAQS: SoftwareFaqItem[] = [
    {
        question: "Can our custom software integrate with physical barcode scanners, thermal printers, and weighing scales?",
        answer: "Yes. We support standard USB and Bluetooth point-of-sale peripherals directly through web and desktop bridges. Thermal receipt printers (ESC/POS), 1D/2D barcode scanners, and cash drawers trigger automatically without third-party driver headaches.",
    },
    {
        question: "How does the KRA eTIMS automated integration work legally?",
        answer: "We connect your system directly to the Kenya Revenue Authority eTIMS VSCU (Virtual Sales Control Unit) API. Every time a cashier or account manager issues an invoice, the system transmits the cryptographic invoice payload, receives the official KRA Control Code, and stamps the invoice with a scannable KRA QR code in under 1 second.",
    },
    {
        question: "What happens if one of our branches loses internet connection or power?",
        answer: "We implement an offline-first SQLite database cache. Cashiers can continue ringing up sales, scanning items, and issuing printed receipts without interruption. Once the Safaricom fiber or 4G connection restores, all buffered sales sync to the central cloud automatically.",
    },
    {
        question: "Do we get 100% full ownership of the source code and database?",
        answer: "Yes, absolutely. Unlike SaaS platforms that rent you software and hike subscription prices, with Xinteck you own 100% of the proprietary source code, database schemas, and documentation. No monthly user seat licensing fees ever.",
    },
    {
        question: "Will you provide hands-on training for our branch staff and managers?",
        answer: "Yes. Every custom build includes interactive video guides, role-based PDF quick-reference manuals, and dedicated in-person or live video training sessions for your management, accounting, and cashier staff.",
    },
];

export function CustomSoftwareFaqSection() {
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
                        Straightforward answers regarding integrations, compliance, IP ownership, and deployment.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {SOFTWARE_FAQS.map((faq, i) => {
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
                            <div className="text-sm font-bold text-foreground">Need a custom architecture review?</div>
                            <div className="text-xs text-foreground/70">
                                Walk us through your operations and workflows in a 1-on-1 strategy call.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a
                            href={`https://wa.me/254782063736?text=${encodeURIComponent(
                                "Hi Xinteck, I have a question regarding your Custom Software Development services."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${TYPOGRAPHY.button} px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-[8px] transition-all flex items-center gap-2 shadow-sm`}
                        >
                            <MessageCircle size={14} />
                            <span>Ask on WhatsApp</span>
                        </a>
                        <Link
                            href="/contact?service=Custom+Software+Development"
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

