"use client";

import { archiveMessage, deleteMessage, markAsRead, replyToMessage, toggleStar } from "@/actions/inbox";
import { RoleGate } from "@/components/admin/RoleGate";
import { PageContainer, PageHeader, Pagination, useToast } from "@/components/admin/ui";
import { InboxMessage } from "@/types";
import { Role } from "@prisma/client";
import { Archive, ArrowLeft, Mail, MailOpen, MoreVertical, Reply, Search, Send, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

import { PaginatedResponse } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface InboxClientProps {
  initialData: PaginatedResponse<InboxMessage>;
}

export function InboxClient({ initialData }: InboxClientProps) {
  // Client component for Inbox
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // Sync state with URL params
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
  
  const activeMessage = messages.find((m) => m.id === activeMessageId) || null;

  const handleTabChange = (newFilter: string) => {
      router.push(`/admin/inbox?filter=${newFilter}`);
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
    if (confirm("Delete this message?")) {
      setMessages(prev => prev.filter((m) => m.id !== id));
      if (activeMessageId === id) setActiveMessageId(null);
      
      startTransition(async () => {
          await deleteMessage(id);
          router.refresh();
      });
    }
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
        toast("Reply sent successfully", "success");
      } catch (e: any) {
        toast(`Failed to send: ${e.message}`, "error");
      } finally {
        setIsReplying(false);
      }
    });
  };

  return (
    <PageContainer className="h-[calc(100vh-140px)]">
      <PageHeader 
        title="Inbox" 
        subtitle="Manage your messages and inquiries."
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
                  <h3 className="text-[14px] font-bold text-[var(--admin-text)] uppercase tracking-wider">Messages</h3>
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
                  Unread
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
                    placeholder="Search messages..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[10px] pl-10 pr-4 py-2 text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-muted)] focus:border-gold/50 focus:outline-none transition-colors"
                  />
                </div>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredMessages.map((msg) => (
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
                  <h4 className={cn(
                    "text-xs md:text-sm",
                    msg.unread ? "font-bold text-[var(--admin-text)]" : "font-medium text-[var(--admin-text)]/60"
                  )}>{msg.sender}</h4>
                  <div className="flex items-center gap-2">
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
            ))}
            {filteredMessages.length === 0 && (
               <div className="p-12 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full admin-surface-input flex items-center justify-center text-[var(--admin-text)]/20 border border-dashed border-[var(--admin-border)]">
                    <Mail size={24} />
                  </div>
                  <p className="text-sm font-bold text-[var(--admin-text)]/40 uppercase tracking-wider">No messages found</p>
               </div>
            )}
            
            <div className="p-2 border-t border-[var(--admin-border)] sticky bottom-0 admin-surface-secondary/80 backdrop-blur-md">
              <Pagination 
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  baseUrl="/admin/inbox"
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
                </div>
                <button className="p-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[8px] transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              {/* Message Content */}
              <div className="flex-1 p-4 md:p-10 overflow-y-auto custom-scrollbar">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 md:mb-12">
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
                        </div>
                    </div>
                    <span className="text-[12px] font-bold text-[var(--admin-text)]/40 uppercase tracking-widest shrink-0 bg-[var(--admin-text)]/5 px-3 py-1 rounded-full border border-[var(--admin-border)]">
                      {activeMessage.date}
                    </span>
                  </div>
                  
                  <div className="text-[var(--admin-text)] leading-relaxed text-sm md:text-base space-y-6 max-w-4xl border-t border-[var(--admin-border)] pt-8 md:pt-12 font-medium">
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
                           {activeMessage.replied && (
                             <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20 flex items-center gap-1">
                               <Send size={10} /> Replied
                             </span>
                           )}
                        </div>
                        <textarea 
                           value={replyText}
                           onChange={(e) => setReplyText(e.target.value)}
                           placeholder="Type your response here..." 
                           className="w-full h-32 md:h-48 admin-surface-input rounded-[12px] border border-[var(--admin-border)] p-4 md:p-6 text-[var(--admin-text)] text-sm md:text-base outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 resize-none shadow-inner transition-all"
                        />
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
                   <Mail size={40} className="text-[var(--admin-text)]/20" />
              </div>
              <p className="text-base md:text-xl font-bold text-[var(--admin-text)]/40 uppercase tracking-widest">Select a message</p>
              <p className="text-xs md:text-sm text-[var(--admin-text)]/20 mt-2">Pick a communication from the list to view the full details.</p>
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
    </PageContainer>
  );
}
