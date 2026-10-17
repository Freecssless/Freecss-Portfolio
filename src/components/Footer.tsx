import Link from "next/link";
import BackToTop from "./BackToTop";
import Roll from "./ui/Roll";

const quickLinks = [
  { href: "#home", label: "Inicio" },
  { href: "#testimonials", label: "Clientes" },
  { href: "#videos", label: "Trabajos" },
  { href: "#cotizar", label: "Cotizar" },
  { href: "#contact", label: "Contacto" },
];

const services = [
  { href: "#videos", label: "Edición Profesional" },
  { href: "#videos", label: "VideoClip" },
  { href: "#videos", label: "Publicitario" },
  { href: "#videos", label: "Multicamáras" },
];

function LinkList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mono-label mb-5 text-foreground/70">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-2 text-sm text-muted transition-colors duration-300 hover:text-foreground"
            >
              <span className="font-mono text-[11px] text-dim transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
                →
              </span>
              <span className="roll-target">
                <Roll>{link.label}</Roll>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer data-scene="4" className="relative border-t border-line bg-background/90 px-4 pt-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Logo & social */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="#home" className="group mb-5 inline-flex items-center gap-3">
              <span className="block h-9 w-9 overflow-hidden rounded-md ring-1 ring-line-2 transition-[box-shadow] duration-300 group-hover:ring-accent">
                <img
                  src="https://i.postimg.cc/ppz8yMSJ/icon-web-freecss.png"
                  alt="Freecss"
                  width={36}
                  height={36}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </span>
              <span className="font-heading text-lg font-semibold text-foreground">
                Freecss<span className="text-accent">!</span>
              </span>
            </Link>

            <div className="flex gap-3">
              <Link
                href="https://twitter.com/Freecss_less"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="group flex h-10 w-10 items-center justify-center rounded-md border border-line-2 bg-panel transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10"
              >
                <svg
                  className="h-[18px] w-[18px] text-muted transition-colors duration-300 group-hover:text-accent"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </Link>
            </div>
          </div>

          <LinkList title="Enlaces Rápidos" links={quickLinks} />
          <LinkList title="Servicios" links={services} />
        </div>
      </div>

      {/* Status bar */}
      <div className="-mx-4 border-t border-line sm:-mx-6 lg:-mx-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 font-mono text-[11px] text-dim sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 Freecss. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2 uppercase tracking-[0.14em]">
            <span className="dot" />
            Freecss_Portfolio.prproj
          </p>
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}
