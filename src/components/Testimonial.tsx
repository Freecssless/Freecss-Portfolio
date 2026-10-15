import type { CSSProperties } from "react";
import CountUp from "./ui/CountUp";

export default function Testimonial() {
  return (
    <section data-scene="3" className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div data-reveal="card">
        <div className="spot panel overflow-hidden" data-tilt="2">
          {/* Panel header — like a markers / comments panel */}
          <div className="panel-head">
            <span className="panel-tab">
              <span className="dot" />
              Testimonio
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">Marker 01</span>
          </div>

          <div className="grid gap-10 p-6 sm:p-8 md:grid-cols-[200px_1fr] md:gap-12 md:p-12">
            {/* Author */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div data-reveal="scale" style={{ "--d": "150ms" } as CSSProperties} className="frame-marks is-static mb-4 h-28 w-28 p-2.5 [--m:0px]">
                <img
                  src="https://yt3.googleusercontent.com/sv9i_OP0uL2wvUJfCbgaivEhWSnnZl6uV23xkPxMVqxANnpBR5ej3MrSEFG9uZuZxV-E__Md=s900-c-k-c0x00ffffff-no-rj"
                  alt="AradirOff"
                  width={112}
                  height={112}
                  className="h-full w-full rounded-md object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="font-heading text-xl font-semibold text-foreground">AradirOff</h4>
              <p className="mt-2 rounded-sm border border-line-2 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Youtuber
              </p>
            </div>

            {/* Quote + stats */}
            <div className="relative">
              <span
                className="pointer-events-none absolute -left-1 -top-8 select-none font-mono text-7xl leading-none text-accent/20 md:-top-10 md:text-8xl"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <blockquote
                data-reveal
                style={{ "--d": "120ms" } as CSSProperties}
                className="relative font-heading text-xl font-normal leading-snug text-foreground/90 sm:text-2xl md:text-[1.7rem]"
              >
                &ldquo;Mi canal pasó de 500k a 800k suscriptores en menos de 3 meses gracias a las ediciones de Freecss. El ritmo de los videos mejoró significativamente la retención, lo que se reflejó directamente en un crecimiento acelerado del canal.&rdquo;
              </blockquote>

              {/* Growth readout */}
              <div
                data-reveal
                style={{ "--d": "240ms" } as CSSProperties}
                className="mt-8 flex flex-col gap-4 rounded-md border border-line bg-background/50 p-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <div className="shrink-0">
                  <div className="font-heading text-3xl font-semibold tracking-tight text-accent md:text-4xl">
                    <CountUp to={300} prefix="+" suffix="K" />
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Nuevos suscriptores</div>
                </div>
                <div className="flex-1" aria-hidden="true">
                  <div className="mb-1.5 flex justify-between font-mono text-[10px] text-dim">
                    <span>500K</span>
                    <span className="text-foreground/80">800K</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-[2px] bg-panel-3">
                    <div className="absolute inset-y-0 left-0 w-[62.5%] bg-line-2" />
                    <div className="growth-bar absolute inset-y-0 left-[62.5%] right-0 origin-left bg-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
