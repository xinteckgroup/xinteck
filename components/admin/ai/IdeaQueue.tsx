"use client";

import { deleteIdea, generateDraft, getIdeas, updateIdea } from "@/actions/ai";
import { DataGrid } from "@/components/admin/DataGrid";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useToast } from "@/components/admin/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit2, Grid, LayoutList, Loader2, Trash2, Wand2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function IdeaQueue() {
    const { success, error: toastError, info } = useToast();
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
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
    const [editForm, setEditForm] = useState({ title: "", angle: "" });
    const router = useRouter();

    useEffect(() => {
        loadIdeas();
    }, []);

    const loadIdeas = async () => {
        try {
            const data = await getIdeas();
            setIdeas(data);
        } catch (error) {
            toastError("Failed to load ideas");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (idea: any) => {
        setGeneratingId(idea.id);
        info("Initializing Writer Agent...");
        
        try {
            const result = await generateDraft(idea.id);
            if (result.success) {
                success("Draft Generated! Redirecting to editor...");
                router.push(`/admin/blog/${result.postId}`);
            }
        } catch (error: any) {
            toastError(error.message);
            setGeneratingId(null);
        }
    };

    const handleEditStart = (idea: any) => {
        setEditingId(idea.id);
        setEditForm({ title: idea.title, angle: idea.angle });
    };

    const handleEditCancel = () => {
        setEditingId(null);
    };

    const handleEditSave = async (id: string) => {
        try {
            await updateIdea(id, editForm);
            setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...editForm } : i));
            success("AI Concept updated successfully");
            setEditingId(null);
        } catch (error) {
            toastError("Failed to update concept");
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
                    await deleteIdea(id);
                    setIdeas(prev => prev.filter(i => i.id !== id));
                    success("Idea discarded");
                } catch (error) {
                    toastError("Failed to delete idea");
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
                    for (const id of ids) {
                        await deleteIdea(id);
                    }
                    setIdeas(prev => prev.filter(i => !ids.includes(i.id)));
                    success(`${ids.length} Ideas discarded`);
                } catch (error) {
                    toastError("Failed to discard ideas");
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
                <p className="text-[var(--admin-text)] text-sm font-bold">The editorial queue is empty.</p>
                <p className="text-[var(--admin-text)]/80 text-xs text-center max-w-xs mt-1">Use the "Newsroom" tab to scout trends and populate this queue.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header / Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-lg md:text-xl font-bold text-[var(--admin-text)]">Editorial Queue ({ideas.length})</h2>
                
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
                                                    {new Date(idea.createdAt).toLocaleDateString()}
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
                                                    <><Loader2 className="animate-spin" size={16} /> Writing...</>
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
                    >
                        <DataGrid 
                            columns={[
                                { 
                                    key: "title", 
                                    label: "Concept", 
                                    render: (row: any) => (
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[var(--admin-text)] max-w-[300px] truncate">{row.title}</span>
                                            <span className="text-xs text-[var(--admin-text)]/80 max-w-[300px] truncate">{row.angle}</span>
                                        </div>
                                    )  
                                },
                                { 
                                    key: "score", 
                                    label: "Score", 
                                    render: (row: any) => (
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                            row.score > 80 
                                                ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                        }`}>
                                            {row.score}
                                        </span>
                                    ) 
                                },
                                {
                                    key: "generate",
                                    label: "Actions",
                                    render: (row: any) => (
                                        <div className="flex items-center gap-2 w-full justify-end pr-2">
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
                                totalPages: 1, // Client side mostly
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
