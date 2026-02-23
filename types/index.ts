export type IconName = "activity" | "fileText" | "messageSquare" | "monitor" | "inbox" | "blog" | "file" | "system";

export interface DashboardStat {
    title: string;
    value: string;
    trend: string;
    isPositive: boolean;
    iconName: IconName;
    href: string;
    color: string;
}

export interface RecentActivity {
    id: string;
    user: string;
    action: string;
    time: string;
    type: IconName;
}

export interface InboxMessage {
    id: string;
    sender: string;
    email: string;
    subject: string;
    preview: string;
    message: string;
    date: string;
    unread: boolean;
    starred: boolean;
    archived: boolean;
    replied: boolean;
    color: string;
    avatar: string;
    phone: string;
    service: string | null;
    projectType: string;
    industry: string;
    budget: string | null;
    assignedTo?: { id: string; name: string; avatar: string | null } | null;
}

export interface NewsletterSubscriber {
    id: string;
    email: string;
    isActive: boolean;
    source: string;
    subscribedAt: string;
    unsubscribedAt: string | null;
}

export interface BlogPostSummary {
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    views: string;
    date: string;
    author: string;
}

export interface ProjectSummary {
    id: string;
    title: string;
    client: string;
    category: string;
    status: string;
    image: string | null;
}
