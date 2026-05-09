import {
  app,
  BaseWindow,
  BrowserWindow,
  dialog,
  Menu,
  Notification,
  Tray,
  WebContentsView,
  ipcMain,
  nativeImage,
  nativeTheme,
  shell,
} from "electron";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import {
  createAccount,
  ensureElectronSessionForAccount,
  loadAccountsState,
  regenerateAccountIcon,
  saveAccountsState,
  type Account,
} from "./accounts";
import { loadSettings, saveSettings, type Settings } from "./settings";
import { trayModeForPlatform, trayNativeImage } from "./trayIcon";
import { createLinuxSniTray, type LinuxSniTrayHandle } from "./linuxSniTray";

// Linux (GNOME/Wayland): `Tray` de Electron puede registrar `chrome_status_icon_1` sin IconPixmap,
// lo que acaba en placeholder (“...”). `systray2` usa un binario Go y evita ese camino.
// Se carga con require (CommonJS) solo cuando hace falta.
type SysTray2 = {
  ready(): Promise<void>;
  onClick(listener: (action: { type: "clicked"; item: { __id: number } }) => void): Promise<unknown>;
  sendAction(action: { type: "update-menu"; menu: any } | { type: "exit" }): Promise<unknown>;
  kill(exitNode?: boolean): Promise<void>;
  onExit(listener: (code: number | null, signal: string | null) => void): void;
  onError(listener: (err: Error) => void): void;
  readonly binPath?: string;
  readonly killed?: boolean;
};

function ensureSystray2LinuxBinPresent() {
  if (process.platform !== "linux") return;
  try {
    const systrayEntry = require.resolve("systray2");
    const systrayDir = path.dirname(systrayEntry);
    const traybin = path.join(systrayDir, "traybin");
    const wanted = path.join(traybin, "tray_linux");
    const release = path.join(traybin, "tray_linux_release");

    // Si estamos en debug (CATRIP_DEBUG_SYSTRAY2=1), systray2 busca tray_linux (sin _release).
    // Creamos symlink/copia para que exista.
    if (!fs.existsSync(wanted) && fs.existsSync(release)) {
      try {
        fs.symlinkSync(release, wanted);
      } catch {
        try {
          fs.copyFileSync(release, wanted);
        } catch {
          // ignore
        }
      }
    }
    // Asegurar permisos de ejecución.
    for (const p of [wanted, release]) {
      if (fs.existsSync(p)) {
        try {
          fs.chmodSync(p, 0o755);
        } catch {
          // ignore
        }
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Diagnóstico temporal: vista embebida no visible.
 * Activo en desarrollo (`!app.isPackaged`) salvo `CATRIP_DEBUG_EMBED=0`.
 * Build empaquetado: solo si `CATRIP_DEBUG_EMBED=1`.
 */
function dbgEmbed(...parts: unknown[]) {
  if (process.env.CATRIP_DEBUG_EMBED === "0") return;
  if (app.isPackaged && process.env.CATRIP_DEBUG_EMBED !== "1") return;
  console.log("[catrip-embed]", new Date().toISOString(), ...parts);
}

/** Si es `1`, desactiva aceleración por GPU antes de `ready` (algunos drivers Linux/Wayland + ventana transparente dejan WebContentsView en negro). */
if (process.env.CATRIP_DISABLE_GPU === "1") {
  app.disableHardwareAcceleration();
}

const APP_NAME = "catrip_multichat_electron";
const WHATSAPP_URL = "https://web.whatsapp.com/";
const WHATSAPP_SEND_URL = "https://web.whatsapp.com/send?phone=";

function isWhatsAppUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return url.origin === "https://web.whatsapp.com";
  } catch {
    return false;
  }
}

/** Intenta abrir el flujo "nuevo chat" en WhatsApp Web (DOM cambiante; tolerante a varios idiomas). */
const WHATSAPP_NEW_CHAT_JS = `(() => {
  try {
    const patterns = [
      /^new chat$/i,
      /^nuevo chat$/i,
      /^nova conversa/i,
      /^nouvelle conversation/i,
      /^neuer chat$/i,
      /^nuova chat$/i,
      /^새 채팅$/,
      /^新規チャット$/,
    ];
    const nodes = document.querySelectorAll('button, [role="button"]');
    for (const el of nodes) {
      const t = (el.getAttribute("aria-label") || el.getAttribute("title") || "").trim();
      if (!t) continue;
      if (patterns.some((re) => re.test(t))) {
        el.click();
        return true;
      }
    }
    const icon = document.querySelector('[data-icon="chat"], [data-icon="compose"], [data-icon="new-chat-outline"]');
    if (icon) {
      const btn = icon.closest("button") || icon.closest('[role="button"]');
      if (btn) {
        btn.click();
        return true;
      }
    }
    return false;
  } catch (_e) {
    return false;
  }
})()`;

/** Evaluado en el BrowserView de WhatsApp Web: H.264/AAC y MediaCapabilities (misma pila que el chat). */
const WHATSAPP_MEDIA_DIAG_JS = `
(async function catripMediaDiag() {
  var out = {
    userAgent: navigator.userAgent,
    hasMediaSource: typeof MediaSource !== "undefined",
    hasMediaCapabilities: !!(navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo),
    mediaSourceIsTypeSupported: {},
  };
  var mimeChecks = [
    'video/mp4; codecs="avc1.42E01E"',
    'video/mp4; codecs="avc1.4d401f"',
    'video/mp4; codecs="avc1.640028"',
    'audio/mp4; codecs="mp4a.40.2"',
    'audio/mp4; codecs="mp4a.40.5"',
  ];
  if (typeof MediaSource !== "undefined") {
    for (var i = 0; i < mimeChecks.length; i++) {
      var t = mimeChecks[i];
      out.mediaSourceIsTypeSupported[t] = MediaSource.isTypeSupported(t);
    }
  }
  out.decodingInfo_mp4_h264_aac = null;
  if (navigator.mediaCapabilities && navigator.mediaCapabilities.decodingInfo) {
    try {
      var di = await navigator.mediaCapabilities.decodingInfo({
        type: "media-source",
        video: {
          contentType: 'video/mp4; codecs="avc1.640028"',
          width: 640,
          height: 360,
          bitrate: 1000000,
          framerate: 30,
        },
        audio: {
          contentType: 'audio/mp4; codecs="mp4a.40.2"',
          channels: 2,
          bitrate: 128000,
          samplerate: 48000,
        },
      });
      out.decodingInfo_mp4_h264_aac = {
        supported: di.supported,
        smooth: di.smooth,
        powerEfficient: di.powerEfficient,
      };
    } catch (e) {
      out.decodingInfo_mp4_h264_aac = { error: String(e) };
    }
  }
  out.href = location.href;
  return out;
})()
`;

/** Evaluado en WhatsApp Web: intenta inferir mensajes no leídos (título + heurística DOM). */
const WHATSAPP_UNREAD_JS = `(() => {
  try {
    var t = document.title || "";
    var m = t.match(/\\((\\d+)\\)/);
    if (m) return parseInt(m[1], 10);
    var badges = document.querySelectorAll('span[data-testid="icon-unread-count"], span[data-testid="unread-count"]');
    var sum = 0;
    for (var i = 0; i < badges.length; i++) {
      var txt = (badges[i].textContent || "").trim().replace(/\\D/g, "");
      var n = parseInt(txt, 10);
      if (!isNaN(n)) sum += n;
    }
    return sum > 0 ? sum : 0;
  } catch (_e) {
    return 0;
  }
})()`;

function isDev() {
  return !app.isPackaged;
}

function rendererUrl() {
  if (isDev()) return process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
  return `file://${path.join(app.getAppPath(), "dist/renderer/index.html")}`;
}

/** Quita una WebContentsView del contentView (sigue existiendo en `viewsById`). */
function safeRemoveChildView(win: BrowserWindow, view: WebContentsView) {
  try {
    win.contentView.removeChildView(view);
  } catch {
    /* no adjunto */
  }
}

/** Re-añade la vista como última hija de contentView para dejarla al frente (mayor z-index). No-op si ya está al frente. */
function raiseChildView(win: BrowserWindow, view: WebContentsView) {
  const children = win.contentView.children;
  if (children.length > 0 && children[children.length - 1] === view) return;
  try { win.contentView.removeChildView(view); } catch { /* ignore */ }
  try { win.contentView.addChildView(view); } catch { /* ignore */ }
}

/** Mismo gris que el rail en `App.tsx` (`#1d1f1f`); ARGB para `setBackgroundColor`. */
const OPAQUE_CHROME_BG = "#ff1d1f1f";

/**
 * En muchos entornos Linux (X11/Wayland) `transparent: true` + `WebContentsView` deja la capa
 * embebida en negro. Opacidad se elige en `useTransparentWindow()`.
 */
function useTransparentWindow(): boolean {
  if (process.env.CATRIP_TRANSPARENT_WINDOW === "0") return false;
  if (process.env.CATRIP_TRANSPARENT_WINDOW === "1") return true;
  if (process.platform === "linux") return false;
  return true;
}

/** Colores de ventana y shell. BrowserWindow con webContents vacío; shell como WebContentsView separada. */
function wireTransparency(
  win: BrowserWindow,
  shellView: WebContentsView,
  windowTransparent: boolean
) {
  if (!windowTransparent) {
    win.setBackgroundColor(OPAQUE_CHROME_BG);
    try { win.contentView.setBackgroundColor(OPAQUE_CHROME_BG); } catch { /* ignore */ }
    shellView.setBackgroundColor(OPAQUE_CHROME_BG);
    return;
  }
  const transparent = "#00000000";
  win.setBackgroundColor(transparent);
  try { win.contentView.setBackgroundColor(transparent); } catch { /* ignore */ }
  shellView.setBackgroundColor(transparent);
  shellView.webContents.once("did-finish-load", () => {
    try { win.contentView.setBackgroundColor(transparent); } catch { /* ignore */ }
    shellView.setBackgroundColor(transparent);
    dbgEmbed("shell paintShell", { shellWcId: shellView.webContents.id });
  });
}

/** Ícono principal del proyecto origen: `share/icons/org.k3p.catrip-multichat.svg` */
function nativeImageFromSvgPath(absPath: string): Electron.NativeImage {
  try {
    if (!fs.existsSync(absPath)) return nativeImage.createEmpty();
    const svg = fs.readFileSync(absPath, "utf-8");
    const dataUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    const img = nativeImage.createFromDataURL(dataUrl);
    if (!img.isEmpty()) return img;
  } catch {
    // ignore
  }
  return nativeImage.createEmpty();
}

function getAppIconNativeImage(): Electron.NativeImage {
  const p = path.join(
    app.getAppPath(),
    "assets/icons/org.k3p.catrip-multichat.svg"
  );
  return nativeImageFromSvgPath(p);
}

function createMainWindow(): { win: BrowserWindow; shellView: WebContentsView } {
  const transparent = useTransparentWindow();
  const st = viewState;
  const bounds = st?.settings?.general?.windowBounds ?? null;
  const win = new BrowserWindow({
    title: APP_NAME,
    icon: getAppIconNativeImage(),
    ...(bounds ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height } : { width: 1180, height: 760 }),
    minWidth: 980,
    minHeight: 640,
    show: false,
    transparent,
    backgroundColor: transparent ? "#00000000" : OPAQUE_CHROME_BG,
  });

  const shellView = new WebContentsView({
    webPreferences: {
      preload: path.join(app.getAppPath(), "dist/preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.contentView.addChildView(shellView);

  wireTransparency(win, shellView, transparent);

  dbgEmbed("createMainWindow", {
    transparent,
    platform: process.platform,
    devtoolsEnv: process.env.CATRIP_DEBUG_EMBED,
    packaged: app.isPackaged,
  });

  shellView.webContents.once("did-finish-load", () => {
    const st = viewState;
    const startMin = st?.settings?.general?.startMinimized ?? false;
    dbgEmbed("shell did-finish-load", { startMinimized: startMin, willShow: !startMin });
    try {
      if (st?.settings?.general?.windowMaximized) win.maximize();
    } catch {
      /* ignore */
    }
    if (!startMin) win.show();
  });
  void shellView.webContents.loadURL(rendererUrl());

  return { win, shellView };
}

async function applySettingsToRuntime(s: Settings) {
  const st = ensureState();
  st.win.setMenuBarVisibility(!!s.general.showMenuBar);

  const proxy =
    s.network.proxyEnabled && s.network.proxyRules.trim()
      ? { proxyRules: s.network.proxyRules.trim() }
      : { mode: "direct" as const };

  for (const acc of st.accounts) {
    const ses = ensureElectronSessionForAccount(acc.id);
    try {
      await ses.setProxy(proxy as any);
    } catch {
      // ignore
    }
  }

  restartUnreadPolling();
  refreshTrayIcon();
  applyAutostartSettings(s);
}

function linuxAutostartDesktopPath(): string {
  const cfg =
    process.env.XDG_CONFIG_HOME && process.env.XDG_CONFIG_HOME.trim()
      ? process.env.XDG_CONFIG_HOME.trim()
      : path.join(os.homedir(), ".config");
  return path.join(cfg, "autostart", "com.catrip.catrip-multichat-electron.desktop");
}

function applyAutostartSettings(s: Settings) {
  const enabled = !!s.general.autoStart;
  // No forzar autostart durante dev para evitar confusión.
  if (!app.isPackaged && enabled) return;

  try {
    if (process.platform === "win32" || process.platform === "darwin") {
      app.setLoginItemSettings({ openAtLogin: enabled });
      return;
    }
  } catch {
    // ignore
  }

  if (process.platform !== "linux") return;

  const p = linuxAutostartDesktopPath();
  try {
    if (!enabled) {
      if (fs.existsSync(p)) fs.unlinkSync(p);
      return;
    }
    fs.mkdirSync(path.dirname(p), { recursive: true });

    const exec = process.env.APPIMAGE || process.execPath;
    const name = "catrip_multichat_electron";
    const desktop = [
      "[Desktop Entry]",
      "Type=Application",
      `Name=${name}`,
      `Exec=${exec}`,
      "X-GNOME-Autostart-enabled=true",
      "Terminal=false",
    ].join("\n");
    fs.writeFileSync(p, desktop + "\n", "utf-8");
  } catch {
    // ignore
  }
}

function persistWindowStateSoon() {
  const st = viewState;
  if (!st) return;
  const win = st.win;
  // No persistir mientras está minimizada; usar último estado visible.
  if (win.isMinimized()) return;
  if (persistWindowTimer) clearTimeout(persistWindowTimer);
  persistWindowTimer = setTimeout(() => {
    persistWindowTimer = null;
    const st2 = viewState;
    if (!st2) return;
    const w = st2.win;
    const next = { ...st2.settings };
    next.general = { ...next.general };
    next.general.windowMaximized = w.isMaximized();
    // Si está maximizada, guardar también el “normal bounds” para restaurar bien.
    const b = w.isMaximized() ? w.getNormalBounds() : w.getBounds();
    next.general.windowBounds = { x: b.x, y: b.y, width: b.width, height: b.height };
    st2.settings = next;
    saveSettings(next);
  }, 350);
}

let persistWindowTimer: NodeJS.Timeout | null = null;
let isQuitting = false;

type ViewState = {
  /** BrowserWindow con webContents vacío; shell y WhatsApp son WebContentsView hijas de contentView. */
  win: BrowserWindow;
  /** Shell React (sidebar + overlays). Primera hija de contentView. */
  shellView: WebContentsView;
  tray?: TrayBackend;
  accounts: Account[];
  activeId: string | null;
  viewsById: Map<string, WebContentsView>;
  settings: Settings;
  chrome: {
    sidebarWidth: number;
    topHeight: number;
    zen: boolean;
    mode: "browser" | "settings";
  };
  attachedViewId: string | null;
  /** Detección automática / IPC `tray:setBadgeCount`; el valor mostrado usa `getEffectiveTrayBadge()`. */
  trayUnreadDetected: number;
};

type TrayBackend =
  | { kind: "electron"; tray: Tray }
  | { kind: "linux-sni"; handle: LinuxSniTrayHandle }
  | {
      kind: "systray2";
      tray: SysTray2;
      menu: any;
      handlerByInternalId: Map<number, () => void>;
      ready: boolean;
    };

let viewState: ViewState | null = null;

/** True si el renderer muestra un overlay modal; se retira la vista embebida de WhatsApp. */
let rendererModalOpen = false;

/** DarkReader eliminado: WhatsApp usa modo oscuro nativo. */
let unreadPollTimer: ReturnType<typeof setInterval> | null = null;
let unreadTitleDebounce: NodeJS.Timeout | null = null;
const downloadSessionsHooked = new WeakSet<Electron.Session>();
const permissionSessionsHooked = new WeakSet<Electron.Session>();
let lastUnreadNotifyAt = 0;

function clampTrayBadge(n: number): number {
  return Math.max(0, Math.min(999, Math.floor(n)));
}

function getEffectiveTrayBadge(): number {
  const st = ensureState();
  const g = st.settings.general;
  if (g.trayBadgeManual != null && Number.isFinite(g.trayBadgeManual)) {
    return clampTrayBadge(g.trayBadgeManual);
  }
  if (!g.trayUnreadBadge) return 0;
  return clampTrayBadge(st.trayUnreadDetected ?? 0);
}

function schedulePollUnreadFromTitle() {
  if (unreadTitleDebounce) clearTimeout(unreadTitleDebounce);
  unreadTitleDebounce = setTimeout(() => {
    unreadTitleDebounce = null;
    void pollTrayUnreadFromActiveView();
  }, 600);
}

async function pollTrayUnreadFromActiveView() {
  const st = ensureState();
  if (st.chrome.mode !== "browser") return;
  const g = st.settings.general;
  if (!g.trayUnreadBadge) return;
  if (g.trayBadgeManual != null) return;
  const id = st.activeId;
  if (!id) return;
  const view = st.viewsById.get(id);
  if (!view || view.webContents.isDestroyed()) return;
  const url = view.webContents.getURL();
  if (!url.includes("web.whatsapp.com")) return;
  try {
    const prev = clampTrayBadge(st.trayUnreadDetected ?? 0);
    const n = await view.webContents.executeJavaScript(WHATSAPP_UNREAD_JS, true);
    const num =
      typeof n === "number" && Number.isFinite(n) ? clampTrayBadge(n) : 0;
    st.trayUnreadDetected = num;
    refreshTrayIcon();
    // Notificación nativa (solo si sube el contador; throttle para evitar spam).
    if (st.settings.notifications.enabled && num > prev) {
      const now = Date.now();
      if (now - lastUnreadNotifyAt > 8000) {
        lastUnreadNotifyAt = now;
        try {
          const body =
            num === 1
              ? "Tienes 1 chat sin leer."
              : `Tienes ${num} chats sin leer.`;
          const notif = new Notification({ title: "WhatsApp", body, silent: false });
          notif.on("click", () => {
            try {
              st.win.show();
              st.win.focus();
            } catch {
              /* ignore */
            }
          });
          notif.show();
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    // ignorar
  }
}

function restartUnreadPolling() {
  if (unreadPollTimer != null) {
    clearInterval(unreadPollTimer);
    unreadPollTimer = null;
  }
  const st = viewState;
  if (!st) return;
  const g = st.settings.general;
  if (!g.trayUnreadBadge || g.trayBadgeManual != null) return;
  unreadPollTimer = setInterval(() => {
    void pollTrayUnreadFromActiveView();
  }, 14000);
}

function downloadsDirForSettings(st: ViewState): string {
  const p = st.settings.general.downloadsDirectory;
  if (typeof p === "string" && p.trim()) return p.trim();
  return app.getPath("downloads");
}

function attachDownloadHandlersOnce(ses: Electron.Session) {
  if (downloadSessionsHooked.has(ses)) return;
  downloadSessionsHooked.add(ses);

  ses.on("will-download", (_event, item, wc) => {
    const st = viewState;
    if (!st) return;

    // Solo controlar descargas iniciadas desde WhatsApp Web.
    try {
      const url = wc.getURL?.() || "";
      if (!url.includes("web.whatsapp.com")) return;
    } catch {
      // ignore
    }

    const baseDir = downloadsDirForSettings(st);
    const filename = item.getFilename();

    const pickUnique = (p: string) => {
      if (!fs.existsSync(p)) return p;
      const dir = path.dirname(p);
      const ext = path.extname(p);
      const base = path.basename(p, ext);
      for (let i = 1; i < 9999; i++) {
        const alt = path.join(dir, `${base} (${i})${ext}`);
        if (!fs.existsSync(alt)) return alt;
      }
      return p;
    };

    const configureSavePath = async () => {
      const ask = !!st.settings.general.downloadsAskSaveAs;
      if (ask) {
        const res = await dialog.showSaveDialog(st.win, {
          title: "Guardar archivo",
          defaultPath: path.join(baseDir, filename),
        });
        if (res.canceled || !res.filePath) {
          item.cancel();
          return;
        }
        item.setSavePath(res.filePath);
        return;
      }
      item.setSavePath(pickUnique(path.join(baseDir, filename)));
    };

    void configureSavePath().catch(() => {});

    item.on("updated", () => {
      if (item.isPaused()) return;
      dbgEmbed("download updated", {
        state: item.getState(),
        received: item.getReceivedBytes(),
        total: item.getTotalBytes(),
        filename: item.getFilename(),
      });
    });
    item.once("done", (_e, state) => {
      dbgEmbed("download done", {
        state,
        path: item.getSavePath(),
        filename: item.getFilename(),
      });
    });
  });
}

function attachPermissionHandlersOnce(ses: Electron.Session) {
  if (permissionSessionsHooked.has(ses)) return;
  permissionSessionsHooked.add(ses);

  const shouldAllow = (permission: string, requestingUrl?: string): boolean => {
    // Solo considerar permisos si la request viene de WhatsApp.
    if (requestingUrl && !isWhatsAppUrl(requestingUrl)) return false;
    const st = viewState;
    const notifsEnabled = !!st?.settings?.notifications?.enabled;

    switch (permission) {
      // WhatsApp Web puede pedir notificaciones.
      case "notifications":
        return notifsEnabled;
      // Llamadas/voice notes pueden requerir mic/cam; mantenerlo permitido para no romper WhatsApp.
      case "media":
      case "microphone":
      case "camera":
        return true;
      default:
        return false;
    }
  };

  try {
    ses.setPermissionRequestHandler((wc, permission, callback, details) => {
      const url =
        (details as any)?.requestingUrl ||
        (details as any)?.requestingURL ||
        wc.getURL?.() ||
        "";
      callback(shouldAllow(String(permission), String(url || "")));
    });
  } catch {
    // ignore
  }

  try {
    ses.setPermissionCheckHandler((_wc, permission, requestingOrigin) => {
      return shouldAllow(String(permission), String(requestingOrigin || ""));
    });
  } catch {
    // ignore
  }
}

function refreshTrayIcon() {
  const st = ensureState();
  const tb = st.tray;
  if (!tb) return;
  if (tb.kind === "linux-sni") {
    void tb.handle.update().catch(() => {});
    return;
  }
  if (tb.kind === "systray2") {
    if (!tb.ready) return;
    // `systray2` actualiza icono/menú vía update-menu (sin depender de Electron Tray/SNI).
    const nextMenu = buildSystray2Menu();
    tb.menu = nextMenu;
    void tb.tray
      .sendAction({ type: "update-menu", menu: nextMenu })
      .then(() => rebuildSystray2Handlers(tb))
      .catch(() => {});
    return;
  }
  const tray = tb.tray;
  const img = trayNativeImage(trayModeForPlatform(), getEffectiveTrayBadge());
  // GNOME (AppIndicator) es más fiable con un fichero PNG que con NativeImage directo.
  try {
    const p = path.join(app.getPath("userData"), "tray-icon.png");
    fs.mkdirSync(path.dirname(p), { recursive: true });
    const png = img.toPNG();
    if (png && png.length > 0) fs.writeFileSync(p, png);
    tray.setImage(p);
  } catch {
    try {
      tray.setImage(img);
    } catch {
      tray.setImage(nativeImage.createEmpty());
    }
  }
}

function applyRendererModalBrowserView() {
  const st = ensureState();
  dbgEmbed("applyRendererModalBrowserView", {
    mode: st.chrome.mode,
    rendererModalOpen,
    activeId: st.activeId,
  });
  if (st.chrome.mode !== "browser") return;
  if (rendererModalOpen) {
    detachBrowserView();
  } else if (st.activeId) {
    attachBrowserViewForAccount(st.activeId);
  }
  layoutActiveView();
}

function ensureState(): ViewState {
  if (!viewState) throw new Error("App state not initialized");
  return viewState;
}

function createAccountAndNotify(label?: string) {
  const st = ensureState();
  const next = createAccount({ version: 1, accounts: st.accounts, activeId: st.activeId }, label);
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  if (!st.activeId) setActiveAccount(next.id);
  return next;
}

function ensureViewForAccount(id: string): WebContentsView {
  const st = ensureState();
  const existing = st.viewsById.get(id);
  if (existing) return existing;

  const ses = ensureElectronSessionForAccount(id);
  attachDownloadHandlersOnce(ses);
  attachPermissionHandlersOnce(ses);
  // Tema: solo modo oscuro nativo de WhatsApp (sin extensiones / CSS inyectado).
  const view = new WebContentsView({
    webPreferences: {
      session: ses,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
    },
  });
  view.setBackgroundColor("#ffffffff");
  view.webContents.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
  );
  void view.webContents.loadURL(WHATSAPP_URL);

  // Enlaces / popups: mantener navegación dentro de WhatsApp; el resto al navegador del sistema.
  view.webContents.setWindowOpenHandler(({ url }) => {
    if (isWhatsAppUrl(url)) {
      void view.webContents.loadURL(url);
      return { action: "deny" };
    }
    void shell.openExternal(url);
    return { action: "deny" };
  });
  view.webContents.on("will-navigate", (event, url) => {
    if (isWhatsAppUrl(url)) return;
    event.preventDefault();
    void shell.openExternal(url);
  });

  view.webContents.on("page-title-updated", schedulePollUnreadFromTitle);

  view.webContents.on("did-finish-load", () => {
    dbgEmbed("whatsapp webContents did-finish-load", {
      accountId: id,
      url: view.webContents.getURL(),
      title: view.webContents.getTitle(),
    });
  });

  view.webContents.on("before-input-event", (event, input) => {
    if (input.type !== "keyDown" || input.key !== "Escape") return;
    const st = viewState;
    if (!st || st.chrome.mode !== "browser" || !st.chrome.zen) return;
    event.preventDefault();
    st.chrome.zen = false;
    void st.shellView.webContents.send("ui:zenChanged", false);
    layoutActiveView();
    refreshMenus();
  });
  view.webContents.on(
    "did-fail-load",
    (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
      dbgEmbed("whatsapp webContents did-fail-load", {
        accountId: id,
        errorCode,
        errorDescription,
        validatedURL,
        isMainFrame,
      });
    }
  );
  view.webContents.on("did-start-loading", () => {
    dbgEmbed("whatsapp webContents did-start-loading", { accountId: id });
  });

  dbgEmbed("ensureViewForAccount created WebContentsView (whatsapp)", { accountId: id });

  st.viewsById.set(id, view);
  return view;
}

function buildTrayMenu() {
  const st = ensureState();
  return Menu.buildFromTemplate([
    {
      label: "Mostrar",
      click: () => {
        st.win.show();
        st.win.focus();
      },
    },
    {
      label: "Ocultar",
      click: () => {
        st.win.hide();
      },
    },
    {
      label: "Ajustes",
      click: () => {
        st.win.show();
        st.win.focus();
        void st.shellView.webContents.send("ui:openSettings");
      },
    },
    {
      label: "Cerrar a bandeja (toggle)",
      type: "checkbox" as const,
      checked: !!st.settings.general.closeToTray,
      click: () => {
        const next = {
          ...st.settings,
          general: { ...st.settings.general, closeToTray: !st.settings.general.closeToTray },
        };
        st.settings = next;
        saveSettings(next);
        refreshTrayMenu();
      },
    },
    { type: "separator" },
    {
      label: "Cuentas",
      submenu: st.accounts.map((a) => ({
        label: a.label,
        type: "radio" as const,
        checked: a.id === st.activeId,
        click: () => setActiveAccount(a.id),
      })),
    },
    { type: "separator" },
    { label: "Salir", click: () => app.quit() },
  ]);
}

function buildAppMenu() {
  const st = ensureState();

  const send = (channel: string, ...args: any[]) => {
    void st.shellView.webContents.send(channel, ...args);
  };

  const inBrowser = () => st.chrome.mode === "browser";

  const reloadPages = () => {
    for (const view of st.viewsById.values()) {
      try {
        view.webContents.reload();
      } catch {
        // ignore
      }
    }
  };

  const openInSystemBrowser = () => {
    if (!inBrowser()) return;
    if (!st.activeId) return;
    const view = st.viewsById.get(st.activeId);
    const url = view?.webContents.getURL?.() || WHATSAPP_URL;
    void shell.openExternal(url);
  };

  const toggleFullscreen = () => {
    st.win.setFullScreen(!st.win.isFullScreen());
  };

  const toggleZen = () => {
    if (!inBrowser()) return;
    st.chrome.zen = !st.chrome.zen;
    send("ui:zenChanged", st.chrome.zen);
    layoutActiveView();
    refreshMenus();
  };

  const accountsMenu = st.accounts.map((a, idx) => ({
    label: a.label,
    type: "radio" as const,
    checked: a.id === st.activeId,
    accelerator: idx < 9 ? `Ctrl+${idx + 1}` : undefined,
    click: () => setActiveAccount(a.id),
  }));

  return Menu.buildFromTemplate([
    {
      label: "Archivo",
      submenu: [
        { label: "Ajustes", accelerator: "Ctrl+P", click: () => send("ui:openSettings") },
        { type: "separator" },
        { label: "Ocultar", accelerator: "Ctrl+W", click: () => st.win.hide() },
        { label: "Salir", accelerator: "Ctrl+Q", click: () => app.quit() },
      ],
    },
    {
      label: "Ver",
      submenu: [
        {
          label: "Cambio rápido de cuenta…",
          accelerator: "Ctrl+K",
          click: () => inBrowser() && send("ui:openQuickSwitcher"),
        },
        { type: "separator" },
        { label: "Pantalla completa", accelerator: "F11", click: () => toggleFullscreen() },
        {
          label: "Modo Zen",
          accelerator: "Ctrl+Shift+Z",
          type: "checkbox" as const,
          checked: st.chrome.zen,
          click: () => toggleZen(),
        },
      ],
    },
    {
      label: "Chat",
      submenu: [
        { label: "Recargar", accelerator: "F5", click: () => reloadPages() },
        {
          label: "Abrir WhatsApp Web en el navegador del sistema",
          accelerator: "Ctrl+Shift+O",
          click: () => openInSystemBrowser(),
        },
        { type: "separator" },
        {
          label: "Nuevo chat",
          accelerator: "Ctrl+N",
          click: () => inBrowser() && void triggerNewChatInActiveView(),
        },
        {
          label: "Por número de teléfono",
          accelerator: "Ctrl+M",
          click: () => inBrowser() && send("ui:openPhoneChat"),
        },
      ],
    },
    {
      label: "Cuentas",
      submenu: [
        { label: "Nueva cuenta", accelerator: "Ctrl+U", click: () => void createAccountAndNotify() },
        { type: "separator" },
        ...accountsMenu,
      ],
    },
    {
      label: "Ayuda",
      submenu: [
        { label: "Atajos de teclado", click: () => send("ui:openShortcutsHelp") },
        { label: "Acerca de", click: () => send("ui:openAbout") },
      ],
    },
  ]);
}

function refreshTrayMenu() {
  const st = ensureState();
  const tb = st.tray;
  if (!tb) return;
  if (tb.kind === "linux-sni") {
    // Por ahora: sin DBusMenu. Solo icono + activar.
    return;
  }
  if (tb.kind === "systray2") {
    if (!tb.ready) return;
    const nextMenu = buildSystray2Menu();
    tb.menu = nextMenu;
    void tb.tray
      .sendAction({ type: "update-menu", menu: nextMenu })
      .then(() => rebuildSystray2Handlers(tb))
      .catch(() => {});
    return;
  }
  tb.tray.setContextMenu(buildTrayMenu());
}

function refreshMenus() {
  refreshTrayMenu();
  refreshTrayIcon();
  Menu.setApplicationMenu(buildAppMenu());
}

function layoutActiveView() {
  const st = ensureState();
  const win = st.win;
  const bounds = win.getContentBounds();

  // Ajustes / modal / sin vista adjunta: shell a pantalla completa.
  if (st.chrome.mode === "settings" || rendererModalOpen) {
    st.shellView.setVisible(true);
    st.shellView.setBounds({ x: 0, y: 0, width: bounds.width, height: bounds.height });
    return;
  }

  const aid = st.attachedViewId;
  if (!aid) {
    st.shellView.setVisible(true);
    st.shellView.setBounds({ x: 0, y: 0, width: bounds.width, height: bounds.height });
    return;
  }

  const view = ensureViewForAccount(aid);
  const sidebar = st.chrome.zen ? 0 : st.chrome.sidebarWidth;
  const top = st.chrome.zen ? 0 : st.chrome.topHeight;
  const innerH = Math.max(0, bounds.height - top);

  if (sidebar > 0) {
    st.shellView.setVisible(true);
    st.shellView.setBounds({ x: 0, y: top, width: sidebar, height: innerH });
    raiseChildView(win, view);
    const waW = Math.max(0, bounds.width - sidebar);
    view.setBounds({ x: sidebar, y: top, width: waW, height: innerH });
  } else {
    st.shellView.setVisible(false);
    raiseChildView(win, view);
    view.setBounds({ x: 0, y: top, width: bounds.width, height: innerH });
  }

  dbgEmbed("layoutActiveView", {
    accountId: aid,
    chrome: { ...st.chrome },
    contentBounds: bounds,
    sidebar,
    top,
    shellBounds: st.shellView.getBounds(),
    waBounds: view.getBounds(),
    attachedViewId: st.attachedViewId,
    winVisible: win.isVisible(),
  });
}

function detachBrowserView() {
  const st = ensureState();
  if (!st.attachedViewId) {
    dbgEmbed("detachBrowserView skip (no attachedViewId)");
    return;
  }
  dbgEmbed("detachBrowserView", {
    attachedViewId: st.attachedViewId,
    childViewsBefore: st.win.contentView.children.length,
  });
  const view = st.viewsById.get(st.attachedViewId);
  if (view) safeRemoveChildView(st.win, view);
  st.attachedViewId = null;
  dbgEmbed("detachBrowserView done", {
    childViewsAfter: st.win.contentView.children.length,
  });
}

function attachBrowserViewForAccount(id: string) {
  const st = ensureState();
  const win = st.win;
  dbgEmbed("attachBrowserViewForAccount enter", {
    id,
    prevAttached: st.attachedViewId,
    mode: st.chrome.mode,
    rendererModalOpen,
    childViewsBefore: win.contentView.children.length,
  });
  const view = ensureViewForAccount(id);
  // Evitar remove/add si ya está adjunta la misma cuenta.
  if (st.attachedViewId === id && win.contentView.children.includes(view)) {
    dbgEmbed("attachBrowserViewForAccount skip (already attached)", { id });
    layoutActiveView();
    return;
  }
  if (st.attachedViewId && st.attachedViewId !== id) {
    const old = st.viewsById.get(st.attachedViewId);
    if (old) safeRemoveChildView(win, old);
  }
  safeRemoveChildView(win, view);
  win.contentView.addChildView(view);
  st.attachedViewId = id;
  dbgEmbed("attachBrowserViewForAccount after addChildView", {
    id,
    childViewsAfter: win.contentView.children.length,
    viewBounds: view.getBounds(),
    wcUrl: view.webContents.getURL(),
    wcDestroyed: view.webContents.isDestroyed(),
  });
  layoutActiveView();
}

function setActiveAccount(id: string) {
  const st = ensureState();
  if (!st.accounts.find((a) => a.id === id)) return;
  st.activeId = id;
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });

  if (st.chrome.mode === "browser" && !rendererModalOpen) {
    attachBrowserViewForAccount(id);
  }
  dbgEmbed("setActiveAccount", {
    id,
    mode: st.chrome.mode,
    rendererModalOpen,
    attachedViewId: st.attachedViewId,
  });
  void st.shellView.webContents.send("accounts:activeChanged", st.activeId);
  refreshMenus();
  void pollTrayUnreadFromActiveView();
}

function normalizeE164Digits(input: string): string | null {
  const raw = (input || "").trim();
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length < 9 || digits.length > 15) return null;
  return digits;
}

function openChatByPhone(phoneRaw: string) {
  const st = ensureState();
  const id = st.activeId;
  if (!id) return;
  const digits = normalizeE164Digits(phoneRaw);
  if (!digits) return;
  if (st.chrome.mode !== "browser") return;
  attachBrowserViewForAccount(id);
  const view = ensureViewForAccount(id);
  void view.webContents.loadURL(`${WHATSAPP_SEND_URL}${digits}`);
}

function triggerNewChatInActiveView() {
  const st = ensureState();
  if (st.chrome.mode !== "browser") return;
  const id = st.activeId;
  if (!id) return;
  const view = ensureViewForAccount(id);
  void view.webContents.executeJavaScript(WHATSAPP_NEW_CHAT_JS, true).catch(() => {});
}

function createTray() {
  const st = ensureState();
  if (st.tray) return;

  // En Linux/Wayland GNOME, Electron.Tray puede caer en placeholder ("...") por SNI incompleto.
  // Preferimos publicar un StatusNotifierItem real por DBus (IconPixmap).
  if (process.platform === "linux" && process.env.CATRIP_USE_LINUX_SNI !== "0") {
    dbgEmbed("tray backend", { backend: "linux-sni" });
    void createLinuxSniTray({
      id: "catrip-multichat-electron",
      title: APP_NAME,
      getIcon: () => {
        const img = trayNativeImage(trayModeForPlatform(), getEffectiveTrayBadge());
        // Si por cualquier motivo el SVG->PNG falla, usar el icono principal como fallback.
        if (!img.isEmpty()) return img;
        const appIcon = getAppIconNativeImage();
        if (!appIcon.isEmpty()) return appIcon;
        // Fallback ultra seguro: PNG 1x1 (evita IconPixmap vacío).
        try {
          return nativeImage.createFromDataURL(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBApWf7QAAAABJRU5ErkJggg=="
          );
        } catch {
          return nativeImage.createEmpty();
        }
      },
      onActivate: () => {
        try {
          st.win.show();
          st.win.focus();
        } catch {
          // ignore
        }
      },
      onContextMenu: (x: number, y: number) => {
        try {
          // Mostrar menú nativo aunque el host no lo “abra” por sí solo.
          buildTrayMenu().popup({ window: st.win, x, y });
        } catch {
          // ignore
        }
      },
      onShow: () => {
        try {
          st.win.show();
          st.win.focus();
        } catch {
          // ignore
        }
      },
      onHide: () => {
        try {
          st.win.hide();
        } catch {
          // ignore
        }
      },
      onSettings: () => {
        try {
          st.win.show();
          st.win.focus();
          void st.shellView.webContents.send("ui:openSettings");
        } catch {
          // ignore
        }
      },
      onQuit: () => app.quit(),
      log: (...args: any[]) => dbgEmbed(...args),
    })
      .then((handle) => {
        st.tray = { kind: "linux-sni", handle };
        refreshTrayIcon();
      })
      .catch((e) => {
        dbgEmbed("linux-sni failed", { message: e instanceof Error ? e.message : String(e) });
        // fallback a systray2 si está habilitado
        if (process.env.CATRIP_USE_SYSTRAY2 !== "0") {
          // sigue abajo
          createTrayElectronFallback();
        } else {
          createTrayElectronFallback();
        }
      });
    return;
  }

  // Fallback en Linux: systray2 (no siempre visible en GNOME/Wayland).
  if (process.platform === "linux" && process.env.CATRIP_USE_SYSTRAY2 !== "0") {
    ensureSystray2LinuxBinPresent();
    const SysTrayMod = require("systray2") as any;
    const SysTrayCtor = (SysTrayMod.default ?? SysTrayMod) as new (conf: any) => SysTray2;
    const menu = buildSystray2Menu();
    dbgEmbed("tray backend", { backend: "systray2" });
    let tray: SysTray2;
    try {
      // Asegurar que el binario tenga permiso de ejecución (npm puede dejarlo sin +x).
      const copyDir = path.join(app.getPath("userData"), "systray2-traybin");
      tray = new SysTrayCtor({
        menu,
        debug: process.env.CATRIP_DEBUG_SYSTRAY2 === "1",
        // Importante para apps empaquetadas (asar) y para asegurar permisos en runtime.
        copyDir,
      }) as SysTray2;
    } catch (e) {
      dbgEmbed("systray2 ctor failed", { message: e instanceof Error ? e.message : String(e) });
      // Fallback inmediato al tray de Electron si systray2 no se puede instanciar.
      dbgEmbed("tray backend fallback", { backend: "electron.Tray" });
      const icon = trayNativeImage(trayModeForPlatform(), getEffectiveTrayBadge());
      st.tray = { kind: "electron", tray: new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon) };
      return;
    }
    const backend: TrayBackend = {
      kind: "systray2",
      tray,
      menu,
      handlerByInternalId: new Map(),
      ready: false,
    };
    st.tray = backend;
    try {
      tray.onError((err) => dbgEmbed("systray2 error", { message: err?.message || String(err) }));
      tray.onExit((code, signal) => dbgEmbed("systray2 exit", { code, signal }));
    } catch {
      // ignore
    }
    dbgEmbed("systray2 spawned", {
      binPath: (tray as any).binPath,
      childPid: (tray as any).process?.pid,
    });
    void tray.ready().then(() => {
      backend.ready = true;
      dbgEmbed("systray2 ready", { binPath: (tray as any).binPath, killed: (tray as any).killed });
      rebuildSystray2Handlers(backend);
      // Ahora sí permitir updates (badge, cuentas, etc.)
      refreshTrayMenu();
      refreshTrayIcon();
      void tray.onClick((action) => {
        const id = action?.item?.__id;
        const fn = backend.handlerByInternalId.get(id);
        if (fn) fn();
      }).catch(() => {});
    }).catch((e) => {
      dbgEmbed("systray2 ready failed", { message: e instanceof Error ? e.message : String(e) });
    });
    return;
  }

  createTrayElectronFallback();
}

function createTrayElectronFallback() {
  const st = ensureState();
  if (st.tray) return;
  dbgEmbed("tray backend", { backend: "electron.Tray" });
  const icon = trayNativeImage(trayModeForPlatform(), getEffectiveTrayBadge());
  let tray: Tray;
  try {
    const p = path.join(app.getPath("userData"), "tray-icon.png");
    fs.mkdirSync(path.dirname(p), { recursive: true });
    const png = icon.toPNG();
    if (png && png.length > 0) fs.writeFileSync(p, png);
    tray = new Tray(p);
  } catch {
    tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon);
  }
  tray.setToolTip(APP_NAME);
  tray.setContextMenu(buildTrayMenu());
  st.tray = { kind: "electron", tray };
}

function trayIconPngPath(): string {
  const img = trayNativeImage(trayModeForPlatform(), getEffectiveTrayBadge());
  const p = path.join(app.getPath("userData"), "tray-icon.png");
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const png = img.toPNG();
  if (png && png.length > 0) fs.writeFileSync(p, png);
  return p;
}

function buildSystray2Menu() {
  const st = ensureState();
  const SysTrayMod = require("systray2") as any;
  const SysTrayCtor = (SysTrayMod.default ?? SysTrayMod) as any;
  const mk = (title: string, click?: () => void, extra?: any) => {
    const item: any = {
      title,
      tooltip: title,
      enabled: true,
      ...(extra || {}),
    };
    if (click) item.__handler = click;
    return item;
  };

  const accountsItems = st.accounts.map((a) =>
    mk(
      a.label,
      () => setActiveAccount(a.id),
      // systray2 no tiene radio; usamos check para mostrar la activa.
      { checked: a.id === st.activeId }
    )
  );

  return {
    icon: trayIconPngPath(),
    title: APP_NAME,
    tooltip: APP_NAME,
    items: [
      mk("Mostrar", () => {
        st.win.show();
        st.win.focus();
      }),
      mk("Ocultar", () => st.win.hide()),
      mk("Ajustes", () => {
        st.win.show();
        st.win.focus();
        void st.shellView.webContents.send("ui:openSettings");
      }),
      mk("Cerrar a bandeja", () => {
        const next = {
          ...st.settings,
          general: { ...st.settings.general, closeToTray: !st.settings.general.closeToTray },
        };
        st.settings = next;
        saveSettings(next);
        refreshTrayMenu();
      }, { checked: !!st.settings.general.closeToTray }),
      SysTrayCtor.separator,
      {
        title: "Cuentas",
        tooltip: "Cuentas",
        enabled: true,
        items: accountsItems,
      },
      SysTrayCtor.separator,
      mk("Salir", () => app.quit()),
    ],
  };
}

function rebuildSystray2Handlers(backend: Extract<TrayBackend, { kind: "systray2" }>) {
  backend.handlerByInternalId.clear();
  const walk = (items: any[]) => {
    for (const it of items || []) {
      if (it && typeof it.__id === "number" && typeof it.__handler === "function") {
        backend.handlerByInternalId.set(it.__id, it.__handler);
      }
      if (it?.items) walk(it.items);
    }
  };
  walk(backend.menu?.items || []);
}

// En producción queremos instancia única. En desarrollo esto estorba pruebas (y hace que `dev:electron`
// salga con code 0 si ya hay una instancia viva), así que lo desactivamos por defecto.
const enforceSingleInstance = app.isPackaged || process.env.CATRIP_ENFORCE_SINGLE_INSTANCE === "1";
const gotLock = enforceSingleInstance ? app.requestSingleInstanceLock() : true;
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    for (const w of BaseWindow.getAllWindows()) {
      if (w.isMinimized()) w.restore();
      w.show();
      w.focus();
      return;
    }
  });
}

app.whenReady().then(() => {
  const s = loadAccountsState();
  const settings = loadSettings();
  if (s.accounts.length === 0) {
    createAccount(s, "Cuenta 1");
    saveAccountsState(s);
  }

  // Inicializa el estado antes de crear la ventana (para startMinimized).
  viewState = {
    win: null as any,
    shellView: null as any,
    accounts: s.accounts,
    activeId: s.activeId ?? (s.accounts[0]?.id ?? null),
    viewsById: new Map(),
    settings,
    chrome: { sidebarWidth: 72, topHeight: 0, zen: !!settings.general.zen, mode: "browser" },
    attachedViewId: null,
    trayUnreadDetected: 0,
  };

  const { win, shellView } = createMainWindow();
  viewState.win = win;
  viewState.shellView = shellView;

  layoutActiveView();

  createTray();
  refreshMenus();
  void applySettingsToRuntime(settings);

  nativeTheme.on("updated", () => {
    refreshTrayIcon();
  });

  // Activar cuenta al arrancar.
  if (viewState.activeId) setActiveAccount(viewState.activeId);

  // Notificar Zen inicial al renderer (para que el rail se oculte si procede).
  void viewState.shellView.webContents.send("ui:zenChanged", viewState.chrome.zen);

  dbgEmbed("startup snapshot", {
    activeId: viewState.activeId,
    chrome: viewState.chrome,
    attachedViewId: viewState.attachedViewId,
    contentChildCount: viewState.win.contentView.children.length,
    childViewCount: viewState.win.contentView.children.length,
    contentBounds: viewState.win.getContentBounds(),
  });

  win.on("resize", () => {
    layoutActiveView();
    persistWindowStateSoon();
  });
  win.on("move", () => persistWindowStateSoon());
  win.on("maximize", () => {
    layoutActiveView();
    persistWindowStateSoon();
  });
  win.on("unmaximize", () => {
    layoutActiveView();
    persistWindowStateSoon();
  });
  win.on("show", () => layoutActiveView());

  win.on("close", (e) => {
    const st = viewState;
    if (!st) return;
    if (isQuitting) return;
    if (process.platform === "darwin") {
      // En macOS se suele “cerrar” dejando la app viva; mantener consistencia con closeToTray.
    }
    if (st.settings.general.closeToTray) {
      e.preventDefault();
      st.win.hide();
    }
  });

  app.on("activate", () => {
    if (BaseWindow.getAllWindows().length === 0) {
      const r = createMainWindow();
      if (viewState) {
        viewState.win = r.win;
        viewState.shellView = r.shellView;
        layoutActiveView();
        void applySettingsToRuntime(viewState.settings);
        refreshMenus();
        if (viewState.activeId) setActiveAccount(viewState.activeId);
      }
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  isQuitting = true;
});

ipcMain.handle("diagnostics:whatsappMedia", async () => {
  try {
    const st = ensureState();
    const id = st.activeId;
    if (!id) {
      return {
        ok: false as const,
        code: "no_account",
        message: "No hay cuenta activa.",
      };
    }
    const view = ensureViewForAccount(id);
    const wc = view.webContents;
    if (wc.isDestroyed()) {
      return {
        ok: false as const,
        code: "destroyed",
        message: "La vista web no está disponible.",
      };
    }
    const url = wc.getURL();
    if (!url.includes("web.whatsapp.com")) {
      return {
        ok: false as const,
        code: "not_whatsapp",
        message:
          "La cuenta activa no muestra web.whatsapp.com todavía. Abre WhatsApp Web en el navegador integrado y vuelve a intentar.",
        url,
      };
    }
    const data = await wc.executeJavaScript(WHATSAPP_MEDIA_DIAG_JS, true);
    return { ok: true as const, data };
  } catch (e) {
    return {
      ok: false as const,
      code: "exception",
      message: e instanceof Error ? e.message : String(e),
    };
  }
});

ipcMain.handle("tray:setBadgeCount", (_evt, raw: unknown) => {
  const st = ensureState();
  const n = typeof raw === "number" ? raw : Number(raw);
  st.trayUnreadDetected = Number.isFinite(n) ? clampTrayBadge(n) : 0;
  refreshTrayIcon();
});

ipcMain.handle("app:getVersion", () => app.getVersion());

ipcMain.handle("accounts:list", () => {
  const st = ensureState();
  return st.accounts;
});

ipcMain.handle("accounts:getActiveId", () => {
  const st = ensureState();
  return st.activeId;
});

ipcMain.handle("accounts:create", (_evt, label?: string) => {
  return createAccountAndNotify(label);
});

ipcMain.handle("accounts:regenerateIcon", (_evt, id: string) => {
  const st = ensureState();
  const next = regenerateAccountIcon(st.accounts, id);
  if (!next) return null;
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  return next;
});

ipcMain.handle("accounts:setActive", (_evt, id: string) => {
  setActiveAccount(id);
});

ipcMain.handle("chat:openByPhone", (_evt, phoneRaw: string) => {
  openChatByPhone(phoneRaw);
});

ipcMain.handle("chat:triggerNewChat", () => {
  triggerNewChatInActiveView();
});

ipcMain.handle("settings:get", () => {
  const st = ensureState();
  return st.settings;
});

ipcMain.handle("settings:set", (_evt, next: Settings) => {
  const st = ensureState();
  st.settings = next;
  saveSettings(next);
  void applySettingsToRuntime(next);
});

ipcMain.handle("dialog:selectDownloadsDirectory", async () => {
  const st = ensureState();
  const res = await dialog.showOpenDialog(st.win, {
    title: "Elegir carpeta de descargas",
    properties: ["openDirectory", "createDirectory"],
  });
  if (res.canceled) return null;
  return res.filePaths[0] || null;
});

ipcMain.handle(
  "ui:setChromeMetrics",
  (_evt, m: { sidebarWidth: number; topHeight: number }) => {
    const st = ensureState();
    const sw = Number.isFinite(m.sidebarWidth) ? Math.max(0, Math.min(400, m.sidebarWidth)) : 72;
    const th = Number.isFinite(m.topHeight) ? Math.max(0, Math.min(200, m.topHeight)) : 0;
    dbgEmbed("ipc ui:setChromeMetrics", { raw: m, clamped: { sidebarWidth: sw, topHeight: th } });
    st.chrome.sidebarWidth = sw;
    st.chrome.topHeight = th;
    layoutActiveView();
  }
);

ipcMain.handle("ui:setRendererModalOpen", (_evt, open: boolean) => {
  dbgEmbed("ipc ui:setRendererModalOpen", { open });
  rendererModalOpen = !!open;
  applyRendererModalBrowserView();
});

ipcMain.handle("ui:setZenMode", (_evt, enabled: boolean) => {
  const st = ensureState();
  st.chrome.zen = !!enabled;
  // Persistir preferencia para próximos arranques.
  const next = { ...st.settings, general: { ...st.settings.general, zen: st.chrome.zen } };
  st.settings = next;
  saveSettings(next);
  layoutActiveView();
  refreshMenus();
});

ipcMain.handle("ui:setMode", (_evt, mode: "browser" | "settings") => {
  const st = ensureState();
  const next = mode === "settings" ? "settings" : "browser";
  dbgEmbed("ipc ui:setMode", { requested: mode, next, rendererModalOpen });
  st.chrome.mode = next;
  if (next === "settings") {
    st.chrome.zen = false;
    detachBrowserView();
  } else {
    if (st.activeId && !rendererModalOpen) attachBrowserViewForAccount(st.activeId);
  }
  refreshMenus();
  restartUnreadPolling();
  if (next === "browser") void pollTrayUnreadFromActiveView();
  layoutActiveView();
});

