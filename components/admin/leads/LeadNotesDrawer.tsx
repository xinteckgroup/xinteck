"use client";

import { addLeadNote, deleteLeadNote, getLeadNotes } from "@/actions/leads";
import { useToast } from "@/components/admin/ui";
import { Role } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageSquare, Send, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

interface LeadNotesDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    submissionId: string;
    submissionName: string;
    currentUserRole: Role;
    currentUserId: string;
}

export function LeadNotesDrawer({ isOpen, onClose, submissionId, submissionName, currentUserRole, currentUserId }: LeadNotesDrawerProps) {
    const { toast } = useToast();
    const [notes, setNotes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [isPending, startTransition] = useTransition();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch notes when drawer opens or submission changes
    useEffect(() => {
        if (!isOpen || !submissionId) return;

        let isMounted = true;
        setIsLoading(true);
        
        getLeadNotes(submissionId).then((data) => {
            if (isMounted) {
                setNotes(data);
                setIsLoading(false);
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
                }, 100);
            }
        }).catch((e) => {
            if (isMounted) {
                toast("Failed to load notes", "error");
                setIsLoading(false);
            }
        });

        return () => { isMounted = false; };
    }, [isOpen, submissionId, toast]);

    const handleAddNote = () => {
        if (!newNote.trim() || isPending) return;

        startTransition(async () => {
            try {
                const note = await addLeadNote(submissionId, newNote);
                setNotes((prev) => [...prev, note]);
                setNewNote("");
                setTimeout(() => {
                    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
                }, 100);
            } catch (error: any) {
                toast(`Failed to add note: ${error.message}`, "error");
            }
        });
    };

    const handleDeleteNote = (noteId: string) => {
        startTransition(async () => {
            try {
                await deleteLeadNote(noteId);
                setNotes((prev) => prev.filter((n) => n.id !== noteId));
                toast("Note deleted", "success");
            } catch (error: any) {
                toast(`Failed to delete note: ${error.message}`, "error");
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleAddNote();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 380, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="h-full border-l border-[var(--admin-border)] admin-surface-secondary/80 backdrop-blur-md flex flex-col shrink-0 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between shrink-0 bg-[var(--admin-text)]/5">
                        <div className="flex items-center gap-2 text-[var(--admin-text)]">
                            <MessageSquare size={16} className="text-gold" />
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Internal Notes</h3>
                                <p className="text-[10px] text-[var(--admin-text)]/60 font-mono truncate max-w-[200px]">{submissionName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/10 rounded-[8px] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Notes Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full text-[var(--admin-text)]/40">
                                <Loader2 size={24} className="animate-spin" />
                            </div>
                        ) : notes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-[var(--admin-text)]/40 italic text-xs gap-2">
                                <MessageSquare size={32} className="opacity-20" />
                                No internal notes yet.<br />Add one below.
                            </div>
                        ) : (
                            notes.map((note) => {
                                const isAuthor = note.authorId === currentUserId;
                                const canDelete = currentUserRole === Role.SUPER_ADMIN || isAuthor;

                                return (
                                    <div key={note.id} className="flex gap-3 group">
                                        <div className="w-8 h-8 rounded-full admin-surface-input flex items-center justify-center text-[10px] font-bold shrink-0 border border-[var(--admin-border)] overflow-hidden">
                                            {note.author.avatar ? (
                                                <img src={note.author.avatar} alt={note.author.name} className="w-full h-full object-cover" />
                                            ) : (
                                                note.author.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1 relative">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-[var(--admin-text)]">
                                                    {note.author.name}
                                                </span>
                                                <span className="text-[10px] text-[var(--admin-text)]/40 font-mono" title={new Date(note.createdAt).toLocaleString()}>
                                                    {formatDistanceToNow(new Date(note.createdAt))} ago
                                                </span>
                                            </div>
                                            <div className="text-xs text-[var(--admin-text)]/80 p-2.5 rounded-[10px] admin-surface-input border border-[var(--admin-border)] whitespace-pre-wrap break-words">
                                                {note.content}
                                            </div>
                                            
                                            {canDelete && (
                                                <button 
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="absolute -right-2 top-6 p-1.5 bg-red-500/10 text-red-500 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 backdrop-blur-sm"
                                                    title="Delete Note"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-[var(--admin-border)] bg-[var(--admin-text)]/5 shrink-0">
                        <div className="relative">
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isPending}
                                placeholder="Add an internal note... (Cmd+Enter)"
                                className="w-full h-20 admin-surface-input rounded-[10px] border border-[var(--admin-border)] p-3 pr-10 text-xs text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none resize-none transition-colors"
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={!newNote.trim() || isPending}
                                className="absolute right-2 bottom-2 p-2 bg-gold text-white rounded-[8px] hover:bg-gold/80 disabled:opacity-50 disabled:grayscale transition-colors"
                            >
                                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
