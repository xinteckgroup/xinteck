"use client";

import { Button } from "@/components/admin/ui/Button";
import { Select } from "@/components/admin/ui/Select";
import { Check, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AvatarPickerProps {
    currentAvatar?: string;
    onSelect: (url: string) => void;
    seedName: string; // Used for default generation
}

export function AvatarPicker({ currentAvatar, onSelect, seedName }: AvatarPickerProps) {
    const [seeds, setSeeds] = useState<string[]>([]);
    const [selected, setSelected] = useState<string>(currentAvatar || "");
    const [isShuffling, setIsShuffling] = useState(false);
    const [gender, setGender] = useState("all");

    // Generate random seeds
    const generateSeeds = () => {
        setIsShuffling(true);
        const newSeeds = Array.from({ length: 20 }, () => Math.random().toString(36).substring(7));
        setSeeds(newSeeds);
        setTimeout(() => setIsShuffling(false), 500);
    };

    // Initial load
    useEffect(() => {
        generateSeeds();
     
    }, []);

    // Update local state if prop changes
    useEffect(() => {
        if (currentAvatar) setSelected(currentAvatar);
    }, [currentAvatar]);

    const handleSelect = (url: string) => {
        setSelected(url);
        onSelect(url);
    };

    const getUrl = (seed: string) => {
        let base = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
        if (gender === "male") base += "&facialHairProbability=50";
        if (gender === "female") base += "&facialHairProbability=0";
        return base;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[var(--admin-text)] uppercase tracking-wider whitespace-nowrap">
                        Choose Avatar
                    </label>
                    <div className="w-[150px]">
                        <Select
                            value={gender}
                            onChange={(e) => {
                                setGender(e.target.value);
                                generateSeeds();
                            }}
                            options={[
                                { value: "all", label: "All Styles" },
                                { value: "male", label: "Male" },
                                { value: "female", label: "Female" },
                            ]}
                            className="bg-transparent"
                        />
                    </div>
                </div>
                <Button 
                    variant="primary"
                    onClick={(e) => { e.preventDefault(); generateSeeds(); }}
                    disabled={isShuffling}
                    className="bg-gold text-primary-foreground font-bold h-9 px-4 text-[10px] md:text-sm rounded-[10px] flex items-center gap-1 md:gap-2 hover:bg-gold/90 transition-colors shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] whitespace-nowrap"
                >
                    <RefreshCw size={14} className={`md:w-[16px] md:h-[16px] ${isShuffling ? "animate-spin" : ""}`} />
                    Shuffle
                </Button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
                {seeds.map((seed) => {
                    const url = getUrl(seed);
                    const isSelected = selected === url;
                    
                    return (
                        <button
                            key={seed}
                            onClick={(e) => { e.preventDefault(); handleSelect(url); }}
                            className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all ${isSelected ? "border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110 z-10" : "border-[var(--admin-border)] hover:border-[var(--admin-text)] hover:scale-105"}`}
                        >
                            <div className="admin-surface-input w-full h-full bg-[var(--admin-surface-input)]">
                                <Image 
                                    src={url} 
                                    alt="Avatar option" 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                            {isSelected && (
                                <div className="absolute inset-0 bg-gold/20 flex items-center justify-center backdrop-blur-[1px]">
                                    <Check size={16} className="text-gold drop-shadow-md" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            
            <p className="text-[10px] text-[var(--admin-text)]/40 text-center pt-2">
                Powered by DiceBear Avatars
            </p>
        </div>
    );
}
