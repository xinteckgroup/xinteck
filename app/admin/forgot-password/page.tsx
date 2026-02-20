"use client";

import { forgotPassword } from "@/actions/auth";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Image from "next/image";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await forgotPassword(email);
            // Always show success message for security? 
            // The action returns success: true, message: ...
            setMessage(res.message || "If an account exists, email sent.");
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
            {/* Left Side - Visuals */}
            {/* Matching Login Page Style */}
            <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                   <Image
                     src="/admin-bg/circuit.webp"
                     alt="Background"
                     fill
                     priority
                     quality={100}
                     className="object-cover opacity-80"
                   />
                   <div className="absolute inset-0 bg-black/40" />
                </div>
                
                <div className="relative z-10 p-12 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                    >
                       <Image 
                         src="/logos/logo-dark-full.webp"
                         alt="Xinteck Logo"
                         width={500}
                         height={180}
                         className="w-auto h-auto max-w-[80%] drop-shadow-2xl"
                         priority
                       />
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Forgot Password Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md space-y-6"
                >
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Enter your email to receive recovery instructions.</p>
                    </div>

                    {!message ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm text-center">
                                    {error}
                                </div>
                            )}
                                <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-muted/30 border border-input rounded-[10px] pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                {isLoading ? "Sending..." : <>Send Recovery Email <Send size={16} /></>}
                            </button>
                        </form>
                    ) : (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-[10px] text-center">
                            <p className="font-bold mb-2">Check your inbox</p>
                            <p className="text-sm opacity-80">{message}</p>
                        </div>
                    )}

                    <div className="text-center">
                        <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-2 transition-colors">
                            <ArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
