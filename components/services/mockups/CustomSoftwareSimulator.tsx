"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertCircle,
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Database,
    DollarSign,
    FileCheck,
    FileText,
    Key,
    Layers,
    Lock,
    QrCode,
    RefreshCw,
    Shield,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

type RoleMode = "cashier" | "manager" | "ceo";
type PortalTab = "feed" | "etims" | "rbac";

export function CustomSoftwareSimulator() {
    const [activeTab, setActiveTab] = useState<PortalTab>("feed");
    const [activeRole, setActiveRole] = useState<RoleMode>("ceo");
    const [etimsGenerated, setEtimsGenerated] = useState<boolean>(false);
    const [generatingEtims, setGeneratingEtims] = useState<boolean>(false);

    const handleGenerateEtims = () => {
        setGeneratingEtims(true);
        setTimeout(() => {
            setGeneratingEtims(false);
            setEtimsGenerated(true);
        }, 1200);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
            {/* Top Interactive Selector Bar */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 rounded-[10px] shadow-md text-xs">
                {/* Mode Tabs */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-[8px]">
                    <button
                        onClick={() => setActiveTab("feed")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "feed"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Activity size={13} />
                        <span>Live Feed</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("etims")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "etims"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <FileCheck size={13} />
                        <span>KRA eTIMS</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("rbac")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "rbac"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Users size={13} />
                        <span>Role Permissions</span>
                    </button>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-foreground/60 hidden sm:inline">Viewing as:</span>
                    <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-[6px]">
                        {(["ceo", "manager", "cashier"] as RoleMode[]).map((role) => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={`px-2 py-0.5 rounded-[4px] uppercase font-bold text-[10px] transition-all ${
                                    activeRole === role
                                        ? "bg-primary text-black font-extrabold"
                                        : "text-foreground/70 hover:text-foreground"
                                }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Application Container */}
            <div className="w-full rounded-[12px] overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl">
                {/* Header App Ribbon */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-[6px] bg-primary flex items-center justify-center text-black font-black text-xs">
                            X
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xs text-zinc-100 leading-tight">
                                Enterprise Ops Suite v4.2
                            </span>
                            <span className="text-[10px] text-zinc-400">
                                Multi-Branch Enterprise Network
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            3 Branches Syncing
                        </span>
                        <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-primary text-[10px] font-bold">
                            {activeRole === "ceo" ? "👑" : activeRole === "manager" ? "💼" : "💳"}
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-4 md:p-6 min-h-[380px] bg-zinc-950 text-white flex flex-col justify-between">
                    {/* TAB 1: Live Multi-Branch Feed */}
                    {activeTab === "feed" && (
                        <motion.div
                            key="feed"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Executive Metric Cards (Masked if Cashier) */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Today's Revenue</span>
                                    {activeRole === "cashier" ? (
                                        <span className="text-zinc-500 font-mono text-sm mt-1">•••••• (Restricted)</span>
                                    ) : (
                                        <span className="text-primary font-black text-base md:text-lg mt-0.5">KES 842,500</span>
                                    )}
                                    <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                                        <TrendingUp size={10} /> +18.4% vs Yesterday
                                    </span>
                                </div>

                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Orders Processed</span>
                                    <span className="text-zinc-100 font-black text-base md:text-lg mt-0.5">384 Invoices</span>
                                    <span className="text-[9px] text-zinc-400 mt-1">100% Daraja Reconciled</span>
                                </div>

                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Stock Health</span>
                                    <span className="text-amber-400 font-black text-base md:text-lg mt-0.5">2 Low Alerts</span>
                                    <span className="text-[9px] text-amber-400/80 mt-1">Auto-PO Dispatched</span>
                                </div>
                            </div>

                            {/* Live Transaction Ledger */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                                    <span>Real-Time Branch Stream</span>
                                    <span className="font-mono text-[10px] text-emerald-400">Sub-100ms Sync</span>
                                </div>

                                <div className="flex flex-col gap-1.5 text-xs">
                                    {[
                                        {
                                            branch: "Westlands Mall",
                                            item: "Enterprise Server Rig (x2)",
                                            amount: "KES 180,000",
                                            time: "Just now",
                                            status: "M-Pesa STK Verified",
                                        },
                                        {
                                            branch: "CBD Branch",
                                            item: "POS Terminal Supplies",
                                            amount: "KES 42,000",
                                            time: "2m ago",
                                            status: "Bank Transfer Logged",
                                        },
                                        {
                                            branch: "Mombasa Hub",
                                            item: "Logistics Consumables",
                                            amount: "KES 28,500",
                                            time: "7m ago",
                                            status: "eTIMS Receipt Issued",
                                        },
                                    ].map((tx, idx) => (
                                        <div
                                            key={idx}
                                            className="p-2.5 rounded-[6px] bg-zinc-900/40 border border-zinc-800/60 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-100">{tx.item}</span>
                                                    <span className="text-[10px] text-zinc-400">{tx.branch} · {tx.time}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-primary">
                                                    {activeRole === "cashier" && idx === 0 ? "KES •••" : tx.amount}
                                                </span>
                                                <span className="text-[9px] text-emerald-400">{tx.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB 2: KRA eTIMS Auto-Compliance Simulation */}
                    {activeTab === "etims" && (
                        <motion.div
                            key="etims"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-[6px] bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                                        <FileCheck size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">KRA eTIMS Automated Compliance</h4>
                                        <p className="text-[10px] text-zinc-400">Direct integration via KRA VSCU API</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                                    Status: Connected
                                </span>
                            </div>

                            {/* Simulated eTIMS Invoice Ticket */}
                            <div className="p-4 rounded-[8px] bg-zinc-900/80 border border-zinc-800 flex flex-col gap-3 font-mono text-xs">
                                <div className="flex items-center justify-between text-zinc-400 text-[11px] pb-2 border-b border-zinc-800">
                                    <span>INVOICE: #INV-2026-9041</span>
                                    <span>KRA PIN: P051982341Z</span>
                                </div>

                                <div className="flex flex-col gap-1 text-[11px]">
                                    <div className="flex justify-between text-zinc-300">
                                        <span>Subtotal (Net):</span>
                                        <span>KES 50,000.00</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-300">
                                        <span>16% VAT (Automated):</span>
                                        <span className="text-amber-400">KES 8,000.00</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-zinc-100 text-xs pt-1 border-t border-zinc-800">
                                        <span>Gross Payable:</span>
                                        <span className="text-primary font-black">KES 58,000.00</span>
                                    </div>
                                </div>

                                {etimsGenerated ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-[6px] bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[10px] text-emerald-400 font-bold uppercase">
                                                ✓ KRA eTIMS Control Code Assigned
                                            </span>
                                            <span className="text-[10px] text-zinc-300 font-mono">
                                                KRA-VSCU-202611-948102
                                            </span>
                                            <span className="text-[9px] text-zinc-500">
                                                QR Code signed & transmitted to tax portal.
                                            </span>
                                        </div>
                                        <div className="w-12 h-12 bg-white rounded p-1 flex items-center justify-center shrink-0">
                                            <QrCode size={40} className="text-black" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={handleGenerateEtims}
                                        disabled={generatingEtims}
                                        className="w-full py-2.5 bg-primary text-black font-extrabold rounded-[6px] hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                                    >
                                        {generatingEtims ? (
                                            <>
                                                <RefreshCw size={13} className="animate-spin" />
                                                <span>Transmitting to KRA eTIMS API...</span>
                                            </>
                                        ) : (
                                            <>
                                                <QrCode size={14} />
                                                <span>Simulate 1-Click eTIMS Verification</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            <p className="text-[10px] text-zinc-400 italic">
                                * Eliminates manual tax portal filing and prevents penalties with automatic KRA cryptographic signing.
                            </p>
                        </motion.div>
                    )}

                    {/* TAB 3: Role-Based Access Control (RBAC) */}
                    {activeTab === "rbac" && (
                        <motion.div
                            key="rbac"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-3 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-primary" />
                                    <span className="text-xs font-bold text-foreground">
                                        Role Permissions Matrix: {activeRole.toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-[10px] text-zinc-400">Zero Leakage Security</span>
                            </div>

                            <div className="flex flex-col gap-2">
                                {[
                                    {
                                        perm: "View Real-Time Total Revenue",
                                        allowed: activeRole === "ceo",
                                        note: "Masked for Cashiers to prevent theft/fraud",
                                    },
                                    {
                                        perm: "Authorize Stock Dispatches & Returns",
                                        allowed: activeRole === "ceo" || activeRole === "manager",
                                        note: "Requires manager approval PIN",
                                    },
                                    {
                                        perm: "Process Customer POS Sale & Print eTIMS",
                                        allowed: true,
                                        note: "Enabled across all 3 roles",
                                    },
                                    {
                                        perm: "Export Financial Statement & Payroll",
                                        allowed: activeRole === "ceo",
                                        note: "Encrypted with 2-Factor Authentication",
                                    },
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-[6px] bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between text-xs"
                                    >
                                        <div className="flex flex-col pr-2">
                                            <span className="font-semibold text-zinc-200">{item.perm}</span>
                                            <span className="text-[10px] text-zinc-400">{item.note}</span>
                                        </div>
                                        <div className="shrink-0">
                                            {item.allowed ? (
                                                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                                                    <CheckCircle2 size={12} />
                                                    Granted
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] bg-red-500/15 text-red-400 font-bold px-2 py-0.5 rounded-full">
                                                    <Lock size={12} />
                                                    Masked
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Bottom Status Ribbon */}
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <Lock size={10} className="text-primary" />
                            <span>PostgreSQL 16 · Prisma ORM · Row-Level Security</span>
                        </div>
                        <span className="font-mono text-zinc-400">100% Kenyan IP Ownership</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

