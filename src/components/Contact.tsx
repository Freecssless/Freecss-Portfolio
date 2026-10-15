import Link from "next/link";
import type { CSSProperties } from "react";
import Roll from "./ui/Roll";
import SectionHeader from "./ui/SectionHeader";

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function XIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const channels = [
  {
    tag: "Email",
    title: "Contáctame Por Email",
    value: "gaelaminadad@gmail.com",
    href: "mailto:gaelaminadad@gmail.com",
    external: false,
    Icon: MailIcon,
    button: "btn-primary",
  },
  {
    tag: "Twitter / X",
    title: "Contáctame Por Twitter",
    value: "@Freecss_less",
    href: "https://twitter.com/Freecss_less",
    external: true,
    Icon: XIcon,
    button: "btn-ghost",
  },
];

export default function Contact() {
  return (
    <section id="contact" data-scene="4" className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          index="03"
          label="Contacto"
          align="center"
          title={
            <>
              Trabajemos <span className="text-accent-gradient">Juntos</span>
            </>
          }
          description="¿Listo para elevar tu contenido al máximo nivel? Contáctame y transformemos tu visión en resultados"
        />

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {channels.map(({ tag, title, value, href, external, Icon, button }, i) => (
            <div
              key={tag}
              data-reveal="card"
              style={{ "--d": `${100 + i * 140}ms` } as CSSProperties}
              className="group"
            >
              <div
                data-tilt="3"
                className="spot panel flex h-full flex-col overflow-hidden hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_rgba(143,140,255,0.5)]"
              >
                <div className="panel-head">
                  <span className="panel-tab">
                    <span className="dot" />
                    {tag}
                  </span>
                  <span className="font-mono text-[10px] text-dim">0{i + 1}</span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-line-2 bg-panel-3 text-accent transition-all duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-1.5 font-heading text-xl font-semibold text-foreground sm:text-2xl">{title}</h3>
                  <p className="mb-8 break-all font-mono text-sm text-muted">{value}</p>

                  <Link
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`btn ${button} mt-auto w-full`}
                  >
                    <Icon className="btn-icon h-[18px] w-[18px]" />
                    <Roll>Contáctame</Roll>
                    <svg className="btn-arrow h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
