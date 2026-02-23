"use client";

import { deleteProject } from "@/actions/project";
import { DataGrid } from "@/components/admin/DataGrid";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Pagination } from "@/components/admin/ui/Pagination";
import { Select } from "@/components/admin/ui/Select";
import { PaginatedResponse } from "@/lib/pagination";
import { ProjectSummary } from "@/types";
import { Role } from "@prisma/client";
import { Edit, Eye, Grid, LayoutList, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

interface ProjectManagerProps {
  initialData: PaginatedResponse<ProjectSummary>;
}

export function ProjectManager({ initialData }: ProjectManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    action: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
  });
  const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

  // Sync state with URL params
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All Categories";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [categoryFilter, setCategoryFilter] = useState(currentCategory);

  const projects = initialData.data;
  const meta = {
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  };

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All Categories") {
        params.set(name, value);
    } else {
        params.delete(name);
    }
    // Reset page to 1 on filter change
    if (name !== "page") {
        params.set("page", "1");
    }
    return params.toString();
  };

  const handleSearch = useDebouncedCallback((term: string) => {
     router.push(pathname + "?" + createQueryString("search", term));
  }, 300);

  const handleCategoryChange = (val: string) => {
      setCategoryFilter(val);
      router.push(pathname + "?" + createQueryString("category", val));
  };

  const handlePageChange = (page: number) => {
      router.push(pathname + "?" + createQueryString("page", page.toString()));
  };

  const handleSearchChange = (val: string) => {
      setSearchQuery(val);
      handleSearch(val);
  };

  const handleDelete = (ids: string | string[]) => {
     const idList = Array.isArray(ids) ? ids : [ids];
     setConfirmConfig({
         isOpen: true,
         title: "Delete Project(s)",
         description: `Are you absolutely sure you want to delete ${idList.length} project(s)? This cannot be undone.`,
         action: () => {
             closeConfirm();
             startTransition(async () => {
                 for (const id of idList) {
                     await deleteProject(id);
                 }
             });
         }
     });
  };

  return (
    <PageContainer>
      <PageHeader
        title="Project Manager"
        subtitle={`Manage your portfolio case studies. Total: ${meta.total}`}
        actions={
          <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
              <div className="flex gap-2">
                <Link href="/admin/projects/ai" className="admin-surface-primary text-[var(--admin-text)] font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-gold transition-colors whitespace-nowrap border border-[var(--admin-border)]">
                    <Sparkles size={14} className="md:w-[18px] md:h-[18px] text-purple-400" />
                    AI Assistant
                </Link>
                <Link href="/admin/projects/new" className="bg-gold text-primary-foreground font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-gold/90 transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap">
                  <Plus size={14} className="md:w-[18px] md:h-[18px]" />
                  Add Project
                </Link>
              </div>
          </RoleGate>
        }
      />

      {/* Content Area */}
      <div className="flex flex-col gap-3">
        {/* Toolbar */}
        <div className="flex flex-row items-center gap-2 justify-between bg-[var(--admin-surface-primary)] backdrop-blur-xl border border-[var(--admin-border)] rounded-[10px] p-2 shadow-xl">
        <div className="relative flex-1 min-w-0 md:w-64 lg:w-96 bg-[var(--admin-surface-input)] rounded-[10px]">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
             <input 
               type="text" 
               placeholder="Search projects..." 
               value={searchQuery}
               onChange={(e) => handleSearchChange(e.target.value)}
               className="w-full bg-transparent border border-transparent rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
             />
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 border-l border-[var(--admin-border)] pl-2 md:pl-4 shrink-0">
           {/* Category Filter */}
           <Select 
              value={categoryFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCategoryChange(e.target.value)}
              options={[
                { value: "All Categories", label: "All Categories" },
                { value: "Mobile App", label: "Mobile App" },
                { value: "UI/UX Design", label: "UI/UX Design" },
                { value: "Web Dev", label: "Web Dev" },
                { value: "Custom Software", label: "Custom Software" },
                { value: "Consulting", label: "Consulting" },
              ]}
              className="w-auto min-w-[180px] hidden md:flex"
           />

          <button 
            onClick={() => setViewMode("grid")}
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'grid' ? 'bg-gold text-primary-foreground' : 'text-[var(--admin-muted)] hover:text-[var(--admin-text)]'}`}
          >
            <Grid size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-1.5 md:p-2 rounded-[6px] transition-colors ${viewMode === 'list' ? 'bg-gold text-primary-foreground' : 'text-[var(--admin-muted)] hover:text-[var(--admin-text)]'}`}
          >
            <LayoutList size={14} className="md:w-[18px] md:h-[18px]" />
          </button>
        </div>
      </div>
      
      {/* Mobile Filters Row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
         {["All Categories", "Mobile App", "UI/UX Design", "Web Dev"].map((filter) => (
           <button 
             key={filter}
             onClick={() => handleCategoryChange(filter)}
             className={`px-4 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === filter 
                ? "bg-gold text-[var(--admin-text)] border-gold font-bold shadow-xl" 
                : "bg-[var(--admin-surface-primary)] backdrop-blur-xl border-[var(--admin-border)] text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 hover:text-gold shadow-xl"
             }`}
           >
             {filter}
           </button>
         ))}
      </div>
        
        {/* Pagination Controls */}
        <div className="mt-4">
            <Pagination 
                currentPage={meta.page}
                totalPages={meta.totalPages}
                baseUrl="/admin/projects"
            />
        </div>

                 {/* Grid View */}
      {viewMode === "grid" ? (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group bg-[var(--admin-surface-primary)] backdrop-blur-xl border border-[var(--admin-border)] shadow-xl rounded-[10px] overflow-hidden hover:border-gold/50 transition-all flex flex-col">
              {/* Image Area */}
              <div className="aspect-video bg-[var(--admin-surface-input)] relative overflow-hidden">
                 {/* Placeholder Gradient if image fails or for mock */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                 
                 {project.image && (
                    // In real app use Next/Image
                    <img src={project.image} alt={project.title} className="absolute inset-0 w-full h-full object-cover -z-10 opacity-60" />
                 )}

                 {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                     <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                       project.status === "Active" ? "bg-green-500 text-primary-foreground" : 
                       project.status === "Completed" ? "bg-gold text-primary-foreground" : "bg-[var(--admin-surface-input)] text-[var(--admin-text)] border border-[var(--admin-border)]"
                     }`}>
                       {project.status}
                     </span>
                  </div>

                 {/* Actions Overlay */}
                 <div className="absolute inset-0 bg-[var(--admin-background)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                    <button onClick={() => router.push(`/portfolio/${project.id}`)} className="p-2 bg-[var(--admin-surface-primary)] border border-white/10 hover:border-gold hover:text-gold text-white rounded-full transition-all shadow-xl" title="View in Portfolio">
                       <Eye size={18} />
                    </button>
                    <button onClick={() => router.push(`/admin/projects/${project.id}`)} className="p-2 bg-[var(--admin-surface-primary)] border border-white/10 hover:border-gold hover:text-gold text-white rounded-full transition-all shadow-xl" title="Edit">
                       <Edit size={18} />
                    </button>
                 </div>
              </div>

              {/* Content */}
                  <div className="p-4 flex flex-col flex-1 relative z-10">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-sm md:text-base font-bold text-[var(--admin-text)] leading-tight line-clamp-1">{project.title}</h3>
                      <p className="text-xs text-[var(--admin-text)]/70">{project.client}</p>
                    </div>
                 </div>
                 
                 <div className="mt-auto pt-4 border-t border-[var(--admin-border)] flex items-center justify-between">
                    <span className="text-xs font-bold text-gold px-2 py-1 bg-gold/10 rounded-[4px] border border-gold/20">{project.category}</span>
                    <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                      <button onClick={() => handleDelete(project.id)} className="text-[var(--admin-text)]/60 hover:text-red-400 transition-colors bg-[var(--admin-surface-input)] p-1.5 rounded-[6px]">
                         <Trash2 size={16} />
                      </button>
                    </RoleGate>
                 </div>
              </div>
            </div>
          ))}
          
           {/* Add New Placeholer */}
          <Link href="/admin/projects/new" className="border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface-primary)] backdrop-blur-xl hover:bg-[var(--admin-surface-primary)] shadow-xl rounded-[10px] flex flex-col items-center justify-center gap-4 text-[var(--admin-text)] hover:text-gold hover:border-gold/100 hover:bg-gold/5 transition-all min-h-[200px]">
             <div className="w-12 h-12 rounded-full bg-[var(--admin-surface-input)] border border-[var(--admin-border)] flex items-center justify-center">
                <Plus size={24} />
             </div>
             <span className="font-bold text-sm">Create New Project</span>
          </Link>
        </div>
      ) : (
        /* List View */
          <DataGrid 
          columns={[
            { key: "title", label: "Project", render: (row: ProjectSummary) => <span className="font-bold text-[var(--admin-text)] max-w-[200px] truncate text-xs md:text-base block">{row.title}</span> },
            { key: "client", label: "Client", render: (row: ProjectSummary) => <span className="text-[var(--admin-text)] text-[10px] md:text-sm whitespace-nowrap">{row.client}</span> },
            { key: "category", label: "Category", render: (row: ProjectSummary) => <span className="text-[10px] md:text-xs admin-surface-input px-2 py-1 rounded text-[var(--admin-text)] whitespace-nowrap">{row.category}</span> },
            { key: "status", label: "Status", render: (row: ProjectSummary) => <span className="text-[10px] md:text-sm font-medium text-[var(--admin-text)]">{row.status}</span> }
          ]}
          data={projects}
          hideSearch={true}
          hideBulkActions={true}
          pagination={{
             page: meta.page,
             totalPages: meta.totalPages,
             total: meta.total,
             onPageChange: handlePageChange
          }}
          actions={{
             onEdit: (id) => router.push(`/admin/projects/${id}`),
             onDelete: handleDelete
          }}
        />
      )}
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmConfig.action}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Delete"
        isDestructive={true}
        isLoading={isPending}
      />
    </PageContainer>
  );
}
