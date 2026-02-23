"use client";

import { createProject, updateProject } from "@/actions/project";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PageContainer, PageHeader, useToast } from "@/components/admin/ui";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Select } from "@/components/admin/ui/Select";
import { projectSchema } from "@/lib/validations";
import { Calendar, Globe, Image as ImageIcon, Save, Upload, X } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface ProjectEditorFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProjectEditorForm({ initialData, isEditing = false }: ProjectEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { toast } = useToast();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    client: initialData?.client || "",
    category: initialData?.category || "Web Dev",
    status: initialData?.status || "In Review",
    url: initialData?.url || "",
    completionDate: initialData?.completionDate || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    image: initialData?.image || "",
    role: initialData?.role || "",
    tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : "",
    version: initialData?.version
  });

   const handleSave = async () => {
     setError("");
     
     // C2: Client-side validation using shared schema
     const payload = {
         ...formData,
         tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
     };
     const validation = projectSchema.safeParse(payload);
     if (!validation.success) {
         const firstError = validation.error.issues[0].message;
         setError(firstError);
         return;
     }

     startTransition(async () => {
         try {
             let result;
             if (isEditing && initialData?.id) {
                 result = await updateProject(initialData.id, payload);
             } else {
                 result = await createProject(payload);
             }

             if (result && (result.success || result.id)) {
                 toast(isEditing ? "Project updated successfully" : "Project created successfully", "success");
                 router.push("/admin/projects");
                 router.refresh();
             }
         } catch (e: any) {
             if (isRedirectError(e)) throw e; // Allow Next.js to run the Server-Action redirect
             
             const msg = e.message || "Failed to save project";
             
             if (msg.includes("Concurrency conflict")) {
                 setIsConfirmOpen(true);
                 return;
             }

             setError(msg);
             toast(msg, "error");
         }
     });
   };

  return (
    <PageContainer>
       <MediaPicker 
           isOpen={showMediaPicker} 
           onClose={() => setShowMediaPicker(false)} 
           onSelect={(url) => setFormData({ ...formData, image: url })} 
       />

       {/* Actions Header */}
       <PageHeader
         title={isEditing ? "Edit Project" : "New Project"}
         backUrl="/admin/projects"
         backLabel="Back to Projects"
         actions={
           <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
               <button 
                 onClick={() => { setFormData({...formData, status: "In Review"}); handleSave(); }}
                 disabled={isPending}
                  className="backdrop-blur-sm flex-1 sm:flex-initial px-3 py-1.5 md:px-4 md:py-2 rounded-[8px] admin-surface-primary text-[var(--admin-text)] hover:text-gold hover:bg-[var(--admin-text)]/5 transition-all font-bold text-[10px] md:text-sm whitespace-nowrap disabled:opacity-50 border border-[var(--admin-border)] shadow-sm"
               >
                  Save Draft
               </button>
               <button 
                  onClick={handleSave}
                  disabled={isPending}
                  className="backdrop-blur-sm flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-primary-foreground font-bold text-[10px] md:text-sm hover:bg-gold/90 transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
               >
                  {isPending ? (
                      <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                  ) : (
                      <>
                          <Save size={12} className="md:w-4 md:h-4" />
                          {isEditing ? "Update" : "Publish"}
                      </>
                  )}
               </button>
           </div>
         }
       />

       {error && (
           <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-[8px] text-sm">
               {error}
           </div>
       )}

       <div className="grid lg:grid-cols-3 gap-3 md:gap-6">
          {/* Main Content Column */}
           <div className="lg:col-span-2 flex flex-col gap-3 md:gap-6 min-w-0">
              <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] p-3 md:p-6 overflow-hidden">
                 <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2 mb-3 md:mb-4">Core Details</h3>
                 <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                       <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Project Title</label>
                       <input 
                         type="text" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         placeholder="e.g. Global Fintech Rebrand" 
                         className="admin-surface-input rounded-[8px] px-3 md:px-4 py-2 md:py-3 text-[var(--admin-text)] text-sm md:text-lg font-bold outline-none focus:border-gold/50 placeholder:font-normal"
                       />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                       <div className="flex flex-col gap-2">
                          <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Client Name</label>
                          <input 
                            type="text" 
                            value={formData.client}
                            onChange={(e) => setFormData({...formData, client: e.target.value})}
                            placeholder="Client Name" 
                            className="admin-surface-input rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-gold/50"
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Live URL</label>
                          <div className="flex items-center admin-surface-input rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 gap-1 md:gap-2 overflow-x-auto">
                             <Globe size={12} className="md:w-3.5 md:h-3.5 text-[var(--admin-text)]/60 shrink-0" />
                             <input 
                               type="url" 
                               value={formData.url}
                               onChange={(e) => setFormData({...formData, url: e.target.value})}
                               placeholder="https://..." 
                               className="bg-transparent border-none text-[var(--admin-text)] text-xs md:text-sm outline-none flex-1 min-w-0"
                             />
                          </div>
                       </div>
                    </div>

                    {/* New Role & Tags Row */}
                    <div className="grid md:grid-cols-2 gap-3 md:gap-4 mt-1">
                       <div className="flex flex-col gap-2">
                          <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Project Role</label>
                          <input 
                            type="text" 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            placeholder="e.g. Lead Development, UX Design" 
                            className="admin-surface-input rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-gold/50"
                          />
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Tags (Comma Separated)</label>
                          <input 
                            type="text" 
                            value={formData.tags}
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            placeholder="e.g. React, Next.js, Stripe" 
                            className="admin-surface-input rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-gold/50"
                          />
                       </div>
                    </div>
                 </div>
              </div>

             <div className="flex flex-col gap-1 md:gap-2 min-w-0 overflow-hidden">
                <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase ml-1">Full Markdown Case Study</label>
                <MarkdownEditor 
                   value={formData.content}
                   onChange={(content) => setFormData({...formData, content})}
                />
             </div>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-3 md:gap-6 min-w-0">
             {/* Publishing Options */}
              <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] p-3 md:p-6 flex flex-col gap-3 md:gap-4">
                 <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2">Project Settings</h3>
                 
                 <div className="flex flex-col gap-2">
                    <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)]/80">Status</label>
                    <Select 
                      value={formData.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, status: e.target.value})}
                      options={[
                        { value: "Active", label: "Active (In Progress)" },
                        { value: "Completed", label: "Completed" },
                        { value: "In Review", label: "In Review" },
                        { value: "Archived", label: "Archived" }
                      ]}
                    />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)]/80">Service Category</label>
                    <Select 
                      value={formData.category}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}
                      options={[
                        { value: "Web Dev", label: "Web Development" },
                        { value: "Mobile App", label: "Mobile App" },
                        { value: "UI/UX Design", label: "UI/UX Design" },
                        { value: "Custom Software", label: "Custom Software" },
                        { value: "Consulting", label: "Consulting" }
                      ]}
                    />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)]/80">
                        {formData.status === 'Completed' ? 'Completion Date' : 'Estimated Completion'}
                    </label>
                    <div className={`flex items-center border rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 gap-1 md:gap-2 transition-colors ${formData.status === 'Completed' ? 'admin-surface-input border-[var(--admin-border)]' : 'bg-[var(--admin-text)]/5 border-transparent opacity-60'}`}>
                       <Calendar size={12} className="md:w-3.5 md:h-3.5 text-[var(--admin-text)] shrink-0" />
                       <input 
                         type="date"
                         value={formData.completionDate}
                         onChange={(e) => setFormData({...formData, completionDate: e.target.value})}
                         className="bg-transparent border-none text-[var(--admin-text)] text-xs md:text-sm outline-none flex-1 [color-scheme:light] dark:[color-scheme:dark] min-w-0" 
                       />
                    </div>
                 </div>
              </div>

             {/* Featured Image */}
              <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] p-3 md:p-6 flex flex-col gap-3 md:gap-4">
                 <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2">Cover Image</h3>
                 
                 {formData.image ? (
                     <div className="relative aspect-video admin-surface-input rounded-[8px] overflow-hidden group border border-[var(--admin-border)]">
                         <img 
                             src={formData.image} 
                             alt="Cover" 
                             className="w-full h-full object-cover" 
                             onError={(e) => {
                                 (e.target as HTMLImageElement).src = "/images/placeholder.webp";
                             }}
                         />
                         <button 
                             onClick={() => setFormData({...formData, image: ""})}
                             className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                             <X size={14} />
                         </button>
                          <button 
                             onClick={() => setShowMediaPicker(true)}
                             className="absolute bottom-2 right-2 bg-primary text-primary-foreground hover:bg-primary/90 px-2 py-1 rounded-[4px] text-xs font-bold opacity-0 group-hover:opacity-100 transition-all"
                         >
                             Change
                         </button>
                     </div>
                 ) : (
                     <div 
                         onClick={() => setShowMediaPicker(true)}
                         className="aspect-video admin-surface-input rounded-[8px] border border-dashed border-[var(--admin-border)] flex flex-col items-center justify-center gap-1 md:gap-2 cursor-pointer hover:border-gold/50 transition-all group"
                     >
                        <Upload size={18} className="md:w-6 md:h-6 text-[var(--admin-text)] group-hover:text-gold transition-colors" />
                        <span className="text-[8px] md:text-xs text-[var(--admin-text)] font-medium">Click to upload</span>
                     </div>
                 )}

                 <div className="relative">
                     <input 
                        type="text" 
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                        placeholder="Or paste URL..." 
                        className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-[var(--admin-text)] text-[10px] md:text-xs outline-none focus:border-gold/50 pr-8 truncate focus:min-w-0"
                     />
                      <button
                         onClick={() => setShowMediaPicker(true)}
                         className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-[var(--admin-text)] hover:text-gold"
                         title="Open Media Library"
                      >
                         <ImageIcon size={14} />
                      </button>
                 </div>
              </div>
             
             {/* Excerpt */}
              <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] p-3 md:p-6 flex flex-col gap-3 md:gap-4">
                 <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2">Excerpt</h3>
                <textarea 
                   rows={6}
                   value={formData.description}
                   onChange={(e) => {
                       setFormData({...formData, description: e.target.value});
                       e.target.style.height = 'auto';
                       e.target.style.height = e.target.scrollHeight + 'px';
                   }}
                   placeholder="Briefly describe the outcome in 1-2 sentences..."
                   className="admin-surface-input rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-[var(--admin-text)] text-[10px] md:text-xs outline-none focus:border-gold/50 resize-y min-h-[120px]"
                />
             </div>

          </div>
       </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => window.location.reload()}
        title="Concurrency Conflict Detected"
        description="This project has been modified by another user since you opened it. Reload to get the latest version? (You will lose any unsaved changes)"
        confirmText="Reload Page"
        cancelText="Cancel"
        isDestructive={false}
      />
    </PageContainer>
  );
}
