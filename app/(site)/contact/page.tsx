"use client";

import { getBusinessContact, getContactConfig, type BusinessContact, type ContactConfig } from "@/actions/public-config";
import { getPublicSiteSettings } from "@/actions/site-settings";
import { VideoScrollLayout } from "@/components/services/VideoScrollLayout";
import { TYPOGRAPHY } from "@/lib/typography";
import { VIDEO_STATS } from "@/lib/videoStats";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Globe, Info, Loader2, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic Config State
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [businessContact, setBusinessContact] = useState<BusinessContact>({ email: "info@xinteck.co.ke", phone: "+254 782 063 736" });
  const [contactPhones, setContactPhones] = useState<{ label: string; value: string }[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [availableBudgets, setAvailableBudgets] = useState<string[]>([]);
  
  // New Fields State
  const [projectType, setProjectType] = useState<string>("Build a New Product");
  const [industry, setIndustry] = useState<string>("Fintech");
  const [industryOther, setIndustryOther] = useState<string>("");

  // Math Captcha State
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");

  useEffect(() => {
    // Generate simple math problem with odd numbers only (3-19)
    const n1 = Math.floor(Math.random() * 9) * 2 + 3; // 3,5,7,9,11,13,15,17,19
    const n2 = Math.floor(Math.random() * 9) * 2 + 3;
    setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });

    // Fetch dynamic config
    getContactConfig().then((data) => {
            if (data) {
                setConfig(data);
                if (data.services.length > 0) {
                    setSelectedService(data.services[0]);
                }
            }
    });

    // Fetch business contact info
    getBusinessContact().then(setBusinessContact);

    // Fetch contact phones directly
    getPublicSiteSettings().then((settings) => {
      const phonesRaw = settings["CONTACT_PHONES"];
      if (phonesRaw) {
        try {
          const parsed = JSON.parse(phonesRaw);
          if (Array.isArray(parsed) && parsed.length > 0) setContactPhones(parsed);
        } catch { /* ignore parse errors */ }
      }
    });
  }, []);

  // Update budgets when service changes
  useEffect(() => {
    if (config && selectedService) {
        const budgets = config.budgets[selectedService] || config.budgets["Other"] || [];
        setAvailableBudgets(budgets);
    } else {
        setAvailableBudgets(["$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+"]);
    }
  }, [selectedService, config]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // 1. Math Verification
    if (parseInt(userCaptcha) !== captcha.answer) {
        setError(`Incorrect math verification. ${captcha.num1} + ${captcha.num2} is not ${userCaptcha}.`);
        return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const finalIndustry = industry === "Other" ? industryOther : industry;

    // Validate Other Industry
    if (industry === "Other" && !finalIndustry.trim()) {
        setError("Please specify your industry.");
        setIsSubmitting(false);
        return;
    }

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      projectType: formData.get("projectType"),
      industry: finalIndustry,
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
          throw new Error(resData.error || "Connection lost.");
      }
      
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "The signal was lost. Please try again or contact info@xinteck.co.ke");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lists
  const projectTypes = [
     "Build a New Product",
     "Scale Existing Platform",
     "Modernize Legacy System",
     "Hire Dedicated Team",
     "Consultation / Audit",
     "Other"
  ];

  const industries = [
     "Fintech", "Healthcare", "E-commerce", "Education", "Real Estate",
     "Logistics", "Media & Entertainment", "Travel & Hospitality", "Agriculture", "Manufacturing",
     "Other"
  ];

  // Construct Info Cards
  const phoneList = contactPhones.length > 0 ? contactPhones : [
    { label: "Main", value: businessContact.phone }
  ];

  const phoneCard = {
    title: "Call Us",
    value: (
        <div className="flex flex-col gap-3">
            {phoneList.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="text-primary font-bold text-base md:text-lg">{p.value}</span>
                    <span className="text-xs text-foreground font-mono uppercase tracking-wider">{p.label}</span>
                </div>
            ))}
        </div>
    ),
    icon: Phone,
    sub: "Mon - Fri, 9am - 6pm EST",
  };

  const infoCards = [
    {
        title: "Email Us",
        value: businessContact.email,
        icon: Mail,
        sub: "For general inquiries and partnerships",
    },
    phoneCard,
  ];

  if (submitted) {
    return (
      <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center pt-20">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-16 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-8 max-w-2xl"
          >
            <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center text-primary animate-bounce">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-5xl font-black tracking-tighter italic uppercase text-foreground">Mission Launched.</h2>
            <p className="text-xl text-foreground leading-relaxed">
              Your inquiry has reached our command center. Our engineers are reviewing 
              the coordinates and will reach out within <span className="text-primary font-bold">4 hours</span>.
            </p>
            <button 
              onClick={() => { setSubmitted(false); setIsSubmitting(false); }}
              className="px-10 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-black transition-all"
            >
              Send Another Signal
            </button>
          </motion.div>
        </div>
      </VideoScrollLayout>
    );
  }

  return (
    <VideoScrollLayout videoSrc={VIDEO_STATS.contact.src} videoStats={VIDEO_STATS.contact}>
      <div className="flex flex-col gap-12 md:gap-24 py-12 md:py-20 px-6">
        {/* Header */}
        <section className="max-w-7xl mx-auto w-full text-center lg:text-left grid lg:grid-cols-2 gap-12 lg:gap-16 items-end pt-12 md:pt-20">
          <motion.div
             initial={{ opacity: 0, x: -30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="flex flex-col gap-6 md:gap-8"
          >
             <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl p-6 md:p-8 rounded-[10px] inline-block w-fit mx-auto lg:mx-0">
              <h1 className="text-sm md:text-base font-bold text-gold uppercase tracking-[0.2em] mb-4">
                Let&apos;s Collaborate
              </h1>
              <h2 className="text-2xl md:text-5xl font-extrabold tracking-tighter text-foreground uppercase">
                START THE <br />
                <span className="text-primary">CONVERSATION.</span>
              </h2>
            </div>
            <p className={`${TYPOGRAPHY.pageSubtitle} max-w-xl mx-auto lg:mx-0 bg-white/30 dark:bg-black/80 backdrop-blur-xl p-6 rounded-[10px] shadow-lg text-foreground`}>
              Have a complex problem? An ambitious idea? Or just want to say hello? 
              Our team is ready to listen and build.
            </p>
          </motion.div>
          
          <div className="hidden lg:flex flex-col gap-4 text-right items-end">
             <div className={`${TYPOGRAPHY.badge} flex items-center gap-3 text-primary bg-white/30 dark:bg-black/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg`}>
               <Clock size={24} />
               Response Time: &lt; 4 Hours
             </div>
          </div>
        </section>

        {/* Main Grid */}
        <section className="max-w-7xl mx-auto w-full grid lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Info Cards */}
          <div className="flex flex-col gap-6 md:gap-8 lg:col-span-1">
            {infoCards.map((item, i) => (
              <motion.div
                key={item.title + i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 md:p-8 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl transition-all flex flex-col gap-4 shadow-lg"
              >
                <div className="w-12 h-12 rounded-[10px] bg-background/80 flex items-center justify-center text-primary">
                  <item.icon size={24} />
                </div>
                <h4 className={`${TYPOGRAPHY.cardTitle} text-foreground`}>{item.title}</h4>
                <div className={`${TYPOGRAPHY.cardTitle} text-primary`}>
                  {item.value}
                </div>
                <p className={`${TYPOGRAPHY.meta} text-foreground text-sm`}>{item.sub}</p>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="lg:col-span-2 p-6 md:p-16 rounded-[10px] bg-white/30 dark:bg-black/80 backdrop-blur-xl shadow-2xl relative"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8">
              {/* Row 1: Identity */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all placeholder:text-white/70 text-foreground ${TYPOGRAPHY.input}`}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="john@company.com"
                    className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all placeholder:text-white/70 text-foreground ${TYPOGRAPHY.input}`}
                  />
                </div>
              </div>

              {/* Row 2: Phone & Service */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                 <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="+254 7XX XXX XXX"
                    className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all placeholder:text-white/70 text-foreground ${TYPOGRAPHY.input}`}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Service Type</label>
                  <select 
                     name="service" 
                     value={selectedService}
                     onChange={(e) => setSelectedService(e.target.value)}
                     className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all appearance-none cursor-pointer text-foreground ${TYPOGRAPHY.input}`}
                  >
                     {config ? (
                        config.services.map(s => <option key={s} className="bg-background text-foreground">{s}</option>)
                     ) : (
                        <option className="bg-background text-foreground">Loading...</option>
                     )}
                     <option className="bg-background text-foreground">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Intent */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>I Need To...</label>
                  <select 
                     name="projectType"
                     required
                     value={projectType}
                     onChange={(e) => setProjectType(e.target.value)}
                     className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all appearance-none cursor-pointer text-foreground ${TYPOGRAPHY.input}`}
                  >
                     {projectTypes.map(t => <option key={t} value={t} className="bg-background text-foreground">{t}</option>)}
                  </select>
                </div>
                 <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Budget Range</label>
                  <select name="budget" className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all appearance-none cursor-pointer text-foreground ${TYPOGRAPHY.input}`}>
                      {availableBudgets.map(b => (
                        <option key={b} className="bg-background text-foreground">{b}</option>
                     ))}
                  </select>
                </div>
              </div>

                <div className="grid md:grid-cols-1 gap-6 md:gap-8">
                   <div className="flex flex-col gap-3">
                  <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Industry</label>
                  <select 
                     name="industry"
                     required
                     value={industry}
                     onChange={(e) => setIndustry(e.target.value)}
                     className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all appearance-none cursor-pointer text-foreground ${TYPOGRAPHY.input}`}
                  >
                     {industries.map(i => <option key={i} value={i} className="bg-background text-foreground">{i}</option>)}
                  </select>
                  {industry === "Other" && (
                    <motion.input 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        type="text" 
                        value={industryOther}
                        onChange={(e) => setIndustryOther(e.target.value)}
                        placeholder="Please specify your industry..."
                        className="bg-muted/10 rounded-[10px] px-6 py-3 mt-2 outline-none transition-all text-foreground font-bold placeholder:text-foreground"
                    />
                  )}
                </div>
              </div>

                <div className="flex flex-col gap-3">
                <label className={`${TYPOGRAPHY.tableHeader} text-foreground font-bold uppercase`}>Project Summary</label>
                <textarea 
                  name="message"
                  rows={8}
                  required
                  maxLength={2000}
                  placeholder="Tell us about your mission... (at least 10 chars, max 300 words)"
                  className={`bg-muted/10 rounded-[10px] px-6 py-4 outline-none transition-all placeholder:text-white/70 text-foreground resize-none ${TYPOGRAPHY.input}`}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    if (words.length > 300) {
                      e.target.value = words.slice(0, 300).join(' ');
                    }
                  }}
                />
                <p className="text-xs text-foreground text-right">Max 300 words</p>
              </div>

               {/* Human Verification */}
              <div className="bg-white/10 p-6 rounded-[10px] flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-3 text-primary">
                    <Info size={24} />
                    <span className="font-bold text-sm uppercase tracking-widest text-foreground">Human Verification</span>
                </div>
                <div className="flex-1 flex items-center gap-4">
                    <span className="text-xl font-black text-foreground">{captcha.num1} + {captcha.num2} = ?</span>
                    <input 
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        required
                        className="w-24 bg-white/10 rounded-[8px] px-4 py-2 text-center font-bold text-foreground outline-none"
                    />
                </div>
              </div>

              {error && <p className="text-destructive font-bold text-sm italic">{error}</p>}

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-fit px-8 md:px-12 py-3 bg-primary text-primary-foreground rounded-[10px] hover:bg-primary/90 transition-all flex items-center justify-center gap-4 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group ${TYPOGRAPHY.button}`}
              >
                {isSubmitting ? (
                  <>Launching... <Loader2 className="animate-spin" size={24} /></>
                ) : (
                  <>Launch Inquiry <Send size={24} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </motion.div>
        </section>

         {/* Social Bar */}
        <section className="max-w-7xl mx-auto w-full flex flex-col items-center gap-8 md:gap-12 pt-12 md:pt-24 text-center pb-12 md:pb-20">
           <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl px-8 py-4 rounded-[10px] shadow-lg">
              <h4 className="font-bold text-lg md:text-xl text-foreground">Prefer direct messaging?</h4>
           </div>
           <div className="flex flex-wrap justify-center gap-4 md:gap-6">
               <a 
                 href="https://wa.me/254795213399"
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-[10px] bg-green-600 text-white hover:bg-green-500 transition-all shadow-lg hover:shadow-green-600/20 ${TYPOGRAPHY.button}`}
               >
                  <MessageCircle size={24} /> WhatsApp Business
               </a>
               <button className={`flex items-center gap-3 px-6 md:px-8 py-3 rounded-[10px] bg-blue-600 text-white hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/20 ${TYPOGRAPHY.button}`}>
                  <Globe size={24} /> LinkedIn Career
               </button>
           </div>
        </section>
      </div>
    </VideoScrollLayout>
  );
}
