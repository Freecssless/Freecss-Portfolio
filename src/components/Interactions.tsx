"use client";

import { useEffect } from "react";

/**
 * Pointer-driven micro interactions, wired once for the whole page:
 * - `[data-tilt]`  → subtle 3D tilt toward the cursor
 * - `.spot`        → cursor-following spotlight / border glow (CSS vars --mx/--my)
 * - `.btn`, `[data-magnetic]` → magnetic pull toward the cursor
 * Everything is written to CSS custom properties inside rAF; no React state.
 * Desktop pointers only.
 */
export default function Interactions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cleanups: (() => void)[] = [];

    const bind = (
      el: HTMLElement,
      onMove: (x: number, y: number, r: DOMRect) => void,
      onLeave: () => void
    ) => {
      let rect = el.getBoundingClientRect();
      let raf = 0;
      let px = 0;
      let py = 0;
      const enter = () => {
        rect = el.getBoundingClientRect();
      };
      const move = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          // re-measure: the page may have scrolled while hovering
          rect = el.getBoundingClientRect();
          onMove(px - rect.left, py - rect.top, rect);
        });
      };
      const leave = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        onLeave();
      };
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", move, { passive: true });
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    };

    for (const el of document.querySelectorAll<HTMLElement>("[data-tilt], .spot")) {
      const tilt = el.hasAttribute("data-tilt");
      const max = Number(el.dataset.tilt) || 6;
      bind(
        el,
        (x, y, r) => {
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y}px`);
          if (tilt) {
            el.style.setProperty("--ry", `${((x / r.width - 0.5) * max).toFixed(2)}deg`);
            el.style.setProperty("--rx", `${((0.5 - y / r.height) * max).toFixed(2)}deg`);
          }
        },
        () => {
          if (tilt) {
            el.style.setProperty("--rx", "0deg");
            el.style.setProperty("--ry", "0deg");
          }
        }
      );
    }

    for (const el of document.querySelectorAll<HTMLElement>(".btn, [data-magnetic]")) {
      const strength = Number(el.dataset.magnetic) || 0.22;
      bind(
        el,
        (x, y, r) => {
          const dx = (x - r.width / 2) * strength;
          const dy = (y - r.height / 2) * strength;
          el.style.setProperty("--tx", `${Math.max(-10, Math.min(10, dx)).toFixed(1)}px`);
          el.style.setProperty("--ty", `${Math.max(-8, Math.min(8, dy)).toFixed(1)}px`);
        },
        () => {
          el.style.setProperty("--tx", "0px");
          el.style.setProperty("--ty", "0px");
        }
      );
    }

    return () => {
      for (const c of cleanups) c();
    };
  }, []);

  return null;
}
