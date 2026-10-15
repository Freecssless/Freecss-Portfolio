"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen ASCII art background rendered on a 2D canvas.
 *
 * - Every page section declares `data-scene="<n>"`. Each section owns two
 *   figures; while you stay in a section they alternate, and when another
 *   section reaches the middle of the viewport the field dissolves, cell by
 *   cell, into that section's figure.
 * - Scenes write brightness values (0..1) into a buffer: some are analytic
 *   fields evaluated per cell, others are real 3D objects splatted with a
 *   z-buffer (torus, wireframe cubes).
 * - Glyphs are pre-rendered into an atlas, so drawing is just `drawImage`
 *   blits. Capped at 30fps and paused while the tab is hidden.
 */

const RAMP = " .,:;-~=+*#%@";
const LEVELS = RAMP.length;
const FPS = 30;
const MORPH_MS = 2200;
const HOLD_MS = 9000;

const TAU = Math.PI * 2;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (a: number, b: number, x: number) => {
  const k = clamp01((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const fract = (x: number) => x - Math.floor(x);
const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

type Grid = {
  cols: number;
  rows: number;
  cw: number;
  ch: number;
  W: number;
  H: number;
  scale: number;
  baseScale: number;
  /** horizontal centre of the figure in px (lets figures sit beside content) */
  cx: number;
  cy: number;
  z: Float32Array;
};
type Scene = (buf: Float32Array, g: Grid, t: number) => void;
type Field = (u: number, v: number, t: number) => number;

/** Wrap an analytic field (u, v → brightness) as a scene */
const field =
  (f: Field): Scene =>
  (buf, g, t) => {
    for (let j = 0; j < g.rows; j++) {
      const v = (j * g.ch + g.ch / 2 - g.cy) / g.scale;
      const row = j * g.cols;
      for (let i = 0; i < g.cols; i++) {
        buf[row + i] = f((i * g.cw + g.cw / 2 - g.cx) / g.scale, v, t);
      }
    }
  };

/** Write a value at normalized coords if it is closer than what is there */
const plot = (buf: Float32Array, g: Grid, u: number, v: number, depth: number, val: number) => {
  const i = Math.floor((g.cx + u * g.scale) / g.cw);
  const j = Math.floor((g.cy + v * g.scale) / g.ch);
  if (i < 0 || j < 0 || i >= g.cols || j >= g.rows) return;
  const k = j * g.cols + i;
  if (depth > g.z[k]) {
    g.z[k] = depth;
    buf[k] = val;
  }
};

/* ═══════════════════════ Scenes ═══════════════════════ */

// Hero A — rotating wireframe globe with an orbit ring
const globe = field((u, v, t) => {
  const r = 0.86;
  const d2 = u * u + v * v;
  if (d2 > r * r) {
    const ring = Math.abs(Math.sqrt(u * u + v * v * 9) - 1.28);
    return ring < 0.03 && v > -0.12 ? 0.42 : 0;
  }
  const z = Math.sqrt(r * r - d2);
  const nx = u / r;
  const ny = v / r;
  const nz = z / r;
  const a = t * 0.35;
  const rx = nx * Math.cos(a) + nz * Math.sin(a);
  const rz = -nx * Math.sin(a) + nz * Math.cos(a);
  const tilt = 0.42;
  const ry = ny * Math.cos(tilt) - rz * Math.sin(tilt);
  const rz2 = ny * Math.sin(tilt) + rz * Math.cos(tilt);
  const lon = Math.atan2(rx, rz2);
  const lat = Math.asin(Math.max(-1, Math.min(1, ry)));
  const gLon = Math.abs(fract((lon / TAU) * 16) - 0.5);
  const gLat = Math.abs(fract((lat / Math.PI) * 10) - 0.5);
  const grid = Math.max(smooth(0.36, 0.5, gLon), smooth(0.38, 0.5, gLat));
  const light = clamp01(nx * -0.45 + ny * -0.55 + nz * 0.7);
  return clamp01(0.1 + light * 0.45 + grid * (0.35 + light * 0.45));
});

// Hero B — the classic ASCII donut (z-buffered torus)
const torus: Scene = (buf, g, t) => {
  buf.fill(0);
  g.z.fill(0);
  const A = t * 0.55;
  const B = t * 0.31;
  const cA = Math.cos(A);
  const sA = Math.sin(A);
  const cB = Math.cos(B);
  const sB = Math.sin(B);
  const R1 = 0.34;
  const R2 = 0.72;
  const K2 = 3.2;
  const K1 = 2.75;
  const px = g.scale / Math.min(g.cw, g.ch);
  const thetaSteps = Math.min(260, Math.ceil(TAU * R1 * px * 1.3));
  const phiSteps = Math.min(620, Math.ceil(TAU * (R1 + R2) * px * 1.3));
  for (let ti = 0; ti < thetaSteps; ti++) {
    const th = (ti / thetaSteps) * TAU;
    const ct = Math.cos(th);
    const st = Math.sin(th);
    const cx = R2 + R1 * ct;
    const cy = R1 * st;
    for (let pi = 0; pi < phiSteps; pi++) {
      const ph = (pi / phiSteps) * TAU;
      const cp = Math.cos(ph);
      const sp = Math.sin(ph);
      const x = cx * (cB * cp + sA * sB * sp) - cy * cA * sB;
      const y = cx * (sB * cp - sA * cB * sp) + cy * cA * cB;
      const z = K2 + cA * cx * sp + cy * sA;
      const ooz = 1 / z;
      const L = cp * ct * sB - cA * ct * sp - sA * st + cB * (cA * st - ct * sA * sp);
      plot(buf, g, x * K1 * ooz, -y * K1 * ooz, ooz, L > 0 ? 0.18 + L * 0.6 : 0.1);
    }
  }
};

// Clients A — mirrored audio spectrum
const spectrum = field((u, v, t) => {
  const bars = 22;
  const x = u * 0.62;
  const cell = Math.floor(x * bars);
  if (fract(x * bars) > 0.72) return 0;
  const bx = cell / bars;
  if (Math.abs(bx) > 1.05) return 0;
  const env = Math.exp(-bx * bx * 2.2);
  const amp =
    env *
    (0.18 +
      0.5 *
        Math.abs(
          Math.sin(bx * 5.1 + t * 1.6) * 0.6 + Math.sin(bx * 11.3 - t * 2.3) * 0.3 + Math.sin(t * 3.1 + cell * 1.7) * 0.25
        ));
  const ay = Math.abs(v);
  if (ay > amp) return ay < amp + 0.05 ? 0.22 : 0;
  return clamp01(0.38 + 0.62 * (1 - ay / Math.max(amp, 0.001)));
});

// Clients B — oscilloscope: layered sine waves
const scope = field((u, v, t) => {
  if (Math.abs(u) > 1.9) return 0;
  const env = 1 - smooth(1.1, 1.9, Math.abs(u));
  let best = 0;
  for (let k = 0; k < 5; k++) {
    const f = 2.2 + k * 0.9;
    const y =
      Math.sin(u * f + t * (0.8 + k * 0.25) + k) * (0.42 - k * 0.05) * env +
      Math.sin(u * f * 2.3 - t * 1.3) * 0.06;
    const d = Math.abs(v - y);
    const line = Math.exp(-d * d * 900) * (1 - k * 0.12);
    if (line > best) best = line;
  }
  // graticule
  const gx = Math.abs(fract(u * 2.5) - 0.5);
  const gy = Math.abs(fract(v * 2.5) - 0.5);
  const grat = Math.abs(v) < 1 && (gx > 0.48 || gy > 0.47) ? 0.13 : 0;
  return clamp01(Math.max(best, grat));
});

// Works A — NLE timeline: tracks with clips, audio waveforms and a playhead
const timeline = field((u, v, t) => {
  if (Math.abs(v) > 0.88) return 0;
  const tracks = 7;
  const tf = (v + 0.88) / 1.76;
  const k = Math.floor(tf * tracks);
  const inTrack = fract(tf * tracks);
  if (inTrack < 0.12 || inTrack > 0.88) return 0;
  const speed = 0.06 + hash(k + 3) * 0.08;
  const x = (u + t * speed) * 1.4 + k * 3.7;
  const seg = Math.floor(x);
  const local = fract(x);
  const edgeFade = 1 - smooth(1.2, 1.9, Math.abs(u));
  let val = 0;
  if (hash(seg * 1.31 + k * 7.7) > 0.32) {
    const border = local < 0.04 || local > 0.96 || inTrack < 0.2 || inTrack > 0.8;
    if (k >= 4) {
      const w = Math.abs(Math.sin(x * 23.0) * Math.sin(x * 7.0 + t));
      const dy = Math.abs(inTrack - 0.5) * 2;
      val = border ? 0.58 : dy < w * 0.8 ? 0.52 : 0.15;
    } else {
      val = border ? 0.64 : 0.26 + 0.08 * hash(seg + k);
    }
  }
  const ph = Math.sin(t * 0.25) * 0.9;
  if (Math.abs(u - ph) < 0.012) val = 1;
  return val * edgeFade;
});

// Works B — diagonal film strip rolling through the frame
const film = field((u, v, t) => {
  const ang = -0.32;
  const x = u * Math.cos(ang) - v * Math.sin(ang);
  const y = u * Math.sin(ang) + v * Math.cos(ang);
  const ay = Math.abs(y);
  if (ay > 0.5) return 0;
  const fade = 1 - smooth(1.4, 2.2, Math.abs(x));
  const xs = x + t * 0.12;
  if (ay > 0.4) {
    // sprocket holes
    return (fract(xs * 9) < 0.45 && ay < 0.47 ? 0.05 : 0.42) * fade;
  }
  if (ay > 0.36) return 0.42 * fade;
  // frames
  const fx = fract(xs * 1.5);
  if (fx < 0.04) return 0.5 * fade;
  // inside each frame a little circle "image" rotating
  const frameIdx = Math.floor(xs * 1.5);
  const lx = (fx - 0.5) / 1.5;
  const ly = y;
  const rr = Math.sqrt(lx * lx + ly * ly);
  const ring = Math.abs(rr - 0.14 - 0.05 * Math.sin(t + frameIdx));
  return clamp01((ring < 0.025 ? 0.85 : 0.14 + 0.1 * (1 - rr * 3)) * fade);
});

// Testimonial A — breathing camera aperture
const aperture = field((u, v, t) => {
  const r = Math.sqrt(u * u + v * v);
  if (r > 0.98) return 0;
  if (r > 0.9) return 0.58;
  const blades = 7;
  const a = Math.atan2(v, u) + t * 0.12;
  const open = 0.32 + 0.12 * Math.sin(t * 0.7);
  const seg = TAU / blades;
  const local = ((a % seg) + seg) % seg;
  const polyR = (r * Math.cos(local - seg / 2)) / Math.cos(seg / 2);
  if (polyR < open) return clamp01(0.12 + 0.28 * (1 - polyR / open));
  const s = fract((a + r * 2.2) / seg);
  return clamp01(0.2 + 0.34 * s + (s < 0.05 ? 0.5 : 0));
});

// Testimonial B — vectorscope with rotating sweep and colour targets
const vectorscope = field((u, v, t) => {
  const r = Math.sqrt(u * u + v * v);
  if (r > 0.95) return 0;
  const a = Math.atan2(v, u);
  let val = 0;
  if (Math.abs(r - 0.9) < 0.012 || Math.abs(r - 0.6) < 0.008 || Math.abs(r - 0.3) < 0.008) val = 0.45;
  if ((Math.abs(u) < 0.006 || Math.abs(v) < 0.008) && r < 0.9) val = Math.max(val, 0.3);
  // six target boxes
  for (let k = 0; k < 6; k++) {
    const ta = (k / 6) * TAU + 0.3;
    const dx = u - Math.cos(ta) * 0.68;
    const dy = v - Math.sin(ta) * 0.68;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 0.06 && Math.max(Math.abs(dx), Math.abs(dy)) > 0.045) val = 0.7;
  }
  // signal cloud
  const cloud =
    Math.exp(-((u - 0.12 * Math.sin(t * 0.6)) ** 2 + (v + 0.08 * Math.cos(t * 0.5)) ** 2) * 9) *
    (0.4 + 0.6 * hash(Math.floor(u * 40) * 13 + Math.floor(v * 40) + Math.floor(t * 8)));
  val = Math.max(val, cloud * 0.8);
  // sweep beam
  const sweep = fract((a - t * 0.9) / TAU);
  if (r < 0.9) val = Math.max(val, Math.exp(-sweep * 14) * 0.55 * (r / 0.9));
  return clamp01(val);
});

// Contact A — infinite tunnel
const tunnel = field((u, v, t) => {
  const r = Math.sqrt(u * u + v * v * 1.15);
  if (r < 0.06) return 0;
  const a = Math.atan2(v, u);
  const depth = 0.32 / r + t * 0.45;
  const ring = Math.abs(fract(depth) - 0.5);
  const spoke = Math.abs(fract((a / TAU) * 12 + (0.6 / r) * 0.25 - t * 0.04) - 0.5);
  const lines = Math.max(smooth(0.38, 0.5, ring), smooth(0.4, 0.5, spoke) * 0.75);
  const fade = smooth(0.06, 0.4, r) * (1 - smooth(1.1, 1.6, r));
  return clamp01((0.12 + lines * 0.85) * fade);
});

// Contact B — nested wireframe cubes (a "3D layer")
const CUBE_V = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
const CUBE_E: [number, number][] = [];
for (let a = 0; a < 8; a++)
  for (let b = a + 1; b < 8; b++) {
    const d = CUBE_V[a].reduce((s, c, i) => s + (c !== CUBE_V[b][i] ? 1 : 0), 0);
    if (d === 1) CUBE_E.push([a, b]);
  }
const cubes: Scene = (buf, g, t) => {
  buf.fill(0);
  g.z.fill(0);
  const drawCube = (size: number, ay: number, ax: number, bright: number) => {
    const pts = CUBE_V.map(([x, y, z]) => {
      const x1 = x * Math.cos(ay) + z * Math.sin(ay);
      const z1 = -x * Math.sin(ay) + z * Math.cos(ay);
      const y1 = y * Math.cos(ax) - z1 * Math.sin(ax);
      const z2 = y * Math.sin(ax) + z1 * Math.cos(ax);
      const zz = 3.4 + z2 * size;
      return [(x1 * size * 2.6) / zz, (y1 * size * 2.6) / zz, 1 / zz];
    });
    for (const [a, b] of CUBE_E) {
      const [ua, va, za] = pts[a];
      const [ub, vb, zb] = pts[b];
      const len = Math.hypot((ub - ua) * g.scale, (vb - va) * g.scale);
      const n = Math.ceil(len / (Math.min(g.cw, g.ch) * 0.6)) + 1;
      for (let s = 0; s <= n; s++) {
        const k = s / n;
        const z = za + (zb - za) * k;
        plot(buf, g, ua + (ub - ua) * k, va + (vb - va) * k, z, clamp01(bright * (0.5 + (z - 0.22) * 5)));
      }
    }
    for (const [u, v, z] of pts) plot(buf, g, u, v, z + 0.01, 1);
  };
  drawCube(0.95, t * 0.4, 0.5 + Math.sin(t * 0.3) * 0.25, 0.85);
  drawCube(0.45, -t * 0.7, -0.4 + t * 0.2, 0.7);
  // floor grid
  for (let j = 0; j < g.rows; j++) {
    const v = (j * g.ch + g.ch / 2 - g.cy) / g.scale;
    if (v < 0.8) continue;
    const persp = 1 / (v - 0.6);
    for (let i = 0; i < g.cols; i++) {
      const u = (i * g.cw + g.cw / 2 - g.cx) / g.scale;
      const gx = Math.abs(fract(u * persp * 0.8) - 0.5);
      const gz = Math.abs(fract(persp * 0.6 - t * 0.3) - 0.5);
      if ((gx > 0.44 || gz > 0.44) && buf[j * g.cols + i] === 0) buf[j * g.cols + i] = 0.22 * (1 - smooth(0.8, 1.6, Math.abs(u)));
    }
  }
};

/** Two figures per section: [section][variant] */
const SECTIONS: Scene[][] = [
  [globe, torus],
  [spectrum, scope],
  [timeline, film],
  [aperture, vectorscope],
  [tunnel, cubes],
];
const EMPTY: Scene = (buf) => buf.fill(0);

/* ═══════════════════════ Component ═══════════════════════ */

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // "reduce motion" (e.g. Windows animation effects off) keeps the figures
    // alive but plays them slower and calmer instead of freezing them
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = calm ? 0.6 : 1;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const g: Grid = {
      cols: 0,
      rows: 0,
      cw: 8,
      ch: 14,
      W: 0,
      H: 0,
      scale: 1,
      baseScale: 1,
      cx: 0,
      cy: 0,
      z: new Float32Array(0),
    };
    let dpr = 1;
    let atlas: HTMLCanvasElement | null = null;
    let cellNoise = new Float32Array(0);
    let bufA = new Float32Array(0);
    let bufB = new Float32Array(0);
    // 2 = text box (fully cleared), 1 = soft halo around it
    let mask = new Uint8Array(0);
    // free-standing text (not inside a panel) pushes the ASCII away so it stays readable
    let maskEls: HTMLElement[] = [];
    const collectMaskEls = () => {
      maskEls = Array.from(
        document.querySelectorAll<HTMLElement>(
          "main h1, main h2, main h3, main p, main blockquote, main .btn, main footer a, [data-ascii-mask]"
        )
      ).filter((el) => !el.closest(".panel"));
    };

    let section = 0;
    let variant = 0;
    let fromScene: Scene = EMPTY;
    let toScene: Scene = SECTIONS[0][0];
    // the first figure builds itself in once the page loader is gone
    let morphStart = Number.POSITIVE_INFINITY;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const mouse = { x: -999, y: -999, tx: -999, ty: -999 };

    const fontFamily = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim();
      return `${v ? `${v}, ` : ""}ui-monospace, Menlo, Consolas, monospace`;
    };

    const buildAtlas = (fontSize: number) => {
      const a = document.createElement("canvas");
      const step = Math.ceil(g.cw * dpr);
      a.width = step * LEVELS;
      a.height = Math.ceil(g.ch * dpr);
      const actx = a.getContext("2d");
      if (!actx) return null;
      actx.font = `500 ${fontSize * dpr}px ${fontFamily()}`;
      actx.textAlign = "center";
      actx.textBaseline = "middle";
      for (let i = 1; i < LEVELS; i++) {
        const k = i / (LEVELS - 1);
        if (k > 0.8) {
          actx.fillStyle = `rgba(170, 167, 255, ${0.7 + k * 0.3})`;
        } else {
          const c = Math.round(70 + k * 150);
          actx.fillStyle = `rgba(${c}, ${c}, ${c + 12}, ${0.5 + k * 0.5})`;
        }
        actx.fillText(RAMP[i], step * i + step / 2, a.height / 2 + dpr * 0.5);
      }
      return a;
    };

    // Figure placement: centred on mobile, nudged right on wide screens so it
    // frames the content instead of sitting under the headline.
    // in the hero the figure is a larger halo framing the featured-video monitor
    const heroBoost = () => (g.W >= 1024 && section === 0 ? 1.3 : 1);
    const placeFigure = () => {
      const wide = g.W >= 1024;
      g.cx = g.W * (wide ? (section === 0 ? 0.68 : 0.5) : 0.5);
      g.cy = g.H * (wide ? 0.52 : 0.5);
    };

    const resize = () => {
      g.W = window.innerWidth;
      g.H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const fontSize = g.W < 640 ? 10 : g.W < 1280 ? 12 : g.W < 1680 ? 13 : 14;
      g.cw = Math.round(fontSize * 0.62 * 10) / 10;
      g.ch = Math.round(fontSize * 1.18);
      g.cols = Math.ceil(g.W / g.cw);
      g.rows = Math.ceil(g.H / g.ch);
      g.baseScale = Math.min(g.W, g.H) * (g.W < 768 ? 0.6 : 0.46);
      g.scale = g.baseScale * heroBoost();
      placeFigure();
      canvas.width = Math.floor(g.W * dpr);
      canvas.height = Math.floor(g.H * dpr);
      canvas.style.width = `${g.W}px`;
      canvas.style.height = `${g.H}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      atlas = buildAtlas(fontSize);
      const n = g.cols * g.rows;
      cellNoise = new Float32Array(n);
      bufA = new Float32Array(n);
      bufB = new Float32Array(n);
      mask = new Uint8Array(n);
      g.z = new Float32Array(n);
      for (let j = 0; j < g.rows; j++) {
        for (let i = 0; i < g.cols; i++) {
          // dissolve order: diagonal sweep + per-cell jitter
          cellNoise[j * g.cols + i] = (i / g.cols) * 0.25 + (j / g.rows) * 0.35 + hash(i * 17.3 + j * 91.7) * 0.4;
        }
      }
    };

    const goTo = (scene: Scene, now: number) => {
      if (scene === toScene) return;
      const p = (now - morphStart) / MORPH_MS;
      // interrupted early: keep the old source so cells don't jump twice
      if (p >= 0.5 || fromScene === toScene) fromScene = toScene;
      toScene = scene;
      morphStart = now;
    };

    const render = (now: number) => {
      if (!atlas) return;
      const t = ((now - t0) / 1000) * speed;
      const p = clamp01((now - morphStart) / MORPH_MS);
      const morphing = p < 1 && fromScene !== toScene;
      const e = easeInOut(p);

      // the figure position glides when switching between hero and the rest
      const targetCx = g.W >= 1024 && section === 0 ? g.W * 0.68 : g.W * 0.5;
      g.cx += (targetCx - g.cx) * 0.05;
      g.scale += (g.baseScale * heroBoost() - g.scale) * 0.05;

      if (morphing) {
        // zoom crossfade: the outgoing figure expands away while the new one
        // grows in from the centre, on top of the per-cell dissolve
        const base = g.scale;
        g.scale = base * (1 + 0.45 * e);
        fromScene(bufA, g, t);
        g.scale = base * (0.6 + 0.4 * e);
        toScene(bufB, g, t);
        g.scale = base;
      } else {
        toScene(bufB, g, t);
      }

      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const flick = Math.floor(t * 6);
      const sw = Math.ceil(g.cw * dpr);
      const sh = Math.ceil(g.ch * dpr);
      const rad2 = (g.scale * 0.35) ** 2;

      mask.fill(0);
      for (const el of maskEls) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > g.H || r.width === 0) continue;
        // inner box: the text itself plus a little air
        const i0 = Math.max(0, Math.floor((r.left - g.cw) / g.cw));
        const i1 = Math.min(g.cols - 1, Math.ceil((r.right + g.cw) / g.cw));
        const j0 = Math.max(0, Math.floor((r.top - g.ch * 0.3) / g.ch));
        const j1 = Math.min(g.rows - 1, Math.floor((r.bottom + g.ch * 0.3) / g.ch));
        // halo: a few extra cells around it, faded instead of cut
        const h0 = Math.max(0, i0 - 4);
        const h1 = Math.min(g.cols - 1, i1 + 4);
        for (let j = Math.max(0, j0 - 2); j <= Math.min(g.rows - 1, j1 + 2); j++) {
          const row = j * g.cols;
          const inner = j >= j0 && j <= j1;
          for (let i = h0; i <= h1; i++) {
            const v = inner && i >= i0 && i <= i1 ? 2 : 1;
            if (mask[row + i] < v) mask[row + i] = v;
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let j = 0; j < g.rows; j++) {
        const py = j * g.ch;
        const dy = py + g.ch / 2 - mouse.y;
        for (let i = 0; i < g.cols; i++) {
          const idx = j * g.cols + i;
          let val = bufB[idx];
          if (morphing) {
            const local = clamp01((e * 1.6 - cellNoise[idx]) / 0.6);
            if (local < 1) {
              const a = bufA[idx];
              // scramble burst at the transition front
              val = a + (val - a) * local + (hash(idx + flick) - 0.5) * 0.35 * (1 - Math.abs(local * 2 - 1));
            }
          }
          if (finePointer) {
            const dx = i * g.cw + g.cw / 2 - mouse.x;
            const d2 = dx * dx + dy * dy;
            if (d2 < rad2) val += 0.45 * (1 - d2 / rad2) ** 2 * (0.6 + 0.4 * hash(idx + flick));
          }
          val += (hash(idx * 0.37 + flick) - 0.5) * 0.05;
          if (mask[idx] === 2) continue;
          if (mask[idx] === 1) val *= 0.3;

          const lvl = Math.floor(clamp01(val) * (LEVELS - 1) + 0.15);
          if (lvl > 0) {
            ctx.drawImage(atlas, sw * lvl, 0, sw, sh, Math.round(i * g.cw * dpr), Math.round(py * dpr), sw, sh);
          }
        }
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS - 2) return;
      last = now;
      // alternate between the section's two figures while idle
      if (now - morphStart > MORPH_MS + HOLD_MS) {
        variant = 1 - variant;
        goTo(SECTIONS[section][variant], now);
      }
      render(now);
    };

    const setSection = (n: number) => {
      if (Number.isNaN(n) || n < 0 || n >= SECTIONS.length || n === section) return;
      section = n;
      variant = 0;
      goTo(SECTIONS[n][0], performance.now());
    };

    // whichever section crosses the vertical middle of the viewport
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) setSection(Number((en.target as HTMLElement).dataset.scene));
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    for (const s of document.querySelectorAll<HTMLElement>("[data-scene]")) io.observe(s);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        // ignore mobile URL-bar height jitter
        if (Math.abs(window.innerWidth - g.W) < 1 && Math.abs(window.innerHeight - g.H) < 120) return;
        resize();
      }, 150);
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    };

    const intro = () => {
      if (morphStart === Number.POSITIVE_INFINITY) morphStart = performance.now();
    };
    if (document.documentElement.dataset.loaded === "true") intro();
    else window.addEventListener("loader:done", intro, { once: true });
    const introFallback = window.setTimeout(intro, 3500);

    collectMaskEls();
    resize();
    document.fonts?.ready.then(resize);

    window.addEventListener("resize", onResize, { passive: true });
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(introFallback);
      window.removeEventListener("loader:done", intro);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />
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
