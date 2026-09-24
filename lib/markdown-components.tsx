/**
 * Shared ReactMarkdown component overrides for client-facing pages.
 *
 * Mirrors the rich preview styling from the admin MarkdownEditor,
 * translated to client-side theme tokens (text-foreground, text-primary, etc.).
 *
 * Used by:  portfolio/[slug]/page.tsx, blog/[slug]/page.tsx
 */

import type { Components } from "react-markdown";

export const clientMarkdownComponents: Components = {
  img: ({ node, ...props }: any) => {
    // Parse alignment tag from alt text: "Description#left" → float-left
    const parts = (props.alt || "").split("#");
    const altText = parts[0];
    const align = parts.length > 1 ? parts[1].toLowerCase() : "center";

    let alignmentClass = "block mx-auto max-w-full"; // Center default
    if (align === "left")
      alignmentClass = "float-left md:mr-8 mb-6 max-w-full md:max-w-[45%]";
    if (align === "right")
      alignmentClass = "float-right md:ml-8 mb-6 max-w-full md:max-w-[45%]";

    return (
      <img
        {...props}
        alt={altText}
        className={`rounded-[16px] shadow-xl my-6 border border-primary/20 object-cover ${alignmentClass}`}
      />
    );
  },

  h1: ({ node, ...props }: any) => (
    <h1
      {...props}
      className="clear-both text-3xl md:text-5xl font-black tracking-tighter text-primary mb-6 pb-3 border-b border-primary/20"
    />
  ),

  h2: ({ node, ...props }: any) => (
    <h2
      {...props}
      className="clear-both text-2xl md:text-3xl font-black tracking-tight text-foreground mt-10 mb-5"
    />
  ),

  h3: ({ node, ...props }: any) => (
    <h3
      {...props}
      className="clear-both text-xl md:text-2xl font-bold tracking-tight text-foreground/90 mt-8 mb-3"
    />
  ),

  h4: ({ node, ...props }: any) => (
    <h4
      {...props}
      className="clear-both text-lg md:text-xl font-bold text-foreground/80 mt-6 mb-2"
    />
  ),

  p: ({ node, ...props }: any) => (
    <p
      {...props}
      className="text-base md:text-lg leading-relaxed mb-5 text-foreground/80"
    />
  ),

  a: ({ node, ...props }: any) => (
    <a
      {...props}
      className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-primary/40 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    />
  ),

  blockquote: ({ node, ...props }: any) => (
    <blockquote
      {...props}
      className="clear-both border-l-4 border-primary bg-primary/5 p-6 md:p-8 my-8 rounded-r-[12px] text-foreground/90 italic text-base md:text-lg leading-relaxed"
    />
  ),

  code: ({ node, inline, ...props }: any) =>
    inline ? (
      <code
        {...props}
        className="bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-[4px] font-mono text-sm text-foreground"
      />
    ) : (
      <pre className="clear-both bg-[#0D0D0D] p-5 rounded-[12px] border border-primary/20 overflow-x-auto my-8 shadow-xl">
        <code
          {...props}
          className="font-mono text-sm text-white leading-relaxed"
        />
      </pre>
    ),

  ul: ({ node, ...props }: any) => (
    <ul
      {...props}
      className="clear-both list-disc list-outside ml-6 mb-5 space-y-2 text-foreground/80 text-base md:text-lg"
    />
  ),

  ol: ({ node, ...props }: any) => (
    <ol
      {...props}
      className="clear-both list-decimal list-outside ml-6 mb-5 space-y-2 text-foreground/80 text-base md:text-lg"
    />
  ),

  li: ({ node, ...props }: any) => (
    <li {...props} className="pl-2 leading-relaxed marker:text-primary" />
  ),

  strong: ({ node, ...props }: any) => (
    <strong {...props} className="font-bold text-primary" />
  ),

  em: ({ node, ...props }: any) => (
    <em {...props} className="italic text-foreground/90" />
  ),

  hr: ({ node, ...props }: any) => (
    <hr
      {...props}
      className="my-10 border-t border-primary/20"
    />
  ),

  table: ({ node, ...props }: any) => (
    <div className="overflow-x-auto my-8 rounded-[12px] border border-primary/20">
      <table {...props} className="w-full text-sm md:text-base" />
    </div>
  ),

  thead: ({ node, ...props }: any) => (
    <thead {...props} className="bg-primary/10 text-foreground font-bold" />
  ),

  th: ({ node, ...props }: any) => (
    <th
      {...props}
      className="px-4 py-3 text-left text-xs md:text-sm font-bold uppercase tracking-wider text-primary border-b border-primary/20"
    />
  ),

  td: ({ node, ...props }: any) => (
    <td
      {...props}
      className="px-4 py-3 text-foreground/80 border-b border-primary/10"
    />
  ),
};
