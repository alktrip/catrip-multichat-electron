/**
 * Réplica de `catrip_multichat/resources/TrayIcon.py` para generar el SVG
 * de la bandeja (tema default / simbólico claro u oscuro + badge).
 */

import { nativeImage, nativeTheme } from "electron";
import { Resvg } from "@resvg/resvg-js";

const TRAY_DEFAULT = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="linearGradient3062" x1="8.3581467" y1="52.194504" x2="59.375187" y2="52.027035" gradientUnits="userSpaceOnUse" gradientTransform="matrix(4.508297, 0, 0, 4.246757, -24.681, -11.662596)" xlink:href="#linearGradient3060"/>
    <linearGradient id="linearGradient3060">
      <stop style="stop-color:#c0bfbc;stop-opacity:0.96470588;" offset="0" id="stop3056"/>
      <stop style="stop-color:#f6f5f4;stop-opacity:0.96470588;" offset="0.1216" id="stop10456"/>
      <stop style="stop-color:#c0bfbc;stop-opacity:0.96470588;" offset="0.2415" id="stop10458"/>
      <stop style="stop-color:#c0bfbc;stop-opacity:0.96470588;" offset="0.7285" id="stop10462"/>
      <stop style="stop-color:#f6f5f4;stop-opacity:0.96470588;" offset="0.8621" id="stop10460"/>
      <stop style="stop-color:#c0bfbc;stop-opacity:0.96470588;" offset="1" id="stop3058"/>
    </linearGradient>
    <linearGradient id="linearGradient15564" x1="33.867146" y1="51.861328" x2="33.867188" y2="12.729865" gradientUnits="userSpaceOnUse" gradientTransform="matrix(4.983321, 0, 0, 4.727647, -41.268536, -31.905169)" xlink:href="#linearGradient15562"/>
    <linearGradient id="linearGradient15562">
      <stop style="stop-color:#209232;stop-opacity:1;" offset="0" id="stop15558"/>
      <stop style="stop-color:#34c640;stop-opacity:1;" offset="1" id="stop15560"/>
    </linearGradient>
  </defs>
  <g>
    <path id="path2070" style="fill:url(#linearGradient3062);fill-opacity:1;stroke-width:0.208431" d="M 128.002 26.343 C 64.49 26.343 13 74.843 13 134.672 C 13.017 153.149 18.051 171.315 27.624 187.442 L 21.594 210.626 C 19.428 210.337 17.492 211.924 17.496 213.986 L 17.529 227.037 L 17.529 227.326 C 17.528 227.407 17.528 227.487 17.529 227.568 L 17.531 228.353 C 17.537 228.636 17.58 228.917 17.659 229.19 C 18.598 236.612 26.261 241.976 33.767 240.465 L 76.764 231.606 C 92.679 239.085 110.217 242.985 128.002 243 C 191.515 243 243 194.5 243 134.672 C 243 74.843 191.515 26.343 128.002 26.343 Z"/>
    <path id="path1677" style="fill-opacity: 1; stroke: none; stroke-width: 0.1; stroke-dasharray: none; stroke-opacity: 1; fill: rgb(255, 255, 255);" d="M 128.001 13 C 64.489 13 13.001 61.499 13 121.327 C 13.017 139.805 18.052 157.971 27.625 174.099 L 19.029 207.142 L 17.868 211.603 C 15.571 220.429 24.404 229.05 33.767 227.121 C 33.767 227.121 33.768 227.121 33.768 227.121 L 76.764 218.261 C 92.678 225.741 110.216 229.641 128.001 229.656 C 191.514 229.656 243 181.155 242.999 121.327 C 242.999 61.499 191.513 13 128.001 13 Z"/>
    <path id="path333" style="fill:url(#linearGradient15564);fill-opacity:1;stroke:none;stroke-width:0.05;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1" d="M 127.502 28.277 C 96.599 28.287 67.525 42.2 49.149 65.773 L 132.045 69.714 L 30.239 114.682 C 30.088 116.71 30.008 118.743 30 120.777 C 30 171.864 73.653 213.277 127.502 213.277 C 162.586 213.271 194.96 195.384 212.279 166.438 L 129.545 162.504 L 225 120.342 C 224.75 69.428 181.17 28.279 127.502 28.277 Z"/>
  </g>
{notify}
</svg>
`;

const TRAY_SYMBOLIC = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <g id="layer1" transform="matrix(6.791338, 0, 0, 6.791338, 13.000002, 13.000012)">
    <path id="path-1" style="fill-opacity: 1; stroke: none; stroke-width: 0.0663829; stroke-dasharray: none; stroke-opacity: 1; fill: {color};" d="M 16.933333,5.7553998e-7 A 16.933245,16.933245 0 0 0 2.3333327e-7,16.933333 16.933245,16.933245 0 0 0 2.1534007,25.182072 l -1.26573497,5.1653 -0.17059912,0.697255 A 1.9466245,1.8017893 48.483562 0 0 3.0581261,33.470436 L 9.3890022,32.085281 A 16.933245,16.933245 0 0 0 16.933333,33.866666 16.933245,16.933245 0 0 0 33.866667,16.933333 16.933245,16.933245 0 0 0 16.933333,5.7553998e-7 Z M 16.933884,3.9446912 A 12.988273,12.988273 0 0 1 29.921425,16.872247 l -12.715134,5.920339 11.02015,0.551969 A 12.988273,12.988273 0 0 1 16.933884,29.921425 12.988273,12.988273 0 0 1 3.9452411,16.933333 12.988273,12.988273 0 0 1 3.9771597,16.077586 L 17.538685,9.7632198 6.4959724,9.2101487 A 12.988273,12.988273 0 0 1 16.933884,3.9446912 Z"/>
  </g>
{notify}
</svg>
`;

const BADGE_RECT = `
  <rect y="116.592" width="{width}" height="136.107" style="fill: rgb(255, 0, 0); stroke: rgb(255, 0, 0);" rx="19.653" ry="19.653" x="{x}"/>
  <text style="fill: rgb(255, 255, 255); font-family: Arial, sans-serif; font-size: 65.9885px; font-weight: 700; text-anchor: end; white-space: pre;" transform="matrix(2.154438, 0, 0, 1.833654, -279.152802, -210.015335)" x="244.638" y="238.631">{number}</text>
`;

export type TrayVisualMode = "default" | "symbolicLight" | "symbolicDark";

function notificationGeometry(qtd: number): { width: number; x: number } {
  const s = String(qtd);
  if (s.length === 1) return { width: 100.1, x: 152.6 };
  if (s.length === 2) return { width: 180.3, x: 72.5 };
  return { width: 249.428, x: 3.286 };
}

function badgeSvg(qtd: number): string {
  let n = Math.min(999, Math.max(0, Math.floor(qtd)));
  if (n <= 0) return "";
  const { width, x } = notificationGeometry(n);
  return BADGE_RECT.replace("{width}", String(width))
    .replace("{x}", String(x))
    .replace("{number}", String(n));
}

/** Igual que `TrayIcon.getIcon`: tema + contador de badge. */
export function buildTrayIconSvg(mode: TrayVisualMode, qtd: number): string {
  const notify = badgeSvg(qtd);
  if (mode === "default") {
    return TRAY_DEFAULT.replace("{notify}", notify);
  }
  const color = mode === "symbolicLight" ? "#ffffff" : "#241f31";
  return TRAY_SYMBOLIC.replace("{color}", color).replace("{notify}", notify);
}

/** Linux: pictograma monocromo según claridad del tema (bandejas claras/oscuras). Resto: burbuja en color. */
export function trayModeForPlatform(): TrayVisualMode {
  if (process.platform === "linux") {
    return nativeTheme.shouldUseDarkColors ? "symbolicLight" : "symbolicDark";
  }
  return "default";
}

export function trayNativeImage(mode: TrayVisualMode, badgeCount: number): Electron.NativeImage {
  const svg = buildTrayIconSvg(mode, badgeCount);
  // En algunos entornos Linux/Wayland, `createFromDataURL` puede devolver vacío.
  // Preferimos rasterizar SVG con resvg para garantizar un PNG válido.
  try {
    const r = new Resvg(svg, {
      fitTo: { mode: "width", value: 24 },
      font: { loadSystemFonts: false },
    });
    const png = r.render().asPng();
    const out = nativeImage.createFromBuffer(png);
    if (!out.isEmpty()) return out;
  } catch {
    // fallback abajo
  }

  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const img = nativeImage.createFromDataURL(url);
  if (img.isEmpty()) return nativeImage.createEmpty();

  // Linux: muchos trays no aceptan SVG como input “vivo” y muestran placeholder (…).
  // Forzamos raster (PNG) y devolvemos SIEMPRE un tamaño “panel” típico (GNOME: 24px).
  try {
    const rasterBase = nativeImage.createFromBuffer(img.toPNG());
    if (rasterBase.isEmpty()) return img;

    if (process.platform !== "linux") {
      const resized = rasterBase.resize({ width: 32, height: 32 });
      return resized.isEmpty() ? rasterBase : resized;
    }
    // 24px suele ser el tamaño esperado en GNOME; devolver una imagen no vacía y estable.
    const resized24 = rasterBase.resize({ width: 24, height: 24 });
    return resized24.isEmpty() ? rasterBase : resized24;
  } catch {
    return img;
  }
}
