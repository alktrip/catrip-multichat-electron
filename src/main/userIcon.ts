/**
 * Avatares de cuenta — estilo "monogram" con marca de agua del logo de la app.
 *
 * `getNewIconSvg(seed, label)` produce un SVG cuadrado de 256 × 256 con:
 *   1. Fondo: `<rect>` redondeado con `<linearGradient>` vertical de un tono
 *      derivado determinísticamente del `seed`.
 *   2. Marca de agua: el logo de la app (`assets/icons/org.k3p.catrip-multichat.svg`)
 *      embebido como `<image>` o como inner SVG, centrado, escalado al 70 %,
 *      con `feGaussianBlur` y opacidad baja → identidad de marca discreta.
 *      Recortado al rect redondeado con un `<clipPath>` para que nada
 *      sobresalga.
 *   3. Inicial: la primera letra de `label` en blanco, centrada, encima del
 *      logo. Es el elemento legible principal.
 *
 * Decisiones de diseño:
 *   - El color se calcula en HSL (vivo y controlado), pero se emite como
 *     `rgb(r, g, b)` en los `stop-color` del gradiente. Esto preserva el
 *     contrato que `extractAccountAccentRgb` espera del lado del renderer.
 *   - La marca de agua se aplica con `<feGaussianBlur>` y `opacity` bajos
 *     para no robar protagonismo a la inicial. Si el logo es un PNG embebido
 *     en el SVG fuente, el blur lo suaviza y oculta artefactos de píxeles.
 *   - Marcador `<!-- catrip-icon-v2 -->` para que `isLegacyIconSvg` pueda
 *     detectar avatares de versiones anteriores y forzar regeneración.
 *   - El logo se cachea en memoria en la primera lectura (~120 KB) para que
 *     no haya I/O por avatar generado.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { app, nativeImage } from "electron";

const ICON_VERSION_TAG = "<!-- catrip-icon-v3 -->";

/**
 * Tamaño al que reducimos el PNG del logo bundleado antes de embeberlo en
 * cada avatar. 64 × 64 es más que suficiente para una marca de agua
 * difuminada al 30 % de opacidad (en pantalla se renderiza a ~184 px y
 * `feGaussianBlur σ=2.5` oculta cualquier artefacto de escalado).
 *
 * Pasar de 256 × 256 (~120 KB en base64) a 64 × 64 (~5 KB) reduce el peso
 * de cada avatar ≈24×, y por extensión el de `accounts.json`.
 */
const LOGO_WATERMARK_PX = 64;

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function seededBytes(seed: string): Buffer {
  return crypto
    .createHash("sha256")
    .update(seed || "catrip")
    .digest();
}

function rgbCss(rgb: { r: number; g: number; b: number }) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/** Conversión HSL → RGB (algoritmo "fn_alt", referencia W3C CSS Color 4). */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sN = clamp01(s / 100);
  const lN = clamp01(l / 100);
  const k = (n: number) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n: number) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

/** Primera "letra" Unicode-aware del label, en mayúsculas. "?" como fallback. */
function getInitial(label: string): string {
  const trimmed = (label || "").trim();
  for (const ch of trimmed) {
    if (/[\p{L}\p{N}]/u.test(ch)) {
      const upper = ch.toUpperCase();
      const first = [...upper][0];
      return first ?? ch;
    }
  }
  return "?";
}

/** Escape mínimo para incrustar texto dentro de un nodo `<text>` SVG. */
function escapeXmlText(s: string): string {
  return s.replace(/[<>&]/g, (c) => (c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"));
}

/** Color base + variantes claro/oscuro derivadas, para fondo en gradiente. */
function paletteFromSeed(seed: string): {
  light: { r: number; g: number; b: number };
  dark: { r: number; g: number; b: number };
} {
  const bytes = seededBytes(seed);
  const hue = (((bytes[0] ?? 0) << 8) | (bytes[1] ?? 0)) % 360;
  const sat = 64 + ((bytes[2] ?? 0) % 16);
  const lum = 48 + ((bytes[3] ?? 0) % 10);
  return {
    light: hslToRgb(hue, sat, Math.min(72, lum + 10)),
    dark: hslToRgb(hue, sat, Math.max(34, lum - 8)),
  };
}

/**
 * Extrae el data URL del primer `<image href="…">` que encuentre en un SVG.
 * El logo de la app actualmente contiene un `<image>` con un PNG embebido en
 * base64; usar ese data URL directamente es más robusto que abrir un `<svg>`
 * anidado, especialmente con motores SVG que renderizan los SVGs internos
 * con coordenadas absolutas de forma inconsistente.
 */
function extractImageHref(svg: string): string | null {
  // Acepta tanto `href` como `xlink:href`. Búsqueda no exhaustiva, basta con
  // el primer match: el logo bundleado solo tiene una imagen.
  const m = /<image[\s\S]*?(?:xlink:)?href\s*=\s*"([^"]+)"/i.exec(svg);
  return m?.[1] ?? null;
}

/**
 * Si el SVG fuente no contiene un `<image>` (porque algún día se sustituye
 * por un logo vectorial), nos quedamos con el cuerpo entero como fallback,
 * que se inyectará como `<svg>` anidado. Cubre ambos casos.
 */
function extractSvgInner(svg: string): { viewBox: string; inner: string } | null {
  const start = svg.indexOf("<svg");
  const end = svg.lastIndexOf("</svg>");
  if (start === -1 || end === -1) return null;
  const openEnd = svg.indexOf(">", start);
  if (openEnd === -1) return null;
  const openTag = svg.slice(start, openEnd + 1);
  const m = /viewBox\s*=\s*"([^"]+)"/i.exec(openTag);
  const inner = svg.slice(openEnd + 1, end);
  return { viewBox: m?.[1] ?? "0 0 256 256", inner };
}

type CachedLogo = { kind: "image"; href: string } | { kind: "svg"; viewBox: string; inner: string };

let cachedLogo: CachedLogo | null = null;
let cachedLogoTried = false;

/**
 * Si el data URL es un PNG, lo decodificamos, lo redimensionamos a `target`
 * usando `nativeImage` (sin librerías externas) y devolvemos un nuevo data
 * URL con el resultado. Si el resampleo falla por cualquier motivo, devolvemos
 * el original.
 */
function shrinkPngDataUrl(dataUrl: string, target: number): string {
  const m = /^data:image\/png;base64,([\s\S]+)$/.exec(dataUrl);
  if (!m) return dataUrl;
  try {
    const buf = Buffer.from(m[1]!, "base64");
    const img = nativeImage.createFromBuffer(buf);
    if (img.isEmpty()) return dataUrl;
    const { width, height } = img.getSize();
    // Si ya es más pequeña que el objetivo, no reescalar (perdería calidad).
    if (width <= target && height <= target) return dataUrl;
    const resized = img.resize({ width: target, height: target, quality: "best" });
    return `data:image/png;base64,${resized.toPNG().toString("base64")}`;
  } catch (err) {
    console.warn("[userIcon] no se pudo redimensionar el PNG del logo:", err);
    return dataUrl;
  }
}

function getBundledLogo(): CachedLogo | null {
  if (cachedLogoTried) return cachedLogo;
  cachedLogoTried = true;
  try {
    const p = path.join(app.getAppPath(), "assets/icons/org.k3p.catrip-multichat.svg");
    if (!fs.existsSync(p)) {
      console.warn("[userIcon] logo bundleado no encontrado en", p);
      return null;
    }
    const raw = fs.readFileSync(p, "utf-8");
    const href = extractImageHref(raw);
    if (href) {
      const shrunk = shrinkPngDataUrl(href, LOGO_WATERMARK_PX);
      cachedLogo = { kind: "image", href: shrunk };
      return cachedLogo;
    }
    const inner = extractSvgInner(raw);
    if (inner) {
      cachedLogo = { kind: "svg", ...inner };
      return cachedLogo;
    }
    console.warn("[userIcon] logo bundleado no usable (sin <image> ni <svg>)");
    return null;
  } catch (err) {
    console.warn("[userIcon] error leyendo logo bundleado:", err);
    return null;
  }
}

/** Avatar SVG (monogram + marca de agua del logo) determinístico. */
export function getNewIconSvg(seed?: string, label?: string): string {
  const { light, dark } = paletteFromSeed(seed || "");
  const initial = escapeXmlText(getInitial(label || ""));

  const fontFamily =
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

  // Marca de agua: el logo se centra y se reduce al 72 % del avatar para
  // dejar respiración alrededor. Si el logo bundleado expone un `<image>`
  // PNG, lo emitimos como `<image>` directo (camino más robusto, evita
  // problemas conocidos de renderizado de `<svg>` anidados con `<image>`
  // dentro). Si el logo es vectorial, caemos a `<svg>` anidado.
  const logo = getBundledLogo();
  let watermark = "";
  if (logo) {
    const scale = 0.72;
    const size = 256 * scale;
    const offset = (256 - size) / 2; // 35.84
    const xy = offset.toFixed(2);
    const wh = size.toFixed(2);
    if (logo.kind === "image") {
      watermark = `
  <g clip-path="url(#iconClip)" filter="url(#watermarkBlur)" opacity="0.30">
    <image href="${logo.href}" x="${xy}" y="${xy}" width="${wh}" height="${wh}"
           preserveAspectRatio="xMidYMid meet" />
  </g>`;
    } else {
      watermark = `
  <g clip-path="url(#iconClip)" filter="url(#watermarkBlur)" opacity="0.30">
    <svg x="${xy}" y="${xy}" width="${wh}" height="${wh}"
         viewBox="${logo.viewBox}" preserveAspectRatio="xMidYMid meet">
      ${logo.inner}
    </svg>
  </g>`;
    }
  }

  return `<?xml version="1.0" encoding="utf-8"?>
${ICON_VERSION_TAG}
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${rgbCss(light)}" />
      <stop offset="1" stop-color="${rgbCss(dark)}" />
    </linearGradient>
    <clipPath id="iconClip">
      <rect x="0" y="0" width="256" height="256" rx="56" />
    </clipPath>
    <filter id="watermarkBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2.5" />
    </filter>
  </defs>
  <rect x="0" y="0" width="256" height="256" rx="56" fill="url(#bg)" />${watermark}
  <text x="128" y="128" text-anchor="middle" dominant-baseline="central"
        font-family="${fontFamily}" font-weight="700" font-size="128"
        fill="#ffffff" fill-opacity="0.96">${initial}</text>
</svg>`.trim();
}

/** Genera un set de variantes determinísticas (mínimo 1). */
export function getIconVariants(seed: string, count: number, label?: string): string[] {
  const n = Math.max(1, Math.min(24, Math.floor(count || 0)));
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(getNewIconSvg(`${seed}:${i}`, label));
  return out;
}

/** Detecta SVGs de versiones anteriores (logo embebido, sin `<text>` o sin
 *  el marcador `catrip-icon-v2`). */
export function isLegacyIconSvg(icon: string): boolean {
  if (!icon) return true;
  if (icon.startsWith("data:image/")) return true;
  if (!icon.includes("<svg")) return true;
  // El nuevo formato siempre incluye el marcador de versión y un nodo <text>.
  if (!icon.includes(ICON_VERSION_TAG)) return true;
  if (!icon.includes("<text")) return true;
  return false;
}
