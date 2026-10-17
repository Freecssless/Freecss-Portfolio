import { DISCLAIMER, type Format, GUARANTEES, PRIORITY_SURCHARGE, formatUSD, includedFeatures } from "./pricing";

export type QuoteData = {
  format: Format;
  tierIndex: number;
  amount: number;
  priority: boolean;
  total: number;
};

const C = {
  bg: "#09090b",
  panel: "#111114",
  panel2: "#17171b",
  line: "#232328",
  line2: "#303037",
  fg: "#ececef",
  muted: "#8b8b95",
  dim: "#5a5a63",
  accent: "#8f8cff",
  accentSoft: "#b4b2ff",
  warn: "#f5c46b",
};

const cssFont = (v: string, fallback: string) => {
  const f = getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  return f ? `${f}, ${fallback}` : fallback;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Renders the quote as a branded PNG (1080px wide, drawn at 2x) so the visitor
 * can paste/send it. Drawn by hand on a canvas: no external capture library,
 * and only same-origin images, so the canvas can always be exported.
 */
export async function renderQuoteImage(q: QuoteData): Promise<Blob> {
  await document.fonts?.ready;
  const sans = cssFont("--font-sans", "Inter, system-ui, sans-serif");
  const heading = cssFont("--font-heading", "'Space Grotesk', sans-serif");
  const mono = cssFont("--font-mono", "ui-monospace, Menlo, Consolas, monospace");
  const logo = await loadImage("/icons/icon-192.png");

  const features = includedFeatures(q.format, q.tierIndex);
  const tier = q.format.tiers[q.tierIndex];
  const W = 1080;
  const PAD = 64;
  const featRows = Math.ceil(features.length / 2);
  const H = 860 + featRows * 44;
  const S = 2;

  const canvas = document.createElement("canvas");
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.scale(S, S);
  ctx.textBaseline = "alphabetic";

  // background + subtle ASCII texture
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.font = `13px ${mono}`;
  ctx.fillStyle = "rgba(143,140,255,0.07)";
  const glyphs = " .:-=+*#";
  for (let y = 20; y < H; y += 22) {
    let row = "";
    for (let x = 0; x < W / 8; x++) {
      const n = Math.sin(x * 0.21 + y * 0.037) * Math.cos(y * 0.05 - x * 0.07);
      row += glyphs[Math.max(0, Math.floor((n * 0.5 + 0.5) * glyphs.length) - 2)] ?? " ";
    }
    ctx.fillText(row, 0, y);
  }

  // main panel
  const px = 36;
  const py = 36;
  const pw = W - 72;
  const ph = H - 72;
  const grad = ctx.createLinearGradient(0, py, 0, py + ph);
  grad.addColorStop(0, C.panel2);
  grad.addColorStop(1, C.panel);
  roundRect(ctx, px, py, pw, ph, 18);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 2;
  ctx.stroke();

  // header bar
  ctx.strokeStyle = C.line;
  ctx.beginPath();
  ctx.moveTo(px, py + 64);
  ctx.lineTo(px + pw, py + 64);
  ctx.stroke();
  ctx.fillStyle = "#ff5a5a";
  ctx.beginPath();
  ctx.arc(px + 30, py + 33, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `500 15px ${mono}`;
  ctx.fillStyle = C.fg;
  ctx.fillText("COTIZACIÓN", px + 46, py + 38);
  ctx.fillStyle = C.accent;
  ctx.fillRect(px + 20, py + 62, 150, 2);
  const date = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
  ctx.textAlign = "right";
  ctx.fillStyle = C.dim;
  ctx.fillText(date, px + pw - 24, py + 38);
  ctx.textAlign = "left";

  // brand
  let y = py + 130;
  if (logo) {
    ctx.save();
    roundRect(ctx, PAD, y - 40, 56, 56, 12);
    ctx.clip();
    ctx.drawImage(logo, PAD, y - 40, 56, 56);
    ctx.restore();
  }
  ctx.font = `600 34px ${heading}`;
  ctx.fillStyle = C.fg;
  ctx.fillText("Freecss", PAD + 72, y);
  const fw = ctx.measureText("Freecss").width;
  ctx.fillStyle = C.accent;
  ctx.fillText("!", PAD + 72 + fw, y);
  ctx.font = `14px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.fillText("EDITOR PROFESIONAL DE VIDEOS", PAD + 72, y + 24);

  // spec rows
  y += 80;
  const rows: [string, string][] = [
    ["FORMATO", `${q.format.label} (${q.format.ratio})`],
    ["NIVEL", `${tier.name} — ${formatUSD(tier.price)} USD ${q.format.per}`],
    [q.format.amount.label.toUpperCase(), q.format.amount.format(q.amount)],
    ["ENTREGA PRIORITARIA", q.priority ? `Sí (+${Math.round(PRIORITY_SURCHARGE * 100)}%)` : "No"],
  ];
  for (const [k, v] of rows) {
    ctx.font = `13px ${mono}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(k, PAD, y);
    ctx.font = `500 22px ${sans}`;
    ctx.fillStyle = C.fg;
    ctx.textAlign = "right";
    ctx.fillText(v, W - PAD, y + 2);
    ctx.textAlign = "left";
    y += 22;
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, y);
    ctx.lineTo(W - PAD, y);
    ctx.stroke();
    y += 34;
  }

  // included
  ctx.font = `13px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.fillText("INCLUYE", PAD, y);
  y += 34;
  const colW = (W - PAD * 2) / 2;
  features.forEach((f, i) => {
    const fx = PAD + (i % 2) * colW;
    const fy = y + Math.floor(i / 2) * 44;
    ctx.fillStyle = "rgba(143,140,255,0.14)";
    roundRect(ctx, fx, fy - 20, 26, 26, 6);
    ctx.fill();
    ctx.strokeStyle = C.accent;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(fx + 7, fy - 7);
    ctx.lineTo(fx + 11.5, fy - 2.5);
    ctx.lineTo(fx + 19.5, fy - 12);
    ctx.stroke();
    ctx.font = `20px ${sans}`;
    ctx.fillStyle = C.fg;
    ctx.fillText(f, fx + 40, fy);
  });
  y += featRows * 44 + 24;

  // total block
  roundRect(ctx, PAD, y, W - PAD * 2, 150, 14);
  ctx.fillStyle = "rgba(143,140,255,0.08)";
  ctx.fill();
  ctx.strokeStyle = "rgba(143,140,255,0.45)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = `14px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.fillText("PRECIO TOTAL", PAD + 28, y + 42);
  ctx.font = `600 64px ${heading}`;
  ctx.fillStyle = C.accent;
  const totalText = formatUSD(q.total);
  ctx.fillText(totalText, PAD + 28, y + 118);
  const tw = ctx.measureText(totalText).width;
  ctx.font = `500 24px ${mono}`;
  ctx.fillStyle = C.accentSoft;
  ctx.fillText("USD", PAD + 40 + tw, y + 118);
  // guarantees on the right
  ctx.textAlign = "right";
  ctx.font = `18px ${sans}`;
  GUARANTEES.forEach((g, i) => {
    ctx.fillStyle = C.fg;
    ctx.fillText(`✓  ${g}`, W - PAD - 28, y + 66 + i * 34);
  });
  ctx.textAlign = "left";
  y += 150 + 40;

  // disclaimer
  ctx.fillStyle = C.warn;
  ctx.beginPath();
  ctx.moveTo(PAD + 11, y - 18);
  ctx.lineTo(PAD + 22, y + 2);
  ctx.lineTo(PAD, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = C.bg;
  ctx.font = `700 13px ${sans}`;
  ctx.fillText("!", PAD + 8.5, y);
  ctx.font = `17px ${sans}`;
  ctx.fillStyle = C.muted;
  ctx.fillText(DISCLAIMER, PAD + 36, y);

  // footer
  ctx.font = `14px ${mono}`;
  ctx.fillStyle = C.dim;
  ctx.fillText("gaelamicv@gmail.com", PAD, py + ph - 30);
  ctx.textAlign = "right";
  ctx.fillText("freecss-portfolio.vercel.app", W - PAD, py + ph - 30);
  ctx.textAlign = "left";

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/png")
  );
}

export type CopyResult = "copied" | "shared" | "downloaded" | "cancelled";

/**
 * Copy to the clipboard when the browser allows images there; otherwise share
 * (phones) or download the PNG.
 */
export async function copyQuoteImage(q: QuoteData): Promise<CopyResult> {
  const blobPromise = renderQuoteImage(q);
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      // the promise is handed over immediately so Safari keeps the user gesture
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blobPromise })]);
      return "copied";
    }
  } catch {
    /* fall through */
  }
  const blob = await blobPromise;
  const file = new File([blob], "cotizacion-freecss.png", { type: "image/png" });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] }) && window.matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ files: [file], title: "Cotización Freecss" });
      return "shared";
    } catch (e) {
      // the visitor closed the share sheet on purpose: don't force a download
      if ((e as DOMException)?.name === "AbortError") return "cancelled";
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cotizacion-freecss.png";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "downloaded";
}
