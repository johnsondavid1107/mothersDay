"use client";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const VideoFrame = forwardRef<HTMLVideoElement, {}>(function VideoFrame(_, ref) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto px-4 md:px-6"
      style={{ width: "min(560px, calc(100vw - 1.5rem))" }}
    >
      <div className="relative">
        {/* Soft glow halo behind the frame */}
        <div
          aria-hidden
          className="absolute -inset-6 rounded-[2rem] bg-blush/40 blur-2xl"
        />
        {/* Outer rose-gold frame */}
        <div className="relative frame-rosegold rounded-2xl p-[14px] shadow-[0_30px_80px_-20px_rgba(58,46,42,0.4),0_8px_24px_-8px_rgba(58,46,42,0.25)]">
          {/* Inner mat */}
          <div className="rounded-[10px] bg-cream p-[5px]">
            <div className="aspect-square overflow-hidden rounded-[7px] bg-ink/5">
              <video
                ref={ref}
                src="/video.mp4"
                poster="/poster.jpg"
                controls
                playsInline
                preload="metadata"
                className="block h-full w-full object-cover"
              />
            </div>
          </div>
          {/* Tiny corner flourishes */}
          <CornerFlourish className="-top-2 -left-2" />
          <CornerFlourish className="-top-2 -right-2 rotate-90" />
          <CornerFlourish className="-bottom-2 -left-2 -rotate-90" />
          <CornerFlourish className="-bottom-2 -right-2 rotate-180" />
        </div>
      </div>
    </motion.div>
  );
});

function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`absolute h-5 w-5 text-gold/80 drop-shadow-sm ${className}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M1 10 C1 5, 5 1, 10 1 M10 1 C7 4, 4 7, 1 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="10" cy="1" r="1.2" fill="currentColor" />
      <circle cx="1" cy="10" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default VideoFrame;
