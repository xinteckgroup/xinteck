"use client";

import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Briefcase,
    CreditCard,
    FileCheck,
    FileText,
    Gavel,
    Handshake,
    Key,
    Lock,
    Mail,
    Scale,
    Shield,
    Users,
    XCircle
} from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  const lastUpdated = "February 6, 2026";
  const effectiveDate = "February 6, 2026";

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
              TERMS OF <span className="text-gold">SERVICE.</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-2xl mx-auto">
              These terms govern your use of Xinteck's services. By engaging with us, 
              you agree to these legally binding terms under <strong>Kenyan law</strong>.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-widest text-foreground mt-4">
              <span>Effective: {effectiveDate}</span>
              <span className="text-gold">•</span>
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </motion.div>
        </section>

        {/* Quick Navigation */}
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
                { num: "01", title: "Acceptance of Terms", icon: FileCheck },
                { num: "02", title: "Our Services", icon: Briefcase },
                { num: "03", title: "Client Responsibilities", icon: Users },
                { num: "04", title: "Project Engagement", icon: Handshake },
                { num: "05", title: "Payment Terms", icon: CreditCard },
                { num: "06", title: "Intellectual Property", icon: Key },
                { num: "07", title: "Confidentiality", icon: Lock },
                { num: "08", title: "Warranties", icon: Shield },
                { num: "09", title: "Limitation of Liability", icon: AlertTriangle },
                { num: "10", title: "Indemnification", icon: Scale },
                { num: "11", title: "Termination", icon: XCircle },
                { num: "12", title: "Data Protection", icon: Shield },
                { num: "13", title: "Governing Law", icon: Gavel },
                { num: "14", title: "Dispute Resolution", icon: Scale },
                { num: "15", title: "General Provisions", icon: FileText },
                { num: "16", title: "Contact Us", icon: Mail },
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

        {/* Section 1: Acceptance of Terms */}
        <TermsSection id="section-1" icon={FileCheck} title="1. Acceptance of Terms">
          <p>
            By accessing Xinteck's website, engaging our services, or entering into a service agreement with us, 
            you ("Client", "you", or "your") agree to be bound by these Terms of Service ("Terms"). 
            If you are entering into these Terms on behalf of a company or organization, you represent that 
            you have the authority to bind that entity.
          </p>
          <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-[10px]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-gold shrink-0 mt-1" size={20} />
              <p className="text-sm text-foreground/80">
                <strong>Important:</strong> If you do not agree with any part of these Terms, you must not 
                use our services. Your continued use constitutes acceptance of any updates to these Terms.
              </p>
            </div>
          </div>
        </TermsSection>

        {/* Section 2: Our Services */}
        <TermsSection id="section-2" icon={Briefcase} title="2. Our Services">
          <p>
            Xinteck provides professional technology services including, but not limited to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li><strong>Web Development:</strong> Custom websites, web applications, e-commerce platforms</li>
            <li><strong>Mobile App Development:</strong> iOS, Android, and cross-platform applications</li>
            <li><strong>Custom Software Development:</strong> Enterprise solutions, APIs, integrations</li>
            <li><strong>UI/UX Design:</strong> User interface design, user experience research, prototyping</li>
            <li><strong>Cloud & DevOps:</strong> Cloud infrastructure, deployment, monitoring, and optimization</li>
          </ul>
          <p className="mt-4">
            The specific scope, deliverables, timelines, and pricing for each project will be defined in a 
            separate <strong>Statement of Work (SOW)</strong> or <strong>Service Agreement</strong> signed by both parties.
          </p>
        </TermsSection>

        {/* Section 3: Client Responsibilities */}
        <TermsSection id="section-3" icon={Users} title="3. Client Responsibilities">
          <p>To ensure successful project delivery, you agree to:</p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li>Provide accurate and complete project requirements and specifications</li>
            <li>Supply all necessary content, materials, and access credentials in a timely manner</li>
            <li>Designate an authorized representative for communication and approvals</li>
            <li>Review and provide feedback on deliverables within agreed timelines</li>
            <li>Ensure legal rights to use any content, trademarks, or materials provided to us</li>
            <li>Not use our services for any unlawful purpose or in violation of any applicable laws</li>
          </ul>
          <p className="mt-4 text-foreground/70">
            Delays in providing required materials or feedback may result in project timeline extensions 
            and potential additional costs.
          </p>
        </TermsSection>

        {/* Section 4: Project Engagement */}
        <TermsSection id="section-4" icon={Handshake} title="4. Project Engagement Process">
          <p>Our standard engagement process follows these phases:</p>
          <div className="mt-6 space-y-4">
            {[
              { phase: "Discovery", desc: "Initial consultation, requirements gathering, and project scoping" },
              { phase: "Proposal", desc: "Detailed quote, timeline, and Statement of Work (SOW)" },
              { phase: "Agreement", desc: "Signed contract and deposit payment to commence work" },
              { phase: "Development", desc: "Iterative development with regular progress updates" },
              { phase: "Review & QA", desc: "Testing, client review, and revision cycles (as agreed)" },
              { phase: "Delivery", desc: "Final handover, training (if applicable), and documentation" },
              { phase: "Support", desc: "Post-launch support period as defined in the SOW" },
            ].map((item) => (
              <div key={item.phase} className="flex gap-3">
                <div className="w-2 h-2 bg-gold rounded-full mt-2 shrink-0" />
                <div>
                  <strong className="text-foreground">{item.phase}:</strong>{" "}
                  <span className="text-foreground">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </TermsSection>

        {/* Section 5: Payment Terms */}
        <TermsSection id="section-5" icon={CreditCard} title="5. Payment Terms">
          <h4 className="font-bold text-foreground mb-2">5.1 Fees and Invoicing</h4>
          <ul className="list-disc list-inside space-y-2 text-foreground/70">
            <li>All fees will be outlined in the Statement of Work (SOW)</li>
            <li>Quotes are valid for <strong>30 days</strong> unless otherwise specified</li>
            <li>Invoices are due within <strong>14 days</strong> of issue unless otherwise agreed</li>
          </ul>

          <h4 className="font-bold text-foreground mb-2 mt-6">5.2 Payment Structure</h4>
          <p className="text-foreground/70">
            Unless otherwise agreed, projects typically follow this payment structure:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li><strong>50%</strong> upfront deposit to commence work</li>
            <li><strong>25%</strong> upon reaching agreed milestone(s)</li>
            <li><strong>25%</strong> upon project completion and delivery</li>
          </ul>

          <h4 className="font-bold text-foreground mb-2 mt-6">5.3 Taxes</h4>
          <div className="p-4 bg-gold/5 border border-gold/20 rounded-[10px]">
            <p className="text-sm text-foreground/80">
              <strong>Kenya VAT:</strong> All fees are exclusive of Value Added Tax (VAT) at the prevailing 
              rate of <strong>16%</strong>, which will be added to invoices where applicable under Kenyan tax law.
            </p>
          </div>

          <h4 className="font-bold text-foreground mb-2 mt-6">5.4 Late Payments</h4>
          <p className="text-foreground/70">
            Overdue invoices may attract interest at <strong>2% per month</strong>. Xinteck reserves the right 
            to suspend work on projects with outstanding payments exceeding 30 days.
          </p>
        </TermsSection>

        {/* Section 6: Intellectual Property */}
        <TermsSection id="section-6" icon={Key} title="6. Intellectual Property Rights">
          <div className="p-4 bg-gold/5 border border-gold/20 rounded-[10px] mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-gold shrink-0 mt-1" size={20} />
              <p className="text-sm text-foreground/80">
                <strong>Kenya IP Law:</strong> Software is protected under copyright law as a "computer program" 
                (literary work) under the Copyright Act (Cap 130, Laws of Kenya).
              </p>
            </div>
          </div>

          <h4 className="font-bold text-foreground mb-2">6.1 Ownership of Deliverables</h4>
          <p className="text-foreground/70">
            Upon <strong>full payment</strong> of all fees, ownership of the final deliverables (custom code, 
            designs, and documentation) created specifically for your project will transfer to you, unless 
            otherwise specified in the SOW.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">6.2 Xinteck Pre-Existing Materials</h4>
          <p className="text-foreground/70">
            Xinteck retains ownership of:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li>Pre-existing code, libraries, frameworks, and tools developed before or independently of your project</li>
            <li>Generic components, templates, or modules that may be reused across projects</li>
            <li>Internal processes, methodologies, and know-how</li>
          </ul>
          <p className="mt-2 text-foreground/70">
            You are granted a perpetual, non-exclusive license to use such materials as incorporated in your deliverables.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">6.3 Third-Party Materials</h4>
          <p className="text-foreground/70">
            Projects may incorporate third-party software, libraries, or assets (e.g., open-source code, stock images). 
            Such materials remain subject to their respective licenses, which will be disclosed to you.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">6.4 Portfolio Rights</h4>
          <p className="text-foreground/70">
            Unless agreed otherwise in writing, Xinteck reserves the right to showcase completed work in our 
            portfolio, case studies, and marketing materials.
          </p>
        </TermsSection>

        {/* Section 7: Confidentiality */}
        <TermsSection id="section-7" icon={Lock} title="7. Confidentiality">
          <p>
            Both parties agree to maintain the confidentiality of any proprietary or sensitive information 
            disclosed during the engagement, including but not limited to:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li>Business strategies, plans, and financial information</li>
            <li>Technical specifications, source code, and algorithms</li>
            <li>Customer data and user information</li>
            <li>Trade secrets and proprietary methodologies</li>
          </ul>
          <p className="mt-4 text-foreground/70">
            Confidentiality obligations survive the termination of the engagement and shall remain in effect 
            for a period of <strong>5 years</strong> following project completion.
          </p>
          <p className="mt-4 text-foreground/70">
            <strong>Exceptions:</strong> Information that is publicly available, independently developed, or 
            required to be disclosed by law is not considered confidential.
          </p>
        </TermsSection>

        {/* Section 8: Warranties */}
        <TermsSection id="section-8" icon={Shield} title="8. Warranties & Disclaimers">
          <h4 className="font-bold text-foreground mb-2">8.1 Our Warranties</h4>
          <p className="text-foreground/70">Xinteck warrants that:</p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li>Services will be performed in a professional and workmanlike manner</li>
            <li>Deliverables will substantially conform to agreed specifications for a period of <strong>30 days</strong> following delivery ("Warranty Period")</li>
            <li>We have the right to provide the services and grant the licenses described herein</li>
          </ul>

          <h4 className="font-bold text-foreground mb-2 mt-6">8.2 Warranty Remedies</h4>
          <p className="text-foreground/70">
            If deliverables fail to conform to specifications during the Warranty Period, Xinteck will, at 
            its discretion, either repair or re-perform the non-conforming portion at no additional cost.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">8.3 Disclaimers</h4>
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-[10px]">
            <p className="text-sm text-foreground/70">
              <strong>EXCEPT AS EXPRESSLY PROVIDED HEREIN, ALL SERVICES AND DELIVERABLES ARE PROVIDED 
              "AS IS" WITHOUT WARRANTY OF ANY KIND.</strong> Xinteck disclaims all implied warranties, 
              including merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </div>
          <p className="mt-4 text-foreground/70">
            Xinteck does not warrant that deliverables will be error-free, uninterrupted, or compatible 
            with all systems or platforms not specified in the SOW.
          </p>
        </TermsSection>

        {/* Section 9: Limitation of Liability */}
        <TermsSection id="section-9" icon={AlertTriangle} title="9. Limitation of Liability">
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-[10px]">
            <h4 className="font-bold text-foreground mb-2">Cap on Liability</h4>
            <p className="text-sm text-foreground/70">
              To the maximum extent permitted by Kenyan law, Xinteck's total aggregate liability arising 
              from or related to these Terms or any project shall not exceed <strong>the total fees paid 
              by you for the specific project giving rise to the claim</strong>.
            </p>
          </div>

          <h4 className="font-bold text-foreground mb-2 mt-6">Exclusion of Damages</h4>
          <p className="text-foreground/70">
            In no event shall Xinteck be liable for any:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Costs of procurement of substitute services</li>
            <li>Damages arising from your misuse of deliverables or failure to follow instructions</li>
          </ul>
          <p className="mt-4 text-foreground/70 text-sm">
            These limitations apply regardless of the legal theory (contract, tort, or otherwise) and 
            even if Xinteck has been advised of the possibility of such damages.
          </p>
        </TermsSection>

        {/* Section 10: Indemnification */}
        <TermsSection id="section-10" icon={Scale} title="10. Indemnification">
          <p>You agree to indemnify, defend, and hold harmless Xinteck, its directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable legal fees) arising from:</p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li>Your breach of these Terms or any applicable laws</li>
            <li>Your use of deliverables in a manner not contemplated by the SOW</li>
            <li>Third-party claims related to content, materials, or data you provided</li>
            <li>Infringement of third-party rights caused by your instructions or materials</li>
          </ul>
        </TermsSection>

        {/* Section 11: Termination */}
        <TermsSection id="section-11" icon={XCircle} title="11. Termination">
          <h4 className="font-bold text-foreground mb-2">11.1 Termination by Client</h4>
          <p className="text-foreground/70">
            You may terminate a project by providing <strong>14 days written notice</strong>. Upon termination:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li>You are liable for all fees for work completed up to the termination date</li>
            <li>Any upfront deposits are non-refundable unless otherwise agreed</li>
            <li>Ownership of completed deliverables transfers upon payment of all outstanding fees</li>
          </ul>

          <h4 className="font-bold text-foreground mb-2 mt-6">11.2 Termination by Xinteck</h4>
          <p className="text-foreground/70">
            Xinteck may terminate or suspend services if:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2 text-foreground/70">
            <li>You breach these Terms and fail to cure within 14 days of notice</li>
            <li>Payments are overdue by more than 30 days</li>
            <li>You become insolvent or enter bankruptcy proceedings</li>
            <li>Continued engagement would violate applicable law or professional ethics</li>
          </ul>

          <h4 className="font-bold text-foreground mb-2 mt-6">11.3 Post-Termination</h4>
          <p className="text-foreground/70">
            Upon termination, obligations relating to confidentiality, intellectual property, limitation 
            of liability, and indemnification shall survive.
          </p>
        </TermsSection>

        {/* Section 12: Data Protection */}
        <TermsSection id="section-12" icon={Shield} title="12. Data Protection">
          <p>
            Both parties shall comply with the <strong>Kenya Data Protection Act 2019</strong> and related 
            regulations when processing personal data in connection with our services.
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-foreground/70">
            <li>Where Xinteck processes personal data on your behalf, we act as a <strong>Data Processor</strong></li>
            <li>You remain the <strong>Data Controller</strong> responsible for the lawfulness of data processing</li>
            <li>We will implement appropriate technical and organizational security measures</li>
            <li>Personal data will not be transferred outside Kenya without appropriate safeguards</li>
          </ul>
          <p className="mt-4">
            For more information about how we handle data, please see our{" "}
            <Link href="/privacy" className="text-gold hover:underline font-bold">Privacy Policy</Link>.
          </p>
        </TermsSection>

        {/* Section 13: Governing Law */}
        <TermsSection id="section-13" icon={Gavel} title="13. Governing Law">
          <div className="p-4 bg-gold/5 border border-gold/20 rounded-[10px]">
            <p className="text-foreground/80">
              These Terms shall be governed by and construed in accordance with the <strong>laws of the 
              Republic of Kenya</strong>, without regard to conflict of law principles.
            </p>
          </div>
          <p className="mt-4 text-foreground/70">
            Any legal action or proceeding arising under these Terms shall be brought exclusively in the 
            courts located in <strong>Nairobi, Kenya</strong>, and both parties consent to the personal 
            jurisdiction of such courts.
          </p>
        </TermsSection>

        {/* Section 14: Dispute Resolution */}
        <TermsSection id="section-14" icon={Scale} title="14. Dispute Resolution">
          <h4 className="font-bold text-foreground mb-2">14.1 Negotiation</h4>
          <p className="text-foreground/70">
            In the event of any dispute, the parties shall first attempt to resolve the matter through 
            good-faith negotiation for a period of <strong>30 days</strong>.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">14.2 Mediation</h4>
          <p className="text-foreground/70">
            If negotiation fails, the parties agree to submit the dispute to mediation administered by 
            a mutually agreed mediator or the <strong>Chartered Institute of Arbitrators (Kenya Branch)</strong>.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">14.3 Arbitration</h4>
          <p className="text-foreground/70">
            If mediation fails, the dispute shall be resolved by binding arbitration in Nairobi, Kenya, 
            under the <strong>Arbitration Act 1995 (Cap 49, Laws of Kenya)</strong>. The arbitration 
            decision shall be final and binding.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">14.4 Injunctive Relief</h4>
          <p className="text-foreground/70">
            Notwithstanding the above, either party may seek injunctive or other equitable relief from 
            a court of competent jurisdiction to protect its intellectual property or confidential information.
          </p>
        </TermsSection>

        {/* Section 15: General Provisions */}
        <TermsSection id="section-15" icon={FileText} title="15. General Provisions">
          <h4 className="font-bold text-foreground mb-2">15.1 Entire Agreement</h4>
          <p className="text-foreground/70">
            These Terms, together with any signed SOW or Service Agreement, constitute the entire agreement 
            between the parties and supersede all prior negotiations, representations, or agreements.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">15.2 Amendments</h4>
          <p className="text-foreground/70">
            Xinteck may update these Terms from time to time. We will notify you of material changes via 
            email or website notice. Continued use of services after notification constitutes acceptance.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">15.3 Severability</h4>
          <p className="text-foreground/70">
            If any provision of these Terms is found invalid or unenforceable, the remaining provisions 
            shall continue in full force and effect.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">15.4 No Waiver</h4>
          <p className="text-foreground/70">
            Failure to enforce any right or provision shall not constitute a waiver of that right.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">15.5 Assignment</h4>
          <p className="text-foreground/70">
            You may not assign or transfer these Terms without our prior written consent. Xinteck may 
            assign its rights and obligations without restriction.
          </p>

          <h4 className="font-bold text-foreground mb-2 mt-6">15.6 Force Majeure</h4>
          <p className="text-foreground/70">
            Neither party shall be liable for delays or failures due to circumstances beyond reasonable 
            control, including natural disasters, war, terrorism, strikes, or government actions.
          </p>
        </TermsSection>

        {/* Section 16: Contact Us */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            id="section-16"
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
              If you have any questions about these Terms of Service or need clarification on any provisions, 
              please contact our legal team:
            </p>
            <div className="space-y-2 text-foreground">
              <p><strong>Email:</strong> <a href="mailto:legal@xinteck.co.ke" className="text-gold hover:underline">legal@xinteck.co.ke</a></p>
              <p><strong>Address:</strong> Nairobi, Kenya</p>
            </div>
          </motion.div>
        </section>

        {/* Kenya Law Notice */}
        <section className="max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-[10px] border border-gold/20 bg-gold/5 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <Gavel className="text-gold shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-bold text-foreground mb-2">Kenyan Law Compliance</h4>
                <p className="text-sm text-foreground/70">
                  These Terms of Service are designed to comply with Kenyan law, including the 
                  <strong> Contract Law principles</strong>, <strong>Consumer Protection Act</strong>, 
                  <strong> Data Protection Act 2019</strong>, <strong>Copyright Act (Cap 130)</strong>, 
                  and <strong>Arbitration Act 1995</strong>. For specific legal advice, please consult 
                  a qualified Kenyan attorney.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}

// Reusable Terms Section Component
function TermsSection({ 
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
