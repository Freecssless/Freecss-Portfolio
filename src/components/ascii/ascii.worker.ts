/// <reference lib="webworker" />
/**
 * Draws the ASCII background on an OffscreenCanvas, off the main thread.
 * The page only sends small messages (section, mouse, scroll, text boxes).
 */
import { type Engine, type WorkerMsg, createEngine } from "./engine";

let engine: Engine | null = null;
let fps = 30;
let visible = true;
let timer = 0;
let last = 0;

const tick = () => {
  timer = 0;
  if (!engine || !visible) return;
  const now = performance.now();
  last = now;
  engine.frame(now);
  // keep a steady cadence regardless of how long the frame took
  timer = self.setTimeout(tick, Math.max(1, 1000 / fps - (performance.now() - last)));
};

const start = () => {
  if (!timer && visible) timer = self.setTimeout(tick, 0);
};

self.onmessage = (e: MessageEvent<WorkerMsg>) => {
  const msg = e.data;
  switch (msg.type) {
    case "init": {
      const ctx = msg.canvas.getContext("2d", { alpha: true });
      if (!ctx) return;
      fps = msg.fps;
      engine = createEngine(msg.canvas, ctx, { finePointer: msg.finePointer, speed: msg.speed });
      break;
    }
    case "resize":
      engine?.resize(msg.layout, msg.atlas);
      start();
      break;
    case "section":
      engine?.setSection(msg.n);
      break;
    case "mouse":
      engine?.setMouse(msg.x, msg.y);
      break;
    case "scroll":
      engine?.setScroll(msg.y);
      break;
    case "mask":
      engine?.setMask(msg.rects, msg.scrollY);
      break;
    case "intro":
      engine?.intro();
      break;
    case "visible":
      visible = msg.visible;
      if (visible) start();
      else if (timer) {
        self.clearTimeout(timer);
        timer = 0;
      }
      break;
  }
};
