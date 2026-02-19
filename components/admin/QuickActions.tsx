"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { Cloud, Code, FileText, Target } from "lucide-react";
import Link from "next/link";

const QUICK_ACTIONS = [
    { label: "New Article", icon: FileText, href: "/admin/blog/new", desc: "Write a blog post" },
    { label: "Add Project", icon: Code, href: "/admin/projects/new", desc: "Showcase work" },
    { label: "Upload File", icon: Cloud, href: "/admin/files", desc: "Media library" },
    { label: "View Leads", icon: Target, href: "/admin/leads", desc: "Client inquiries" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
      {QUICK_ACTIONS.map((action, index) => {
        const Icon = action.icon;
        return (
          <Link href={action.href} key={action.label} className="block h-full">
            <div
              className="group flex flex-col items-center justify-center gap-2 md:gap-3 p-2 md:p-4 rounded-[10px] admin-surface-primary hover:bg-gold/10 hover:border-gold/30 transition-all text-center h-full"
            >
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-full admin-surface-input flex items-center justify-center group-hover:bg-gold group-hover:text-primary-foreground text-gold transition-colors">
                <Icon size={16} className="md:w-6 md:h-6" />
              </div>
              <div>
                <span className={`block ${TYPOGRAPHY.button} text-[var(--admin-text)] mb-0.5`}>{action.label}</span>
                <span className={`block ${TYPOGRAPHY.cardSubtitle} text-[var(--admin-text)]/60 leading-tight`}>{action.desc}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
