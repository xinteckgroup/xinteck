"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ServiceToolbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentSearch = searchParams.get("search") || "";

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (term) params.set("search", term);
        else params.delete("search");
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="flex flex-row items-center gap-2 justify-between admin-surface-primary rounded-[10px] p-2 backdrop-blur-md mb-6">
            <div className="relative flex-1 min-w-0 md:w-64 lg:w-96">
                <div className="relative bg-black/60 dark:bg-white/30 rounded-[10px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search services..." 
                        defaultValue={currentSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
