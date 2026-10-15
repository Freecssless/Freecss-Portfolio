"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const BAR_CELLS = 24;
const MIN_TIME = 1100;
const MAX_TIME = 3200;
const GLYPHS = "!<>-_\\/[]{}=+*^?#@$%&01";

function formatTimecode(ms: number) {
  const totalFrames = Math.floor(ms / (1000 / 30));
  const ff = totalFrames % 30;
  const ss = Math.floor(totalFrames / 30) % 60;
  return `00:00:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
}

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const startedAt = performance.now();
    let loaded = document.readyState === "complete";
    let finished = false;
    let raf = 0;
    const word = "FREECSS";

    const onLoad = () => {
      loaded = true;
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    // Progress eases toward 90% while waiting, then completes once the page is ready.
    let progress = 0;
    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const ready = (loaded && elapsed > MIN_TIME) || elapsed > MAX_TIME;
      const target = ready ? 1 : Math.min(0.9, elapsed / (MIN_TIME * 1.4));
      progress += (target - progress) * (ready ? 0.22 : 0.08);

      const filled = Math.round(progress * BAR_CELLS);
      if (barRef.current) {
        barRef.current.textContent = "█".repeat(filled) + "░".repeat(BAR_CELLS - filled);
      }
      if (pctRef.current) {
        pctRef.current.textContent = `${String(Math.round(progress * 100)).padStart(3, " ")}%`;
      }
      if (tcRef.current) tcRef.current.textContent = formatTimecode(elapsed);

      // ASCII decode of the name
      if (nameRef.current) {
        const resolved = Math.floor(Math.min(1, elapsed / 900) * word.length);
        let out = "";
        for (let i = 0; i < word.length; i++) {
          out += i < resolved ? word[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        nameRef.current.textContent = out;
      }

      if (ready && progress > 0.995) {
        if (!finished) {
          finished = true;
          setIsLoading(false);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  const handleExitComplete = () => {
    document.documentElement.dataset.loaded = "true";
    window.dispatchEvent(new Event("loader:done"));
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isLoading && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background px-6"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          aria-busy="true"
          aria-label="Cargando"
        >
          <motion.div
            className="flex w-full min-w-0 max-w-sm flex-col items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
          >
            <div className="frame-marks is-static relative mb-7 h-24 w-24 p-3">
              <img
                src="https://i.postimg.cc/gwCGsMmL/icon-pwb.png"
                alt="Logo"
                width={72}
                height={72}
                className="h-full w-full rounded-md object-cover"
                decoding="async"
              />
            </div>

            <span
              ref={nameRef}
              className="font-mono text-2xl font-medium tracking-[0.4em] text-foreground"
              aria-hidden="true"
            >
              FREECSS
            </span>

            <div className="mt-8 w-full font-mono text-[11px] text-muted">
              <div className="mb-2 flex justify-between uppercase tracking-[0.14em]">
                <span className="flex items-center gap-2">
                  <span className="dot dot-rec" />
                  Renderizando
                </span>
                <span ref={tcRef} className="tabular-nums text-foreground">
                  00:00:00:00
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span ref={barRef} className="min-w-0 flex-1 overflow-hidden whitespace-pre text-accent">
                  {"░".repeat(BAR_CELLS)}
                </span>
                <span ref={pctRef} className="whitespace-pre tabular-nums text-foreground">
                  {"  0%"}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
