"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const MARKS = 32;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Section divider shaped like a timeline ruler. The ruler scrubs sideways as
 * the page scrolls, under a fixed playhead, like dragging through a sequence.
 */
export default function ScrollRuler({ start = 0 }: { start?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className="relative overflow-hidden py-6" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-40" />

      <motion.div style={{ x }} className="flex w-max will-change-transform">
        {Array.from({ length: MARKS }, (_, i) => {
          const s = start + i * 4;
          return (
            <div key={`m-${start}-${i}`} className="relative h-10 w-[120px] shrink-0 border-l border-line-2">
              <span className="absolute left-1.5 top-0 font-mono text-[10px] text-dim">
                00:{pad(Math.floor(s / 60))}:{pad(s % 60)}:00
              </span>
              <div className="ruler absolute inset-x-0 bottom-0 opacity-70" />
              {i % 5 === 2 && (
                <span className="absolute bottom-3 left-1/3 h-2 w-[70%] rounded-[2px] bg-accent/15 ring-1 ring-inset ring-accent/30" />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* fixed playhead */}
      <div className="absolute inset-y-4 left-1/2 z-20 w-px -translate-x-1/2 bg-accent">
        <span className="absolute -left-[4px] -top-1 h-2 w-[9px] rounded-[1px] bg-accent" />
      </div>
    </div>
  );
}
