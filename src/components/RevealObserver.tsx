"use client";

import { useEffect } from "react";

/**
 * One shared IntersectionObserver for every `[data-reveal]` / `.line-mask`
 * element. Elements animate in when they enter the viewport and are reset once
 * they are completely out of view, so the entrance replays every time you
 * scroll (or jump from the menu) back to them.
 * Waits for the page loader so the hero intro is actually seen.
 */
export default function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal], .line-mask");

    if (!("IntersectionObserver" in window)) {
      for (const el of targets) el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            el.classList.add("is-in");
          } else if (!entry.isIntersecting) {
            el.classList.remove("is-in");
          }
        }
      },
      { threshold: [0, 0.1, 0.2] }
    );

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      for (const el of targets) observer.observe(el);
    };

    let fallback: number | undefined;
    if (document.documentElement.dataset.loaded === "true") {
      start();
    } else {
      window.addEventListener("loader:done", start, { once: true });
      fallback = window.setTimeout(start, 3500);
    }

    return () => {
      window.removeEventListener("loader:done", start);
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}
