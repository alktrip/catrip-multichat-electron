/**
 * Generador del icono del system tray para Catrip Connect.
 *
 * Estrategia visual:
 *   - Linux (bandeja): `tray-white-*.png` — silueta blanca, fondo transparente.
 *   - Otras plataformas: `tray-*.png` (verde WhatsApp #25D366).
 *   - Generados por `_scripts/build-tray-icons.py` en el build.
 *   - Con no leídos: se compone el badge en SVG y se rasteriza encima.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { app, nativeImage } from "electron";
import { Resvg } from "@resvg/resvg-js";

const BADGE_TEMPLATE = `
  <g>
    <rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{r}" ry="{r}" fill="#dc2626" stroke="#ffffff" stroke-width="8"/>
    <text x="{cx}" y="{ty}" font-family="Arial, Helvetica, sans-serif" font-size="{fontSize}" font-weight="800" fill="#ffffff" text-anchor="middle">{number}</text>
  </g>
`;

export type TrayVisualMode = "default";

function notificationGeometry(numStr: string): {
  x: number;
  y: number;
  width: number;
  height: number;
  r: number;
  cx: number;
  ty: number;
  fontSize: number;
} {
  const HEIGHT = 80;
  const RADIUS = 40;
  const MARGIN = 10;
  const yTop = 256 - MARGIN - HEIGHT;

  let width: number;
  let fontSize: number;
  if (numStr.length === 1) {
    width = 80;
    fontSize = 56;
  } else if (numStr.length === 2) {
    width = 120;
    fontSize = 56;
  } else {
    width = 170;
    fontSize = 48;
  }

  const x = 256 - MARGIN - width;
  const cx = x + width / 2;
  const cy = yTop + HEIGHT / 2;
  const ty = cy + fontSize * 0.35;
  return { x, y: yTop, width, height: HEIGHT, r: RADIUS, cx, ty, fontSize };
}

function badgeSvg(qtd: number): string {
  const n = Math.min(999, Math.max(0, Math.floor(qtd)));
  if (n <= 0) return "";
  const g = notificationGeometry(String(n));
  return BADGE_TEMPLATE.replace("{x}", String(g.x))
    .replace("{y}", String(g.y))
    .replace("{width}", String(g.width))
    .replace("{height}", String(g.height))
    .replace(/\{r\}/g, String(g.r))
    .replace("{cx}", String(g.cx))
    .replace("{ty}", String(g.ty))
    .replace("{fontSize}", String(g.fontSize))
    .replace("{number}", String(n));
}

let trayBaseCache: Electron.NativeImage | null | undefined;

function loadTrayBaseImage(): Electron.NativeImage | null {
  if (trayBaseCache !== undefined) return trayBaseCache;
  const dir = path.join(app.getAppPath(), "assets/icons");
  const candidates =
    process.platform === "linux"
      ? ["tray-white-24.png", "tray-white-22.png", "tray-white-32.png"]
      : ["tray-32.png", "tray-24.png", "tray-22.png", "256x256.png"];
  for (const fname of candidates) {
    const p = path.join(dir, fname);
    try {
      if (fs.existsSync(p)) {
        const img = nativeImage.createFromPath(p);
        if (!img.isEmpty()) {
          trayBaseCache = img;
          return img;
        }
      }
    } catch {
      // siguiente candidato
    }
  }
  trayBaseCache = null;
  return null;
}

function rasterSizeForTray(): number {
  return process.platform === "linux" ? 24 : 32;
}

function resizeTrayIcon(img: Electron.NativeImage): Electron.NativeImage {
  const target = rasterSizeForTray();
  const resized = img.resize({ width: target, height: target });
  return resized.isEmpty() ? img : resized;
}

/** Compone badge sobre la base verde pregenerada. */
function composeTrayWithBadge(
  base: Electron.NativeImage,
  badgeCount: number,
): Electron.NativeImage {
  const notify = badgeSvg(badgeCount);
  if (!notify) return resizeTrayIcon(base);

  const target = rasterSizeForTray();
  const basePng = resizeTrayIcon(base).toPNG();
  if (!basePng?.length) return resizeTrayIcon(base);

  const baseDataUrl = `data:image/png;base64,${basePng.toString("base64")}`;
  const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image x="0" y="0" width="256" height="256" preserveAspectRatio="xMidYMid meet" href="${baseDataUrl}"/>
  ${notify}
</svg>`;

  try {
    const r = new Resvg(svg, {
      fitTo: { mode: "width", value: target },
      font: { loadSystemFonts: false },
    });
    const out = nativeImage.createFromBuffer(r.render().asPng());
    if (!out.isEmpty()) return out;
  } catch {
    // ignore
  }
  return resizeTrayIcon(base);
}

/** @deprecated Mantenido por compatibilidad con tests; usa la base pregenerada. */
export function buildTrayIconSvg(_mode: TrayVisualMode, qtd: number): string | null {
  const notify = badgeSvg(qtd);
  const base = loadTrayBaseImage();
  if (!base) return null;
  const basePng = base.toPNG();
  if (!basePng?.length) return null;
  const baseDataUrl = `data:image/png;base64,${basePng.toString("base64")}`;
  return `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <image x="0" y="0" width="256" height="256" preserveAspectRatio="xMidYMid meet" href="${baseDataUrl}"/>
  ${notify}
</svg>`;
}

export function trayModeForPlatform(): TrayVisualMode {
  return "default";
}

/** Tinte de respaldo si solo hay PNG de app sin variante tray. */
export function applyTrayGreenTint(img: Electron.NativeImage): Electron.NativeImage {
  const WHATSAPP_GREEN_BGRA = { b: 102, g: 211, r: 37 } as const;
  const { width, height } = img.getSize();
  if (width <= 0 || height <= 0) return img;
  const bitmap = Buffer.from(img.toBitmap());
  for (let i = 0; i < bitmap.length; i += 4) {
    const b = bitmap[i]!;
    const g = bitmap[i + 1]!;
    const r = bitmap[i + 2]!;
    const a = bitmap[i + 3]!;
    if (a === 0) continue;
    if (a >= 64 && r > 160 && g < 120 && b < 120) continue;
    if (a >= 64 && r > 200 && g > 200 && b > 200) continue;
    bitmap[i] = WHATSAPP_GREEN_BGRA.b;
    bitmap[i + 1] = WHATSAPP_GREEN_BGRA.g;
    bitmap[i + 2] = WHATSAPP_GREEN_BGRA.r;
  }
  try {
    const rebuilt = nativeImage.createFromBitmap(bitmap, { width, height, scaleFactor: 1 });
    if (rebuilt.isEmpty()) return img;
    const png = rebuilt.toPNG();
    if (png?.length) return nativeImage.createFromBuffer(png);
    return rebuilt;
  } catch {
    return img;
  }
}

export function trayNativeImage(_mode: TrayVisualMode, badgeCount: number): Electron.NativeImage {
  let base = loadTrayBaseImage();
  if (!base) return nativeImage.createEmpty();

  if (process.platform !== "linux") {
    const fname = path.basename(
      ["tray-24.png", "tray-32.png", "256x256.png"].find((f) =>
        fs.existsSync(path.join(app.getAppPath(), "assets/icons", f)),
      ) || "",
    );
    if (fname === "256x256.png") {
      base = applyTrayGreenTint(base);
    }
  }

  const out = composeTrayWithBadge(base, badgeCount);
  if (!out.isEmpty()) return out;
  return nativeImage.createEmpty();
}
