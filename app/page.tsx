"use client";
import { useEffect, useRef, useState } from "react";
import FloralBackdrop from "@/components/FloralBackdrop";
import Hero from "@/components/Hero";
import VideoFrame from "@/components/VideoFrame";
import SyncedCaption from "@/components/SyncedCaption";
import { motion } from "framer-motion";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      setCurrentTime(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      setCurrentTime(v.currentTime);
    };
    v.addEventListener("play", start);
    v.addEventListener("playing", start);
    v.addEventListener("pause", stop);
    v.addEventListener("ended", stop);
    v.addEventListener("seeked", () => setCurrentTime(v.currentTime));
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("play", start);
      v.removeEventListener("playing", start);
      v.removeEventListener("pause", stop);
      v.removeEventListener("ended", stop);
    };
  }, []);

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden">
      <FloralBackdrop />

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <Hero />

        <VideoFrame ref={videoRef} />

        <SyncedCaption currentTime={currentTime} />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="mt-auto pb-10 pt-6 text-center px-6"
        >

        </motion.footer>
      </div>
    </main>
  );
}
