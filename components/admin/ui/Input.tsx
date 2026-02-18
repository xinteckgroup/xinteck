import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { label, icon, error, className = "", ...props },
    ref
) {
    return (
        <div className="flex flex-col gap-1 md:gap-2">
            {label && (
                <label className="text-[8px] md:text-xs font-bold text-[var(--admin-text)] uppercase tracking-wide">{label}</label>
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
