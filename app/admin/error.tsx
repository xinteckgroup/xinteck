"use client";

import { motion } from "framer-motion";
import { AlertTriangle, LogIn, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

/*
  Purpose: Admin-specific error boundary that catches unrecoverable client-side errors
  (e.g., corrupted cookies, stale JS chunks, hydration failures) and offers the user
  a self-healing "Clear Session & Reload" action instead of a permanent blank screen.
  
  Decision: We programmatically wipe localStorage, sessionStorage, and the session_token
  cookie before hard-refreshing, which resolves 99% of "works in Incognito but not in
  normal browser" scenarios caused by stale client state.
*/

function clearAllClientState() {
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}
    // Delete session cookie
    document.cookie = "session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;";
    // Hard reload bypassing cache
    window.location.href = "/admin/login";
}

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Admin Error Boundary]", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent opacity-50" />

            <div className="max-w-lg w-full text-center flex flex-col items-center gap-10 relative z-10">
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -8, 8, -8, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    className="w-20 h-20 rounded-[10px] bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20"
                >
                    <AlertTriangle size={40} />
                </motion.div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-xs font-bold tracking-[0.4em] text-red-500 uppercase">
                        Session Error
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        Something went wrong.
                    </h2>
                    <p className="text-sm text-white/50 leading-relaxed max-w-sm mx-auto">
                        Your browser may have stored outdated session data. 
                        Clear your session and try again, or attempt a quick reload.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-8 py-2.5 bg-white/10 text-white/80 font-bold rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
                    >
                        <RefreshCcw size={16} /> Retry
                    </button>
                    <button
                        onClick={clearAllClientState}
                        className="px-8 py-2.5 bg-[#D4AF37] text-black font-black rounded-full hover:bg-[#D4AF37]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
                    >
                        <LogIn size={16} /> Clear Session & Reload
                    </button>
                </div>
            </div>
        </div>
    );
}
