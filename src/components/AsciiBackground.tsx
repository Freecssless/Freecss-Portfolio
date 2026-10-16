"use client";

import { useEffect, useRef } from "react";
import { GLYPHS, LEVEL_COUNT, type Layout, type WorkerMsg, createEngine } from "./ascii/engine";

/**
 * Full-screen ASCII art background.
 *
 * All the drawing runs in a Web Worker on an OffscreenCanvas (see
 * ./ascii/engine.ts), so the main thread stays free for scrolling, the cursor
 * and the page animations. This component only feeds it small messages: the
 * active section (`data-scene`), the pointer, the scroll position and where the
 * free-standing text sits (so the ASCII steps aside and stays readable).
 * Browsers without OffscreenCanvas run the very same engine on the main thread.
 */

/** how often text positions are re-measured (scroll in between is applied by offset) */
const MASK_EVERY_MS = 250;

export default function AsciiBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // a fresh canvas per mount: once handed to a worker a canvas can't be reused
    const canvas = document.createElement("canvas");
    canvas.className = "absolute inset-0 opacity-80";
    host.prepend(canvas);

    // "reduce motion" (e.g. Windows animation effects off) keeps the figures
    // alive but plays them slower and calmer instead of freezing them
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const speed = calm ? 0.6 : 1;
    // touch devices: a slightly lower cadence saves battery and is invisible on ASCII
    const fps = finePointer ? 30 : 24;

    /* ── renderer: worker if possible, main thread otherwise ── */
    let worker: Worker | null = null;
    let send: (msg: WorkerMsg, transfer?: Transferable[]) => void;
    let stopLocal = () => {};

    const canTransfer = typeof OffscreenCanvas !== "undefined" && "transferControlToOffscreen" in canvas;
    if (canTransfer) {
      try {
        worker = new Worker(new URL("./ascii/ascii.worker.ts", import.meta.url), { type: "module" });
        const offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({ type: "init", canvas: offscreen, finePointer, speed, fps } satisfies WorkerMsg, [offscreen]);
      } catch {
        worker?.terminate();
        worker = null;
      }
    }
    if (worker) {
      const w = worker;
      send = (msg, transfer) => w.postMessage(msg, transfer ?? []);
    } else {
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) {
        canvas.remove();
        return;
      }
      const engine = createEngine(canvas, ctx, { finePointer, speed });
      let raf = 0;
      let last = 0;
      let visible = true;
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (now - last < 1000 / fps - 2) return;
        last = now;
        engine.frame(now);
      };
      send = (msg) => {
        switch (msg.type) {
          case "resize":
            engine.resize(msg.layout, msg.atlas);
            if (!raf && visible) raf = requestAnimationFrame(loop);
            break;
          case "section":
            engine.setSection(msg.n);
            break;
          case "mouse":
            engine.setMouse(msg.x, msg.y);
            break;
          case "scroll":
            engine.setScroll(msg.y);
            break;
          case "mask":
            engine.setMask(msg.rects, msg.scrollY);
            break;
          case "intro":
            engine.intro();
            break;
          case "visible":
            visible = msg.visible;
            cancelAnimationFrame(raf);
            raf = visible ? requestAnimationFrame(loop) : 0;
            break;
        }
      };
      stopLocal = () => cancelAnimationFrame(raf);
    }

    /* ── glyph atlas (built here: it needs the page's web font) ── */
    const fontFamily = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim();
      return `${v ? `${v}, ` : ""}ui-monospace, Menlo, Consolas, monospace`;
    };
    const buildAtlas = (layout: Layout, fontSize: number) => {
      const a = document.createElement("canvas");
      const step = Math.ceil(layout.cw * layout.dpr);
      a.width = step * LEVEL_COUNT;
      a.height = Math.ceil(layout.ch * layout.dpr);
      const actx = a.getContext("2d");
      if (!actx) return a;
      actx.font = `500 ${fontSize * layout.dpr}px ${fontFamily()}`;
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      for (let i = 1; i < LEVEL_COUNT; i++) {
        const k = i / (LEVEL_COUNT - 1);
        if (k > 0.8) {
          actx.fillStyle = `rgba(170, 167, 255, ${0.7 + k * 0.3})`;
        } else {
          const c = Math.round(70 + k * 150);
          actx.fillStyle = `rgba(${c}, ${c}, ${c + 12}, ${0.5 + k * 0.5})`;
        }
        actx.fillText(GLYPHS[i], step * i + step / 2, a.height / 2 + layout.dpr * 0.5);
      }
      return a;
    };

    let W = 0;
    let H = 0;
    const resize = async () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fontSize = W < 640 ? 10 : W < 1280 ? 12 : W < 1680 ? 13 : 14;
      const layout: Layout = {
        W,
        H,
        dpr,
        cw: Math.round(fontSize * 0.62 * 10) / 10,
        ch: Math.round(fontSize * 1.18),
      };
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      const atlasCanvas = buildAtlas(layout, fontSize);
      if (worker) {
        const atlas = await createImageBitmap(atlasCanvas);
        send({ type: "resize", layout, atlas }, [atlas]);
      } else {
        send({ type: "resize", layout, atlas: atlasCanvas as unknown as ImageBitmap });
      }
      measureMask();
    };

    /* ── text boxes the ASCII must avoid (document coordinates) ── */
    let maskEls: HTMLElement[] = [];
    const collectMaskEls = () => {
      maskEls = Array.from(
        document.querySelectorAll<HTMLElement>(
          "main h1, main h2, main h3, main p, main blockquote, main .btn, main footer a, [data-ascii-mask]"
        )
      ).filter((el) => !el.closest(".panel"));
    };
    const measureMask = () => {
      const sy = window.scrollY;
      const out: number[] = [];
      for (const el of maskEls) {
        const r = el.getBoundingClientRect();
        // only what is on (or near) the screen
        if (r.width === 0 || r.bottom < -H || r.top > H * 2) continue;
        out.push(r.left, r.top + sy, r.right, r.bottom + sy);
      }
      const rects = new Float32Array(out);
      send({ type: "mask", rects, scrollY: sy }, [rects.buffer]);
    };

    /* ── wiring ── */
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        send({ type: "scroll", y: window.scrollY });
      });
    };
    let mouseRaf = 0;
    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0;
        send({ type: "mouse", x: mx, y: my });
      });
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // ignore mobile URL-bar height jitter
        if (Math.abs(window.innerWidth - W) < 1 && Math.abs(window.innerHeight - H) < 120) return;
        resize();
      }, 150);
    };
    const onVisibility = () => send({ type: "visible", visible: !document.hidden });

    // whichever section crosses the vertical middle of the viewport
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) send({ type: "section", n: Number((en.target as HTMLElement).dataset.scene) });
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    for (const s of document.querySelectorAll<HTMLElement>("[data-scene]")) io.observe(s);

    const intro = () => send({ type: "intro" });
    if (document.documentElement.dataset.loaded === "true") intro();
    else window.addEventListener("loader:done", intro, { once: true });
    const introFallback = window.setTimeout(intro, 3500);

    collectMaskEls();
    resize();
    document.fonts?.ready.then(resize);
    const maskTimer = window.setInterval(() => {
      if (!document.hidden) measureMask();
    }, MASK_EVERY_MS);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopLocal();
      worker?.terminate();
      canvas.remove();
      cancelAnimationFrame(scrollRaf);
      cancelAnimationFrame(mouseRaf);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(introFallback);
      window.clearInterval(maskTimer);
      window.removeEventListener("loader:done", intro);
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={hostRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* the canvas is created in the effect (see above) */}
      {/* vignette frames the figure and keeps the edges calm */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 0%, transparent 45%, rgba(9,9,11,0.55) 80%, #09090b 100%)",
        }}
      />
      {/* very subtle CRT scanlines */}
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 3px)",
        }}
      />
    </div>
  );
}
