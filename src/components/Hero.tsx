"use client";

import Link from "next/link";

export default function Hero() {
  const handleVideoClick = () => {
    window.open("https://www.youtube.com/watch?v=gJAx0bKkOS0&t=154s", "_blank");
  };

  return (
    <section
      id="home"
      className="min-h-screen pt-20 pb-4 px-4 sm:px-6 lg:px-8 flex items-center bg-gradient-hero relative"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-sm text-muted mb-4 px-4 py-2 rounded-full bg-card border border-card-border animate-fade-in-up">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Editor Profesional de Videos
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-white to-primary bg-clip-text text-transparent animate-fade-in-left block" style={{ animationDelay: '0.1s' }}>
                Convierte
              </span>
              <span className="bg-gradient-to-r from-white via-primary-light to-primary bg-clip-text text-transparent animate-fade-in-left block" style={{ animationDelay: '0.2s' }}>
                tus ideas en
              </span>
              <span className="text-primary animate-fade-in-left block" style={{ animationDelay: '0.3s' }}>
                experiencias
              </span>
              <span className="text-primary animate-fade-in-left block" style={{ animationDelay: '0.4s' }}>
                visuales
              </span>
            </h1>

            <p className="text-muted text-lg mb-8 max-w-md mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Edición profesional que potencia la calidad de tu contenido y amplifica su alcance.
            </p>

            <Link
              href="https://twitter.com/Freecss_less"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: '0.5s' }}
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
              ¡Trabajemos Juntos!
            </Link>
          </div>

          {/* Right Content - Featured Video */}
          <div className="relative animate-fade-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-2 text-sm font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  FEATURED
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={`star-${i}-hero`}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-yellow-400 text-sm ml-1">
                    Reseñas 5/5
                  </span>
                </div>
              </div>

              {/* YouTube Thumbnail with play button - Clickable */}
              <button
                type="button"
                onClick={handleVideoClick}
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer w-full"
              >
                <img
                  src="https://i.ytimg.com/vi/gJAx0bKkOS0/maxresdefault.jpg"
                  alt="Featured Video"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform hover:bg-white/20">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
