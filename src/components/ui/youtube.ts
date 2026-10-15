/**
 * Minimal typings + lazy loader for the YouTube IFrame Player API, shared by
 * the featured player and the work-card previews. The script is injected only
 * the first time a player is actually needed.
 */

export const YT_HOST = "https://www.youtube-nocookie.com";

export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getVideoLoadedFraction(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  destroy(): void;
  /** undocumented but stable: used to drop the auto-captions of muted playback */
  unloadModule?(name: string): void;
};
export type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId: string;
      host?: string;
      width?: string;
      height?: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (e: { target: YTPlayer }) => void;
        onStateChange?: (e: { data: number; target: YTPlayer }) => void;
        /** 2 bad id · 5 html5 · 100 not found · 101/150 embedding refused */
        onError?: (e: { data: number; target: YTPlayer }) => void;
      };
    }
  ) => YTPlayer;
};
declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;
export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        if (window.YT) resolve(window.YT);
      };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      document.head.appendChild(s);
    });
  }
  return apiPromise;
}
