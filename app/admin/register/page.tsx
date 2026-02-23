"use client";

import { registerUser, validateInvitation } from "@/actions/auth";
import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, ShieldAlert, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Suspense } from "react";

/*
Purpose: Internal component to handle the registration logic with search params.
Decision: Separated to allow wrapping in Suspense for Next.js build compatibility.
*/
function RegisterContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [formData, setFormData] = useState({ name: "", password: "" });
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [invitedBy, setInvitedBy] = useState("");
    
    // Purpose: Track validation lifecycle to show appropriate UI states (Loading -> Form or Error).
    // States: "validating" | "valid" | "invalid"
    const [status, setStatus] = useState<"validating" | "valid" | "invalid">("validating");
    const [statusMessage, setStatusMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("invalid");
            setStatusMessage("Registration is by invitation only.");
            return;
        }

        // Purpose: validateInvitation is a server action. We call it here to verify the token before showing the form.
        async function validate() {
            try {
                const res = await validateInvitation(token!);
                if (res.valid) {
                    setEmail(res.email!);
                    setRole(res.role!);
                    setInvitedBy(res.invitedBy || "Admin");
                    setStatus("valid");
                } else {
                    setStatus("invalid");
                    setStatusMessage(res.message || "Invalid invitation.");
                }
            } catch (e) {
                setStatus("invalid");
                setStatusMessage("Failed to validate invitation.");
            }
        }
        validate();
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const res = await registerUser({ 
                name: formData.name, 
                password: formData.password,
                token: token! 
            });
            
            if (!res.success) {
                throw new Error(res.message);
            }
            // Redirect to login
            router.push("/admin/login?registered=true");
        } catch (err: any) {
            const msg = err.message || "Registration failed";
            if (msg.toLowerCase().includes("expired") || msg.toLowerCase().includes("invalid")) {
                setStatus("invalid");
                setStatusMessage(msg);
                return;
            }
            setError(msg);
            setIsSubmitting(false);
        }
    };

    // Purpose: Block access if the token is invalid or missing.
    // 1. INVALID STATE
    if (status === "invalid") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-card border border-destructive/20 rounded-[20px] p-8 text-center shadow-lg"
                 >
                    <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 text-destructive">
                        <ShieldAlert size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-foreground">Access Denied</h2>
                    <p className="text-muted-foreground mb-8">{statusMessage}</p>
                    <Link 
                        href="/admin/login"
                        className="inline-flex items-center justify-center w-full bg-foreground text-background font-bold py-3 rounded-xl hover:opacity-80 transition-colors"
                    >
                        Return to Login
                    </Link>
                 </motion.div>
            </div>
        );
    }

    // Purpose: Show a loading spinner while the server verifies the token.
    // 2. VALIDATING STATE
    if (status === "validating") {
         return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-foreground font-medium text-sm">Verifying secure link...</p>
                </div>
            </div>
         );
    }

    // 3. VALID STATE (Form)
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                   {/* IMAGE IMPLEMENTED HALFWAY */}
                   <Image
                     src="/admin-bg/circuit.webp"
                     alt="Register Background"
                     fill
                     priority
                     quality={100}
                     className="object-cover opacity-80"
                   />
                   {/* Overlay matching Login */}
                   <div className="absolute inset-0 bg-black/40" />
                </div>
                
                {/* LOGO CENTERED ON THE IMAGE */}
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

            {/* Right Side - Register Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-bold mb-4">
                            You've been invited by {invitedBy}
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Set up your credentials to join the team.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={`space-y-6 ${isSubmitting ? "pointer-events-none opacity-50 transition-opacity" : "transition-opacity"}`}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-[10px] p-4 text-red-500 text-sm flex items-center gap-3">
                                <span className="font-bold">Error:</span> {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Read Only Email */}
                            <div className="relative opacity-60">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full bg-muted/50 border border-input rounded-[10px] pl-10 pr-4 py-3 text-muted-foreground cursor-not-allowed"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-green-600 dark:text-green-400 font-bold bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded">
                                    VERIFIED
                                </div>
                            </div>

                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-muted/30 border border-input rounded-[10px] pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-all"
                                    required
                                    autoFocus
                                />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <PasswordInput 
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="bg-muted/30 text-foreground border-input"
                                    required
                                    leftIcon={<Lock size={18} className="text-muted-foreground" />}
                                />
                                <p className="text-[10px] text-muted-foreground px-1">
                                    Must be at least 8 characters.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                            ) : (
                                <>Complete Registration <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}

/*
Purpose: Public-facing registration page gated by invitation tokens.
Decision: We validate the token immediately on mount and lock the email field to ensure the user can only register for the invited identity.
*/
export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
