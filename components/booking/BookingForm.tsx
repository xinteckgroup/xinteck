"use client";

import { formatTime12h } from "@/lib/booking-utils";
import { TYPOGRAPHY } from "@/lib/typography";
import { ArrowLeft, Loader2, RefreshCw, Send, ShieldAlert } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface BookingFormProps {
    selectedDate: string; // YYYY-MM-DD
    selectedSlot: string; // HH:MM
    servicesList: string[];
    onSubmit: (formData: {
        name: string;
        email: string;
        phone: string;
        company?: string;
        service?: string;
        message?: string;
        honeypot?: string;
        captchaToken?: string;
        captchaAnswer?: number;
    }) => Promise<void>;
    isSubmitting: boolean;
    error: string | null;
    onBackToSlots: () => void;
    /** Pre-selected service from scope estimator query param */
    initialService?: string;
    /** Pre-filled message from scope estimator (e.g. budget context) */
    initialMessage?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
    selectedDate,
    selectedSlot,
    servicesList,
    onSubmit,
    isSubmitting,
    error,
    onBackToSlots,
    initialService,
    initialMessage,
}) => {
    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [service, setService] = useState(() => {
        // If an initialService was passed via query param, try to match it against the services list
        if (initialService) {
            const match = servicesList.find(
                (s) => s.toLowerCase() === initialService.toLowerCase()
            );
            if (match) return match;
        }
        return servicesList[0] || "Web Development";
    });
    const [message, setMessage] = useState(initialMessage || "");
    const [honeypot, setHoneypot] = useState("");

    // Cryptographic Math Captcha state
    const [captcha, setCaptcha] = useState<{ num1: number; num2: number; token: string }>({
        num1: 5,
        num2: 7,
        token: "",
    });
    const [userCaptcha, setUserCaptcha] = useState("");
    const [captchaError, setCaptchaError] = useState<string | null>(null);

    const refreshCaptcha = useCallback(async () => {
        try {
            const res = await fetch("/api/captcha");
            const data = await res.json();
            if (data.token) {
                setCaptcha({ num1: data.num1, num2: data.num2, token: data.token });
            } else {
                const n1 = Math.floor(Math.random() * 9) * 2 + 3;
                const n2 = Math.floor(Math.random() * 9) * 2 + 3;
                setCaptcha({ num1: n1, num2: n2, token: "" });
            }
        } catch {
            const n1 = Math.floor(Math.random() * 9) * 2 + 3;
            const n2 = Math.floor(Math.random() * 9) * 2 + 3;
            setCaptcha({ num1: n1, num2: n2, token: "" });
        }
        setUserCaptcha("");
        setCaptchaError(null);
    }, []);

    useEffect(() => {
        refreshCaptcha();
    }, [refreshCaptcha]);

    useEffect(() => {
        if (initialService && servicesList.length > 0) {
            const match = servicesList.find(
                (s) => s.toLowerCase() === initialService.toLowerCase()
            );
            if (match) {
                setService(match);
                return;
            }
        }
        if (servicesList.length > 0 && !service) {
            setService(servicesList[0]);
        }
    }, [servicesList, service, initialService]);

    useEffect(() => {
        if (initialMessage) {
            setMessage((prev) => (prev ? prev : initialMessage));
        }
    }, [initialMessage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCaptchaError(null);

        const cleanAnswer = userCaptcha.trim();
        if (!cleanAnswer) {
            setCaptchaError("Please solve the calculation.");
            return;
        }

        const parsedAnswer = parseInt(cleanAnswer, 10);
        if (isNaN(parsedAnswer) || !/^-?\d+$/.test(cleanAnswer)) {
            setCaptchaError("Please enter a valid numeric answer.");
            return;
        }

        if (parsedAnswer !== captcha.num1 + captcha.num2) {
            setCaptchaError("Incorrect answer. Please try again.");
            return;
        }

        await onSubmit({
            name,
            email,
            phone,
            company: company.trim() || undefined,
            service,
            message: message.trim() || undefined,
            honeypot,
            captchaToken: captcha.token || undefined,
            captchaAnswer: parsedAnswer,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
            {/* Header with Slot Summary & Back button */}
            <div className="border-b border-border/40 pb-4">
                <button
                    type="button"
                    onClick={onBackToSlots}
                    className="text-xs text-foreground/80 hover:text-primary flex items-center gap-1.5 font-bold mb-2 transition-colors cursor-pointer"
                >
                    <ArrowLeft size={14} /> Back to Slots
                </button>

                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-black tracking-widest text-primary">
                        Step 3 · Confirm Your Details
                    </span>
                    <span className="text-xs bg-primary/10 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full font-bold">
                        Complimentary Consultation
                    </span>
                </div>

                <div className="mt-2.5 p-3 rounded-xl bg-card border border-border flex items-center justify-between">
                    <div>
                        <p className="text-xs text-foreground/80 font-bold">Selected Slot (EAT):</p>
                        <p className="text-sm font-black text-foreground">
                            📅 {selectedDate} · ⏰ {formatTime12h(selectedSlot)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onBackToSlots}
                        className="text-xs font-bold text-primary hover:underline"
                    >
                        Change
                    </button>
                </div>
            </div>

            {/* Error Notification */}
            {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-start gap-2.5">
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className={`${TYPOGRAPHY.tableHeader} text-[11px] text-foreground font-bold uppercase`}>
                        Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Kamau"
                        className={`${TYPOGRAPHY.input} bg-muted/10 rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-foreground/50 text-foreground focus:border-primary border border-transparent focus:border`}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <label className={`${TYPOGRAPHY.tableHeader} text-[11px] text-foreground font-bold uppercase`}>
                        Work/Personal Email <span className="text-primary">*</span>
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@company.com"
                        className={`${TYPOGRAPHY.input} bg-muted/10 rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-foreground/50 text-foreground focus:border-primary border border-transparent focus:border`}
                    />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                    <label className={`${TYPOGRAPHY.tableHeader} text-[11px] text-foreground font-bold uppercase`}>
                        Phone / WhatsApp <span className="text-primary">*</span>
                    </label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className={`${TYPOGRAPHY.input} bg-muted/10 rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-foreground/50 text-foreground focus:border-primary border border-transparent focus:border`}
                    />
                </div>

                {/* Company Name */}
                <div className="flex flex-col gap-1.5">
                    <label className={`${TYPOGRAPHY.tableHeader} text-[11px] text-foreground font-bold uppercase`}>
                        Company / Organization (Optional)
                    </label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Global Ltd"
                        className={`${TYPOGRAPHY.input} bg-muted/10 rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-foreground/50 text-foreground focus:border-primary border border-transparent focus:border`}
                    />
                </div>
            </div>

            {/* Service of Interest */}
            <div className="flex flex-col gap-1.5">
                <label className={`${TYPOGRAPHY.tableHeader} text-[11px] text-foreground font-bold uppercase`}>
                    Primary Service of Interest
                </label>
                <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={`${TYPOGRAPHY.input} bg-muted/10 rounded-[10px] px-4 py-3 outline-none transition-all text-foreground focus:border-primary border border-transparent focus:border cursor-pointer appearance-none`}
                >
                    {servicesList.map((srv) => (
                        <option key={srv} value={srv} className="bg-background text-foreground">
                            {srv}
                        </option>
                    ))}
                    <option value="General Technical Consultation" className="bg-background text-foreground">
                        General Technical Consultation
                    </option>
                </select>
            </div>

            {/* Message / Agenda */}
            <div className="flex flex-col gap-1.5">
                <label className={`${TYPOGRAPHY.tableHeader} text-[11px] text-foreground font-bold uppercase`}>
                    Briefly describe your goals or what you&apos;d like to discuss (Optional)
                </label>
                <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. We are building an on-demand platform and need guidance on M-Pesa automated payouts and serverless cloud deployment..."
                    className={`${TYPOGRAPHY.input} bg-muted/10 rounded-[10px] px-4 py-3 outline-none transition-all placeholder:text-foreground/50 text-foreground focus:border-primary border border-transparent focus:border resize-none`}
                />
            </div>

            {/* Anti-Spam Math Verification */}
            <div className="p-4 rounded-[10px] bg-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                    <span>Security Check:</span>
                    <span className="bg-primary/20 text-primary font-black px-2.5 py-1 rounded-md tracking-wider">
                        {captcha.num1} + {captcha.num2} = ?
                    </span>
                    <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-foreground/75 hover:text-primary transition-colors p-1"
                        aria-label="Refresh security challenge"
                    >
                        <RefreshCw size={14} />
                    </button>
                </div>

                <div className="w-full sm:w-32">
                    <input
                        type="number"
                        required
                        value={userCaptcha}
                        onChange={(e) => {
                            setUserCaptcha(e.target.value);
                            setCaptchaError(null);
                        }}
                        placeholder="Answer"
                        className="w-full bg-background border border-border rounded-[8px] px-3 py-1.5 text-center text-sm font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                </div>
            </div>

            {captchaError && (
                <p className="text-xs text-rose-500 font-medium -mt-2">
                    {captchaError}
                </p>
            )}

            {/* Honeypot field (hidden from real users) */}
            <input
                type="text"
                name="website_url"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
            />

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3.5 px-6 rounded-[10px] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 tracking-wider uppercase text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group mt-2 ${TYPOGRAPHY.button}`}
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>Reserving Your Call...</span>
                    </>
                ) : (
                    <>
                        <span>Confirm 15-Minute Discovery Call</span>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>

            <p className="text-[11px] text-foreground/75 font-medium text-center leading-relaxed">
                A calendar invitation with Google Meet details will be delivered to your email.
            </p>
        </form>
    );
};

export default BookingForm;
