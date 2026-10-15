"use client";

import Link from "next/link";
import { type CSSProperties, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Roll from "./ui/Roll";
import Timecode from "./ui/Timecode";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Stars() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={`star-${i}-hero`} className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // Parallax as the hero scrolls away: copy drifts up faster than the monitor
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const monitorY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const monitorScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const monitorOpacity = useTransform(scrollYProgress, [0.2, 0.95], [1, 0]);

  const handleVideoClick = () => {
    window.open("https://youtu.be/m3_Hy70vh6M", "_blank");
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      data-scene="0"
      className="relative flex min-h-[100svh] items-center px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Left content */}
          <motion.div style={{ y: copyY, opacity: copyOpacity }} className="text-center lg:text-left">
            <span
              data-reveal
              data-ascii-mask
              className="mb-7 inline-flex items-center gap-2.5 rounded-md border border-line bg-panel/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted backdrop-blur"
            >
              <span className="dot dot-rec" />
              Editor Profesional de Videos
            </span>

            <h1 className="mb-7 font-heading text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.6rem]">
              <span className="line-mask">
                <span style={d(80)}>Convierte</span>
              </span>
              <span className="line-mask">
                <span style={d(160)}>tus ideas en</span>
              </span>
              <span className="line-mask">
                <span style={d(240)} className="text-accent-gradient">
                  experiencias
                </span>
              </span>
              <span className="line-mask">
                <span style={d(320)}>
                  <span className="text-accent-gradient">visuales</span>
                  <span className="caret" aria-hidden="true" />
                </span>
              </span>
            </h1>

            <p
              data-reveal
              style={d(380)}
              className="mx-auto mb-9 max-w-md text-base text-muted sm:text-lg lg:mx-0"
            >
              Edición profesional que potencia la calidad de tu contenido y amplifica su alcance.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <span data-reveal="pop" style={d(480)} className="block w-full sm:w-auto">
              <Link
                href="https://twitter.com/Freecss_less"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-full sm:w-auto"
              >
                <svg className="btn-icon h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <Roll>¡Trabajemos Juntos!</Roll>
              </Link>
              </span>
              <span data-reveal="pop" style={d(580)} className="block w-full sm:w-auto">
              <Link href="#videos" className="btn btn-ghost w-full sm:w-auto">
                <Roll>Ver trabajos</Roll>
                <svg className="btn-arrow h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              </span>
            </div>
          </motion.div>

          {/* Right — featured video as a "Program monitor" */}
          <motion.div
            style={{ y: monitorY, scale: monitorScale, opacity: monitorOpacity }}
            className="relative"
          >
          <div data-reveal="right" style={d(300)}>
            <div className="spot panel overflow-hidden" data-tilt="4">
              <div className="panel-head">
                <span className="panel-tab">
                  <span className="dot dot-rec" />
                  Featured
                </span>
                <span className="flex items-center gap-2">
                  <Stars />
                  <span className="font-mono text-[11px] text-foreground/80">Reseñas 5/5</span>
                </span>
              </div>

              <div className="p-3 sm:p-4">
                <button
                  type="button"
                  onClick={handleVideoClick}
                  className="group relative block aspect-video w-full overflow-hidden rounded-md bg-black"
                  aria-label="Ver video destacado en YouTube"
                >
                  <div className="wipe frame-marks absolute inset-0">
                    <img
                      src="https://i.ytimg.com/vi_webp/m3_Hy70vh6M/maxresdefault.webp"
                      alt="Featured Video"
                      width={1280}
                      height={720}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 transition-opacity duration-500 group-hover:opacity-60" />
                  <span className="absolute left-3 top-3 z-[4] rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur">
                    YouTube
                  </span>
                  {/* Play button */}
                  <span className="absolute inset-0 z-[4] flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                      <svg className="ml-1 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                      </svg>
                    </span>
                  </span>
                </button>

                {/* Transport bar (decorative) */}
                <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[11px] text-muted" aria-hidden="true">
                  <Timecode className="text-accent" />
                  <div className="flex items-center gap-3 text-foreground/70">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 6h2v12H6zM9.5 12 18 6v12z" />
                    </svg>
                    <svg className="h-4 w-4 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" />
                    </svg>
                  </div>
                  <span className="hidden sm:inline">Ajustar ▾</span>
                </div>

                {/* Mini timeline scrubber */}
                <div className="relative mt-3 h-7 overflow-hidden rounded-sm border border-line bg-background/60" aria-hidden="true">
                  <div className="ruler absolute inset-x-0 top-0 opacity-80" />
                  <div className="absolute bottom-1 left-[6%] right-[40%] h-2.5 rounded-[2px] bg-accent/25 ring-1 ring-inset ring-accent/50" />
                  <div className="absolute bottom-1 left-[61%] right-[8%] h-2.5 rounded-[2px] bg-foreground/10 ring-1 ring-inset ring-foreground/20" />
                  <div className="animate-scrub absolute inset-y-0 w-px bg-accent">
                    <span className="absolute -left-[3px] top-0 h-1.5 w-[7px] bg-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <Link
        href="#testimonials"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-foreground md:flex"
        aria-label="Bajar a clientes"
      >
        Scroll
        <span className="relative block h-8 w-px overflow-hidden bg-line-2">
          <span className="absolute inset-x-0 top-0 h-3 animate-[scroll-hint_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-accent" />
        </span>
      </Link>
    </section>
  );
}
