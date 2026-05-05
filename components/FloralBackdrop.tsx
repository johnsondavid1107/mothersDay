"use client";
import { motion } from "framer-motion";

type Petal = {
  d: string;
  fill: string;
  size: number;
  top: string;
  left: string;
  rotate: number;
  duration: number;
  delay: number;
  drift: [number, number];
};

const PETAL_PATHS = [
  "M30 0 C45 18 60 30 30 60 C0 30 15 18 30 0 Z",
  "M30 0 C50 10 55 35 30 60 C5 35 10 10 30 0 Z",
  "M30 5 C42 15 58 28 30 58 C2 28 18 15 30 5 Z",
];

const LEAF_PATH = "M30 0 C50 20 50 40 30 60 C10 40 10 20 30 0 Z";

const PETALS: Petal[] = [
  { d: PETAL_PATHS[0], fill: "#F5D7D1", size: 110, top: "8%",  left: "6%",  rotate: -20, duration: 38, delay: 0,   drift: [12, -10] },
  { d: PETAL_PATHS[1], fill: "#EFC2BC", size: 80,  top: "22%", left: "82%", rotate: 25,  duration: 44, delay: 2,   drift: [-14, 8]  },
  { d: PETAL_PATHS[2], fill: "#F8E0DA", size: 140, top: "62%", left: "76%", rotate: -10, duration: 52, delay: 1,   drift: [10, 12]  },
  { d: PETAL_PATHS[0], fill: "#E8C9A8", size: 90,  top: "78%", left: "10%", rotate: 40,  duration: 48, delay: 3,   drift: [-8, -12] },
  { d: LEAF_PATH,      fill: "#A8B89A", size: 120, top: "45%", left: "3%",  rotate: 70,  duration: 56, delay: 4,   drift: [14, 6]   },
  { d: LEAF_PATH,      fill: "#B7C4A6", size: 95,  top: "12%", left: "48%", rotate: -55, duration: 50, delay: 1.5, drift: [-10, 14] },
  { d: PETAL_PATHS[1], fill: "#F2D0C9", size: 70,  top: "88%", left: "55%", rotate: 15,  duration: 42, delay: 2.5, drift: [8, -10]  },
  { d: PETAL_PATHS[2], fill: "#EAD7B8", size: 100, top: "35%", left: "92%", rotate: -35, duration: 60, delay: 0.5, drift: [-12, 10] },
];

export default function FloralBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <motion.svg
          key={i}
          width={p.size}
          height={p.size}
          viewBox="0 0 60 60"
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            opacity: 0.28,
            filter: "blur(0.3px)",
          }}
          initial={{ rotate: p.rotate, x: 0, y: 0 }}
          animate={{
            rotate: [p.rotate, p.rotate + 12, p.rotate - 8, p.rotate],
            x: [0, p.drift[0], -p.drift[0] / 2, 0],
            y: [0, p.drift[1], -p.drift[1] / 2, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path d={p.d} fill={p.fill} />
        </motion.svg>
      ))}
    </div>
  );
}
