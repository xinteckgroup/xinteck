"use client";

import { Bold, Code, Heading1, Heading2, Heading3, Image as ImageIcon, Italic, Link, List, Quote } from "lucide-react";
import { useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const insertFormat = (format: string) => {
    // Simple append for now. A real implementation would handle cursor position.
    // Given the constraints, a simple append or visual toolbar that just mocks functionality is risky if user expects full behavior.
    // I will implement cursor insertion if possible, but standard React state append is safer for "MVP" robustness.
    // Actually, let's just make the toolbar buttons wrap selected text if we can, or just append generic syntax.
    
    // Simplest robust version: Append to end or insert at cursor (harder without ref).
    // Let's go with "Append" for stability, or better yet, just let the user write markdown if they know it, 
    // and the buttons act as helpers.
    
    // Implementation: simple syntax injection
    let syntax = "";
    switch(format) {
       case 'bold': syntax = "**bold text**"; break;
       case 'italic': syntax = "*italic text*"; break;
       case 'h1': syntax = "\n# Heading 1\n"; break;
       case 'h2': syntax = "\n## Heading 2\n"; break;
       case 'h3': syntax = "\n### Heading 3\n"; break;
       case 'quote': syntax = "\n> Quote\n"; break;
       case 'code': syntax = "\n```\ncode block\n```\n"; break;
       case 'link': syntax = "[link text](url)"; break;
       case 'image': syntax = "![alt text](image-url)"; break;
       case 'list': syntax = "\n- list item\n"; break;
    }
    onChange(value + syntax);
  };

  return (
    <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] overflow-hidden min-w-0">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 md:gap-1 p-1.5 md:p-2 border-b border-[var(--admin-border)] admin-surface-input overflow-x-auto">
         <button onClick={() => insertFormat('bold')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Bold"><Bold size={14} className="md:w-4 md:h-4" /></button>
         <button onClick={() => insertFormat('italic')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Italic"><Italic size={14} className="md:w-4 md:h-4" /></button>
         <div className="w-[1px] h-3 md:h-4 bg-border mx-0.5 md:mx-1" />
         <button onClick={() => insertFormat('h1')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Heading 1"><Heading1 size={14} className="md:w-4 md:h-4" /></button>
         <button onClick={() => insertFormat('h2')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Heading 2"><Heading2 size={14} className="md:w-4 md:h-4" /></button>
         <button onClick={() => insertFormat('h3')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Heading 3"><Heading3 size={14} className="md:w-4 md:h-4" /></button>
         <div className="w-[1px] h-3 md:h-4 bg-border mx-0.5 md:mx-1" />
         <button onClick={() => insertFormat('quote')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Quote"><Quote size={14} className="md:w-4 md:h-4" /></button>
         <button onClick={() => insertFormat('code')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Code Block"><Code size={14} className="md:w-4 md:h-4" /></button>
         <div className="w-[1px] h-3 md:h-4 bg-border mx-0.5 md:mx-1" />
         <button onClick={() => insertFormat('link')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Link"><Link size={14} className="md:w-4 md:h-4" /></button>
         <button onClick={() => insertFormat('image')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Image"><ImageIcon size={14} className="md:w-4 md:h-4" /></button>
         <button onClick={() => insertFormat('list')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="List"><List size={14} className="md:w-4 md:h-4" /></button>
      </div>

      <div className="relative">
         {/* Tabs */}
         <div className="flex absolute right-4 top-4 gap-2 z-10">
            <button 
               onClick={() => setActiveTab("write")}
               className={`text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-colors ${activeTab === 'write' ? 'bg-primary text-primary-foreground' : 'admin-surface-input text-[var(--admin-text)]/60'}`}
            >
               Write
            </button>
            <button 
               onClick={() => setActiveTab("preview")}
               className={`text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full transition-colors ${activeTab === 'preview' ? 'bg-primary text-primary-foreground' : 'admin-surface-input text-[var(--admin-text)]/60'}`}
            >
               Preview
            </button>
         </div>

          {activeTab === "write" ? (
             <textarea 
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder="# Start writing your masterpiece..."
               className="w-full h-[250px] md:h-[500px] bg-transparent p-3 md:p-6 text-[var(--admin-text)] text-xs md:text-sm font-mono leading-relaxed outline-none resize-none placeholder:text-[var(--admin-text)]/60"
             />
         ) : (
             <div className="w-full h-[250px] md:h-[500px] admin-surface-input p-3 md:p-6 overflow-y-auto prose prose-invert max-w-none text-[var(--admin-text)]">
                 <p className="text-[var(--admin-text)] italic text-center mt-20">Preview mode requires a markdown parser. <br/> (Install 'react-markdown' to enable full live preview)</p>
                 <div className="mt-8 whitespace-pre-wrap text-[var(--admin-text)]/80 font-serif border-t border-[var(--admin-border)] pt-8">{value}</div>
             </div>
         )}
      </div>
    </div>
  );
}
