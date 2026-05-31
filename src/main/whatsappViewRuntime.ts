import { app, type Session, type WebContents, type WebPreferences } from "electron";
import fs from "node:fs";
import path from "node:path";

/** Nivel de throttling para vistas WhatsApp en segundo plano. */
export type WhatsAppThrottleTier = "active" | "background" | "zen-background";

const sessionsCodeCacheConfigured = new WeakSet<Session>();

export function buildWhatsAppWebPreferences(session: Session): WebPreferences {
  return {
    session,
    contextIsolation: true,
    nodeIntegration: false,
    sandbox: true,
    spellcheck: false,
    backgroundThrottling: true,
    enableWebSQL: false,
  };
}

/** Cache V8 por partición: acelera recargas tras suspender una cuenta. */
export function ensureSessionCodeCache(session: Session, accountId: string): void {
  if (sessionsCodeCacheConfigured.has(session)) return;
  sessionsCodeCacheConfigured.add(session);
  try {
    const dir = path.join(app.getPath("userData"), "Code Cache", "whatsapp", accountId);
    fs.mkdirSync(dir, { recursive: true });
    session.setCodeCachePath(dir);
  } catch {
    /* ignore — Chromium usará su ruta por defecto */
  }
}

export function applyWhatsAppViewThrottle(wc: WebContents, tier: WhatsAppThrottleTier): void {
  if (wc.isDestroyed()) return;
  try {
    switch (tier) {
      case "active":
        wc.setBackgroundThrottling(false);
        wc.setFrameRate(60);
        break;
      case "background":
        wc.setBackgroundThrottling(true);
        wc.setFrameRate(4);
        break;
      case "zen-background":
        wc.setBackgroundThrottling(true);
        wc.setFrameRate(1);
        break;
    }
  } catch {
    /* ignore — API puede variar según versión de Electron */
  }
}

export function resolveBackgroundThrottleTier(zenMode: boolean): WhatsAppThrottleTier {
  return zenMode ? "zen-background" : "background";
}
