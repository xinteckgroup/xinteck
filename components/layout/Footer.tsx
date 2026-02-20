"use client";

import { getBusinessContact, type BusinessContact } from "@/actions/public-config";
import { useServices } from "@/components/providers/ServicesContext";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/xinteck", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/xinteck", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/xinteck", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/xinteck", label: "Instagram" },
];

const staticLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Case Studies", href: "/portfolio" },
    { label: "Services", href: "/services" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  const dynamicServices = useServices();
  const [contact, setContact] = useState<BusinessContact>({ email: "info@xinteck.co.ke", phone: "+254 782 063 736" });

  useEffect(() => {
    getBusinessContact().then(setContact);
  }, []);

  // Build service links from context
  const serviceLinks = dynamicServices.map(s => ({
    label: s.name,
    href: `/services/${s.slug}`,
  }));

  return (
    <footer className="relative bg-[#000000] pt-24 pb-8 overflow-hidden border-t border-white/10 text-white">
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-16">
        {/* CTA Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-16 border-b border-white/10">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white leading-[0.95]">
              LET'S BUILD <br />
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-500">IMPOSSIBLE.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md">
              Ready to transform your vision into reality? Let's create something extraordinary together.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Link href="/contact" className="group relative">
              <div className="px-8 py-4 bg-[#D4AF37] rounded-[10px] flex items-center justify-between gap-6 hover:scale-[1.02] transition-transform shadow-[0_4px_14px_0_rgba(0,0,0,0.2)]">
                <span className="text-lg font-black text-black whitespace-nowrap">START PROJECT</span>
                <ArrowUpRight className="text-black group-hover:rotate-45 transition-transform" size={24} />
              </div>
            </Link>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Or email us at</span>
              <a href={`mailto:${contact.email}`} className="text-lg font-bold text-white hover:text-[#D4AF37] transition-colors">
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <motion.div
                initial={{ width: "120px", borderRadius: "9999px" }}
                whileHover={{ width: "280px", borderRadius: "20px" }}
                transition={{ 
                  width: { type: "spring", stiffness: 300, damping: 20 },
                  borderRadius: { type: "spring", stiffness: 300, damping: 20 }
                }}
                className="relative border-2 border-[#D4AF37] p-2 bg-black overflow-hidden h-[120px] flex items-center justify-center animate-gold-pulse"
              >
                {/* Always show Dark Mode Logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[100px] h-[100px] transition-opacity duration-300 group-hover:opacity-0">
                        <Image
                            src="/logos/logo-dark.webp"
                            alt="Xinteck"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <Image
                            src="/logos/logo-dark-full.webp"
                            alt="Xinteck Full"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
              </motion.div>
            </Link>
            <p className="text-gray-400 max-w-xs leading-relaxed">
              Engineering the digital future.
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-col gap-3 text-sm">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Mail size={16} />
                {contact.email}
              </a>
              <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Phone size={16} />
                {contact.phone}
              </a>
              <span className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} />
                Nairobi, Kenya
              </span>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-[10px] bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-black transition-all"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Company</h4>
            <nav className="flex flex-col gap-3">
              {staticLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services Links — Dynamic from DB */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Services</h4>
            <nav className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Resources</h4>
            <nav className="flex flex-col gap-3">
              {staticLinks.resources.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm">Legal</h4>
            <nav className="flex flex-col gap-3">
              {staticLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#D4AF37] transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-end items-center gap-4 pt-8 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Xinteck Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
