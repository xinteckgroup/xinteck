"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const HOME_FAQS: FaqItem[] = [
  {
    q: "Do you integrate with M-Pesa and Safaricom Daraja APIs?",
    a: "Yes. M-Pesa Daraja STK Push, C2B, B2C, and automated instant payment confirmation are standard in all our web and mobile applications.",
  },
  {
    q: "Are your platforms eTIMS and KRA compliant?",
    a: "Absolutely. We build direct eTIMS electronic tax invoicing APIs into our ERP, POS, and custom software systems, ensuring complete compliance with KRA regulations from day one.",
  },
  {
    q: "What is your typical project timeline?",
    a: "Timelines vary depending on complexity. Executive identity and brand design takes 48-72 hours, standard commercial web platforms 3-4 weeks, while complex full-stack enterprise systems or mobile apps typically range from 9-12 weeks.",
  },
  {
    q: "What payment currencies and terms do you offer?",
    a: "We bill in Kenyan Shillings (KES) with phased milestone payments (e.g., 40% kickoff, 30% beta demo, 30% launch handover). We accept M-Pesa Paybill, bank transfers, and cards.",
  },
  {
    q: "Do you offer post-launch support and hosting?",
    a: "Yes. Every project includes a 30-day post-launch warranty, and we provide ongoing maintenance, cloud backups, and DevOps monitoring to guarantee 99.9% uptime.",
  },
];

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-24 px-6 relative overflow-hidden" id="faq">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 md:gap-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className={`${TYPOGRAPHY.tableHeader} text-primary font-bold uppercase tracking-[0.2em]`}>
            Common Questions
          </h2>
          <h3 className={`${TYPOGRAPHY.pageTitle} text-foreground text-2xl md:text-4xl`}>
            CLEAR <span className="text-foreground/40">ANSWERS.</span>
          </h3>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {HOME_FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.q}
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
                  type="button"
                  onClick={() => toggleFaq(i)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm md:text-base text-foreground flex items-center gap-3">
                    <HelpCircle
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isOpen ? "text-primary" : "text-foreground/40"
                      }`}
                    />
                    <span>{faq.q}</span>
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
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

