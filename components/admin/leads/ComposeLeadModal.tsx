"use client";

import { createOutboundLead, CreateOutboundLeadParams } from "@/actions/leads";
import { useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Check, Mail, MessageSquare, Phone, Send, Sparkles, User, X } from "lucide-react";
import { useState, useTransition } from "react";

interface ComposeLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (leadId: string) => void;
}

const SUBJECT_PRESETS = [
  { label: "Engineering Partnership", subject: "Exploring Engineering Partnership with Xinteck" },
  { label: "Product Modernization", subject: "Modernizing Your Digital Architecture — Xinteck" },
  { label: "Dedicated Tech Team", subject: "Dedicated Engineering Team for Your Roadmap" },
  { label: "Technical Consultation", subject: "Technical Architecture Consultation Request" },
  { label: "Follow-up", subject: "Following Up from Our Recent Discussion" }
];

export function ComposeLeadModal({ isOpen, onClose, onSuccess }: ComposeLeadModalProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<CreateOutboundLeadParams>({
    name: "",
    email: "",
    phone: "",
    subject: "Exploring Engineering Partnership with Xinteck",
    message: "",
    projectType: "Outbound Outreach"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Recipient name is required";
    if (!formData.email.trim() || !formData.email.includes("@")) errs.email = "Valid recipient email is required";
    if (!formData.subject.trim()) errs.subject = "Subject is required";
    if (!formData.message.trim()) errs.message = "Message body cannot be empty";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      try {
        const result = await createOutboundLead(formData);
        if (result.success) {
          toast(`Outreach email dispatched to ${formData.email} from info@xinteck.co.ke`, "success");
          onSuccess(result.leadId);
          onClose();
          // Reset form
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "Exploring Engineering Partnership with Xinteck",
            message: "",
            projectType: "Outbound Outreach"
          });
        }
      } catch (err: any) {
        toast(err.message || "Failed to dispatch email", "error");
      }
    });
  };

  const applyPreset = (presetSubject: string) => {
    setFormData(prev => ({ ...prev, subject: presetSubject }));
  };

  const applyTemplateStarter = () => {
    const recipient = formData.name.trim() || "there";
    const template = `Hello ${recipient},

I hope this email finds you well.

I am reaching out from Xinteck Engineering Group. We specialize in building robust cloud infrastructures, modern full-stack web platforms, and scalable digital systems for ambitious organizations.

Having observed your recent initiatives, we see several strategic opportunities to accelerate your technical roadmap and enhance your platform's performance and security.

Would you be open to a brief 15-minute introductory technical discussion next week?

Looking forward to connecting.`;
    setFormData(prev => ({ ...prev, message: template }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl admin-surface-primary border border-[var(--admin-border)] rounded-[16px] shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-[var(--admin-border)] flex items-center justify-between admin-surface-secondary/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold">
                <Send size={18} />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-bold text-[var(--admin-text)]">
                  Compose Outreach Email
                </h3>
                <p className="text-xs text-[var(--admin-text)]/50">
                  Direct outreach from <span className="font-semibold text-gold">info@xinteck.co.ke</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="p-2 text-[var(--admin-text)]/50 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 md:p-6 flex flex-col gap-4">
            {/* Sender notice banner */}
            <div className="bg-gold/10 border border-gold/20 rounded-[10px] p-3 text-xs text-[var(--admin-text)]/80 flex items-start gap-2.5">
              <Sparkles size={16} className="text-gold shrink-0 mt-0.5" />
              <span>
                Dispatches via Resend from <strong>info@xinteck.co.ke</strong>. Client replies automatically sync back to this CRM and alert <strong>winterjacksonwj@gmail.com</strong>.
              </span>
            </div>

            {/* Row 1: Name and Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]/70 flex items-center gap-1.5">
                  <User size={13} /> Recipient Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className={cn(
                    "admin-surface-input border rounded-[10px] px-3.5 py-2.5 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/60 focus:outline-none transition-colors",
                    errors.name ? "border-red-500" : "border-[var(--admin-border)]"
                  )}
                />
                {errors.name && <span className="text-[11px] text-red-400 font-semibold">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]/70 flex items-center gap-1.5">
                  <Mail size={13} /> Recipient Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={cn(
                    "admin-surface-input border rounded-[10px] px-3.5 py-2.5 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/60 focus:outline-none transition-colors",
                    errors.email ? "border-red-500" : "border-[var(--admin-border)]"
                  )}
                />
                {errors.email && <span className="text-[11px] text-red-400 font-semibold">{errors.email}</span>}
              </div>
            </div>

            {/* Row 2: Phone and Project Type */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]/70 flex items-center gap-1.5">
                  <Phone size={13} /> Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-3.5 py-2.5 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/60 focus:outline-none transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]/70 flex items-center gap-1.5">
                  <Building2 size={13} /> Outreach Category
                </label>
                <select
                  value={formData.projectType}
                  onChange={e => setFormData({ ...formData, projectType: e.target.value })}
                  className="admin-surface-input border border-[var(--admin-border)] rounded-[10px] px-3.5 py-2.5 text-sm text-[var(--admin-text)] focus:border-gold/60 focus:outline-none transition-colors"
                >
                  <option value="Outbound Outreach">Direct Outreach</option>
                  <option value="Build a New Product">Build a New Product</option>
                  <option value="Scale Existing Platform">Scale Existing Platform</option>
                  <option value="Modernize Legacy System">Modernize Legacy System</option>
                  <option value="Dedicated Engineering Team">Dedicated Engineering Team</option>
                  <option value="Consultation / Audit">Consultation / Audit</option>
                </select>
              </div>
            </div>

            {/* Subject Preset Quick-Picks */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]/70">
                  Subject Line <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-[var(--admin-text)]/40 font-medium">Quick Presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1">
                {SUBJECT_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(p.subject)}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-md border transition-all font-medium",
                      formData.subject === p.subject
                        ? "bg-gold/20 text-gold border-gold/40"
                        : "bg-[var(--admin-text)]/5 text-[var(--admin-text)]/60 border-[var(--admin-border)] hover:text-[var(--admin-text)]"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Subject of the email"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className={cn(
                  "admin-surface-input border rounded-[10px] px-3.5 py-2.5 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/60 focus:outline-none transition-colors",
                  errors.subject ? "border-red-500" : "border-[var(--admin-border)]"
                )}
              />
              {errors.subject && <span className="text-[11px] text-red-400 font-semibold">{errors.subject}</span>}
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-text)]/70 flex items-center gap-1.5">
                  <MessageSquare size={13} /> Message Body <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={applyTemplateStarter}
                  className="text-[11px] text-gold hover:underline flex items-center gap-1 font-semibold"
                >
                  <Sparkles size={11} /> Insert Starter Template
                </button>
              </div>
              <textarea
                rows={7}
                placeholder="Write your email here..."
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className={cn(
                  "admin-surface-input border rounded-[12px] p-4 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/60 focus:outline-none resize-none transition-colors leading-relaxed",
                  errors.message ? "border-red-500" : "border-[var(--admin-border)]"
                )}
              />
              {errors.message && <span className="text-[11px] text-red-400 font-semibold">{errors.message}</span>}
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-[var(--admin-border)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="px-5 py-2 rounded-[10px] text-xs font-bold text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2.5 rounded-[10px] bg-primary text-primary-foreground font-black text-xs md:text-sm flex items-center gap-2 hover:bg-gold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} /> Send Outreach
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
