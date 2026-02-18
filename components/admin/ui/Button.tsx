import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-gold text-primary-foreground font-bold hover:bg-gold/90",
        secondary: "admin-surface-secondary text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-text)]/5 font-bold",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 font-bold",
        ghost: "text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5",
        outline: "border border-[var(--admin-border)] text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 font-bold",
        glass: "bg-[var(--admin-background)]/20 border border-[var(--admin-border)]/50 text-[var(--admin-text)] hover:bg-[var(--admin-background)]/30 hover:border-[var(--admin-border)] backdrop-blur-md",
      },
      size: {
        sm: "px-2.5 py-1 text-[10px] md:text-xs rounded-md gap-1",
        md: "px-3 py-1.5 md:px-4 md:py-2 text-[10px] md:text-sm rounded-lg gap-1.5",
        lg: "px-4 py-2 md:px-6 md:py-3 text-sm md:text-base rounded-xl gap-2",
        icon: "h-9 w-9 rounded-md", 
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    loading?: boolean;
    icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { variant, size, loading, icon, children, className, disabled, ...props },
    ref
) {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : icon ? (
                <span className="shrink-0">{icon}</span>
            ) : null}
            {children}
        </button>
    );
});

export { Button, buttonVariants };
