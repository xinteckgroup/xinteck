"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

interface AnalyticsProviderProps {
  gaId?: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ gaId, children }: AnalyticsProviderProps) {
  const [consent, setConsent] = useState<boolean | null>(null); // null = unknown
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();

  // 1. Check consent on mount
  useEffect(() => {
    // Only run on client
    const stored = localStorage.getItem("cookie_consent");
    if (stored === "true") {
      setConsent(true);
    } else if (stored === "false") {
      setConsent(false);
    } else {
      // No choice made yet
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Handle User Action
  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "true");
    setConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "false");
    setConsent(false);
    setShowBanner(false);
  };

  // 3. Track Pageviews (if consent given) - Basic GA4
  useEffect(() => {
    if (consent === true && gaId && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [consent, pathname, gaId]);

  // Exclude admin pages from banner?
  const isAdmin = pathname?.startsWith("/admin");
  const shouldShow = showBanner && !isAdmin;

  return (
    <>
      {/* GA Scripts - Only if consent is TRUE and gaId exists */}
      {consent === true && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {children}

      {/* Cookie Banner */}
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-6 rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl flex flex-col gap-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-foreground font-bold text-lg">Cookie Preferences</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We use cookies to analyze traffic and improve your experience. 
                  Read our <a href="/privacy" className="text-gold hover:underline">Privacy Policy</a> to learn more.
                </p>
              </div>
              <button 
                onClick={() => setShowBanner(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDecline}
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-all border border-border"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-black font-bold text-sm transition-all shadow-lg shadow-gold/20"
              >
                Accept All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
