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
      {consent === true && (
        <>
          {/* Google Analytics */}
          {gaId && (
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

          {/* Meta / Facebook Pixel */}
          {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
            <>
              <Script id="meta-pixel" strategy="afterInteractive">
                {`
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `}
              </Script>
              <noscript>
                <img 
                   height="1" 
                   width="1" 
                   style={{ display: "none" }}
                   src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                />
              </noscript>
            </>
          )}

          {/* LinkedIn Insight Tag */}
          {process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID && (
            <>
              <Script id="linkedin-insight" strategy="afterInteractive">
                {`
                  _linkedin_partner_id = "${process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID}";
                  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                  window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                  (function(l) {
                  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                  window.lintrk.q=[]}
                  var s = document.getElementsByTagName("script")[0];
                  var b = document.createElement("script");
                  b.type = "text/javascript";b.async = true;
                  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                  s.parentNode.insertBefore(b, s);})(window.lintrk);
                `}
              </Script>
              <noscript>
                <img 
                   height="1" 
                   width="1" 
                   style={{ display: "none" }} 
                   alt="" 
                   src={`https://px.ads.linkedin.com/collect/?pid=${process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID}&fmt=gif`} 
                />
              </noscript>
            </>
          )}
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
