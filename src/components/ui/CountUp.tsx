"use client";

import { useEffect, useRef } from "react";

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

/** Counts up to `to` whenever it scrolls into view. Server-renders the final value. */
export default function CountUp({ to, prefix = "", suffix = "", duration = 1800, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    // replays every time the number comes back into view
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (!entry.isIntersecting) {
          el.textContent = `${prefix}0${suffix}`;
          return;
        }
        const start = performance.now();
        const step = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - p) ** 4;
          el.textContent = `${prefix}${Math.round(to * eased)}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = `${prefix}${to}${suffix}`;
    };
  }, [to, prefix, suffix, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      {to}
      {suffix}
    </span>
  );
}
