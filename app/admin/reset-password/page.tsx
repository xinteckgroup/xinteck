"use client";

import { resetPassword } from "@/actions/auth";
import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    if (!token) {
        return (
            <div className="text-center text-destructive">
                <p>Invalid or missing token.</p>
                <Link href="/admin/login" className="text-foreground underline mt-4 block">Return to Login</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            setErrorMsg("Passwords do not match");
            return;
        }
        
        setStatus("loading");
        setErrorMsg("");

        try {
            await resetPassword(token, password);
            setStatus("success");
            setTimeout(() => router.push("/admin/login"), 3000);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || "Failed to reset password. Token might be expired.");
        }
    };

    if (status === "success") {
        return (
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Password Reset Successful!</h2>
                <p className="text-muted-foreground">Redirecting to login...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded text-sm text-center">
                    {errorMsg}
                </div>
            )}

            <div className="space-y-4">
                 <PasswordInput 
                     placeholder="New Password"
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="bg-muted"
                     required
                     minLength={6}
                     leftIcon={<Lock size={18} />}
                 />
                 <PasswordInput 
                     placeholder="Confirm Password"
                     value={confirm}
                     onChange={e => setConfirm(e.target.value)}
                     className="bg-muted"
                     required
                     minLength={6}
                     leftIcon={<Lock size={18} />}
                 />
            </div>

            <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
            >
                {status === "loading" ? "Updating..." : <>Set New Password <ArrowRight size={18} /></>}
            </button>
        </form>
    );
}



export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-muted">
                <div className="absolute inset-0 z-0">
                   <Image
                     src="/admin-bg/circuit.webp"
                     alt="Background"
                     fill
                     priority
                     quality={100}
                     className="object-cover opacity-60"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
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
                         width={600}
                         height={225}
                         className="w-auto h-auto max-w-[90%] max-h-[300px]"
                         priority
                       />
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Reset Password Form */}
            <div className="flex items-center justify-center p-8 bg-background/50 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-md space-y-6"
                >
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Set New Password</h1>
                    </div>
                    <Suspense fallback={<div className="text-center">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </motion.div>
            </div>
        </div>
    );
}
