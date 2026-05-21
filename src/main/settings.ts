import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

export type Settings = {
  version: 1;
  performance: {
    rendererProcessLimit: number; // 0 = default
  };
  network: {
    proxyEnabled: boolean;
    proxyRules: string; // e.g. "http=host:port;https=host:port"
  };
  general: {
    startMinimized: boolean;
    showSidebar: boolean;
    showMenuBar: boolean;
    /** Persistencia del modo Zen entre arranques. */
    zen: boolean;
    /** Último tamaño/posición de ventana. `null` = usar defaults. */
    windowBounds: { x: number; y: number; width: number; height: number } | null;
    /** True si la ventana estaba maximizada al cerrar. */
    windowMaximized: boolean;
    /** Carpeta de descargas (vacío/null = usar la del sistema). */
    downloadsDirectory: string | null;
    /** Si true, preguntar siempre “Guardar como…”. */
    downloadsAskSaveAs: boolean;
    /** Si true, cerrar (X) oculta en tray en vez de salir. */
    closeToTray: boolean;
    /** Autoinicio al iniciar sesión del usuario. */
    autoStart: boolean;
    /** Si true, se intenta leer mensajes no leídos desde WhatsApp Web para el badge del tray. */
    trayUnreadBadge: boolean;
    /** Si es un número, fija el badge (pruebas); `null` = usar detección / IPC. */
    trayBadgeManual: number | null;
    /** Escala UI (zoom factor). 1.0 = 100%. */
    uiScale: number;
    /**
     * Cuenta para enlaces `whatsapp://` / `wa.me` entrantes.
     * - `auto`: una sola cuenta → esa; varias → diálogo de elección.
     * - `active`: siempre la cuenta activa.
     * - `fixed`: usar `incomingLinkFixedAccountId`.
     */
    incomingLinkMode: "auto" | "active" | "fixed";
    /** Id de cuenta cuando `incomingLinkMode` es `fixed`. */
    incomingLinkFixedAccountId: string | null;
    /** Si true, buscar actualizaciones al publicar releases en GitHub (app empaquetada). */
    checkForUpdates: boolean;
  };
  notifications: {
    enabled: boolean;
    /** Mostrar el nombre de la cuenta en el título de notificación. */
    showAccountName: boolean;
    /** Mostrar texto detallado (p. ej. contador) en el cuerpo. */
    showPreview: boolean;
  };
};

const DEFAULTS: Settings = {
  version: 1,
  performance: { rendererProcessLimit: 3 },
  network: { proxyEnabled: false, proxyRules: "" },
  general: {
    startMinimized: false,
    showSidebar: true,
    showMenuBar: true,
    zen: false,
    windowBounds: null,
    windowMaximized: false,
    downloadsDirectory: null,
    downloadsAskSaveAs: false,
    closeToTray: true,
    autoStart: false,
    trayUnreadBadge: true,
    trayBadgeManual: null,
    uiScale: 1,
    incomingLinkMode: "auto",
    incomingLinkFixedAccountId: null,
    checkForUpdates: true,
  },
  notifications: { enabled: true, showAccountName: true, showPreview: true },
};

function settingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

export function loadSettings(): Settings {
  try {
    const p = settingsPath();
    if (!fs.existsSync(p)) return structuredClone(DEFAULTS);
    const raw = fs.readFileSync(p, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Settings>;
    if (parsed?.version !== 1) return structuredClone(DEFAULTS);
    return {
      version: 1,
      performance: {
        rendererProcessLimit:
          typeof parsed.performance?.rendererProcessLimit === "number"
            ? parsed.performance.rendererProcessLimit
            : DEFAULTS.performance.rendererProcessLimit,
      },
      network: {
        proxyEnabled:
          typeof parsed.network?.proxyEnabled === "boolean"
            ? parsed.network.proxyEnabled
            : DEFAULTS.network.proxyEnabled,
        proxyRules:
          typeof parsed.network?.proxyRules === "string"
            ? parsed.network.proxyRules
            : DEFAULTS.network.proxyRules,
      },
      general: {
        startMinimized:
          typeof parsed.general?.startMinimized === "boolean"
            ? parsed.general.startMinimized
            : DEFAULTS.general.startMinimized,
        showSidebar:
          typeof parsed.general?.showSidebar === "boolean"
            ? parsed.general.showSidebar
            : DEFAULTS.general.showSidebar,
        showMenuBar:
          typeof parsed.general?.showMenuBar === "boolean"
            ? parsed.general.showMenuBar
            : DEFAULTS.general.showMenuBar,
        zen: typeof parsed.general?.zen === "boolean" ? parsed.general.zen : DEFAULTS.general.zen,
        windowBounds: (() => {
          const b: any = (parsed.general as any)?.windowBounds;
          if (!b) return DEFAULTS.general.windowBounds;
          const x = Number(b.x);
          const y = Number(b.y);
          const w = Number(b.width);
          const h = Number(b.height);
          if (![x, y, w, h].every((n) => Number.isFinite(n))) return DEFAULTS.general.windowBounds;
          // límites conservadores para evitar restauraciones absurdas.
          const width = Math.max(640, Math.min(8192, Math.floor(w)));
          const height = Math.max(480, Math.min(8192, Math.floor(h)));
          return { x: Math.floor(x), y: Math.floor(y), width, height };
        })(),
        windowMaximized:
          typeof (parsed.general as any)?.windowMaximized === "boolean"
            ? (parsed.general as any).windowMaximized
            : DEFAULTS.general.windowMaximized,
        downloadsDirectory:
          typeof (parsed.general as any)?.downloadsDirectory === "string"
            ? (parsed.general as any).downloadsDirectory
            : DEFAULTS.general.downloadsDirectory,
        downloadsAskSaveAs:
          typeof (parsed.general as any)?.downloadsAskSaveAs === "boolean"
            ? (parsed.general as any).downloadsAskSaveAs
            : DEFAULTS.general.downloadsAskSaveAs,
        closeToTray:
          typeof (parsed.general as any)?.closeToTray === "boolean"
            ? (parsed.general as any).closeToTray
            : DEFAULTS.general.closeToTray,
        autoStart:
          typeof (parsed.general as any)?.autoStart === "boolean"
            ? (parsed.general as any).autoStart
            : DEFAULTS.general.autoStart,
        trayUnreadBadge:
          typeof parsed.general?.trayUnreadBadge === "boolean"
            ? parsed.general.trayUnreadBadge
            : DEFAULTS.general.trayUnreadBadge,
        trayBadgeManual:
          parsed.general?.trayBadgeManual === null || parsed.general?.trayBadgeManual === undefined
            ? DEFAULTS.general.trayBadgeManual
            : typeof parsed.general.trayBadgeManual === "number"
              ? parsed.general.trayBadgeManual
              : DEFAULTS.general.trayBadgeManual,
        uiScale: (() => {
          const raw: any = (parsed.general as any)?.uiScale;
          const n = typeof raw === "number" ? raw : Number(raw);
          if (!Number.isFinite(n)) return DEFAULTS.general.uiScale;
          return Math.max(0.75, Math.min(2, n));
        })(),
        incomingLinkMode: (() => {
          const m = (parsed.general as any)?.incomingLinkMode;
          if (m === "active" || m === "fixed" || m === "auto") return m;
          return DEFAULTS.general.incomingLinkMode;
        })(),
        incomingLinkFixedAccountId:
          typeof (parsed.general as any)?.incomingLinkFixedAccountId === "string"
            ? (parsed.general as any).incomingLinkFixedAccountId
            : DEFAULTS.general.incomingLinkFixedAccountId,
        checkForUpdates:
          typeof (parsed.general as any)?.checkForUpdates === "boolean"
            ? (parsed.general as any).checkForUpdates
            : DEFAULTS.general.checkForUpdates,
      },
      notifications: {
        enabled:
          typeof parsed.notifications?.enabled === "boolean"
            ? parsed.notifications.enabled
            : DEFAULTS.notifications.enabled,
        showAccountName:
          typeof (parsed.notifications as any)?.showAccountName === "boolean"
            ? (parsed.notifications as any).showAccountName
            : DEFAULTS.notifications.showAccountName,
        showPreview:
          typeof (parsed.notifications as any)?.showPreview === "boolean"
            ? (parsed.notifications as any).showPreview
            : DEFAULTS.notifications.showPreview,
      },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function saveSettings(s: Settings) {
  const p = settingsPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(s, null, 2), "utf-8");
}
