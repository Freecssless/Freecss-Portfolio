"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function MailIcon() {
  return (
    <svg
      className="w-12 h-12 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-12 h-12 text-secondary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Background card */}
        <div className={`card p-8 md:p-12 relative overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Gradient background effect */}
          <div className="absolute inset-0 bg-gradient-contact" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
                Trabajemos Juntos
              </h2>
              <p className="text-muted max-w-xl mx-auto">
                ¿Listo para elevar tu contenido al máximo nivel? Contáctame y transformemos tu visión en resultados
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Email Card */}
              <div className={`bg-card border border-card-border rounded-2xl p-8 text-center hover:border-primary transition-all duration-300 hover:shadow-lg ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-center mb-4">
                  <MailIcon />
                </div>
                <h3 className="text-primary text-xl font-heading font-semibold mb-2">
                  Contáctame Por Email
                </h3>
                <p className="text-muted mb-6">gaelaminadad@gmail.com</p>
                <Link
                  href="mailto:gaelaminadad@gmail.com"
                  className="btn-primary w-full justify-center"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contáctame
                </Link>
              </div>

              {/* Twitter/X Card */}
              <div className={`bg-card border border-card-border rounded-2xl p-8 text-center hover:border-secondary transition-all duration-300 hover:shadow-lg ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                <div className="flex justify-center mb-4">
                  <XIcon />
                </div>
                <h3 className="text-blue-600 text-xl font-heading font-semibold mb-2">
                  Contáctame Por Twitter
                </h3>
                <p className="text-muted mb-6">@Freecss_less</p>
                <Link
                  href="https://twitter.com/Freecss_less"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary2 w-full justify-center"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Contáctame
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
