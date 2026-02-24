"use client";

import { deleteSiteSetting, upsertSiteSetting } from "@/actions/site-settings";
import { useRole } from "@/components/admin/RoleContext";
import { RoleGate } from "@/components/admin/RoleGate";
import { useToast } from "@/components/admin/ui";
import { Button } from "@/components/admin/ui/Button";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Modal } from "@/components/admin/ui/Modal";
import { Select } from "@/components/admin/ui/Select";
import { Role } from "@prisma/client";
import { Globe, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface SiteSetting {
    id: string;
    key: string;
    value: string;
    type: string;
    category: string;
    isPublic: boolean;
    description: string | null;
}

interface SiteSettingsTabProps {
    initialSettings: SiteSetting[];
    categories: string[];
}

export function SiteSettingsTab({ initialSettings, categories }: SiteSettingsTabProps) {
    const router = useRouter();
    const { userRole } = useRole();
    const { success, error } = useToast();
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState<SiteSetting[]>(initialSettings);
    const [filterCategory, setFilterCategory] = useState("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");
    const [newCategory, setNewCategory] = useState("general");
    const [newIsPublic, setNewIsPublic] = useState(false);
    const [newDescription, setNewDescription] = useState("");

    // Editing state
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    
    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        action: () => void;
    }>({ isOpen: false, title: "", description: "", action: () => {} });

    const closeConfirm = () => setConfirmConfig(prev => ({ ...prev, isOpen: false }));

    const filtered = filterCategory === "all" ? settings : settings.filter(s => s.category === filterCategory);

    const handleAdd = () => {
        if (!newKey || !newValue) return;
        startTransition(async () => {
            try {
                await upsertSiteSetting({
                    key: newKey,
                    value: newValue,
                    category: newCategory,
                    isPublic: newIsPublic,
                    description: newDescription || undefined,
                });
                setIsAddOpen(false);
                setNewKey(""); setNewValue(""); setNewCategory("general"); setNewIsPublic(false); setNewDescription("");
                router.refresh();
            } catch (e: any) {
                error("Failed: " + e.message);
            }
        });
    };

    const handleSave = (key: string, type: string) => {
        startTransition(async () => {
            try {
                // Validate JSON if type is JSON
                if (type === 'JSON') {
                    try {
                        JSON.parse(editValue);
                    } catch (e) {
                        throw new Error("Invalid JSON format");
                    }
                }

                await upsertSiteSetting({ key, value: editValue });
                setEditingKey(null);
                router.refresh();
                success("Setting updated successfully");
            } catch (e: any) {
                error("Failed: " + e.message);
            }
        });
    };

    const handleDelete = (key: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Delete Setting",
            description: `Are you sure you want to permanently delete the setting "${key}"? This cannot be undone.`,
            action: async () => {
                closeConfirm();
                startTransition(async () => {
                    try {
                        await deleteSiteSetting(key);
                        setSettings(prev => prev.filter(s => s.key !== key));
                        router.refresh();
                        success("Setting deleted successfully");
                    } catch (e: any) {
                        error("Failed: " + e.message);
                    }
                });
            }
        });
    };

    const uniqueCategories = ["all", ...new Set(categories)];

    return (
        <div className="flex flex-col gap-3 md:gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Globe size={14} className="md:w-4 md:h-4" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm">Site Settings</h3>
                        <p className="text-[8px] md:text-xs text-[var(--admin-text)]/80">Key-value configuration for your site.</p>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* Category Filter */}
                    <Select 
                        value={filterCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCategory(e.target.value)}
                        options={uniqueCategories.map(c => ({
                            value: c,
                            label: c === "all" ? "All Categories" : c
                        }))}
                        className="w-auto min-w-[140px]"
                    />

                    <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                        <Button
                            variant="primary"
                            size="sm"
                            icon={<Plus size={12} />}
                            onClick={() => setIsAddOpen(true)}
                        >
                            Add Setting
                        </Button>
                    </RoleGate>
                </div>
            </div>

            {/* Settings List */}
            <div className="bg-white/30 dark:bg-black/60 shadow-lg backdrop-blur-xl rounded-[10px] overflow-hidden border border-[var(--admin-border)]">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-[var(--admin-text)]/60 italic text-xs">
                        No site settings found. Add one to get started.
                    </div>
                ) : (
                    filtered.map((setting) => (
                        <div key={setting.id} className="border-b border-[var(--admin-border)] last:border-0 p-3 md:p-4 hover:bg-[var(--admin-text)]/5 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold font-mono text-[var(--admin-text)]">{setting.key}</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded-[4px] admin-surface-input text-[var(--admin-muted)] border border-[var(--admin-border)] uppercase tracking-wider font-bold">{setting.category}</span>
                                        {setting.isPublic && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-green-500/40 text-green-400 border border-green-500/20 uppercase tracking-wider font-bold">public</span>
                                        )}
                                    </div>
                                    {setting.description && (
                                        <p className="text-[10px] text-[var(--admin-text)]/80 truncate font-medium">{setting.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {editingKey === setting.key ? (
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            {setting.type === 'JSON' ? (
                                                <textarea
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="admin-surface-input rounded-[6px] px-3 py-2 text-[var(--admin-text)] text-xs outline-none focus:border-gold/50 w-full md:min-w-[400px] font-mono"
                                                    rows={8}
                                                    autoFocus
                                                />
                                            ) : (
                                                <input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="admin-surface-input rounded-[6px] px-2 py-1 text-[var(--admin-text)] text-xs outline-none focus:border-gold/50 w-40 md:w-60"
                                                    autoFocus
                                                />
                                            )}
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleSave(setting.key, setting.type)}
                                                    disabled={isPending}
                                                    className="p-1.5 rounded-[6px] bg-green-500/40 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50 flex items-center gap-1 text-[10px] px-3 font-black uppercase tracking-widest border border-green-500/20"
                                                >
                                                    <Save size={12} /> Save
                                                </button>
                                                <button
                                                    onClick={() => setEditingKey(null)}
                                                    className="p-1.5 rounded-[6px] admin-surface-input text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors border border-[var(--admin-border)]"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {userRole === Role.SUPER_ADMIN ? (
                                                setting.type === 'JSON' ? (
                                                    <div 
                                                        onClick={() => { setEditingKey(setting.key); setEditValue(setting.value); }}
                                                        className="text-[10px] font-mono text-[var(--admin-text)]/80 admin-surface-input px-3 py-2 rounded-[6px] cursor-pointer hover:bg-[var(--admin-text)]/10 hover:text-gold transition-colors max-w-[300px] whitespace-pre-wrap break-all border border-[var(--admin-border)]"
                                                        title="Click to edit raw JSON"
                                                     >
                                                        {setting.value.substring(0, 100) + (setting.value.length > 100 ? "..." : "")}
                                                     </div>
                                                ) : (
                                                    <span
                                                        onClick={() => { setEditingKey(setting.key); setEditValue(setting.value); }}
                                                        className="text-xs font-mono text-[var(--admin-text)]/80 admin-surface-input px-3 py-1.5 rounded-[6px] cursor-pointer hover:bg-[var(--admin-text)]/10 hover:text-gold transition-colors max-w-[200px] truncate border border-[var(--admin-border)]"
                                                        title="Click to edit"
                                                    >
                                                        {setting.value}
                                                    </span>
                                                )
                                            ) : (
                                                <span
                                                    className="text-xs font-mono text-[var(--admin-text)]/60 admin-surface-input px-3 py-1.5 rounded-[6px] max-w-[200px] truncate cursor-default border border-[var(--admin-border)]"
                                                    title={setting.value}
                                                >
                                                    {setting.value}
                                                </span>
                                            )}
                                            <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                                                <button
                                                    onClick={() => handleDelete(setting.key)}
                                                    disabled={isPending}
                                                    className="p-1.5 rounded-[6px] text-red-400/60 hover:bg-red-500/40 hover:text-red-400 transition-colors disabled:opacity-50 hover:border hover:border-red-500/20"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </RoleGate>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Modal */}
            <Modal
                open={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="New Site Setting"
                footer={
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={handleAdd} disabled={!newKey || !newValue} loading={isPending}>Create</Button>
                    </>
                }
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest mb-1.5 block">Key</label>
                        <input value={newKey} onChange={(e) => setNewKey(e.target.value)} placeholder="SITE_NAME" className="w-full admin-surface-input rounded-[10px] px-4 py-3 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 font-mono border border-[var(--admin-border)]" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest mb-1.5 block">Value</label>
                        <textarea value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Xinteck" rows={3} className="w-full admin-surface-input rounded-[10px] px-4 py-3 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 resize-none border border-[var(--admin-border)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest mb-1.5 block">Category</label>
                            <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full admin-surface-input rounded-[10px] px-4 py-3 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 border border-[var(--admin-border)]" />
                        </div>
                        <div className="flex flex-col gap-2 justify-end">
                            <label className="flex items-center gap-2 cursor-pointer h-[46px] px-3 rounded-[10px] admin-surface-input border border-[var(--admin-border)] hover:border-gold/30 transition-colors">
                                <input type="checkbox" checked={newIsPublic} onChange={(e) => setNewIsPublic(e.target.checked)} className="w-4 h-4 rounded border-primary/20 accent-gold" />
                                <span className="text-xs text-[var(--admin-text)] font-bold">Public Setting</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest mb-1.5 block">Description (optional)</label>
                        <input value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Brief description..." className="w-full admin-surface-input rounded-[10px] px-4 py-3 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 border border-[var(--admin-border)]" />
                    </div>
                </div>
            </Modal>

            <ConfirmModal
              isOpen={confirmConfig.isOpen}
              onClose={closeConfirm}
              onConfirm={confirmConfig.action}
              title={confirmConfig.title}
              description={confirmConfig.description}
              confirmText="Delete Setting"
              isDestructive={true}
            />
        </div>
    );
}
