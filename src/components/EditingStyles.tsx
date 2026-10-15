"use client";

import type { CSSProperties } from "react";
import SectionHeader from "./ui/SectionHeader";

const styles = [
  {
    title: "Estilo Profesional",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4fda97242651275.69712890d4586.png",
    icon: "sparkle",
    youtubeId: "f5Bv3_TPpSc",
  },
  {
    title: "VideoClip",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d1a64b242651275.69717df7e611c.png",
    icon: "star",
    youtubeId: "JmMqOYj1YF0",
  },
  {
    title: "Publicitario",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6820d2242651275.69717f44669b6.png",
    icon: "sparkle",
    youtubeId: "AHLOsxiFKDs",
  },
  {
    title: "Multicámaras",
    image: "https://i.ytimg.com/vi/hk271vCfzV0/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLAal5ODKDSDaTdVPj0eq4dfkjfWIg",
    icon: "sparkle",
    youtubeId: "hk271vCfzV0&t=49s",
  },
  {
    title: "Gameplay",
    image: "https://i.ytimg.com/vi/GtblTk1tbf0/maxresdefault.jpg",
    icon: "sparkle",
    youtubeId: "GtblTk1tbf0&t=23s",
  },
  {
    title: "Cortometraje",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/484efb242651275.6971bb9069bf7.png",
    icon: "star",
    youtubeId: "QsgQXYQCAl0",
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

export default function EditingStyles() {
  const handleCardClick = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank");
  };

  return (
    <section id="videos" data-scene="2" className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="02" label="Trabajos" title="Estilos de Edición" />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {styles.map((style, index) => (
            <div
              key={`style-${style.title}-${index}`}
              data-reveal="card"
              style={{ "--d": `${(index % 3) * 120}ms` } as CSSProperties}
            >
              <button
                type="button"
                onClick={() => handleCardClick(style.youtubeId)}
                data-tilt="5"
                className="spot group panel flex h-full w-full flex-col overflow-hidden p-0 text-left hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_rgba(143,140,255,0.55)]"
                aria-label={`${style.title} — ver en YouTube`}
              >
                {/* Thumbnail */}
                <div className="wipe frame-marks relative aspect-video w-full overflow-hidden bg-panel-3">
                  <img
                    src={style.image}
                    alt={style.title}
                    width={1200}
                    height={675}
                    className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.05] group-hover:brightness-[0.8]"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute left-2.5 top-2.5 z-[4] rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/85 backdrop-blur">
                    Clip_{String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Play */}
                  <span className="absolute inset-0 z-[4] flex items-center justify-center">
                    <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-accent text-background opacity-0 shadow-[0_10px_30px_-8px_rgba(143,140,255,0.8)] transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
                      <svg className="ml-0.5 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                      </svg>
                    </span>
                  </span>

                  {/* YouTube badge */}
                  <span className="absolute bottom-2.5 right-2.5 z-[4] flex translate-y-1 items-center gap-1 rounded-sm bg-black/70 px-2 py-1 text-[10px] font-medium text-white opacity-0 backdrop-blur transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <svg className="h-3 w-3 text-rec" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Ver en YouTube
                  </span>
                </div>

                {/* Clip label bar */}
                <div className="flex flex-grow items-center gap-3 border-t border-line px-4 pb-2 pt-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-2 bg-panel-3 text-accent transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                    {style.icon === "sparkle" ? <SparkleIcon /> : <StarIcon />}
                  </span>
                  <h3 className="font-heading text-base font-medium text-foreground transition-colors duration-300 group-hover:text-accent-soft sm:text-lg">
                    {style.title}
                  </h3>
                  <svg
                    className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-muted opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>

                {/* Audio track strip */}
                <div className="h-6 px-4 pb-3">
                  <Waveform seed={index + 1} />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
