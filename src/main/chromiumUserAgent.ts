/** Fondo de carga de WhatsApp Web (tema oscuro nativo). */
export const WHATSAPP_VIEW_BG = "#111b21";

/**
 * User-Agent alineado con la versión real de Chromium embebida en Electron.
 * WhatsApp Web puede servir bundles distintos según la versión del navegador.
 */
export function buildWhatsAppWebUserAgent(chromeVersion: string = process.versions.chrome): string {
  const chrome = chromeVersion.trim() || "134.0.0.0";
  const platform =
    process.platform === "darwin"
      ? "Macintosh; Intel Mac OS X 10_15_7"
      : process.platform === "win32"
        ? "Windows NT 10.0; Win64; x64"
        : `X11; Linux ${process.arch === "arm64" ? "aarch64" : "x86_64"}`;
  const archHint = process.platform === "linux" && process.arch === "arm64" ? "; ARM64" : "";
  return `Mozilla/5.0 (${platform}${archHint}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chrome} Safari/537.36`;
}
