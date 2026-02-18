type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
    size?: LoaderSize;
    className?: string;
    label?: string;
}

const sizeMap: Record<LoaderSize, string> = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
};

export function Loader({ size = "md", className = "", label }: LoaderProps) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
            <span className={`${sizeMap[size]} border-muted-foreground/20 border-t-gold rounded-full animate-spin`} />
            {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
    );
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
    return (
        <div className="flex items-center justify-center p-20">
            <Loader size="lg" label={label} />
        </div>
    );
}
