"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Roll from "./ui/Roll";
import FeaturedPlayer from "./FeaturedPlayer";

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

  // Parallax only for the side-by-side desktop layout: on phones/tablets the
  // monitor sits below the copy, and fading it would hide the video right when
  // you scroll to it.
  const [parallax, setParallax] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setParallax(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
          <motion.div style={parallax ? { y: copyY, opacity: copyOpacity } : undefined} className="text-center lg:text-left">
            <span
              data-reveal
              data-ascii-mask
              className="mb-7 inline-flex items-center gap-2.5 rounded-md border border-line bg-panel/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
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
            style={parallax ? { y: monitorY, scale: monitorScale, opacity: monitorOpacity } : undefined}
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
                <FeaturedPlayer />
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
