"use client";

import { useEffect } from "react";

/**
 * Pointer-driven micro interactions, wired once for the whole page:
 * - `[data-tilt]`  → subtle 3D tilt toward the cursor
 * - `.spot`        → cursor-following spotlight / border glow
 * - `.btn`, `[data-magnetic]` → magnetic pull toward the cursor
 *
 * Kept cheap so hovering cards with videos inside stays smooth:
 * - element sizes are measured on enter (and again only after a scroll/resize),
 *   never on every pointer move, so no forced layout per frame;
 * - the spotlight layers are painted once and just moved with `transform`;
 * - tilt / magnetic values are registered, non-inherited CSS properties
 *   (see globals.css), so updating them only restyles the element itself.
 * Desktop pointers only.
 */
export default function Interactions() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cleanups: (() => void)[] = [];
    // bumped on scroll / resize: cached rects older than this are re-measured
    let layoutGen = 0;
    const invalidate = () => {
      layoutGen++;
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    cleanups.push(() => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    });

    const bind = (
      el: HTMLElement,
      onMove: (x: number, y: number, r: DOMRect) => void,
      onLeave: () => void
    ) => {
      let rect: DOMRect | null = null;
      let gen = -1;
      let raf = 0;
      let px = 0;
      let py = 0;
      const measure = () => {
        rect = el.getBoundingClientRect();
        gen = layoutGen;
      };
      const move = (e: PointerEvent) => {
        px = e.clientX;
        py = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (!rect || gen !== layoutGen) measure();
          const r = rect as DOMRect;
          onMove(px - r.left, py - r.top, r);
        });
      };
      const leave = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        rect = null;
        onLeave();
      };
      el.addEventListener("pointerenter", measure);
      el.addEventListener("pointermove", move, { passive: true });
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        el.removeEventListener("pointerenter", measure);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    };

    /** inject the spotlight layers (wash + border glow) into a `.spot` element */
    const addSpotLayers = (el: HTMLElement) => {
      const fx = document.createElement("span");
      fx.className = "spot-fx";
      fx.setAttribute("aria-hidden", "true");
      const wash = document.createElement("span");
      wash.className = "spot-wash";
      fx.appendChild(wash);
      // border glow: one glow per 1px edge, each offset by its edge position
      const edges = (["top", "bottom", "left", "right"] as const).map((side) => {
        const edge = document.createElement("span");
        edge.className = `spot-edge is-${side}`;
        const glow = document.createElement("span");
        glow.className = "spot-ring-glow";
        edge.appendChild(glow);
        fx.appendChild(edge);
        return { side, glow };
      });
      el.appendChild(fx);
      cleanups.push(() => fx.remove());
      return (x: number, y: number, w: number, h: number) => {
        wash.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        for (const { side, glow } of edges) {
          const gx = side === "right" ? x - (w - 1) : x;
          const gy = side === "bottom" ? y - (h - 1) : y;
          glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        }
      };
    };

    for (const el of document.querySelectorAll<HTMLElement>("[data-tilt], .spot")) {
      const tilt = el.hasAttribute("data-tilt");
      const max = Number(el.dataset.tilt) || 6;
      const moveSpot = el.classList.contains("spot") ? addSpotLayers(el) : null;
      bind(
        el,
        (x, y, r) => {
          moveSpot?.(x, y, r.width, r.height);
          // a panel can opt out temporarily (e.g. while its video is playing)
          if (tilt && el.dataset.tiltOff !== "true") {
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
