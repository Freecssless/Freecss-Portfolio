"use client";

import { useEffect, useRef, useState } from "react";

const styles = [
  {
    title: "Estilo Profesional",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/4fda97242651275.69712890d4586.png",
    icon: "sparkle",
    youtubeId: "f5Bv3_TPpSc",
  },
  {
    title: "VideoClip",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d1a64b242651275.69717df7e611c.png",
    icon: "star",
    youtubeId: "JmMqOYj1YF0",
  },
  {
    title: "Publicitario",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6820d2242651275.69717f44669b6.png",
    icon: "sparkle",
    youtubeId: "AHLOsxiFKDs",
  },
  {
    title: "Multicámaras",
    image: "https://i.ytimg.com/vi/oRkTCvJBahs/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAeSe6MBRMMVhsg67_5pLIPBQGGCQ",
    icon: "sparkle",
    youtubeId: "oRkTCvJBahs&t=173s",
  },
  {
    title: "Gameplay",
    image: "https://i.ytimg.com/vi/GtblTk1tbf0/maxresdefault.jpg",
    icon: "sparkle",
    youtubeId: "GtblTk1tbf0&t=23s",
  },
  {
    title: "Cortometraje",
    image: "https://mir-s3-cdn-cf.behance.net/project_modules/fs/484efb242651275.6971bb9069bf7.png",
    icon: "star",
    youtubeId: "QsgQXYQCAl0",
  },
];

function SparkleIcon() {
  return (
    <svg
      className="w-4 h-4 text-primary transition-transform duration-300 group-hover:rotate-45 group-hover:scale-125"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      className="w-4 h-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function EditingStyles() {
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

  const handleCardClick = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank");
  };

  return (
    <section
      ref={sectionRef}
      id="videos"
      className="py-6 px-4 sm:px-6 lg:px-8 bg-gradient-section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="section-divider" />
          <h2 className="section-title font-heading">Estilos de Edición</h2>
        </div>

        {/* Styles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {styles.map((style, index) => (
            <button
              type="button"
              key={`style-${style.title}-${index}`}
              onClick={() => handleCardClick(style.youtubeId)}
              className={`video-card card group cursor-pointer text-left flex flex-col h-full ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {/* Thumbnail Container - Moved to top for MD3 style */}
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={style.image}
                  alt={style.title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-90"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg hover:bg-white/20">
                    <svg
                      className="w-6 h-6 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                    </svg>
                  </div>
                </div>
                {/* YouTube badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Ver en YouTube
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex items-center gap-3 flex-grow bg-card-bg/50">
                <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                   {style.icon === "sparkle" ? <SparkleIcon /> : <StarIcon />}
                </div>
                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                  {style.title}
                </h3>
                
                {/* External link icon */}
                <svg
                  className="w-5 h-5 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
