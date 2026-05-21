import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { App } from "electron";

/** Misma ruta que `main.ts` fija con `app.setPath("userData", …)` en Linux. */
export function legacyUserDataDir(): string {
  const appData =
    process.env.XDG_CONFIG_HOME ||
    (process.platform === "darwin"
      ? path.join(os.homedir(), "Library", "Application Support")
      : path.join(os.homedir(), ".config"));
  return path.join(appData, "catrip_multichat_electron");
}

function readEarlyPerformanceSettings(): { rendererProcessLimit: number; gpuBoost: boolean } {
  const defaults = { rendererProcessLimit: 3, gpuBoost: false };
  try {
    const p = path.join(legacyUserDataDir(), "settings.json");
    if (!fs.existsSync(p)) return defaults;
    const parsed = JSON.parse(fs.readFileSync(p, "utf-8")) as {
      performance?: { rendererProcessLimit?: number; gpuBoost?: boolean };
    };
    const rawLimit = parsed?.performance?.rendererProcessLimit;
    const limit =
      typeof rawLimit === "number" && Number.isFinite(rawLimit) && rawLimit >= 0 && rawLimit <= 20
        ? Math.floor(rawLimit)
        : defaults.rendererProcessLimit;
    return {
      rendererProcessLimit: limit,
      gpuBoost: parsed?.performance?.gpuBoost === true,
    };
  } catch {
    return defaults;
  }
}

/**
 * Flags de Chromium que deben aplicarse antes de `require("./main")`.
 * - Respeta `CATRIP_DISABLE_GPU=1` (sin aceleración).
 * - Lee `performance.rendererProcessLimit` y `performance.gpuBoost` de settings.json.
 * - `CATRIP_GPU_BOOST=1` fuerza el perfil reforzado aunque el ajuste esté desactivado.
 */
export function applyChromiumLaunchSwitches(app: App): void {
  if (process.env.CATRIP_DISABLE_GPU === "1") {
    app.disableHardwareAcceleration();
    return;
  }

  const envBoost = process.env.CATRIP_GPU_BOOST === "1";
  const { rendererProcessLimit, gpuBoost } = readEarlyPerformanceSettings();
  const boost = envBoost || gpuBoost;

  const features: string[] = [];
  if (process.platform === "linux") {
    // Vídeo/llamadas en WhatsApp Web: decodificación por GPU (VA-API) cuando el driver lo permite.
    features.push("VaapiVideoDecoder");
    if (boost) features.push("VaapiIgnoreDriverChecks");
  }

  if (features.length > 0) {
    app.commandLine.appendSwitch("enable-features", features.join(","));
  }

  // Rasterización en GPU (texto/UI de Chromium); perfil equilibrado siempre que la GPU esté activa.
  app.commandLine.appendSwitch("enable-gpu-rasterization");

  if (boost) {
    app.commandLine.appendSwitch("enable-zero-copy");
    app.commandLine.appendSwitch("ignore-gpu-blocklist");
  }

  const ozone = process.env.CATRIP_OZONE_PLATFORM;
  if (ozone === "wayland" || ozone === "x11") {
    app.commandLine.appendSwitch("ozone-platform", ozone);
  }

  if (rendererProcessLimit > 0) {
    app.commandLine.appendSwitch("renderer-process-limit", String(rendererProcessLimit));
  }
}
