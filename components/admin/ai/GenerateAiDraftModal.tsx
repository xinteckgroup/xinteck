"use client";

import { generateDirectDraft, getAiSettings } from "@/actions/ai";
import { useToast } from "@/components/admin/ui/Toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  Layers,
  Loader2,
  Send,
  Sparkles,
  UserCheck,
  Wand2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface GenerateAiDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

// 7 Authority topics established in the strategic roadmap
const SUGGESTED_AUTHORITY_TOPICS = [
  "The M-Pesa Integration Trap (And How to Avoid It)",
  "Why Most Kenyan Businesses Lose Money on Their First Website",
  "How eTIMS Compliance Can Actually Save Your Business Money",
  "The True Cost of 'Cheap' Software Development in Kenya",
  "Why 73% of Kenyan Business Websites Lose Mobile Customers",
  "Going Digital in Kenya: The Business Owner's 30-Day Roadmap",
  "From Spreadsheet Chaos to Automated Operations: A Kenyan Case Study",
];

const GENERATION_PHASES = [
  "Analyzing engineering domain & active AI persona...",
  "Contextualizing Kenyan infrastructure (M-Pesa, eTIMS, mobile networks)...",
  "Structuring Markdown headings, code patterns & ROI metrics...",
  "Writing 800+ word technical article in Senior Engineer voice...",
  "Finalizing unapproved draft and saving to database...",
];

export function GenerateAiDraftModal({
  isOpen,
  onClose,
  defaultTopic = "",
}: GenerateAiDraftModalProps) {
  const router = useRouter();
  const { success, error: toastError, info } = useToast();

  const [mode, setMode] = useState<"auto" | "custom">("auto");
  const [customTopic, setCustomTopic] = useState(defaultTopic);
  const [focusNiche, setFocusNiche] = useState<string>("all");
  const [extraDirectives, setExtraDirectives] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  // Settings preview state
  const [settings, setSettings] = useState<{
    targetNiches: string[];
    brandVoice: string;
  }>({
    targetNiches: [],
    brandVoice: "",
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  // Rotate generation status messages
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setCurrentPhaseIndex((prev) => (prev + 1) % GENERATION_PHASES.length);
      }, 2500);
    } else {
      setCurrentPhaseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const loadSettings = async () => {
    try {
      const data = await getAiSettings();
      if (data) {
        setSettings({
          targetNiches: data.targetNiches || [],
          brandVoice: data.brandVoice || "",
        });
      }
    } catch {
      // fallback
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    info("AI Editorial Assistant is generating your draft...");

    try {
      const result = await generateDirectDraft({
        customTopic: mode === "custom" ? customTopic.trim() : undefined,
        focusNiche: focusNiche !== "all" ? focusNiche : undefined,
        extraDirectives: extraDirectives.trim() || undefined,
      });

      if (result.success && result.postId) {
        success(`Draft Generated: "${result.title}"`);
        onClose();
        // Redirect directly to the blog editor so the admin can inspect the unapproved draft
        router.push(`/admin/blog/${result.postId}`);
        router.refresh();
      }
    } catch (err: any) {
      toastError(err.message || "Failed to generate blog draft.");
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={() => !isGenerating && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="admin-surface-primary backdrop-blur-xl border border-[var(--admin-border)] rounded-[12px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative text-[var(--admin-text)] my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 md:p-6 border-b border-[var(--admin-border)] flex items-start justify-between bg-black/10 dark:bg-black/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-gold/20 text-gold flex items-center justify-center shrink-0 border border-gold/30 shadow-xs">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30">
                    One-Click Drafting Engine
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-black text-[var(--admin-text)] mt-1">
                  Generate Unapproved Blog Draft
                </h3>
                <p className="text-xs text-[var(--admin-muted)] mt-0.5">
                  Powered by Gemini 2.5 Flash using your configured niches and persona.
                </p>
              </div>
            </div>

            {!isGenerating && (
              <button
                onClick={onClose}
                className="text-[var(--admin-muted)] hover:text-[var(--admin-text)] p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-5 md:p-6 overflow-y-auto flex-1 flex flex-col gap-5">
            {/* Active AI Config Inspection Snapshot */}
            <div className="p-3.5 rounded-[10px] bg-black/20 dark:bg-black/40 border border-[var(--admin-border)] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between text-[var(--admin-muted)]">
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[var(--admin-text)]">
                  <UserCheck size={14} className="text-gold" />
                  <span>Active AI Configuration Snapshot</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    router.push("/admin/blog/ai");
                  }}
                  className="text-gold hover:underline text-[11px] font-semibold"
                >
                  Edit in Config
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/25 text-purple-300 font-semibold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span className="truncate max-w-[280px]">
                    {settings.brandVoice.slice(0, 45) || "Kenyan Senior Engineer Persona"}...
                  </span>
                </div>

                <div className="px-2.5 py-1 rounded-md bg-gold/15 border border-gold/25 text-gold font-semibold text-[11px] flex items-center gap-1.5">
                  <Layers size={12} />
                  <span>
                    {settings.targetNiches.length > 0
                      ? `${settings.targetNiches.length} Active Niches`
                      : "Default Kenyan Niches Active"}
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]">
                Topic Selection Mode
              </label>
              <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-[10px] border border-[var(--admin-border)]">
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setMode("auto")}
                  className={`py-2 px-3 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === "auto"
                      ? "bg-gold text-primary-foreground shadow-sm"
                      : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                  }`}
                >
                  <Wand2 size={14} />
                  <span>Autonomous AI Topic</span>
                </button>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setMode("custom")}
                  className={`py-2 px-3 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    mode === "custom"
                      ? "bg-gold text-primary-foreground shadow-sm"
                      : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
                  }`}
                >
                  <FileText size={14} />
                  <span>Specify Custom Headline</span>
                </button>
              </div>
            </div>

            {/* Mode A: Autonomous Topic */}
            {mode === "auto" && (
              <div className="flex flex-col gap-3 p-4 rounded-[10px] bg-black/15 dark:bg-black/30 border border-[var(--admin-border)]">
                <div className="flex items-center gap-2 text-xs font-bold text-gold">
                  <Compass size={15} />
                  <span>AI Will Choose a Timely, High-Impact Kenyan Angle</span>
                </div>
                <p className="text-xs text-[var(--admin-muted)] leading-relaxed">
                  The AI will analyze your target niches and synthesize a relevant, non-generic title addressing modern Kenyan tech architecture, payment rails, or compliance.
                </p>

                {settings.targetNiches.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-[var(--admin-text)]">
                      Optional: Pin to Specific Niche
                    </span>
                    <select
                      value={focusNiche}
                      disabled={isGenerating}
                      onChange={(e) => setFocusNiche(e.target.value)}
                      className="admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-3 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-gold/50"
                    >
                      <option value="all">Any Active Niche (AI Decides Best Fit)</option>
                      {settings.targetNiches.map((niche) => (
                        <option key={niche} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {/* Mode B: Custom Headline */}
            {mode === "custom" && (
              <div className="flex flex-col gap-3 p-4 rounded-[10px] bg-black/15 dark:bg-black/30 border border-[var(--admin-border)]">
                <label className="text-xs font-bold text-[var(--admin-text)]">
                  Enter Your Article Title or Question:
                </label>
                <input
                  type="text"
                  value={customTopic}
                  disabled={isGenerating}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. The M-Pesa Integration Trap (And How to Avoid It)..."
                  className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-3.5 py-2.5 text-xs md:text-sm text-[var(--admin-text)] outline-none focus:border-gold/50 placeholder:text-[var(--admin-muted)]/50"
                />

                <div className="flex flex-col gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-[var(--admin-muted)] uppercase tracking-wider">
                    Or Click a Suggested Authority Topic:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto gold-scrollbar">
                    {SUGGESTED_AUTHORITY_TOPICS.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        disabled={isGenerating}
                        onClick={() => setCustomTopic(topic)}
                        className={`text-left text-[11px] px-2.5 py-1 rounded-[6px] transition-all border ${
                          customTopic === topic
                            ? "bg-gold/20 text-gold border-gold/40 font-bold"
                            : "admin-surface-secondary text-[var(--admin-muted)] hover:text-[var(--admin-text)] border-[var(--admin-border)]"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Optional Directives */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[var(--admin-text)] flex items-center justify-between">
                <span>Optional Instructions or Focus Points:</span>
                <span className="text-[10px] text-[var(--admin-muted)] font-normal">Optional</span>
              </label>
              <input
                type="text"
                value={extraDirectives}
                disabled={isGenerating}
                onChange={(e) => setExtraDirectives(e.target.value)}
                placeholder="e.g., Emphasize KRA eTIMS penalties, mention Daraja API v2, keep under 900 words..."
                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-3.5 py-2 text-xs text-[var(--admin-text)] outline-none focus:border-gold/50 placeholder:text-[var(--admin-muted)]/50"
              />
            </div>

            {/* Safety Guarantee Callout */}
            <div className="p-3 rounded-[8px] bg-blue-500/10 border border-blue-500/25 flex items-start gap-2.5 text-xs text-blue-300">
              <AlertCircle size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-blue-200">Strict Review Workflow:</strong> This action creates an <strong>Unapproved Draft (Status: Draft)</strong>. It will <em>never</em> be published publicly until you inspect, review, and click "Publish Now" in the editor.
              </p>
            </div>

            {/* Generating Live Feedback Overlay */}
            {isGenerating && (
              <div className="p-4 rounded-[10px] bg-gold/10 border border-gold/30 flex flex-col items-center justify-center gap-3 text-center animate-in fade-in">
                <div className="w-10 h-10 rounded-full border-3 border-gold border-t-transparent animate-spin flex items-center justify-center" />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-black text-gold uppercase tracking-widest">
                    Generating Technical Draft
                  </span>
                  <p className="text-xs font-medium text-[var(--admin-text)]">
                    {GENERATION_PHASES[currentPhaseIndex]}
                  </p>
                </div>
                <span className="text-[10px] text-[var(--admin-muted)]">
                  Gemini 2.5 Flash is generating an 800+ word structured markdown article (~10-15s)...
                </span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 md:p-5 border-t border-[var(--admin-border)] bg-black/10 dark:bg-black/30 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isGenerating}
              onClick={onClose}
              className="px-4 py-2.5 rounded-[8px] text-xs font-bold text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isGenerating || (mode === "custom" && !customTopic.trim())}
              onClick={handleGenerate}
              className="px-6 py-2.5 bg-gold text-primary-foreground font-black text-xs md:text-sm rounded-[8px] hover:bg-gold-hover transition-all flex items-center gap-2 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Drafting Article...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate AI Draft Now</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

