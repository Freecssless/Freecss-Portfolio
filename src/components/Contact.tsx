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

function DiscordIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.1 14.1 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const channels = [
  {
    tag: "Email",
    title: "Contáctame Por Email",
    value: "gaelamicv@gmail.com",
    href: "mailto:gaelamicv@gmail.com",
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
  {
    tag: "Discord",
    title: "Contáctame Por Discord",
    value: "gutsfreecss",
    href: "https://discord.com/users/310543949456605186",
    external: true,
    Icon: DiscordIcon,
    button: "btn-ghost",
  },
  {
    tag: "Instagram",
    title: "Contáctame Por Instagram",
    value: "@freecsstk",
    href: "https://www.instagram.com/freecsstk/",
    external: true,
    Icon: InstagramIcon,
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
              style={{ "--d": `${100 + (i % 2) * 140}ms` } as CSSProperties}
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
