"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    CreditCard,
    DollarSign,
    Fingerprint,
    Lock,
    Plane,
    RefreshCw,
    Send,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Wifi,
    WifiOff,
    Zap,
} from "lucide-react";
import { useState } from "react";

type SimulatorMode = "mpesa" | "offline" | "notification" | "biometric";

export function MobileAppSimulator() {
    const [mode, setMode] = useState<SimulatorMode>("mpesa");

    // M-Pesa State
    const [mpesaPin, setMpesaPin] = useState("");
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    // Offline State
    const [isOffline, setIsOffline] = useState(false);
    const [offlineOrders, setOfflineOrders] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    // Notification State
    const [notificationActive, setNotificationActive] = useState(true);

    // Biometric State
    const [isUnlocked, setIsUnlocked] = useState(false);

    const handleTriggerMpesa = () => {
        setIsPaid(false);
        setMpesaPin("");
        setIsPromptOpen(true);
    };

    const handleConfirmMpesa = () => {
        setIsPromptOpen(false);
        setIsPaid(true);
    };

    const handleAddOfflineOrder = () => {
        const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        setOfflineOrders((prev) => [...prev, orderId]);
    };

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setOfflineOrders([]);
        }, 1200);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-[480px] mx-auto">
            {/* Interactive Mode Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-[12px] bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-border shadow-md w-full">
                <button
                    type="button"
                    onClick={() => {
                        setMode("mpesa");
                        setIsPaid(false);
                        setIsPromptOpen(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                        mode === "mpesa"
                            ? "bg-primary text-black shadow-sm"
                            : "text-foreground hover:bg-white/10"
                    }`}
                >
                    <CreditCard size={13} />
                    <span>M-Pesa STK</span>
                </button>

                <button
                    type="button"
                    onClick={() => setMode("offline")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                        mode === "offline"
                            ? "bg-primary text-black shadow-sm"
                            : "text-foreground hover:bg-white/10"
                    }`}
                >
                    {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
                    <span>Offline Sync</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode("notification");
                        setNotificationActive(true);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                        mode === "notification"
                            ? "bg-primary text-black shadow-sm"
                            : "text-foreground hover:bg-white/10"
                    }`}
                >
                    <Zap size={13} />
                    <span>Push Alert</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setMode("biometric");
                        setIsUnlocked(false);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all cursor-pointer ${
                        mode === "biometric"
                            ? "bg-primary text-black shadow-sm"
                            : "text-foreground hover:bg-white/10"
                    }`}
                >
                    <Fingerprint size={13} />
                    <span>Biometrics</span>
                </button>
            </div>

            {/* Smartphone Hardware Frame */}
            <div className="relative w-full max-w-[340px] aspect-[9/18.5] rounded-[42px] p-3.5 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] border-4 border-neutral-700/80 ring-1 ring-white/20 select-none">
                {/* Hardware Outer Details */}
                <div className="absolute -left-[5px] top-24 w-[3px] h-10 bg-neutral-600 rounded-l-md" />
                <div className="absolute -left-[5px] top-38 w-[3px] h-10 bg-neutral-600 rounded-l-md" />
                <div className="absolute -right-[5px] top-28 w-[3px] h-14 bg-neutral-600 rounded-r-md" />

                {/* Inner Screen Display */}
                <div className="relative w-full h-full rounded-[32px] bg-[#0c0c0e] overflow-hidden flex flex-col justify-between border border-white/5 text-white">
                    {/* Top Status Bar & Dynamic Island */}
                    <div className="pt-2 px-5 flex items-center justify-between text-[11px] font-semibold text-neutral-300 z-30">
                        <span>09:41</span>
                        {/* Dynamic Island */}
                        <div className="w-24 h-5 rounded-full bg-black flex items-center justify-center gap-1.5 px-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-mono text-neutral-400">X-App</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {isOffline ? (
                                <Plane size={11} className="text-amber-400" />
                            ) : (
                                <Wifi size={11} className="text-emerald-400" />
                            )}
                            <span className="text-[10px]">100%</span>
                        </div>
                    </div>

                    {/* Notification Dropdown simulation */}
                    <AnimatePresence>
                        {mode === "notification" && notificationActive && (
                            <motion.div
                                initial={{ opacity: 0, y: -40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="absolute top-10 inset-x-3 z-40 bg-neutral-900/95 backdrop-blur-xl border border-white/15 p-3 rounded-[16px] shadow-2xl flex items-start gap-2.5"
                            >
                                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                                    <Sparkles size={14} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold text-[#D4AF37]">Xinteck Dispatch</p>
                                        <span className="text-[9px] text-neutral-400">Just now</span>
                                    </div>
                                    <p className="text-[11px] text-white font-medium leading-tight mt-0.5">
                                        Order #4092 is out for delivery! Rider Otieno is 3 mins away.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Screen Content Body */}
                    <div className="flex-1 p-4 flex flex-col justify-center items-center text-center overflow-y-auto z-10">
                        {/* Mode 1: M-Pesa STK Push */}
                        {mode === "mpesa" && (
                            <div className="w-full flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#00A349]/20 border border-[#00A349]/40 flex items-center justify-center text-[#00A349]">
                                    <CreditCard size={22} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">In-App Checkout</p>
                                    <h4 className="text-xl font-black text-white">KES 3,500</h4>
                                    <p className="text-[11px] text-neutral-400">Order #8831 · Westlands Hub</p>
                                </div>

                                {isPaid ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full bg-[#00A349]/15 border border-[#00A349]/40 rounded-[12px] p-3 flex flex-col items-center gap-1 text-center"
                                    >
                                        <CheckCircle2 size={24} className="text-[#00A349]" />
                                        <span className="text-xs font-bold text-white">M-Pesa Verified!</span>
                                        <span className="text-[10px] font-mono text-emerald-300">Ref: QK918274J2</span>
                                    </motion.div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleTriggerMpesa}
                                        className="w-full py-2.5 px-4 rounded-[10px] bg-[#00A349] hover:bg-[#008f40] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#00A349]/20 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span>Trigger M-Pesa Prompt</span>
                                        <Send size={13} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Mode 2: Offline-First Mode */}
                        {mode === "offline" && (
                            <div className="w-full flex flex-col items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                                    isOffline
                                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                }`}>
                                    {isOffline ? <WifiOff size={22} /> : <Wifi size={22} />}
                                </div>

                                <div className="flex items-center justify-between w-full bg-neutral-900 border border-neutral-800 rounded-[10px] p-2 px-3">
                                    <span className="text-xs font-bold text-neutral-300">Network Simulation:</span>
                                    <button
                                        type="button"
                                        onClick={() => setIsOffline(!isOffline)}
                                        className={`px-2.5 py-1 rounded-[6px] text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                            isOffline
                                                ? "bg-amber-500 text-black font-black"
                                                : "bg-emerald-500 text-black font-black"
                                        }`}
                                    >
                                        {isOffline ? "Offline Mode" : "Online 4G"}
                                    </button>
                                </div>

                                <div className="w-full bg-neutral-900/80 rounded-[10px] p-2.5 border border-white/5 flex flex-col gap-1 text-left">
                                    <p className="text-[10px] text-neutral-400 uppercase font-bold">Local SQLite Storage</p>
                                    <p className="text-xs font-semibold text-white">
                                        {offlineOrders.length} pending records queued
                                    </p>
                                </div>

                                <div className="flex gap-2 w-full">
                                    <button
                                        type="button"
                                        onClick={handleAddOfflineOrder}
                                        className="flex-1 py-2 px-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] transition-all cursor-pointer"
                                    >
                                        + Record Sale
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSync}
                                        disabled={isSyncing || offlineOrders.length === 0}
                                        className="flex-1 py-2 px-2 rounded-[8px] bg-[#D4AF37] text-black font-bold text-[11px] disabled:opacity-40 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                        <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} />
                                        <span>{isSyncing ? "Syncing..." : "Sync Cloud"}</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mode 3: Push Notifications */}
                        {mode === "notification" && (
                            <div className="w-full flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                                    <Zap size={22} />
                                </div>
                                <h4 className="text-sm font-bold text-white">Instant Customer Re-Engagement</h4>
                                <p className="text-xs text-neutral-400 leading-snug">
                                    Send targeted promo broadcasts or delivery alerts straight to lock screens with 98% open rates.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setNotificationActive(true)}
                                    className="py-2 px-4 rounded-[8px] bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider hover:scale-102 transition-transform cursor-pointer"
                                >
                                    Re-Send Notification
                                </button>
                            </div>
                        )}

                        {/* Mode 4: Biometrics */}
                        {mode === "biometric" && (
                            <div className="w-full flex flex-col items-center gap-3">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                                    isUnlocked
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                        : "bg-neutral-800 text-[#D4AF37] border border-[#D4AF37]/40 animate-pulse"
                                }`}>
                                    {isUnlocked ? <ShieldCheck size={28} /> : <Fingerprint size={28} />}
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        {isUnlocked ? "Session Unlocked" : "Biometric Protected"}
                                    </h4>
                                    <p className="text-[11px] text-neutral-400 mt-0.5">
                                        {isUnlocked
                                            ? "Access granted via hardware Keychain"
                                            : "Touch sensor or look at screen to unlock"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsUnlocked(!isUnlocked)}
                                    className="py-2 px-4 rounded-[8px] bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
                                >
                                    {isUnlocked ? "Lock App" : "Simulate FaceID / Touch"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bottom Home Indicator Bar */}
                    <div className="pb-2 flex justify-center z-20">
                        <div className="w-32 h-1 bg-white/40 rounded-full" />
                    </div>

                    {/* Simulated Safaricom M-Pesa STK Push Overlay */}
                    <AnimatePresence>
                        {isPromptOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
                            >
                                <div className="w-full bg-[#1b1b1b] border-2 border-[#00A349] rounded-[18px] p-4 text-center shadow-2xl flex flex-col gap-3">
                                    <div className="bg-[#00A349] text-white py-1 px-3 rounded-md text-xs font-black uppercase tracking-wider">
                                        Safaricom M-Pesa
                                    </div>
                                    <p className="text-xs text-white leading-snug">
                                        Pay <strong>KES 3,500.00</strong> to <strong>Xinteck Demo</strong>?
                                    </p>
                                    <div className="flex justify-center">
                                        <input
                                            type="password"
                                            maxLength={4}
                                            value={mpesaPin}
                                            onChange={(e) => setMpesaPin(e.target.value)}
                                            placeholder="Enter M-Pesa PIN"
                                            className="w-full max-w-[140px] text-center bg-black border border-neutral-700 rounded-lg px-2 py-1.5 text-xs text-white tracking-widest outline-none focus:border-[#00A349]"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsPromptOpen(false)}
                                            className="flex-1 py-1.5 rounded-md bg-neutral-800 text-neutral-300 text-xs font-semibold cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleConfirmMpesa}
                                            className="flex-1 py-1.5 rounded-md bg-[#00A349] text-white text-xs font-bold cursor-pointer"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Micro Explanatory Caption */}
            <p className="text-xs text-foreground/80 font-medium text-center">
                ✨ <strong>Interactive Simulation:</strong> Click the tabs above to test real-world Kenyan mobile functionality.
            </p>
        </div>
    );
}

