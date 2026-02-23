import { Info } from "lucide-react";
import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
    tooltip?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, icon, error, tooltip, className = "", ...props },
    ref
) {
    return (
        <div className="flex flex-col gap-1 md:gap-2">
            {label && (
                <div className="flex items-center gap-1.5 group/label cursor-help w-max">
                    <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase tracking-wide cursor-help">{label}</label>
                    {tooltip && (
                        <div className="relative flex items-center">
                            <Info size={12} className="text-[var(--admin-muted)] group-hover/label:text-gold transition-colors" />
                            <div className="absolute left-1/2 -top-2 -translate-x-1/2 -translate-y-full w-56 sm:w-64 bg-zinc-900 border border-zinc-700/50 text-white text-[10px] p-2.5 rounded-md opacity-0 invisible group-hover/label:opacity-100 group-hover/label:visible transition-all duration-200 z-50 shadow-2xl pointer-events-none before:content-[''] before:absolute before:bottom-[-5px] before:left-1/2 before:-translate-x-1/2 before:border-l-[5px] before:border-l-transparent before:border-r-[5px] before:border-r-transparent before:border-t-[5px] before:border-t-zinc-900 font-medium normal-case tracking-normal leading-relaxed text-center">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-text)]/60">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={`w-full admin-surface-input rounded-[10px] px-3 md:px-4 py-2 md:py-3 text-[var(--admin-text)] text-xs md:text-sm outline-none placeholder:text-[var(--admin-text)]/70 ${
                        icon ? "pl-9" : ""
                    } ${
                        error ? "border-destructive/50 focus:border-destructive" : "focus:border-gold/50"
                    } ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="text-[10px] text-destructive">{error}</span>}
        </div>
    );
});
