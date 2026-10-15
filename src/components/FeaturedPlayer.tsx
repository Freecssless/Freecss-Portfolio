"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type YTPlayer, YT_HOST, loadYouTubeApi } from "./ui/youtube";

/**
 * Inline player for the featured video, styled as the editor's "Program
 * monitor". YouTube's own controls are hidden and driven through the IFrame
 * Player API from our transport bar (timecode, play/pause, ±10s, mute,
 * fullscreen) and the mini timeline, which works as a scrubber.
 * The API script is only downloaded when the user presses play.
 */

const VIDEO_ID = "ck3W68KUsyg";
const WATCH_URL = `https://youtu.be/${VIDEO_ID}`;
const THUMB = `https://i.ytimg.com/vi_webp/${VIDEO_ID}/maxresdefault.webp`;
const FPS = 30;

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const timecode = (t: number) => {
  const s = Math.max(0, t);
  return `${pad(s / 3600)}:${pad((s / 60) % 60)}:${pad(s % 60)}:${pad((s % 1) * FPS)}`;
};
const shortTime = (t: number) => `${pad(t / 60)}:${pad(t % 60)}`;

type Status = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

function Icon({ d, className = "h-4 w-4" }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
// optically centred: the triangle's visual weight sits on the middle of the 24px box
const PLAY = "M7 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7L8.53 4.65A1 1 0 0 0 7 5.5z";
const PAUSE = "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z";
const BACK = "M11 6.5v11L3.5 12zM20 6.5v11L12.5 12z";
const FWD = "M13 6.5v11l7.5-5.5zM4 6.5v11l7.5-5.5z";
const VOL =
  "M4 9.5v5h3.5L12 19V5L7.5 9.5zM15.5 8.6a4.8 4.8 0 0 1 0 6.8l-1.1-1.1a3.3 3.3 0 0 0 0-4.6zm2.4-2.4a8.2 8.2 0 0 1 0 11.6l-1.1-1.1a6.6 6.6 0 0 0 0-9.4z";
const MUTED = "M4 9.5v5h3.5L12 19V5L7.5 9.5zM15 9.6l1.1-1.1 2.4 2.4 2.4-2.4L22 9.6 19.6 12l2.4 2.4-1.1 1.1-2.4-2.4-2.4 2.4-1.1-1.1 2.4-2.4z";
const FS = "M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z";
const FS_EXIT = "M8 4h2v6H4V8h4zm6 0h2v4h4v2h-6zM4 14h6v6H8v-4H4zm10 0h6v2h-4v4h-2z";

export default function FeaturedPlayer() {
  const [status, setStatus] = useState<Status>("idle");
  const [started, setStarted] = useState(false);
  // player created: from here the poster steps aside so, if the browser blocks
  // autoplay (iOS), a tap reaches YouTube's own play button underneath
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const durRef = useRef<HTMLSpanElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const bufRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  useEffect(() => {
    setCanFullscreen(
      !!(document.fullscreenEnabled || (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled)
    );
    const onFs = () => setIsFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      playerRef.current?.destroy();
    };
  }, []);

  // While a video is active: keep the monitor still (no 3D tilt)
  useEffect(() => {
    const panel = rootRef.current?.closest<HTMLElement>("[data-tilt]");
    if (!panel) return;
    panel.dataset.tiltOff = started ? "true" : "false";
    if (started) {
      panel.style.setProperty("--rx", "0deg");
      panel.style.setProperty("--ry", "0deg");
    }
  }, [started]);

  // Paint timecode / playhead / buffer through refs (no re-render per frame)
  const paint = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    const dur = p.getDuration() || 0;
    const cur = p.getCurrentTime() || 0;
    const frac = dur ? Math.min(1, cur / dur) : 0;
    if (tcRef.current) tcRef.current.textContent = timecode(cur);
    if (durRef.current && dur) durRef.current.textContent = `/ ${shortTime(dur)}`;
    if (headRef.current) headRef.current.style.left = `${frac * 100}%`;
    if (progRef.current) progRef.current.style.width = `${frac * 100}%`;
    if (bufRef.current) bufRef.current.style.width = `${Math.min(1, p.getVideoLoadedFraction() || 0) * 100}%`;
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const loop = () => {
      if (!scrubbing.current) paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, paint]);

  // Pause automatically when the monitor scrolls out of view
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !started) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting && document.fullscreenElement !== el) playerRef.current?.pauseVideo();
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  const start = async () => {
    if (status !== "idle") return;
    setStatus("loading");
    const YT = await loadYouTubeApi();
    if (!mountRef.current) return;
    const host = document.createElement("div");
    host.className = "h-full w-full";
    mountRef.current.appendChild(host);
    playerRef.current = new YT.Player(host, {
      videoId: VIDEO_ID,
      host: YT_HOST,
      width: "100%",
      height: "100%",
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: (e) => {
          setReady(true);
          e.target.playVideo();
          setMuted(e.target.isMuted());
        },
        // YouTube refused the embed (e.g. opened from a LAN IP like 192.168.x.x,
        // or the owner disabled embedding): show our own fallback, not its error screen
        onError: () => {
          setStatus("error");
          setStarted(false);
        },
        onStateChange: (e) => {
          // 1 playing · 2 paused · 0 ended · 3 buffering
          if (e.data === 1) {
            setStarted(true);
            setStatus("playing");
          } else if (e.data === 2) setStatus("paused");
          else if (e.data === 0) setStatus("ended");
        },
      },
    });
  };

  const toggle = () => {
    if (status === "error") {
      window.open(WATCH_URL, "_blank", "noopener,noreferrer");
      return;
    }
    const p = playerRef.current;
    if (!p) return void start();
    if (status === "playing") p.pauseVideo();
    else {
      if (status === "ended") p.seekTo(0, true);
      p.playVideo();
    }
  };

  const skip = (s: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(Math.max(0, Math.min(p.getDuration(), p.getCurrentTime() + s)), true);
    paint();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) p.unMute();
    else p.mute();
    setMuted(!muted);
  };

  const toggleFullscreen = () => {
    const el = rootRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen();
    else el.webkitRequestFullscreen?.();
  };

  // Mini timeline = scrubber
  const seekFromPointer = (clientX: number, final: boolean) => {
    const p = playerRef.current;
    const track = trackRef.current;
    if (!p || !track) return;
    const r = track.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const t = frac * (p.getDuration() || 0);
    p.seekTo(t, final);
    if (tcRef.current) tcRef.current.textContent = timecode(t);
    if (headRef.current) headRef.current.style.left = `${frac * 100}%`;
    if (progRef.current) progRef.current.style.width = `${frac * 100}%`;
  };
  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!playerRef.current) return;
    scrubbing.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromPointer(e.clientX, false);
  };
  const onTrackMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (scrubbing.current) seekFromPointer(e.clientX, false);
  };
  const onTrackUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbing.current) return;
    scrubbing.current = false;
    seekFromPointer(e.clientX, true);
  };
  const onTrackKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") skip(5);
    if (e.key === "ArrowLeft") skip(-5);
  };

  const playing = status === "playing";
  const ctrl =
    "flex h-8 w-8 items-center justify-center rounded-md text-foreground/70 transition-colors duration-200 hover:bg-panel-3 hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

  return (
    <div ref={rootRef} className="player-fs">
      {/* Video area */}
      <div className="player-video group relative aspect-video w-full overflow-hidden rounded-md bg-black">
        {/* YouTube iframe gets mounted here */}
        <div ref={mountRef} className="absolute inset-0" />

        {/* Click layer once playing: keeps our cursor and toggles play/pause */}
        {started && (
          <button
            type="button"
            onClick={toggle}
            className="absolute inset-0 z-[5] flex items-center justify-center"
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-accent text-background shadow-[0_10px_30px_-8px_rgba(143,140,255,0.8)] transition-all duration-500 ease-out ${
                playing ? "scale-75 opacity-0" : "scale-100 opacity-100"
              }`}
            >
              <Icon d={PLAY} className="h-7 w-7" />
            </span>
          </button>
        )}
        {started && !playing && <div className="pointer-events-none absolute inset-0 z-[4] bg-black/55 backdrop-blur-[2px]" />}

        {/* Poster: before the first play, and again when the video ends */}
        {(!ready || status === "ended" || status === "error") && (
          <button
            type="button"
            onClick={toggle}
            className={`absolute inset-0 z-[6] block transition-opacity duration-500 ${
              status === "loading" ? "pointer-events-none" : ""
            }`}
            aria-label={status === "error" ? "Ver video destacado en YouTube" : "Reproducir video destacado"}
          >
            <div className="wipe frame-marks absolute inset-0">
              <img
                src={THUMB}
                alt="Featured Video"
                width={1280}
                height={720}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 transition-opacity duration-500 group-hover:opacity-60" />
            <span className="absolute left-3 top-3 z-[4] rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-white/80 backdrop-blur">
              {status === "ended" ? "Repetir" : status === "error" ? "YouTube" : "Reproducir aquí"}
            </span>
            <span className="absolute inset-0 z-[4] flex items-center justify-center">
              {status === "error" ? (
                <span className="mx-4 flex max-w-[18rem] flex-col items-center gap-3 rounded-md border border-white/15 bg-black/70 px-4 py-3 text-center backdrop-blur-md">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/80">
                    No se puede reproducir aquí
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-background">
                    Ver en YouTube
                    <Icon d="M14 4h6v6h-2V7.4l-7.3 7.3-1.4-1.4L16.6 6H14zM5 6h6v2H6v10h10v-5h2v7H4V6z" className="h-4 w-4" />
                  </span>
                </span>
              ) : status === "loading" ? (
                <span className="flex items-center gap-2 rounded-md border border-white/15 bg-black/60 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
                  <span className="dot dot-rec" />
                  Cargando…
                </span>
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition-all duration-500 ease-out group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-background">
                  {status === "ended" ? (
                    <Icon d="M12 5V2L7 6l5 4V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" className="h-7 w-7" />
                  ) : (
                    <Icon d={PLAY} className="h-7 w-7" />
                  )}
                </span>
              )}
            </span>
          </button>
        )}
      </div>

      {/* Transport bar */}
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono text-[11px] text-muted">
        <div className="flex min-w-0 items-center gap-1.5 justify-self-start">
          <span ref={tcRef} className="tabular-nums text-accent">
            00:00:00:00
          </span>
          <span ref={durRef} className="hidden tabular-nums text-dim sm:inline" />
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className={ctrl} onClick={() => skip(-10)} disabled={!started} aria-label="Retroceder 10 segundos">
            <Icon d={BACK} className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-background transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label={playing ? "Pausar" : "Reproducir"}
          >
            <Icon d={playing ? PAUSE : PLAY} className="h-4 w-4" />
          </button>
          <button type="button" className={ctrl} onClick={() => skip(10)} disabled={!started} aria-label="Adelantar 10 segundos">
            <Icon d={FWD} className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-1 justify-self-end">
          <button type="button" className={ctrl} onClick={toggleMute} disabled={!started} aria-label={muted ? "Activar sonido" : "Silenciar"}>
            <Icon d={muted ? MUTED : VOL} />
          </button>
          {canFullscreen && (
            <button
              type="button"
              className={ctrl}
              onClick={toggleFullscreen}
              disabled={!started}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              <Icon d={isFullscreen ? FS_EXIT : FS} />
            </button>
          )}
        </div>
      </div>

      {/* Mini timeline — works as the scrubber */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={started ? 0 : -1}
        aria-label="Línea de tiempo del video"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        onPointerDown={onTrackDown}
        onPointerMove={onTrackMove}
        onPointerUp={onTrackUp}
        onPointerCancel={onTrackUp}
        onKeyDown={onTrackKey}
        className={`cursor-hover relative mt-3 h-7 touch-none overflow-hidden rounded-sm border border-line bg-background/60 ${
          started ? "" : "pointer-events-none"
        }`}
      >
        <div className="ruler absolute inset-x-0 top-0 opacity-80" />
        {/* buffered */}
        <div ref={bufRef} className="absolute bottom-1 left-0 h-2.5 w-0 rounded-[2px] bg-foreground/10" />
        {/* played — drawn like a clip on the timeline */}
        <div
          ref={progRef}
          className="absolute bottom-1 left-0 h-2.5 w-0 rounded-[2px] bg-accent/25 ring-1 ring-inset ring-accent/50"
        />
        <div ref={headRef} className="absolute inset-y-0 left-0 w-px bg-accent">
          <span className="absolute -left-[3px] top-0 h-1.5 w-[7px] bg-accent" />
        </div>
      </div>
    </div>
  );
}
