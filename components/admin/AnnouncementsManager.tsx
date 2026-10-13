"use client";

import {
    createAnnouncement,
    deleteAnnouncement,
    toggleAnnouncementActive,
    updateAnnouncement,
} from "@/actions/announcements";
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
import { TYPOGRAPHY } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { Announcement } from "@prisma/client";
import {
    Award,
    Check,
    Clock,
    Edit,
    ExternalLink,
    Eye,
    EyeOff,
    Flame,
    GripVertical,
    Headphones,
    Megaphone,
    Plus,
    Rocket,
    ShieldCheck,
    Sparkles,
    Star,
    Trash2,
    X,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

// ─── Icon Registry ───

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Zap,
    Flame,
    ShieldCheck,
    Award,
    Headphones,
    Sparkles,
    Rocket,
    Clock,
    Star,
    Megaphone,
    Check,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

const INITIAL_FORM = {
    text: "",
    icon: "Zap",
    highlight: false,
    link: "",
    isActive: true,
    sortOrder: 0,
};

// ─── Component ───

interface Props {
    initialData: Announcement[];
}

export function AnnouncementsManager({ initialData }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const toast = useToast();

    const [modalOpen, setModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Announcement | null>(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [saving, setSaving] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({ isOpen: false, title: "", description: "", action: () => {} });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const announcements = initialData;
    const activeCount = announcements.filter(a => a.isActive).length;
    const totalCount = announcements.length;

    // ─── Handlers ───

    const openCreate = () => {
        setEditingItem(null);
        setForm({ ...INITIAL_FORM, sortOrder: totalCount });
        setModalOpen(true);
    };

    const openEdit = (item: Announcement) => {
        setEditingItem(item);
        setForm({
            text: item.text,
            icon: item.icon,
            highlight: item.highlight,
            link: item.link || "",
            isActive: item.isActive,
            sortOrder: item.sortOrder,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingItem(null);
        setForm(INITIAL_FORM);
    };

    const handleSave = async () => {
        if (!form.text.trim()) {
            toast.error("Text is required");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                text: form.text.trim(),
                icon: form.icon,
                highlight: form.highlight,
                link: form.link?.trim() || null,
                isActive: form.isActive,
                sortOrder: form.sortOrder,
            };

            if (editingItem) {
                await updateAnnouncement(editingItem.id, payload);
                toast.success("Announcement updated");
            } else {
                await createAnnouncement(payload);
                toast.success("Announcement created");
            }

            closeModal();
            startTransition(() => router.refresh());
        } catch (err: any) {
            toast.error(err.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = async (item: Announcement) => {
        try {
            await toggleAnnouncementActive(item.id);
            toast.success(item.isActive ? "Deactivated" : "Activated");
            startTransition(() => router.refresh());
        } catch (err: any) {
            toast.error(err.message || "Failed to toggle");
        }
    };

    const handleDelete = (item: Announcement) => {
        setConfirmConfig({
            isOpen: true,
            title: "Delete Announcement",
            description: `Are you sure you want to delete "${item.text}"? This action cannot be undone.`,
            action: async () => {
                try {
                    await deleteAnnouncement(item.id);
                    toast.success("Deleted");
                    closeConfirm();
                    startTransition(() => router.refresh());
                } catch (err: any) {
                    toast.error(err.message || "Failed to delete");
                }
            },
        });
    };

    // ─── Render Icon ───

    const renderIcon = (iconName: string, className?: string) => {
        const IconComponent = ICON_MAP[iconName] || Zap;
        return <IconComponent size={16} className={className} />;
    };

    return (
        <PageContainer>
            <PageHeader
                title="Announcements"
                subtitle={`${activeCount} active of ${totalCount} total — displayed in the scrolling banner on the homepage`}
                actions={
                    <Button icon={<Plus size={16} />} onClick={openCreate}>
                        New Announcement
                    </Button>
                }
            />

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="admin-surface-secondary rounded-[10px] p-4 flex flex-col gap-1">
                    <span className={`${TYPOGRAPHY.meta} text-[var(--admin-muted)] uppercase tracking-wider`}>
                        Total Items
                    </span>
                    <span className={`${TYPOGRAPHY.sectionTitle} text-[var(--admin-text)]`}>
                        {totalCount}
                    </span>
                </div>
                <div className="admin-surface-secondary rounded-[10px] p-4 flex flex-col gap-1">
                    <span className={`${TYPOGRAPHY.meta} text-[var(--admin-muted)] uppercase tracking-wider`}>
                        Active
                    </span>
                    <span className={`${TYPOGRAPHY.sectionTitle} text-green-400`}>
                        {activeCount}
                    </span>
                </div>
                <div className="admin-surface-secondary rounded-[10px] p-4 flex flex-col gap-1">
                    <span className={`${TYPOGRAPHY.meta} text-[var(--admin-muted)] uppercase tracking-wider`}>
                        Highlighted
                    </span>
                    <span className={`${TYPOGRAPHY.sectionTitle} text-gold`}>
                        {announcements.filter(a => a.highlight).length}
                    </span>
                </div>
            </div>

            {/* Items List */}
            <div className="admin-surface-primary rounded-[10px] overflow-hidden">
                {announcements.length === 0 ? (
                    <EmptyState
                        icon={<Megaphone size={20} className="text-[var(--admin-muted)]" />}
                        message="No announcements yet. Create one to populate the homepage banner."
                        action={
                            <Button size="sm" icon={<Plus size={14} />} onClick={openCreate}>
                                Create First Announcement
                            </Button>
                        }
                    />
                ) : (
                    <div className="divide-y divide-[var(--admin-border)]">
                        {announcements.map((item) => (
                            <div
                                key={item.id}
                                className={cn(
                                    "flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3 md:py-4 transition-colors hover:bg-[var(--admin-text)]/5 group",
                                    !item.isActive && "opacity-50"
                                )}
                            >
                                {/* Drag Handle (visual only for now) */}
                                <GripVertical
                                    size={16}
                                    className="text-[var(--admin-muted)]/30 flex-shrink-0 cursor-grab hidden md:block"
                                />

                                {/* Icon */}
                                <div
                                    className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                        item.highlight
                                            ? "bg-gold/20 text-gold"
                                            : "bg-[var(--admin-text)]/10 text-[var(--admin-muted)]"
                                    )}
                                >
                                    {renderIcon(item.icon)}
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                    <span
                                        className={cn(
                                            `${TYPOGRAPHY.body} leading-tight`,
                                            item.highlight
                                                ? "text-gold font-bold"
                                                : "text-[var(--admin-text)]"
                                        )}
                                    >
                                        {item.text}
                                    </span>
                                    {item.link && (
                                        <span className={`${TYPOGRAPHY.meta} text-[var(--admin-muted)] flex items-center gap-1`}>
                                            <ExternalLink size={10} />
                                            {item.link}
                                        </span>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <span
                                    className={cn(
                                        "text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 hidden sm:block",
                                        item.isActive
                                            ? "bg-green-500/15 text-green-400"
                                            : "bg-[var(--admin-text)]/10 text-[var(--admin-muted)]"
                                    )}
                                >
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleToggle(item)}
                                        className="p-1.5 rounded-md hover:bg-[var(--admin-text)]/10 transition-colors"
                                        title={item.isActive ? "Deactivate" : "Activate"}
                                    >
                                        {item.isActive ? (
                                            <EyeOff size={14} className="text-[var(--admin-muted)]" />
                                        ) : (
                                            <Eye size={14} className="text-green-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="p-1.5 rounded-md hover:bg-[var(--admin-text)]/10 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={14} className="text-[var(--admin-muted)]" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-1.5 rounded-md hover:bg-red-500/10 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} className="text-red-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editingItem ? "Edit Announcement" : "New Announcement"}
                subtitle="Displayed in the scrolling banner on the public homepage"
                footer={
                    <>
                        <Button variant="ghost" onClick={closeModal} disabled={saving}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            loading={saving}
                            icon={editingItem ? <Check size={14} /> : <Plus size={14} />}
                        >
                            {editingItem ? "Save Changes" : "Create"}
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Announcement Text"
                        placeholder='e.g. "Now Accepting Q2 2027 Projects — Limited Slots"'
                        value={form.text}
                        onChange={(e) => setForm(f => ({ ...f, text: e.target.value }))}
                        tooltip="The text displayed in the scrolling ticker on the homepage."
                    />

                    <Input
                        label="Link URL (Optional)"
                        placeholder="e.g. /contact or https://example.com"
                        value={form.link}
                        onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                        tooltip="If set, this item becomes clickable and navigates to this URL."
                    />

                    <div className="flex flex-col gap-1 md:gap-2">
                        <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase tracking-wide">
                            Icon
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ICON_OPTIONS.map((iconName) => (
                                <button
                                    key={iconName}
                                    onClick={() => setForm(f => ({ ...f, icon: iconName }))}
                                    className={cn(
                                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all border",
                                        form.icon === iconName
                                            ? "bg-gold/20 border-gold text-gold scale-110"
                                            : "admin-surface-input border-transparent text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-border)]"
                                    )}
                                    title={iconName}
                                >
                                    {renderIcon(iconName)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Highlight Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer group/toggle">
                            <button
                                onClick={() => setForm(f => ({ ...f, highlight: !f.highlight }))}
                                className={cn(
                                    "w-10 h-5 rounded-full transition-all flex items-center px-0.5",
                                    form.highlight
                                        ? "bg-gold justify-end"
                                        : "bg-[var(--admin-text)]/20 justify-start"
                                )}
                            >
                                <span className="w-4 h-4 bg-white rounded-full shadow transition-all" />
                            </button>
                            <span className="text-xs font-bold text-[var(--admin-text)] uppercase tracking-wide">
                                Highlight (Gold)
                            </span>
                        </label>

                        {/* Active Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer group/toggle">
                            <button
                                onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                                className={cn(
                                    "w-10 h-5 rounded-full transition-all flex items-center px-0.5",
                                    form.isActive
                                        ? "bg-green-500 justify-end"
                                        : "bg-[var(--admin-text)]/20 justify-start"
                                )}
                            >
                                <span className="w-4 h-4 bg-white rounded-full shadow transition-all" />
                            </button>
                            <span className="text-xs font-bold text-[var(--admin-text)] uppercase tracking-wide">
                                Active
                            </span>
                        </label>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={closeConfirm}
                onConfirm={confirmConfig.action}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmText="Delete"
                isDestructive
            />
        </PageContainer>
    );
}
