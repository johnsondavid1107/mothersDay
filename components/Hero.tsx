"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <header className="text-center pt-10 pb-6 md:pt-16 md:pb-8 px-6">
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="font-serif italic text-rose tracking-[0.3em] uppercase text-xs md:text-sm mb-3"
      >
        For the one who started it all
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="font-script text-roseDeep leading-[0.95]"
        style={{ fontSize: "clamp(3rem, 11vw, 6rem)" }}
      >
        Happy Mother&rsquo;s Day
      </motion.h1>



      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.85 }}
        className="mx-auto mt-6 h-px w-32 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
      />
    </header>
  );
}
