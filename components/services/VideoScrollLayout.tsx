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

  useEffect(() => {
    if (!isMounted) return;
    
    const video = videoRef.current;
    if (!video) return;

    // Handle video error - show fallback
    const onError = () => {
      setVideoError(true);
    };

    // Handle video ready
    const onCanPlay = () => {
      setVideoReady(true);
    };

    // INSTANT scroll handler - no delays, no RAF, no throttling
    const onScroll = () => {
      // Edge case 1: Video not ready yet
      if (!video.duration || isNaN(video.duration)) return;

      // Edge case 2: Handle negative scrollY (iOS bounce)
      const scrollY = Math.max(0, window.scrollY);
      
      // Edge case 3: Calculate maxScroll safely
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - viewHeight); // Avoid division by zero
      
      // Edge case 4: Clamp progress to valid range
      const progress = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      let targetTime: number;
      
      if (videoStats) {
        // Frame-accurate: calculate exact frame and convert to time
        const targetFrame = Math.round(progress * (videoStats.totalFrames - 1));
        targetTime = targetFrame * videoStats.frameDuration;
        
        // Edge case 5: Clamp to valid video time range
        targetTime = Math.max(0, Math.min(videoStats.duration - 0.001, targetTime));
      } else {
        // Linear fallback
        targetTime = progress * video.duration;
        
        // Edge case 5: Clamp to valid video time range
        targetTime = Math.max(0, Math.min(video.duration - 0.001, targetTime));
      }
      
      // Edge case 6: Only update if video is seekable
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        video.currentTime = targetTime;
      }
    };

    // Edge case 7: Handle resize (document height changes)
    const onResize = () => {
      onScroll();
    };

    // Attach listeners
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    video.addEventListener("loadedmetadata", onScroll);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    
    // Sync on mount
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("loadedmetadata", onScroll);
      video.removeEventListener("canplay", onCanPlay);
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
        
        {/* Fallback Image */}
        {fallbackSrc && (
          <img
            src={fallbackSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              opacity: (!videoReady || videoError) ? 0.85 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          />
        )}
        
        {/* Video - Hidden if error */}
        {!videoError && (
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover ${videoClassName || ''}`}
            style={{ 
              opacity: videoReady ? 0.85 : 0,
              transition: 'opacity 0.3s ease-out'
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
