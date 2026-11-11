"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, Cookie, Database, Eye, FileText, Globe, Mail, Scale, Server, Shield, UserCheck, Users } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  const lastUpdated = "November 11, 2026";
  const effectiveDate = "November 11, 2026";

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
              PRIVACY <span className="text-gold">POLICY.</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-2xl mx-auto">
              Your privacy is fundamental to our business. This policy explains how Xinteck collects, 
              uses, and protects your personal data in accordance with the <strong>Kenya Data Protection Act 2019</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground mt-4">
              <span>Effective: {effectiveDate}</span>
              <span className="text-gold">•</span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </motion.div>
        </section>

        {/* Table of Contents */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-[10px] bg-gold/10 flex items-center justify-center">
                <FileText className="text-gold" size={20} />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-foreground">Quick Navigation</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { num: "01", title: "Who We Are", icon: Users },
                { num: "02", title: "Information We Collect", icon: Database },
                { num: "03", title: "How We Use Your Data", icon: Eye },
                { num: "04", title: "Legal Basis", icon: Scale },
                { num: "05", title: "Data Sharing", icon: Users },
                { num: "06", title: "International Transfers", icon: Globe },
                { num: "07", title: "Data Retention", icon: Server },
                { num: "08", title: "Data Security", icon: Shield },
                { num: "09", title: "Your Rights", icon: UserCheck },
                { num: "10", title: "Cookies", icon: Cookie },
                { num: "11", title: "Children's Privacy", icon: AlertTriangle },
                { num: "12", title: "Policy Updates", icon: Bell },
                { num: "13", title: "Contact Us", icon: Mail },
              ].map((item) => (
                <a 
                  key={item.num} 
                  href={`#section-${parseInt(item.num)}`} 
                  className="group flex items-center gap-3 p-3 rounded-[10px] border border-transparent hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors">
                    <item.icon className="text-gold" size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-gold">{item.num}</span>
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  </div>
                  <svg className="w-4 h-4 text-foreground/20 group-hover:text-gold group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Section 1: Who We Are */}
        <PolicySection id="section-1" icon={Users} title="1. Who We Are">
          <p>
            <strong>Xinteck</strong> is a premier software engineering and digital transformation enterprise registered and operating in <strong>Nairobi, Kenya</strong>. 
            We provide specialized technology solutions across six core methodology domains:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li><strong>Launchpad:</strong> Web Platforms & API Integrations (including Daraja M-Pesa automated rails)</li>
            <li><strong>Pulse:</strong> Android & iOS Mobile Applications</li>
            <li><strong>Backbone:</strong> Custom Business Systems & Automation (including KRA eTIMS integrations)</li>
            <li><strong>Canvas:</strong> UI/UX Design & Prototyping</li>
            <li><strong>Sentinel:</strong> Cloud Infrastructure & Security</li>
            <li><strong>Imprint:</strong> Business Identity & Print Design</li>
          </ul>
          <p className="mt-4 leading-relaxed">
            For the purposes of the <strong>Kenya Data Protection Act, 2019 (KDPA)</strong> and the <em>Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021</em>, 
            Xinteck acts as a registered <strong>Data Controller</strong> for personal data collected directly through our website and strategy sessions, and as a <strong>Data Processor</strong> when processing personal data strictly on behalf of our enterprise clients.
          </p>
          <div className="mt-6 p-4 bg-primary/5 rounded-[10px] border border-primary/10">
            <p className="text-sm text-foreground/70">
              <strong>Registered Jurisdiction:</strong> Nairobi, Kenya<br />
              <strong>Data Protection Point of Contact:</strong> <a href="mailto:info@xinteck.co.ke" className="text-gold hover:underline">info@xinteck.co.ke</a>
            </p>
          </div>
        </PolicySection>

        {/* Section 2: Information We Collect */}
        <PolicySection id="section-2" icon={Database} title="2. Information We Collect">
          <p>We collect the following categories of personal data:</p>
          
          <h4 className="font-bold mt-6 mb-2 text-foreground">2.1 Information You Provide</h4>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li><strong>Contact Information:</strong> Name, email address, phone number, company name</li>
            <li><strong>Project Details:</strong> Requirements, specifications, and business information shared during consultations</li>
            <li><strong>Account Data:</strong> Login credentials and preferences (if you create an account)</li>
            <li><strong>Communications:</strong> Messages, feedback, and correspondence with our team</li>
          </ul>

          <h4 className="font-bold mt-6 mb-2 text-foreground">2.2 Automatically Collected Data</h4>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li><strong>Technical Data:</strong> IP address, browser type and version, device information, operating system</li>
            <li><strong>Usage Data:</strong> Pages visited, time spent on pages, navigation paths, referring URLs</li>
            <li><strong>Cookie Data:</strong> Information collected via cookies and similar technologies (see our <Link href="/cookies" className="text-gold hover:underline">Cookie Policy</Link>)</li>
          </ul>

          <h4 className="font-bold mt-6 mb-2 text-foreground">2.3 Third-Party Data</h4>
          <p className="text-foreground/70">
            We may receive data from third parties such as business partners, analytics providers, 
            or publicly available sources to supplement our records.
          </p>
        </PolicySection>

        {/* Section 3: How We Use Your Data */}
        <PolicySection id="section-3" icon={Eye} title="3. How We Use Your Data">
          <p>We use your personal data for the following purposes:</p>
          <div className="mt-4 space-y-4">
            {[
              { purpose: "Service Delivery", desc: "To deliver the web, mobile, software, design, and cloud services you request" },
              { purpose: "Communication", desc: "To respond to inquiries, provide project updates, and support" },
              { purpose: "Business Operations", desc: "To manage contracts, invoicing, and maintain business records" },
              { purpose: "Improvement", desc: "To analyze usage patterns and improve our website and services" },
              { purpose: "Marketing", desc: "To send newsletters and promotional content (only with your consent)" },
              { purpose: "Legal Compliance", desc: "To comply with applicable laws, regulations, and legal processes" },
              { purpose: "Security", desc: "To detect, prevent, and address fraud, security issues, or technical problems" },
            ].map((item) => (
              <div key={item.purpose} className="flex gap-3">
                <div className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
                <div>
                  <strong className="text-foreground">{item.purpose}:</strong>{" "}
                  <span className="text-foreground">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </PolicySection>

        {/* Section 4: Legal Basis */}
        <PolicySection id="section-4" icon={Scale} title="4. Legal Basis for Processing">
          <p>Under the Kenya Data Protection Act 2019, we process your data based on the following legal grounds:</p>
          <div className="mt-6 space-y-4">
            <LegalBasisCard 
              title="Consent" 
              desc="You have given explicit consent for processing (e.g., subscribing to our newsletter or marketing communications). You can withdraw consent at any time."
            />
            <LegalBasisCard 
              title="Contract Performance" 
              desc="Processing is necessary to perform a contract with you or take pre-contractual steps at your request (e.g., delivering a software project you commissioned)."
            />
            <LegalBasisCard 
              title="Legal Obligation" 
              desc="Processing is required to comply with Kenyan law (e.g., tax records, financial reporting, legal proceedings)."
            />
            <LegalBasisCard 
              title="Legitimate Interests" 
              desc="Processing is necessary for our legitimate business interests (e.g., fraud prevention, analytics, improving services), provided these do not override your fundamental rights."
            />
          </div>
        </PolicySection>

        {/* Section 5: Data Sharing */}
        <PolicySection id="section-5" icon={Users} title="5. Data Sharing & Disclosure">
          <p>We do not sell your personal data. We may share your data with:</p>
          
          <h4 className="font-bold mt-6 mb-2 text-foreground">5.1 Service Providers</h4>
          <p className="text-foreground/70">
            Trusted third parties who assist in operating our business, including:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/70">
            <li>Cloud hosting providers (e.g., AWS, Vercel)</li>
            <li>Analytics services (e.g., PostHog, Google Analytics)</li>
            <li>Payment processors (for client billing)</li>
            <li>Email service providers</li>
          </ul>
          <p className="mt-2 text-foreground/70">
            These providers are bound by data processing agreements and may only use your data as instructed by us.
          </p>

          <h4 className="font-bold mt-6 mb-2 text-foreground">5.2 Legal Requirements</h4>
          <p className="text-foreground/70">
            We may disclose your data when required by law, court order, or to protect our legal rights.
          </p>

          <h4 className="font-bold mt-6 mb-2 text-foreground">5.3 Business Transfers</h4>
          <p className="text-foreground/70">
            In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity.
          </p>
        </PolicySection>

        {/* Section 6: International Transfers */}
        <PolicySection id="section-6" icon={Globe} title="6. International Data Transfers">
          <div className="p-4 bg-gold/5 border border-gold/20 rounded-[10px] mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-gold shrink-0 mt-1" size={20} />
              <p className="text-sm text-foreground/80">
                <strong>Kenya DPA Requirement:</strong> At least one serving copy of personal data must be stored 
                on a server or data center located in Kenya.
              </p>
            </div>
          </div>
          <p>
            Xinteck primarily processes and stores data within Kenya. However, some of our service providers 
            operate internationally. When we transfer data outside Kenya, we ensure:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li>The recipient country provides adequate data protection, OR</li>
            <li>Appropriate contractual safeguards are in place (Standard Contractual Clauses), OR</li>
            <li>You have provided explicit consent after being informed of potential risks</li>
          </ul>
        </PolicySection>

        {/* Section 7: Data Retention */}
        <PolicySection id="section-7" icon={Server} title="7. Data Retention">
          <p>We retain your personal data strictly for as long as necessary to fulfill the statutory, contractual, and operational purposes for which it was obtained:</p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-primary/10">
                  <th className="text-left py-3 font-bold text-foreground">Data Category</th>
                  <th className="text-left py-3 font-bold text-foreground">Retention Period</th>
                  <th className="text-left py-3 font-bold text-foreground">Legal & Regulatory Basis</th>
                </tr>
              </thead>
              <tbody className="text-foreground/70">
                <tr className="border-b border-primary/5">
                  <td className="py-3 font-medium text-foreground">Invoices, eTIMS data & financial records</td>
                  <td className="py-3">5 to 7 years</td>
                  <td className="py-3 text-xs">Tax Procedures Act, 2015 (Cap 469B) & KRA Regulations</td>
                </tr>
                <tr className="border-b border-primary/5">
                  <td className="py-3 font-medium text-foreground">Client service agreements & SOW contracts</td>
                  <td className="py-3">7 years post-termination</td>
                  <td className="py-3 text-xs">Limitation of Actions Act (Cap 22, Laws of Kenya)</td>
                </tr>
                <tr className="border-b border-primary/5">
                  <td className="py-3 font-medium text-foreground">Strategy session & consultation requests</td>
                  <td className="py-3">2 years from submission</td>
                  <td className="py-3 text-xs">Legitimate commercial interest & client onboarding</td>
                </tr>
                <tr className="border-b border-primary/5">
                  <td className="py-3 font-medium text-foreground">Marketing & newsletter consent</td>
                  <td className="py-3">Until consent withdrawn + 1 year</td>
                  <td className="py-3 text-xs">Section 37 Kenya Data Protection Act 2019</td>
                </tr>
                <tr className="border-b border-primary/5">
                  <td className="py-3 font-medium text-foreground">Aggregated website analytics telemetry</td>
                  <td className="py-3">14 months (then anonymized)</td>
                  <td className="py-3 text-xs">Performance optimization & statistical modeling</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-foreground/70 text-sm">
            Upon expiry of the applicable statutory or operational retention period, personal data is permanently deleted or irreversibly anonymized using secure data destruction standards.
          </p>
        </PolicySection>

        {/* Section 8: Data Security & Incident Breach Notification */}
        <PolicySection id="section-8" icon={Shield} title="8. Data Security & Breach Notification">
          <p>
            We implement industry-standard technical, administrative, and organizational safeguards designed to protect personal data against accidental loss, unauthorized access, destruction, or alteration:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li><strong>Cryptographic Controls:</strong> 256-bit TLS encryption in transit and AES-256 encryption at rest for sensitive database fields.</li>
            <li><strong>Access Governance:</strong> Role-based access control (RBAC), multi-factor authentication (MFA), and zero-trust VPC networks.</li>
            <li><strong>Infrastructure Hardening:</strong> Cloudflare edge security, rate-limiting, Web Application Firewalls (WAF), and automated vulnerability audits.</li>
            <li><strong>72-Hour Statutory Breach Protocol:</strong> In strict compliance with <strong>Section 43 of the Kenya Data Protection Act 2019</strong>, in the event of a personal data breach where there is a real risk of harm to data subjects, Xinteck shall notify the <strong>Office of the Data Protection Commissioner (ODPC) within 72 hours</strong> of becoming aware of the incident, and promptly notify affected individuals without undue delay.</li>
          </ul>
        </PolicySection>

        {/* Section 9: Your Rights */}
        <PolicySection id="section-9" icon={UserCheck} title="9. Your Rights Under Kenya DPA 2019">
          <p>
            As a data subject under the Kenya Data Protection Act 2019, you have the following rights:
          </p>
          <div className="mt-6 grid gap-4">
            <RightCard 
              title="Right to be Informed" 
              desc="You have the right to know how your data is collected and used. This policy fulfills that obligation."
            />
            <RightCard 
              title="Right of Access" 
              desc="You can request a copy of the personal data we hold about you."
            />
            <RightCard 
              title="Right to Rectification" 
              desc="You can request correction of inaccurate or incomplete personal data."
            />
            <RightCard 
              title="Right to Erasure" 
              desc="You can request deletion of your personal data where there is no compelling reason for continued processing."
            />
            <RightCard 
              title="Right to Restrict Processing" 
              desc="You can request that we limit how we use your data in certain circumstances."
            />
            <RightCard 
              title="Right to Data Portability" 
              desc="You can request your data in a structured, commonly used, machine-readable format."
            />
            <RightCard 
              title="Right to Object" 
              desc="You can object to processing based on legitimate interests or for direct marketing purposes."
            />
          </div>
          <div className="mt-6 p-4 bg-primary/5 rounded-[10px] border border-primary/10">
            <p className="text-sm text-foreground/70">
              <strong>To exercise your rights:</strong> Contact us at{" "}
              <a href="mailto:info@xinteck.co.ke" className="text-gold hover:underline">info@xinteck.co.ke</a>. 
              We will respond within <strong>30 days</strong> as required by law.
            </p>
            <p className="text-sm text-foreground/70 mt-2">
              <strong>Right to Complain:</strong> If you are unsatisfied with our response, you have the right to 
              lodge a complaint with the <strong>Office of the Data Protection Commissioner (ODPC)</strong> at{" "}
              <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.odpc.go.ke</a>.
            </p>
          </div>
        </PolicySection>

        {/* Section 10: Cookies */}
        <PolicySection id="section-10" icon={Cookie} title="10. Cookies">
          <p>
            Our website uses cookies and similar tracking technologies to enhance your experience, 
            analyze usage, and for marketing purposes.
          </p>
          <p className="mt-4">
            For detailed information about the cookies we use and how to manage your preferences, 
            please see our <Link href="/cookies" className="text-gold hover:underline font-bold">Cookie Policy</Link>.
          </p>
        </PolicySection>

        {/* Section 11: Children's Privacy */}
        <PolicySection id="section-11" icon={AlertTriangle} title="11. Children's Privacy">
          <p>
            Our services are not directed at individuals under the age of <strong>18</strong>. 
            We do not knowingly collect personal data from children.
          </p>
          <p className="mt-4 text-foreground/70">
            If you believe we have inadvertently collected data from a child, please contact us immediately 
            at <a href="mailto:info@xinteck.co.ke" className="text-gold hover:underline">info@xinteck.co.ke</a>, 
            and we will take steps to delete such information.
          </p>
        </PolicySection>

        {/* Section 12: Policy Updates */}
        <PolicySection id="section-12" icon={Bell} title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or for other operational reasons.
          </p>
          <p className="mt-4">
            When we make significant changes:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li>We will update the "Last Updated" date at the top of this page</li>
            <li>For material changes, we may notify you via email or a prominent notice on our website</li>
            <li>Your continued use of our services after changes constitutes acceptance of the updated policy</li>
          </ul>
        </PolicySection>

        {/* Section 13: Contact Us */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            id="section-13"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg text-center"
          >
            <div className="w-16 h-16 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold mx-auto mb-6">
              <Mail size={32} />
            </div>
            <h3 className="text-3xl font-black tracking-tight mb-4 text-foreground">Contact Us</h3>
            <p className="text-foreground mb-6 max-w-2xl mx-auto">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our 
              data practices, please contact us:
            </p>
            <div className="space-y-2 text-foreground">
              <p><strong>Email:</strong> <a href="mailto:info@xinteck.co.ke" className="text-gold hover:underline">info@xinteck.co.ke</a></p>
              <p><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
            <p className="text-sm text-foreground mt-6">
              We aim to respond to all legitimate requests within <strong>30 days</strong>.
            </p>
          </motion.div>
        </section>

        {/* Kenya DPA Notice */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-[10px] border border-gold/20 bg-gold/5 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <Scale className="text-gold shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-foreground mb-2">Kenya Data Protection Act 2019 Compliance</h4>
                <p className="text-sm text-foreground/70">
                  This Privacy Policy is designed to comply with the requirements of the 
                  Kenya Data Protection Act 2019 and related regulations. For more information about 
                  data protection in Kenya, visit the{" "}
                  <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                    Office of the Data Protection Commissioner (ODPC)
                  </a>.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}

// Reusable Policy Section Component
function PolicySection({ 
  id, 
  icon: Icon, 
  title, 
  children 
}: { 
  id: string; 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="max-w-4xl mx-auto w-full scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-8 md:p-12 rounded-[10px] border border-primary/10 bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-lg"
      >
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 rounded-[10px] bg-primary/10 flex items-center justify-center text-gold shrink-0">
            <Icon size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground">{title}</h3>
            <div className="text-foreground/70 leading-relaxed space-y-4">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// Legal Basis Card Component
function LegalBasisCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 bg-primary/5 rounded-[10px] border border-primary/10">
      <h5 className="font-bold text-foreground mb-1">{title}</h5>
      <p className="text-sm text-foreground/70">{desc}</p>
    </div>
  );
}

// Rights Card Component
function RightCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-[10px] border border-primary/10">
      <div className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
      <div>
        <h5 className="font-bold text-foreground">{title}</h5>
        <p className="text-sm text-foreground/70">{desc}</p>
      </div>
    </div>
  );
}
