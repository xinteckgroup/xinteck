"use client";

import { VideoStatsType } from "@/lib/videoStats";
import { useEffect, useRef, useState } from "react";

interface VideoScrollLayoutProps {
  children: React.ReactNode;
  videoSrc: string;
  videoStats?: VideoStatsType;
  videoClassName?: string;
}

export function VideoScrollLayout({ children, videoSrc, videoStats, videoClassName }: VideoScrollLayoutProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Handle SSR - only run on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Progressive video loading: start loading AFTER mount, not via HTML preload
  useEffect(() => {
    if (!isMounted) return;
    
    const video = videoRef.current;
    if (!video) return;

    const onError = () => {
      setVideoError(true);
    };

    // Only show video once enough data is buffered for smooth playback
    const onCanPlayThrough = () => {
      setVideoReady(true);
    };

    // INSTANT scroll handler - no delays, no RAF, no throttling
    const onScroll = () => {
      if (!video.duration || isNaN(video.duration)) return;

      const scrollY = Math.max(0, window.scrollY);
      
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - viewHeight);
      
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      let targetTime: number;
      
      if (videoStats) {
        const targetFrame = Math.round(progress * (videoStats.totalFrames - 1));
        targetTime = targetFrame * videoStats.frameDuration;
        targetTime = Math.max(0, Math.min(videoStats.duration - 0.001, targetTime));
      } else {
        targetTime = progress * video.duration;
        targetTime = Math.max(0, Math.min(video.duration - 0.001, targetTime));
      }
      
      if (video.readyState >= 2) {
        video.currentTime = targetTime;
      }
    };

    const onResize = () => {
      onScroll();
    };

    // Attach listeners
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    video.addEventListener("loadedmetadata", onScroll);
    video.addEventListener("canplaythrough", onCanPlayThrough);
    video.addEventListener("error", onError);
    
    // Start loading the video progressively (delayed to prioritize fallback paint)
    const loadTimer = setTimeout(() => {
      video.preload = "auto";
      video.load();
    }, 100);

    // Sync on mount
    onScroll();

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("loadedmetadata", onScroll);
      video.removeEventListener("canplaythrough", onCanPlayThrough);
      video.removeEventListener("error", onError);
    };
  }, [isMounted, videoStats]);

  // Get fallback image path
  const fallbackSrc = videoStats?.fallback;

  return (
    <div className="relative w-full min-h-[300vh]">
      {/* Video Background */}
      <div className="fixed inset-0 w-full h-full z-0 bg-black">
        <div className="absolute inset-0 bg-black/30 z-[1]" />
        
        {/* Fallback Image — loads first, stays until video is fully buffered */}
        {fallbackSrc && (
          <img
            src={fallbackSrc}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              opacity: (!videoReady || videoError) ? 0.85 : 0,
              transition: 'opacity 0.8s ease-out'
            }}
          />
        )}
        
        {/* Video — preload="none", loaded via JS after fallback is painted */}
        {!videoError && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="none"
            className={`absolute inset-0 w-full h-full object-cover ${videoClassName || ''}`}
            style={{ 
              opacity: videoReady ? 0.85 : 0,
              transition: 'opacity 0.8s ease-out'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

