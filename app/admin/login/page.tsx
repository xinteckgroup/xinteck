"use client";

import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewlyRegistered = searchParams.get("registered") === "true";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      // Success - Redirect
      router.push('/admin');
      
    } catch (err) {
      setError('An unexpected system error occurred.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 z-0">
           {/* IMAGE IMPLEMENTED HALFWAY */}
           <NextImage
             src="/admin-bg/circuit.webp"
             alt="Login Background"
             fill
             priority
             quality={100}
             className="object-cover opacity-80" 
           />
           {/* Subtle gradient to ensure logo contrast if needed */}
           <div className="absolute inset-0 bg-black/40" />
        </div>
        
        {/* LOGO CENTERED ON THE IMAGE */}
        <div className="relative z-10 p-12 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
               <NextImage 
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

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {isNewlyRegistered && !error && (
                <div className="bg-green-500/40 border border-green-500/20 rounded-[10px] p-4 flex items-center gap-3 text-green-500 text-sm">
                    <CheckCircle2 size={18} />
                    Registration Complete! You may now securely log in.
                </div>
            )}
            {error && (
                <div className="bg-red-500/40 border border-red-500/20 rounded-[10px] p-4 flex items-center gap-3 text-red-500 text-sm">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@xinteck.co.ke"
                  className="w-full bg-muted/30 border border-input rounded-[10px] pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground/80" htmlFor="password">Password</label>
                <Link href="/admin/forgot-password" className="text-sm text-primary hover:text-foreground transition-colors">
                  Forgot password?
                </Link>
              </div>
                <PasswordInput 
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-muted/30 border border-input"
                  required
                  leftIcon={<Lock size={18} className="text-muted-foreground" />}
                />
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded-[4px] w-4 h-4 border-input bg-background text-primary focus:ring-offset-background focus:ring-primary cursor-pointer" 
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground select-none cursor-pointer hover:text-foreground transition-colors">Remember me for 30 days</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-[10px] flex items-center justify-center gap-2 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/admin/register" className="text-primary hover:text-foreground transition-colors font-medium">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminLoginContent />
    </Suspense>
  );
}
