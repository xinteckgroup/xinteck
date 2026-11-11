"use client";

import { generateExclusions, updateAiSettings } from "@/actions/ai";
import { useToast } from "@/components/admin/ui/Toast";
import { GenerateAiDraftModal } from "@/components/admin/ai/GenerateAiDraftModal";
import {
  CORE_NICHES,
  NICHE_CATEGORIES,
  SECONDARY_NICHES,
} from "@/lib/ai/config";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Compass,
  Info,
  Layers,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
  UserCheck,
  Wand2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface SettingsProps {
  initialSettings: any;
}

// Preset personas with pre-crafted instructions tailored for Kenyan engineering authority
const VOICE_PRESETS = [
  {
    id: "senior-engineer-ke",
    title: "Kenyan Senior Engineer",
    badge: "Recommended",
    subtitle: "Simple words, elite technical depth, 100% Kenya context",
    prompt:
      "Professional, Authoritative, Elite, Interesting, Senior Engineer. Use simple easily understandable words without academic jargon. Make sure to fully focus on the Kenyan tech today in all aspects (Daraja M-Pesa STK push & callbacks, KRA eTIMS fiscalization, Safaricom network latencies, offline-first mobile UX on budget devices, and measurable business ROI).",
  },
  {
    id: "pragmatic-cto",
    title: "Pragmatic CTO",
    badge: "Executive",
    subtitle: "Commercial focus, tech debt elimination, board-ready ROI",
    prompt:
      "Pragmatic CTO & Technical Strategist. Direct, authoritative, commercial, and actionable. Focuses on tech debt elimination, cost-effective cloud rightsizing, local compliance risk mitigation, and executive decision-making for Kenyan businesses.",
  },
  {
    id: "solutions-architect",
    title: "Principal Solutions Architect",
    badge: "Deep Tech",
    subtitle: "System design, distributed ledgers, high-concurrency scaling",
    prompt:
      "Elite Solutions Architect. High standards, visionary, yet deeply grounded in real production engineering. Explains complex distributed systems, high-concurrency ledger pipelines, and zero-downtime deployments using clear, grounded analogies.",
  },
];

const VOICE_ATTRIBUTES = [
  {
    label: "Senior Engineer Persona",
    snippet: " Written from the perspective of an experienced Senior Engineer.",
  },
  {
    label: "Plain, Accessible Words",
    snippet:
      " Explain concepts in simple, jargon-free words that any business leader can understand.",
  },
  {
    label: "Kenyan Tech Reality",
    snippet:
      " Strictly ground all examples in modern Kenyan tech realities (Daraja M-Pesa, KRA eTIMS, mobile networks, ODPC compliance).",
  },
  {
    label: "Direct Business ROI",
    snippet:
      " Relate every technical architectural decision back to measurable business ROI and operational efficiency.",
  },
  {
    label: "No Generic Fluff",
    snippet:
      " Avoid generic beginner tutorials and filler. Focus on production-grade engineering choices and trade-offs.",
  },
];

export function AiSettingsForm({ initialSettings }: SettingsProps) {
  const { success, error, info } = useToast();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    targetNiches: (initialSettings?.targetNiches && initialSettings.targetNiches.length > 0)
      ? initialSettings.targetNiches
      : [
          "Scalable Web Architecture",
          "Enterprise Mobile Engineering",
          "Custom Software Strategy",
          "UX Systems & Product Design",
          "Cloud Infrastructure & DevOps",
          "Kenyan Fintech & M-Pesa Rails",
          "KRA eTIMS & Tax Tech Compliance",
        ],
    brandVoice:
      initialSettings?.brandVoice ||
      "Professional, Authoritative, Elite, Interesting, Senior Engineer. Use simple easily understandable words without academic jargon. Make sure to fully focus on the Kenyan tech today in all aspects (Daraja M-Pesa STK push & callbacks, KRA eTIMS fiscalization, Safaricom network latencies, offline-first mobile UX on budget devices, and measurable business ROI).",
    excludedKeywords: initialSettings?.excludedKeywords || [],
  });

  // Niches management state
  const [newNiche, setNewNiche] = useState("");
  const [nicheSearch, setNicheSearch] = useState("");
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [showDraftModal, setShowDraftModal] = useState(false);

  // Exclusions state
  const [newExclusion, setNewExclusion] = useState("");
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { keyword: string; reasoning: string }[]
  >([]);

  // Collect all known default niches across categories
  const allCatalogNiches = useMemo(() => {
    const list: { name: string; categoryId: string; categoryName: string }[] = [];
    NICHE_CATEGORIES.forEach((cat) => {
      cat.niches.forEach((niche) => {
        list.push({
          name: niche,
          categoryId: cat.id,
          categoryName: cat.name,
        });
      });
    });
    return list;
  }, []);

  // Filter catalog based on active tab and search query
  const filteredCatalogNiches = useMemo(() => {
    return allCatalogNiches.filter((item) => {
      const matchesCategory =
        activeCategoryTab === "all" || item.categoryId === activeCategoryTab;
      const matchesSearch =
        nicheSearch.trim() === "" ||
        item.name.toLowerCase().includes(nicheSearch.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(nicheSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allCatalogNiches, activeCategoryTab, nicheSearch]);

  // Distinguish custom niches added by user that are not in catalog
  const customActiveNiches = useMemo(() => {
    const catalogNames = new Set(allCatalogNiches.map((n) => n.name));
    return settings.targetNiches.filter((n: string) => !catalogNames.has(n));
  }, [settings.targetNiches, allCatalogNiches]);

  // Toggle niche on/off
  const handleToggleNiche = (niche: string) => {
    if (settings.targetNiches.includes(niche)) {
      setSettings((prev) => ({
        ...prev,
        targetNiches: prev.targetNiches.filter((n: string) => n !== niche),
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        targetNiches: [...prev.targetNiches, niche],
      }));
    }
  };

  // Add custom niche
  const handleAddCustomNiche = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newNiche.trim();
    if (!clean) return;

    if (settings.targetNiches.some((n: string) => n.toLowerCase() === clean.toLowerCase())) {
      info("This niche is already in your active target list.");
      setNewNiche("");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      targetNiches: [...prev.targetNiches, clean],
    }));
    setNewNiche("");
    success(`Added custom domain: "${clean}"`);
  };

  // Preset loaders for Niches
  const handleApplyNichePreset = (presetType: "all" | "kenya" | "enterprise" | "clear") => {
    if (presetType === "clear") {
      setSettings((prev) => ({ ...prev, targetNiches: [] }));
      info("Cleared all target niches.");
      return;
    }

    if (presetType === "all") {
      const allDefaults = Array.from(new Set(allCatalogNiches.map((n) => n.name)));
      setSettings((prev) => ({
        ...prev,
        targetNiches: allDefaults,
      }));
      success("Loaded all 13 catalog domains.");
      return;
    }

    if (presetType === "kenya") {
      const kenyaCat = NICHE_CATEGORIES.find((c) => c.id === "kenya");
      const coreWebMobile = ["Scalable Web Architecture", "Enterprise Mobile Engineering", "Custom Software Strategy"];
      const combined = Array.from(new Set([...(kenyaCat?.niches || []), ...coreWebMobile]));
      setSettings((prev) => ({
        ...prev,
        targetNiches: combined,
      }));
      success("Loaded Kenyan Tech & Enterprise Rails preset.");
      return;
    }

    if (presetType === "enterprise") {
      const entCat = NICHE_CATEGORIES.find((c) => c.id === "enterprise");
      const coreCat = NICHE_CATEGORIES.find((c) => c.id === "core");
      const combined = Array.from(new Set([...(coreCat?.niches || []), ...(entCat?.niches || [])]));
      setSettings((prev) => ({
        ...prev,
        targetNiches: combined,
      }));
      success("Loaded Core Enterprise Architecture preset.");
    }
  };

  // Voice Persona Presets
  const handleApplyVoicePreset = (preset: typeof VOICE_PRESETS[0]) => {
    setSettings((prev) => ({
      ...prev,
      brandVoice: preset.prompt,
    }));
    success(`Applied voice preset: ${preset.title}`);
  };

  // Append attribute chip to voice
  const handleAppendVoiceAttribute = (snippet: string) => {
    setSettings((prev) => {
      const current = prev.brandVoice.trim();
      if (current.includes(snippet.trim())) {
        return prev;
      }
      return {
        ...prev,
        brandVoice: current ? `${current}${snippet}` : snippet.trim(),
      };
    });
  };

  // Exclusions management
  const handleAddExclusion = () => {
    const clean = newExclusion.trim();
    if (clean && !settings.excludedKeywords.includes(clean)) {
      setSettings((prev) => ({
        ...prev,
        excludedKeywords: [...prev.excludedKeywords, clean],
      }));
      setNewExclusion("");
    }
  };

  const handleRemoveExclusion = (kw: string) => {
    setSettings((prev) => ({
      ...prev,
      excludedKeywords: prev.excludedKeywords.filter((k: string) => k !== kw),
    }));
  };

  const handleSave = async () => {
    if (settings.targetNiches.length === 0) {
      error("Please select at least 1 target niche before saving.");
      return;
    }

    setLoading(true);
    try {
      await updateAiSettings(settings);
      success("AI Editorial Configuration successfully saved!");
    } catch (err: any) {
      error(err.message || "Failed to save AI settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndGenerate = async () => {
    if (settings.targetNiches.length === 0) {
      error("Please select at least 1 target niche before generating.");
      return;
    }

    setLoading(true);
    try {
      await updateAiSettings(settings);
      success("Settings saved! Launching draft generator...");
      setShowDraftModal(true);
    } catch (err: any) {
      error(err.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateExclusions = async () => {
    if (settings.targetNiches.length === 0) {
      error("Please add target niches and save config first.");
      return;
    }
    setGeneratingSuggestions(true);
    info("AI is analyzing your business profile...");
    try {
      const result = await generateExclusions();
      const filtered = result.filter(
        (r) => !settings.excludedKeywords.includes(r.keyword)
      );
      setSuggestions(filtered);
      if (filtered.length === 0) info("No new exclusions suggested.");
      else success("AI generated targeted exclusions.");
    } catch (err: any) {
      error(err.message || "Failed to generate suggestions.");
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const handleAcceptSuggestion = (sug: { keyword: string; reasoning: string }) => {
    if (!settings.excludedKeywords.includes(sug.keyword)) {
      setSettings((prev) => ({
        ...prev,
        excludedKeywords: [...prev.excludedKeywords, sug.keyword],
      }));
      setSuggestions((prev) => prev.filter((s) => s.keyword !== sug.keyword));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Editorial Overview Card */}
      <div className="admin-surface-primary backdrop-blur-xs rounded-[12px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start border border-[var(--admin-border)] shadow-sm">
        <div className="w-12 h-12 shrink-0 rounded-[10px] bg-gold/30 text-gold flex items-center justify-center">
          <Sparkles size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[var(--admin-text)] mb-2">
            AI Editorial Intelligence Engine
          </h3>
          <p className="text-[var(--admin-text)]/80 text-sm leading-relaxed mb-4 max-w-3xl">
            Configure how Gemini 2.5 Flash discovers trends and authors production-grade blog drafts. The settings below control the editorial scope, technical domains, and writing persona.
          </p>
          <div className="grid sm:grid-cols-3 gap-3.5">
            <div className="admin-surface-secondary p-3.5 rounded-[8px] border border-[var(--admin-border)]">
              <span className="font-bold text-[var(--admin-text)] text-xs uppercase tracking-wider block mb-1 text-gold">
                1. Domain Scope
              </span>
              <span className="text-[var(--admin-muted)] text-xs leading-relaxed">
                Niches drive Google search queries in the automated Trend Scout.
              </span>
            </div>
            <div className="admin-surface-secondary p-3.5 rounded-[8px] border border-[var(--admin-border)]">
              <span className="font-bold text-[var(--admin-text)] text-xs uppercase tracking-wider block mb-1 text-gold">
                2. Voice & Persona
              </span>
              <span className="text-[var(--admin-muted)] text-xs leading-relaxed">
                Directs the tone, technical depth, and Kenyan market perspective.
              </span>
            </div>
            <div className="admin-surface-secondary p-3.5 rounded-[8px] border border-[var(--admin-border)]">
              <span className="font-bold text-[var(--admin-text)] text-xs uppercase tracking-wider block mb-1 text-gold">
                3. Negative Guardrails
              </span>
              <span className="text-[var(--admin-muted)] text-xs leading-relaxed">
                Excludes commoditized buzzwords, beginner tutorials, and competitor noise.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Action Banner */}
      <div className="p-4 md:p-5 rounded-[12px] bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border border-gold/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 border border-gold/30">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs md:text-sm font-black text-[var(--admin-text)]">
              One-Click Draft Generator
            </h4>
            <p className="text-[11px] md:text-xs text-[var(--admin-muted)]">
              Instantly generate an unapproved 800+ word technical draft based on your active settings. Review and inspect it before publishing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDraftModal(true)}
          className="px-5 py-2.5 bg-gold text-primary-foreground font-black text-xs md:text-sm rounded-[8px] hover:bg-gold-hover transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap cursor-pointer shrink-0"
        >
          <Sparkles size={15} />
          <span>Generate AI Draft Now</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: TARGET NICHES (UPGRADED)
          ══════════════════════════════════════════════════════════════ */}
      <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        {/* Header & Status Indicator */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <h3 className="text-[var(--admin-text)] font-black text-sm uppercase tracking-wider">
                Target Engineering Niches
              </h3>
            </div>
            <p className="text-[var(--admin-text)]/70 text-xs md:text-sm">
              Select or create the technology and business domains the AI scouts for.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold">
              <Layers size={14} />
              <span>{settings.targetNiches.length} Active Domains</span>
            </div>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-[10px] bg-black/20 dark:bg-black/40 border border-[var(--admin-border)] text-xs">
          <div className="flex items-center gap-2 text-[var(--admin-muted)]">
            <Wand2 size={14} className="text-gold" />
            <span className="font-semibold text-[var(--admin-text)]">Quick Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleApplyNichePreset("kenya")}
              className="px-3 py-1.5 rounded-[6px] bg-gold/20 hover:bg-gold/30 text-gold font-bold transition-all border border-gold/30"
            >
              🇰🇪 Kenyan Tech & Rails
            </button>
            <button
              type="button"
              onClick={() => handleApplyNichePreset("enterprise")}
              className="px-3 py-1.5 rounded-[6px] admin-surface-secondary hover:bg-neutral-800 text-[var(--admin-text)] font-medium transition-all border border-[var(--admin-border)]"
            >
              🏢 Enterprise Architecture
            </button>
            <button
              type="button"
              onClick={() => handleApplyNichePreset("all")}
              className="px-3 py-1.5 rounded-[6px] admin-surface-secondary hover:bg-neutral-800 text-[var(--admin-text)] font-medium transition-all border border-[var(--admin-border)]"
            >
              Select All (13)
            </button>
            <button
              type="button"
              onClick={() => handleApplyNichePreset("clear")}
              className="px-2.5 py-1.5 rounded-[6px] text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Custom Niche Creator & Search Input */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Add Custom Niche */}
          <form onSubmit={handleAddCustomNiche} className="flex gap-2">
            <input
              type="text"
              value={newNiche}
              onChange={(e) => setNewNiche(e.target.value)}
              placeholder="Create custom niche (e.g., HealthTech Portals)..."
              className="flex-1 admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-3.5 py-2.5 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-muted)]/50"
            />
            <button
              type="submit"
              disabled={!newNiche.trim()}
              className="px-4 py-2.5 bg-gold text-primary-foreground font-bold text-xs rounded-[8px] hover:bg-gold-hover transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          </form>

          {/* Search Filter */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]"
            />
            <input
              type="text"
              value={nicheSearch}
              onChange={(e) => setNicheSearch(e.target.value)}
              placeholder="Filter catalog niches..."
              className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] pl-10 pr-3.5 py-2.5 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-muted)]/50"
            />
            {nicheSearch && (
              <button
                type="button"
                onClick={() => setNicheSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Active Selected Niches Box */}
        <div className="p-4 md:p-5 rounded-[10px] bg-black/15 dark:bg-black/30 border border-gold/25 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-bold text-gold uppercase tracking-wider">
            <span>Currently Active Niches for AI Scouting</span>
            <span className="text-[var(--admin-muted)] lowercase font-normal">
              click X to remove
            </span>
          </div>

          {settings.targetNiches.length === 0 ? (
            <div className="py-6 text-center text-xs text-[var(--admin-muted)] flex flex-col items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              <span>No niches currently selected. The AI will not know what topics to scout.</span>
              <button
                type="button"
                onClick={() => handleApplyNichePreset("kenya")}
                className="mt-1 text-gold hover:underline font-bold"
              >
                Click here to load the Kenyan Tech & Rails preset
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {settings.targetNiches.map((niche: string) => {
                const isCustom = customActiveNiches.includes(niche);
                return (
                  <span
                    key={niche}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 hover:bg-gold/30 text-gold border border-gold/30 text-xs font-bold transition-all shadow-xs"
                  >
                    {isCustom && (
                      <span className="px-1.5 py-0.2 rounded-sm bg-gold/40 text-[9px] uppercase tracking-wider">
                        Custom
                      </span>
                    )}
                    <span>{niche}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleNiche(niche)}
                      className="text-gold/70 group-hover:text-gold hover:bg-gold/30 rounded-full p-0.5 transition-colors"
                      title="Remove niche"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Categorized Niches Catalog */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
              Curated Domain Catalog
            </span>
            <div className="flex gap-1 bg-black/20 p-1 rounded-[8px] border border-[var(--admin-border)]">
              <button
                type="button"
                onClick={() => setActiveCategoryTab("all")}
                className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold transition-all ${
                  activeCategoryTab === "all"
                    ? "bg-gold text-primary-foreground shadow-xs"
                    : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                }`}
              >
                All
              </button>
              {NICHE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryTab(cat.id)}
                  className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold transition-all ${
                    activeCategoryTab === cat.id
                      ? "bg-gold text-primary-foreground shadow-xs"
                      : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredCatalogNiches.map((item) => {
              const isSelected = settings.targetNiches.includes(item.name);
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleToggleNiche(item.name)}
                  className={`p-3 rounded-[8px] text-left transition-all border flex items-center justify-between group ${
                    isSelected
                      ? "bg-gold/15 border-gold text-gold font-bold shadow-xs"
                      : "admin-surface-input border-[var(--admin-border)] text-[var(--admin-text)] hover:border-gold/40 hover:bg-neutral-800/40"
                  }`}
                >
                  <div className="flex flex-col gap-0.5 pr-2">
                    <span className="text-xs md:text-sm leading-tight">{item.name}</span>
                    <span className="text-[10px] text-[var(--admin-muted)]">{item.categoryName}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isSelected
                        ? "bg-gold text-primary-foreground"
                        : "bg-white/10 text-white/50 group-hover:bg-gold/30 group-hover:text-gold"
                    }`}
                  >
                    {isSelected ? <Check size={13} strokeWidth={3} /> : <Plus size={13} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: BRAND VOICE & TONE (UPGRADED)
          ══════════════════════════════════════════════════════════════ */}
      <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6 md:p-8 flex flex-col gap-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <h3 className="text-[var(--admin-text)] font-black text-sm uppercase tracking-wider">
                Brand Voice, Tone & Persona
              </h3>
            </div>
            <p className="text-[var(--admin-text)]/70 text-xs md:text-sm">
              Define the AI persona and writing guidelines for article drafts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--admin-muted)]">
            <UserCheck size={14} className="text-purple-400" />
            <span>Persona Model: Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* 1-Click Persona Cards */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Pre-Crafted Editorial Personas
          </span>

          <div className="grid md:grid-cols-3 gap-3">
            {VOICE_PRESETS.map((preset) => {
              const isSelected = settings.brandVoice.trim() === preset.prompt.trim();
              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyVoicePreset(preset)}
                  className={`p-4 rounded-[10px] cursor-pointer transition-all border flex flex-col justify-between gap-3 ${
                    isSelected
                      ? "bg-purple-500/10 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-500/30"
                      : "admin-surface-secondary border-[var(--admin-border)] hover:border-purple-500/40 text-[var(--admin-text)]"
                  }`}
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs md:text-sm text-[var(--admin-text)]">
                        {preset.title}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          preset.badge === "Recommended"
                            ? "bg-gold/20 text-gold border border-gold/30"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--admin-muted)] leading-relaxed">
                      {preset.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--admin-border)]">
                    <span className="text-[11px] font-bold text-purple-400">
                      {isSelected ? "Active Persona" : "Apply Preset"}
                    </span>
                    {isSelected && <CheckCircle2 size={15} className="text-purple-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Directive Attribute Chips */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
            Quick Directives (Click to Append to Voice Prompt)
          </span>

          <div className="flex flex-wrap gap-2">
            {VOICE_ATTRIBUTES.map((attr) => (
              <button
                key={attr.label}
                type="button"
                onClick={() => handleAppendVoiceAttribute(attr.snippet)}
                className="px-3 py-1.5 rounded-[6px] admin-surface-secondary hover:bg-purple-500/20 text-[var(--admin-text)] hover:text-purple-300 text-xs font-medium border border-[var(--admin-border)] hover:border-purple-500/40 transition-all flex items-center gap-1.5"
              >
                <Plus size={12} />
                <span>{attr.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Editor */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-[var(--admin-muted)]">
            <span className="font-bold uppercase tracking-wider text-[var(--admin-text)]">
              System Voice Prompt
            </span>
            <span>{settings.brandVoice.length} characters</span>
          </div>

          <textarea
            value={settings.brandVoice}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, brandVoice: e.target.value }))
            }
            className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] p-4 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-purple-500/60 min-h-[140px] transition-colors placeholder:text-[var(--admin-muted)]/50 resize-y leading-relaxed font-sans"
            placeholder="Describe the persona, technical tone, simplicity, and Kenyan market context..."
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: EXCLUDED TOPICS & AI SUGGESTIONS
          ══════════════════════════════════════════════════════════════ */}
      <div className="admin-surface-primary backdrop-blur-xs border border-[var(--admin-border)] rounded-[12px] p-6 md:p-8 flex flex-col gap-5 shadow-sm">
        <div className="border-b border-[var(--admin-border)] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <h3 className="text-[var(--admin-text)] font-black text-sm uppercase tracking-wider">
              Excluded Topics & Blacklist
            </h3>
          </div>
          <p className="text-[var(--admin-text)]/70 text-xs md:text-sm">
            Keywords and concepts the AI is strictly forbidden from drafting about.
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newExclusion}
            onChange={(e) => setNewExclusion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddExclusion()}
            placeholder="Add keyword to exclude (e.g., WordPress, free template)..."
            className="flex-1 admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-4 py-2.5 text-[var(--admin-text)] text-xs md:text-sm outline-none focus:border-red-500/50 transition-colors placeholder:text-[var(--admin-muted)]/50"
          />
          <button
            type="button"
            onClick={handleAddExclusion}
            disabled={!newExclusion.trim()}
            className="px-4 py-2.5 bg-neutral-200 dark:bg-white text-black font-bold text-xs rounded-[8px] hover:bg-white transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-40"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={handleGenerateExclusions}
            disabled={generatingSuggestions}
            className="px-4 py-2.5 bg-gold text-primary-foreground font-bold text-xs rounded-[8px] hover:bg-gold-hover transition-opacity flex items-center gap-2 disabled:opacity-50 shrink-0"
          >
            {generatingSuggestions ? (
              <Loader2 className="animate-spin" size={15} />
            ) : (
              <Sparkles size={15} />
            )}
            <span className="hidden sm:inline">AI Auto-Detect</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {settings.excludedKeywords.length === 0 ? (
            <span className="text-xs text-[var(--admin-muted)] italic">
              No keywords currently blacklisted.
            </span>
          ) : (
            settings.excludedKeywords.map((kw: string) => (
              <span
                key={kw}
                className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-2"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveExclusion(kw)}
                  className="hover:text-red-200 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* AI Exclusion Suggestions Card */}
      {suggestions.length > 0 && (
        <div className="admin-surface-primary backdrop-blur-xs border border-gold/30 rounded-[12px] p-6 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-gold" />
            <h3 className="text-[var(--admin-text)] font-bold text-sm uppercase tracking-wider">
              AI Recommended Negative Exclusions
            </h3>
          </div>
          <p className="text-[var(--admin-text)]/70 text-xs md:text-sm mb-5 max-w-2xl">
            Based on your selected niches, the AI recommends blacklisting these topics to preserve your premium positioning.
          </p>

          <div className="grid md:grid-cols-2 gap-3.5">
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

      {/* Save Button Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-12 border-t border-[var(--admin-border)]">
        <div className="text-xs text-[var(--admin-muted)] flex items-center gap-2">
          <Info size={14} className="text-gold shrink-0" />
          <span>Config is applied automatically to all draft generations.</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 admin-surface-secondary border border-[var(--admin-border)] text-[var(--admin-text)] font-bold text-xs md:text-sm rounded-[10px] hover:border-gold/40 hover:bg-neutral-800 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Configuration</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndGenerate}
            disabled={loading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-7 py-3.5 bg-gold text-primary-foreground font-black text-xs md:text-sm rounded-[10px] hover:bg-gold-hover transition-all shadow-[0_4px_16px_0_rgba(212,175,55,0.35)] disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>Save &amp; Generate Draft Now</span>
          </button>
        </div>
      </div>

      <GenerateAiDraftModal
        isOpen={showDraftModal}
        onClose={() => setShowDraftModal(false)}
      />
    </div>
  );
}

function AiExclusionSuggestionCard({
  suggestion,
  onAdd,
}: {
  suggestion: { keyword: string; reasoning: string };
  onAdd: () => void;
}) {
  const [showReason, setShowReason] = useState(false);
  return (
    <div className="admin-surface-secondary border border-[var(--admin-border)] rounded-[10px] p-4 flex flex-col gap-2.5 hover:border-gold/30 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <span className="font-bold text-[var(--admin-text)] text-xs md:text-sm break-words flex-1 mt-0.5">
          {suggestion.keyword}
        </span>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowReason(!showReason)}
            className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/15 border border-blue-500/25 px-2.5 py-1 rounded-[6px] hover:bg-blue-500/25 transition-colors"
          >
            {showReason ? "Hide" : "Why?"}
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="text-[10px] uppercase font-bold text-green-400 bg-green-500/15 border border-green-500/25 px-2.5 py-1 rounded-[6px] hover:bg-green-500/25 transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
      {showReason && (
        <p className="text-[var(--admin-text)]/80 text-xs italic border-l-2 border-blue-500/50 pl-3 py-1 bg-blue-500/5 rounded-r-[4px] leading-relaxed">
          {suggestion.reasoning}
        </p>
      )}
    </div>
  );
}
