"use client";

import { motion } from "framer-motion";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  tag: string;
  slug: string;
  image?: string;
}

export function BlogGrid({ initialPosts }: { initialPosts: Post[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {initialPosts.map((post, i) => (
        <motion.article
          key={post.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className={`group cursor-pointer flex flex-col gap-6 p-8 rounded-[10px] backdrop-blur-xl transition-all bg-white/30 dark:bg-black/80 relative shadow-lg ${
            i === 0 ? "lg:col-span-2 md:flex-row items-center gap-12" : ""
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10 rounded-[10px]" />
          
          {/* Featured Image Placeholder */}
          <div className={`aspect-[4/3] rounded-[10px] bg-primary/10 backdrop-blur-xl flex items-center justify-center relative overflow-hidden ${
             i === 0 ? "md:flex-[0.6]" : "w-full"
          }`}>
             {post.image ? (
               <Image
                 src={post.image}
                 alt={post.title}
                 fill
                 className="object-cover group-hover:scale-110 transition-transform duration-700"
                 sizes={i === 0 ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
               />
             ) : (
               <>
                 <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent group-hover:scale-110 transition-transform duration-700" />
                 <span className="text-gold/20 font-black text-7xl md:text-9xl">POST</span>
               </>
             )}
             {/* Gradient overlay to ensure text readability if needed, though card text is below image */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className={`flex flex-col gap-4 ${i === 0 ? "flex-1" : ""}`}>
             {/* Tags & Read Time */}
             <div className="flex items-center gap-4 flex-wrap">
                <span className="px-3 py-1 rounded-[10px] bg-primary/20 text-[10px] font-bold text-gold uppercase tracking-widest border border-primary/20">
                   {post.tag}
                </span>
                <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                   <Clock size={12} /> {post.readTime}
                </div>
             </div>
             
             {/* Title */}
             <h3 className={`font-black tracking-tight leading-tight text-white group-hover:text-gold transition-colors ${
                i === 0 ? "text-4xl" : "text-2xl"
             }`}>
                {post.title}
             </h3>
             
             {/* Excerpt */}
             <p className="text-white/60 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
             </p>

             {/* Author & Date */}
             <div className="flex items-center justify-between mt-auto pt-6 border-t border-primary/10">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center text-[10px] font-bold text-gold border border-primary/20">
                      {post.author.charAt(0)}
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white">{post.author}</span>
                      <div className="flex items-center gap-1 text-[9px] text-white/40 uppercase">
                        <Calendar size={8} />
                        {post.date}
                      </div>
                   </div>
                </div>
                <ChevronRight className="text-gold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
             </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
