/**
 * Extrae el color "ambiental" de una cuenta a partir de su icono SVG generado
 * por `getNewIconSvg()` en el proceso main. Buscamos los `stop-color` del
 * `linearGradient` con `id="bg"`, que son los dos `rgb(r, g, b)` que
 * componen el cuadrado de fondo del avatar.
 *
 * Devuelve un string con la triada `"r g b"` (sin paréntesis ni comas) lista
 * para inyectar en una variable CSS y usarla con sintaxis funcional moderna,
 * por ejemplo: `rgb(var(--catrip-accent-rgb) / 0.7)`.
 *
 * Si el icono no es un SVG generado por nosotros (por ejemplo, un PNG
 * embebido o un SVG legado) devolvemos `null` para que el CSS use el verde
 * de marca como fallback.
 *
 * Coste: dos regex sobre el string del SVG. ~5 cuentas × 2 regex = irrelevante.
 */
type Rgb = { r: number; g: number; b: number };

function parseStop(icon: string, offset: "0" | "1"): Rgb | null {
  const re = new RegExp(
    `<stop[^>]*offset="${offset}"[^>]*stop-color="rgb\\((\\d+),\\s*(\\d+),\\s*(\\d+)\\)"`,
    "i",
  );
  const m = re.exec(icon);
  if (!m) return null;
  return { r: +m[1]!, g: +m[2]!, b: +m[3]! };
}

function clamp255(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Mezcla dos colores con proporción `t` (0 = a, 1 = b). */
function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return {
    r: clamp255(a.r + (b.r - a.r) * t),
    g: clamp255(a.g + (b.g - a.g) * t),
    b: clamp255(a.b + (b.b - a.b) * t),
  };
}

/**
 * Empuja un color hacia su versión más saturada / luminosa para que el halo
 * tenga "presencia" sobre el fondo oscuro del rail. Sin esto, los avatares
 * cuyo gradiente nace de tonos pastel quedan con halos casi invisibles.
 *
 * Implementación rápida en RGB (no necesitamos exactitud de HSL):
 *   1) Si el color es muy desaturado (canal max ≈ canal min), lo empujamos
 *      ligeramente hacia el verde de marca para que destaque.
 *   2) Subimos los canales un 10 % hacia 255 para forzar luminancia mínima.
 */
function vivify(color: Rgb): Rgb {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  const range = max - min;
  // Casi gris: aporta un toque del verde de marca para evitar halo "lavado".
  let pivot: Rgb = color;
  if (range < 30) pivot = mix(color, { r: 33, g: 192, b: 99 }, 0.35);
  return mix(pivot, { r: 255, g: 255, b: 255 }, 0.1);
}

/** Devuelve el accent listo para CSS, o `null` si no se pudo extraer. */
export function extractAccountAccentRgb(icon: string | undefined): string | null {
  if (!icon || icon.startsWith("data:image/")) return null;
  const a = parseStop(icon, "0");
  const b = parseStop(icon, "1");
  if (!a && !b) return null;
  const base = a && b ? mix(a, b, 0.5) : (a ?? b!);
  const accent = vivify(base);
  return `${accent.r} ${accent.g} ${accent.b}`;
}
