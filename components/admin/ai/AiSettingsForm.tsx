"use client";

import { generateExclusions, updateAiSettings } from "@/actions/ai";
import { CORE_NICHES, SECONDARY_NICHES } from "@/lib/ai/config";
import { Info, Loader2, Plus, Save, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SettingsProps {
    initialSettings: any;
}

export function AiSettingsForm({ initialSettings }: SettingsProps) {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        targetNiches: initialSettings?.targetNiches || [],
        brandVoice: initialSettings?.brandVoice || "Professional, Authoritative, Elite",
        excludedKeywords: initialSettings?.excludedKeywords || [],
    });

    const [newNiche, setNewNiche] = useState("");
    const [newExclusion, setNewExclusion] = useState("");
    
    // AI Suggestions State
    const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<{keyword: string, reasoning: string}[]>([]);

    const availableNiches = [...CORE_NICHES, ...SECONDARY_NICHES].filter(
        n => !settings.targetNiches.includes(n)
    );

    const handleAddNiche = (niche: string) => {
        if (!settings.targetNiches.includes(niche)) {
            setSettings({ ...settings, targetNiches: [...settings.targetNiches, niche] });
        }
    };

    const handleRemoveNiche = (niche: string) => {
        setSettings({ ...settings, targetNiches: settings.targetNiches.filter((n: string) => n !== niche) });
    };

    const handleAddExclusion = () => {
        if (newExclusion && !settings.excludedKeywords.includes(newExclusion)) {
            setSettings({ ...settings, excludedKeywords: [...settings.excludedKeywords, newExclusion] });
            setNewExclusion("");
        }
    };

    const handleRemoveExclusion = (kw: string) => {
        setSettings({ ...settings, excludedKeywords: settings.excludedKeywords.filter((k: string) => k !== kw) });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await updateAiSettings(settings);
            toast.success("AI Configuration Saved");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateExclusions = async () => {
        if (settings.targetNiches.length === 0) {
            toast.error("Please add target niches and save config first.");
            return;
        }
        setGeneratingSuggestions(true);
        toast.info("AI is analyzing your business profile...");
        try {
            const result = await generateExclusions();
            // Filter out ones already excluded
            const filtered = result.filter(r => !settings.excludedKeywords.includes(r.keyword));
            setSuggestions(filtered);
            if (filtered.length === 0) toast.info("No new exclusions suggested.");
            else toast.success("AI generated targeted exclusions.");
        } catch (error: any) {
            toast.error(error.message || "Failed to generate suggestions.");
        } finally {
            setGeneratingSuggestions(false);
        }
    };

    const handleAcceptSuggestion = (sug: { keyword: string, reasoning: string }) => {
        if (!settings.excludedKeywords.includes(sug.keyword)) {
            setSettings({ ...settings, excludedKeywords: [...settings.excludedKeywords, sug.keyword] });
            setSuggestions(suggestions.filter(s => s.keyword !== sug.keyword));
        }
    };

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Guide Card */}
            <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start border border-[var(--admin-border)]">
                <div className="w-12 h-12 shrink-0 rounded-[10px] bg-gold/10 text-gold flex items-center justify-center">
                    <Info size={24} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--admin-text)] mb-2">How the AI Engine Works</h3>
                    <p className="text-[var(--admin-text)] text-sm leading-relaxed mb-4 max-w-3xl">
                        The AI Editorial Assistant automates the research and drafting phases of content marketing. It is deeply integrated with Xinteck's business profile to ensure high-quality output.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="admin-surface-secondary p-4 rounded-[8px]">
                            <span className="font-bold text-[var(--admin-text)] text-sm block mb-1">1. Configure</span>
                            <span className="text-[var(--admin-text)] text-xs">Set your target niches and tone below. This controls what the AI searches for.</span>
                        </div>
                        <div className="admin-surface-secondary p-4 rounded-[8px]">
                            <span className="font-bold text-[var(--admin-text)] text-sm block mb-1">2. Newsroom</span>
                            <span className="text-[var(--admin-text)] text-xs">Run the 'Scout' to scan the web for trending ideas. Approve the best ones.</span>
                        </div>
                        <div className="admin-surface-secondary p-4 rounded-[8px]">
                            <span className="font-bold text-[var(--admin-text)] text-sm block mb-1">3. Queue</span>
                            <span className="text-[var(--admin-text)] text-xs">Generate full 700-1000 word drafts from approved ideas with one click.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Niches */}
            <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6">
                <h3 className="text-[var(--admin-text)] font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50 mb-4">Target Niches</h3>
                <p className="text-[var(--admin-text)] text-sm mb-6 max-w-2xl">
                    Select the engineering domains the AI should focus on. These drive the trend scouting engine.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {settings.targetNiches.map((niche: string) => (
                        <span key={niche} className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-xs font-bold flex items-center gap-2">
                            {niche}
                            <button onClick={() => handleRemoveNiche(niche)} className="hover:text-[var(--admin-text)] transition-colors"><X size={12} /></button>
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableNiches.map(niche => (
                        <button 
                            key={niche}
                            onClick={() => handleAddNiche(niche)}
                            className="px-3 py-2 text-left admin-surface-input rounded-[8px] text-xs md:text-sm text-[var(--admin-text)] hover:text-white transition-colors flex items-center justify-between group border border-transparent hover:border-[var(--admin-border)]"
                        >
                            {niche}
                            <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Brand Voice */}
            <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6">
                <h3 className="text-[var(--admin-text)] font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-purple-500/50 mb-4">Brand Voice & Tone</h3>
                <p className="text-[var(--admin-text)] text-sm mb-4">
                    Describe how the AI should write. Be specific about the persona (e.g., "Senior Engineer", "CTO").
                </p>
                <textarea 
                    value={settings.brandVoice}
                    onChange={(e) => setSettings({ ...settings, brandVoice: e.target.value })}
                    className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] p-4 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 min-h-[120px] transition-colors placeholder:text-[var(--admin-muted)]/50 resize-y"
                    placeholder="E.g. Professional, authoritative, yet accessible..."
                />
            </div>

            {/* Exclusions */}
            <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6">
                <h3 className="text-[var(--admin-text)] font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-red-500/50 mb-4">Excluded Topics/Keywords</h3>
                <p className="text-[var(--admin-text)] text-sm mb-4">
                    Terms the AI is strictly forbidden from using (competitors, cheap words, etc).
                </p>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        type="text" 
                        value={newExclusion}
                        onChange={(e) => setNewExclusion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddExclusion()}
                        placeholder="Add exclusion..."
                        className="flex-1 admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-4 py-2 text-[var(--admin-text)] text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-muted)]/50"
                    />
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleAddExclusion(); }} 
                        className="bg-white text-black px-4 rounded-[8px] hover:bg-neutral-200 transition-colors flex items-center justify-center"
                        title="Add Manual Exclusion"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleGenerateExclusions(); }} 
                        disabled={generatingSuggestions}
                        className="bg-gold text-primary-foreground px-4 rounded-[8px] hover:opacity-80 transition-opacity font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {generatingSuggestions ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16}/>}
                        <span className="hidden md:inline">Auto-Suggest</span>
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {settings.excludedKeywords.map((kw: string) => (
                        <span key={kw} className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold flex items-center gap-2">
                            {kw}
                            <button onClick={() => handleRemoveExclusion(kw)} className="hover:text-red-200 transition-colors"><X size={12} /></button>
                        </span>
                    ))}
                </div>
            </div>

            {/* AI Suggestions Card */}
            {suggestions.length > 0 && (
                <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6 !mt-6">
                    <h3 className="text-[var(--admin-text)] font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50 mb-4">AI Suggested Exclusions</h3>
                    <p className="text-[var(--admin-text)] text-sm mb-6 max-w-2xl">
                        Based on your business profile and selected niches, the AI recommends explicitly blacklisting these topics to protect your premium brand authority.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {suggestions.map((s, idx) => (
                            <AiExclusionSuggestionCard 
                                key={idx} 
                                suggestion={s} 
                                onAdd={() => handleAcceptSuggestion(s)} 
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end pb-12">
                <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-gold text-primary-foreground font-bold text-sm rounded-[10px] hover:bg-[var(--admin-text)] hover:text-[var(--admin-background)] transition-colors disabled:opacity-50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Configuration
                </button>
            </div>
        </div>
    );
}

function AiExclusionSuggestionCard({ suggestion, onAdd }: { suggestion: { keyword: string; reasoning: string }, onAdd: () => void }) {
    const [showReason, setShowReason] = useState(false);
    return (
        <div className="admin-surface-secondary border border-[var(--admin-border)] rounded-[12px] p-4 flex flex-col gap-3 group hover:border-gold/30 transition-colors">
            <div className="flex justify-between items-start gap-4">
                <span className="font-bold text-[var(--admin-text)] text-sm break-words flex-1 mt-1">{suggestion.keyword}</span>
                <div className="flex gap-2 shrink-0">
                    <button 
                        onClick={() => setShowReason(!showReason)} 
                        className="text-[10px] uppercase font-bold text-[var(--admin-text)] bg-blue-500/20 px-3 py-1.5 rounded-[6px] hover:bg-blue-600 hover:text-white transition-colors"
                    >
                        {showReason ? "Hide Reason" : "Tell Me Why"}
                    </button>
                    <button 
                        onClick={onAdd} 
                        className="text-[10px] uppercase font-bold text-[var(--admin-text)] bg-green-500/20 px-3 py-1.5 rounded-[6px] hover:bg-green-600 hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Plus size={12} /> Add
                    </button>
                </div>
            </div>
            {showReason && (
                 <p className="text-[var(--admin-text)]/80 text-xs italic border-l-2 border-blue-500/50 pl-3 py-1 mt-1 bg-blue-500/5 rounded-r-[4px]">
                     {suggestion.reasoning}
                 </p>
            )}
        </div>
    );
}
