"use client";

import { useEffect, useRef, useState } from "react";

export default function Testimonial() {
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
    <section ref={sectionRef} className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className={`card p-8 md:p-10 relative ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          {/* Quote mark */}
          <div className="absolute top-4 right-6 md:top-6 md:right-8 text-6xl md:text-8xl text-primary/10 font-serif pointer-events-none select-none">
            &ldquo;
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left relative z-10">
            {/* Content */}
            <div className="flex-1 order-2 md:order-1">
              <h3 className="text-primary font-heading text-xl font-semibold mb-4 flex items-center justify-center md:justify-start gap-2">
                <span className="md:hidden inline-block w-8 h-1 bg-primary rounded-full"></span>
                Testimonio
                <span className="md:hidden inline-block w-8 h-1 bg-primary rounded-full"></span>
              </h3>
              <p className="text-muted italic text-lg md:text-xl mb-6 leading-relaxed">
                &ldquo;Mi canal pasó de 500k a 800k suscriptores en menos de 3 meses gracias a las ediciones de Freecss. El ritmo de los videos mejoró significativamente la retención, lo que se reflejó directamente en un crecimiento acelerado del canal.&rdquo;
              </p>

              {/* Stats */}
              <div className="bg-card-bg/50 border border-card-border rounded-xl p-4 inline-block backdrop-blur-sm">
                <div className="text-primary text-2xl md:text-3xl font-bold">+300K</div>
                <div className="text-muted text-sm">Nuevos suscriptores</div>
              </div>
            </div>

            {/* Author */}
            <div className="flex flex-col items-center md:items-end min-w-[140px] order-1 md:order-2">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-4 border-card-bg shadow-xl">
                <img
                  src="https://yt3.googleusercontent.com/sv9i_OP0uL2wvUJfCbgaivEhWSnnZl6uV23xkPxMVqxANnpBR5ej3MrSEFG9uZuZxV-E__Md=s900-c-k-c0x00ffffff-no-rj"
                  alt="AradirOff"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-primary font-heading font-bold text-lg">
                AradirOff
              </h4>
              <p className="text-muted text-sm font-medium bg-primary/10 px-3 py-1 rounded-full mt-1">Youtuber</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
