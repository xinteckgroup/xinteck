"use client";

import { searchGlobal, SearchGroup, SearchResult } from "@/actions/search";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";
import { Command, FileText, Folder, Layers, Layout, Loader2, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    // Flatten results for keyboard navigation: [Result, Result, ...]
    const flatResults: SearchResult[] = [];
    results.forEach(group => {
        flatResults.push(...group.results);
    });

    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close on click outside
    useOnClickOutside(containerRef, () => setOpen(false));

    // Debounced Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                setOpen(false);
                return;
            }

            setLoading(true);
            setOpen(true); // Open immediately to show loading if desired, or wait
            
            try {
                const data = await searchGlobal(query);
                setResults(data);
                setSelectedIndex(0);
            } catch (error) {
                console.error("Search failed", error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (result: SearchResult) => {
        setOpen(false);
        setQuery("");
        router.push(result.url);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // If not open, maybe open on Down?
        if (!open && query.length >= 2) {
            setOpen(true);
        }

        if (!open || flatResults.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % flatResults.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            handleSelect(flatResults[selectedIndex]);
        } else if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
        }
    };

    const getIcon = (type: SearchResult['type']) => {
        switch (type) {
            case 'user': return <User size={14} className="text-blue-400" />;
            case 'project': return <Folder size={14} className="text-purple-400" />;
            case 'post': return <FileText size={14} className="text-green-400" />;
            case 'service': return <Layers size={14} className="text-orange-400" />;
            case 'page': return <Layout size={14} className="text-gold" />;
            default: return <Command size={14} />;
        }
    };

    return (
        <div className="relative w-full md:w-64 lg:w-96 block bg-black/60 dark:bg-white/30 rounded-[10px]" ref={containerRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                <input 
                    ref={inputRef}
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (query.length >= 2) setOpen(true); }}
                    placeholder="Search users, projects, posts..." 
                    className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-10 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 size={16} className="animate-spin text-gold" />
                    </div>
                )}
            </div>

            {open && (query.length >= 2) && (
                <div className="fixed top-[74px] left-2 right-2 md:absolute md:top-full md:left-0 md:w-full md:inset-x-auto md:mt-2 admin-surface-floating rounded-[10px] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                    {results.length === 0 && !loading ? (
                        <div className="p-4 text-center text-sm text-[var(--admin-muted)]">
                            No results found.
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto">
                            {results.map((group) => {
                                return (
                                <div key={group.label}>
                                    <div className="px-3 py-1.5 text-[10px] font-bold text-[var(--admin-muted)] uppercase tracking-wider sticky top-0 admin-surface-secondary z-10 border-b border-[var(--admin-border)] rounded-none">
                                        {group.label}
                                    </div>
                                    <div>
                                        {group.results.map((result) => {
                                            const globalIndex = flatResults.indexOf(result);
                                            const isSelected = globalIndex === selectedIndex;

                                            return (
                                                <button
                                                    key={result.type + result.id}
                                                    onClick={() => handleSelect(result)}
                                                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors border-l-2",
                                                        isSelected ? "admin-surface-secondary border-gold" : "hover:bg-[var(--admin-text)]/5 border-transparent"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                                        isSelected ? "bg-gold/10 text-gold" : "admin-surface-input text-[var(--admin-muted)]"
                                                    )}>
                                                        {getIcon(result.type)}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className={cn("text-sm font-medium truncate", isSelected ? "text-[var(--admin-text)]" : "text-[var(--admin-text)]/70")}>
                                                            {result.title}
                                                        </p>
                                                        <p className={cn("text-xs truncate", isSelected ? "text-gold" : "text-[var(--admin-muted)]")}>
                                                            {result.subtitle}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="text-[10px] text-gold font-mono hidden sm:block shrink-0">
                                                            Jump ↵
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                    <div className="px-3 py-2 admin-surface-secondary border-t border-[var(--admin-border)] text-[10px] text-[var(--admin-muted)] flex justify-between">
                        <span>Navigate with <kbd className="font-sans admin-surface-primary px-1 rounded text-[var(--admin-text)]">↑</kbd> <kbd className="font-sans admin-surface-primary px-1 rounded text-[var(--admin-text)]">↓</kbd></span>
                        <span>Select with <kbd className="font-sans admin-surface-primary px-1 rounded text-[var(--admin-text)]">Enter</kbd></span>
                    </div>
                </div>
            )}
        </div>
    );
}
