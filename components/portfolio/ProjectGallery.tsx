"use client";

/**
 * ProjectGallery — Smart wrapper that picks the right showcase based on
 * the project's category.
 *
 * - MOBILE_APP → MobileAppShowcase (phone frame)
 * - Everything else → WebAppShowcase (browser frame)
 *
 * Images are extracted from the markdown content on the server and passed
 * in directly. This means admins just add images to the markdown case
 * study and the gallery renders automatically.
 */

import { MobileAppShowcase } from "./MobileAppShowcase";
import { WebAppShowcase } from "./WebAppShowcase";

interface ProjectGalleryProps {
  images: string[];
  category: string;
  title?: string;
}

export function ProjectGallery({ images, category, title }: ProjectGalleryProps) {
  if (!images.length) return null;

  const isMobile = category.toUpperCase().includes("MOBILE") || category.toUpperCase().includes("APP");

  return (
    <section className="px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/30 dark:bg-black/80 backdrop-blur-xl rounded-[10px] border border-primary/10 p-6 md:p-12 lg:p-16 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          {isMobile ? (
            <MobileAppShowcase images={images} title={title} />
          ) : (
            <WebAppShowcase images={images} title={title} />
          )}
        </div>
      </div>
    </section>
  );
}
