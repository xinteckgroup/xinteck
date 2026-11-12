"use client";

import { useEffect } from "react";
import { incrementPostViews } from "@/actions/blog";

export function BlogViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    if (!slug || typeof window === "undefined") return;

    const sessionKey = `xinteck_viewed_post_${slug}`;
    // Debounce per browser session to prevent artificial refresh inflation
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      incrementPostViews(slug);
    }
  }, [slug]);

  return null;
}
