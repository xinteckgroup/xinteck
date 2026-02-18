"use client";

import { bulkSaveIdeas, saveIdea, scoutTrends } from "@/actions/ai";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCheck, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function TrendScout() {
    const [scouting, setScouting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [ideas, setIdeas] = useState<any[]>([]);

    const handleScout = async () => {
        setScouting(true);
        try {
            const newIdeas = await scoutTrends();
            setIdeas(newIdeas);
            toast.success("Intelligence gathering complete.");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setScouting(false);
        }
    };

    const handleApprove = async (idea: any) => {
        try {
            await saveIdea(idea);
            setIdeas(ideas.filter(i => i.title !== idea.title));
            toast.success("Idea approved and queued.");
        } catch (error: any) {
            toast.error("Failed to approve idea.");
        }
    };

    const handleApproveAll = async () => {
        if (ideas.length === 0) return;
        setSaving(true);
        try {
            const res = await bulkSaveIdeas(ideas);
            if (res.success) {
                toast.success(`Approved ${ideas.length} ideas.`);
                setIdeas([]);
            }
        } catch (error: any) {
            toast.error("Failed to bulk approve.");
        } finally {
            setSaving(false);
        }
    };

    const handleReject = (title: string) => {
        setIdeas(ideas.filter(i => i.title !== title));
    };

    const handleDiscardAll = () => {
        setIdeas([]);
        toast.info("All trends discarded.");
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 admin-surface-secondary rounded-[12px] p-6">
                <div>
                    <h2 className="text-lg md:text-xl font-bold text-[var(--admin-text)] mb-1">Trend Intelligence</h2>
                    <p className="text-xs md:text-sm text-[var(--admin-muted)]">AI agents are ready to scan your target niches (`Settings`) for high-value opportunities.</p>
                </div>
                <div className="flex gap-2">
                     {ideas.length > 0 && (
                        <>
                            <button
                                onClick={handleApproveAll}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-3 bg-green-500/20 text-green-400 font-bold text-sm rounded-[10px] hover:bg-green-500/30 transition-all disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCheck size={16} />}
                                <span className="hidden md:inline">Approve All</span>
                            </button>
                            <button
                                onClick={handleDiscardAll}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-3 admin-surface-input text-[var(--admin-muted)] font-bold text-sm rounded-[10px] hover:bg-red-500/10 hover:text-red-400 transition-all disabled:opacity-50"
                            >
                                <X size={16} />
                                <span className="hidden md:inline">Discard All</span>
                            </button>
                        </>
                    )}
                    <button
                        onClick={handleScout}
                        disabled={scouting || saving}
                        className="flex items-center gap-2 px-6 py-3 bg-gold text-primary-foreground font-bold text-sm rounded-[10px] hover:bg-[var(--admin-text)] hover:text-[var(--admin-background)] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap"
                    >
                        {scouting ? (
                            <><Loader2 className="animate-spin w-4 h-4" /> Scouting...</>
                        ) : (
                            <><Sparkles size={16} /> Scout Trends</>
                        )}
                    </button>
                </div>
            </div>

            {/* Ideas Grid */}
            <motion.div 
                layout
                className="grid md:grid-cols-2 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {ideas.map((idea, i) => (
                        <motion.div 
                            key={idea.title} 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="admin-surface-secondary rounded-[12px] p-6 flex flex-col gap-4 hover:border-gold/30 transition-colors group"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <h3 className="font-bold text-base md:text-lg text-[var(--admin-text)] leading-tight">{idea.title}</h3>
                                <div className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap border ${
                                    idea.score > 80 
                                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                }`}>
                                    Score: {idea.score}
                                </div>
                            </div>
                            
                            <p className="text-[var(--admin-muted)] text-xs md:text-sm line-clamp-3 leading-relaxed">{idea.reasoning}</p>
                            
                            <div className="flex flex-wrap gap-2">
                                {idea.keywords.map((k: string) => (
                                    <span key={k} className="text-[10px] admin-surface-input px-2 py-1 rounded text-[var(--admin-muted)]/80">{k}</span>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-[var(--admin-border)]">
                                <button 
                                    onClick={() => handleApprove(idea)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 py-2 rounded-[8px] font-bold text-xs transition-colors"
                                    title="Approve Idea"
                                >
                                    <Check size={14} /> Approve
                                </button>
                                <button 
                                    onClick={() => handleReject(idea.title)}
                                    className="flex-1 flex items-center justify-center gap-2 admin-surface-input text-[var(--admin-muted)] hover:bg-red-500/10 hover:text-red-400 py-2 rounded-[8px] font-bold text-xs transition-colors"
                                    title="Discard Idea"
                                >
                                    <X size={14} /> Discard
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {!scouting && ideas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--admin-border)] rounded-[12px] admin-surface-input">
                    <Sparkles className="text-[var(--admin-muted)]/30 mb-4" size={48} />
                    <p className="text-[var(--admin-muted)] text-sm font-medium">No active intelligence.</p>
                    <p className="text-[var(--admin-muted)]/50 text-xs">Click "Scout Trends" to begin analysis.</p>
                </div>
            )}
        </div>
    );
}
