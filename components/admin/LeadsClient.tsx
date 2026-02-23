"use client";

import { archiveMessage, assignLead, deleteMessage, markAsRead, replyToMessage, toggleStar } from "@/actions/leads";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader, Pagination, useToast } from "@/components/admin/ui";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { InboxMessage } from "@/types";
import { Role } from "@prisma/client";
import { Archive, ArrowLeft, Check, ClipboardCopy, ExternalLink, Mail, MailOpen, MoreVertical, Reply, Search, Send, Star, Target, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { PaginatedResponse } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface LeadsClientProps {
  initialData: PaginatedResponse<InboxMessage>;
  adminUsers: { id: string; name: string; email: string; avatar: string | null; role: Role }[];
  currentUserRole: Role;
}

// Lead status helper
function getLeadStatus(msg: InboxMessage): { label: string; color: string; bgColor: string; borderColor: string } {
  if (msg.archived) return { label: "Archived", color: "text-[var(--admin-muted)]", bgColor: "bg-[var(--admin-text)]/5", borderColor: "border-[var(--admin-border)]" };
  if (msg.replied) return { label: "Responded", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/20" };
  if (!msg.unread) return { label: "Read", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/20" };
  return { label: "New", color: "text-gold", bgColor: "bg-gold/10", borderColor: "border-gold/20" };
}

export function LeadsClient({ initialData, adminUsers, currentUserRole }: LeadsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const filterParam = searchParams.get("filter");
  type FilterType = "all" | "unread" | "starred" | "archived";
  const activeFilter = (filterParam as FilterType) || "all";
  
  const [messages, setMessages] = useState<InboxMessage[]>(initialData.data);
  const [meta, setMeta] = useState({
      page: initialData.page,
      totalPages: initialData.totalPages,
      total: initialData.total
  });
  
  useEffect(() => {
      setMessages(initialData.data);
      setMeta({
          page: initialData.page,
          totalPages: initialData.totalPages,
          total: initialData.total
      });
  }, [initialData]);

  const [activeMessageId, setActiveMessageId] = useState<string | null>(initialData.data.length > 0 ? initialData.data[0].id : null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const activeMessage = messages.find((m) => m.id === activeMessageId) || null;

  const handleTabChange = (newFilter: string) => {
      router.push(`/admin/leads?filter=${newFilter}`);
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = m.sender.toLowerCase().includes(query) || 
                            m.subject.toLowerCase().includes(query) ||
                            m.email.toLowerCase().includes(query) ||
                            m.message.toLowerCase().includes(query);
      return matchesSearch;
    });
  }, [messages, searchQuery]);

  const handleReadToggle = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    const newStatus = !msg.unread;
    setMessages(prev => prev.map((m) => m.id === id ? { ...m, unread: !newStatus } : m));

    startTransition(async () => {
        await markAsRead(id, !newStatus); 
        router.refresh();
    });
  };

  const handleStarToggle = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMessages(prev => prev.map((m) => m.id === id ? { ...m, starred: !m.starred } : m));

    startTransition(async () => {
        await toggleStar(id);
        router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const id = deleteId;
    setDeleteId(null);
    
    setMessages(prev => prev.filter((m) => m.id !== id));
    if (activeMessageId === id) setActiveMessageId(null);
    
    startTransition(async () => {
        await deleteMessage(id);
        router.refresh();
    });
  };

  const handleArchive = (id: string) => {
     setMessages(prev => prev.filter((m) => m.id !== id));
     if (activeMessageId === id) setActiveMessageId(null);
     
     startTransition(async () => {
         await archiveMessage(id);
         router.refresh();
     });
  };

  const handleSendReply = () => {
    if (!replyText || !activeMessage) return;
    setIsReplying(true);
    
    startTransition(async () => {
      try {
        await replyToMessage(activeMessage.id, replyText);
        setReplyText("");
        setMessages(prev => prev.map((m) => m.id === activeMessage.id ? { ...m, replied: true } : m));
        toast("Reply sent — continue the conversation in Gmail", "success");
      } catch (e: any) {
        toast(`Failed to send: ${e.message}`, "error");
      } finally {
        setIsReplying(false);
      }
    });
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast("Email copied to clipboard", "success");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleAssignLead = (userId: string | null) => {
    if (!activeMessage) return;
    setIsAssigning(true);
    startTransition(async () => {
        try {
            await assignLead(activeMessage.id, userId);
            setMessages(prev => prev.map(m => m.id === activeMessage.id ? { 
                ...m, 
                assignedTo: userId ? adminUsers.find(u => u.id === userId) : null
            } : m));
            toast(userId ? "Lead assigned successfully" : "Lead unassigned", "success");
        } catch (e: any) {
            toast(`Failed to assign lead: ${e.message}`, "error");
        } finally {
            setIsAssigning(false);
        }
    });
  };

  const getGmailSearchUrl = (email: string) => {
    return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(email)}`;
  };

  return (
    <PageContainer className="h-[calc(100vh-140px)]">
      <PageHeader 
        title="Leads" 
        subtitle="Capture, respond, and convert."
      />

      <div className="flex flex-1 gap-4 md:gap-6 min-h-0">
        {/* Sidebar/List */}
        <div className={cn(
          "w-full lg:w-80 xl:w-96 flex flex-col admin-surface-primary backdrop-blur-xs rounded-[10px] border border-[var(--admin-border)] overflow-hidden min-w-0 shadow-xl",
          activeMessageId ? 'hidden lg:flex' : 'flex'
        )}>
          <div className="p-3 md:p-4 border-b border-[var(--admin-border)] flex flex-col gap-3 admin-surface-secondary/50">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Target size={16} className="text-gold" />
                  <h3 className="text-[14px] font-bold text-[var(--admin-text)] uppercase tracking-wider">Leads</h3>
                  <span className="bg-gold/10 text-gold border border-gold/20 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold shadow-[0_0_10px_-3px_rgba(255,215,0,0.2)]">
                     {initialData.total}
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-1 admin-surface-input p-1 rounded-[8px] border border-[var(--admin-border)]">
               <button 
                  onClick={() => handleTabChange("all")} 
                  className={cn(
                    "py-1.5 rounded-[6px] text-xs font-bold transition-all",
                    activeFilter === 'all' 
                      ? "admin-surface-floating text-[var(--admin-text)] shadow-sm border border-[var(--admin-border)]" 
                      : "text-[var(--admin-text)]/40 hover:text-[var(--admin-text)]"
                  )}
               >
                  All
               </button>
               <button 
                  onClick={() => handleTabChange("unread")} 
                  className={cn(
                    "py-1.5 rounded-[6px] text-xs font-bold transition-all",
                    activeFilter === 'unread' 
                      ? "admin-surface-floating text-[var(--admin-text)] shadow-sm border border-[var(--admin-border)]" 
                      : "text-[var(--admin-text)]/40 hover:text-[var(--admin-text)]"
                  )}
               >
                  New
               </button>
               <button 
                  onClick={() => handleTabChange("starred")} 
                  className={cn(
                    "py-1.5 rounded-[6px] text-xs font-bold transition-all",
                    activeFilter === 'starred' 
                      ? "admin-surface-floating text-[var(--admin-text)] shadow-sm border border-[var(--admin-border)]" 
                      : "text-[var(--admin-text)]/40 hover:text-[var(--admin-text)]"
                  )}
               >
                  Starred
               </button>
            </div>
             
             <div className="relative bg-black/60 dark:bg-white/30 rounded-[10px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] pointer-events-none" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search leads..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                  />
                </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredMessages.map((msg) => {
              const status = getLeadStatus(msg);
              return (
              <div 
                key={msg.id} 
                onClick={() => setActiveMessageId(msg.id)}
                className={cn(
                  "p-3 md:p-4 border-b border-[var(--admin-border)] cursor-pointer hover:bg-[var(--admin-text)]/5 transition-all group relative",
                  activeMessageId === msg.id && "bg-[var(--admin-text)]/5",
                  msg.unread && "border-l-2 border-l-gold"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className={cn(
                      "text-xs md:text-sm truncate",
                      msg.unread ? "font-bold text-[var(--admin-text)]" : "font-medium text-[var(--admin-text)]/60"
                    )}>{msg.sender}</h4>
                    <span className={cn(
                      "shrink-0 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
                      status.color, status.bgColor, status.borderColor
                    )}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                     {msg.starred && <Star size={10} className="text-gold fill-gold" />}
                     <span className="text-[10px] font-bold text-[var(--admin-text)]/40 uppercase tracking-tighter">{msg.date}</span>
                  </div>
                </div>
                <p className={cn(
                  "text-xs mb-1 truncate pr-6",
                  msg.unread ? "text-[var(--admin-text)] font-semibold" : "text-[var(--admin-text)]/70 font-medium"
                )}>{msg.subject}</p>
                <p className="text-[12px] text-[var(--admin-text)]/40 truncate">{msg.preview}</p>
                
                {/* Quick Actions on Hover */}
                <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => handleStarToggle(msg.id, e)} className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded text-[var(--admin-text)]/40 hover:text-gold"><Star size={12} className={msg.starred ? "fill-gold text-gold" : ""} /></button>
                   <button onClick={(e) => handleReadToggle(msg.id, e)} className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded text-[var(--admin-text)]/40 hover:text-[var(--admin-text)]" title={msg.unread ? "Mark Read" : "Mark Unread"}>
                      {msg.unread ? <MailOpen size={12} /> : <Mail size={12} />}
                   </button>
                   <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                     <button onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }} className="p-1.5 hover:bg-[var(--admin-text)]/5 rounded text-[var(--admin-text)]/40 hover:text-red-400"><Trash2 size={12} /></button>
                   </RoleGate>
                </div>
              </div>
            )})}
            {filteredMessages.length === 0 && (
               <div className="p-12 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full admin-surface-input flex items-center justify-center text-[var(--admin-text)]/20 border border-dashed border-[var(--admin-border)]">
                    <Target size={24} />
                  </div>
                  <p className="text-sm font-bold text-[var(--admin-text)]/40 uppercase tracking-wider">No leads found</p>
                  <p className="text-xs text-[var(--admin-text)]/20">Leads from your contact form will appear here.</p>
               </div>
            )}
            
            <div className="p-2 border-t border-[var(--admin-border)] sticky bottom-0 admin-surface-secondary/80 backdrop-blur-md">
              <Pagination 
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  baseUrl="/admin/leads"
              />
            </div>
          </div>
        </div>
        
        {/* Detail View */}
        <div className={cn(
          "flex-1 flex-col admin-surface-primary backdrop-blur-xs rounded-[10px] border border-[var(--admin-border)] overflow-hidden relative",
          activeMessageId ? 'flex' : 'hidden lg:flex'
        )}>
          {activeMessage ? (
            <>
              {/* Detail Toolbar */}
              <div className="p-2 md:p-3 border-b border-[var(--admin-border)] flex justify-between items-center admin-surface-secondary/50 backdrop-blur-md">
                <div className="flex gap-1 md:gap-2 items-center">
                    <button onClick={() => setActiveMessageId(null)} className="p-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors lg:hidden" title="Back">
                       <ArrowLeft size={18} />
                    </button>
                    <RoleGate allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]}>
                      <button onClick={() => handleArchive(activeMessage.id)} className="p-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors" title="Archive"><Archive size={18} /></button>
                    </RoleGate>
                    <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                      <button onClick={() => handleDelete(activeMessage.id)} className="p-2 text-[var(--admin-text)]/60 hover:text-red-400 hover:bg-red-500/5 rounded-[8px] transition-colors" title="Delete"><Trash2 size={18} /></button>
                    </RoleGate>
                    <div className="w-[1px] h-6 bg-[var(--admin-border)] mx-1 md:mx-2" />
                    <button onClick={() => handleReadToggle(activeMessage.id)} className="p-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors" title={activeMessage.unread ? "Mark as Read" : "Mark as Unread"}>
                        {activeMessage.unread ? <MailOpen size={18} /> : <Mail size={18} />}
                    </button>
                    <button onClick={() => handleStarToggle(activeMessage.id)} className={cn(
                      "p-2 rounded-[8px] transition-colors",
                      activeMessage.starred ? "text-gold bg-gold/5" : "text-[var(--admin-text)]/60 hover:text-gold hover:bg-gold/5"
                    )} title="Star">
                        <Star size={18} className={activeMessage.starred ? "fill-gold" : ""} />
                    </button>
                    
                    {/* Continue in Gmail — always visible in toolbar */}
                    <div className="w-[1px] h-6 bg-[var(--admin-border)] mx-1 md:mx-2" />
                    <a 
                      href={getGmailSearchUrl(activeMessage.email)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-[var(--admin-text)]/60 hover:text-gold hover:bg-gold/5 rounded-[8px] transition-colors flex items-center gap-1.5"
                      title="Open in Gmail"
                    >
                      <ExternalLink size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider hidden md:inline">Gmail</span>
                    </a>
                </div>
                <div className="flex items-center gap-2">
                  <RoleGate allowedRoles={[Role.SUPER_ADMIN]}>
                     <select 
                        disabled={isAssigning}
                        className="p-2 text-xs font-bold text-[var(--admin-text)] uppercase tracking-wider bg-[var(--admin-text)]/5 rounded-[8px] outline-none hover:bg-[var(--admin-text)]/10 cursor-pointer transition-colors border border-[var(--admin-border)]"
                        value={activeMessage.assignedTo?.id || ""}
                        onChange={(e) => handleAssignLead(e.target.value || null)}
                     >
                        <option value="">Unassigned</option>
                        {adminUsers.filter(u => u.role !== Role.SUPER_ADMIN).map(u => (
                           <option key={u.id} value={u.id}>
                              Assign: {u.name.split(' ')[0]}
                           </option>
                        ))}
                     </select>
                  </RoleGate>
                  <button className="p-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              
              {/* Message Content */}
              <div className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                    <div className="flex gap-3 md:gap-5">
                        <div className={cn(
                          "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 font-black text-lg md:text-2xl shrink-0 shadow-lg",
                          activeMessage.color
                        )}>
                          {activeMessage.avatar}
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg md:text-2xl font-black text-[var(--admin-text)] leading-tight tracking-tight mb-2">{activeMessage.subject}</h2>
                          <div className="flex flex-wrap items-center gap-2 md:gap-3">
                              <span className="text-xs md:text-sm font-bold text-[var(--admin-text)]">{activeMessage.sender}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--admin-text)]/20" />
                              <span className="text-xs md:text-sm font-medium text-[var(--admin-text)]/40 truncate">&lt;{activeMessage.email}&gt;</span>
                          </div>

                          {/* Quick Contact Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            <a 
                              href={`mailto:${activeMessage.email}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] admin-surface-input text-[10px] md:text-xs font-bold text-[var(--admin-text)]/60 hover:text-gold hover:border-gold/30 transition-all"
                            >
                              <Mail size={12} /> Email
                            </a>
                            <button
                              onClick={() => handleCopyEmail(activeMessage.email)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] admin-surface-input text-[10px] md:text-xs font-bold text-[var(--admin-text)]/60 hover:text-gold hover:border-gold/30 transition-all"
                            >
                              {copiedEmail ? <Check size={12} className="text-green-400" /> : <ClipboardCopy size={12} />}
                              {copiedEmail ? "Copied" : "Copy"}
                            </button>
                            <a
                              href={getGmailSearchUrl(activeMessage.email)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] admin-surface-input text-[10px] md:text-xs font-bold text-[var(--admin-text)]/60 hover:text-gold hover:border-gold/30 transition-all"
                            >
                              <ExternalLink size={12} /> Gmail
                            </a>
                          </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(() => {
                        const status = getLeadStatus(activeMessage);
                        return (
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            status.color, status.bgColor, status.borderColor
                          )}>
                            {status.label}
                          </span>
                        );
                      })()}
                      <span className="text-[12px] font-bold text-[var(--admin-text)]/40 uppercase tracking-widest bg-[var(--admin-text)]/5 px-3 py-1 rounded-full border border-[var(--admin-border)]">
                        {activeMessage.date}
                      </span>
                    </div>
                  </div>
                  
                  {activeMessage.assignedTo && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/40">Delegated To:</span>
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-[var(--admin-text)]/5 border border-[var(--admin-border)] rounded-md text-[10px] md:text-xs font-bold text-gold">
                         {activeMessage.assignedTo.name}
                      </span>
                    </div>
                  )}
                  
                  {/* Lead Metadata Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-[var(--admin-border)] pt-8 mt-8">
                      <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/40">Phone Number</span>
                          <span className="text-sm font-semibold text-[var(--admin-text)]/80">{activeMessage.phone || "Not Provided"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/40">Intent</span>
                          <span className="text-sm font-semibold text-[var(--admin-text)]/80">{activeMessage.projectType || "General Inquiry"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/40">Industry</span>
                          <span className="text-sm font-semibold text-[var(--admin-text)]/80">{activeMessage.industry || "Unspecified"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/40">Related Service</span>
                          <span className="text-sm font-semibold text-[var(--admin-text)]/80">{activeMessage.service || "None"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text)]/40">Budget Range</span>
                          <span className="text-sm font-semibold text-[var(--admin-text)]/80">{activeMessage.budget || "Unspecified"}</span>
                      </div>
                  </div>
                  
                  <div className="text-[var(--admin-text)] leading-relaxed text-sm md:text-base space-y-6 max-w-4xl border-t border-[var(--admin-border)] pt-8 md:pt-12 font-medium mt-8 md:mt-12">
                    <p className="text-[var(--admin-text)]/60 italic">Message Content:</p>
                    <p className="whitespace-pre-wrap text-[var(--admin-text)]/90">{activeMessage.message}</p>
                  </div>
                  
                  {/* Reply Section */}
                  <div className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-[var(--admin-border)]">
                     <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                           <h4 className="text-[12px] md:text-sm font-black text-[var(--admin-text)] uppercase tracking-widest flex items-center gap-2">
                             <Reply size={16} className="text-gold" /> 
                             Reply to {activeMessage.sender.split(' ')[0]}
                           </h4>
                           <div className="flex items-center gap-2">
                             {activeMessage.replied && (
                               <>
                                 <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 flex items-center gap-1">
                                   <Send size={10} /> Responded
                                 </span>
                                 <a
                                   href={getGmailSearchUrl(activeMessage.email)}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-[10px] font-bold text-gold uppercase tracking-widest bg-gold/10 px-2 py-1 rounded-md border border-gold/20 flex items-center gap-1 hover:bg-gold/20 transition-colors"
                                 >
                                   <ExternalLink size={10} /> Continue in Gmail
                                 </a>
                               </>
                             )}
                           </div>
                        </div>
                        <textarea 
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           placeholder="Type your response here..." 
                           className="w-full h-32 md:h-48 admin-surface-input rounded-[12px] border border-[var(--admin-border)] p-4 md:p-6 text-[var(--admin-text)] text-sm md:text-base outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none shadow-inner transition-all"
                        />
                        
                        {/* Reply context info */}
                        <p className="text-[10px] md:text-xs text-[var(--admin-text)]/30 flex items-center gap-1.5">
                          <Mail size={10} />
                          After sending, the client can reply directly to <span className="font-bold text-[var(--admin-text)]/50">info@xinteck.co.ke</span> — continue the conversation in Gmail.
                        </p>

                        <div className="flex justify-end gap-3">
                           <button 
                               onClick={handleSendReply}
                               disabled={!replyText || isReplying}
                               className={cn(
                                 "bg-primary text-primary-foreground font-black px-6 py-2 md:px-10 md:py-3 rounded-[10px] flex items-center gap-2 hover:bg-gold transition-all text-xs md:text-sm shadow-xl shadow-primary/20",
                                 (!replyText || isReplying) && "opacity-50 cursor-not-allowed grayscale"
                               )}
                           >
                              {isReplying ? (
                                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                              ) : (
                                  <><Send size={16} /> Send Reply</>
                              )}
                           </button>
                        </div>
                     </div>
                  </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--admin-text)] p-4 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full admin-surface-input flex items-center justify-center mb-6 border border-dashed border-[var(--admin-border)] animate-pulse">
                   <Target size={40} className="text-[var(--admin-text)]/20" />
              </div>
              <p className="text-base md:text-xl font-bold text-[var(--admin-text)]/40 uppercase tracking-widest">Select a lead</p>
              <p className="text-xs md:text-sm text-[var(--admin-text)]/20 mt-2">Pick an inquiry from the list to view details and respond.</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--admin-border);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--admin-text);
            opacity: 0.2;
        }
      `}</style>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Lead"
        description="Are you absolutely sure you want to permanently delete this lead? This cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </PageContainer>
  );
}
