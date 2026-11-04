"use client";

import type { RoiLeadPayload, RoiMode } from "@/types/roi";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";

interface SendReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: RoiMode;
    investmentTier: string;
    investmentAmount: number;
    annualValue: number;
    paybackMonths: number;
    roiPercentage: number;
}

export function SendReportModal({
    isOpen,
    onClose,
    mode,
    investmentTier,
    investmentAmount,
    annualValue,
    paybackMonths,
    roiPercentage,
}: SendReportModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Math captcha
    const [captcha, setCaptcha] = useState(() => {
        const n1 = Math.floor(Math.random() * 9) * 2 + 3;
        const n2 = Math.floor(Math.random() * 9) * 2 + 3;
        return { num1: n1, num2: n2, answer: n1 + n2 };
    });
    const [userCaptcha, setUserCaptcha] = useState("");

    const regenerateCaptcha = useCallback(() => {
        const n1 = Math.floor(Math.random() * 9) * 2 + 3;
        const n2 = Math.floor(Math.random() * 9) * 2 + 3;
        setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });
        setUserCaptcha("");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validate captcha
        if (parseInt(userCaptcha) !== captcha.answer) {
            setError("Incorrect answer. Please try again.");
            regenerateCaptcha();
            return;
        }

        setIsSubmitting(true);

        try {
            const payload: RoiLeadPayload = {
                name,
                email,
                phone,
                company: company || undefined,
                mode,
                investmentTier,
                investmentAmount,
                annualValue,
                paybackMonths,
                roiPercentage,
                captchaAnswer: captcha.answer,
                honeypot,
            };

            const res = await fetch("/api/roi-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send report");
            }

            setSubmitted(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "w-full bg-muted/40 dark:bg-white/5 border border-border rounded-[10px] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all";

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="w-full max-w-md bg-card/95 dark:bg-[#0A0A0A]/95 border border-border rounded-[16px] backdrop-blur-2xl p-6 md:p-8 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-foreground">
                                {submitted
                                    ? "Report Sent!"
                                    : "Email Your ROI Report"}
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="flex flex-col items-center gap-4 py-8">
                                <CheckCircle2
                                    size={48}
                                    className="text-emerald-500"
                                />
                                <p className="text-center text-foreground/90 text-sm">
                                    Your personalized ROI breakdown has been
                                    sent to{" "}
                                    <span className="text-primary font-bold">
                                        {email}
                                    </span>
                                    . Our team will reach out shortly.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 px-6 py-3 bg-primary text-black font-bold text-sm rounded-[10px] hover:scale-[1.02] transition-transform cursor-pointer"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4"
                            >
                                {/* Honeypot — hidden from users */}
                                <input
                                    type="text"
                                    name="website_url"
                                    value={honeypot}
                                    onChange={(e) =>
                                        setHoneypot(e.target.value)
                                    }
                                    className="absolute -top-[9999px] -left-[9999px]"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                />

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        minLength={2}
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="John Kamau"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="john@company.co.ke"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        minLength={8}
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                        placeholder="+254 7XX XXX XXX"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                        Company{" "}
                                        <span className="text-muted-foreground/70">
                                            (optional)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) =>
                                            setCompany(e.target.value)
                                        }
                                        placeholder="Acme Ltd"
                                        className={inputClass}
                                    />
                                </div>

                                {/* Math Captcha */}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                        Quick Verify: What is{" "}
                                        {captcha.num1} + {captcha.num2}? *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={userCaptcha}
                                        onChange={(e) =>
                                            setUserCaptcha(e.target.value)
                                        }
                                        placeholder="Your answer"
                                        className={inputClass}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 border border-red-500/20 rounded-[10px] p-3">
                                        <AlertCircle size={14} />
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 w-full mt-2 px-6 py-3.5 bg-primary text-black font-bold text-sm uppercase tracking-wider rounded-[10px] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer shadow-md"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Send My ROI Report
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

