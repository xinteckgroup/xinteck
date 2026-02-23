"use client";

import { createBlogPost, updateBlogPost } from "@/actions/blog";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { Select } from "@/components/admin/ui/Select";
import { Role } from "@prisma/client";
import { Image as ImageIcon, Save, Send, Upload, X } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface BlogEditorFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function BlogEditorForm({ initialData, isEditing = false }: BlogEditorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Technology",
    status: initialData?.status || "Draft",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    image: initialData?.featuredImage || "", // Note field name mapping
    version: initialData?.version
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug
    }));
  };

  const handleSave = async () => {
      setError("");
      if (!formData.title || !formData.slug) {
          setError("Title and Slug are required.");
          return;
      }

      startTransition(async () => {
          try {
              let result;
              if (isEditing && initialData?.id) {
                  result = await updateBlogPost(initialData.id, formData);
              } else {
                  result = await createBlogPost(formData);
              }

              if (result && (result.success || result.id)) {
                  router.push("/admin/blog");
                  router.refresh();
              }
          } catch (e: any) {
              if (isRedirectError(e)) throw e; // Allow Next.js to run the Server-Action redirect

              if (e.message?.includes("Concurrency conflict")) {
                  if (confirm("This post has been modified by another user. Reload to get the latest version?")) {
                      window.location.reload();
                      return;
                  }
              }
              setError(e.message || "Failed to save post");
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

       <PageHeader 
         title={isEditing ? "Edit Blog Post" : "New Blog Post"}
         backUrl="/admin/blog"
         backLabel="Back to Blog"
         actions={
           <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
              <button 
                 onClick={() => { setFormData({...formData, status: "Draft"}); handleSave(); }}
                 disabled={isPending}
                 className="backdrop-blur-sm flex-1 sm:flex-initial px-3 py-1.5 md:px-4 md:py-2 rounded-[8px] admin-surface-primary text-[var(--admin-text)] hover:text-gold hover:bg-[var(--admin-text)]/5 transition-all font-bold text-[10px] md:text-sm whitespace-nowrap disabled:opacity-50 border border-[var(--admin-border)] shadow-sm"
              >
                 Save Draft
              </button>
              
              <RoleGate 
                allowedRoles={[Role.ADMIN, Role.SUPPORT_STAFF]} 
                fallback={
                    <button 
                         onClick={() => { setFormData({...formData, status: "Published"}); handleSave(); }}
                         disabled={isPending}
                         className="backdrop-blur-sm flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-primary-foreground font-bold text-[10px] md:text-sm hover:bg-gold/90 transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
                      >
                         {isPending ? (
                             <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                         ) : (
                             <Save size={12} className="md:w-4 md:h-4" />
                         )}
                         {isEditing ? "Update Post" : "Publish Now"}
                      </button>
                }
               >
                  <button 
                     onClick={() => { setFormData({...formData, status: "In Review"}); handleSave(); }}
                     disabled={isPending}
                     className="backdrop-blur-sm flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-purple-600/90 text-white font-bold text-[10px] md:text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50 shadow-[0_4px_14px_0_rgba(147,51,234,0.39)]"
                  >
                     {isPending ? (
                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                     ) : (
                         <Send size={12} className="md:w-4 md:h-4" />
                     )}
                     Submit for Review
                  </button>
              </RoleGate>
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
                <div className="flex flex-col gap-4">
                   <div className="flex flex-col gap-2">
                      <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Post Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Enter article title..." 
                        className="backdrop-blur-sm admin-surface-input rounded-[8px] px-3 md:px-4 py-2 md:py-3 text-[var(--admin-text)] text-sm md:text-lg font-bold outline-none focus:border-gold/50 placeholder:font-normal"
                      />
                   </div>
                   <div className="flex flex-col gap-2">
                      <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase">Slug</label>
                      <div className="flex items-center backdrop-blur-sm admin-surface-input rounded-[8px] px-2 md:px-4 py-1.5 md:py-2 gap-1 md:gap-2 overflow-x-auto">
                         <span className="text-[var(--admin-text)]/60 text-[10px] md:text-sm whitespace-nowrap">xinteck.co.ke/blog/</span>
                         <input 
                           type="text" 
                           value={formData.slug}
                           onChange={(e) => setFormData({...formData, slug: e.target.value})}
                           className="bg-transparent border-none text-[var(--admin-text)] text-xs md:text-sm outline-none flex-1 font-mono min-w-0"
                        />
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col gap-1 md:gap-2 min-w-0 overflow-hidden">
                <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase ml-1">Content</label>
                <MarkdownEditor 
                   value={formData.content} 
                   onChange={(val) => setFormData({...formData, content: val})} 
                />
             </div>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-3 md:gap-6 min-w-0">
             {/* Publishing Options */}
             <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] p-3 md:p-6 flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2">Publishing</h3>
                
                <div className="flex flex-col gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)]/70">Status</label>
                   <Select 
                     value={formData.status}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, status: e.target.value})}
                     options={[
                       { value: "Draft", label: "Draft" },
                       { value: "In Review", label: "In Review" },
                       { value: "Published", label: "Published" },
                       { value: "Archived", label: "Archived" }
                     ]}
                   />
                </div>

                <div className="flex flex-col gap-2">
                   <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)]/70">Category</label>
                   <Select 
                     value={formData.category}
                     onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, category: e.target.value})}
                     options={[
                        { value: "Technology", label: "Technology" },
                        { value: "Design", label: "Design" },
                        { value: "Engineering", label: "Engineering" },
                        { value: "DevOps", label: "DevOps" },
                        { value: "Sustainability", label: "Sustainability" }
                     ]}
                   />
                </div>
             </div>

             {/* Featured Image */}
             <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] p-3 md:p-6 flex flex-col gap-3 md:gap-4">
                <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2">Featured Image</h3>
                
                {formData.image ? (
                    <div className="relative aspect-video admin-surface-input rounded-[8px] overflow-hidden group">
                        <Image 
                            src={formData.image} 
                            alt="Featured" 
                            fill 
                            className="object-cover" 
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
                       placeholder="Or paste image URL..." 
                       className="w-full admin-surface-input rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-[var(--admin-text)] text-[10px] md:text-xs outline-none focus:border-gold/50 pr-8 truncate focus:min-w-0"
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
                   value={formData.excerpt}
                   onChange={(e) => {
                       setFormData({...formData, excerpt: e.target.value});
                       e.target.style.height = 'auto';
                       e.target.style.height = e.target.scrollHeight + 'px';
                   }}
                   placeholder="Short summary for SEO and previews..."
                   className="admin-surface-input rounded-[8px] px-2 md:px-3 py-1.5 md:py-2 text-[var(--admin-text)] text-[10px] md:text-xs outline-none focus:border-gold/50 resize-y min-h-[120px]"
                />
             </div>
          </div>
       </div>
    </PageContainer>
  );
}
