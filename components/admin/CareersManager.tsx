"use client";

import {
    createCareerPosition,
    deleteCareerPosition,
    toggleCareerPosition,
    updateCareerPosition
} from "@/actions/careers";
import { RoleGate } from "@/components/admin/RoleGate";
import {
    Button,
    EmptyState,
    Input,
    Modal,
    PageContainer,
    PageHeader,
    Select,
    useToast,
} from "@/components/admin/ui";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Pagination } from "@/components/admin/ui/Pagination";
import { PaginatedResponse } from "@/lib/pagination";
import { CareerPosition, Role } from "@prisma/client";
import {
    Briefcase,
    Check,
    Edit,
    GraduationCap,
    MapPin,
    Plus,
    Search,
    ToggleLeft,
    ToggleRight,
    Trash2,
    X,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

// ─── Types ───

interface CareersManagerProps {
    initialData: PaginatedResponse<CareerPosition>;
    departments: string[];
}

const EMPLOYMENT_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"];

const INITIAL_FORM = {
    title: "",
    department: "",
    type: "Full-Time",
    location: "",
    description: "",
    requirements: [] as string[],
    salaryRange: "",
    isActive: true,
    sortOrder: 0,
};

// ─── Component ───

export function CareersManager({ initialData, departments }: CareersManagerProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const toast = useToast();

    // URL-synced state
    const currentSearch = searchParams.get("search") || "";
    const currentDepartment = searchParams.get("department") || "all";
    const currentStatus = searchParams.get("status") || "all";
    const currentPage = Number(searchParams.get("page")) || 1;

    const [searchQuery, setSearchQuery] = useState(currentSearch);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<CareerPosition | null>(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [requirementInput, setRequirementInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({ isOpen: false, title: "", description: "", action: () => {} });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const positions = initialData.data;
    const meta = {
        page: initialData.page,
        totalPages: initialData.totalPages,
        total: initialData.total,
    };

    // ─── URL Helpers ───

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            if (name !== "page") {
                params.set("page", "1");
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = useDebouncedCallback((term: string) => {
        router.push(pathname + "?" + createQueryString("search", term));
    }, 300);

    const handleDepartmentChange = (val: string) => {
        router.push(pathname + "?" + createQueryString("department", val));
    };

    const handleStatusChange = (val: string) => {
        router.push(pathname + "?" + createQueryString("status", val));
    };

    const handlePageChange = (page: number) => {
        router.push(pathname + "?" + createQueryString("page", page.toString()));
    };

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        handleSearch(val);
    };

    // ─── Modal Handlers ───

    const openCreate = () => {
        setEditingPosition(null);
        setForm(INITIAL_FORM);
        setRequirementInput("");
        setModalOpen(true);
    };

    const openEdit = (position: CareerPosition) => {
        setEditingPosition(position);
        setForm({
            title: position.title,
            department: position.department,
            type: position.type,
            location: position.location,
            description: position.description || "",
            requirements: position.requirements,
            salaryRange: position.salaryRange || "",
            isActive: position.isActive,
            sortOrder: position.sortOrder,
        });
        setRequirementInput("");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingPosition(null);
        setForm(INITIAL_FORM);
    };

    const addRequirement = () => {
        const trimmed = requirementInput.trim();
        if (trimmed && !form.requirements.includes(trimmed)) {
            setForm((prev) => ({ ...prev, requirements: [...prev.requirements, trimmed] }));
            setRequirementInput("");
        }
    };

    const removeRequirement = (index: number) => {
        setForm((prev) => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index),
        }));
    };

    // ─── Save ───

    const handleSave = async () => {
        if (!form.title || !form.department || !form.location) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setSaving(true);
        try {
            if (editingPosition) {
                await updateCareerPosition(editingPosition.id, form);
                toast.success("Position updated successfully.");
            } else {
                await createCareerPosition(form);
                toast.success("Position created successfully.");
            }
            closeModal();
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to save position.");
        } finally {
            setSaving(false);
        }
    };

    // ─── Actions ───

    const handleDelete = async (id: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Delete Position",
            description: "Are you sure you want to permanently delete this job listing? This cannot be undone.",
            action: async () => {
                closeConfirm();
                startTransition(async () => {
                    try {
                        await deleteCareerPosition(id);
                        toast.success("Position deleted.");
                        router.refresh();
                    } catch {
                        toast.error("Failed to delete position.");
                    }
                });
            }
        });
    };

    const handleToggle = async (id: string) => {
        startTransition(async () => {
            try {
                const result = await toggleCareerPosition(id);
                toast.success(result.isActive ? "Position activated." : "Position deactivated.");
                router.refresh();
            } catch {
                toast.error("Failed to toggle position.");
            }
        });
    };

    // ─── Render ───

    return (
        <PageContainer>
            <PageHeader
                title="Careers Manager"
                subtitle={`Manage job listings. Total: ${meta.total}`}
                actions={
                    <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                        <button
                            onClick={openCreate}
                            className="bg-gold text-primary-foreground font-bold px-3 py-1.5 md:px-6 md:py-3 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-gold/90 transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap"
                        >
                            <Plus size={14} className="md:w-[18px] md:h-[18px]" />
                            Add Position
                        </button>
                    </RoleGate>
                }
            />

            {/* Toolbar */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-row items-center gap-2 justify-between bg-white/30 dark:bg-black/60 backdrop-blur-xl border border-[var(--admin-border)] rounded-[10px] p-2 shadow-xl">
                    <div className="relative flex-1 min-w-0 md:w-64 lg:w-96 bg-white/50 dark:bg-white/5 rounded-[10px]">
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search positions..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="w-full bg-transparent border border-transparent rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2 border-l border-[var(--admin-border)] pl-2 md:pl-4 shrink-0">
                        <Select
                            value={currentDepartment}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleDepartmentChange(e.target.value)}
                            options={[
                                { value: "all", label: "All Departments" },
                                ...departments.map((d) => ({ value: d, label: d })),
                            ]}
                            className="w-auto min-w-[150px] hidden md:flex"
                        />
                        <Select
                            value={currentStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStatusChange(e.target.value)}
                            options={[
                                { value: "all", label: "All Status" },
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                            className="w-auto min-w-[120px] hidden md:flex"
                        />
                    </div>
                </div>

                {/* Mobile Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden">
                    {["all", "active", "inactive"].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleStatusChange(filter)}
                            className={`px-4 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
                                currentStatus === filter
                                    ? "bg-gold text-[var(--admin-text)] border-gold font-bold shadow-xl"
                                    : "bg-white/30 dark:bg-black/60 border-[var(--admin-border)] text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 hover:text-gold backdrop-blur-xl shadow-xl"
                            }`}
                        >
                            {filter === "all" ? "All" : filter === "active" ? "Active" : "Inactive"}
                        </button>
                    ))}
                </div>

                {/* Positions List */}
                {positions.length === 0 ? (
                    <EmptyState
                        icon={<GraduationCap size={24} />}
                        message="No career positions found. Create your first listing."
                        action={
                            <button
                                onClick={openCreate}
                                className="text-gold hover:text-gold/80 text-sm font-bold"
                            >
                                + Add Position
                            </button>
                        }
                    />
                ) : (
                    <div className="grid gap-3">
                        {positions.map((position) => (
                            <div
                                key={position.id}
                                className="bg-white/30 dark:bg-black/60 backdrop-blur-xl border border-[var(--admin-border)] rounded-[10px] p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-4 group hover:border-gold/50 transition-all shadow-xl"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <h3 className="text-sm md:text-base font-bold text-[var(--admin-text)] truncate">
                                            {position.title}
                                        </h3>
                                        <span
                                            className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider ${
                                                position.isActive
                                                    ? "bg-green-500/20 text-green-400"
                                                    : "bg-[var(--admin-muted)]/20 text-[var(--admin-muted)]"
                                            }`}
                                        >
                                            {position.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 md:gap-4 flex-wrap text-xs text-[var(--admin-muted)]">
                                        <span className="flex items-center gap-1">
                                            <Briefcase size={12} />
                                            {position.department}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {position.location}
                                        </span>
                                        <span className="font-bold text-gold px-2 py-0.5 bg-gold/40 rounded-[4px]">
                                            {position.type}
                                        </span>
                                        {position.salaryRange && (
                                            <span className="text-[var(--admin-text)]">{position.salaryRange}</span>
                                        )}
                                    </div>
                                    {position.requirements.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {position.requirements.slice(0, 4).map((req: string, i: number) => (
                                                <span
                                                    key={i}
                                                    className="text-[10px] admin-surface-input px-2 py-0.5 rounded text-[var(--admin-muted)]"
                                                >
                                                    {req}
                                                </span>
                                            ))}
                                            {position.requirements.length > 4 && (
                                                <span className="text-[10px] text-[var(--admin-muted)]">
                                                    +{position.requirements.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleToggle(position.id)}
                                            className={`p-2 rounded-[6px] transition-colors ${
                                                position.isActive
                                                    ? "text-green-400 hover:bg-green-400/10"
                                                    : "text-[var(--admin-muted)] hover:bg-[var(--admin-muted)]/10"
                                            }`}
                                            title={position.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {position.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                                        </button>
                                        <button
                                            onClick={() => openEdit(position)}
                                            className="p-2 rounded-[6px] text-[var(--admin-muted)] hover:text-gold hover:bg-gold/40 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(position.id)}
                                            className="p-2 rounded-[6px] text-[var(--admin-muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </RoleGate>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.totalPages}
                        baseUrl="/admin/careers"
                    />
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editingPosition ? "Edit Position" : "New Position"}
                subtitle={editingPosition ? `Editing: ${editingPosition.title}` : "Create a new career listing"}
                maxWidth="max-w-2xl"
                footer={
                    <>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : editingPosition ? "Update" : "Create"}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">
                            Job Title <span className="text-red-400">*</span>
                        </label>
                        <Input
                            value={form.title}
                            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="e.g. Senior Backend Engineer"
                        />
                    </div>

                    {/* Department + Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">
                                Department <span className="text-red-400">*</span>
                            </label>
                            <Input
                                value={form.department}
                                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                                placeholder="e.g. Engineering"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">
                                Employment Type
                            </label>
                            <Select
                                value={form.type}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                    setForm((p) => ({ ...p, type: e.target.value }))
                                }
                                options={EMPLOYMENT_TYPES.map((t) => ({ value: t, label: t }))}
                            />
                        </div>
                    </div>

                    {/* Location + Salary */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">
                                Location <span className="text-red-400">*</span>
                            </label>
                            <Input
                                value={form.location}
                                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                                placeholder="e.g. Remote / Nairobi, Kenya"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">
                                Salary Range
                            </label>
                            <Input
                                value={form.salaryRange}
                                onChange={(e) => setForm((p) => ({ ...p, salaryRange: e.target.value }))}
                                placeholder="e.g. $80k - $120k"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                            rows={4}
                            placeholder="Job description..."
                            className="w-full bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-transparent rounded-[10px] px-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors resize-none shadow-inner"
                        />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">Requirements</label>
                        <div className="flex gap-2 mb-2">
                            <Input
                                value={requirementInput}
                                onChange={(e) => setRequirementInput(e.target.value)}
                                placeholder="Add a requirement..."
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addRequirement();
                                    }
                                }}
                            />
                            <Button variant="ghost" onClick={addRequirement} disabled={!requirementInput.trim()}>
                                <Check size={16} />
                            </Button>
                        </div>
                        {form.requirements.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.requirements.map((req, i) => (
                                    <span
                                        key={i}
                                        className="text-xs admin-surface-input px-3 py-1.5 rounded-[6px] text-[var(--admin-text)] flex items-center gap-2"
                                    >
                                        {req}
                                        <button
                                            onClick={() => removeRequirement(i)}
                                            className="text-[var(--admin-muted)] hover:text-red-400 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Order + Active */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-[var(--admin-text)] mb-1 block">Sort Order</label>
                            <Input
                                type="number"
                                value={form.sortOrder}
                                onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))}
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer select-none pb-2">
                                <input
                                    type="checkbox"
                                    checked={form.isActive}
                                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                                    className="accent-gold w-4 h-4"
                                />
                                <span className="text-sm text-[var(--admin-text)] font-bold">Active</span>
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            <ConfirmModal
              isOpen={confirmConfig.isOpen}
              onClose={closeConfirm}
              onConfirm={confirmConfig.action}
              title={confirmConfig.title}
              description={confirmConfig.description}
              confirmText="Delete permanently"
              isDestructive={true}
            />
        </PageContainer>
    );
}
