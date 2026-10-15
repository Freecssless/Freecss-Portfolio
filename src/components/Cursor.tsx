"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const SPRING = { stiffness: 500, damping: 28, mass: 0.5 };
const INTERACTIVE = "a, button, [role='button'], .cursor-hover";

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position lives in motion values: no React re-render on every mousemove.
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const x = useSpring(mouseX, SPRING);
  const y = useSpring(mouseY, SPRING);

  useEffect(() => {
    // Only on desktop pointers
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setIsHovering(!!target?.closest?.(INTERACTIVE));
    };
    const onLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
      style={{
        x,
        y,
        mixBlendMode: isHovering ? "difference" : "normal",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      aria-hidden="true"
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        initial={false}
        animate={{ width: isHovering ? 150 : 32, height: isHovering ? 150 : 32 }}
        transition={{ type: "spring", ...SPRING }}
      />
    </motion.div>
  );
}
