"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { IconName } from "@/types";
import { motion } from "framer-motion";
import { Activity, ArrowDown, ArrowUp, File, FileText, Inbox, LucideIcon, MessageSquare, Monitor, Newspaper, Server } from "lucide-react";
import Link from "next/link";

// Map icon names to actual Lucide components
const iconMap: Record<IconName, LucideIcon> = {
  activity: Activity,
  fileText: FileText,
  messageSquare: MessageSquare,
  monitor: Monitor,
  inbox: Inbox,
  blog: Newspaper,
  file: File,
  system: Server
};

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  iconName?: IconName;
  href?: string;
  color?: string;
}

export function StatsCard({ title, value, trend, isPositive, iconName = "activity", href }: StatsCardProps) {
  const Icon = iconMap[iconName] ?? Activity;
  
  const Content = (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`p-2.5 md:p-6 rounded-[10px] admin-surface-primary backdrop-blur-xs relative overflow-hidden group h-full ${href ? 'cursor-pointer hover:border-gold/30' : ''}`}
    >
      <div className="flex justify-between items-start mb-2 md:mb-4">
        <div>
          <p className={`${TYPOGRAPHY.cardSubtitle} text-[var(--admin-text)]/80 mb-0.5 md:mb-1 block`}>{title}</p>
          <h3 className={`${TYPOGRAPHY.pageTitle} text-[var(--admin-text)]`}>{value}</h3>
        </div>
        <div className="w-7 h-7 md:w-10 md:h-10 rounded-[8px] md:rounded-[10px] bg-gold/40 flex items-center justify-center text-gold border border-gold/20 group-hover:bg-gold group-hover:text-primary-foreground transition-colors">
          <Icon size={14} className="md:hidden" />
          <Icon size={20} className="hidden md:block" />
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
        <span className={`flex items-center ${TYPOGRAPHY.badge} px-1.5 py-0.5 rounded-[4px] ${
          isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        }`}>
          {isPositive ? <ArrowUp size={10} className="mr-0.5 md:mr-1" /> : <ArrowDown size={10} className="mr-0.5 md:mr-1" />}
          {trend}
        </span>
        <span className={`${TYPOGRAPHY.meta} text-[var(--admin-text)]/60 hidden sm:inline`}>vs last month</span>
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href}>
        {Content}
      </Link>
    );
  }

  return Content;
}
