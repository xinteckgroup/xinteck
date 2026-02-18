"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";

export function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Failed to connect to the frequency.");
    }
  };

  return (
    <section className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] p-12 md:p-24 text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
      <div className="max-w-xl mx-auto flex flex-col gap-8">
        <h3 className="text-3xl md:text-5xl font-black tracking-tighter">
          STAY AHEAD OF THE <span className="text-gold underline underline-offset-8">CURVE.</span>
        </h3>
        <p className="text-foreground">
          Join 5,000+ tech leaders receiving our monthly lab reports.
        </p>
        
        {status === "success" ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary/10 p-6 rounded-[10px] flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-gold">
               <Clock className="animate-pulse" />
            </div>
            <p className="font-bold text-gold">{message}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="flex-1 bg-background border border-primary/20 rounded-[10px] px-6 py-4 focus:border-primary outline-none transition-all placeholder:text-foreground/20"
              />
              <button 
                disabled={status === "loading"}
                className="px-8 py-4 bg-primary text-black font-black rounded-full hover:bg-gold-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === "loading" ? "SYNCING..." : "Subscribe"}
              </button>
            </div>
            {status === "error" && (
              <p className="text-red-500 font-bold text-sm">{message}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
