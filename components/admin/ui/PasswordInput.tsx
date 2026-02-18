
"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, leftIcon, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState(false);

        return (
            <div className="relative w-full">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none z-10">
                        {leftIcon}
                    </div>
                )}
                
                <input
                    type={isVisible ? "text" : "password"}
                    className={cn(
                        "w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] py-3 text-[var(--admin-text)] placeholder:text-[var(--admin-text)]/70 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-all",
                        leftIcon ? "pl-10" : "pl-4",
                        "pr-10", // Space for toggle button
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-text)] hover:text-[var(--admin-text)] transition-colors z-10 flex items-center justify-center bg-transparent border-none outline-none focus:outline-none"
                    aria-label={isVisible ? "Hide password" : "Show password"}
                >
                    {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
