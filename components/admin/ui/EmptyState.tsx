import { ReactNode } from "react";

interface EmptyStateProps {
    icon: ReactNode;
    message: string;
    action?: ReactNode;
}

export function EmptyState({ icon, message, action }: EmptyStateProps) {
    return (
        <div className="p-12 text-center text-muted-foreground italic flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full admin-surface-input flex items-center justify-center">
                {icon}
            </div>
            <span className="text-xs md:text-sm">{message}</span>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
