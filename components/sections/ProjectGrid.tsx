"use client";

import { TYPOGRAPHY } from "@/lib/typography";
import { motion } from "framer-motion";
import { ChevronRight, Code2, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  title: string;
  category: string;
  description: string;
  tags: string[];
  image?: string;
  slug: string;
}

export function ProjectGrid({ initialProjects }: { initialProjects: Project[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {initialProjects.map((project, i) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="group flex flex-col gap-6"
        >
          {/* Project Image Card */}
          <Link href={`/portfolio/${project.slug}`}>
            <div className="relative aspect-[16/10] bg-primary/5 backdrop-blur-xl rounded-[10px] border border-primary/10 overflow-hidden group-hover:border-primary/40 transition-all cursor-pointer">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              
              {/* Image content */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-80 transition-all scale-100 group-hover:scale-110">
                {project.image ? (
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-10">
                    <Code2 size={200} className="text-gold" />
                  </div>
                )}
              </div>

              {/* Hover action buttons */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 z-20">
                <div className="flex gap-3">
                  <button className="w-12 h-12 rounded-[10px] bg-primary text-black flex items-center justify-center hover:bg-gold-hover transition-all">
                    <ExternalLink size={20} />
                  </button>
                  <button className="w-12 h-12 rounded-[10px] bg-black/50 backdrop-blur-xl border border-primary/20 text-white flex items-center justify-center hover:border-gold transition-all">
                    <Github size={20} />
                  </button>
                </div>
              </div>
            </div>
          </Link>

          {/* Project Info */}
          <div className="flex flex-col gap-4 bg-primary/5 backdrop-blur-xl border border-primary/10 rounded-[10px] p-8 group-hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between">
              <span className={`${TYPOGRAPHY.tableHeader} text-gold`}>
                {project.category}
              </span>
              <div className="flex gap-2 flex-wrap justify-end">
                {project.tags?.slice(0, 3).map(tag => (
                  <span 
                    key={tag} 
                    className={`${TYPOGRAPHY.badge} px-3 py-1 text-white/60 bg-primary/10 rounded-[10px] border border-primary/10`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <Link href={`/portfolio/${project.slug}`}>
              <h3 className={`${TYPOGRAPHY.sectionTitle} text-white flex items-center justify-between group-hover:text-gold transition-colors cursor-pointer`}>
                {project.title}
                <ChevronRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
            </Link>
            
            <p className={`${TYPOGRAPHY.body} text-white/60 leading-relaxed line-clamp-3`}>
              {project.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
