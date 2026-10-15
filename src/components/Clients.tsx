import type { CSSProperties } from "react";
import SectionHeader from "./ui/SectionHeader";

const clients = [
  {
    name: "Wefere",
    subscribers: "3,7 Millones",
    image: "https://i.scdn.co/image/ab67616100005174458eaf37b37d44be943e040f",
  },
  {
    name: "Frizzy26",
    subscribers: "36k",
    image: "https://yt3.googleusercontent.com/YKNFvzIMqqtZ0FQiqNK-0gxvH-fLAS_IvZtrzZz6UM4HAA3VP8O_bnP4LDCdalJR5KBX16s9Fg=s400-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Virion Mkt",
    subscribers: "Empresa",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROVbd0MhkUze_VEWrbU_d52TOwVoN1JbfDqA&s",
  },
  {
    name: "Komori",
    subscribers: "Empresa",
    // served from /public: the original Facebook CDN link is signed and expires
    image: "/clients/komori.jpg",
  },
];

export default function Clients() {
  return (
    <section
      id="testimonials"
      data-scene="1"
      className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="01"
          label="Clientes"
          title="Mis Clientes"
          description="Conoce mi trayectoria como editor de video. Me enorgullece impulsar a mis clientes a alcanzar sus objetivos y superar sus expectativas."
        />

        {/* Project bin */}
        {/* Centered wrapping rows: 2 per row on phones and tablets, all 4 in one row on desktop */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {clients.map((client, index) => (
            <div
              key={`client-${client.name}-${index}`}
              data-reveal="card"
              style={{ "--d": `${index * 110}ms` } as CSSProperties}
              className="group w-[calc(50%-7px)] sm:w-[calc(50%-11px)] lg:w-[calc((100%-60px)/4-1px)]"
            >
              <div
                data-tilt="8"
                className="spot panel h-full p-2 hover:border-accent/50 hover:shadow-[0_30px_60px_-30px_rgba(143,140,255,0.6)] sm:p-2.5"
              >
                <div className="wipe frame-marks relative aspect-square overflow-hidden rounded-md bg-panel-3">
                  <img
                    src={client.image}
                    alt={client.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute left-2 top-2 z-[4] rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/80 backdrop-blur">
                    0{index + 1}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-[0.95rem] font-semibold text-foreground transition-colors duration-300 group-hover:text-accent-soft sm:text-base">
                      {client.name}
                    </h3>
                    <p className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:text-[11px]">
                      {client.subscribers}
                    </p>
                  </div>
                  <span className="dot shrink-0 bg-line-2 transition-colors duration-300 group-hover:bg-accent" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
