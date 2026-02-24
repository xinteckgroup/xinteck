"use client";

import { deleteBlogPost } from "@/actions/blog";
import { DataGrid } from "@/components/admin/DataGrid";
import { RoleGate } from "@/components/admin/RoleGate";
import { ConfirmDialog, PageContainer, PageHeader } from "@/components/admin/ui";
import { Select } from "@/components/admin/ui/Select";
import { Role } from "@prisma/client";
import { Edit, FileText, LayoutGrid, List, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

import { BlogPostSummary } from "@/types";

import { Pagination } from "@/components/admin/ui/Pagination";
import { PaginatedResponse } from "@/lib/pagination";

interface BlogManagerProps {
  initialData: PaginatedResponse<BlogPostSummary>;
}

export function BlogManager({ initialData }: BlogManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmDeleteIds, setConfirmDeleteIds] = useState<string[] | null>(null);

  // State derived from URL
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "All Categories";
  const statusFilter = searchParams.get("status") || "All Status";

  const posts = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  const handlePageChange = (page: number) => {
     const params = new URLSearchParams(searchParams.toString());
     params.set("page", page.toString());
     router.push(`?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) params.set("search", term);
    else params.delete("search");
    params.set("page", "1"); // Reset page
    router.replace(`?${params.toString()}`);
  }, 300);

  const handleFilter = (key: string, value: string) => {
     const params = new URLSearchParams(searchParams.toString());
     if (value && value !== "All Categories" && value !== "All Status") params.set(key, value);
     else params.delete(key);
     params.set("page", "1"); // Reset page
     router.replace(`?${params.toString()}`);
  };

  const performDelete = async (ids: string[]) => {
      startTransition(async () => {
         for (const id of ids) {
             await deleteBlogPost(id);
         }
         setSelectedIds([]); 
         setConfirmDeleteIds(null);
         router.refresh(); 
      });
  };

  const handleConfirmedDelete = async () => {
      if (!confirmDeleteIds) return;
      await performDelete(confirmDeleteIds);
  };
  
  const columns = [
    {
      key: "title",
      label: "Article Details",
      render: (row: BlogPostSummary) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[6px] admin-surface-secondary flex-shrink-0 overflow-hidden relative border border-[var(--admin-border)]">
            <div className="absolute inset-0 flex items-center justify-center text-[var(--admin-text)]/40">
              <FileText size={20} />
            </div>
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-[var(--admin-text)] leading-tight">{row.title}</span>
             <span className="text-xs text-[var(--admin-text)]/40">{row.author}</span>
          </div>
        </div>
      )
    },
    { key: "category", label: "Category" },
    {
      key: "status",
      label: "Status",
      render: (row: BlogPostSummary) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
          row.status === "Published" ? "bg-green-500/40 text-green-400 border border-green-500/20" : 
          row.status === "In Review" ? "bg-purple-500/40 text-purple-400 border border-purple-500/20" :
          "admin-surface-secondary text-[var(--admin-muted)] border border-[var(--admin-border)]"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.status === "Published" ? "bg-green-400" : row.status === "In Review" ? "bg-purple-400" : "bg-[var(--admin-muted)]"}`} />
          {row.status}
        </span>
      )
    },
    { key: "views", label: "Views", align: "right" as const },
    { key: "date", label: "Date", align: "right" as const },
  ];

  return (
    <PageContainer>
      <PageHeader 
        title="Blog Manager" 
        subtitle={`Create, edit, and manage your articles. Total: ${meta.total}`}
        actions={
          <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
              <div className="flex gap-2">
                <Link href="/admin/blog/ai" className="admin-surface-primary text-[var(--admin-text)] font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-gold transition-colors whitespace-nowrap border border-[var(--admin-border)]">
                    <Sparkles size={14} className="md:w-[18px] md:h-[18px] text-purple-400" />
                    AI Assistant
                </Link>
                <Link href="/admin/blog/new" className="bg-gold text-primary-foreground font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-gold/90 transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap">
                    <Plus size={14} className="md:w-[18px] md:h-[18px]" />
                    New Post
                </Link>
              </div>
          </RoleGate>
        }
      />

      <div className="flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex flex-row gap-2 md:gap-4 justify-between items-center admin-surface-primary backdrop-blur-xs rounded-[10px] p-2">
        <div className="relative flex-1 min-w-0 md:w-64 lg:w-96 bg-black/60 dark:bg-white/30 rounded-[10px]">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
              <input 
                type="text" 
                placeholder="Search articles..." 
                defaultValue={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
              />
           </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 border-l border-[var(--admin-border)] pl-2 md:pl-4 shrink-0">
            {selectedIds.length > 0 && (
                <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                    <button 
                        onClick={() => setConfirmDeleteIds(selectedIds)}
                        className="p-1.5 md:p-2 rounded-[6px] bg-red-500/40 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        title="Delete Selected"
                    >
                        <Trash2 size={14} className="md:w-[16px] md:h-[16px]" />
                    </button>
                </RoleGate>
            )}

            <Select 
               value={statusFilter}
               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilter("status", e.target.value)}
               options={[
                 { value: "All Status", label: "All Status" },
                 { value: "Published", label: "Published" },
                 { value: "In Review", label: "In Review" },
                 { value: "Draft", label: "Draft" },
                 { value: "Archived", label: "Archived" }
               ]}
               className="w-auto min-w-[120px]"
            />

          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'admin-surface-input text-[var(--admin-text)]' : 'text-[var(--admin-text)]/40 hover:text-[var(--admin-text)]'}`}
          >
            <LayoutGrid size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'list' ? 'admin-surface-input text-[var(--admin-text)]' : 'text-[var(--admin-text)]/40 hover:text-[var(--admin-text)]'}`}
          >
            <List size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
      
      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {["All Categories", "Technology", "Design", "DevOps", "Sustainability", "Engineering"].map((filter) => (
           <button 
             key={filter}
             onClick={() => handleFilter("category", filter)}
             className={`px-4 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === filter 
                ? "bg-gold text-[var(--admin-text)] border-gold font-bold shadow-sm" 
                : "admin-surface-primary border-[var(--admin-border)] text-[var(--admin-text)]/70 hover:bg-[var(--admin-text)]/5 hover:text-gold backdrop-blur-sm"
             }`}
           >
             {filter}
           </button>
         ))}
      </div>

      <ConfirmDialog 
        open={!!confirmDeleteIds}
        onClose={() => setConfirmDeleteIds(null)}
        onConfirm={handleConfirmedDelete}
        title="Delete Posts?"
        message="Are you sure you want to delete the selected posts? This action cannot be undone."
      />

      {/* Data Grid */}
      {viewMode === "list" ? (
        <DataGrid 
          columns={columns} 
          data={posts}
          hideSearch={true}
          hideBulkActions={true} // Hidden in DataGrid, handled in Toolbar
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actions={{
            onEdit: (id) => router.push(`/admin/blog/${id}`),
            onDelete: performDelete, // DataGrid handles confirmation, then calls this
            onView: (id) => {},
          }} 
          pagination={{
            page: meta.page,
            totalPages: meta.totalPages,
            total: meta.total,
            onPageChange: handlePageChange
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {posts.map(post => (
                    <div key={post.id} className="group admin-surface-primary backdrop-blur-xs rounded-[10px] overflow-hidden hover:border-gold/30 transition-all flex flex-col">
                        <div className="aspect-video admin-surface-secondary relative flex items-center justify-center text-[var(--admin-text)]/10">
                        <FileText size={48} />
                        <div className="absolute top-3 left-3">
                            <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider border ${
                                post.status === "Published" ? "bg-green-500/20 text-[var(--admin-text)] border-green-500/20" : 
                                post.status === "In Review" ? "bg-purple-500/20 text-[var(--admin-text)] border-purple-500/20" :
                                "admin-surface-input text-[var(--admin-text)]/50 border-[var(--admin-border)]"
                            }`}>
                                {post.status}
                            </span>
                        </div>
                        </div>
                        
                        <div className="p-4 flex flex-col flex-1 gap-2">
                        <div>
                            <span className="text-sm text-gold font-bold uppercase tracking-wider">{post.category}</span>
                            <h3 className="text-sm md:text-base font-bold text-[var(--admin-text)] leading-tight line-clamp-2 mt-1">{post.title}</h3>
                            <p className="text-xs text-[var(--admin-text)] mt-1">By {post.author} • {post.date}</p>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-[var(--admin-border)] flex items-center justify-between">
                            <span className="text-xs text-[var(--admin-text)]">{post.views} views</span>
                            <div className="flex gap-2">
                                <button onClick={() => router.push(`/admin/blog/${post.id}`)} className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded-[6px] text-[var(--admin-text)] hover:text-[var(--admin-brand)] transition-colors">
                                    <span className="sr-only">Edit</span>
                                    <Edit size={16} />
                                </button>
                                <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                <button onClick={() => setConfirmDeleteIds([post.id])} className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded-[6px] text-[var(--admin-text)] hover:text-red-500 transition-colors">
                                    <span className="sr-only">Delete</span>
                                    <Trash2 size={16} />
                                </button>
                                </RoleGate>
                            </div>
                        </div>
                        </div>
                    </div>
                ))}
             </div>
             
             {/* Grid View Pagination */}
             <div className="flex justify-center mt-4">
                 <Pagination 
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                 />
             </div>
        </div>
      )}
      </div>
    </PageContainer>
  );
}
