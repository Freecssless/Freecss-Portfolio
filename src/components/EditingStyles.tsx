"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import SectionHeader from "./ui/SectionHeader";
import { type YTPlayer, YT_HOST, loadYouTubeApi } from "./ui/youtube";

type Clip = {
  title: string;
  image: string;
  icon: "sparkle" | "star";
  url: string;
};

/** Horizontal works (16:9) */
const videos: Clip[] = [
  {
    title: "VideoClip",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d1a64b242651275.69717df7e611c.png",
    icon: "star",
    url: "https://www.youtube.com/watch?v=JmMqOYj1YF0",
  },
  {
    title: "Gameplay",
    image: "https://i.ytimg.com/vi/gHYQJyVUzPU/maxresdefault.jpg",
    icon: "sparkle",
    url: "https://www.youtube.com/watch?v=gHYQJyVUzPU",
  },
  {
    title: "Cortometraje",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/484efb242651275.6971bb9069bf7.png",
    icon: "star",
    url: "https://www.youtube.com/watch?v=QsgQXYQCAl0",
  },
];

/**
 * Vertical reels (9:16). YouTube only exposes a 16:9 thumbnail for these
 * Shorts, with the vertical frame centred, so `object-cover` in a 9:16 box
 * crops it exactly to the reel.
 */
const reels: Clip[] = [
  {
    title: "Dinámico",
    image: "https://i.ytimg.com/vi/XrAw-_MY5U4/maxresdefault.jpg",
    icon: "sparkle",
    url: "https://www.youtube.com/shorts/XrAw-_MY5U4",
  },
  {
    title: "Publicitario",
    image: "https://i.ytimg.com/vi/LcxERrdWz9I/maxresdefault.jpg",
    icon: "sparkle",
    url: "https://www.youtube.com/shorts/LcxERrdWz9I",
  },
  {
    title: "Event Recap",
    image: "https://i.ytimg.com/vi/BuugEYaQ0jY/maxresdefault.jpg",
    icon: "star",
    url: "https://www.youtube.com/shorts/BuugEYaQ0jY",
  },
  {
    title: "Gameplay Shorts",
    image: "https://i.ytimg.com/vi/kzjj98b8WAs/maxresdefault.jpg",
    icon: "sparkle",
    url: "https://www.youtube.com/shorts/kzjj98b8WAs",
  },
];

function SparkleIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:rotate-45 group-hover:scale-110"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 transition-transform duration-500 ease-out group-hover:rotate-12 group-hover:scale-110"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/** Deterministic audio-waveform strip so every clip looks like a timeline clip (SSR safe). */
function Waveform({ seed }: { seed: number }) {
  const bars = 64;
  const heights = Array.from({ length: bars }, (_, i) => {
    const x = i / bars;
    const h =
      Math.abs(Math.sin(i * 0.55 + seed * 1.7) * 0.55 + Math.sin(i * 0.17 + seed) * 0.35) *
      (0.55 + 0.45 * Math.sin(Math.PI * x));
    // rounded so server and client markup match exactly
    return Math.round(Math.max(0.08, Math.min(1, h)) * 100) / 100;
  });
  return (
    <svg
      className="wave h-full w-full text-line-2 transition-colors duration-500 group-hover:text-accent/70"
      viewBox={`0 0 ${bars * 3} 20`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <rect
          key={`w-${seed}-${i}`}
          x={i * 3}
          y={(10 - h * 9).toFixed(2)}
          width={1.6}
          height={(h * 18).toFixed(2)}
          rx={0.6}
          fill="currentColor"
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </svg>
  );
}

const youtubeId = (url: string) => url.match(/(?:v=|shorts\/|youtu\.be\/)([\w-]{11})/)?.[1] ?? "";

/**
 * Silent looping preview of the clip.
 * YouTube flashes its own transport buttons for ~3s every time playback starts
 * (and again on resume), so players are started *ahead of time* and then kept
 * running: on desktop as soon as the page is idle, on phones when the card gets
 * within ~3 screens (to save mobile data). The thumbnail, with a thin render
 * bar, covers the player until those buttons are gone. Looping is done by
 * seeking back just before the end, which doesn't trigger the buttons again.
 * Skipped entirely with "data saver".
 */
/** seconds of playback after which YouTube has hidden its start-up buttons */
const REVEAL_AT_SECONDS = 3.2;
/** after a stall / seek / loop YouTube keeps them on screen a little longer */
const REVEAL_AFTER_STALL_SECONDS = 5;

/*
 * Booting a YouTube player is a burst of main-thread work. Several at once
 * (e.g. while scrolling) caused visible hitches, so players are started one at
 * a time, when the browser is idle, with a short gap between them.
 */
const bootQueue: (() => void)[] = [];
let booting = false;
function pumpBootQueue() {
  if (booting) return;
  const job = bootQueue.shift();
  if (!job) return;
  booting = true;
  const run = () => {
    job();
    window.setTimeout(() => {
      booting = false;
      pumpBootQueue();
    }, 350);
  };
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 1200 });
  else window.setTimeout(run, 60);
}
function scheduleBoot(job: () => void) {
  bootQueue.push(job);
  pumpBootQueue();
  return () => {
    const i = bootQueue.indexOf(job);
    if (i >= 0) bootQueue.splice(i, 1);
  };
}

function usePreviewsAllowed() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    // never compete with the initial page load
    const go = () => window.setTimeout(() => setAllowed(true), 600);
    if (document.documentElement.dataset.loaded === "true") go();
    else window.addEventListener("loader:done", go, { once: true });
    const fallback = window.setTimeout(() => setAllowed(true), 4500);
    return () => {
      window.removeEventListener("loader:done", go);
      window.clearTimeout(fallback);
    };
  }, []);
  return allowed;
}

function Preview({ id, vertical = false }: { id: string; vertical?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const allowed = usePreviewsAllowed();
  const [inRange, setInRange] = useState(false);
  const [ready, setReady] = useState(false);
  const active = allowed && inRange && !!id;

  // alive while the card is within the look-ahead range, destroyed when far away
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    const io = new IntersectionObserver(([entry]) => setInRange(entry.isIntersecting), {
      rootMargin: desktop ? "400% 0px" : "300% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // create / destroy the muted player
  useEffect(() => {
    const host = hostRef.current;
    if (!active || !host) return;
    let cancelled = false;
    let played = 0; // seconds of continuous playback since the (re)start
    let last = 0;
    let threshold = REVEAL_AT_SECONDS;
    let loopTimer = 0;
    let player: YTPlayer | null = null;
    const cancelBoot = scheduleBoot(() =>
      loadYouTubeApi().then((YT) => {
      if (cancelled) return;
      const mount = document.createElement("div");
      host.appendChild(mount);
      player = new YT.Player(mount, {
        videoId: id,
        host: YT_HOST,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: id,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
            loopTimer = window.setInterval(() => {
              const p = e.target;
              const cur = p.getCurrentTime();
              const dur = p.getDuration();
              // reveal once enough real playback has happened for YouTube's buttons to hide
              if (cur > last) played += cur - last;
              last = cur;
              if (played >= threshold && !cancelled) setReady(true);
              // seamless loop: jump back before the end so playback never "restarts"
              if (dur > 2 && cur > dur - 0.8) {
                p.seekTo(0, true);
                last = 0;
              }
            }, 250);
          },
          // embedding refused (e.g. LAN IP): just keep the thumbnail
          onError: (e) => e.target.destroy(),
          onStateChange: (e) => {
            if (e.data === 1) {
              // muted autoplay turns on auto-captions: drop them
              e.target.unloadModule?.("captions");
              e.target.unloadModule?.("cc");
            } else {
              // any stall / seek / restart makes YouTube flash its buttons again:
              // cover with the thumbnail until enough clean playback has happened
              if (played > 0) threshold = REVEAL_AFTER_STALL_SECONDS;
              played = 0;
              last = e.target.getCurrentTime() || 0;
              setReady(false);
            }
          },
        },
      });
      })
    );
    return () => {
      cancelled = true;
      cancelBoot();
      window.clearInterval(loopTimer);
      player?.destroy();
      host.innerHTML = "";
      setReady(false);
    };
  }, [active, id]);

  return (
    <>
      <div ref={ref} className={`clip-preview ${vertical ? "is-vertical" : ""} ${ready ? "is-ready" : ""}`} aria-hidden="true">
        <div ref={hostRef} className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
      </div>
      {/* render bar while the preview is being prepared */}
      <span
        aria-hidden="true"
        className={`render-bar pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[2px] ${
          active && !ready ? "is-rendering" : ""
        }`}
      />
    </>
  );
}

/** Timeline-clip card, horizontal (16:9) or vertical reel (9:16). */
function ClipCard({ clip, index, vertical = false }: { clip: Clip; index: number; vertical?: boolean }) {
  const tag = `${vertical ? "Reel" : "Clip"}_${String(index + 1).padStart(2, "0")}`;
  return (
    <button
      type="button"
      onClick={() => window.open(clip.url, "_blank", "noopener,noreferrer")}
      data-tilt={vertical ? "7" : "5"}
      className="spot group panel flex h-full w-full flex-col overflow-hidden p-0 text-left hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_rgba(143,140,255,0.55)]"
      aria-label={`${clip.title} — ver en YouTube`}
    >
      {/* Thumbnail */}
      <div
        className={`wipe frame-marks relative w-full overflow-hidden bg-panel-3 ${
          vertical ? "aspect-[9/16]" : "aspect-video"
        }`}
      >
        <img
          src={clip.image}
          alt={clip.title}
          width={vertical ? 405 : 1200}
          height={vertical ? 720 : 675}
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.05] group-hover:brightness-[0.8]"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <Preview id={youtubeId(clip.url)} vertical={vertical} />
        {vertical && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
        )}
        <span className="absolute left-2.5 top-2.5 z-[4] rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/85">
          {tag}
        </span>
        {vertical && (
          <span className="absolute right-2.5 top-2.5 z-[4] rounded-sm border border-white/20 bg-black/65 px-1.5 py-0.5 font-mono text-[10px] text-white/80">
            9:16
          </span>
        )}

        {/* Play */}
        <span className="absolute inset-0 z-[4] flex items-center justify-center">
          <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-accent text-background opacity-0 shadow-[0_10px_30px_-8px_rgba(143,140,255,0.8)] transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
            <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
            </svg>
          </span>
        </span>

        {/* YouTube badge */}
        <span className="absolute bottom-2.5 right-2.5 z-[4] flex translate-y-1 items-center gap-1 rounded-sm bg-black/80 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <svg className="h-3 w-3 text-rec" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          {vertical ? "Shorts" : "Ver en YouTube"}
        </span>
      </div>

      {/* Clip label bar */}
      <div
        className={`flex flex-grow items-center border-t border-line pb-2 pt-3.5 ${
          vertical ? "gap-2 px-3 sm:gap-3 sm:px-4" : "gap-3 px-4"
        }`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-2 bg-panel-3 text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
          {clip.icon === "sparkle" ? <SparkleIcon /> : <StarIcon />}
        </span>
        <h3
          className={`min-w-0 font-heading font-medium text-foreground transition-colors duration-300 group-hover:text-accent-soft ${
            // reels are narrow: let the title wrap to two lines instead of cutting it
            vertical ? "line-clamp-2 break-words text-sm leading-tight sm:text-base" : "truncate text-base sm:text-lg"
          }`}
        >
          {clip.title}
        </h3>
        <svg
          className={`ml-auto h-4 w-4 shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100 ${
            vertical ? "hidden xl:block" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>

      {/* Audio track strip */}
      <div className={`h-6 pb-3 ${vertical ? "px-3 sm:px-4" : "px-4"}`}>
        <Waveform seed={index + (vertical ? 11 : 1)} />
      </div>
    </button>
  );
}

export default function EditingStyles() {
  // Warm up YouTube's player script once the page has finished loading, so the
  // previews don't have to wait for it when the visitor reaches this section.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const warm = () => void loadYouTubeApi();
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const schedule = () => {
      if (w.requestIdleCallback) w.requestIdleCallback(warm, { timeout: 3000 });
      else setTimeout(warm, 1200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  }, []);

  return (
    <section id="videos" data-scene="2" className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" label="Trabajos" title="Estilos de Edición" />

        {/* 16:9 works — on tablets the 3rd card sits centred on its own row */}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {videos.map((clip, index) => (
            <div
              key={`video-${clip.title}`}
              data-reveal="card"
              style={{ "--d": `${(index % 3) * 120}ms` } as CSSProperties}
              className="sm:last:col-span-2 sm:last:mx-auto sm:last:w-[calc(50%-10px)] lg:last:col-span-1 lg:last:w-auto"
            >
              <ClipCard clip={clip} index={index} />
            </div>
          ))}
        </div>

        {/* 9:16 reels */}
        <div className="mt-14 md:mt-20">
          <div data-reveal data-ascii-mask className="mb-6 flex items-center gap-4">
            <span className="mono-label flex shrink-0 items-center gap-2">
              <span className="text-accent">[9:16]</span>
              <span className="text-foreground/80">Reels</span>
            </span>
            <span className="ruler hidden flex-1 opacity-70 sm:block" />
          </div>

          {/* phones and small tablets: 2 per row; from 768px: all 4 in a row */}
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-3 sm:gap-5">
            {reels.map((clip, index) => (
              <div
                key={`reel-${clip.title}`}
                data-reveal="card"
                style={{ "--d": `${index * 120}ms` } as CSSProperties}
                className="w-[calc(50%-7px)] sm:w-[calc(50%-11px)] md:w-[calc((100%-60px)/4-1px)]"
              >
                <ClipCard clip={clip} index={index} vertical />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
