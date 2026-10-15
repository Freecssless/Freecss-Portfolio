"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** frames per second used for the FF field */
  fps?: number;
};

/** Running SMPTE-style timecode, updated through textContent (no re-renders). */
export default function Timecode({ className, fps = 30 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const start = performance.now();
    let raf = 0;
    let lastFrame = -1;
    const pad = (n: number) => String(n).padStart(2, "0");

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const frames = Math.floor(((now - start) / 1000) * fps);
      if (frames === lastFrame) return;
      lastFrame = frames;
      const ff = frames % fps;
      const s = Math.floor(frames / fps);
      el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
    };

    // only tick while visible
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [fps]);

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`} aria-hidden="true">
      00:00:00:00
    </span>
  );
}
