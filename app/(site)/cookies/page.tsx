"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import { BarChart2, Cookie, Eye, Mail, Settings, Shield, Target, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

export default function CookiesPage() {
  const lastUpdated = "February 6, 2026";

  const cookieTypes = [
    {
      icon: Shield,
      name: "Essential Cookies",
      required: true,
      description: "These cookies are strictly necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.",
      examples: [
        { name: "session_id", purpose: "Maintains user session state", duration: "Session" },
        { name: "csrf_token", purpose: "Security - prevents cross-site request forgery", duration: "Session" },
        { name: "cookie_consent", purpose: "Stores your cookie preferences", duration: "1 year" },
      ]
    },
    {
      icon: BarChart2,
      name: "Analytics Cookies",
      required: false,
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website performance and user experience.",
      examples: [
        { name: "_ga", purpose: "Google Analytics - distinguishes users", duration: "2 years" },
        { name: "_gid", purpose: "Google Analytics - distinguishes users", duration: "24 hours" },
        { name: "ph_*", purpose: "PostHog - product analytics", duration: "1 year" },
      ]
    },
    {
      icon: Target,
      name: "Marketing Cookies",
      required: false,
      description: "These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.",
      examples: [
        { name: "_fbp", purpose: "Facebook - tracks visits across websites", duration: "3 months" },
        { name: "_gcl_au", purpose: "Google Ads - conversion tracking", duration: "90 days" },
      ]
    },
    {
      icon: Settings,
      name: "Preference Cookies",
      required: false,
      description: "These cookies enable the website to remember choices you make (such as your preferred language or the region you are in) and provide enhanced, more personal features.",
      examples: [
        { name: "theme", purpose: "Remembers your dark/light mode preference", duration: "1 year" },
        { name: "locale", purpose: "Stores your language preference", duration: "1 year" },
      ]
    },
  ];

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
      <div className="flex flex-col gap-16 md:gap-24 py-12 md:py-20 px-6">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto w-full text-center flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 bg-white/30 dark:bg-black/80 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 md:p-12 shadow-lg"
          >
            <h1 className="text-sm font-bold tracking-[0.3em] text-gold uppercase">
              Legal & Compliance
            </h1>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
              COOKIE <span className="text-gold">POLICY.</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-2xl mx-auto">
              This policy explains how Xinteck uses cookies and similar technologies 
              on our website, your choices regarding cookies, and how they affect your privacy.
            </p>
            <div className="text-xs font-bold uppercase tracking-widest text-foreground mt-4">
              Last Updated: {lastUpdated}
            </div>
          </motion.div>
        </section>

        {/* What Are Cookies */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold shrink-0">
                <Cookie size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">What Are Cookies?</h3>
                <div className="text-foreground/70 leading-relaxed space-y-4">
                  <p>
                    Cookies are small text files that are placed on your computer or mobile device when you visit 
                    a website. They are widely used to make websites work more efficiently and to provide 
                    information to the website owners.
                  </p>
                  <p>
                    <strong>First-party cookies</strong> are set by the website you are visiting. 
                    <strong> Third-party cookies</strong> are set by other domains (like analytics or advertising services) 
                    that run content on the page you're viewing.
                  </p>
                  <p>
                    Cookies can be "persistent" (remain on your device until deleted or expired) or "session" 
                    (deleted when you close your browser).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* How We Use Cookies */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold shrink-0">
                <Eye size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">How We Use Cookies</h3>
                <div className="text-foreground/70 leading-relaxed space-y-4">
                  <p>Xinteck uses cookies for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Essential Operations:</strong> To ensure our website functions correctly and securely</li>
                    <li><strong>Analytics:</strong> To understand how visitors use our website and identify areas for improvement</li>
                    <li><strong>Preferences:</strong> To remember your settings, such as dark mode or language</li>
                    <li><strong>Marketing:</strong> To deliver relevant advertisements (if applicable) and measure their effectiveness</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Cookie Categories */}
        <section className="max-w-4xl mx-auto w-full flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
              Types of <span className="text-gold">Cookies</span> We Use
            </h3>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Below is a detailed breakdown of the cookies used on our website, organized by category.
            </p>
          </motion.div>

          {cookieTypes.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold shrink-0">
                  <category.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-black tracking-tight text-foreground">{category.name}</h4>
                    {category.required ? (
                      <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full">
                        Always Active
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-foreground/60">
                        <ToggleLeft size={20} />
                        <span>Optional</span>
                      </div>
                    )}
                  </div>
                  <p className="text-foreground/70 mb-6">{category.description}</p>
                  
                  {/* Cookie Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-primary/10">
                          <th className="text-left py-2 font-bold text-foreground">Cookie Name</th>
                          <th className="text-left py-2 font-bold text-foreground">Purpose</th>
                          <th className="text-left py-2 font-bold text-foreground">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="text-foreground/70">
                        {category.examples.map((cookie) => (
                          <tr key={cookie.name} className="border-b border-primary/5">
                            <td className="py-2 font-mono text-xs">{cookie.name}</td>
                            <td className="py-2">{cookie.purpose}</td>
                            <td className="py-2">{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Managing Cookies */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold shrink-0">
                <ToggleRight size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">Managing Your Cookie Preferences</h3>
                <div className="text-foreground/70 leading-relaxed space-y-4">
                  <p>You have several options to control cookies:</p>
                  
                  <h4 className="font-bold text-foreground mt-6">Browser Settings</h4>
                  <p>
                    Most web browsers allow you to control cookies through their settings. You can set your 
                    browser to block or delete cookies. Here are links to popular browser cookie settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Chrome</a></li>
                    <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Mozilla Firefox</a></li>
                    <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Safari</a></li>
                    <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Microsoft Edge</a></li>
                  </ul>

                  <h4 className="font-bold text-foreground mt-6">Opt-Out Tools</h4>
                  <p>
                    You can also opt out of interest-based advertising through these industry tools:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Network Advertising Initiative</a></li>
                    <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Digital Advertising Alliance</a></li>
                    <li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Your Online Choices (EU)</a></li>
                  </ul>

                  <div className="p-4 bg-gold/5 border border-gold/20 rounded-[10px] mt-6">
                    <p className="text-sm">
                      <strong>Note:</strong> If you choose to disable cookies, some features of our website 
                      may not function correctly, and your user experience may be affected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Third Party Cookies */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold shrink-0">
                <Settings size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">Third-Party Services</h3>
                <div className="text-foreground/70 leading-relaxed space-y-4">
                  <p>
                    We use third-party services that may set their own cookies. We do not have control 
                    over these third-party cookies. The third parties we work with include:
                  </p>
                  <ul className="list-disc list-inside space-y-2 mt-4">
                    <li><strong>Google Analytics:</strong> Website analytics - <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Privacy Policy</a></li>
                    <li><strong>PostHog:</strong> Product analytics - <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Privacy Policy</a></li>
                    <li><strong>Vercel:</strong> Website hosting and analytics - <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Updates */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
          >
            <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">Updates to This Policy</h3>
            <p className="text-foreground/70">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. We encourage you to review this page periodically.
            </p>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg text-center"
          >
            <div className="w-16 h-16 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-4 text-foreground">Questions?</h3>
            <p className="text-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions about our use of cookies or this policy, please contact us:
            </p>
            <p className="text-foreground">
              <strong>Email:</strong> <a href="mailto:privacy@xinteck.co.ke" className="text-gold hover:underline">privacy@xinteck.co.ke</a>
            </p>
            <p className="mt-6">
              <Link href="/privacy" className="text-gold hover:underline font-bold">
                ← Back to Privacy Policy
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
