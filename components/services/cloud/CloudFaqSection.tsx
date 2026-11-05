"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CloudFaqItem {
    question: string;
    answer: string;
}

const CLOUD_FAQS: CloudFaqItem[] = [
    {
        question: "Can you realistically lower our existing AWS or Google Cloud bills without hurting speed?",
        answer: "Yes, typically by 35% to 50%. We audit and eliminate over-provisioned CPU/RAM, implement intelligent auto-scaling groups that sleep during off-peak night hours, migrate static traffic to global CDN caching, and convert unreserved on-demand instances to reserved or spot pricing.",
    },
    {
        question: "How does zero-downtime deployment work without disconnecting active users?",
        answer: "We configure blue-green or rolling container deployment pipelines. New code versions boot and pass health checks in isolated containers before the load balancer routes any incoming traffic to them. Active users finish their sessions seamlessly without error screens.",
    },
    {
        question: "Who retains root access and cryptographic keys to our infrastructure?",
        answer: "You retain 100% full master access and organizational ownership. All infrastructure is provisioned directly inside your own AWS, GCP, or DigitalOcean account. We configure least-privilege IAM roles and deliver all Terraform Infrastructure-as-Code (IaC) scripts to your repository.",
    },
    {
        question: "How do you protect our servers from DDoS attacks and brute-force bots?",
        answer: "We deploy Cloudflare Enterprise edge protection, rate-limiting rules, Web Application Firewalls (WAF), and close all unnecessary public ports. Only your load balancer is exposed to the internet, keeping databases and internal microservices on private, isolated subnets.",
    },
    {
        question: "Can you migrate our databases and systems without taking our business offline?",
        answer: "Yes. We configure real-time change-data-capture (CDC) and live database replication between your legacy server and the new cloud cluster. Once data is verified 1:1 in sync, we execute an instantaneous DNS cutover with zero disruption to your daily operations.",
    },
];

export function CloudFaqSection() {
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
                        Answers to the key reliability, security, and migration concerns enterprise clients have.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="flex flex-col gap-4">
                    {CLOUD_FAQS.map((faq, i) => {
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
                            <div className="text-sm font-bold text-foreground">Need an urgent infrastructure assessment?</div>
                            <div className="text-xs text-foreground/70">
                                Connect with our Principal DevOps Engineer for a confidential audit.
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a
                            href={`https://wa.me/254782063736?text=${encodeURIComponent(
                                "Hi Xinteck, I have a question regarding your Cloud & DevOps services."
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${TYPOGRAPHY.button} px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-[8px] transition-all flex items-center gap-2 shadow-sm`}
                        >
                            <MessageCircle size={14} />
                            <span>Ask on WhatsApp</span>
                        </a>
                        <Link
                            href="/contact?service=Cloud+%26+DevOps"
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
