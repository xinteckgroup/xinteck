import { PasswordInput } from "@/components/admin/ui/PasswordInput";
import { ExternalLink, Lock } from "lucide-react";

interface SecretCardProps {
    title: string;
    description: string;
    value?: string;
    onChange: (val: string) => void;
    placeholder?: string;
    docsLink?: string;
    docsLabel?: string;
    isSaved?: boolean;
}

export function SecretCard({ 
    title, 
    description, 
    value, 
    onChange, 
    placeholder, 
    docsLink, 
    docsLabel,
    isSaved 
}: SecretCardProps) {
    const isMasked = value && (value.includes("...") || value.includes("****"));

    return (
        <div className="admin-surface-primary rounded-[10px] p-4 md:p-6 flex flex-col gap-4 relative border border-[var(--admin-border)] backdrop-blur-xs">
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">
                        <Lock size={14} />
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--admin-text)] text-sm md:text-base">{title}</h3>
                        <p className="text-xs text-[var(--admin-text)]/80 leading-relaxed mt-1 max-w-xl">
                            {description}
                        </p>
                    </div>
                </div>
                 {docsLink && (
                    <a 
                        href={docsLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)] hover:text-gold transition-colors shrink-0 admin-surface-input hover:bg-[var(--admin-text)]/5 px-2 py-1 rounded-md h-fit border border-[var(--admin-border)]"
                    >
                        <span>{docsLabel || "Guide"}</span>
                        <ExternalLink size={10} />
                    </a>
                )}
            </div>

            <div className="pl-0 md:pl-[44px]">
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-[var(--admin-text)] uppercase tracking-widest">Secret Value</label>
                    <div className="relative">
                        <PasswordInput 
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="font-mono text-sm"
                        />
                        {isSaved && isMasked && (
                            <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                <span className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    Encrypted
                                </span>
                            </div>
                        )}
                    </div>
                     <p className="text-[10px] text-[var(--admin-text)]/60">
                        Values are encrypted with AES-256-GCM before storage. Only the Super Admin can decrypt.
                    </p>
                </div>
            </div>
        </div>
    );
}
