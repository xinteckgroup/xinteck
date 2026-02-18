"use client";

import { getMediaFiles, uploadFile } from "@/actions/media";
import { Button } from "@/components/admin/ui/Button";
import { useToast } from "@/components/admin/ui/Toast";
import { Image as ImageIcon, Loader2, Search, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";

interface MediaPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
}

export function MediaPicker({ isOpen, onClose, onSelect }: MediaPickerProps) {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const loadFiles = useCallback(() => {
        setLoading(true);
        startTransition(async () => {
            try {
                // Fetch only images, with optional search
                const result = await getMediaFiles({ 
                    type: "image", 
                    search: searchQuery, 
                    pageSize: 20 
                });
                setFiles(result.data);
            } catch (error) {
                console.error("Failed to load media:", error);
                toast("Failed to load media library", "error");
            } finally {
                setLoading(false);
            }
        });
    }, [searchQuery, toast]);

    const handleUploadFile = async (file: File) => {
        if (!file) return;

        // Optimistic UI checks
        if (!file.type.startsWith('image/')) {
            toast("Only image files are allowed", "error");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast("File is too large (Max 10MB)", "error");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const result = await uploadFile(formData);
            if (result.success && result.url) {
                toast("Image uploaded successfully", "success");
                loadFiles(); 
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast("Upload failed. Please try again.", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUploadFile(file);
    };

    // Drag & Drop Handlers
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUploadFile(file);
    }, []);

    // Trigger load on open or search change (debounced manually or by user action)
    useEffect(() => {
        if (isOpen) {
            loadFiles();
        }
    }, [isOpen, loadFiles]); 


    if (!isOpen) return null;

    // Portal to body to ensure it's on top
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center admin-surface-primary backdrop-blur-sm p-4 text-[var(--admin-text)]"
             style={{
                 "--admin-text": "#ffffff",
                 "--admin-muted": "#a1a1aa",
                 "--admin-border": "rgba(212, 175, 55, 0.15)",
                 "--admin-gold": "#D4AF37",
                 "--admin-surface-primary": "rgba(0, 0, 0, 0.72)",
                 "--admin-surface-secondary": "rgba(0, 0, 0, 0.55)",
                 "--admin-surface-floating": "rgba(0, 0, 0, 0.85)",
                 "--admin-surface-input": "rgba(255, 255, 255, 0.06)",
             } as React.CSSProperties}
        >
            <div 
                className={`bg-white/50 transition-colors rounded-[16px] w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative ${isDragging ? 'border-gold ring-2 ring-gold/20 admin-surface-primary' : 'border-[var(--admin-border)]'}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-primary/10 z-50 flex items-center justify-center pointer-events-none">
                        <div className="bg-popover p-6 rounded-[12px] border border-primary text-primary flex flex-col items-center animate-bounce">
                            <UploadCloud size={48} className="mb-2" />
                            <span className="font-bold text-lg">Drop image to upload</span>
                        </div>
                    </div>
                )}
                
                {/* Header */}
                <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between admin-surface-primary">
                    <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2">
                        <ImageIcon size={20} className="text-gold" />
                        Select Media
                    </h3>
                    <button onClick={onClose} className="text-[var(--admin-text)]/40 hover:text-[var(--admin-text)] transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-[var(--admin-border)] flex gap-4 flex-wrap admin-surface-input">
                    <div className="relative flex-1 min-w-[200px] md:w-64 lg:w-96 bg-black/60 dark:bg-white/30 rounded-[10px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && loadFiles()}
                                placeholder="Search images... (Press Enter)" 
                                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <Button variant="outline" onClick={loadFiles} disabled={loading || uploading}>
                        Search
                    </Button>
                    
                    <div className="w-px bg-[var(--admin-border)] mx-2 hidden md:block" />

                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={onInputChange}
                    />
                    <Button 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={uploading}
                        className="bg-gold text-primary-foreground hover:bg-gold/90"
                    >
                        {uploading ? (
                            <><Loader2 className="animate-spin mr-2" size={16} /> Uploading...</>
                        ) : (
                            <><UploadCloud className="mr-2" size={16} /> Upload New</>
                        )}
                    </Button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 bg-transparent">
                    {loading && !uploading ? (
                        <div className="flex items-center justify-center h-40 text-[var(--admin-muted)]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mr-2" />
                            Loading library...
                        </div>
                    ) : files.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-[var(--admin-muted)]">
                            <ImageIcon size={32} className="mb-2 opacity-50" />
                            <p>No images found.</p>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="text-gold text-xs hover:underline mt-2"
                            >
                                Upload your first image
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {uploading && (
                                <div className="aspect-square bg-[var(--admin-text)]/5 rounded-[8px] border border-[var(--admin-border)] border-dashed flex items-center justify-center animate-pulse">
                                    <div className="flex flex-col items-center text-[var(--admin-muted)]">
                                        <Loader2 className="animate-spin mb-2" size={24} />
                                        <span className="text-xs">Uploading...</span>
                                    </div>
                                </div>
                            )}
                            {files.map((file) => (
                                <button
                                    key={file.id}
                                    onClick={() => {
                                        onSelect(file.url);
                                        onClose();
                                    }}
                                    className="group relative aspect-square admin-surface-secondary rounded-[8px] overflow-hidden border border-[var(--admin-border)] hover:border-gold/50 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
                                >
                                    <Image 
                                        src={file.url} 
                                        alt={file.name} 
                                        fill 
                                        className="object-cover transition-transform group-hover:scale-110" 
                                    />
                                    <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-gold text-primary-foreground text-xs font-bold px-3 py-1 rounded-[4px]">Select</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-popover/90 p-1 text-[10px] text-popover-foreground truncate px-2">
                                        {file.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--admin-border)] admin-surface-input flex justify-between items-center">
                     <p className="text-[10px] text-[var(--admin-muted)]">
                        Drag & Drop an image anywhere, or use the button.
                     </p>
                     <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
