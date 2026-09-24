"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart2, Check, Cookie, Shield, Target, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

// ─── Consent Types ───────────────────────────────────────────────────────────

export interface CookieConsentState {
  essential: true;      // Always true — cannot be toggled
  analytics: boolean;
  marketing: boolean;
  timestamp: string;    // ISO date when consent was saved
}

interface CookieConsentContextValue {
  consent: CookieConsentState | null;
  openPreferences: () => void;
}

const STORAGE_KEY = "cookie_consent";
const COOKIE_NAME = "cookie_consent";

// Default state: everything off except essential
const DEFAULT_CONSENT: CookieConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: new Date().toISOString(),
};

// ─── Context ─────────────────────────────────────────────────────────────────

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: null,
  openPreferences: () => {},
});

/**
 * Hook for any component to read consent state or trigger the preferences modal.
 * Used by Footer.tsx and cookies/page.tsx to provide a "Cookie Preferences" action.
 */
export function useCookieConsent() {
  return useContext(CookieConsentContext);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Persist consent to both localStorage (for client components) and a client cookie (for middleware/SSR). */
function persistConsent(state: CookieConsentState) {
  const json = JSON.stringify(state);
  localStorage.setItem(STORAGE_KEY, json);
  // Set a 1-year client cookie so server-side code can also read consent if needed
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(json)}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

/** Read consent from localStorage, handling legacy "true"/"false" format migration. */
function readConsent(): CookieConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    // Migrate legacy binary format → granular object
    if (raw === "true") {
      const migrated: CookieConsentState = { essential: true, analytics: true, marketing: true, timestamp: new Date().toISOString() };
      persistConsent(migrated);
      return migrated;
    }
    if (raw === "false") {
      const migrated: CookieConsentState = { essential: true, analytics: false, marketing: false, timestamp: new Date().toISOString() };
      persistConsent(migrated);
      return migrated;
    }

    return JSON.parse(raw) as CookieConsentState;
  } catch {
    return null;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface AnalyticsProviderProps {
  gaId?: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ gaId, children }: AnalyticsProviderProps) {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  // Draft state for the preferences modal toggles
  const [draftAnalytics, setDraftAnalytics] = useState(false);
  const [draftMarketing, setDraftMarketing] = useState(false);

  // 1. Check consent on mount
  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      setConsent(stored);
    } else {
      // No choice made yet — delay banner for better UX
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
    setLoaded(true);
  }, []);

  // 2. Sync draft toggles when opening preferences
  const openPreferences = useCallback(() => {
    setDraftAnalytics(consent?.analytics ?? false);
    setDraftMarketing(consent?.marketing ?? false);
    setShowPreferences(true);
    setShowBanner(false);
  }, [consent]);

  // 3. Save consent actions
  const saveConsent = useCallback((state: CookieConsentState) => {
    persistConsent(state);
    setConsent(state);
    setShowBanner(false);
    setShowPreferences(false);
  }, []);

  const handleAcceptAll = useCallback(() => {
    saveConsent({ essential: true, analytics: true, marketing: true, timestamp: new Date().toISOString() });
  }, [saveConsent]);

  const handleDeclineAll = useCallback(() => {
    saveConsent({ essential: true, analytics: false, marketing: false, timestamp: new Date().toISOString() });
  }, [saveConsent]);

  const handleSavePreferences = useCallback(() => {
    saveConsent({ essential: true, analytics: draftAnalytics, marketing: draftMarketing, timestamp: new Date().toISOString() });
  }, [saveConsent, draftAnalytics, draftMarketing]);

  const handleDismissBanner = useCallback(() => {
    // Dismiss = Essential Only for this session, same as decline (prevents popup loop)
    handleDeclineAll();
  }, [handleDeclineAll]);

  // 4. Track Pageviews (if analytics consent given)
  useEffect(() => {
    if (consent?.analytics && gaId && typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [consent, pathname, gaId]);

  // Exclude admin pages from banner
  const isAdmin = pathname?.startsWith("/admin");
  const shouldShowBanner = showBanner && !isAdmin;

  return (
    <CookieConsentContext.Provider value={{ consent, openPreferences }}>
      {/* ─── Analytics Scripts — gated behind analytics consent ─── */}
      {consent?.analytics && (
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
        </>
      )}

      {/* ─── Marketing Scripts — gated behind marketing consent ─── */}
      {consent?.marketing && (
        <>
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

      {/* ─── Cookie Consent Banner ─── */}
      <AnimatePresence>
        {shouldShowBanner && (
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
                  Read our <Link href="/privacy" className="text-gold hover:underline">Privacy Policy</Link> and{" "}
                  <Link href="/cookies" className="text-gold hover:underline">Cookie Policy</Link> to learn more.
                </p>
              </div>
              <button 
                onClick={handleDismissBanner}
                className="text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
                aria-label="Dismiss cookie banner"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDeclineAll}
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-all border border-border"
              >
                Decline
              </button>
              <button
                onClick={openPreferences}
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-all border border-border"
              >
                Customize
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-black font-bold text-sm transition-all shadow-lg shadow-gold/20"
              >
                Accept All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Cookie Preferences Modal ─── */}
      <AnimatePresence>
        {showPreferences && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setShowPreferences(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[61] rounded-2xl border border-border bg-popover/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-gold/10 flex items-center justify-center">
                    <Cookie size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-lg">Cookie Preferences</h3>
                    <p className="text-muted-foreground text-xs">Manage your cookie settings</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close preferences"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Categories */}
              <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                {/* Essential — always on */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield size={18} className="text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">Essential</h4>
                      <span className="px-2.5 py-0.5 bg-gold/10 text-gold text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Always Active
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      Required for core functionality — authentication, security, and site operation. Cannot be disabled.
                    </p>
                  </div>
                </div>

                {/* Analytics */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BarChart2 size={18} className="text-foreground/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">Analytics</h4>
                      <button
                        onClick={() => setDraftAnalytics(!draftAnalytics)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          draftAnalytics ? "bg-gold" : "bg-muted-foreground/30"
                        }`}
                        aria-label="Toggle analytics cookies"
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center ${
                            draftAnalytics ? "translate-x-5" : "translate-x-0"
                          }`}
                        >
                          {draftAnalytics && <Check size={12} className="text-gold" />}
                        </span>
                      </button>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      Help us understand how visitors interact with our website. Includes Google Analytics and error monitoring.
                    </p>
                  </div>
                </div>

                {/* Marketing */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Target size={18} className="text-foreground/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">Marketing</h4>
                      <button
                        onClick={() => setDraftMarketing(!draftMarketing)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          draftMarketing ? "bg-gold" : "bg-muted-foreground/30"
                        }`}
                        aria-label="Toggle marketing cookies"
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 flex items-center justify-center ${
                            draftMarketing ? "translate-x-5" : "translate-x-0"
                          }`}
                        >
                          {draftMarketing && <Check size={12} className="text-gold" />}
                        </span>
                      </button>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                      Used to deliver relevant advertisements and measure campaign effectiveness. Includes Meta Pixel and LinkedIn Insight.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-3 p-6 border-t border-border">
                <button
                  onClick={handleDeclineAll}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-all border border-border"
                >
                  Decline All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-black font-bold text-sm transition-all shadow-lg shadow-gold/20"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CookieConsentContext.Provider>
  );
}
