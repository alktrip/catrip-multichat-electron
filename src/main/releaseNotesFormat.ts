/** Decodifica entidades HTML frecuentes. */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/** Convierte HTML/Markdown de GitHub a texto legible en `dialog.showMessageBox`. */
export function releaseNotesToPlainText(raw: string, maxLen = 2000): string {
  let s = (raw || "").trim();
  if (!s) return "";

  if (/<[a-z][\s\S]*>/i.test(s)) {
    s = s
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<h[1-6][^>]*>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<li[^>]*>/gi, "• ")
      .replace(/<\/tr>/gi, "\n")
      .replace(/<t[dh][^>]*>/gi, "")
      .replace(/<\/t[dh]>/gi, "\t")
      .replace(/<[^>]+>/g, "");
    s = decodeHtmlEntities(s);
  }

  s = s
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => `\n${String(code).trim()}\n`)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\|(.+)\|$/gm, (line) => line.replace(/\|/g, " · ").replace(/·\s*·/g, " · ").trim())
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (s.length > maxLen) {
    return `${s.slice(0, maxLen - 1)}…`;
  }
  return s;
}

/** Normaliza `releaseNotes` de electron-updater (string o array). */
export function normalizeReleaseNotesInput(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === "string") return item;
        if (item && typeof item === "object") {
          const note = (item as { note?: string }).note;
          const version = (item as { version?: string }).version;
          if (note && version) return `${version}\n${note}`;
          if (note) return note;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return "";
}

export function formatReleaseNotesForDialog(raw: unknown, maxLen = 2000): string {
  const normalized = normalizeReleaseNotesInput(raw);
  const plain = releaseNotesToPlainText(normalized, maxLen);
  return plain || "Sin notas de la versión.";
}

/** Texto completo para el diálogo con scroll (sin truncar). */
export function formatReleaseNotesForUpdateDialog(raw: unknown, maxLen = 12000): string {
  const normalized = normalizeReleaseNotesInput(raw);
  const plain = releaseNotesToPlainText(normalized, maxLen);
  return plain || "Sin notas de la versión.";
}

/** Resumen corto para diálogos nativos de respaldo cuando el renderer no está disponible. */
export function formatReleaseNotesBrief(raw: unknown, maxLen = 700): string {
  const normalized = normalizeReleaseNotesInput(raw);
  const plain = releaseNotesToPlainText(normalized, maxLen);
  return plain || "Sin notas de la versión.";
}

export function releaseNotesGithubUrl(version: string): string {
  const tag = version.startsWith("v") ? version : `v${version}`;
  return `https://github.com/alktrip/catrip-multichat-electron/releases/tag/${tag}`;
}
