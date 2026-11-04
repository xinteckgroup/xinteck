"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Cloud,
    Cpu,
    Database,
    Flame,
    Gauge,
    Globe,
    HardDrive,
    Lock,
    RefreshCw,
    Server,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Zap,
} from "lucide-react";
import { useState } from "react";

type SimTab = "radar" | "surge" | "failover";

export function CloudDevOpsSimulator() {
    const [activeTab, setActiveTab] = useState<SimTab>("radar");
    const [isSurging, setIsSurging] = useState<boolean>(false);
    const [isFailingOver, setIsFailingOver] = useState<boolean>(false);
    const [failoverDone, setFailoverDone] = useState<boolean>(false);

    const triggerSurge = () => {
        setIsSurging(true);
        setTimeout(() => setIsSurging(false), 5000);
    };

    const triggerFailover = () => {
        setIsFailingOver(true);
        setFailoverDone(false);
        setTimeout(() => {
            setIsFailingOver(false);
            setFailoverDone(true);
            setTimeout(() => setFailoverDone(false), 4000);
        }, 1400);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none">
            {/* Top Interactive Bar */}
            <div className="w-full mb-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-white/40 dark:bg-black/90 backdrop-blur-xl border border-border/50 rounded-[10px] shadow-md text-xs">
                {/* Tabs */}
                <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-[8px]">
                    <button
                        onClick={() => setActiveTab("radar")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "radar"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Activity size={13} />
                        <span>Live Radar</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("surge")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "surge"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <Zap size={13} />
                        <span>Traffic Surge</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("failover")}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition-all font-semibold ${
                            activeTab === "failover"
                                ? "bg-primary text-black shadow-sm font-bold"
                                : "text-foreground/70 hover:text-foreground"
                        }`}
                    >
                        <ShieldCheck size={13} />
                        <span>Auto-Failover</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        99.99% UPTIME
                    </span>
                </div>
            </div>

            {/* Application Window Frame */}
            <div className="w-full rounded-[12px] overflow-hidden border border-border/80 bg-zinc-950 shadow-2xl">
                {/* Radar Top Header */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-[6px] bg-primary flex items-center justify-center text-black font-black text-xs">
                            X
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-zinc-100">Global Cloud Cluster (af-south-1)</span>
                            <span className="text-[10px] text-zinc-400">Nairobi Edge PoP & Redundant US-East Gateway</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-mono">
                            Kubernetes v1.31
                        </span>
                    </div>
                </div>

                {/* Main Console Workspace */}
                <div className="p-4 md:p-6 min-h-[380px] bg-zinc-950 text-white flex flex-col justify-between">
                    {/* MODE 1: Live Health Radar */}
                    {activeTab === "radar" && (
                        <motion.div
                            key="radar"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4"
                        >
                            {/* Server Metric Gauges */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Nairobi Latency</span>
                                    <span className="text-emerald-400 font-black text-lg md:text-xl font-mono mt-0.5">14.2 ms</span>
                                    <span className="text-[9px] text-zinc-400 mt-1">Direct IXP Peering</span>
                                </div>
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Healthy Nodes</span>
                                    <span className="text-primary font-black text-lg md:text-xl font-mono mt-0.5">6 / 6 Active</span>
                                    <span className="text-[9px] text-emerald-400 mt-1">Zero Errors</span>
                                </div>
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800/80 flex flex-col">
                                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Global Ingestion</span>
                                    <span className="text-zinc-100 font-black text-lg md:text-xl font-mono mt-0.5">42,800 /s</span>
                                    <span className="text-[9px] text-zinc-400 mt-1">Requests Managed</span>
                                </div>
                            </div>

                            {/* Node Clusters Status */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                                    <span>Regional Cluster Topologies</span>
                                    <span className="text-emerald-400 font-mono text-[10px]">All Systems Normal</span>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                    {[
                                        { name: "Node-NBO-01 (Nairobi Primary)", cpu: "24%", mem: "1.4 GB / 8 GB", ping: "12ms" },
                                        { name: "Node-NBO-02 (Nairobi Backup)", cpu: "19%", mem: "1.2 GB / 8 GB", ping: "14ms" },
                                        { name: "Node-MBA-01 (Mombasa Edge)", cpu: "31%", mem: "2.1 GB / 8 GB", ping: "18ms" },
                                        { name: "Node-JNB-01 (South Africa)", cpu: "18%", mem: "1.0 GB / 8 GB", ping: "44ms" },
                                    ].map((n, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 rounded-[8px] bg-zinc-900/40 border border-zinc-800/80 flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-200">{n.name}</span>
                                                    <span className="text-[10px] text-zinc-400">RAM: {n.mem}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-mono text-primary font-bold">{n.cpu}</span>
                                                <span className="text-[10px] text-zinc-500 font-mono">{n.ping}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <p className="text-[10px] text-zinc-400 italic">
                                * Continuous multi-cloud health checks, automated SSL renewal, and sub-minute alerting via Slack & WhatsApp.
                            </p>
                        </motion.div>
                    )}

                    {/* MODE 2: Traffic Surge Simulation */}
                    {activeTab === "surge" && (
                        <motion.div
                            key="surge"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-[6px] bg-primary/20 text-primary flex items-center justify-center font-bold">
                                        <TrendingUp size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">Traffic Surge Auto-Scaling Test</h4>
                                        <p className="text-[10px] text-zinc-400">Simulate flash marketing campaign / Black Friday spike</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                                    isSurging ? "bg-amber-500/20 text-amber-400 animate-pulse" : "bg-zinc-800 text-zinc-400"
                                }`}>
                                    {isSurging ? "AUTOSCALING ACTIVE" : "IDLE"}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800">
                                    <span className="text-[10px] text-zinc-400 uppercase">Incoming Req/Sec</span>
                                    <span className={`text-lg font-black font-mono block mt-1 transition-all ${
                                        isSurging ? "text-amber-400" : "text-zinc-100"
                                    }`}>
                                        {isSurging ? "128,450 /s" : "2,400 /s"}
                                    </span>
                                </div>
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800">
                                    <span className="text-[10px] text-zinc-400 uppercase">Active Pods</span>
                                    <span className={`text-lg font-black font-mono block mt-1 transition-all ${
                                        isSurging ? "text-primary" : "text-zinc-100"
                                    }`}>
                                        {isSurging ? "18 Pods" : "3 Pods"}
                                    </span>
                                </div>
                                <div className="p-3 rounded-[8px] bg-zinc-900/60 border border-zinc-800">
                                    <span className="text-[10px] text-zinc-400 uppercase">Packet Loss</span>
                                    <span className="text-lg font-black text-emerald-400 font-mono block mt-1">
                                        0.00%
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={triggerSurge}
                                disabled={isSurging}
                                className="w-full py-3 bg-primary text-black font-extrabold text-xs rounded-[8px] hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {isSurging ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        <span>Scaling Horizontal Pod Autoscalers (HPA)...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap size={14} />
                                        <span>Trigger 50x Traffic Spike Simulation</span>
                                    </>
                                )}
                            </button>

                            <p className="text-[10px] text-zinc-400 italic">
                                * Zero server crashes during critical sales campaigns: our architecture expands automatically and scales down to cut idle costs.
                            </p>
                        </motion.div>
                    )}

                    {/* MODE 3: Auto-Failover */}
                    {activeTab === "failover" && (
                        <motion.div
                            key="failover"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col gap-4 py-1"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-emerald-400" />
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">Disaster Recovery & Hot Standby</h4>
                                        <p className="text-[10px] text-zinc-400">Multi-availability zone automated DNS failover</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">
                                    RTO &lt; 1 sec
                                </span>
                            </div>

                            <div className="p-4 rounded-[8px] bg-zinc-900/60 border border-zinc-800 flex flex-col gap-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${isFailingOver ? "bg-red-500 animate-ping" : "bg-emerald-400"}`} />
                                        <span className="font-semibold text-zinc-200">
                                            Zone A: Primary Database & API
                                        </span>
                                    </div>
                                    <span className="font-mono text-zinc-400 text-[10px]">
                                        {isFailingOver ? "Simulated Crash" : "Healthy Master"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${failoverDone ? "bg-emerald-400" : "bg-primary"}`} />
                                        <span className="font-semibold text-zinc-200">
                                            Zone B: Secondary Hot Standby
                                        </span>
                                    </div>
                                    <span className="font-mono text-primary text-[10px]">
                                        {failoverDone ? "Promoted to Master (140ms)" : "Syncing Replication Logs"}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={triggerFailover}
                                disabled={isFailingOver}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs rounded-[8px] transition-all flex items-center justify-center gap-2 shadow-lg"
                            >
                                {isFailingOver ? (
                                    <>
                                        <RefreshCw size={14} className="animate-spin" />
                                        <span>Rerouting Traffic to Zone B Standby...</span>
                                    </>
                                ) : (
                                    <>
                                        <Flame size={14} />
                                        <span>Simulate Hardware Outage & Watch Failover</span>
                                    </>
                                )}
                            </button>

                            {failoverDone && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-2.5 rounded-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-medium"
                                >
                                    <CheckCircle2 size={16} />
                                    <span>Failover succeeded in 140ms. Zero customer requests lost!</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Bottom Status Bar */}
                    <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-500">
                        <div className="flex items-center gap-1.5">
                            <Lock size={10} className="text-primary" />
                            <span>Terraform IaC · AWS / GCP / DigitalOcean · Zero Lock-In</span>
                        </div>
                        <span className="font-mono text-zinc-400">SOC2 Type II Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
