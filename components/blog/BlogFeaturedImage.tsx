"use client";

import { useState } from "react";

interface BlogFeaturedImageProps {
  src: string;
  alt: string;
}

export function BlogFeaturedImage({ src, alt }: BlogFeaturedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[24px] overflow-hidden border border-primary/20 shadow-2xl flex-shrink-0">
      <img
        src={hasError ? "/images/portfolio-blog-ui/fallback.webp" : imgSrc}
        alt={alt}
        className="object-cover w-full h-full"
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc("/images/portfolio-blog-ui/fallback.webp");
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}
