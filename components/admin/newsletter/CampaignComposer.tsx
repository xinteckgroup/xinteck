"use client";

import { generateNewsletterDraft, generatePreviewText, generateSubjectLines, refineContent } from "@/actions/newsletter-ai";
import { createCampaign, getResendQuota, updateCampaign } from "@/actions/newsletter-campaigns";
import { Button, PageContainer, PageHeader, useToast } from "@/components/admin/ui";
import {
    ArrowLeft, Bot, Eye, Loader2, RefreshCw, Save, Send, Sparkles, Users, Wand2, X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

interface CampaignComposerProps {
    campaignId?: string;
    initialData?: {
        subject: string;
        previewText: string;
        content: string;
        audience: string;
    };
}

export function CampaignComposer({ campaignId, initialData }: CampaignComposerProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    // Form state
    const [subject, setSubject] = useState(initialData?.subject || "");
    const [previewText, setPreviewText] = useState(initialData?.previewText || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [audience, setAudience] = useState<"ACTIVE_ONLY" | "ALL">(
        (initialData?.audience as "ACTIVE_ONLY" | "ALL") || "ACTIVE_ONLY"
    );

    // AI state
    const [aiLoading, setAiLoading] = useState<string | null>(null);
    const [aiTopic, setAiTopic] = useState("");
    const [aiKeyPoints, setAiKeyPoints] = useState("");
    const [aiTone, setAiTone] = useState<"professional" | "casual" | "technical" | "inspiring">("professional");
    const [subjectSuggestions, setSubjectSuggestions] = useState<{ subject: string; style: string }[]>([]);
    const [refineInstruction, setRefineInstruction] = useState("");

    // Quota state
    const [quota, setQuota] = useState<any>(null);
    const [sendLimit, setSendLimit] = useState<number>(0);

    // UI state
    const [showPreview, setShowPreview] = useState(false);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [sending, setSending] = useState(false);

    // Derived: max possible subscribers based on audience + quota
    const maxRecipients = quota
        ? Math.min(
            quota.maxSendable,
            audience === "ACTIVE_ONLY" ? quota.subscribers.active : quota.subscribers.total
        )
        : 0;

    // Fetch quota on mount
    const fetchQuota = useCallback(async () => {
        try {
            const q = await getResendQuota();
            setQuota(q);
            const maxSend = Math.min(q.maxSendable, q.subscribers.active);
            setSendLimit(maxSend);
        } catch { }
    }, []);

    useEffect(() => { fetchQuota(); }, [fetchQuota]);

    // Update sendLimit when audience changes
    useEffect(() => {
        if (quota) {
            const newMax = Math.min(
                quota.maxSendable,
                audience === "ACTIVE_ONLY" ? quota.subscribers.active : quota.subscribers.total
            );
            setSendLimit(Math.min(sendLimit, newMax) || newMax);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [audience, quota]);

    // ─── Save ───
    const handleSave = () => {
        if (!subject.trim() || !content.trim()) {
            toast("Subject and content are required", "error");
            return;
        }
        startTransition(async () => {
            try {
                if (campaignId) {
                    await updateCampaign(campaignId, { subject, previewText, content, audience });
                    toast("Draft saved", "success");
                } else {
                    const result = await createCampaign({ subject, previewText, content, audience });
                    toast("Draft created", "success");
                    router.replace(`/admin/newsletter/compose/${result.id}`);
                }
            } catch (err: any) {
                toast(err.message || "Failed to save", "error");
            }
        });
    };

    // ─── Send ───
    const handleSend = async () => {
        if (!campaignId) {
            toast("Please save the draft first", "error");
            return;
        }
        setSending(true);
        try {
            await updateCampaign(campaignId, { subject, previewText, content, audience });

            const res = await fetch("/api/newsletter/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ campaignId, sendLimit }),
            });
            const data = await res.json();

            if (res.ok) {
                toast(`Newsletter sent to ${data.sentCount} subscribers!`, "success");
                setShowSendDialog(false);
                router.push("/admin/newsletter/campaigns");
            } else {
                toast(data.error || "Send failed", "error");
            }
        } catch (err: any) {
            toast(err.message || "Send failed", "error");
        } finally {
            setSending(false);
        }
    };

    // ─── AI Handlers ───
    const handleGenerateDraft = async () => {
        if (!aiTopic.trim()) { toast("Enter a topic first", "error"); return; }
        setAiLoading("draft");
        try {
            const result = await generateNewsletterDraft({ topic: aiTopic, keyPoints: aiKeyPoints, tone: aiTone });
            setContent(result.content);
            toast("Draft generated!", "success");
        } catch (err: any) { toast(err.message || "AI generation failed", "error"); }
        finally { setAiLoading(null); }
    };

    const handleGenerateSubjects = async () => {
        if (!content.trim()) { toast("Write some content first", "error"); return; }
        setAiLoading("subjects");
        try {
            const result = await generateSubjectLines({ content, topic: aiTopic });
            setSubjectSuggestions(result.suggestions);
        } catch (err: any) { toast(err.message || "Failed to generate subjects", "error"); }
        finally { setAiLoading(null); }
    };

    const handleRefine = async () => {
        if (!content.trim()) { toast("No content to refine", "error"); return; }
        if (!refineInstruction.trim()) { toast("Enter a refine instruction", "error"); return; }
        setAiLoading("refine");
        try {
            const result = await refineContent({ content, instruction: refineInstruction });
            setContent(result.content);
            toast("Content refined!", "success");
            setRefineInstruction("");
        } catch (err: any) { toast(err.message || "Refinement failed", "error"); }
        finally { setAiLoading(null); }
    };

    const handleGeneratePreview = async () => {
        if (!subject.trim() || !content.trim()) { toast("Need subject and content first", "error"); return; }
        setAiLoading("preview");
        try {
            const result = await generatePreviewText({ subject, content });
            setPreviewText(result.previewText);
            toast("Preview text generated!", "success");
        } catch (err: any) { toast(err.message || "Failed", "error"); }
        finally { setAiLoading(null); }
    };

    // Clamp send limit to valid range
    const handleSendLimitChange = (val: number) => {
        const clamped = Math.max(0, Math.min(val, maxRecipients));
        setSendLimit(clamped);
    };

    return (
        <PageContainer>
            <PageHeader
                title={campaignId ? "Edit Campaign" : "Compose Newsletter"}
                subtitle="Create and send professional newsletters to your subscribers."
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="gap-2 admin-surface-primary border border-[var(--admin-border)] text-white hover:text-gold hover:bg-white/5 transition-all text-sm font-bold rounded-[10px]"
                            onClick={() => router.push("/admin/newsletter")}
                        >
                            <ArrowLeft size={14} /> Back
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 admin-surface-primary border border-[var(--admin-border)] text-white hover:text-gold hover:bg-white/5 transition-all text-sm font-bold rounded-[10px]"
                            onClick={handleSave}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Draft
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 bg-gold/90 border border-gold text-black hover:bg-gold transition-all text-sm font-black rounded-[10px]"
                            onClick={() => { fetchQuota(); setShowSendDialog(true); }}
                            disabled={!campaignId || !subject.trim() || !content.trim()}
                        >
                            <Send size={14} /> Send
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ─── Left: Editor (2/3) ─── */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* Subject */}
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] p-4 shadow-xl">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 block">Subject Line</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="Enter your email subject..."
                                className="flex-1 admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none transition-colors"
                                maxLength={200}
                            />
                            <button
                                onClick={handleGenerateSubjects}
                                disabled={aiLoading === "subjects"}
                                className="p-2.5 rounded-[10px] border border-[var(--admin-border)] text-white/40 hover:text-gold hover:border-gold/30 transition-all"
                                title="AI: Generate subject lines"
                            >
                                {aiLoading === "subjects" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            </button>
                        </div>
                        {/* Subject suggestions */}
                        {subjectSuggestions.length > 0 && (
                            <div className="mt-3 flex flex-col gap-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-gold">AI Suggestions — Click to apply</span>
                                {subjectSuggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSubject(s.subject); setSubjectSuggestions([]); }}
                                        className="text-left px-3 py-2 rounded-[8px] text-xs text-white hover:bg-gold/10 hover:text-gold border border-[var(--admin-border)] transition-all flex items-center justify-between"
                                    >
                                        <span>{s.subject}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{s.style}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Preview Text */}
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] p-4 shadow-xl">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 block">Preview Text (inbox snippet)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={previewText}
                                onChange={e => setPreviewText(e.target.value)}
                                placeholder="Brief text shown in inbox preview..."
                                className="flex-1 admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none transition-colors"
                                maxLength={300}
                            />
                            <button
                                onClick={handleGeneratePreview}
                                disabled={aiLoading === "preview"}
                                className="p-2.5 rounded-[10px] border border-[var(--admin-border)] text-white/40 hover:text-gold hover:border-gold/30 transition-all"
                                title="AI: Generate preview text"
                            >
                                {aiLoading === "preview" ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Content Editor */}
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] shadow-xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--admin-border)]">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/50">Newsletter Content (HTML)</label>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[10px] font-bold uppercase tracking-wider text-white/50 hover:text-gold border border-[var(--admin-border)] hover:border-gold/30 transition-all"
                            >
                                <Eye size={12} /> {showPreview ? "Editor" : "Preview"}
                            </button>
                        </div>
                        {showPreview ? (
                            <div
                                className="p-6 text-sm text-white prose prose-invert prose-sm max-w-none min-h-[400px]"
                                dangerouslySetInnerHTML={{ __html: content }}
                            />
                        ) : (
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder={'<h2>Your heading</h2>\n<p>Write your newsletter content here...</p>'}
                                className="w-full p-4 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none resize-none font-mono min-h-[400px]"
                            />
                        )}
                    </div>

                    {/* Audience Selector */}
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] p-4 shadow-xl">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3 block">Target Audience</label>
                        <div className="flex gap-3">
                            {([
                                {
                                    value: "ACTIVE_ONLY",
                                    label: "Active Subscribers Only",
                                    desc: "Recommended — only sends to subscribers who voluntarily opted in and haven't unsubscribed. Safe for regular newsletters.",
                                    count: quota?.subscribers.active ?? "—",
                                    badge: "RECOMMENDED",
                                    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
                                },
                                {
                                    value: "ALL",
                                    label: "All Subscribers",
                                    desc: "Includes previously unsubscribed users. Use only for rare re-engagement campaigns. May cause spam complaints if overused.",
                                    count: quota?.subscribers.total ?? "—",
                                    badge: "USE WITH CAUTION",
                                    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                                },
                            ] as const).map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setAudience(opt.value)}
                                    className={`flex-1 p-4 rounded-[10px] border text-left transition-all ${audience === opt.value
                                        ? "border-gold/50 bg-gold/10"
                                        : "border-[var(--admin-border)] hover:border-white/20"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-xs font-bold ${audience === opt.value ? "text-gold" : "text-white"}`}>
                                            {opt.label}
                                        </span>
                                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                                            {opt.badge}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/40 leading-relaxed mb-2">{opt.desc}</p>
                                    <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--admin-border)]">
                                        <Users size={12} className="text-white/30" />
                                        <span className="text-xs font-black text-white">{opt.count}</span>
                                        <span className="text-[9px] text-white/30">subscribers</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ─── Right: AI Panel (1/3) ─── */}
                <div className="flex flex-col gap-4">
                    {/* AI Draft Generator */}
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] p-4 shadow-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                                <Bot size={16} className="text-gold" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">AI Draft Generator</h3>
                                <p className="text-[10px] text-white/40">Generate professional content instantly</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={aiTopic}
                                onChange={e => setAiTopic(e.target.value)}
                                placeholder="Newsletter topic..."
                                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-3 py-2 text-xs text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none"
                            />
                            <textarea
                                value={aiKeyPoints}
                                onChange={e => setAiKeyPoints(e.target.value)}
                                placeholder="Key points to cover (optional)..."
                                rows={3}
                                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-3 py-2 text-xs text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none resize-none"
                            />
                            <div className="flex flex-wrap gap-1.5">
                                {(["professional", "casual", "technical", "inspiring"] as const).map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setAiTone(t)}
                                        className={`px-3 py-1.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider transition-all ${aiTone === t
                                            ? "bg-gold/90 text-black"
                                            : "text-white/40 hover:text-white border border-[var(--admin-border)] hover:bg-white/5"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleGenerateDraft}
                                disabled={aiLoading === "draft"}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-gold/90 text-black font-bold text-xs hover:bg-gold transition-all disabled:opacity-50"
                            >
                                {aiLoading === "draft" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                Generate Draft
                            </button>
                        </div>
                    </div>

                    {/* AI Refine */}
                    <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] p-4 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Refine Content</h3>
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={refineInstruction}
                                onChange={e => setRefineInstruction(e.target.value)}
                                placeholder="e.g., Make it shorter, more formal..."
                                className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-3 py-2 text-xs text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none"
                            />
                            <button
                                onClick={handleRefine}
                                disabled={aiLoading === "refine"}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] border border-[var(--admin-border)] text-white text-xs font-bold hover:border-gold/30 hover:text-gold transition-all disabled:opacity-50"
                            >
                                {aiLoading === "refine" ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                Refine
                            </button>
                        </div>
                    </div>

                    {/* Quota Card */}
                    {quota && (
                        <div className="admin-surface-primary backdrop-blur-sm rounded-[12px] border border-[var(--admin-border)] p-4 shadow-xl">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">Send Quota (Resend Free Plan)</h3>
                            <div className="flex flex-col gap-3">
                                <QuotaBar label="Daily (100/day)" used={quota.daily.used} limit={quota.daily.limit} />
                                <QuotaBar label="Monthly (3,000/mo)" used={quota.monthly.used} limit={quota.monthly.limit} />
                                <div className="flex items-center justify-between pt-2 border-t border-[var(--admin-border)]">
                                    <span className="text-[10px] text-white/40 font-bold uppercase">Active Subscribers</span>
                                    <span className="text-sm font-black text-gold">{quota.subscribers.active}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-white/40 font-bold uppercase">Total Subscribers</span>
                                    <span className="text-sm font-black text-white">{quota.subscribers.total}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-[var(--admin-border)]">
                                    <span className="text-[10px] text-white/40 font-bold uppercase">Available to Send Now</span>
                                    <span className={`text-sm font-black ${quota.maxSendable > 0 ? "text-green-400" : "text-red-400"}`}>{quota.maxSendable}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ─── Send Confirmation Dialog ─── */}
            {showSendDialog && quota && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="admin-surface-primary border border-[var(--admin-border)] rounded-[16px] p-6 max-w-lg w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black text-white">Send Newsletter</h2>
                            <button onClick={() => setShowSendDialog(false)} className="text-white/40 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5">
                            {/* Subject preview */}
                            <div className="p-3 rounded-[10px] bg-white/5 border border-[var(--admin-border)]">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Subject</span>
                                <span className="text-sm font-bold text-white">{subject}</span>
                            </div>

                            {/* Audience info */}
                            <div className="p-3 rounded-[10px] bg-white/5 border border-[var(--admin-border)]">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Audience</span>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-white">
                                        {audience === "ACTIVE_ONLY" ? "Active Subscribers Only" : "All Subscribers"}
                                    </span>
                                    <span className="text-sm font-black text-gold">
                                        {audience === "ACTIVE_ONLY" ? quota.subscribers.active : quota.subscribers.total} total
                                    </span>
                                </div>
                            </div>

                            {/* Quota display */}
                            <div className="flex flex-col gap-2">
                                <QuotaBar label="Daily Quota (100/day)" used={quota.daily.used} limit={quota.daily.limit} />
                                <QuotaBar label="Monthly Quota (3,000/month)" used={quota.monthly.used} limit={quota.monthly.limit} />
                            </div>

                            {/* Send limit selector — slider + number input */}
                            <div className="p-4 rounded-[12px] bg-white/5 border border-[var(--admin-border)]">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3 block">
                                    How many emails to send right now?
                                </label>
                                
                                {/* Number input */}
                                <div className="flex items-center gap-4 mb-3">
                                    <input
                                        type="number"
                                        min={0}
                                        max={maxRecipients}
                                        value={sendLimit}
                                        onChange={e => handleSendLimitChange(Number(e.target.value))}
                                        className="w-24 admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-3 py-2 text-center text-xl font-black text-gold focus:border-gold/50 focus:outline-none"
                                        disabled={maxRecipients === 0}
                                    />
                                    <div className="flex-1">
                                        <span className="text-xs text-white/60 block">
                                            out of <span className="font-black text-white">{audience === "ACTIVE_ONLY" ? quota.subscribers.active : quota.subscribers.total}</span> {audience === "ACTIVE_ONLY" ? "active" : "total"} subscribers
                                        </span>
                                        <span className="text-[10px] text-white/30">
                                            Max sendable right now: <span className="font-bold text-green-400">{quota.maxSendable}</span> (based on remaining quota)
                                        </span>
                                    </div>
                                </div>

                                {/* Slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={maxRecipients}
                                    value={sendLimit}
                                    onChange={e => setSendLimit(Number(e.target.value))}
                                    className="w-full accent-[#D4AF37] h-2"
                                    disabled={maxRecipients === 0}
                                />
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[9px] text-white/30 font-bold">0</span>
                                    <span className="text-[9px] text-white/30 font-bold">{maxRecipients}</span>
                                </div>

                                {/* Quick select buttons */}
                                <div className="flex gap-2 mt-3">
                                    {[10, 25, 50, maxRecipients].filter((v, i, arr) => v > 0 && v <= maxRecipients && arr.indexOf(v) === i).map(n => (
                                        <button
                                            key={n}
                                            onClick={() => setSendLimit(n)}
                                            className={`px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wider transition-all border ${sendLimit === n
                                                ? "bg-gold/20 text-gold border-gold/40"
                                                : "text-white/40 border-[var(--admin-border)] hover:text-white hover:bg-white/5"
                                                }`}
                                        >
                                            {n === maxRecipients ? `ALL (${n})` : n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {quota.maxSendable === 0 && (
                                <div className="p-3 rounded-[10px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                                    ⚠ Quota exhausted. Daily: {quota.daily.remaining} remaining. Monthly: {quota.monthly.remaining} remaining. Try again later.
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setShowSendDialog(false)}
                                    className="flex-1 px-4 py-2.5 rounded-[10px] border border-[var(--admin-border)] text-white text-sm font-bold hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={sending || quota.maxSendable === 0 || sendLimit === 0}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-gold/90 text-black text-sm font-black hover:bg-gold transition-all disabled:opacity-50"
                                >
                                    {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                    Send to {sendLimit} {sendLimit === 1 ? "subscriber" : "subscribers"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
}

function QuotaBar({ label, used, limit }: { label: string; used: number; limit: number }) {
    const pct = Math.min(100, (used / limit) * 100);
    const color = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-green-500";

    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{label}</span>
                <span className="text-[10px] font-black text-white">{used} / {limit}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
}
