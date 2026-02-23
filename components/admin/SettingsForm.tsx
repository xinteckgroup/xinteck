"use client";

import { SettingsState, updateSettings } from "@/actions/settings";
import { upsertSiteSetting } from "@/actions/site-settings";
import { SecretCard } from "@/components/admin/settings/SecretCard";
import { StatusCard } from "@/components/admin/settings/StatusCard";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { PageContainer } from "@/components/admin/ui/PageContainer";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useToast } from "@/components/admin/ui/Toast";
import { settingsStateSchema } from "@/lib/validations";
import { Key as KeyIcon, Mail, Phone, Plus, Save, Shield, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

export interface ContactInfo {
    businessEmail: string;
    businessPhone: string;
    contactPhones: { label: string; value: string }[];
    socialLinks: { platform: string; url: string; icon: string }[];
}

interface SettingsFormProps {
    initialSettings: SettingsState;
    initialContactInfo?: ContactInfo;
}

export function SettingsForm({ initialSettings, initialContactInfo }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState<SettingsState>(initialSettings);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"integrations" | "environment" | "contact">("integrations");
    const { toast } = useToast();

    // Contact & Social Info State
    const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo || {
        businessEmail: "info@xinteck.co.ke",
        businessPhone: "+254 782 063 736",
        contactPhones: [],
        socialLinks: [
           { platform: "WhatsApp", url: "", icon: "MessageCircle" }
        ],
    });

    const handleChange = (key: keyof SettingsState, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setSuccess(false);
    };

    const handleSubmit = () => {
        if (activeTab === "contact") {
            // Save contact info to siteSetting table
            startTransition(async () => {
                try {
                    await upsertSiteSetting({
                        key: "BUSINESS_EMAIL",
                        value: contactInfo.businessEmail,
                        type: "STRING",
                        category: "contact",
                        isPublic: true,
                        description: "Primary business email displayed across the site."
                    });
                    await upsertSiteSetting({
                        key: "BUSINESS_PHONE",
                        value: contactInfo.businessPhone,
                        type: "STRING",
                        category: "contact",
                        isPublic: true,
                        description: "Primary business phone number displayed across the site."
                    });
                    await upsertSiteSetting({
                        key: "CONTACT_PHONES",
                        value: JSON.stringify(contactInfo.contactPhones),
                        type: "JSON",
                        category: "contact",
                        isPublic: true,
                        description: "List of contact phone numbers displayed on the Contact page."
                    });
                    await upsertSiteSetting({
                        key: "SOCIAL_LINKS",
                        value: JSON.stringify(contactInfo.socialLinks),
                        type: "JSON",
                        category: "contact",
                        isPublic: true,
                        description: "List of social media and platform links displayed in the Footer."
                    });
                    setSuccess(true);
                    toast("Contact info updated successfully", "success");
                    setTimeout(() => setSuccess(false), 3000);
                } catch {
                    toast("Failed to update contact info", "error");
                }
            });
            return;
        }

        // C2: Client-side validation using shared settings schema
        const validation = settingsStateSchema.safeParse(formData);
        if (!validation.success) {
             toast(`Validation Failed: ${validation.error.issues[0].message}`, "error");
            return;
        }

        startTransition(async () => {
            await updateSettings(formData);
            setSuccess(true);
            toast("Settings updated successfully", "success");
            setTimeout(() => setSuccess(false), 3000);
        });
    };

    const addContactPhone = () => {
        setContactInfo(prev => ({
            ...prev,
            contactPhones: [...prev.contactPhones, { label: "", value: "" }]
        }));
    };

    const removeContactPhone = (index: number) => {
        setContactInfo(prev => ({
            ...prev,
            contactPhones: prev.contactPhones.filter((_, i) => i !== index)
        }));
    };

    const updateContactPhone = (index: number, field: "label" | "value", val: string) => {
        setContactInfo(prev => ({
            ...prev,
            contactPhones: prev.contactPhones.map((p, i) => i === index ? { ...p, [field]: val } : p)
        }));
    };

    const addSocialLink = () => {
        setContactInfo(prev => ({
            ...prev,
            socialLinks: [...prev.socialLinks, { platform: "New Profile", url: "", icon: "Link" }]
        }));
    };

    const removeSocialLink = (index: number) => {
        setContactInfo(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.filter((_, i) => i !== index)
        }));
    };

    const updateSocialLink = (index: number, field: "platform" | "url" | "icon", val: string) => {
        setContactInfo(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map((s, i) => i === index ? { ...s, [field]: val } : s)
        }));
    };

    return (
    <PageContainer>
            <PageHeader
                title="System Configuration"
                subtitle="Manage your secure credentials, API integrations, and environment status."
                actions={
                  <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <div className="admin-surface-secondary flex gap-1 p-1 rounded-[8px] border border-border backdrop-blur-xs">
                            <button
                                onClick={() => setActiveTab("integrations")}
                                className={`px-3 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-xs ${activeTab === "integrations" ? "bg-gold text-primary-foreground shadow-sm" : "text-[var(--admin-text)]/80 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5"}`}
                            >
                                Integrations
                            </button>
                            <button
                                onClick={() => setActiveTab("contact")}
                                className={`px-3 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-xs ${activeTab === "contact" ? "bg-gold text-primary-foreground shadow-sm" : "text-[var(--admin-text)]/80 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5"}`}
                            >
                                Contact
                            </button>
                            <button
                                onClick={() => setActiveTab("environment")}
                                className={`px-3 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all backdrop-blur-xs ${activeTab === "environment" ? "bg-gold text-primary-foreground shadow-sm" : "text-[var(--admin-text)]/80 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5"}`}
                            >
                                Environment
                            </button>
                        </div>

                      <button 
                          onClick={handleSubmit}
                          disabled={isPending}
                          className="flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[10px] bg-primary text-primary-foreground font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-gold transition-all flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50 shadow-lg shadow-primary/20"
                      >
                          {isPending ? (
                              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>
                          ) : (
                              <>
                                  <Save size={12} className="md:w-4 md:h-4" />
                                  {success ? "Saved!" : "Save Changes"}
                              </>
                          )}
                      </button>
                  </div>
                }
            />

            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
                    
                    {activeTab === "integrations" && (
                        <div className="flex flex-col gap-6">
                            {/* Vercel Section */}
                            <SecretCard 
                                title="Vercel OIDC Token" 
                                description="Required for Vercel remote caching and deployment triggers. Generate an OIDC token in your Vercel Project Settings > Security > Protection Bypass."
                                placeholder="vOidc_..."
                                value={formData.vercelOidcToken}
                                onChange={(val) => handleChange("vercelOidcToken", val)}
                                docsLink="https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-for-automation#oidc-token"
                                docsLabel="Vercel Docs"
                                isSaved={!!initialSettings.vercelOidcToken}
                            />

                            {/* Resend Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50">Email Delivery</h3>
                                <SecretCard 
                                    title="Resend API Key" 
                                    description="Used for sending system emails (magic links, notifications). Get this from the API Keys section in your Resend dashboard."
                                    placeholder="re_..."
                                    value={formData.resendApiKey}
                                    onChange={(val) => handleChange("resendApiKey", val)}
                                    docsLink="https://resend.com/api-keys"
                                    docsLabel="Resend Console"
                                    isSaved={!!initialSettings.resendApiKey}
                                />
                                <div className="bg-white/30 dark:bg-black/60 backdrop-blur-xl shadow-lg rounded-[10px] p-4 md:p-6 border border-[var(--admin-border)]">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input 
                                            label="From Email"
                                            tooltip="Sender identity for outgoing system emails (e.g. invites). Use onboarding@resend.dev for local testing. Best Practice for Production: system@yourdomain.com."
                                            value={formData.resendFromEmail}
                                            onChange={e => handleChange("resendFromEmail", e.target.value)}
                                            placeholder="onboarding@resend.dev"
                                        />
                                        <Input 
                                            label="To Email (Admin)"
                                            tooltip="The actual admin inbox that receives notifications when clients fill out the contact form (e.g. your personal email or admin@yourdomain.com)."
                                            value={formData.resendToEmail}
                                            onChange={e => handleChange("resendToEmail", e.target.value)}
                                            placeholder="admin@xinteck.co.ke"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* AI Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest pl-2 border-l-2 border-purple-500/50">Artificial Intelligence</h3>
                                <SecretCard 
                                    title="Gemini API Key" 
                                    description="Required for the AI Blog Assistant. Get a free API key from Google AI Studio."
                                    placeholder="AIzaSy..."
                                    value={formData.geminiApiKey}
                                    onChange={(val) => handleChange("geminiApiKey", val)}
                                    docsLink="https://aistudio.google.com/app/apikey"
                                    docsLabel="Get API Key"
                                    isSaved={!!initialSettings.geminiApiKey}
                                />
                            </div>

                            {/* Cloudinary Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest pl-2 border-l-2 border-blue-500/50">Media Storage (Cloudinary)</h3>
                                
                                <SecretCard 
                                    title="Cloud Name" 
                                    description="Your unique cloud identifier. Used for building image URLs."
                                    placeholder="dyx..."
                                    value={formData.cloudinaryCloudName}
                                    onChange={(val) => handleChange("cloudinaryCloudName", val)}
                                    docsLink="https://console.cloudinary.com/settings"
                                    docsLabel="Cloudinary Settings"
                                    isSaved={!!initialSettings.cloudinaryCloudName}
                                />

                                <SecretCard 
                                    title="API Key" 
                                    description="Public API Key for signed uploads and management."
                                    placeholder="123456789..."
                                    value={formData.cloudinaryApiKey}
                                    onChange={(val) => handleChange("cloudinaryApiKey", val)}
                                    docsLink="https://console.cloudinary.com/settings/api-keys"
                                    docsLabel="API Keys"
                                    isSaved={!!initialSettings.cloudinaryApiKey}
                                />

                                <SecretCard 
                                    title="API Secret" 
                                    description="The master secret for signing upload requests. Keep this secure."
                                    placeholder="*************"
                                    value={formData.cloudinaryApiSecret}
                                    onChange={(val) => handleChange("cloudinaryApiSecret", val)}
                                    docsLink="https://console.cloudinary.com/settings/api-keys"
                                    docsLabel="API Keys"
                                    isSaved={!!initialSettings.cloudinaryApiSecret}
                                />
                             </div>
                        </div>
                    )}

                    {activeTab === "contact" && (
                        <div className="flex flex-col gap-6">
                            {/* Business Contact Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50">Business Contact</h3>
                                <div className="bg-white/30 dark:bg-black/60 backdrop-blur-xl shadow-lg rounded-[10px] p-4 md:p-6 border border-[var(--admin-border)]">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[var(--admin-text)] font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                                                <Mail size={14} className="text-gold" />
                                                Business Email
                                            </label>
                                            <input
                                                type="email"
                                                value={contactInfo.businessEmail}
                                                onChange={e => setContactInfo(prev => ({ ...prev, businessEmail: e.target.value }))}
                                                placeholder="info@xinteck.co.ke"
                                                className="admin-surface-input rounded-[8px] px-4 py-2.5 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-text)]/30"
                                            />
                                            <p className="text-[10px] text-[var(--admin-text)]/50">Displayed in the footer and contact page.</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[var(--admin-text)] font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                                                <Phone size={14} className="text-gold" />
                                                Business Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={contactInfo.businessPhone}
                                                onChange={e => setContactInfo(prev => ({ ...prev, businessPhone: e.target.value }))}
                                                placeholder="+254 782 063 736"
                                                className="admin-surface-input rounded-[8px] px-4 py-2.5 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-text)]/30"
                                            />
                                            <p className="text-[10px] text-[var(--admin-text)]/50">Displayed in the footer and contact page.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Phones Section */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50">Contact Page Phone Numbers</h3>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        icon={<Plus size={12} />}
                                        onClick={addContactPhone}
                                    >
                                        Add Number
                                    </Button>
                                </div>
                                <div className="bg-white/30 dark:bg-black/60 backdrop-blur-xl shadow-lg rounded-[10px] p-4 md:p-6 border border-[var(--admin-border)]">
                                    {contactInfo.contactPhones.length === 0 ? (
                                        <p className="text-center text-[var(--admin-text)]/40 text-sm py-6">No phone numbers added. Click &quot;Add Number&quot; to add one.</p>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {contactInfo.contactPhones.map((phone, i) => (
                                                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                                                    <div className="flex flex-col gap-1">
                                                        {i === 0 && <label className="text-[var(--admin-text)]/60 font-bold text-[10px] uppercase tracking-widest">Label</label>}
                                                        <input
                                                            type="text"
                                                            value={phone.label}
                                                            onChange={e => updateContactPhone(i, "label", e.target.value)}
                                                            placeholder="Main"
                                                            className="admin-surface-input rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-text)]/30"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {i === 0 && <label className="text-[var(--admin-text)]/60 font-bold text-[10px] uppercase tracking-widest">Phone Number</label>}
                                                        <input
                                                            type="tel"
                                                            value={phone.value}
                                                            onChange={e => updateContactPhone(i, "value", e.target.value)}
                                                            placeholder="+254 700 000 000"
                                                            className="admin-surface-input rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-text)]/30"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeContactPhone(i)}
                                                        className="p-2 text-[var(--admin-text)]/40 hover:text-red-400 hover:bg-red-500/10 rounded-[8px] transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-[var(--admin-text)]/50 pl-2">These numbers are shown on the Contact page under &quot;Call Us&quot;.</p>
                            </div>

                            {/* Social Links Section */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[var(--admin-text)] font-black text-[10px] md:text-xs uppercase tracking-widest pl-2 border-l-2 border-primary/50">Social & Platform Links</h3>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        icon={<Plus size={12} />}
                                        onClick={addSocialLink}
                                    >
                                        Add Profile
                                    </Button>
                                </div>
                                <div className="bg-white/30 dark:bg-black/60 backdrop-blur-xl shadow-lg rounded-[10px] p-4 md:p-6 border border-[var(--admin-border)]">
                                    {contactInfo.socialLinks.length === 0 ? (
                                        <p className="text-center text-[var(--admin-text)]/40 text-sm py-6">No social links added. Click &quot;Add Profile&quot; to add one.</p>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {contactInfo.socialLinks.map((social, i) => (
                                                <div key={i} className="grid grid-cols-[120px_1fr_100px_auto] md:grid-cols-[150px_1fr_120px_auto] gap-3 items-end">
                                                    <div className="flex flex-col gap-1">
                                                        {i === 0 && <label className="text-[var(--admin-text)]/60 font-bold text-[10px] uppercase tracking-widest">Platform</label>}
                                                        <select
                                                            value={social.platform}
                                                            onChange={e => updateSocialLink(i, "platform", e.target.value)}
                                                            className="admin-surface-input rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors"
                                                        >
                                                            <option value="WhatsApp" className="bg-white dark:bg-zinc-900 text-black dark:text-white">WhatsApp</option>
                                                            <option value="Twitter" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Twitter / X</option>
                                                            <option value="Instagram" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Instagram</option>
                                                            <option value="LinkedIn" className="bg-white dark:bg-zinc-900 text-black dark:text-white">LinkedIn</option>
                                                            <option value="Github" className="bg-white dark:bg-zinc-900 text-black dark:text-white">GitHub</option>
                                                            <option value="Facebook" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Facebook</option>
                                                            <option value="Youtube" className="bg-white dark:bg-zinc-900 text-black dark:text-white">YouTube</option>
                                                            <option value="Tiktok" className="bg-white dark:bg-zinc-900 text-black dark:text-white">TikTok</option>
                                                            <option value="Other" className="bg-white dark:bg-zinc-900 text-black dark:text-white">Other</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {i === 0 && <label className="text-[var(--admin-text)]/60 font-bold text-[10px] uppercase tracking-widest">Profile URL</label>}
                                                        <input
                                                            type="url"
                                                            value={social.url}
                                                            onChange={e => updateSocialLink(i, "url", e.target.value)}
                                                            placeholder="https://wa.me/..."
                                                            className="admin-surface-input rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-text)]/30"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        {i === 0 && <label className="text-[var(--admin-text)]/60 font-bold text-[10px] uppercase tracking-widest">Lucide Icon</label>}
                                                        <input
                                                            type="text"
                                                            value={social.icon}
                                                            onChange={e => updateSocialLink(i, "icon", e.target.value)}
                                                            placeholder="MessageCircle"
                                                            className="admin-surface-input rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-sm font-bold border border-[var(--admin-border)] outline-none focus:border-gold/50 transition-colors placeholder:text-[var(--admin-text)]/30"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSocialLink(i)}
                                                        className="p-2 text-[var(--admin-text)]/40 hover:text-red-400 hover:bg-red-500/10 rounded-[8px] transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] text-[var(--admin-text)]/50 pl-2">WARNING: To update the site-wide WhatsApp buttons, make sure the Platform is exactly &quot;WhatsApp&quot;.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === "environment" && (
                        <div className="flex flex-col gap-4">
                             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-[12px] flex gap-3 text-blue-200 text-xs leading-relaxed">
                                <Shield className="shrink-0" size={16} />
                                <p>These variables are set at the system level (e.g. Vercel Environment Variables or .env file). They cannot be changed here for security reasons. If any are missing, add them to your deployment configuration and redeploy.</p>
                             </div>

                             <StatusCard 
                                title="Primary Database" 
                                envKey="DATABASE_URL" 
                                isConfigured={!!initialSettings.envStatus?.databaseUrl}
                                description="The main connection string for your PostgreSQL database. Must support connection pooling if using serverless."
                                docsLink="https://www.prisma.io/docs/orm/overview/databases/postgresql"
                             />

                             <StatusCard 
                                title="Encryption Master Key" 
                                envKey="ENCRYPTION_KEY" 
                                isConfigured={!!initialSettings.envStatus?.encryptionKey}
                                description="A 32-character hex string used to encrypt all secrets in this database. If this key is lost, all secrets (above) become unrecoverable."
                                docsLink="https://generate-random.org/encryption-key-generator"
                                docsLabel="Generator"
                             />

                             <div className="grid md:grid-cols-2 gap-4">
                                <StatusCard 
                                    title="NextAuth Secret" 
                                    envKey="NEXTAUTH_SECRET" 
                                    isConfigured={!!initialSettings.envStatus?.nextAuthSecret}
                                    description="Used to sign session cookies and JWTs. Critical for auth security."
                                    docsLink="https://next-auth.js.org/configuration/options#secret"
                                />
                                <StatusCard 
                                    title="Prisma Direct URL" 
                                    envKey="PRISMA_DATABASE_URL" 
                                    isConfigured={!!initialSettings.envStatus?.prismaDatabaseUrl}
                                    description="Direct database connection for running migrations."
                                />
                             </div>
                        </div>
                    )}

                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white/30 dark:bg-black/60 backdrop-blur-xl shadow-lg rounded-[10px] p-6 flex flex-col gap-4 sticky top-24 border border-[var(--admin-border)]">
                        <h3 className="font-bold text-[var(--admin-text)] text-xs md:text-sm border-b border-[var(--admin-border)] pb-2 uppercase tracking-wider">Encrypted Storage</h3>
                        
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-green-400">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--admin-text)] text-xs">AES-256-GCM</h4>
                                <p className="text-[10px] text-[var(--admin-text)]/80 leading-relaxed mt-1">
                                    All secrets are encrypted at rest using industry-standard AES-256-GCM authenticated encryption. The initialization vector (IV) is stored with each secret.
                                </p>
                            </div>
                        </div>
                        
                        <div className="h-px bg-[var(--admin-border)] my-1" />

                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-primary">
                                <KeyIcon size={16} /> 
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--admin-text)] text-xs">Master Key Protection</h4>
                                <p className="text-[10px] text-[var(--admin-text)]/80 leading-relaxed mt-1">
                                    Your <code className="bg-[var(--admin-text)]/10 px-1 rounded">ENCRYPTION_KEY</code> is never stored in the database. It exists only in memory during runtime.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    </PageContainer>
    );
}
