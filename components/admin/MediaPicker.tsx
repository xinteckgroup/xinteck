"use client";

import { deleteFile, getMediaFiles, uploadFile } from "@/actions/media";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { useToast } from "@/components/admin/ui/Toast";
import { convertToWebP } from "@/lib/webp-converter";
import { Image as ImageIcon, Loader2, Search, Trash2, UploadCloud, X } from "lucide-react";
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
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({ isOpen: false, title: "", description: "", action: () => {} });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

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
        // Automatically convert all images to WebP format before upload perfectly
        const webpFile = await convertToWebP(file);
        
        const formData = new FormData();
        formData.append("file", webpFile);

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

    const handleDeleteFile = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmConfig({
            isOpen: true,
            title: "Delete File System-Wide?",
            description: "Permanently delete this file system-wide? This action cannot be undone.",
            action: async () => {
                closeConfirm();
                try {
                    await deleteFile(id);
                    toast("File deleted successfully", "success");
                    loadFiles();
                } catch (error) {
                    console.error("Delete failed", error);
                    toast("Failed to delete file", "error");
                }
            }
        });
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-white">
            <div 
                className={`bg-white/30 dark:bg-white/20 backdrop-blur-md transition-colors rounded-[10px] w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative ${isDragging ? 'border-gold ring-2 ring-gold/20' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/90 p-6 rounded-[12px] border border-gold text-gold flex flex-col items-center animate-bounce">
                            <UploadCloud size={48} className="mb-2" />
                            <span className="font-bold text-lg text-[var(--admin-text)]">Drop image to upload</span>
                        </div>
                    </div>
                )}
                
                {/* Header */}
                <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between bg-transparent">
                    <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2">
                        <ImageIcon size={20} className="text-gold" />
                        Select Media
                    </h3>
                    <button onClick={onClose} className="text-[var(--admin-text)] hover:text-gold transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-[var(--admin-border)] flex gap-4 flex-wrap bg-transparent">
                    <div className="relative flex-1 min-w-[200px] md:w-64 lg:w-96 bg-black/60 rounded-[10px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={18} />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && loadFiles()}
                                placeholder="Search images... (Press Enter)" 
                                className="w-full bg-transparent rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text)] focus:border-gold/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <Button onClick={loadFiles} disabled={loading || uploading} className="text-[var(--admin-text)] border-white/20 hover:bg-white/10 hover:text-white">
                        Search
                    </Button>
                    
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
                        className="bg-gold text-[var(--admin-text)] hover:bg-gold/90 font-bold"
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
                        <div className="flex items-center justify-center h-40 text-white/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mr-2" />
                            Loading library...
                        </div>
                    ) : files.length === 0 && !loading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-white/50">
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
                                <div className="aspect-square bg-white/5 rounded-[8px] border border-[var(--admin-border)] border-dashed flex items-center justify-center animate-pulse">
                                    <div className="flex flex-col items-center text-white/50">
                                        <Loader2 className="animate-spin mb-2" size={24} />
                                        <span className="text-xs">Uploading...</span>
                                    </div>
                                </div>
                            )}
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="group relative aspect-square bg-black/40 rounded-[10px] overflow-hidden hover:border-gold/50 transition-all focus-within:ring-2 focus-within:ring-gold/50"
                                >
                                    <Image 
                                        src={file.url} 
                                        alt={file.name} 
                                        fill 
                                        className="object-cover transition-transform group-hover:scale-110 pointer-events-none" 
                                    />
                                    
                                    {/* Select Overlay */}
                                    <button
                                        onClick={() => {
                                            onSelect(file.url);
                                            onClose();
                                        }}
                                        className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-full h-full cursor-pointer focus:outline-none"
                                    >
                                        <span className="bg-gold text-[var(--admin-text)] text-xs font-bold px-3 py-1 rounded-[4px]">Select</span>
                                    </button>

                                    {/* Delete Button */}
                                    <button 
                                        onClick={(e) => handleDeleteFile(file.id, e)}
                                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-[6px] opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"
                                        title="Permanently Delete System-Wide"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                    <div className="absolute bottom-0 left-0 right-0 bg-black/90 p-1 text-[12px] text-[var(--admin-text)] truncate px-2 pointer-events-none">
                                        {file.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[var(--admin-border)] bg-transparent flex justify-between items-center">
                     <p className="text-[12px] text-[var(--admin-text)]">
                        Drag & Drop an image anywhere, or use the button.
                     </p>
                     <Button variant="ghost" onClick={onClose} className="text-white hover:text-white hover:bg-white/10">Cancel</Button>
                </div>
            </div>
            
            <ConfirmModal
              isOpen={confirmConfig.isOpen}
              onClose={closeConfirm}
              onConfirm={confirmConfig.action}
              title={confirmConfig.title}
              description={confirmConfig.description}
              confirmText="Delete System-Wide"
              isDestructive={true}
            />
        </div>,
        document.body
    );
}
