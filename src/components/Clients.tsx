"use client";

import { useEffect, useRef, useState } from "react";

const clients = [
  {
    name: "Wefere",
    subscribers: "3,7 Millones",
    image: "https://i.scdn.co/image/ab67616100005174458eaf37b37d44be943e040f",
  },
  {
    name: "AradirOff",
    subscribers: "2,3 Millones",
    image: "https://yt3.googleusercontent.com/sv9i_OP0uL2wvUJfCbgaivEhWSnnZl6uV23xkPxMVqxANnpBR5ej3MrSEFG9uZuZxV-E__Md=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Freecss",
    subscribers: "51k",
    image: "https://i.postimg.cc/xjRjTbG2/icon-tiktok.jpg",
  },
  {
    name: "Virion Mkt",
    subscribers: "Empresa",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROVbd0MhkUze_VEWrbU_d52TOwVoN1JbfDqA&s",
  },
];

export default function Clients() {
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
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-6 px-4 sm:px-6 lg:px-8 bg-gradient-section"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className={`text-center mb-12 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="section-divider" />
          <h2 className="section-title font-heading">Mis Clientes</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Conoce mi trayectoria como editor de video. Me enorgullece impulsar a mis clientes a alcanzar sus objetivos y superar sus expectativas.
          </p>
        </div>

        {/* Clients Grid - 5 columns on first row, 2 centered on second row */}
        <div className="flex flex-col items-center gap-8">
          {/* First Row - 5 clients */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {clients.slice(0, 5).map((client, index) => (
              <div
                key={`client-${client.name}-${index}`}
                className={`flex flex-col items-center group cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} w-36 sm:w-44`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-card border border-white/10 shadow-lg transition-all duration-300 group-hover:shadow-primary/20 group-hover:border-primary/30 group-hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20 flex flex-col items-center text-center">
                    <h3 className="font-heading font-bold text-sm text-white mb-0.5 group-hover:text-primary transition-colors duration-300 line-clamp-1 w-full">
                      {client.name}
                    </h3>
                    <div className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] text-white/90 font-medium">
                      {client.subscribers}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Second Row - 2 clients centered */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {clients.slice(5).map((client, index) => (
              <div
                key={`client-${client.name}-${index}`}
                className={`flex flex-col items-center group cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} w-36 sm:w-44`}
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-card border border-white/10 shadow-lg transition-all duration-300 group-hover:shadow-primary/20 group-hover:border-primary/30 group-hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                  <img
                    src={client.image}
                    alt={client.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-20 flex flex-col items-center text-center">
                    <h3 className="font-heading font-bold text-sm text-white mb-0.5 group-hover:text-primary transition-colors duration-300 line-clamp-1 w-full">
                      {client.name}
                    </h3>
                    <div className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] text-white/90 font-medium">
                      {client.subscribers}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
