"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "!<>-_\/[]{}=+*^?#@$%&01";

type Props = {
  text: string;
  className?: string;
  /** ms before the decode starts once visible */
  delay?: number;
  /** total decode duration in ms */
  duration?: number;
};

/**
 * Monospace label that "decodes" from random glyphs every time it scrolls into
 * view. Server-renders the real text (SEO / no-JS) and animates via textContent.
 */
export default function ScrambleText({ text, className, delay = 0, duration = 700 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let timer = 0;

    const run = () => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const resolved = Math.floor(p * text.length);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const c = text[i];
          out += i < resolved || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) timer = window.setTimeout(run, delay);
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
