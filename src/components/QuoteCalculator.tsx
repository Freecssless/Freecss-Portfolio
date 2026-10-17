"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Roll from "./ui/Roll";
import SectionHeader from "./ui/SectionHeader";
import {
  DISCLAIMER,
  FORMATS,
  type FormatId,
  GUARANTEES,
  PRIORITY_SURCHARGE,
  formatUSD,
} from "./quote/pricing";
import { type CopyResult, copyQuoteImage } from "./quote/quoteImage";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Check({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

/** tiny aspect-ratio glyph for the format switch */
function RatioIcon({ vertical }: { vertical: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block rounded-[2px] border-[1.5px] border-current ${vertical ? "h-4 w-[9px]" : "h-[9px] w-4"}`}
    />
  );
}

/** Total that counts to its new value instead of jumping */
function AnimatedTotal({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = shown.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 450);
      const e = 1 - (1 - p) ** 3;
      shown.current = from + (to - from) * e;
      el.textContent = formatUSD(p < 1 ? Math.round(shown.current * 100) / 100 : to);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    el.animate?.([{ transform: "scale(1.05)" }, { transform: "none" }], { duration: 380, easing: "ease-out" });
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span ref={ref} className={`inline-block tabular-nums ${className ?? ""}`}>
      {formatUSD(value)}
    </span>
  );
}

const COPY_LABEL: Record<CopyResult | "idle" | "working" | "error", string> = {
  idle: "Copiar como imagen",
  working: "Generando…",
  copied: "¡Imagen copiada!",
  shared: "¡Lista para enviar!",
  downloaded: "Imagen descargada",
  cancelled: "Copiar como imagen",
  error: "No se pudo generar",
};

export default function QuoteCalculator() {
  const [formatId, setFormatId] = useState<FormatId>("vertical");
  const [tierIndex, setTierIndex] = useState(0);
  const [amounts, setAmounts] = useState<Record<FormatId, number>>({
    vertical: FORMATS.vertical.amount.initial,
    horizontal: FORMATS.horizontal.amount.initial,
  });
  const [priority, setPriority] = useState(false);
  const [copyState, setCopyState] = useState<keyof typeof COPY_LABEL>("idle");

  const format = FORMATS[formatId];
  const tier = format.tiers[tierIndex];
  const amount = amounts[formatId];
  const subtotal = format.subtotal(tier.price, amount);
  const surcharge = priority ? subtotal * PRIORITY_SURCHARGE : 0;
  const total = Math.round((subtotal + surcharge) * 100) / 100;
  const pct = ((amount - format.amount.min) / (format.amount.max - format.amount.min)) * 100;

  // phones: a compact total bar while configuring, hidden once the summary is on screen
  const configRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [configVisible, setConfigVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  useEffect(() => {
    const c = configRef.current;
    const s = summaryRef.current;
    if (!c || !s) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === c) setConfigVisible(e.isIntersecting);
        else setSummaryVisible(e.isIntersecting);
      }
    }, { threshold: 0.15 });
    io.observe(c);
    io.observe(s);
    return () => io.disconnect();
  }, []);

  const resetCopy = useRef(0);
  const onCopy = async () => {
    if (copyState === "working") return;
    setCopyState("working");
    window.clearTimeout(resetCopy.current);
    try {
      const res = await copyQuoteImage({ format, tierIndex, amount, priority, total });
      setCopyState(res);
    } catch {
      setCopyState("error");
    }
    resetCopy.current = window.setTimeout(() => setCopyState("idle"), 2600);
  };

  const done = copyState === "copied" || copyState === "shared" || copyState === "downloaded";

  return (
    <section id="cotizar" data-scene="5" className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="03"
          label="Cotizar"
          title={
            <>
              Cotiza tu <span className="text-accent-gradient">video</span>
            </>
          }
          description="Selecciona el formato, nivel y duración que quieres que tenga tu video"
        />

        <div className="grid items-start gap-4 sm:gap-5 lg:grid-cols-[1.55fr_1fr]">
          {/* ───────── Configurator ───────── */}
          <div ref={configRef} data-reveal="card" style={d(0)}>
            <div className="spot panel overflow-hidden">
              {/* Format: workspace-like segmented tabs */}
              <div className="panel-head !h-auto flex-wrap gap-3 py-2.5">
                <span className="mono-label">Formato</span>
                <div
                  role="radiogroup"
                  aria-label="Formato del video"
                  className="flex w-full rounded-lg border border-line bg-background/60 p-1 sm:w-auto"
                >
                  {(Object.keys(FORMATS) as FormatId[]).map((id) => {
                    const f = FORMATS[id];
                    const active = id === formatId;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setFormatId(id)}
                        className={`relative flex flex-1 items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm transition-colors duration-300 sm:flex-none ${
                          active ? "text-foreground" : "text-muted hover:text-foreground"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="quote-format"
                            className="absolute inset-0 rounded-md border border-accent/50 bg-accent/10"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className={`relative ${active ? "text-accent" : ""}`}>
                          <RatioIcon vertical={id === "vertical"} />
                        </span>
                        <span className="relative font-medium">{f.label}</span>
                        <span className="relative font-mono text-[10px] text-dim">{f.ratio}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8 p-4 sm:p-6">
                {/* Level */}
                <fieldset>
                  <legend className="mono-label mb-3 flex items-center gap-2">
                    <span className="text-accent">01</span> Nivel de edición
                  </legend>
                  <div role="radiogroup" aria-label="Nivel de edición" className="grid gap-3 md:grid-cols-3">
                    {format.tiers.map((t, i) => {
                      const active = i === tierIndex;
                      return (
                        <button
                          key={`${formatId}-${t.id}`}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setTierIndex(i)}
                          style={{ animationDelay: `${i * 60}ms` }}
                          className={`quote-swap group/tier relative flex flex-col rounded-lg border p-4 text-left transition-[border-color,background-color,box-shadow,transform] duration-300 ease-out active:scale-[0.985] ${
                            active
                              ? "border-accent/70 bg-accent/[0.07] shadow-[0_18px_40px_-24px_rgba(143,140,255,0.8)]"
                              : "border-line bg-background/40 hover:border-line-2 hover:bg-panel-3/60"
                          }`}
                        >
                          <span className="mb-3 flex items-center justify-between">
                            <span className="font-heading text-base font-semibold text-foreground">{t.name}</span>
                            <span
                              className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-300 ${
                                active ? "border-accent bg-accent text-background" : "border-line-2"
                              }`}
                            >
                              {active && <Check className="h-2.5 w-2.5" />}
                            </span>
                          </span>
                          <span className="mb-3 flex items-baseline gap-1.5">
                            <span className={`font-heading text-3xl font-semibold tracking-tight ${active ? "text-accent" : "text-foreground"}`}>
                              {formatUSD(t.price)}
                            </span>
                            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                              USD {format.per}
                            </span>
                          </span>
                          <ul className="space-y-1.5 text-[13px] leading-snug">
                            {i > 0 && (
                              <li className="flex items-center gap-2 text-dim">
                                <span className="font-mono text-[11px]">↳</span> Todo lo anterior
                              </li>
                            )}
                            {t.features.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-foreground/85">
                                <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${active ? "text-accent" : "text-muted"}`} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Amount: pieces or minutes */}
                <div>
                  <div className="mb-2 flex items-end justify-between gap-3">
                    <label htmlFor="quote-amount" className="mono-label flex items-center gap-2">
                      <span className="text-accent">02</span> {format.amount.label}
                    </label>
                    <span key={formatId} className="quote-swap font-heading text-2xl font-semibold tabular-nums text-foreground">
                      {format.amount.format(amount)}
                    </span>
                  </div>
                  <input
                    id="quote-amount"
                    type="range"
                    className="quote-range"
                    min={format.amount.min}
                    max={format.amount.max}
                    step={format.amount.step}
                    value={amount}
                    aria-valuetext={format.amount.format(amount)}
                    onChange={(e) => setAmounts((a) => ({ ...a, [formatId]: Number(e.target.value) }))}
                    style={{ "--p": `${pct}%` } as CSSProperties}
                  />
                  {/* timeline-like ruler under the slider */}
                  <div className="relative mt-1 h-5 font-mono text-[10px] text-dim" aria-hidden="true">
                    {format.amount.ticks.map((t) => {
                      const left = ((t - format.amount.min) / (format.amount.max - format.amount.min)) * 100;
                      return (
                        <span
                          key={`${formatId}-${t}`}
                          className={`absolute top-0 -translate-x-1/2 transition-colors duration-200 ${
                            t <= amount ? "text-muted" : ""
                          }`}
                          style={{ left: `calc(7px + (100% - 14px) * ${left / 100})` }}
                        >
                          <span className="mx-auto mb-0.5 block h-1 w-px bg-current" />
                          {t}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Priority */}
                <label className="group/prio flex cursor-pointer items-center gap-4 rounded-lg border border-line bg-background/40 p-4 transition-colors duration-300 hover:border-line-2 has-[:checked]:border-accent/60 has-[:checked]:bg-accent/[0.07]">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={priority}
                    onChange={(e) => setPriority(e.target.checked)}
                  />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-line-2 text-background transition-all duration-300 peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/60">
                    {priority && <Check className="h-3 w-3" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 font-heading text-base font-semibold text-foreground">
                      <span className="mono-label !text-accent">03</span> Entrega prioritaria
                    </span>
                    <span className="block text-sm text-muted">Reserva de agenda y respuesta acelerada</span>
                  </span>
                  <span className="shrink-0 rounded-sm border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[11px] text-accent">
                    +{Math.round(PRIORITY_SURCHARGE * 100)}%
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ───────── Summary ───────── */}
          <div ref={summaryRef} data-reveal="card" style={d(140)} className="lg:sticky lg:top-24">
            <div className="spot panel overflow-hidden">
              <div className="panel-head">
                <span className="panel-tab">
                  <span className="dot dot-rec" />
                  Precio total
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">Render</span>
              </div>

              <div className="p-4 sm:p-6">
                <dl className="space-y-2.5 font-mono text-[12px]">
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider text-dim">Formato</dt>
                    <dd className="text-foreground/85">
                      {format.label} ({format.ratio})
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider text-dim">Nivel</dt>
                    <dd className="text-foreground/85">
                      {tier.name} · {formatUSD(tier.price)} {format.per}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider text-dim">{formatId === "vertical" ? "Cantidad" : "Duración"}</dt>
                    <dd className="text-foreground/85">{format.amount.format(amount)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="uppercase tracking-wider text-dim">Prioritaria</dt>
                    <dd className={priority ? "text-accent" : "text-foreground/50"}>
                      {priority ? `+${formatUSD(surcharge)} (+${Math.round(PRIORITY_SURCHARGE * 100)}%)` : "No"}
                    </dd>
                  </div>
                </dl>

                <div className="ruler my-5 opacity-70" aria-hidden="true" />

                <div className="mb-5" aria-live="polite">
                  <div className="mono-label mb-1">Total estimado</div>
                  <div className="flex items-baseline gap-2">
                    <AnimatedTotal
                      value={total}
                      className="origin-left font-heading text-[2.6rem] font-semibold leading-none tracking-tight text-accent sm:text-5xl"
                    />
                    <span className="font-mono text-sm text-accent-soft">USD</span>
                  </div>
                </div>

                {/* Guarantees */}
                <ul className="mb-3 flex flex-wrap gap-2">
                  {GUARANTEES.map((g) => (
                    <li
                      key={g}
                      className="flex items-center gap-1.5 rounded-md border border-line bg-background/50 px-2.5 py-1.5 text-[13px] text-foreground/85"
                    >
                      <Check className="h-3.5 w-3.5 text-accent" />
                      {g}
                    </li>
                  ))}
                </ul>

                {/* Disclaimer */}
                <p className="mb-6 flex items-start gap-2.5 rounded-md border border-[#f5c46b]/25 bg-[#f5c46b]/[0.06] px-3 py-2.5 text-[13px] leading-snug text-muted">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#f5c46b]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.5 1.5 21h21L12 2.5zm1 15h-2v-2h2v2zm0-4h-2V9h2v4.5z" />
                  </svg>
                  {DISCLAIMER}
                </p>

                <div className="flex flex-col gap-3">
                  <a href="#contact" className="btn btn-primary w-full">
                    <svg className="btn-icon h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
                    </svg>
                    <Roll>Consultar disponibilidad</Roll>
                  </a>
                  <button type="button" onClick={onCopy} className="btn btn-ghost w-full" aria-live="polite">
                    {done ? (
                      <Check className="h-[18px] w-[18px] text-accent" />
                    ) : (
                      <svg className="btn-icon h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="8" y="8" width="12" height="12" rx="2" strokeWidth={2} />
                        <path strokeLinecap="round" strokeWidth={2} d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3" />
                      </svg>
                    )}
                    <span className={done ? "text-accent-soft" : ""}>{COPY_LABEL[copyState]}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones: compact total while configuring */}
      <div
        className={`fixed bottom-5 left-4 right-[76px] z-40 transition-all duration-500 ease-out lg:hidden ${
          configVisible && !summaryVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="flex w-full items-center justify-between gap-3 rounded-md border border-line-2 bg-panel/95 px-4 py-2.5 text-left shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Total</span>
          <span className="flex items-baseline gap-1.5">
            <AnimatedTotal value={total} className="font-heading text-xl font-semibold text-accent" />
            <span className="font-mono text-[11px] text-accent-soft">USD</span>
          </span>
          <span className="font-mono text-[11px] text-foreground/80">Ver ↓</span>
        </button>
      </div>
    </section>
  );
}
