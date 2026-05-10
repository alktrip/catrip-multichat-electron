/**
 * Generador del icono del system tray para Catrip Connect.
 *
 * Estrategia visual (versión actual):
 *   - El logo propio de la app (`assets/icons/org.k3p.catrip-multichat.svg`,
 *     que internamente es un PNG 256×256 codificado en base64) es la **única**
 *     fuente de arte para el tray, en TODAS las plataformas (Windows, macOS,
 *     Linux GNOME/KDE/Cinnamon).
 *   - Encima se compone, opcionalmente, un badge numérico rojo en la esquina
 *     inferior derecha cuando hay mensajes sin leer.
 *
 * Histórico:
 *   Versiones anteriores incluían dos pictogramas vectoriales heredados
 *   (`TRAY_DEFAULT` con burbuja de chat verde + bezel y `TRAY_SYMBOLIC` con
 *   silueta monocroma para paneles claros/oscuros) tomados de un proyecto
 *   previo. Esos paths fueron eliminados por completo del repo para que la
 *   app dependa exclusivamente de su propio arte.
 *
 * Si por algún motivo el logo no se pudiera leer desde disco,
 * `trayNativeImage` devuelve `nativeImage.createEmpty()` y el llamador en
 * `main.ts` cae a `getAppIconNativeImage()` (que carga el mismo SVG por otra
 * vía).
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { app, nativeImage } from "electron";
import { Resvg } from "@resvg/resvg-js";

/**
 * Plantilla mínima: solo el logo (vía `<image>`) + el badge numérico opcional.
 * El badge se inyecta en `{notify}`; el logo en `{logo}`.
 */
const TRAY_LOGO_TEMPLATE = `<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
{logo}
{notify}
</svg>
`;

/**
 * Badge numérico (mensajes sin leer).
 *
 * Diseño:
 *   - Pastilla roja (`#dc2626`) con esquinas muy redondeadas; círculo perfecto
 *     cuando es un solo dígito.
 *   - Borde blanco de 8 px (≈0.75 px en el render final a 24 px) para que
 *     destaque sobre cualquier color del logo subyacente.
 *   - Posicionado en el cuadrante inferior derecho con margen de 10 px,
 *     ocupando ~31 % del lienzo (mucho menos que el badge anterior, que
 *     tapaba prácticamente media imagen).
 *   - El texto se centra horizontalmente con `text-anchor="middle"` y la
 *     línea base se calcula manualmente (`cy + fontSize * 0.35`) porque
 *     `dominant-baseline` no es 100 % portable entre rasterizadores.
 */
const BADGE_TEMPLATE = `
  <g>
    <rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{r}" ry="{r}" fill="#dc2626" stroke="#ffffff" stroke-width="8"/>
    <text x="{cx}" y="{ty}" font-family="Arial, Helvetica, sans-serif" font-size="{fontSize}" font-weight="800" fill="#ffffff" text-anchor="middle">{number}</text>
  </g>
`;

/**
 * Tipo público mantenido por compatibilidad con los call sites de `main.ts`.
 * Hoy solo existe un modo (`"default"`); los modos `symbolic*` se eliminaron
 * junto con el arte heredado.
 */
export type TrayVisualMode = "default";

/**
 * Calcula la geometría del badge en el lienzo 256×256 según el número de
 * dígitos del contador. Devuelve también la posición de la línea base del
 * texto (`ty`) para no depender de `dominant-baseline`.
 */
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

/**
 * Lee el logo Catrip Connect del filesystem una sola vez y devuelve el
 * fragmento `<image …/>` listo para incrustar en otro SVG con
 * `viewBox="0 0 256 256"`. Si el archivo no está o no contiene `<image>`,
 * cachea `null` para evitar reintentos.
 */
type LogoCacheState = { tag: string | null };
let logoCache: LogoCacheState | null = null;
function getAppLogoImageTag(): string | null {
  if (logoCache) return logoCache.tag;
  let tag: string | null = null;
  try {
    const p = path.join(app.getAppPath(), "assets/icons/org.k3p.catrip-multichat.svg");
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const m = raw.match(/href\s*=\s*["'](data:image\/[^"']+)["']/);
      if (m) {
        tag =
          `<image x="0" y="0" width="256" height="256" ` +
          `preserveAspectRatio="xMidYMid meet" href="${m[1]}"/>`;
      }
    }
  } catch {
    tag = null;
  }
  logoCache = { tag };
  return tag;
}

/**
 * Construye el SVG del tray (logo + badge opcional). Devuelve `null` si el
 * logo no se pudo cargar para que el llamador pueda aplicar un fallback.
 */
export function buildTrayIconSvg(_mode: TrayVisualMode, qtd: number): string | null {
  const logoTag = getAppLogoImageTag();
  if (!logoTag) return null;
  const notify = badgeSvg(qtd);
  return TRAY_LOGO_TEMPLATE.replace("{logo}", logoTag).replace("{notify}", notify);
}

/**
 * Catrip Connect usa la misma imagen (logo a color) en todas las plataformas.
 * Se mantiene este helper para no tocar los call sites de `main.ts` que
 * antes lo usaban para distinguir entre `default` y los modos simbólicos.
 */
export function trayModeForPlatform(): TrayVisualMode {
  return "default";
}

export function trayNativeImage(mode: TrayVisualMode, badgeCount: number): Electron.NativeImage {
  const svg = buildTrayIconSvg(mode, badgeCount);
  if (!svg) return nativeImage.createEmpty();

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

  // Linux: muchos trays no aceptan SVG como input "vivo" y muestran placeholder (…).
  // Forzamos raster (PNG) y devolvemos SIEMPRE un tamaño "panel" típico (GNOME: 24px).
  try {
    const rasterBase = nativeImage.createFromBuffer(img.toPNG());
    if (rasterBase.isEmpty()) return img;

    if (process.platform !== "linux") {
      const resized = rasterBase.resize({ width: 32, height: 32 });
      return resized.isEmpty() ? rasterBase : resized;
    }
    // 24 px suele ser el tamaño esperado en GNOME.
    const resized24 = rasterBase.resize({ width: 24, height: 24 });
    return resized24.isEmpty() ? rasterBase : resized24;
  } catch {
    return img;
  }
}
