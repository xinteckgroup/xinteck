"use client";

import { createFolder, deleteFile, deleteFolder, uploadFile } from "@/actions/media";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader, Pagination, useToast } from "@/components/admin/ui";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { PaginatedResponse } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { convertToWebP } from "@/lib/webp-converter";
import { Role } from "@prisma/client";
import {
    ChevronLeft,
    CloudUpload,
    FileText,
    Folder,
    Grid,
    Image as ImageIcon,
    LayoutList,
    Plus,
    Search,
    Trash2,
    Video as VideoIcon,
    X
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

interface FileManagerClientProps {
  initialData: PaginatedResponse<any>;
  folders?: any[];
  currentFolderId?: string | null;
  activeType: string;
}

export function FileManagerClient({ initialData, folders = [], currentFolderId, activeType }: FileManagerClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Modal State
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  const [confirmConfig, setConfirmConfig] = useState<{
      isOpen: boolean;
      title: string;
      description: string;
      action: () => void;
  }>({ isOpen: false, title: "", description: "", action: () => {} });

  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

  const files = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  // ─── HANDLERS ───

  const handleTabChange = (type: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (type === "all") params.delete("type");
      else params.set("type", type);
      
      if (type !== "all") {
          params.delete("folderId");
      }
      
      params.set("page", "1");
      params.delete("search");
      setSearchQuery(""); 
      router.push(`/admin/files?${params.toString()}`);
  };

  const handleFolderClick = (folderId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("folderId", folderId);
      params.delete("type");
      params.set("page", "1");
      router.push(`/admin/files?${params.toString()}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleCreateFolder = async () => {
      if (!newFolderName.trim()) return;
      
      startTransition(async () => {
          try {
              await createFolder(newFolderName, currentFolderId);
              toast("Folder created", "success");
              setShowFolderModal(false);
              setNewFolderName("");
              router.refresh();
          } catch (e: any) {
              toast(e.message, "error");
          }
      });
  };

  // Search Debounce
  useEffect(() => {
     const timer = setTimeout(() => {
         const currentSearch = searchParams.get("search") || "";
         if (currentSearch !== searchQuery) {
             const params = new URLSearchParams(searchParams.toString());
             if (searchQuery) params.set("search", searchQuery);
             else params.delete("search");
             params.set("page", "1");
             router.push(`/admin/files?${params.toString()}`);
         }
     }, 500);
     return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = (id: string, isFolder = false) => {
      setConfirmConfig({
          isOpen: true,
          title: `Delete ${isFolder ? 'Folder' : 'File'}`,
          description: `Are you absolutely sure you want to permanently delete this ${isFolder ? 'folder and all its contents' : 'file'}?`,
          action: () => {
              closeConfirm();
              startTransition(async () => {
                   try {
                       if (isFolder) await deleteFolder(id);
                       else await deleteFile(id);
                       toast("Deleted successfully", "success");
                       router.refresh();
                   } catch (e: any) {
                       toast("Delete failed: " + e.message, "error");
                   }
              });
          }
      });
  };

  const handleFileUpload = async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      
      setUploading(true);
      
      const webpFile = await convertToWebP(fileList[0]);

      const formData = new FormData();
      formData.append("file", webpFile);

      try {
          await uploadFile(formData, currentFolderId || undefined);
          toast("File uploaded successfully", "success");
          router.refresh();
      } catch (e: any) {
          toast("Upload failed: " + e.message, "error");
      } finally {
          setUploading(false);
      }
  };

  return (
    <PageContainer className="h-[calc(100vh-140px)] relative" onDragEnter={() => setDragActive(true)}>
      {/* Drag Overlay */}
      {dragActive && (
          <div             className="absolute inset-0 z-50 bg-[var(--admin-background)]/80 backdrop-blur-md border-2 border-dashed border-gold/50 flex flex-col items-center justify-center animate-in fade-in duration-200"
             onDragLeave={() => setDragActive(false)}
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => {
                 e.preventDefault();
                 setDragActive(false);
                 handleFileUpload(e.dataTransfer.files);
             }}
          >
             <CloudUpload size={48} className="text-gold mb-4 animate-bounce" />
             <h3 className="text-2xl font-bold text-[var(--admin-text)]">Drop files to upload</h3>
             <p className="text-[var(--admin-text)]/60">{currentFolderId ? "Uploading to current folder" : "Uploading to root"}</p>
          </div>
      )}

      {/* New Folder Modal */}
      {showFolderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-white">
              <div className="bg-white/30 dark:bg-white/20 backdrop-blur-md transition-colors rounded-[10px] w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative">
                  <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between bg-transparent shrink-0">
                      <div className="flex flex-col gap-1 min-w-0">
                          <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2 truncate">New Folder</h3>
                      </div>
                      <button onClick={() => setShowFolderModal(false)} className="text-[var(--admin-text)] hover:text-gold transition-colors shrink-0 ml-3">
                          <X size={24} />
                      </button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1 bg-transparent text-[var(--admin-text)]">
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Folder Name" 
                        className="w-full bg-transparent rounded-[10px] px-4 py-3 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text)]/50 border border-[var(--admin-border)] outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors"
                        value={newFolderName}
                        onChange={e => setNewFolderName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
                      />
                  </div>
                  <div className="p-4 border-t border-[var(--admin-border)] bg-transparent flex justify-end items-center gap-4 shrink-0">
                      <button onClick={() => setShowFolderModal(false)} className="px-4 py-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
                      <button 
                         onClick={handleCreateFolder} 
                         disabled={isPending}
                         className="bg-primary text-[var(--admin-text)] font-black px-6 py-2 rounded-[10px] flex items-center gap-2 hover:bg-gold transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                         {isPending ? "Creating..." : "Create"}
                      </button>
                  </div>
              </div>
          </div>
      )}

      <PageHeader 
        title="File Manager" 
        subtitle="Centralized media library."
        actions={
          <div className="flex gap-2 md:gap-3">
             <button 
                onClick={() => setShowFolderModal(true)}
                className="px-3 py-1.5 md:px-4 md:py-2 admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[10px] text-[var(--admin-text)] hover:text-gold hover:bg-[var(--admin-text)]/5 transition-all flex items-center gap-2 text-[10px] md:text-sm font-bold"
             >
              <Plus size={14} />
              New Folder
             </button>
             
             <div className="relative">
                 <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                   <input 
                      type="file" 
                      id="file-upload" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e.target.files)}
                      disabled={uploading}
                   />
                    <label htmlFor="file-upload" className={cn(
                        "inline-flex items-center justify-center gap-2 px-3 py-1.5 md:px-6 md:py-2 bg-primary text-primary-foreground font-bold rounded-[10px] hover:bg-primary/80 transition-all shadow-[0_0_20px_-5px_rgba(255,215,0,0.3)] text-[10px] md:text-sm cursor-pointer",
                        uploading && "opacity-50 cursor-not-allowed"
                    )}>
                      {uploading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/> : <CloudUpload size={14} />}
                      Upload
                    </label>
                 </RoleGate>
             </div>
          </div>
        }
      />

      <div className="flex flex-1 gap-4 md:gap-6 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 admin-surface-primary backdrop-blur-xs rounded-[10px] border border-[var(--admin-border)] p-4 gap-2">
           <h3 className="text-[12px] font-bold text-[var(--admin-text)] uppercase tracking-widest mb-3 px-2">Library</h3>
           
           {[
               { id: "all", label: "All Files", icon: Folder },
               { id: "image", label: "Images", icon: ImageIcon },
               { id: "video", label: "Videos", icon: VideoIcon },
               { id: "document", label: "Documents", icon: FileText },
           ].map(item => (
             <button
               key={item.id}
                onClick={() => handleTabChange(item.id)}
                 className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm font-medium transition-all",
                    activeType === item.id 
                        ? "bg-primary text-[var(--admin-text)] shadow-lg shadow-primary/20" 
                        : "text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/10"
                 )}
              >
                <item.icon size={16} />
                {item.label}
              </button>
           ))}

            <div className="mt-auto pt-6 border-t border-[var(--admin-border)]/10">
               <div className="admin-surface-input rounded-[8px] p-4 border border-[var(--admin-border)]">
                  <p className="text-[12px] font-bold text-[var(--admin-text)] uppercase tracking-wider mb-3">Storage</p>
                  <div className="w-full h-1.5 admin-surface-secondary rounded-full mb-3 overflow-hidden">
                     <div className="h-full bg-gold rounded-full transition-all duration-1000" style={{ width: `10%` }} /> 
                  </div>
                  <div className="flex justify-between items-end">
                      <p className="text-[12px] font-bold text-[var(--admin-text)]">0.5 MB</p>
                      <p className="text-[12px] text-[var(--admin-text)]">of 10 GB</p>
                  </div>
               </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col admin-surface-primary backdrop-blur-xs rounded-[10px] border border-[var(--admin-border)] overflow-hidden">
          {/* Toolbar */}
          <div className="p-2 md:p-3 border-b border-[var(--admin-border)] flex justify-between items-center gap-2 admin-surface-secondary/50 backdrop-blur-md">
             <div className="flex items-center gap-2 flex-1">
                {currentFolderId && (
                    <button onClick={handleBack} className="p-2 hover:bg-[var(--admin-text)]/5 rounded-lg text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] transition-colors" title="Back">
                        <ChevronLeft size={20} />
                    </button>
                )}
                 <div className="relative flex-1 min-w-0 md:max-w-md">
                      <div className="relative bg-black/60 dark:bg-white/30 rounded-[10px]">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                          <input 
                            type="text" 
                            placeholder="Search in files..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                          />
                      </div>
                 </div>
             </div>
             
             <div className="flex items-center gap-1 admin-surface-input/30 p-1 rounded-lg border border-[var(--admin-border)]">
                  <button 
                    onClick={() => setViewMode("grid")} 
                    title="Grid view"
                    className={cn(
                        "p-1.5 md:p-2 rounded-[6px] transition-all",
                        viewMode === 'grid' 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "text-[var(--admin-text)]/50 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5"
                    )}
                  >
                     <Grid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")} 
                    title="List view"
                    className={cn(
                        "p-1.5 md:p-2 rounded-[6px] transition-all",
                        viewMode === 'list' 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "text-[var(--admin-text)]/50 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5"
                    )}
                  >
                     <LayoutList size={16} />
                  </button>
             </div>
          </div>

          {/* Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 custom-scrollbar">
            
            {/* Breadcrumbs / Info */}
            <div className="text-[var(--admin-text)] text-[12px] font-bold uppercase tracking-widest mb-6 flex items-center gap-2 px-1">
                <Folder size={12} className="text-gold" />
                <span>{currentFolderId ? "Folder View" : "Root Library"}</span>
            </div>

            {viewMode === "grid" ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                  {/* Folders */}
                  {folders.map((folder: any) => (
                     <div key={folder.id} onClick={() => handleFolderClick(folder.id)} className="group cursor-pointer animate-in fade-in zoom-in-95 duration-300">
                        <div className="aspect-square admin-surface-input rounded-[12px] border border-[var(--admin-border)] flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all mb-3">
                           <Folder size={56} className="text-primary/80 group-hover:text-primary transition-all duration-300" />
                           <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-2">
                              <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                <button 
                                   onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, true); }} 
                                   className="text-white bg-red-500/80 hover:bg-red-500 p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                                   title="Delete Folder"
                                >
                                    <Trash2 size={18} />
                                </button>
                              </RoleGate>
                           </div>
                        </div>
                       <p className="text-sm text-[var(--admin-text)] truncate px-1 font-bold group-hover:text-gold transition-colors">{folder.name}</p>
                       <p className="text-[12px] font-medium text-[var(--admin-text)] px-1 uppercase tracking-wider">{folder._count?.files || 0} items</p>
                    </div>
                  ))}

                  {/* Files */}
                  {files.map((file: any) => (
                    <div key={file.id} className="group cursor-pointer animate-in fade-in zoom-in-95 duration-300">
                       <div className="aspect-square admin-surface-input rounded-[12px] border border-[var(--admin-border)] flex items-center justify-center relative overflow-hidden group-hover:border-gold/50 group-hover:shadow-lg group-hover:shadow-gold/5 transition-all mb-3">
                          {file.type === 'image' ? (
                             <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : file.type === 'video' ? (
                             <div className="flex flex-col items-center gap-2 text-[var(--admin-text)] group-hover:text-pink-400 transition-colors">
                                 <VideoIcon size={40} />
                                 <span className="text-[12px] font-bold tracking-widest">VIDEO</span>
                             </div>
                          ) : (
                             <div className="flex flex-col items-center gap-2 text-[var(--admin-text)] group-hover:text-blue-400 transition-colors">
                                 <FileText size={40} />
                                 <span className="text-[12px] font-bold tracking-widest uppercase">{file.type || 'FILE'}</span>
                             </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 p-2">
                             <a 
                                href={file.url} 
                                target="_blank" 
                                onClick={(e) => e.stopPropagation()}
                                className="text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                                title="View File"
                             >
                                <Search size={18} />
                             </a>
                             <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                               <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} 
                                  className="text-white bg-red-500/80 hover:bg-red-500 p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                                  title="Delete File"
                               >
                                   <Trash2 size={18} />
                               </button>
                             </RoleGate>
                          </div>
                       </div>
                       <p className="text-sm text-[var(--admin-text)] truncate px-1 font-medium group-hover:text-gold transition-colors" title={file.name}>{file.name}</p>
                       <p className="text-[12px] font-medium text-[var(--admin-text)] px-1 uppercase tracking-wider">{file.size}</p>
                    </div>
                  ))}
                  
                  {files.length === 0 && folders.length === 0 && (
                     <div className="col-span-full h-64 flex items-center justify-center text-[var(--admin-text)] text-center flex-col gap-4 admin-surface-secondary rounded-2xl border border-dashed border-[var(--admin-border)]">
                        <div className="w-16 h-16 rounded-full admin-surface-input flex items-center justify-center">
                            <CloudUpload size={32} className="opacity-50" />
                        </div>
                        <div>
                            <p className="font-bold text-base text-[var(--admin-text)]">No files or folders found</p>
                            <p className="text-xs">Upload some media or create a folder to get started.</p>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="admin-surface-primary backdrop-blur-xs rounded-xl border border-[var(--admin-border)] overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left min-w-[700px]">
                         <thead className="bg-black/20 dark:bg-white/5 text-[var(--admin-text)] text-[12px] font-bold uppercase tracking-widest border-b border-[var(--admin-border)]">
                           <tr>
                              <th className="p-4">Name</th>
                              <th className="p-4 w-32">Size</th>
                              <th className="p-4 w-32">Type</th>
                              <th className="p-4 w-40 text-right">Date</th>
                              <th className="p-4 w-20"></th>
                           </tr>
                         </thead>
                         <tbody className="text-sm">
                           {/* Folders in List View */}
                           {folders.map((folder: any) => (
                             <tr key={folder.id} onClick={() => handleFolderClick(folder.id)} className="border-b border-[var(--admin-border)]/50 hover:bg-[var(--admin-text)]/5 cursor-pointer group transition-colors">
                                <td className="p-3 font-bold text-gold flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg admin-surface-input flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                       <Folder size={16} className="text-primary" />
                                   </div>
                                   {folder.name}
                                </td>
                                <td className="p-3 text-[var(--admin-text)] text-xs">-</td>
                                <td className="p-3 text-[var(--admin-text)]">
                                   <span className="text-[12px] font-bold uppercase tracking-wider bg-[var(--admin-text)]/5 px-2 py-0.5 rounded">Folder</span>
                                </td>
                                <td className="p-3 text-[var(--admin-text)] text-right text-xs">-</td>
                                <td className="p-3 text-right">
                                   <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                     <button onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, true); }} className="text-[var(--admin-text)] hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                                   </RoleGate>
                                </td>
                             </tr>
                           ))}

                           {/* Files in List View */}
                           {files.map((file: any) => (
                             <tr key={file.id} className="border-b border-[var(--admin-border)]/50 hover:bg-[var(--admin-text)]/5 group transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <td className="p-3 font-medium text-[var(--admin-text)] flex items-center gap-3 whitespace-nowrap">
                                   <div className="w-8 h-8 rounded-lg admin-surface-input flex items-center justify-center overflow-hidden">
                                       {file.type === 'image' ? (
                                           <img src={file.url} alt="" className="w-full h-full object-cover" />
                                       ) : file.type === 'video' ? (
                                           <VideoIcon size={16} className="text-pink-400" />
                                       ) : (
                                           <FileText size={16} className="text-blue-400" />
                                       )}
                                   </div>
                                   <a href={file.url} target="_blank" className="hover:text-gold transition-colors truncate max-w-md">{file.name}</a>
                                </td>
                                <td className="p-3 text-[var(--admin-text)] text-xs whitespace-nowrap font-mono">{file.size}</td>
                                <td className="p-3 text-[var(--admin-text)]">
                                   <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--admin-text)]/5 px-2 py-0.5 rounded">{file.type}</span>
                                </td>
                                <td className="p-3 text-[var(--admin-text)] text-right text-xs whitespace-nowrap">{file.date}</td>
                                <td className="p-3 text-right">
                                   <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                     <button onClick={() => handleDelete(file.id)} className="text-[var(--admin-text)] hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                                   </RoleGate>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                  </div>
               </div>
            )}
            
            <div className="p-4 flex justify-center sticky bottom-0 z-10 w-full mt-6">
                 <Pagination 
                     currentPage={meta.page}
                     totalPages={meta.totalPages}
                     baseUrl="/admin/files"
                 />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--admin-border);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--admin-text);
            opacity: 0.2;
        }
      `}</style>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.action}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Delete Permanently"
        isDestructive={true}
      />
    </PageContainer>
  );
}
