import Link from "next/link";

const quickLinks = [
  { href: "#home", label: "Inicio" },
  { href: "#testimonials", label: "Clientes" },
  { href: "#videos", label: "Trabajos" },
  { href: "#contact", label: "Contacto" },
];

const services = [
  { href: "#videos", label: "Edición Profesional" },
  { href: "#videos", label: "VideoClip" },
  { href: "#videos", label: "Publicitario" },
  { href: "#videos", label: "Multicamáras" },
];

function ArrowIcon() {
  return (
    <svg
      className="w-3 h-3 text-primary transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-background border-t border-card-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Logo & Social */}
          <div>
            <Link href="#home" className="flex items-center gap-3 mb-4 group">
              <div className="relative">
                <img
                  src="https://i.postimg.cc/KkMwCY9L/Grupo-3.png"
                  alt="Freecss"
                  className="w-10 h-10 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <span className="text-primary font-heading font-semibold text-lg transition-all duration-300 group-hover:tracking-wider">
                Freecss!
              </span>
            </Link>

            {/* Social Icons */}
            <div className="flex gap-3">
              <Link
                href="https://twitter.com/Freecss_less"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-muted group-hover:text-primary transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-primary font-heading font-semibold mb-4">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-muted hover:text-primary transition-all duration-300 group hover:translate-x-1"
                  >
                    <ArrowIcon />
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-primary font-heading font-semibold mb-4">
              Servicios
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    {...(service.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-2 text-muted hover:text-primary transition-all duration-300 group hover:translate-x-1"
                  >
                    <ArrowIcon />
                    <span className="relative">
                      {service.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                    {service.href.startsWith("http") && (
                      <svg className="w-3 h-3 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-card-border pt-6 text-center">
          <p className="text-muted text-sm">
            © 2026 Freecss. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Back to top button */}
      <Link
        href="#home"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary-light hover:scale-110 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 z-50 group"
      >
        <svg
          className="w-6 h-6 text-white transition-transform duration-300 group-hover:-translate-y-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </Link>
    </footer>
  );
}
