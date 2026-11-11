"use client";

import { AiSettingsForm } from "@/components/admin/ai/AiSettingsForm";
import { IdeaQueue } from "@/components/admin/ai/IdeaQueue";
import { TrendScout } from "@/components/admin/ai/TrendScout";
import { GenerateAiDraftModal } from "@/components/admin/ai/GenerateAiDraftModal";
import { PageContainer, PageHeader } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { Newspaper, Settings, Sparkles } from "lucide-react";
import { useState } from "react";

interface AiDashboardProps {
    initialSettings: any;
}

export function AiDashboardClient({ initialSettings }: AiDashboardProps) {
    const [activeTab, setActiveTab] = useState<"newsroom" | "queue" | "settings">("newsroom");
    const [showAiModal, setShowAiModal] = useState(false);

    return (
        <PageContainer>
            <PageHeader 
                title="AI Editorial Assistant" 
                subtitle="Automated trend discovery and drafting engine powered by Gemini 2.5 Flash."
                actions={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowAiModal(true)}
                            className="px-3.5 py-1.5 rounded-[8px] bg-gold text-primary-foreground font-black text-xs hover:bg-gold-hover transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap cursor-pointer"
                        >
                            <Sparkles size={14} />
                            <span>One-Click Draft</span>
                        </button>
                        <div className="admin-surface-secondary p-1 rounded-[8px] flex gap-1">
                        <button
                            onClick={() => setActiveTab("newsroom")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all",
                                activeTab === "newsroom" 
                                    ? "admin-surface-primary text-[var(--admin-text)] shadow-sm" 
                                    : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                            )}
                        >
                            <Sparkles size={14} />
                            Newsroom
                        </button>
                        <button
                            onClick={() => setActiveTab("queue")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all",
                                activeTab === "queue" 
                                    ? "admin-surface-primary text-[var(--admin-text)] shadow-sm" 
                                    : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                            )}
                        >
                            <Newspaper size={14} />
                            Queue
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all",
                                activeTab === "settings" 
                                    ? "admin-surface-primary text-[var(--admin-text)] shadow-sm" 
                                    : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                            )}
                        >
                            <Settings size={14} />
                            Config
                        </button>
                        </div>
                    </div>
                }
            />

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === "newsroom" && <TrendScout />}
                {activeTab === "queue" && <IdeaQueue />}
                {activeTab === "settings" && <AiSettingsForm initialSettings={initialSettings} />}
            </div>

            <GenerateAiDraftModal
                isOpen={showAiModal}
                onClose={() => setShowAiModal(false)}
            />
        </PageContainer>
    );
}
