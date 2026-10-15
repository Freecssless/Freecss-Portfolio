"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Roll from "./ui/Roll";

const navItems = [
  { href: "#home", label: "Inicio" },
  { href: "#testimonials", label: "Clientes" },
  { href: "#videos", label: "Trabajos" },
  { href: "#contact", label: "Contacto" },
];

const TOTAL_FRAMES = 30 * 90; // the whole page "plays" as a 1:30 sequence

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [ids]);
  return active;
}

const sectionIds = navItems.map((n) => n.href.slice(1));

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection(sectionIds);
  const tcRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const unsubP = scrollYProgress.on("change", (p) => {
      if (!tcRef.current) return;
      const f = Math.round(p * TOTAL_FRAMES);
      const s = Math.floor(f / 30);
      tcRef.current.textContent = `00:${pad(Math.floor(s / 60))}:${pad(s % 60)}:${pad(f % 30)}`;
    });
    let lastY = window.scrollY;
    const unsubY = scrollY.on("change", (y) => {
      setScrolled(y > 12);
      // hide while scrolling down, reveal as soon as the user scrolls up
      if (y > lastY + 8 && y > 240) setHidden(true);
      else if (y < lastY - 4 || y < 240) setHidden(false);
      lastY = y;
    });
    setScrolled(window.scrollY > 12);
    return () => {
      unsubP();
      unsubY();
    };
  }, [scrollYProgress, scrollY]);

  // close mobile menu with Escape
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out ${
        hidden && !isMenuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className={`border-b transition-[background-color,border-color] duration-500 ${
          scrolled || isMenuOpen
            ? "border-line bg-background/80 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="#home" className="group flex items-center gap-3" onClick={() => setIsMenuOpen(false)}>
            <span className="relative block h-8 w-8 overflow-hidden rounded-md ring-1 ring-line-2 transition-[box-shadow] duration-300 group-hover:ring-accent">
              <img
                src="https://i.postimg.cc/ppz8yMSJ/icon-web-freecss.png"
                alt="Freecss"
                width={32}
                height={32}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                referrerPolicy="no-referrer"
                decoding="async"
              />
            </span>
            <span className="font-heading text-[1.05rem] font-semibold tracking-tight text-foreground">
              Freecss<span className="text-accent">!</span>
            </span>
          </Link>

          {/* Desktop navigation — workspace tabs */}
          <nav
            className="hidden items-center gap-1 rounded-lg border border-line bg-panel/70 p-1 md:flex"
            aria-label="Principal"
          >
            {navItems.map((item, i) => {
              const isActive = active === item.href.slice(1);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-muted hover:text-foreground"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md border border-line-2 bg-panel-3"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative font-mono text-[10px] transition-colors duration-300 ${
                      isActive ? "text-accent" : "text-dim"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span className="roll-target relative">
                    <Roll>{item.label}</Roll>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: timecode readout + mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-line bg-panel/70 px-3 py-1.5 font-mono text-xs lg:flex">
              <span className="dot dot-rec" />
              <span ref={tcRef} className="tabular-nums text-foreground/90">
                00:00:00:00
              </span>
            </div>

            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-md border border-line bg-panel/70 text-foreground md:hidden"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              <span className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ease-out ${
                    isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-px w-4 bg-current transition-transform duration-500 ease-out ${
                    isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              key="mobile-nav"
              className="overflow-hidden border-t border-line md:hidden"
              initial={{ height: 0 }}
              animate={{ height: "auto", transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ height: 0, transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } }}
              aria-label="Principal móvil"
            >
              <ul className="px-4 py-3">
                {navItems.map((item, index) => {
                  const isActive = active === item.href.slice(1);
                  return (
                    <motion.li
                      key={item.href}
                      className="border-b border-line/60 last:border-0"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: 0.06 + index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-4 py-4 text-lg transition-colors ${
                          isActive ? "text-foreground" : "text-muted"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className={`font-mono text-xs ${isActive ? "text-accent" : "text-dim"}`}>
                          0{index + 1}
                        </span>
                        <span className="font-heading">{item.label}</span>
                        <span className="ml-auto font-mono text-xs text-dim">{isActive ? "●" : "→"}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll progress, like a playhead moving across the sequence */}
      <div className="relative h-px bg-transparent">
        <motion.div
          className="absolute inset-y-0 left-0 w-full origin-left bg-accent"
          style={{ scaleX: progress }}
        />
      </div>
    </header>
  );
}
