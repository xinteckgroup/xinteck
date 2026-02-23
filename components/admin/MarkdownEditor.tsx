"use client";

import { uploadFile } from "@/actions/media";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { convertToWebP } from "@/lib/webp-converter";
import { Bold as BoldIcon, FileCode2, Heading1, Heading2, Heading3, ImageIcon, Italic as ItalicIcon, Link as LinkIcon, List, Loader2, Quote, Redo2, Undo2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isUploading, setIsUploading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // --- History State & Undo/Redo ---
  // Tracking cursor positions alongside text makes undo/redo feel native.
  const [history, setHistory] = useState<{ value: string; selectionStart: number; selectionEnd: number }[]>([{ value, selectionStart: 0, selectionEnd: 0 }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync external changes (like initial load) into history if it's explicitly different
  useEffect(() => {
    if (value !== history[historyIndex]?.value) {
       // Only push to history if it's a genuine external update not driven by our own history navigation
       const newHistory = history.slice(0, historyIndex + 1);
       newHistory.push({ value, selectionStart: value.length, selectionEnd: value.length });
       setHistory(newHistory);
       setHistoryIndex(newHistory.length - 1);
    }
  }, [value]);

  const updateValueAndHistory = (newValue: string, newStart: number, newEnd: number) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ value: newValue, selectionStart: newStart, selectionEnd: newEnd });
    
    // Cap history size to prevent memory leaks in extreme long-lived sessions
    if (newHistory.length > 100) newHistory.shift(); 

    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onChange(newValue);
    
    // Restore focus and cursor
    setTimeout(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(newStart, newEnd);
        }
    }, 0);
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          setHistoryIndex(historyIndex - 1);
          onChange(prev.value);
          setTimeout(() => {
              if (textAreaRef.current) {
                 textAreaRef.current.focus();
                 textAreaRef.current.setSelectionRange(prev.selectionStart, prev.selectionEnd);
              }
          }, 0);
      }
  };

  const handleRedo = () => {
      if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          setHistoryIndex(historyIndex + 1);
          onChange(next.value);
          setTimeout(() => {
              if (textAreaRef.current) {
                 textAreaRef.current.focus();
                 textAreaRef.current.setSelectionRange(next.selectionStart, next.selectionEnd);
              }
          }, 0);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateValueAndHistory(e.target.value, e.target.selectionStart, e.target.selectionEnd);
  };

  // --- Text Wrapping Logic ---
  const insertFormat = (prefix: string, suffix: string = "", defaultText: string = "") => {
    if (!textAreaRef.current) return;
    const target = textAreaRef.current;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    
    const selectedText = value.substring(start, end);
    const replacement = selectedText ? `${prefix}${selectedText}${suffix}` : `${prefix}${defaultText}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    
    const newCursorPos = selectedText ? start + replacement.length : start + prefix.length;
    updateValueAndHistory(newValue, newCursorPos, selectedText ? newCursorPos : newCursorPos + defaultText.length);
  };

  const handleToolbarClick = (action: string) => {
    switch(action) {
       case 'bold': insertFormat("**", "**", "bold text"); break;
       case 'italic': insertFormat("*", "*", "italic text"); break;
       case 'h1': insertFormat("\n# ", "\n", "Heading 1"); break;
       case 'h2': insertFormat("\n## ", "\n", "Heading 2"); break;
       case 'h3': insertFormat("\n### ", "\n", "Heading 3"); break;
       case 'quote': insertFormat("\n> ", "\n", "Quote"); break;
       case 'code': insertFormat("\n```\n", "\n```\n", "code block"); break;
       case 'link': insertFormat("[", "](url)", "link text"); break;
       case 'list': insertFormat("\n- ", "\n", "list item"); break;
    }
  };

  // --- Image Insertion Modal State ---
  const [showImageModal, setShowImageModal] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgAlign, setImgAlign] = useState<"center" | "left" | "right">("center");

  const openImageModal = () => {
      // Save exact cursor position before modal opens
      if (textAreaRef.current) {
         setHistory(prev => {
             const h = [...prev];
             h[historyIndex] = { ...h[historyIndex], selectionStart: textAreaRef.current!.selectionStart, selectionEnd: textAreaRef.current!.selectionEnd };
             return h;
         });
      }
      setShowImageModal(true);
  };

  const handleImageModalInsert = async () => {
      // Determine Markdown Syntax. Using #alignment in alt text to cleanly pass layout to ReactMarkdown.
      const altSyntax = imgAlt ? `${imgAlt}#${imgAlign}` : `Image#${imgAlign}`;
      const syntax = `\n![${altSyntax}](${imgUrl})\n`;
      
      const targetState = history[historyIndex];
      const start = targetState.selectionStart;
      const end = targetState.selectionEnd;

      const newValue = value.substring(0, start) + syntax + value.substring(end);
      updateValueAndHistory(newValue, start + syntax.length, start + syntax.length);

      setShowImageModal(false);
      setImgUrl("");
      setImgAlt("");
      setImgAlign("center");
  };



  // --- Quick Paste Handler ---
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    let imageFile: File | null = null;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
            imageFile = items[i].getAsFile();
            break;
        }
    }

    if (!imageFile) return;
    e.preventDefault();

    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    const placeholder = `\n![Uploading ${imageFile.name} ...]()\n`;
    const tempValue = value.substring(0, start) + placeholder + value.substring(end);
    onChange(tempValue); // Temp update without pushing to history stack yet bridging the upload gap
    
    setIsUploading(true);
    const toastId = toast.loading("Processing pasted image...");

    try {
        const webpFile = await convertToWebP(imageFile);
        const formData = new FormData();
        formData.append('file', webpFile);
        const result = await uploadFile(formData);

        if (result && result.url) {
            const finalValue = value.substring(0, start) + `\n![Pasted Image#center](${result.url})\n` + value.substring(end);
            updateValueAndHistory(finalValue, start + `\n![Pasted Image#center](${result.url})\n`.length, start + `\n![Pasted Image#center](${result.url})\n`.length);
            toast.success("Pasted image processed!", { id: toastId });
        } else {
            throw new Error("Failed");
        }
    } catch (error) {
        toast.error("Failed to paste image.", { id: toastId });
        onChange(value); // Revert to original
    } finally {
        setIsUploading(false);
    }
  };

  // --- Keyboard Shortcuts ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
              handleRedo();
          } else {
              handleUndo();
          }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
          e.preventDefault();
          handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault();
          handleToolbarClick('bold');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
          e.preventDefault();
          handleToolbarClick('italic');
      }
  };

  // --- Custom ReactMarkdown Components (Admin Preview) ---
  const markdownComponents = {
     img: ({node, ...props}: any) => {
         // Parse alt text for alignment mapping: ![Alt text#left](url)
         const parts = (props.alt || "").split("#");
         const altText = parts[0];
         const align = parts.length > 1 ? parts[1].toLowerCase() : "center";
         
         let alignmentClass = "block mx-auto max-w-full"; // Center default
         if (align === "left") alignmentClass = "float-left md:mr-8 mb-4 max-w-full md:max-w-[50%]";
         if (align === "right") alignmentClass = "float-right md:ml-8 mb-4 max-w-full md:max-w-[50%]";

         return (
             <img 
                 {...props} 
                 alt={altText}
                 className={`rounded-[12px] shadow-lg border border-[var(--admin-border)] my-6 object-cover ${alignmentClass}`} 
             />
         );
     },
     h1: ({node, ...props}: any) => <h1 {...props} className="clear-both text-3xl font-extrabold text-gold mb-6 pb-2 border-b border-[var(--admin-border)]" />,
     h2: ({node, ...props}: any) => <h2 {...props} className="clear-both text-2xl font-bold text-[var(--admin-text)] mt-8 mb-4" />,
     h3: ({node, ...props}: any) => <h3 {...props} className="clear-both text-xl font-bold text-[var(--admin-text)] mt-6 mb-3" />,
     p: ({node, ...props}: any) => <p {...props} className="leading-relaxed mb-4 text-[var(--admin-text)]" />,
     a: ({node, ...props}: any) => <a {...props} className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/50" target="_blank" rel="noopener noreferrer" />,
     blockquote: ({node, ...props}: any) => <blockquote {...props} className="clear-both border-l-4 border-gold bg-gold/5 italic p-4 my-6 rounded-r-[8px] text-[var(--admin-text)]" />,
     code: ({node, inline, ...props}: any) => 
         inline ? 
         <code {...props} className="bg-white/10 px-1.5 py-0.5 rounded-[4px] font-mono text-sm text-[var(--admin-text)]" /> : 
         <pre className="clear-both bg-[#0D0D0D] p-4 rounded-[12px] border border-[var(--admin-border)] overflow-x-auto my-6 shadow-xl"><code {...props} className="font-mono text-sm text-[var(--admin-text)]" /></pre>,
     ul: ({node, ...props}: any) => <ul {...props} className="clear-both list-disc list-outside ml-6 mb-4 space-y-2 text-[var(--admin-text)]" />,
     ol: ({node, ...props}: any) => <ol {...props} className="clear-both list-decimal list-outside ml-6 mb-4 space-y-2 text-[var(--admin-text)]" />,
     li: ({node, ...props}: any) => <li {...props} className="pl-2 marker:text-gold" />,
  };

  return (
    <div className="admin-surface-primary backdrop-blur-sm rounded-[10px] overflow-hidden min-w-0">
      <MediaPicker 
          isOpen={showMediaPicker} 
          onClose={() => setShowMediaPicker(false)} 
          onSelect={(url) => setImgUrl(url)} 
      />
      
      {/* --- Image Insertion Modal --- */}
      {showImageModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4 text-white">
              <div className="bg-black/80 dark:bg-white/30 backdrop-blur-md transition-colors rounded-[10px] w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 relative">
                  <div className="p-4 border-b border-[var(--admin-border)] flex items-center justify-between bg-transparent shrink-0">
                      <div className="flex flex-col gap-1 min-w-0">
                          <h3 className="text-lg font-bold text-[var(--admin-text)] flex items-center gap-2 truncate">Insert Image</h3>
                      </div>
                      <button onClick={() => setShowImageModal(false)} className="text-[var(--admin-text)] hover:text-gold transition-colors shrink-0 ml-3">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-4 overflow-y-auto flex-1 bg-transparent text-[var(--admin-text)] flex flex-col gap-4">
                      {/* Image Preview / URL Input */}
                      <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-bold text-[var(--admin-text)]/70 uppercase tracking-wider">Image Source</label>
                          
                          {imgUrl ? (
                              <div className="relative aspect-video rounded-[8px] border border-[var(--admin-border)] overflow-hidden bg-black/50 flex items-center justify-center mb-2">
                                  <img src={imgUrl} className="max-w-full max-h-full object-contain" alt="Preview" />
                                  <button onClick={() => setImgUrl("")} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full"><Undo2 size={12} /></button>
                              </div>
                          ) : (
                              <div className="flex items-center gap-2">
                                 <button 
                                     onClick={() => setShowMediaPicker(true)}
                                     disabled={isUploading}
                                     className="flex-1 admin-surface-input border border-dashed border-gold/50 hover:border-gold/80 hover:bg-gold/5 transition-all text-gold rounded-[8px] py-4 flex flex-col items-center justify-center cursor-pointer gap-2"
                                 >
                                    <ImageIcon size={20} />
                                    <span className="text-xs font-bold text-[var(--admin-text)]">Select from Media Library</span>
                                 </button>
                              </div>
                          )}

                          <input 
                              type="text" 
                              value={imgUrl}
                              onChange={e => setImgUrl(e.target.value)}
                              placeholder="Or paste an external image URL..." 
                              className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-xs font-mono outline-none focus:border-gold/50"
                          />
                      </div>

                      {/* Alt Text */}
                      <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[var(--admin-text)]/70 uppercase tracking-wider">Alt Text (SEO & Accessibility)</label>
                          <input 
                              type="text" 
                              value={imgAlt}
                              onChange={e => setImgAlt(e.target.value)}
                              placeholder="Descriptive text..." 
                              className="w-full admin-surface-input border border-[var(--admin-border)] rounded-[8px] px-3 py-2 text-[var(--admin-text)] text-xs outline-none focus:border-gold/50"
                          />
                      </div>

                      {/* Layout Alignment */}
                      <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-[var(--admin-text)]/70 uppercase tracking-wider">Display Alignment</label>
                          <div className="flex gap-2">
                              {["left", "center", "right"].map(pos => (
                                  <button
                                     key={pos}
                                     onClick={() => setImgAlign(pos as any)}
                                     className={`flex-1 py-1.5 rounded-[6px] text-xs font-bold uppercase tracking-wider border transition-all ${imgAlign === pos ? 'bg-gold/20 text-gold border-gold/50 shadow-sm' : 'admin-surface-input text-[var(--admin-text)]/60 border-transparent hover:border-[var(--admin-border)] hover:text-[var(--admin-text)]'}`}
                                  >
                                      {pos}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="p-4 border-t border-[var(--admin-border)] bg-transparent flex justify-end items-center gap-4 shrink-0">
                      <button onClick={() => setShowImageModal(false)} className="px-4 py-2 text-[var(--admin-text)]/60 hover:text-[var(--admin-text)] text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
                      <button 
                          onClick={handleImageModalInsert} 
                          disabled={!imgUrl || isUploading}
                          className="bg-primary text-[var(--admin-text)] font-black px-6 py-2 rounded-[10px] flex items-center gap-2 hover:bg-gold transition-all text-xs uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50"
                      >
                          Insert Image
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center p-1.5 md:p-2 border-b border-[var(--admin-border)] admin-surface-input overflow-x-auto">
         {/* Undo/Redo Buttons */}
         <div className="flex items-center gap-0.5">
             <button onClick={handleUndo} disabled={historyIndex === 0} className="p-1.5 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px] disabled:opacity-30 transition-colors" title="Undo (Ctrl+Z)"><Undo2 size={16} /></button>
             <button onClick={handleRedo} disabled={historyIndex === history.length - 1} className="p-1.5 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px] disabled:opacity-30 transition-colors mr-1 md:mr-2" title="Redo (Ctrl+Y)"><Redo2 size={16} /></button>
         </div>

         <div className="w-[1px] h-4 bg-border mx-1" />

         <div className="flex items-center gap-0.5 md:gap-1">
             <button onClick={() => handleToolbarClick('bold')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Bold (Ctrl+B)"><BoldIcon size={16} /></button>
             <button onClick={() => handleToolbarClick('italic')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Italic (Ctrl+I)"><ItalicIcon size={16} /></button>
             <div className="w-[1px] h-3 md:h-4 bg-border mx-0.5 md:mx-1" />
             <button onClick={() => handleToolbarClick('h1')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Heading 1"><Heading1 size={14} /></button>
             <button onClick={() => handleToolbarClick('h2')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Heading 2"><Heading2 size={14} /></button>
             <button onClick={() => handleToolbarClick('h3')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Heading 3"><Heading3 size={14} /></button>
             <div className="w-[1px] h-3 md:h-4 bg-border mx-0.5 md:mx-1" />
             <button onClick={() => handleToolbarClick('quote')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Quote"><Quote size={14} /></button>
             <button onClick={() => handleToolbarClick('code')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Code Block"><FileCode2 size={16} /></button>
             <div className="w-[1px] h-3 md:h-4 bg-border mx-0.5 md:mx-1" />
             <button onClick={() => handleToolbarClick('link')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="Link"><LinkIcon size={16} /></button>
             <button onClick={openImageModal} className="p-1.5 md:p-2 text-gold hover:bg-gold/10 rounded-[6px] transition-colors" title="Insert Media"><ImageIcon size={14} /></button>
             <button onClick={() => handleToolbarClick('list')} className="p-1.5 md:p-2 text-[var(--admin-text)] hover:bg-[var(--admin-text)]/5 rounded-[6px]" title="List"><List size={14} /></button>
         </div>
      </div>

      <div className="relative">
         {isUploading && (
             <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--admin-background)]/50 backdrop-blur-[2px] rounded-[10px]">
                 <div className="flex flex-col items-center gap-2 admin-surface-secondary px-6 py-4 rounded-[12px] shadow-lg border border-[var(--admin-border)]">
                     <Loader2 className="animate-spin text-gold" size={24} />
                     <span className="text-xs font-bold text-[var(--admin-text)] tracking-wider">ATTACHING IMAGE...</span>
                 </div>
             </div>
         )}
         {/* Tabs */}
         <div className="flex absolute right-4 top-4 gap-2 z-10 shadow-sm rounded-full overflow-hidden border border-[var(--admin-border)]">
            <button 
               onClick={() => setActiveTab("write")}
               className={`text-[10px] md:text-xs font-bold px-3 py-1.5 transition-colors ${activeTab === 'write' ? 'bg-gold text-primary-foreground' : 'admin-surface-input text-[var(--admin-text)]/80 hover:bg-[var(--admin-text)]/10'}`}
            >
               Write
            </button>
            <button 
               onClick={() => setActiveTab("preview")}
               className={`text-[10px] md:text-xs font-bold px-3 py-1.5 transition-colors ${activeTab === 'preview' ? 'bg-gold text-primary-foreground' : 'admin-surface-input text-[var(--admin-text)]/80 hover:bg-[var(--admin-text)]/10'}`}
            >
               Preview
            </button>
         </div>

          {activeTab === "write" ? (
             <textarea 
               ref={textAreaRef}
               value={value}
               onChange={handleChange}
               onPaste={handlePaste}
               onKeyDown={handleKeyDown}
               placeholder="# Start writing your masterpiece... You can paste images directly here!"
               className="w-full h-[500px] md:h-[700px] bg-transparent p-4 md:p-6 pb-20 text-[var(--admin-text)] text-sm font-mono leading-relaxed outline-none resize-none placeholder:text-[var(--admin-text)]/40"
             />
         ) : (
             <div className="w-full h-[500px] md:h-[700px] admin-surface-primary bg-[var(--admin-background)] p-4 md:p-8 overflow-y-auto prose prose-invert prose-emerald max-w-none text-[var(--admin-text)]">
                 {value ? (
                     <ReactMarkdown 
                         remarkPlugins={[remarkGfm]}
                         components={markdownComponents}
                     >
                         {value}
                     </ReactMarkdown>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-[var(--admin-text)]/40 italic">
                         <p>No content to preview.</p>
                     </div>
                 )}
             </div>
         )}
      </div>
    </div>
  );
}
