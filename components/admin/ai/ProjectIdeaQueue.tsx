"use client";

import { bulkSaveProjectIdeas, deleteProjectIdeaBulk, generateProjectDraft, getProjectIdeas, scoutProjectIdeas, updateProjectIdea } from "@/actions/project-ai";
import { DataGrid } from "@/components/admin/DataGrid";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useToast } from "@/components/admin/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, Grid, LayoutList, Loader2, RefreshCw, Trash2, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProjectIdeaQueue() {
    const { success, error, info } = useToast();
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scouting, setScouting] = useState(false);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({ isOpen: false, title: "", description: "", action: () => {} });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));
    
    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ title: "", angle: "", client: "" });
    const router = useRouter();

    useEffect(() => {
        loadIdeas();
    }, []);

    const loadIdeas = async () => {
        try {
            const data = await getProjectIdeas();
            setIdeas(data);
        } catch (err) {
            error("Failed to load project ideas");
        } finally {
            setLoading(false);
        }
    };

    const handleScout = async () => {
        setScouting(true);
        info("Scouting for Case Study concepts...");
        try {
            const newIdeas = await scoutProjectIdeas();
            await bulkSaveProjectIdeas(newIdeas);
            await loadIdeas();
            success("Found new Case Study concepts!");
        } catch (err: any) {
            error(err.message || "Failed to scout ideas");
        } finally {
            setScouting(false);
        }
    };

    const handleGenerate = async (idea: any) => {
        setGeneratingId(idea.id);
        info("Initializing Engineering AI Writer...");
        
        try {
            const result = await generateProjectDraft(idea.id);
            if (result.projectId) {
                success("Draft Generated! Redirecting to editor...");
                router.push(`/admin/projects/${result.projectId}`);
            }
        } catch (err: any) {
            error(err.message);
            setGeneratingId(null);
        }
    };

    const handleEditStart = (idea: any) => {
        setEditingId(idea.id);
        setEditForm({ title: idea.title, angle: idea.angle, client: idea.client || "" });
    };

    const handleEditCancel = () => {
        setEditingId(null);
    };

    const handleEditSave = async (id: string) => {
        try {
            await updateProjectIdea(id, editForm);
            setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...editForm } : i));
            success("Case Study Concept updated successfully");
            setEditingId(null);
        } catch (err) {
            error("Failed to update concept");
        }
    };

    const triggerDelete = (id: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Discard Concept?",
            description: "Are you sure you want to permanently delete this AI-generated idea from the Queue? This action cannot be undone.",
            action: async () => {
                closeConfirm();
                try {
                    await deleteProjectIdeaBulk([id]);
                    setIdeas(prev => prev.filter(i => i.id !== id));
                    success("Idea discarded");
                } catch (err) {
                    error("Failed to delete idea");
                }
            }
        });
    };

    const handleDeleteBulk = async (ids: string[]) => {
        setConfirmConfig({
            isOpen: true,
            title: "Discard Concepts?",
            description: `Are you sure you want to permanently delete ${ids.length} AI-generated ideas from the Queue? This action cannot be undone.`,
            action: async () => {
                closeConfirm();
                try {
                    await deleteProjectIdeaBulk(ids);
                    setIdeas(prev => prev.filter(i => !ids.includes(i.id)));
                    success(`${ids.length} Ideas discarded`);
                } catch (err) {
                    error("Failed to discard ideas");
                }
            }
        });
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-muted-foreground" /></div>;

    if (ideas.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 border border-dashed border-[var(--admin-border)] rounded-[12px] admin-surface-primary backdrop-blur-xs"
            >
                <Wand2 className="text-muted-foreground/50 mb-4" size={48} />
                <p className="text-[var(--admin-text)] text-sm font-bold">The case study queue is empty.</p>
                <p className="text-[var(--admin-text)]/80 text-xs text-center max-w-xs mt-1 mb-6">Click below to command Gemini to ideate high-value engineering case studies.</p>
                
                <button 
                    onClick={handleScout}
                    disabled={scouting}
                    className="flex items-center gap-2 bg-gold/20 text-gold border border-gold/50 px-6 py-3 rounded-[8px] font-bold text-sm hover:bg-gold/30 transition-all disabled:opacity-50"
                >
                    {scouting ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                    {scouting ? "Ideating Concepts..." : "Scout for Case Studies"}
                </button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg md:text-xl font-bold text-[var(--admin-text)]">Case Study Concepts ({ideas.length})</h2>
                    <button 
                        onClick={handleScout}
                        disabled={scouting}
                        className="flex items-center gap-2 bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded-[6px] font-bold text-[10px] md:text-xs hover:bg-gold/20 transition-all disabled:opacity-50"
                    >
                        {scouting ? <Loader2 className="animate-spin" size={12} /> : <RefreshCw size={12} />}
                        {scouting ? "Ideating..." : "Scout More"}
                    </button>
                </div>
                
                <div className="flex items-center gap-2 admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] p-1 self-start md:self-auto rounded-[8px]">
                    <button 
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-[6px] transition-all font-bold ${viewMode === 'grid' ? 'admin-surface-primary text-[var(--admin-text)] shadow-sm' : 'text-[var(--admin-text)]/80 hover:text-[var(--admin-text)]'}`}
                        title="Grid View"
                    >
                        <Grid size={16} />
                    </button>
                    <button 
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-[6px] transition-all font-bold ${viewMode === 'list' ? 'admin-surface-primary text-[var(--admin-text)] shadow-sm' : 'text-[var(--admin-text)]/80 hover:text-[var(--admin-text)]'}`}
                        title="List View"
                    >
                        <LayoutList size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {viewMode === "grid" ? (
                    <motion.div 
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                        {ideas.map((idea, index) => (
                            <motion.div 
                                key={idea.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] p-6 rounded-[12px] flex flex-col gap-6 group hover:border-gold/30 transition-all min-w-0"
                            >
                                {editingId === idea.id ? (
                                    <div className="flex-1 min-w-0 space-y-3 w-full">
                                        <input 
                                            value={editForm.client}
                                            onChange={e => setEditForm({...editForm, client: e.target.value})}
                                            placeholder="Hypothetical Client (Optional)"
                                            className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[6px] px-3 py-2 text-[var(--admin-text)] text-xs outline-none focus:border-gold/50"
                                        />
                                        <input 
                                            value={editForm.title}
                                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                                            className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[6px] px-3 py-2 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 font-bold"
                                        />
                                        <textarea 
                                            value={editForm.angle}
                                            onChange={e => setEditForm({...editForm, angle: e.target.value})}
                                            className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[6px] px-3 py-2 text-[var(--admin-text)] text-xs outline-none focus:border-gold/50 min-h-[60px]"
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <button 
                                                onClick={() => handleEditSave(idea.id)}
                                                className="flex items-center gap-1 bg-green-500/20 text-[var(--admin-text)] hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all"
                                            >
                                                <Check size={14} /> Save
                                            </button>
                                            <button 
                                                onClick={handleEditCancel}
                                                className="flex items-center gap-1 bg-neutral-500/10 text-[var(--admin-text)] hover:bg-red-500/20 hover:text-red-400 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all"
                                            >
                                                <X size={14} /> Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                    idea.score > 80 
                                                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                                }`}>
                                                    SCORE: {idea.score}
                                                </span>
                                                <span className="text-[var(--admin-text)]/80 text-[10px] uppercase tracking-wider font-bold">
                                                    {idea.client || "Generic Client"}
                                                </span>
                                            </div>
                                            <h3 className="text-base md:text-lg font-bold text-[var(--admin-text)] mb-1 truncate">{idea.title}</h3>
                                            <p className="text-[var(--admin-text)] text-xs md:text-sm line-clamp-1">{idea.angle}</p>
                                        </div>

                                        <div className="flex items-center gap-3 w-full shrink-0 mt-4 flex-wrap md:flex-nowrap">
                                            <button 
                                                onClick={() => handleGenerate(idea)}
                                                disabled={!!generatingId}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-gold/50 text-[var(--admin-background)] font-bold text-xs md:text-sm rounded-[10px] hover:bg-gold transition-colors disabled:opacity-50 shadow-sm border border-[var(--admin-border)]"
                                            >
                                                {generatingId === idea.id ? (
                                                    <><Loader2 className="animate-spin" size={16} /> Drafting...</>
                                                ) : (
                                                    <><Wand2 size={16} /> Generate Draft</>
                                                )}
                                            </button>
                                            
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button 
                                                    onClick={() => handleEditStart(idea)}
                                                    disabled={!!generatingId}
                                                    className="p-3 admin-surface-input text-[var(--admin-text)] hover:text-white hover:bg-blue-600 rounded-[10px] transition-colors"
                                                    title="Edit Concept"
                                                >
                                                    <Edit2 size={18} />
                                                </button>

                                                <button 
                                                    onClick={() => triggerDelete(idea.id)}
                                                    disabled={!!generatingId}
                                                    className="p-3 admin-surface-input text-[var(--admin-text)] hover:text-white hover:bg-red-600 rounded-[10px] transition-colors"
                                                    title="Discard Concept"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <DataGrid 
                            columns={[
                                { 
                                    key: "title", 
                                    label: "Concept", 
                                    render: (row: any) => (
                                        <div className="flex flex-col py-1">
                                            <span className="font-bold text-[var(--admin-text)] max-w-[300px] truncate">{row.title}</span>
                                            <span className="text-xs text-[var(--admin-text)]/80 max-w-[300px] truncate">{row.client || "Generic Client"}</span>
                                        </div>
                                    )  
                                },
                                { 
                                    key: "angle", 
                                    label: "Angle", 
                                    render: (row: any) => (
                                        <span className="text-xs text-[var(--admin-text)]/80 max-w-[300px] truncate block">
                                            {row.angle}
                                        </span>
                                    ) 
                                },
                                { 
                                    key: "score", 
                                    label: "Score", 
                                    render: (row: any) => (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            row.score > 80 
                                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                        }`}>
                                            {row.score}
                                        </span>
                                    ) 
                                },
                                {
                                    key: "actions",
                                    label: "Actions",
                                    render: (row: any) => (
                                        <div className="flex justify-end items-center gap-2 w-full pr-2">
                                            <button 
                                                onClick={() => handleGenerate(row)}
                                                disabled={!!generatingId}
                                                className="flex items-center gap-2 px-3 py-1.5 admin-surface-input bg-[var(--admin-brand)]/10 text-[var(--admin-brand)] hover:bg-[var(--admin-brand)] hover:text-[var(--admin-background)] rounded-[6px] text-[10px] uppercase tracking-wider font-bold transition-all disabled:opacity-50 border border-[var(--admin-border)]"
                                                title="Generate Content Draft"
                                            >
                                                {generatingId === row.id ? (
                                                    <Loader2 className="animate-spin" size={12} />
                                                ) : (
                                                    <Wand2 size={12} />
                                                )}
                                                Generate
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setViewMode("grid");
                                                    handleEditStart(row);
                                                }}
                                                disabled={!!generatingId}
                                                className="p-2 admin-surface-input text-[var(--admin-text)] rounded-[6px] hover:bg-blue-500/20 hover:text-white transition-all font-bold"
                                                title="Edit Concept"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button 
                                                onClick={() => triggerDelete(row.id)}
                                                disabled={!!generatingId}
                                                className="p-2 admin-surface-input text-[var(--admin-text)] rounded-[6px] hover:bg-red-600 hover:text-white transition-all font-bold"
                                                title="Delete Concept"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )
                                }
                            ]}
                            data={ideas}
                            pagination={{
                                page: 1,
                                totalPages: 1,
                                onPageChange: () => {},
                                total: ideas.length
                            }}
                            actions={{
                                onDelete: handleDeleteBulk
                            }}
                            hideSearch={true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
              isOpen={confirmConfig.isOpen}
              onClose={closeConfirm}
              onConfirm={confirmConfig.action}
              title={confirmConfig.title}
              description={confirmConfig.description}
              confirmText="Discard"
              isDestructive={true}
            />
        </div>
    );
}
