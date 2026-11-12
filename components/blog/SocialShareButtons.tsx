"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useCallback, useState } from "react";

interface SocialShareButtonsProps {
  title: string;
  slug: string;
  variant?: "compact" | "full";
}

export function SocialShareButtons({
  title,
  slug,
  variant = "compact",
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Construct absolute URL
  const postUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/blog/${slug}`
    : `https://xinteck.co.ke/blog/${slug}`;

  const encodedUrl = encodeURIComponent(postUrl);
  const encodedTitle = encodeURIComponent(title);

  // Share Intent URLs
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=xinteck`,
  };

  const handleCopyLink = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(postUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = postUrl;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  }, [postUrl]);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: postUrl,
        });
      } catch {
        // User cancelled share sheet
      }
    }
  }, [title, postUrl]);

  // SVG Icons for Brand Authenticity
  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.18-.48-.3" />
    </svg>
  );

  const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );

  const XTwitterIcon = () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  // Compact Variant (Top bar alongside metadata)
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/60 mr-1 hidden sm:inline-block">
          Share:
        </span>

        {/* WhatsApp */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          title="Share to WhatsApp"
          aria-label="Share to WhatsApp"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-[8px] bg-primary/5 dark:bg-white/5 hover:bg-[#25D366]/15 hover:text-[#25D366] text-foreground/80 border border-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <WhatsAppIcon />
          <span className="hidden md:inline">WhatsApp</span>
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          title="Share to LinkedIn"
          aria-label="Share to LinkedIn"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-[8px] bg-primary/5 dark:bg-white/5 hover:bg-[#0A66C2]/15 hover:text-[#0A66C2] text-foreground/80 border border-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <LinkedInIcon />
          <span className="hidden md:inline">LinkedIn</span>
        </a>

        {/* X / Twitter */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          title="Share on X"
          aria-label="Share on X"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-[8px] bg-primary/5 dark:bg-white/5 hover:bg-gold/15 hover:text-gold text-foreground/80 border border-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <XTwitterIcon />
          <span className="hidden md:inline">X</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          title={copied ? "Link Copied!" : "Copy Link"}
          aria-label="Copy Link"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-[8px] bg-primary/5 dark:bg-white/5 hover:bg-gold/15 hover:text-gold text-foreground/80 border border-primary/10 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={14} className="text-gold" />
              <span className="text-gold text-[11px] font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span className="hidden md:inline">Copy</span>
            </>
          )}
        </button>

        {/* Native Mobile Share (only rendered on supported touch devices) */}
        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={handleNativeShare}
            title="More Share Options"
            aria-label="Share options"
            className="sm:hidden p-2 rounded-[8px] bg-gold/10 text-gold border border-gold/30 hover:bg-gold hover:text-primary-foreground transition-all cursor-pointer"
          >
            <Share2 size={14} />
          </button>
        )}
      </div>
    );
  }

  // Full Callout Variant (Bottom of article)
  return (
    <div className="my-10 p-6 md:p-8 rounded-[20px] bg-white/40 dark:bg-black/80 backdrop-blur-xl border border-primary/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
          <Share2 size={16} />
          <span>Spread the Insights</span>
        </div>
        <h4 className="text-lg md:text-xl font-black text-foreground tracking-tight">
          Share this architecture breakdown with your team
        </h4>
        <p className="text-xs md:text-sm text-foreground/70 max-w-xl">
          Help Kenyan founders, CTOs, and finance leads avoid costly technical debt and build resilient digital systems.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* WhatsApp Button */}
        <a
          href={shareLinks.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-[10px] bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/30 transition-all font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <WhatsAppIcon />
          <span>WhatsApp</span>
        </a>

        {/* LinkedIn Button */}
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-[10px] bg-[#0A66C2]/15 hover:bg-[#0A66C2] text-[#0A66C2] hover:text-white border border-[#0A66C2]/30 transition-all font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <LinkedInIcon />
          <span>LinkedIn</span>
        </a>

        {/* X / Twitter Button */}
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-[10px] bg-primary/5 dark:bg-white/5 hover:bg-gold hover:text-black text-foreground border border-primary/10 transition-all font-bold text-xs flex items-center gap-2 shadow-sm"
        >
          <XTwitterIcon />
          <span>X / Twitter</span>
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="px-4 py-2.5 rounded-[10px] bg-gold/15 hover:bg-gold text-gold hover:text-black border border-gold/30 transition-all font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

