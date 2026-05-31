import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { App } from "electron";

/** Perfil de flags Chromium al arrancar (requiere reinicio). */
export type ChromiumProfile = "default" | "conservative" | "aggressive";

/** Backend gráfico en Linux (`auto` detecta Wayland/X11 al arrancar). */
export type OzonePlatformSetting = "auto" | "wayland" | "x11";

export type EarlyPerformanceSettings = {
  rendererProcessLimit: number;
  gpuBoost: boolean;
  chromiumProfile: ChromiumProfile;
  ozonePlatform: OzonePlatformSetting;
};

/** Misma ruta que `main.ts` fija con `app.setPath("userData", …)` en Linux. */
export function legacyUserDataDir(): string {
  const appData =
    process.env.XDG_CONFIG_HOME ||
    (process.platform === "darwin"
      ? path.join(os.homedir(), "Library", "Application Support")
      : path.join(os.homedir(), ".config"));
  return path.join(appData, "catrip_multichat_electron");
}

function normalizeChromiumProfile(raw: unknown): ChromiumProfile {
  if (raw === "conservative" || raw === "aggressive" || raw === "default") return raw;
  return "default";
}

function normalizeOzonePlatform(raw: unknown): OzonePlatformSetting {
  if (raw === "wayland" || raw === "x11" || raw === "auto") return raw;
  return "auto";
}

function readEarlyPerformanceSettings(): EarlyPerformanceSettings {
  const defaults: EarlyPerformanceSettings = {
    rendererProcessLimit: 3,
    gpuBoost: false,
    chromiumProfile: "default",
    ozonePlatform: "auto",
  };
  try {
    const p = path.join(legacyUserDataDir(), "settings.json");
    if (!fs.existsSync(p)) return defaults;
    const parsed = JSON.parse(fs.readFileSync(p, "utf-8")) as {
      performance?: {
        rendererProcessLimit?: number;
        gpuBoost?: boolean;
        chromiumProfile?: unknown;
        ozonePlatform?: unknown;
      };
    };
    const perf = parsed?.performance;
    const rawLimit = perf?.rendererProcessLimit;
    const limit =
      typeof rawLimit === "number" && Number.isFinite(rawLimit) && rawLimit >= 0 && rawLimit <= 20
        ? Math.floor(rawLimit)
        : defaults.rendererProcessLimit;
    return {
      rendererProcessLimit: limit,
      gpuBoost: perf?.gpuBoost === true,
      chromiumProfile: normalizeChromiumProfile(perf?.chromiumProfile),
      ozonePlatform: normalizeOzonePlatform(perf?.ozonePlatform),
    };
  } catch {
    return defaults;
  }
}

/** Perfil efectivo: `gpuBoost` legacy eleva a agresivo si el perfil sigue en default. */
export function resolveEffectiveChromiumProfile(
  perf: Pick<EarlyPerformanceSettings, "gpuBoost" | "chromiumProfile">,
): ChromiumProfile {
  if (perf.chromiumProfile !== "default") return perf.chromiumProfile;
  if (perf.gpuBoost) return "aggressive";
  return "default";
}

/**
 * Detecta el backend Ozone en Linux.
 * Prioridad: `CATRIP_OZONE_PLATFORM` → ajuste guardado → heurística de entorno.
 */
export function resolveOzonePlatform(
  ozoneSetting: OzonePlatformSetting = "auto",
): "wayland" | "x11" | null {
  if (process.platform !== "linux") return null;

  const envOzone = process.env.CATRIP_OZONE_PLATFORM;
  if (envOzone === "wayland" || envOzone === "x11") return envOzone;

  if (ozoneSetting === "wayland" || ozoneSetting === "x11") return ozoneSetting;

  const sessionType = (process.env.XDG_SESSION_TYPE || "").toLowerCase();
  const desktop = (process.env.XDG_CURRENT_DESKTOP || "").toLowerCase();
  const onWaylandSession = sessionType === "wayland";
  const hasWayland = !!process.env.WAYLAND_DISPLAY;
  const hasX11 = !!process.env.DISPLAY;

  if (onWaylandSession || (hasWayland && !hasX11)) return "wayland";
  if (hasWayland && hasX11) {
    // Sesión híbrida (XWayland): preferir Wayland en compositors modernos.
    if (desktop.includes("gnome") || desktop.includes("kde") || onWaylandSession) {
      return "wayland";
    }
  }
  if (hasX11) return "x11";
  if (hasWayland) return "wayland";
  return null;
}

/**
 * Flags de Chromium que deben aplicarse antes de `require("./main")`.
 * - Respeta `CATRIP_DISABLE_GPU=1` (sin aceleración).
 * - Lee `performance.*` de settings.json.
 * - `CATRIP_GPU_BOOST=1` fuerza perfil agresivo aunque el ajuste esté desactivado.
 */
export function applyChromiumLaunchSwitches(app: App): void {
  if (process.env.CATRIP_DISABLE_GPU === "1") {
    app.disableHardwareAcceleration();
    return;
  }

  const envBoost = process.env.CATRIP_GPU_BOOST === "1";
  const early = readEarlyPerformanceSettings();
  const profile = envBoost ? "aggressive" : resolveEffectiveChromiumProfile(early);

  const enableFeatures: string[] = [];
  const disableFeatures: string[] = [];

  if (profile === "conservative") {
    if (early.rendererProcessLimit > 0) {
      app.commandLine.appendSwitch("renderer-process-limit", String(early.rendererProcessLimit));
    }
    applyOzonePlatform(app, early.ozonePlatform);
    return;
  }

  if (process.platform === "linux") {
    enableFeatures.push("VaapiVideoDecoder");
    if (profile === "default") {
      enableFeatures.push("VaapiVideoMinResolutionForAcceleratedDecodeFilters");
    }
    if (profile === "aggressive") {
      enableFeatures.push("VaapiIgnoreDriverChecks");
      enableFeatures.push("CanvasOopRasterization");
      disableFeatures.push("SpareRendererForSitePerProcess");
      app.commandLine.appendSwitch("enable-zero-copy");
      app.commandLine.appendSwitch("ignore-gpu-blocklist");
      app.commandLine.appendSwitch("enable-accelerated-video-decode");
    }
  }

  if (profile === "default" && process.platform === "linux") {
    app.commandLine.appendSwitch("enable-accelerated-video-decode");
  }

  if (enableFeatures.length > 0) {
    app.commandLine.appendSwitch("enable-features", enableFeatures.join(","));
  }
  if (disableFeatures.length > 0) {
    app.commandLine.appendSwitch("disable-features", disableFeatures.join(","));
  }

  app.commandLine.appendSwitch("enable-gpu-rasterization");

  if (early.rendererProcessLimit > 0) {
    app.commandLine.appendSwitch("renderer-process-limit", String(early.rendererProcessLimit));
  }

  applyOzonePlatform(app, early.ozonePlatform);
}

function applyOzonePlatform(app: App, ozoneSetting: OzonePlatformSetting): void {
  const resolved = resolveOzonePlatform(ozoneSetting);
  if (resolved) {
    app.commandLine.appendSwitch("ozone-platform", resolved);
  }
}
