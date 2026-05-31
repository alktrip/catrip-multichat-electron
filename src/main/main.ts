import {
  app,
  BaseWindow,
  BrowserWindow,
  dialog,
  Menu,
  Tray,
  WebContentsView,
  ipcMain,
  nativeImage,
  nativeTheme,
  shell,
  type Event,
  type Input,
} from "electron";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import {
  createAccount,
  deleteAccount,
  ensureElectronSessionForAccount,
  loadAccountsState,
  regenerateAccountIcon,
  saveAccountsState,
  renameAccount,
  ensureAccountIconVariants,
  setAccountIconVariant,
  setAccountNotificationsEnabled,
  type Account,
} from "./accounts";
import { loadSettings, saveSettings, type Settings } from "./settings";
import { applyTrayGreenTint, trayModeForPlatform, trayNativeImage } from "./trayIcon";
import { createLinuxSniTray, type LinuxSniTrayHandle } from "./linuxSniTray";
import { setupAutoUpdater, refreshUpdaterChannel } from "./autoUpdater";
import {
  initUpdateDialogBridge,
  setUpdateDialogShellTarget,
  setUpdateDialogWindowFocus,
  showUpdateDialogRequest,
} from "./updateDialogBridge";
import { formatReleaseNotesForUpdateDialog, releaseNotesGithubUrl } from "./releaseNotesFormat";
import { type AccountSessionStatus } from "./accountSessionStatus";
import { buildWhatsAppWebUserAgent, WHATSAPP_VIEW_BG } from "./chromiumUserAgent";
import { collectPerformanceDiagnostics } from "./performanceDiagnostics";
import {
  normalizeWhatsAppHeartbeatRaw,
  WHATSAPP_HEARTBEAT_FULL_JS,
  WHATSAPP_HEARTBEAT_LIGHT_JS,
  type WhatsAppHeartbeatMode,
} from "./whatsappHeartbeat";
import { initMainI18n, changeMainLanguage, tMain } from "./i18n";
import { initNotificationHub, maybeNotifyActivityIncrease } from "./notificationHub";
import {
  applyLinuxSessionAutostart,
  buildDesktopEntryContent,
  openPathWithDefaultApp,
  registerWhatsAppProtocolForUser,
  runBundledRegisterScript,
} from "./desktopIntegration";
import { parseLaunchAction, type CatripLaunchAction } from "./launchActions";
import { raiseMainWindow } from "./windowFocus";
import { buildSuspendedMap, shouldSuspendAccount } from "./accountSuspension";
import { accountsToSuspendForLiveLimit } from "./accountLiveViewPolicy";
import {
  applySavedWindowBounds,
  captureWindowBounds,
  shouldPersistWindowBounds,
} from "./windowState";
import { startCallSessionGuard, stopCallSessionGuard } from "./whatsappCallDetect";
import {
  buildWhatsAppSendUrl,
  extractWhatsAppUrlFromArgv,
  parseWhatsAppIncomingUrl,
  resolveTargetUrl,
  normalizeE164Digits,
  type WhatsAppIncomingLink,
} from "./whatsappLinks";
import { buildDevContext } from "./devContext";
import {
  applyWhatsAppViewThrottle,
  buildWhatsAppWebPreferences,
  resolveBackgroundThrottleTier,
} from "./whatsappViewRuntime";
import { buildWhatsAppOpenChatByNameJs } from "./whatsappOpenChat";
import { matchCatripShortcut, type CatripShortcutAction } from "./catripShortcuts";
import {
  buildActivitySnapshot,
  activityMapsEqual,
  type AccountActivityMap,
  type AccountActivitySnapshot,
} from "./accountActivity";

// Linux (GNOME/Wayland): `Tray` de Electron puede registrar `chrome_status_icon_1` sin IconPixmap,
// lo que acaba en placeholder (“...”). `systray2` usa un binario Go y evita ese camino.
// Se carga con require (CommonJS) solo cuando hace falta.
type SysTray2 = {
  ready(): Promise<void>;
  onClick(
    listener: (action: { type: "clicked"; item: { __id: number } }) => void,
  ): Promise<unknown>;
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

/** Diagnóstico de menú / shell (activo en dev; en prod solo con CATRIP_DEBUG_MENU=1). */
function dbgMenu(...parts: unknown[]) {
  if (app.isPackaged && process.env.CATRIP_DEBUG_MENU !== "1") return;
  console.log("[catrip-menu]", new Date().toISOString(), ...parts);
}

/** Aceleración GPU y flags Chromium: `bootstrap.ts` → `chromiumLaunch.ts` (antes de cargar este módulo). */

/**
 * Empaquetado Linux: el fichero real es `catrip-connect.desktop` (véase
 * `desktopName` y `executableName` en `package.json`). Electron usa por defecto
 * `{package.json name}.desktop`; si no coincide con el instalado, el shell no
 * enlaza ventana ↔ lanzador y el dock muestra el icono genérico.
 * `bootstrap.ts` fija `CHROME_DESKTOP=catrip-connect.desktop` antes de cargar
 * este módulo; el AppImage incluye el mismo nombre bajo
 * `usr/share/applications/` (hook `after-pack-linux.js`) para que quede en
 * `XDG_DATA_DIRS` con el `AppRun` del runtime.
 *
 * `--class=catrip-connect` se aplica en `bootstrap.ts` antes de cargar este módulo.
 * `app.setName()` no sustituye al ID de escritorio del SO; el nombre del `.desktop`
 * viene de `desktopName`.
 *
 * Como `app.getName()` también determina por defecto la ruta de `userData`,
 * **antes** de cambiar el nombre fijamos `userData` explícitamente a la ruta
 * histórica `~/.config/catrip_multichat_electron/` para no romper la
 * persistencia de cuentas y ajustes de instalaciones existentes.
 *
 * Debe ejecutarse ANTES de `app.whenReady()` y de cualquier llamada que use
 * `app.getPath("userData")`.
 */
if (process.platform === "linux") {
  try {
    const legacyUserData = path.join(app.getPath("appData"), "catrip_multichat_electron");
    app.setPath("userData", legacyUserData);
  } catch {
    // Si por alguna razón `appData` no está disponible aún, dejamos el
    // default; lo único en juego es la ruta del perfil de usuario.
  }
  // Nombre interno coherente con el binario; el ID XDG del .desktop lo define `desktopName`.
  app.setName("catrip-connect");
}

/**
 * Nombre visible de la aplicación. Se usa para el título de la ventana,
 * el menú nativo, el tooltip del tray y otros lugares orientados al usuario.
 *
 * NOTA: Esto es independiente de `app.getName()`, que sigue devolviendo el
 * `productName` de `package.json` (`catrip_multichat_electron`) y por tanto
 * sigue determinando `app.getPath("userData")` (= `~/.config/catrip_multichat_electron/`
 * en Linux). Mantenemos esa identidad técnica intacta para no romper la
 * persistencia de cuentas y settings de instalaciones existentes.
 */
const APP_NAME = "Catrip Connect";
const WHATSAPP_URL = "https://web.whatsapp.com/";

// Modo de pruebas E2E (Playwright). Cuando está activo:
// - cada cuenta carga `about:blank` en lugar de WhatsApp Web (sin red, instantáneo).
// - se omite la creación del tray (evita ensuciar el sistema host).
// Activar con `CATRIP_E2E=1` en el entorno.
const E2E_MODE = process.env.CATRIP_E2E === "1";

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

function isDev() {
  return !app.isPackaged;
}

function rendererUrl() {
  // En modo E2E forzamos el uso del bundle estático (dist/renderer/index.html)
  // para no depender del dev server de Vite durante las pruebas.
  if (E2E_MODE) {
    return `file://${path.join(app.getAppPath(), "dist/renderer/index.html")}`;
  }
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
  try {
    win.contentView.removeChildView(view);
  } catch {
    /* ignore */
  }
  try {
    win.contentView.addChildView(view);
  } catch {
    /* ignore */
  }
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
  windowTransparent: boolean,
) {
  if (!windowTransparent) {
    win.setBackgroundColor(OPAQUE_CHROME_BG);
    try {
      win.contentView.setBackgroundColor(OPAQUE_CHROME_BG);
    } catch {
      /* ignore */
    }
    shellView.setBackgroundColor(OPAQUE_CHROME_BG);
    return;
  }
  const transparent = "#00000000";
  win.setBackgroundColor(transparent);
  try {
    win.contentView.setBackgroundColor(transparent);
  } catch {
    /* ignore */
  }
  shellView.setBackgroundColor(transparent);
  shellView.webContents.once("did-finish-load", () => {
    try {
      win.contentView.setBackgroundColor(transparent);
    } catch {
      /* ignore */
    }
    shellView.setBackgroundColor(transparent);
    dbgEmbed("shell paintShell", { shellWcId: shellView.webContents.id });
  });
}

/** Ícono principal del proyecto origen: `share/icons/org.k3p.catrip-multichat.svg` */
function nativeImageFromSvgPath(absPath: string): Electron.NativeImage {
  try {
    if (!fs.existsSync(absPath)) return nativeImage.createEmpty();
    const svg = fs.readFileSync(absPath, "utf-8");
    const dataUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    const img = nativeImage.createFromDataURL(dataUrl);
    if (!img.isEmpty()) return img;
  } catch {
    // ignore
  }
  return nativeImage.createEmpty();
}

function getAppIconNativeImage(): Electron.NativeImage {
  // Preferimos el PNG 256×256 (rasterizado por `_scripts/generate-app-icons.mjs`)
  // antes que el SVG: en Linux, varios compositores Wayland (GNOME Mutter,
  // KWin) no rasterizan bien los iconos SVG asignados a la `BrowserWindow` y
  // acaban mostrando el icono genérico de Electron. El PNG 256 es un buen
  // compromiso de calidad/peso para tamaños de dock y Alt-Tab.
  const dir = path.join(app.getAppPath(), "assets/icons");
  const candidates = ["256x256.png", "512x512.png", "128x128.png"];
  for (const fname of candidates) {
    const p = path.join(dir, fname);
    try {
      if (fs.existsSync(p)) {
        const img = nativeImage.createFromPath(p);
        if (!img.isEmpty()) return img;
      }
    } catch {
      // probamos el siguiente
    }
  }
  // Fallback al SVG histórico si ningún PNG está disponible (no debería pasar
  // tras `npm run dist`, pero protege escenarios de desarrollo / e2e).
  return nativeImageFromSvgPath(path.join(dir, "org.k3p.catrip-multichat.svg"));
}

/**
 * Crea un alias minimalista de `WebContentsView` para usar en modo E2E. Sólo
 * delega `webContents` al `BrowserWindow.webContents` real (donde se carga el
 * shell) y deja en noop los métodos visuales (`setBounds`, `setVisible`, …).
 */
function createE2EShellAlias(win: BrowserWindow): WebContentsView {
  const noop = () => undefined;
  const proxy = new Proxy({} as WebContentsView, {
    get(_target, prop) {
      if (prop === "webContents") return win.webContents;
      if (prop === "getBounds") return () => win.getContentBounds();
      return noop;
    },
  });
  return proxy;
}

function createMainWindow(): { win: BrowserWindow; shellView: WebContentsView } {
  const transparent = useTransparentWindow();
  const st = viewState;
  const bounds = st?.settings?.general?.windowBounds ?? null;
  const e2ePreload = E2E_MODE
    ? {
        preload: path.join(app.getAppPath(), "dist/preload/preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      }
    : undefined;
  const win = new BrowserWindow({
    title: APP_NAME,
    icon: getAppIconNativeImage(),
    ...(bounds
      ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }
      : { width: 1180, height: 760 }),
    minWidth: 980,
    minHeight: 640,
    show: false,
    transparent,
    backgroundColor: transparent ? "#00000000" : OPAQUE_CHROME_BG,
    ...(e2ePreload ? { webPreferences: e2ePreload } : {}),
  });

  let shellView: WebContentsView;
  if (E2E_MODE) {
    shellView = createE2EShellAlias(win);
  } else {
    shellView = new WebContentsView({
      webPreferences: {
        preload: path.join(app.getAppPath(), "dist/preload/preload.js"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });
    win.contentView.addChildView(shellView);
  }

  wireTransparency(win, shellView, transparent);

  dbgEmbed("createMainWindow", {
    transparent,
    platform: process.platform,
    devtoolsEnv: process.env.CATRIP_DEBUG_EMBED,
    packaged: app.isPackaged,
    e2eMode: E2E_MODE,
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

  if (!app.isPackaged) {
    shellView.webContents.on("console-message", (_e, level, message, line, sourceId) => {
      if (level >= 2) {
        dbgEmbed("shell console", { level, message, line, sourceId });
      }
    });
  }

  if (E2E_MODE) {
    void win.loadURL(rendererUrl());
  } else {
    void shellView.webContents.loadURL(rendererUrl());
  }

  return { win, shellView };
}

async function applySettingsToRuntime(s: Settings) {
  await changeMainLanguage(s.general.language, app.getLocale());
  refreshMenus();
  const st = ensureState();
  st.win.setMenuBarVisibility(!!s.general.showMenuBar);

  // Escala (zoom) para shell y vistas de WhatsApp.
  const z = Number.isFinite(s.general.uiScale) ? Math.max(0.75, Math.min(2, s.general.uiScale)) : 1;
  try {
    st.shellView.webContents.setZoomFactor(z);
  } catch {
    // ignore
  }
  for (const view of st.viewsById.values()) {
    try {
      view.webContents.setZoomFactor(z);
    } catch {
      // ignore
    }
  }

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

  restartBackgroundHeartbeat();
  restartAccountSuspensionTimer();
  refreshTrayIcon();
  applyAutostartSettings(s);
  refreshUpdaterChannel(s.general.updateChannel === "beta" ? "beta" : "stable");
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

  const result = applyLinuxSessionAutostart(enabled);
  if (!result.ok) {
    dbgEmbed("applyAutostartSettings failed", { message: result.message });
  } else {
    dbgEmbed("applyAutostartSettings", { enabled, message: result.message });
  }
}

/**
 * AppImage: integrar con el escritorio instalando .desktop e iconos en
 * ~/.local/share/ para que GNOME/KDE asocien la ventana con el icono correcto.
 * Solo se ejecuta cuando `process.env.APPIMAGE` existe (es decir, estamos
 * corriendo desde un AppImage).
 */
function integrateAppImageDesktop() {
  if (!process.env.APPIMAGE) return;
  if (process.platform !== "linux") return;

  const dataHome = process.env.XDG_DATA_HOME?.trim() || path.join(os.homedir(), ".local", "share");
  const appExec = process.env.APPIMAGE;

  // 1. Instalar iconos
  const iconDir = path.join(app.getAppPath(), "assets", "icons");
  const sizes = [16, 32, 48, 64, 128, 256, 512];
  for (const size of sizes) {
    const src = path.join(iconDir, `${size}x${size}.png`);
    const dest = path.join(
      dataHome,
      "icons",
      "hicolor",
      `${size}x${size}`,
      "apps",
      "catrip-connect.png",
    );
    try {
      if (!fs.existsSync(src)) continue;
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    } catch {
      // ignore
    }
  }

  // 2. Crear .desktop
  const desktopPath = path.join(dataHome, "applications", "catrip-connect.desktop");
  try {
    fs.mkdirSync(path.dirname(desktopPath), { recursive: true });
    fs.writeFileSync(desktopPath, buildDesktopEntryContent(appExec) + "\n", "utf-8");
  } catch {
    // ignore
  }

  // 3. Refrescar icon cache del usuario
  try {
    const { execSync } = require("node:child_process");
    execSync("gtk-update-icon-cache -f -t " + path.join(dataHome, "icons", "hicolor"), {
      timeout: 5000,
      stdio: "ignore",
    });
  } catch {
    // ignore — puede no existir gtk-update-icon-cache
  }

  registerWhatsAppProtocolLinux(desktopPath, appExec);

  dbgEmbed("AppImage desktop integration", { desktopPath, appExec });
}

/** GNOME solo ofrece abrir whatsapp:// si el .desktop está indexado (update-desktop-database). */
function registerWhatsAppProtocolLinux(userDesktopPath?: string, execPath?: string) {
  if (process.platform !== "linux" || E2E_MODE) return;
  try {
    const { execSync } = require("node:child_process");
    const dataHome =
      process.env.XDG_DATA_HOME?.trim() || path.join(os.homedir(), ".local", "share");
    const appsDir = path.join(dataHome, "applications");
    const desktopPath = userDesktopPath || path.join(appsDir, "catrip-connect.desktop");
    const bin =
      execPath ||
      (process.env.APPIMAGE as string | undefined) ||
      (app.isPackaged ? "/opt/Catrip Connect/catrip-connect" : undefined);
    if (bin && fs.existsSync(desktopPath)) {
      fs.writeFileSync(desktopPath, buildDesktopEntryContent(bin) + "\n", "utf-8");
    }
    execSync(`update-desktop-database "${appsDir}" 2>/dev/null || true`, {
      timeout: 8000,
      stdio: "ignore",
    });
    execSync(
      "xdg-mime default catrip-connect.desktop x-scheme-handler/whatsapp 2>/dev/null || true",
      {
        timeout: 5000,
        stdio: "ignore",
      },
    );
    execSync("gio mime x-scheme-handler/whatsapp catrip-connect.desktop 2>/dev/null || true", {
      timeout: 5000,
      stdio: "ignore",
    });
    dbgEmbed("registerWhatsAppProtocolLinux ok", { desktopPath });
  } catch (err) {
    dbgEmbed("registerWhatsAppProtocolLinux failed", { err: String(err) });
  }
}

function writePersistedWindowState(
  st: ViewState,
  bounds: NonNullable<Settings["general"]["windowBounds"]>,
  maximized: boolean,
) {
  const next = { ...st.settings };
  next.general = { ...next.general, windowBounds: bounds, windowMaximized: maximized };
  st.settings = next;
  saveSettings(next);
}

function persistWindowStateNow() {
  const st = viewState;
  if (!st) return;
  if (persistWindowTimer) {
    clearTimeout(persistWindowTimer);
    persistWindowTimer = null;
  }
  const win = st.win;
  if (!shouldPersistWindowBounds(win)) return;
  const captured = captureWindowBounds(win);
  writePersistedWindowState(st, captured.bounds, captured.maximized);
}

function persistWindowStateSoon() {
  const st = viewState;
  if (!st) return;
  if (!shouldPersistWindowBounds(st.win)) return;
  if (persistWindowTimer) clearTimeout(persistWindowTimer);
  persistWindowTimer = setTimeout(() => {
    persistWindowTimer = null;
    const st2 = viewState;
    if (!st2 || !shouldPersistWindowBounds(st2.win)) return;
    const captured = captureWindowBounds(st2.win);
    writePersistedWindowState(st2, captured.bounds, captured.maximized);
  }, 350);
}

function showMainWindow() {
  const st = ensureState();
  const win = st.win;
  if (!win.isVisible() || win.isMinimized()) {
    applySavedWindowBounds(
      win,
      st.settings.general.windowBounds,
      st.settings.general.windowMaximized,
    );
  }
  raiseMainWindow(win);
  layoutActiveView();
}

function hideMainWindow() {
  persistWindowStateNow();
  ensureState().win.hide();
}

let persistWindowTimer: NodeJS.Timeout | null = null;
let isQuitting = false;
let trayDisposed = false;

function isDbusStreamClosedError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /stream is closed|Cannot send message/i.test(msg);
}

async function disposeTrayBackend(): Promise<void> {
  if (trayDisposed) return;
  trayDisposed = true;
  const st = viewState;
  if (!st?.tray) return;
  const tb = st.tray;
  st.tray = undefined;
  try {
    if (tb.kind === "linux-sni") await tb.handle.dispose();
    else if (tb.kind === "systray2") await tb.tray.kill(true);
    else tb.tray.destroy();
  } catch {
    // ignore
  }
}

function requestAppQuit(): void {
  if (isQuitting && trayDisposed) return;
  isQuitting = true;
  stopCallSessionGuard();
  void disposeTrayBackend().finally(() => app.quit());
}

let pendingLaunchAction: CatripLaunchAction | null = parseLaunchAction(process.argv);

function applyLaunchAction(action: CatripLaunchAction | null) {
  if (!action || !viewState) return;
  switch (action) {
    case "open":
    case "focus":
      focusMainWindow();
      break;
    case "new-account":
      focusMainWindow();
      createAccountAndNotify();
      break;
  }
}

function recordHeartbeatExecution() {
  heartbeatExecutionCount += 1;
  heartbeatLastExecutionAt = Date.now();
}

function heartbeatScriptForMode(mode: WhatsAppHeartbeatMode): string {
  return mode === "full" ? WHATSAPP_HEARTBEAT_FULL_JS : WHATSAPP_HEARTBEAT_LIGHT_JS;
}

async function evalWhatsAppHeartbeat(
  id: string,
  mode: WhatsAppHeartbeatMode,
): Promise<ReturnType<typeof normalizeWhatsAppHeartbeatRaw>> {
  const st = ensureState();
  const view = st.viewsById.get(id);
  if (!view || view.webContents.isDestroyed()) return null;
  try {
    const url = view.webContents.getURL();
    if (!url.includes("web.whatsapp.com")) return null;
    const raw = await view.webContents.executeJavaScript(heartbeatScriptForMode(mode), true);
    recordHeartbeatExecution();
    return normalizeWhatsAppHeartbeatRaw(raw);
  } catch {
    return null;
  }
}

async function evalCallActiveForAccount(id: string): Promise<boolean> {
  const hb = await evalWhatsAppHeartbeat(id, "light");
  return hb?.callActive === true;
}

function getSuspendedMapForState(st: ViewState): Record<string, boolean> {
  return buildSuspendedMap(
    st.accounts.map((a) => a.id),
    st.suspendedAccountIds,
  );
}

function broadcastSuspensionIfChanged() {
  const st = viewState;
  if (!st) return;
  try {
    void st.shellView.webContents.send("accounts:suspendedChanged", getSuspendedMapForState(st));
  } catch {
    // ignore
  }
}

function touchAccountActive(id: string) {
  const st = viewState;
  if (!st) return;
  st.accountLastActiveAt[id] = Date.now();
  if (st.suspendedAccountIds.delete(id)) {
    broadcastSuspensionIfChanged();
  }
}

function wakeAllSuspendedAccounts() {
  const st = viewState;
  if (!st || st.suspendedAccountIds.size === 0) return;
  for (const id of st.suspendedAccountIds) {
    try {
      ensureViewForAccount(id);
    } catch {
      // ignore per account
    }
  }
  st.suspendedAccountIds.clear();
  broadcastSuspensionIfChanged();
  dbgEmbed("wakeAllSuspendedAccounts");
}

async function suspendAccount(id: string) {
  const st = viewState;
  if (!st || E2E_MODE) return;
  if (id === st.activeId) return;
  if (!st.settings.performance.suspendInactiveAccounts) return;
  if (st.suspendedAccountIds.has(id)) return;
  const view = st.viewsById.get(id);
  if (!view) return;
  if (await evalCallActiveForAccount(id)) return;

  if (st.attachedViewId === id) {
    try {
      detachBrowserView();
    } catch {
      // ignore
    }
  }
  safeRemoveChildView(st.win, view);
  try {
    view.webContents.close();
  } catch {
    // ignore
  }
  st.viewsById.delete(id);
  st.suspendedAccountIds.add(id);
  broadcastSuspensionIfChanged();
  dbgEmbed("suspendAccount", { accountId: id });
}

async function collectCallActiveIds(accountIds: readonly string[]): Promise<Set<string>> {
  const out = new Set<string>();
  for (const id of accountIds) {
    if (await evalCallActiveForAccount(id)) out.add(id);
  }
  return out;
}

async function enforceMaxLiveAccounts() {
  const st = viewState;
  if (!st || E2E_MODE) return;
  const limit = st.settings.performance.maxLiveAccounts;
  if (!Number.isFinite(limit) || limit <= 0) return;

  for (let guard = 0; guard < 12; guard++) {
    const liveIds = [...st.viewsById.keys()];
    if (liveIds.length <= limit) return;

    const callActiveIds = await collectCallActiveIds(liveIds);
    const toSuspend = accountsToSuspendForLiveLimit({
      maxLiveAccounts: limit,
      activeAccountId: st.activeId,
      liveAccountIds: liveIds,
      lastActiveAtMs: st.accountLastActiveAt,
      callActiveIds,
    });
    if (toSuspend.length === 0) return;

    for (const id of toSuspend) {
      await suspendAccount(id);
    }
  }
}

function prewarmAccountView(id: string) {
  const st = viewState;
  if (!st || E2E_MODE) return;
  if (!st.settings.performance.prewarmOnHover) return;
  if (!st.accounts.some((a) => a.id === id)) return;
  if (id === st.activeId) return;
  if (st.viewsById.has(id)) return;
  if (st.whatsappLoadOverlay?.accountId === id) return;

  dbgEmbed("prewarmAccountView", { accountId: id });
  ensureViewForAccount(id);
  void enforceMaxLiveAccounts();
}

async function tickAccountSuspension() {
  const st = viewState;
  if (!st || E2E_MODE) return;
  const perf = st.settings.performance;
  if (!perf.suspendInactiveAccounts) return;
  const now = Date.now();
  for (const a of st.accounts) {
    const callActive = st.viewsById.has(a.id) ? await evalCallActiveForAccount(a.id) : false;
    if (
      shouldSuspendAccount({
        enabled: perf.suspendInactiveAccounts,
        accountId: a.id,
        activeAccountId: st.activeId,
        hasLiveView: st.viewsById.has(a.id),
        alreadySuspended: st.suspendedAccountIds.has(a.id),
        lastActiveAtMs: st.accountLastActiveAt[a.id],
        nowMs: now,
        suspendAfterMinutes: perf.suspendAfterMinutes,
        callActive,
      })
    ) {
      await suspendAccount(a.id);
    }
  }
}

function restartAccountSuspensionTimer() {
  if (accountSuspensionTimer != null) {
    clearInterval(accountSuspensionTimer);
    accountSuspensionTimer = null;
  }
  const st = viewState;
  if (!st || E2E_MODE) return;
  if (!st.settings.performance.suspendInactiveAccounts) {
    wakeAllSuspendedAccounts();
    return;
  }
  accountSuspensionTimer = setInterval(() => {
    void tickAccountSuspension();
  }, ACCOUNT_SUSPENSION_TICK_MS);
  void tickAccountSuspension();
}

async function evalAnyWhatsAppCallActive(): Promise<boolean> {
  const st = viewState;
  if (!st || E2E_MODE) return false;
  for (const a of st.accounts) {
    if (!st.viewsById.has(a.id)) continue;
    const hb = await evalWhatsAppHeartbeat(a.id, "light");
    if (hb?.callActive === true) return true;
  }
  return false;
}

process.on("uncaughtException", (err) => {
  if (isQuitting && isDbusStreamClosedError(err)) return;
});

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
  /** No leídos detectados por cuenta. Usado por el rail (punto verde de pulso). */
  unreadByAccount: Record<string, number>;
  /** Actividad reciente por cuenta (preview, estado, chats sin leer). */
  activityByAccount: AccountActivityMap;
  accountStatusById: Record<string, AccountSessionStatus>;
  /** Última vez que el usuario seleccionó cada cuenta (ms). */
  accountLastActiveAt: Record<string, number>;
  /** Cuentas cuya WebContentsView fue destruida para ahorrar RAM. */
  suspendedAccountIds: Set<string>;
  /** Overlay del shell mientras WhatsApp recarga tras suspensión. */
  whatsappLoadOverlay: { accountId: string; label: string } | null;
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
let heartbeatActiveTimer: ReturnType<typeof setInterval> | null = null;
let heartbeatInactiveTimer: ReturnType<typeof setInterval> | null = null;
let unreadTitleDebounce: NodeJS.Timeout | null = null;
const downloadSessionsHooked = new WeakSet<Electron.Session>();
const permissionSessionsHooked = new WeakSet<Electron.Session>();
let accountSuspensionTimer: ReturnType<typeof setInterval> | null = null;
const ACCOUNT_SUSPENSION_TICK_MS = 30_000;
const HEARTBEAT_ACTIVE_MS = 10_000;
const HEARTBEAT_INACTIVE_MS = 30_000;
let heartbeatExecutionCount = 0;
let heartbeatLastExecutionAt: number | null = null;
const whatsappLoadCompletionHooked = new WeakSet<Electron.WebContents>();

const STATUS_SHORT: Record<AccountSessionStatus, string> = {
  loading: "…",
  qr: "QR",
  connected: "✓",
  offline: "!",
};

function clampTrayBadge(n: number): number {
  return Math.max(0, Math.min(999, Math.floor(n)));
}

function getTotalUnreadFromAccounts(): number {
  const st = ensureState();
  let sum = 0;
  for (const a of st.accounts) {
    sum += clampTrayBadge(st.unreadByAccount[a.id] ?? 0);
  }
  return clampTrayBadge(sum);
}

function getEffectiveTrayBadge(): number {
  const st = ensureState();
  const g = st.settings.general;
  if (g.trayBadgeManual != null && Number.isFinite(g.trayBadgeManual)) {
    return clampTrayBadge(g.trayBadgeManual);
  }
  if (!g.trayUnreadBadge) return 0;
  return getTotalUnreadFromAccounts();
}

function recomputeTrayUnreadTotal() {
  const st = ensureState();
  st.trayUnreadDetected = getTotalUnreadFromAccounts();
}

/** Badge numérico en el icono del dock / lanzador (Linux; Electron `setBadgeCount`). */
function refreshDockBadge() {
  if (process.platform !== "linux" || E2E_MODE) return;
  const st = ensureState();
  const g = st.settings.general;
  try {
    if (!g.dockUnreadBadge || !g.trayUnreadBadge) {
      app.setBadgeCount(0);
      return;
    }
    if (g.trayBadgeManual != null && Number.isFinite(g.trayBadgeManual)) {
      app.setBadgeCount(clampTrayBadge(g.trayBadgeManual));
      return;
    }
    app.setBadgeCount(getEffectiveTrayBadge());
  } catch {
    // ignore — depende del entorno de escritorio (Unity/GNOME…)
  }
}

function schedulePollUnreadFromTitle() {
  if (unreadTitleDebounce) clearTimeout(unreadTitleDebounce);
  unreadTitleDebounce = setTimeout(() => {
    unreadTitleDebounce = null;
    void tickActiveAccountHeartbeat();
  }, 600);
}

async function applyHeartbeatResult(
  id: string,
  hb: NonNullable<ReturnType<typeof normalizeWhatsAppHeartbeatRaw>>,
  notify: boolean,
) {
  const st = ensureState();
  const g = st.settings.general;
  const trackUnread = g.trayUnreadBadge && g.trayBadgeManual == null;
  if (st.accountStatusById[id] !== hb.status) {
    broadcastAccountStatusIfChanged({ ...st.accountStatusById, [id]: hb.status });
  }
  if (!trackUnread) return;
  const acc = st.accounts.find((a) => a.id === id) || null;
  const perAccountNotifs = acc?.notificationsEnabled !== false;
  const snapshot = buildActivitySnapshot(hb, hb.status, st.activityByAccount[id]);
  applyAccountActivity(id, { ...snapshot, unread: clampTrayBadge(snapshot.unread) }, notify && perAccountNotifs);
}

async function tickActiveAccountHeartbeat() {
  const st = ensureState();
  if (st.chrome.mode !== "browser") return;
  const id = st.activeId;
  if (!id) return;
  const hb = await evalWhatsAppHeartbeat(id, "full");
  if (hb == null) return;
  await applyHeartbeatResult(id, hb, true);
}

/** Heartbeat ligero en cuentas inactivas con vista viva (estado, badge, llamada). */
async function tickInactiveAccountsHeartbeat() {
  const st = viewState;
  if (!st) return;
  const activeId = st.activeId;
  const trackUnread =
    st.settings.general.trayUnreadBadge && st.settings.general.trayBadgeManual == null;
  const nextActivity = { ...st.activityByAccount };
  const nextUnread = { ...st.unreadByAccount };
  const nextStatus = { ...st.accountStatusById };
  let changedActivity = false;
  let changedUnread = false;
  let changedStatus = false;

  for (const a of st.accounts) {
    if (a.id === activeId) continue;
    if (!st.viewsById.has(a.id)) continue;
    const prevN = clampTrayBadge(nextUnread[a.id] ?? 0);
    const hb = await evalWhatsAppHeartbeat(a.id, "light");
    if (hb == null) {
      if (trackUnread && (nextUnread[a.id] ?? 0) !== 0) {
        nextUnread[a.id] = 0;
        changedUnread = true;
      }
      if (trackUnread) {
        const empty = emptyActivitySnapshot(st.accountStatusById[a.id] ?? "loading");
        const prevSnap = nextActivity[a.id];
        if (!prevSnap || !activityMapsEqual({ [a.id]: prevSnap }, { [a.id]: empty })) {
          nextActivity[a.id] = empty;
          changedActivity = true;
        }
      }
      continue;
    }
    if (nextStatus[a.id] !== hb.status) {
      nextStatus[a.id] = hb.status;
      changedStatus = true;
    }
    if (!trackUnread) continue;
    if ((nextUnread[a.id] ?? 0) !== hb.unread) {
      nextUnread[a.id] = clampTrayBadge(hb.unread);
      changedUnread = true;
    }
    const snapshot = buildActivitySnapshot(hb, hb.status, nextActivity[a.id]);
    const prevSnap = nextActivity[a.id];
    if (!prevSnap || !activityMapsEqual({ [a.id]: prevSnap }, { [a.id]: snapshot })) {
      nextActivity[a.id] = { ...snapshot, unread: clampTrayBadge(snapshot.unread) };
      changedActivity = true;
    }
    if (a.notificationsEnabled !== false && hb.unread > prevN) {
      maybeNotifyActivityIncrease(a.id, prevN, {
        unread: hb.unread,
        lastSender: snapshot.lastSender,
        lastPreview: snapshot.lastPreview,
      });
    }
  }

  if (changedStatus) broadcastAccountStatusIfChanged(nextStatus);
  if (changedActivity) broadcastActivityIfChanged(nextActivity);
  if (changedUnread) broadcastUnreadIfChanged(nextUnread);
  else if (!changedActivity && !changedStatus && trackUnread) {
    recomputeTrayUnreadTotal();
    refreshTrayIcon();
    refreshDockBadge();
  }
}

function restartBackgroundHeartbeat() {
  if (heartbeatActiveTimer != null) {
    clearInterval(heartbeatActiveTimer);
    heartbeatActiveTimer = null;
  }
  if (heartbeatInactiveTimer != null) {
    clearInterval(heartbeatInactiveTimer);
    heartbeatInactiveTimer = null;
  }
  if (!viewState) return;
  heartbeatActiveTimer = setInterval(() => {
    void tickActiveAccountHeartbeat();
  }, HEARTBEAT_ACTIVE_MS);
  heartbeatInactiveTimer = setInterval(() => {
    void tickInactiveAccountsHeartbeat();
  }, HEARTBEAT_INACTIVE_MS);
  void tickInactiveAccountsHeartbeat();
}

function broadcastAccountStatusIfChanged(next: Record<string, AccountSessionStatus>) {
  const st = ensureState();
  const prev = st.accountStatusById;
  let changed = Object.keys(prev).length !== Object.keys(next).length;
  if (!changed) {
    for (const k of Object.keys(next)) {
      if (prev[k] !== next[k]) {
        changed = true;
        break;
      }
    }
  }
  if (!changed) return;
  st.accountStatusById = next;
  const nextActivity = { ...st.activityByAccount };
  let activityChanged = false;
  for (const k of Object.keys(next)) {
    const snap = nextActivity[k];
    if (snap && snap.status !== next[k]) {
      nextActivity[k] = { ...snap, status: next[k]! };
      activityChanged = true;
    }
  }
  if (activityChanged) broadcastActivityIfChanged(nextActivity);
  refreshTrayIcon();
  try {
    void st.shellView.webContents.send("accounts:statusChanged", next);
  } catch {
    // ignore
  }
}

function buildTrayTooltipSummary(): string {
  const st = ensureState();
  if (st.accounts.length === 0) return APP_NAME;
  const parts = st.accounts.map((a) => {
    const unread = clampTrayBadge(st.unreadByAccount[a.id] ?? 0);
    const status = st.accountStatusById[a.id] ?? "loading";
    const mark = STATUS_SHORT[status];
    const unreadBit = unread > 0 ? ` · ${unread}` : "";
    return `${a.label} ${mark}${unreadBit}`;
  });
  return `${APP_NAME} — ${parts.join(" | ")}`;
}

function trayAccountMenuLabel(a: Account): string {
  const st = ensureState();
  const unread = clampTrayBadge(st.unreadByAccount[a.id] ?? 0);
  const status = st.accountStatusById[a.id] ?? "loading";
  const statusLabel = tMain(`sessionStatus.${status}`);
  const unreadBit = unread > 0 ? tMain("main.accountMenu.unread", { count: unread }) : "";
  const activeBit = a.id === st.activeId ? tMain("main.accountMenu.active") : "";
  return `${a.label} (${statusLabel}${unreadBit})${activeBit}`;
}

function emptyActivitySnapshot(status: AccountSessionStatus = "loading"): AccountActivitySnapshot {
  return {
    unread: 0,
    status,
    lastSender: null,
    lastPreview: null,
    lastActivityAt: null,
    unreadChats: [],
  };
}

function broadcastActivityIfChanged(next: AccountActivityMap) {
  const st = ensureState();
  if (activityMapsEqual(st.activityByAccount, next)) return;
  st.activityByAccount = next;
  try {
    void st.shellView.webContents.send("accounts:activityChanged", next);
  } catch {
    /* shellView puede no estar lista todavía en arranque */
  }
}

function applyAccountActivity(id: string, snapshot: AccountActivitySnapshot, notify: boolean) {
  const st = ensureState();
  const prevUnread = clampTrayBadge(st.unreadByAccount[id] ?? 0);
  broadcastActivityIfChanged({ ...st.activityByAccount, [id]: snapshot });
  broadcastUnreadIfChanged({ ...st.unreadByAccount, [id]: snapshot.unread });
  if (notify && snapshot.unread > prevUnread) {
    maybeNotifyActivityIncrease(id, prevUnread, {
      unread: snapshot.unread,
      lastSender: snapshot.lastSender,
      lastPreview: snapshot.lastPreview,
    });
  }
}

/** Compara el snapshot guardado con uno nuevo y, si difiere, lo persiste y
 * notifica al renderer para que actualice los puntos del rail. */
function broadcastUnreadIfChanged(next: Record<string, number>) {
  const st = ensureState();
  const prev = st.unreadByAccount;
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  let changed = prevKeys.length !== nextKeys.length;
  if (!changed) {
    for (const k of nextKeys) {
      if ((prev[k] ?? 0) !== (next[k] ?? 0)) {
        changed = true;
        break;
      }
    }
  }
  if (!changed) return;
  st.unreadByAccount = next;
  recomputeTrayUnreadTotal();
  refreshTrayIcon();
  refreshDockBadge();
  try {
    void st.shellView.webContents.send("accounts:unreadChanged", next);
  } catch {
    /* shellView puede no estar lista todavía en arranque */
  }
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
          title: tMain("main.dialogs.saveFile"),
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
      const savePath = item.getSavePath();
      dbgEmbed("download done", {
        state,
        path: savePath,
        filename: item.getFilename(),
      });
      if (
        state === "completed" &&
        savePath &&
        st.settings.general.openDownloadsWithDefaultApp !== false
      ) {
        void openPathWithDefaultApp(savePath);
      }
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
        (details as any)?.requestingUrl || (details as any)?.requestingURL || wc.getURL?.() || "";
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
  if (isQuitting) return;
  const st = ensureState();
  recomputeTrayUnreadTotal();
  refreshDockBadge();
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
  st.suspendedAccountIds.delete(id);
  const existing = st.viewsById.get(id);
  if (existing) return existing;

  const ses = ensureElectronSessionForAccount(id);
  attachDownloadHandlersOnce(ses);
  attachPermissionHandlersOnce(ses);
  const view = new WebContentsView({
    webPreferences: buildWhatsAppWebPreferences(ses),
  });
  view.setBackgroundColor(WHATSAPP_VIEW_BG);
  try {
    const z = st.settings?.general?.uiScale ?? 1;
    if (Number.isFinite(z)) view.webContents.setZoomFactor(Math.max(0.75, Math.min(2, z)));
  } catch {
    // ignore
  }
  view.webContents.setUserAgent(buildWhatsAppWebUserAgent());
  void view.webContents.loadURL(E2E_MODE ? "about:blank" : WHATSAPP_URL);

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
    handleCatripShortcutBeforeInput(event, input);
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
    },
  );
  view.webContents.on("did-start-loading", () => {
    dbgEmbed("whatsapp webContents did-start-loading", { accountId: id });
  });

  dbgEmbed("ensureViewForAccount created WebContentsView (whatsapp)", { accountId: id });

  st.viewsById.set(id, view);
  applyWhatsAppViewThrottle(view.webContents, resolveBackgroundThrottleTier(st.chrome.zen));
  void enforceMaxLiveAccounts();
  return view;
}

/** Oculta WhatsApp y muestra el shell a pantalla completa (p. ej. modo Zen tapando la UI). */
function prepareShellForMenuUi() {
  const st = ensureState();
  dbgMenu("prepareShellForMenuUi", {
    mode: st.chrome.mode,
    zen: st.chrome.zen,
    rendererModalOpen,
    attachedViewId: st.attachedViewId,
  });
  detachBrowserView();
  layoutActiveView();
  raiseChildView(st.win, st.shellView);
}

const SHELL_MENU_IPC_CHANNELS = new Set([
  "ui:openSettings",
  "ui:openQuickSwitcher",
  "ui:openActivityCenter",
  "ui:openPendingInbox",
  "ui:openUrgentNow",
  "ui:openPhoneChat",
  "ui:openShortcutsHelp",
  "ui:openAbout",
  "ui:openUserManual",
]);

/** Entrega IPC al shell y, como respaldo, dispara CustomEvent en el DOM del renderer. */
function sendToShell(channel: string, ...args: unknown[]) {
  const st = ensureState();
  const wc = st.shellView.webContents;
  if (wc.isDestroyed()) return;

  const deliver = () => {
    dbgMenu("sendToShell", { channel, url: wc.getURL(), loading: wc.isLoading() });
    try {
      wc.focus();
    } catch {
      /* ignore */
    }
    wc.send(channel, ...args);
    if (SHELL_MENU_IPC_CHANNELS.has(channel)) {
      void wc
        .executeJavaScript(
          `(function(){try{window.dispatchEvent(new CustomEvent("catrip:shell-menu",{detail:{channel:${JSON.stringify(channel)}}}))}catch(e){console.error("[catrip-shell-menu]",e)}})()`,
          true,
        )
        .catch((err) => dbgMenu("sendToShell dom fallback failed", { channel, err: String(err) }));
    }
  };

  if (wc.isLoading()) {
    wc.once("did-finish-load", deliver);
    return;
  }
  deliver();
}

function openSettingsFromMenu() {
  const st = ensureState();
  dbgMenu("openSettingsFromMenu");
  showMainWindow();
  st.chrome.mode = "settings";
  if (st.chrome.zen) {
    st.chrome.zen = false;
    sendToShell("ui:zenChanged", false);
  }
  detachBrowserView();
  refreshMenus();
  layoutActiveView();
  raiseChildView(st.win, st.shellView);
  sendToShell("ui:openSettings");
}

function openShellPanelFromMenu(channel: string, ...args: unknown[]) {
  const st = ensureState();
  if (st.chrome.mode !== "browser") return;
  dbgMenu("openShellPanelFromMenu", { channel, args });
  showMainWindow();
  rendererModalOpen = true;
  prepareShellForMenuUi();
  sendToShell(channel, ...args);
}

function reloadAllWhatsAppViews() {
  for (const view of ensureState().viewsById.values()) {
    try {
      view.webContents.reload();
    } catch {
      // ignore
    }
  }
}

function toggleZenFromMain() {
  const st = ensureState();
  if (st.chrome.mode !== "browser") return;
  st.chrome.zen = !st.chrome.zen;
  void st.shellView.webContents.send("ui:zenChanged", st.chrome.zen);
  layoutActiveView();
  syncAllWhatsAppViewThrottles();
  refreshMenus();
}

/** Ejecuta un atajo de Catrip. Devuelve true si la acción se aplicó (y conviene preventDefault). */
function dispatchCatripShortcut(action: CatripShortcutAction): boolean {
  const st = ensureState();
  const inBrowser = st.chrome.mode === "browser";

  switch (action.type) {
    case "exitZen":
      if (!inBrowser || !st.chrome.zen) return false;
      st.chrome.zen = false;
      void st.shellView.webContents.send("ui:zenChanged", false);
      layoutActiveView();
      syncAllWhatsAppViewThrottles();
      refreshMenus();
      return true;
    case "settings":
      openSettingsFromMenu();
      return true;
    case "hide":
      hideMainWindow();
      return true;
    case "quit":
      requestAppQuit();
      return true;
    case "quickSwitcher":
      if (!inBrowser) return false;
      openShellPanelFromMenu("ui:openQuickSwitcher");
      return true;
    case "fullscreen":
      st.win.setFullScreen(!st.win.isFullScreen());
      return true;
    case "toggleZen":
      if (!inBrowser) return false;
      toggleZenFromMain();
      return true;
    case "urgentNow":
      if (!inBrowser) return false;
      openShellPanelFromMenu("ui:openUrgentNow");
      return true;
    case "reload":
      reloadAllWhatsAppViews();
      return true;
    case "newChat":
      if (!inBrowser) return false;
      triggerNewChatInActiveView();
      return true;
    case "phoneChat":
      if (!inBrowser) return false;
      openShellPanelFromMenu("ui:openPhoneChat");
      return true;
    case "newAccount":
      void createAccountAndNotify();
      return true;
    case "switchAccount": {
      const acc = st.accounts[action.index];
      if (!acc) return false;
      setActiveAccount(acc.id);
      return true;
    }
    default:
      return false;
  }
}

function handleCatripShortcutBeforeInput(event: Event, input: Input) {
  const action = matchCatripShortcut(input);
  if (!action) return;
  if (!dispatchCatripShortcut(action)) return;
  event.preventDefault();
}

function buildTrayMenu() {
  const st = ensureState();
  return Menu.buildFromTemplate([
    {
      label: tMain("main.tray.show"),
      click: () => showMainWindow(),
    },
    {
      label: tMain("main.tray.hide"),
      click: () => hideMainWindow(),
    },
    {
      label: tMain("main.tray.settings"),
      click: () => {
        openSettingsFromMenu();
      },
    },
    {
      label: tMain("main.tray.closeToTray"),
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
      label: tMain("main.tray.accounts"),
      submenu: st.accounts.map((a) => ({
        label: trayAccountMenuLabel(a),
        type: "radio" as const,
        checked: a.id === st.activeId,
        click: () => setActiveAccount(a.id),
      })),
    },
    { type: "separator" },
    { label: tMain("main.tray.quit"), click: () => requestAppQuit() },
  ]);
}

function buildAppMenu() {
  const st = ensureState();

  const inBrowser = () => st.chrome.mode === "browser";

  const reloadPages = () => reloadAllWhatsAppViews();

  const toggleFullscreen = () => {
    ensureState().win.setFullScreen(!ensureState().win.isFullScreen());
  };

  const toggleZen = () => toggleZenFromMain();

  const accountsMenu = st.accounts.map((a, idx) => ({
    label: a.label,
    type: "radio" as const,
    checked: a.id === st.activeId,
    accelerator: idx < 9 ? `Ctrl+${idx + 1}` : undefined,
    click: () => setActiveAccount(a.id),
  }));

  return Menu.buildFromTemplate([
    {
      label: tMain("main.menus.file"),
      submenu: [
        {
          label: tMain("main.menus.settings"),
          accelerator: "Ctrl+P",
          click: () => openSettingsFromMenu(),
        },
        { type: "separator" },
        { label: tMain("main.menus.hide"), accelerator: "Ctrl+W", click: () => hideMainWindow() },
        { label: tMain("main.menus.quit"), accelerator: "Ctrl+Q", click: () => requestAppQuit() },
      ],
    },
    {
      label: tMain("main.menus.view"),
      submenu: [
        {
          label: tMain("main.menus.quickSwitch"),
          accelerator: "Ctrl+K",
          click: () => inBrowser() && openShellPanelFromMenu("ui:openQuickSwitcher"),
        },
        { type: "separator" },
        {
          label: tMain("main.menus.fullscreen"),
          accelerator: "F11",
          click: () => toggleFullscreen(),
        },
        {
          label: tMain("main.menus.zenMode"),
          accelerator: "Ctrl+Shift+Z",
          type: "checkbox" as const,
          checked: st.chrome.zen,
          click: () => toggleZen(),
        },
        {
          label: tMain("main.menus.urgentNow"),
          accelerator: "Ctrl+Shift+A",
          click: () => inBrowser() && openShellPanelFromMenu("ui:openUrgentNow"),
        },
      ],
    },
    {
      label: tMain("main.menus.chat"),
      submenu: [
        { label: tMain("main.menus.reload"), accelerator: "F5", click: () => reloadPages() },
        { type: "separator" },
        {
          label: tMain("main.menus.newChat"),
          accelerator: "Ctrl+N",
          click: () => inBrowser() && void triggerNewChatInActiveView(),
        },
        {
          label: tMain("main.menus.phoneChat"),
          accelerator: "Ctrl+M",
          click: () => inBrowser() && openShellPanelFromMenu("ui:openPhoneChat"),
        },
      ],
    },
    {
      label: tMain("main.menus.accounts"),
      submenu: [
        {
          label: tMain("main.menus.newAccount"),
          accelerator: "Ctrl+U",
          click: () => void createAccountAndNotify(),
        },
        { type: "separator" },
        ...accountsMenu,
      ],
    },
    {
      label: tMain("main.menus.help"),
      submenu: [
        {
          label: tMain("main.menus.userManual"),
          click: () => openShellPanelFromMenu("ui:openUserManual"),
        },
        {
          label: tMain("main.menus.shortcuts"),
          click: () => openShellPanelFromMenu("ui:openShortcutsHelp"),
        },
        { label: tMain("main.menus.about"), click: () => openShellPanelFromMenu("ui:openAbout") },
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

function broadcastWhatsAppLoadState() {
  const st = viewState;
  if (!st) return;
  try {
    void st.shellView.webContents.send("ui:whatsappLoadState", st.whatsappLoadOverlay);
  } catch {
    // ignore
  }
}

function beginWhatsAppLoadOverlay(accountId: string) {
  const st = ensureState();
  const acc = st.accounts.find((a) => a.id === accountId);
  st.whatsappLoadOverlay = { accountId, label: acc?.label ?? "WhatsApp" };
  broadcastWhatsAppLoadState();
}

function endWhatsAppLoadOverlay(accountId: string) {
  const st = viewState;
  if (!st?.whatsappLoadOverlay || st.whatsappLoadOverlay.accountId !== accountId) return;
  st.whatsappLoadOverlay = null;
  broadcastWhatsAppLoadState();
}

function registerWhatsAppLoadCompletion(accountId: string, view: WebContentsView) {
  const wc = view.webContents;
  if (whatsappLoadCompletionHooked.has(wc)) return;
  whatsappLoadCompletionHooked.add(wc);
  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    onWhatsAppLoadSettled(accountId);
  };
  wc.once("did-finish-load", finish);
  wc.once("did-fail-load", finish);
  try {
    if (!wc.isLoading()) finish();
  } catch {
    /* ignore */
  }
}

function onWhatsAppLoadSettled(accountId: string) {
  const st = viewState;
  if (!st) return;
  endWhatsAppLoadOverlay(accountId);
  if (st.activeId === accountId && st.chrome.mode === "browser" && !rendererModalOpen) {
    attachBrowserViewForAccount(accountId);
  } else {
    layoutActiveView();
  }
  syncAllWhatsAppViewThrottles();
}

function syncAllWhatsAppViewThrottles() {
  const st = viewState;
  if (!st || E2E_MODE) return;
  const attachedId = st.attachedViewId;
  const bgTier = resolveBackgroundThrottleTier(st.chrome.zen);
  for (const [accountId, view] of st.viewsById) {
    if (view.webContents.isDestroyed()) continue;
    const tier = accountId === attachedId ? "active" : bgTier;
    applyWhatsAppViewThrottle(view.webContents, tier);
  }
}

function layoutActiveView() {
  const st = ensureState();
  const win = st.win;
  const bounds = win.getContentBounds();

  // Ajustes / modal / sin vista adjunta: shell a pantalla completa.
  if (st.chrome.mode === "settings" || rendererModalOpen) {
    st.shellView.setVisible(true);
    st.shellView.setBounds({ x: 0, y: 0, width: bounds.width, height: bounds.height });
    raiseChildView(win, st.shellView);
    return;
  }

  const top = st.chrome.zen ? 0 : st.chrome.topHeight;
  const innerH = Math.max(0, bounds.height - top);

  // Reactivación tras suspensión: shell a pantalla completa con placeholder en el renderer.
  if (st.whatsappLoadOverlay) {
    st.shellView.setVisible(true);
    st.shellView.setBounds({ x: 0, y: top, width: bounds.width, height: innerH });
    raiseChildView(win, st.shellView);
    const loadingView = st.viewsById.get(st.whatsappLoadOverlay.accountId);
    if (loadingView) safeRemoveChildView(win, loadingView);
    return;
  }

  const aid = st.attachedViewId;
  if (!aid) {
    st.shellView.setVisible(true);
    st.shellView.setBounds({ x: 0, y: 0, width: bounds.width, height: bounds.height });
    raiseChildView(win, st.shellView);
    return;
  }

  const view = ensureViewForAccount(aid);
  const sidebar = st.chrome.zen ? 0 : st.chrome.sidebarWidth;

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
  // En modo E2E el shell vive en la BrowserWindow principal y no queremos que
  // las WebContentsView de cuentas (que cargan about:blank) lo tapen.
  if (E2E_MODE) {
    dbgEmbed("attachBrowserViewForAccount skipped (E2E_MODE)", { id });
    return;
  }
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
    syncAllWhatsAppViewThrottles();
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
  syncAllWhatsAppViewThrottles();
}

function setActiveAccount(id: string) {
  const st = ensureState();
  if (!st.accounts.find((a) => a.id === id)) return;
  const wasSuspended = st.suspendedAccountIds.has(id);
  st.activeId = id;
  touchAccountActive(id);
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });

  if (st.chrome.mode === "browser" && !rendererModalOpen) {
    if (wasSuspended && !E2E_MODE) {
      if (st.attachedViewId && st.attachedViewId !== id) {
        const old = st.viewsById.get(st.attachedViewId);
        if (old) safeRemoveChildView(st.win, old);
        st.attachedViewId = null;
      }
      beginWhatsAppLoadOverlay(id);
      const view = ensureViewForAccount(id);
      registerWhatsAppLoadCompletion(id, view);
      layoutActiveView();
    } else {
      attachBrowserViewForAccount(id);
    }
  }
  dbgEmbed("setActiveAccount", {
    id,
    mode: st.chrome.mode,
    rendererModalOpen,
    attachedViewId: st.attachedViewId,
  });
  void st.shellView.webContents.send("accounts:activeChanged", st.activeId);
  refreshMenus();
  void tickActiveAccountHeartbeat();
}

let pendingIncomingWhatsAppUrl: string | null = null;
let pendingIncomingPicker: { raw: string; link: WhatsAppIncomingLink } | null = null;
let e2eLastIncomingNavigation: { accountId: string; url: string } | null = null;

type IncomingLinkAccountResolution = "pick" | string | null;

function resolveIncomingLinkAccountId(st: {
  accounts: Account[];
  activeId: string | null;
  settings: Settings;
}): IncomingLinkAccountResolution {
  const g = st.settings.general;
  if (g.incomingLinkMode === "fixed") {
    const id = g.incomingLinkFixedAccountId;
    if (id && st.accounts.some((a) => a.id === id)) return id;
    return st.activeId ?? st.accounts[0]?.id ?? null;
  }
  if (g.incomingLinkMode === "active") {
    return st.activeId ?? st.accounts[0]?.id ?? null;
  }
  if (st.accounts.length === 1) return st.accounts[0].id;
  if (st.accounts.length > 1) return "pick";
  return st.activeId ?? null;
}

function focusMainWindow() {
  showMainWindow();
}

function ensureBrowserModeFromMain(st: NonNullable<typeof viewState>) {
  if (st.chrome.mode === "browser") return;
  st.chrome.mode = "browser";
  if (st.activeId && !rendererModalOpen) attachBrowserViewForAccount(st.activeId);
  void st.shellView.webContents.send("ui:modeChanged", "browser");
  refreshMenus();
  restartBackgroundHeartbeat();
  layoutActiveView();
}

function loadWhatsAppIncomingInAccount(accountId: string, link: WhatsAppIncomingLink) {
  const st = ensureState();
  if (!st.accounts.some((a) => a.id === accountId)) return;
  const target = resolveTargetUrl(link);
  e2eLastIncomingNavigation = { accountId, url: target };
  focusMainWindow();
  ensureBrowserModeFromMain(st);
  if (st.activeId !== accountId) setActiveAccount(accountId);
  const view = ensureViewForAccount(accountId);
  void view.webContents.loadURL(target);
  if (!E2E_MODE) attachBrowserViewForAccount(accountId);
  else layoutActiveView();
  dbgEmbed("loadWhatsAppIncomingInAccount", { accountId, link, target, e2e: E2E_MODE });
}

function queueOrHandleIncomingWhatsAppUrl(raw: string) {
  const link = parseWhatsAppIncomingUrl(raw);
  if (!link) return;
  if (!viewState) {
    pendingIncomingWhatsAppUrl = raw;
    dbgEmbed("queue incoming WhatsApp URL (app not ready)", { raw });
    return;
  }
  const st = ensureState();
  const target = resolveIncomingLinkAccountId(st);
  if (target === "pick") {
    pendingIncomingPicker = { raw, link };
    void st.shellView.webContents.send("ui:pickAccountForIncomingLink", {
      preview:
        link.kind === "phone"
          ? `+${link.digits}`
          : link.kind === "groupInvite"
            ? "Invitación a grupo"
            : raw,
      hasText: link.kind === "phone" && !!link.text,
    });
    focusMainWindow();
    return;
  }
  if (!target) return;
  loadWhatsAppIncomingInAccount(target, link);
}

function flushPendingIncomingWhatsAppUrl() {
  const raw = pendingIncomingWhatsAppUrl;
  if (!raw) return;
  pendingIncomingWhatsAppUrl = null;
  queueOrHandleIncomingWhatsAppUrl(raw);
}

function registerWhatsAppProtocolClient() {
  if (E2E_MODE) return;
  const scheme = "whatsapp";
  try {
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(scheme, process.execPath, [path.resolve(process.argv[1])]);
        return;
      }
    }
    app.setAsDefaultProtocolClient(scheme);
    dbgEmbed("registered default protocol client", { scheme, packaged: app.isPackaged });
  } catch (err) {
    dbgEmbed("setAsDefaultProtocolClient failed", { err: String(err) });
  }
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
  void view.webContents.loadURL(buildWhatsAppSendUrl(digits));
}

function openChatByName(accountId: string, chatName: string) {
  const st = ensureState();
  const name = String(chatName || "").trim();
  if (!name) return;
  if (!st.accounts.some((a) => a.id === accountId)) return;
  ensureBrowserModeFromMain(st);
  if (st.activeId !== accountId) setActiveAccount(accountId);
  attachBrowserViewForAccount(accountId);
  focusMainWindow();
  const view = ensureViewForAccount(accountId);
  const js = buildWhatsAppOpenChatByNameJs(name);
  void view.webContents.executeJavaScript(js, true).catch(() => {});
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
      getTitle: () => buildTrayTooltipSummary(),
      getIcon: () => {
        const img = trayNativeImage(trayModeForPlatform(), getEffectiveTrayBadge());
        // Si por cualquier motivo el SVG->PNG falla, usar el icono principal como fallback.
        if (!img.isEmpty()) return img;
        const appIcon = getAppIconNativeImage();
        if (!appIcon.isEmpty())
          return applyTrayGreenTint(appIcon.resize({ width: 128, height: 128 }));
        // Fallback ultra seguro: PNG 1x1 (evita IconPixmap vacío).
        try {
          return nativeImage.createFromDataURL(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBApWf7QAAAABJRU5ErkJggg==",
          );
        } catch {
          return nativeImage.createEmpty();
        }
      },
      onActivate: () => {
        try {
          showMainWindow();
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
          showMainWindow();
        } catch {
          // ignore
        }
      },
      onHide: () => {
        try {
          hideMainWindow();
        } catch {
          // ignore
        }
      },
      onSettings: () => {
        try {
          openSettingsFromMenu();
        } catch {
          // ignore
        }
      },
      onQuit: () => requestAppQuit(),
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
      st.tray = {
        kind: "electron",
        tray: new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon),
      };
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
    void tray
      .ready()
      .then(() => {
        backend.ready = true;
        dbgEmbed("systray2 ready", {
          binPath: (tray as any).binPath,
          killed: (tray as any).killed,
        });
        rebuildSystray2Handlers(backend);
        // Ahora sí permitir updates (badge, cuentas, etc.)
        refreshTrayMenu();
        refreshTrayIcon();
        void tray
          .onClick((action) => {
            const id = action?.item?.__id;
            const fn = backend.handlerByInternalId.get(id);
            if (fn) fn();
          })
          .catch(() => {});
      })
      .catch((e) => {
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
      trayAccountMenuLabel(a),
      () => setActiveAccount(a.id),
      // systray2 no tiene radio; usamos check para mostrar la activa.
      { checked: a.id === st.activeId },
    ),
  );

  const summary = buildTrayTooltipSummary();

  return {
    icon: trayIconPngPath(),
    title: summary,
    tooltip: summary,
    items: [
      mk(tMain("main.tray.show"), () => showMainWindow()),
      mk(tMain("main.tray.hide"), () => hideMainWindow()),
      mk(tMain("main.tray.settings"), () => {
        openSettingsFromMenu();
      }),
      mk(
        tMain("main.tray.closeToTray"),
        () => {
          const next = {
            ...st.settings,
            general: { ...st.settings.general, closeToTray: !st.settings.general.closeToTray },
          };
          st.settings = next;
          saveSettings(next);
          refreshTrayMenu();
        },
        { checked: !!st.settings.general.closeToTray },
      ),
      SysTrayCtor.separator,
      {
        title: tMain("main.tray.accounts"),
        tooltip: tMain("main.tray.accounts"),
        enabled: true,
        items: accountsItems,
      },
      SysTrayCtor.separator,
      mk(tMain("main.tray.quit"), () => requestAppQuit()),
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
  registerWhatsAppProtocolClient();

  if (process.platform === "darwin") {
    app.on("open-url", (event, url) => {
      event.preventDefault();
      queueOrHandleIncomingWhatsAppUrl(url);
    });
  }

  const launchArgvUrl = extractWhatsAppUrlFromArgv(process.argv);
  if (launchArgvUrl) pendingIncomingWhatsAppUrl = launchArgvUrl;

  app.on("second-instance", (_event, argv) => {
    const action = parseLaunchAction(argv);
    if (action) {
      applyLaunchAction(action);
      const url = extractWhatsAppUrlFromArgv(argv);
      if (url) queueOrHandleIncomingWhatsAppUrl(url);
      return;
    }
    focusMainWindow();
    const url = extractWhatsAppUrlFromArgv(argv);
    if (url) queueOrHandleIncomingWhatsAppUrl(url);
    else {
      for (const w of BaseWindow.getAllWindows()) {
        if (!w.isDestroyed()) raiseMainWindow(w as BrowserWindow);
        return;
      }
    }
  });
}

/**
 * Limpieza de particiones huérfanas en arranque.
 *
 * Chromium persiste las cookies/storage de cada `session.fromPartition(...)`
 * bajo `<userData>/Partitions/<nombre>`. Cuando el usuario elimina una cuenta,
 * `clearStorageData()` vacía el contenido pero la **carpeta** persiste y
 * Chromium puede acumular GBs con el tiempo si se crean y eliminan muchas
 * cuentas. Aquí, al arrancar, comparamos los directorios de `Partitions/`
 * con la lista viva de cuentas y borramos los que ya no aparecen.
 *
 * El nombre puede venir como `persist:acct-<id>` (Linux/macOS) o
 * `persist%3Aacct-<id>` (Windows codifica los `:`). Manejamos ambos.
 */
function purgeOrphanPartitions(liveAccountIds: string[]): {
  purged: string[];
  failed: { dir: string; err: string }[];
} {
  const result: {
    purged: string[];
    failed: { dir: string; err: string }[];
  } = { purged: [], failed: [] };
  try {
    const partitionsDir = path.join(app.getPath("userData"), "Partitions");
    if (!fs.existsSync(partitionsDir)) return result;
    const liveIds = new Set(liveAccountIds);
    const entries = fs.readdirSync(partitionsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const decoded = (() => {
        try {
          return decodeURIComponent(entry.name);
        } catch {
          return entry.name;
        }
      })();
      const m = decoded.match(/^persist:acct-(.+)$/);
      if (!m) continue;
      const id = m[1];
      if (liveIds.has(id)) continue;
      const fullPath = path.join(partitionsDir, entry.name);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        result.purged.push(entry.name);
      } catch (err) {
        result.failed.push({ dir: entry.name, err: String(err) });
      }
    }
  } catch (err) {
    dbgEmbed("purgeOrphanPartitions failed (top-level)", {
      err: String(err),
    });
  }
  return result;
}

initUpdateDialogBridge();

function bindUpdateDialogShellTarget() {
  setUpdateDialogShellTarget(() => {
    const st = viewState;
    if (!st?.shellView?.webContents || st.shellView.webContents.isDestroyed()) return undefined;
    return st.shellView.webContents;
  });
  setUpdateDialogWindowFocus(() => focusMainWindow());
}

app.whenReady().then(async () => {
  const s = loadAccountsState();
  const settings = loadSettings();
  await initMainI18n(settings.general.language, app.getLocale());
  if (s.accounts.length === 0) {
    createAccount(s, tMain("common.accountDefault", { n: 1 }));
    saveAccountsState(s);
  }

  // AppImage: instalar .desktop e iconos en ~/.local/share/ para que el dock muestre el icono correcto.
  integrateAppImageDesktop();

  // Limpia particiones huérfanas en disco antes de crear cualquier `session.fromPartition`,
  // para que Chromium no las re-aproveche con datos viejos accidentalmente.
  const purgeReport = purgeOrphanPartitions(s.accounts.map((a) => a.id));
  if (purgeReport.purged.length > 0 || purgeReport.failed.length > 0) {
    dbgEmbed("purgeOrphanPartitions report", {
      purged: purgeReport.purged,
      failed: purgeReport.failed,
    });
  }

  // Inicializa el estado antes de crear la ventana (para startMinimized).
  viewState = {
    win: null as any,
    shellView: null as any,
    accounts: s.accounts,
    activeId: s.activeId ?? s.accounts[0]?.id ?? null,
    viewsById: new Map(),
    settings,
    chrome: { sidebarWidth: 72, topHeight: 0, zen: !!settings.general.zen, mode: "browser" },
    attachedViewId: null,
    trayUnreadDetected: 0,
    unreadByAccount: {},
    activityByAccount: {},
    accountStatusById: {},
    accountLastActiveAt: {},
    suspendedAccountIds: new Set(),
    whatsappLoadOverlay: null,
  };

  const { win, shellView } = createMainWindow();
  viewState.win = win;
  viewState.shellView = shellView;
  bindUpdateDialogShellTarget();

  if (!E2E_MODE) createTray();
  refreshMenus();
  void applySettingsToRuntime(settings);

  nativeTheme.on("updated", () => {
    refreshTrayIcon();
  });

  // Activar cuenta al arrancar (antes del layout para no fullscreen el shell sin WhatsApp).
  if (viewState.activeId) setActiveAccount(viewState.activeId);
  else layoutActiveView();

  flushPendingIncomingWhatsAppUrl();

  initNotificationHub({
    getSettings: () => ensureState().settings,
    getAccounts: () => ensureState().accounts,
    focusAndActivateAccount: (accountId) => {
      focusMainWindow();
      setActiveAccount(accountId);
    },
  });

  if (viewState.settings.general.checkForUpdates) {
    setupAutoUpdater({
      getUpdateChannel: () =>
        ensureState().settings.general.updateChannel === "beta" ? "beta" : "stable",
    });
  }

  restartBackgroundHeartbeat();

  startCallSessionGuard({
    getEnabled: () => ensureState().settings.performance.inhibitSleepDuringCall !== false,
    evalAnyCallActive: evalAnyWhatsAppCallActive,
  });

  applyLaunchAction(pendingLaunchAction);
  pendingLaunchAction = null;

  if (app.isPackaged) registerWhatsAppProtocolLinux();

  // Sincronizar Zen persistido con el renderer (p. ej. rail oculto al arrancar).
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
      hideMainWindow();
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
  if (process.platform !== "darwin") requestAppQuit();
});

app.on("before-quit", (e) => {
  isQuitting = true;
  persistWindowStateNow();
  if (trayDisposed) return;
  e.preventDefault();
  void disposeTrayBackend().finally(() => app.quit());
});

ipcMain.handle("diagnostics:performance", async () => {
  try {
    const st = ensureState();
    const data = collectPerformanceDiagnostics({
      getSettings: () => st.settings,
      getAppVersion: getApplicationVersionForDisplay,
      getAccounts: () => st.accounts,
      getActiveAccountId: () => st.activeId,
      getAttachedViewId: () => st.attachedViewId,
      getSuspendedIds: () => st.suspendedAccountIds,
      getViewForAccount: (id) => st.viewsById.get(id),
      getHeartbeatStats: () => ({
        totalExecutions: heartbeatExecutionCount,
        lastExecutionAt: heartbeatLastExecutionAt,
      }),
    });
    return { ok: true as const, data };
  } catch (e) {
    return {
      ok: false as const,
      code: "exception",
      message: e instanceof Error ? e.message : String(e),
    };
  }
});

ipcMain.handle("diagnostics:whatsappMedia", async () => {
  try {
    const st = ensureState();
    const id = st.activeId;
    if (!id) {
      return {
        ok: false as const,
        code: "no_account",
        message: tMain("main.diagnostics.noActiveAccount"),
      };
    }
    const view = ensureViewForAccount(id);
    const wc = view.webContents;
    if (wc.isDestroyed()) {
      return {
        ok: false as const,
        code: "destroyed",
        message: tMain("main.diagnostics.viewUnavailable"),
      };
    }
    const url = wc.getURL();
    if (!url.includes("web.whatsapp.com")) {
      return {
        ok: false as const,
        code: "not_whatsapp",
        message: tMain("main.diagnostics.whatsappNotLoaded"),
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

ipcMain.handle("storage:clearHttpCacheAll", async () => {
  const st = ensureState();
  try {
    for (const acc of st.accounts) {
      const ses = ensureElectronSessionForAccount(acc.id);
      try {
        await ses.clearCache();
      } catch {
        // ignore per account
      }
    }
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle("tray:setBadgeCount", (_evt, raw: unknown) => {
  const st = ensureState();
  const n = typeof raw === "number" ? raw : Number(raw);
  st.trayUnreadDetected = Number.isFinite(n) ? clampTrayBadge(n) : 0;
  refreshTrayIcon();
});

/** Versión para IPC; lee el `package.json` del asar (misma fuente que el build), más fiable que `app.getVersion()` en algunos AppImage/Linux. */
function getApplicationVersionForDisplay(): string {
  try {
    const pkgPath = path.join(app.getAppPath(), "package.json");
    const raw = fs.readFileSync(pkgPath, "utf-8");
    const pkg = JSON.parse(raw) as { version?: unknown };
    if (typeof pkg.version === "string" && pkg.version.trim()) return pkg.version.trim();
  } catch {
    /* ignore */
  }
  try {
    return app.getVersion();
  } catch {
    return "0.0.0";
  }
}

ipcMain.handle("app:getVersion", () => getApplicationVersionForDisplay());

ipcMain.handle("dev:getContext", () => {
  if (app.isPackaged) return null;
  return buildDevContext(E2E_MODE);
});

ipcMain.handle("updater:previewUpdateDialog", async () => {
  if (app.isPackaged) return false;
  const candidates = [
    path.join(app.getAppPath(), "_scripts", "release-notes-v1.5.0.md"),
    path.join(process.cwd(), "_scripts", "release-notes-v1.5.0.md"),
  ];
  let raw = "";
  for (const notesPath of candidates) {
    try {
      raw = fs.readFileSync(notesPath, "utf8");
      if (raw.trim()) break;
    } catch {
      // try next path
    }
  }
  if (!raw.trim()) return false;
  const releaseNotes = formatReleaseNotesForUpdateDialog(raw);
  try {
    await showUpdateDialogRequest({
      title: tMain("main.updates.newVersion"),
      message: tMain("main.updates.newVersionMessage", { version: "1.5.0" }),
      releaseNotes,
      footerHint: tMain("main.updates.previewFooterHint"),
      releaseUrl: releaseNotesGithubUrl("1.5.0"),
      buttons: [
        { id: "download", label: tMain("main.updates.download"), primary: true },
        { id: "link", label: tMain("main.updates.downloadLinkOnly") },
        { id: "later", label: tMain("main.updates.later") },
      ],
    });
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle("accounts:list", () => {
  const st = ensureState();
  return st.accounts;
});

ipcMain.handle("accounts:getActiveId", () => {
  const st = ensureState();
  return st.activeId;
});

ipcMain.handle("accounts:getUnread", () => {
  const st = ensureState();
  return { ...st.unreadByAccount };
});

ipcMain.handle("accounts:getActivity", () => {
  const st = ensureState();
  return { ...st.activityByAccount };
});

ipcMain.handle("accounts:create", (_evt, label?: string) => {
  return createAccountAndNotify(label);
});

ipcMain.handle("accounts:createV2", (_evt, payload?: { label?: string; icon?: unknown }) => {
  return createAccountAndNotify(payload?.label);
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

ipcMain.handle("accounts:rename", (_evt, id: string, nextLabel: string) => {
  const st = ensureState();
  const next = renameAccount(st.accounts, id, nextLabel);
  if (!next) return null;
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  return next;
});

ipcMain.handle("accounts:getIconVariants", (_evt, id: string) => {
  const st = ensureState();
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  const ensured = ensureAccountIconVariants(st.accounts, id, 5);
  if (!ensured) return null;
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  return ensured.variants;
});

ipcMain.handle("accounts:setIconVariant", (_evt, id: string, idx: number) => {
  const st = ensureState();
  const next = setAccountIconVariant(st.accounts, id, idx);
  if (!next) return null;
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  return next;
});

ipcMain.handle("accounts:setNotificationsEnabled", (_evt, id: string, enabled: boolean) => {
  const st = ensureState();
  const next = setAccountNotificationsEnabled(st.accounts, id, enabled);
  if (!next) return null;
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  return next;
});

ipcMain.handle("accounts:setActive", (_evt, id: string) => {
  setActiveAccount(id);
});

ipcMain.handle("accounts:prewarm", (_evt, id: unknown) => {
  if (typeof id !== "string" || !id.trim()) return;
  prewarmAccountView(id.trim());
});

ipcMain.handle("accounts:reorder", (_evt, orderedIds: unknown) => {
  const st = ensureState();
  if (!Array.isArray(orderedIds)) return false;
  const ids = orderedIds.filter((x): x is string => typeof x === "string");
  if (ids.length !== st.accounts.length) return false;

  // Verificar que sea exactamente el mismo conjunto de IDs (sin dups, sin extras).
  const known = new Set(st.accounts.map((a) => a.id));
  const incoming = new Set(ids);
  if (incoming.size !== ids.length) return false;
  for (const id of ids) {
    if (!known.has(id)) return false;
  }

  const byId = new Map(st.accounts.map((a) => [a.id, a]));
  st.accounts = ids.map((id) => byId.get(id)!);
  saveAccountsState({ version: 1, accounts: st.accounts, activeId: st.activeId });
  void st.shellView.webContents.send("accounts:listChanged", st.accounts);
  refreshMenus();
  return true;
});

/**
 * Borra una cuenta por completo:
 *  1. Detacha y destruye su `WebContentsView` si estaba viva.
 *  2. Limpia cookies, almacenamiento local, IndexedDB, Service Workers y
 *     caché HTTP de su partición de sesión (`persist:acct-<id>`). La carpeta
 *     en disco bajo `Partitions/` queda vacía pero no se elimina (Chromium
 *     la reaprovechará si en el futuro se vuelve a crear una cuenta con el
 *     mismo id, cosa muy poco probable porque los ids son UUIDs).
 *  3. Borra la entrada en el array de cuentas y, si era la activa, elige
 *     una de reemplazo (siguiente o anterior).
 *  4. Persiste, notifica al renderer y refresca menús/tray.
 *
 * Devuelve `true` si se borró, `false` si el id no existía.
 */
ipcMain.handle("accounts:delete", async (_evt, id: string) => {
  const st = ensureState();
  dbgEmbed("accounts:delete enter", {
    id,
    has: !!st.accounts.find((a) => a.id === id),
    activeId: st.activeId,
    attachedViewId: st.attachedViewId,
    total: st.accounts.length,
  });
  if (typeof id !== "string" || !st.accounts.find((a) => a.id === id)) {
    return false;
  }

  // 1. Detach si estaba al frente.
  if (st.attachedViewId === id) {
    try {
      detachBrowserView();
    } catch (err) {
      dbgEmbed("accounts:delete detach failed", { id, err: String(err) });
    }
  }

  // 2. Destruir la WebContentsView si existía. Cuando cerramos `webContents`
  //    Electron limpia listeners por nosotros; no llamamos a
  //    `removeAllListeners()` porque podría afectar limpieza interna.
  const view = st.viewsById.get(id);
  if (view) {
    safeRemoveChildView(st.win, view);
    try {
      view.webContents.close();
    } catch (err) {
      dbgEmbed("accounts:delete webContents.close threw", {
        id,
        err: String(err),
      });
    }
    st.viewsById.delete(id);
  }
  delete st.accountLastActiveAt[id];
  st.suspendedAccountIds.delete(id);

  // 3. Limpiar datos de sesión (cookies, storage, cache). Las llamadas son
  //    asíncronas pero las dejamos correr aunque tarden; lo importante para
  //    el usuario es que la cuenta desaparezca de la UI inmediatamente.
  try {
    const ses = ensureElectronSessionForAccount(id);
    await ses.clearStorageData();
    await ses.clearCache();
  } catch (err) {
    dbgEmbed("accounts:delete clearStorageData failed", {
      id,
      err: String(err),
    });
  }

  // 4. Limpiar contador de no leídos y actividad.
  if (st.unreadByAccount[id] !== undefined) {
    const next = { ...st.unreadByAccount };
    delete next[id];
    st.unreadByAccount = next;
    try {
      void st.shellView.webContents.send("accounts:unreadChanged", next);
    } catch {
      /* shellView puede no estar lista */
    }
  }
  if (st.activityByAccount[id] !== undefined) {
    const nextAct = { ...st.activityByAccount };
    delete nextAct[id];
    st.activityByAccount = nextAct;
    try {
      void st.shellView.webContents.send("accounts:activityChanged", nextAct);
    } catch {
      /* ignore */
    }
  }

  // 5. Mutar el array y recalcular el activo.
  const result = deleteAccount(st.accounts, st.activeId, id);
  if (!result) return false;
  st.activeId = result.newActiveId;

  // 6. Persistir y notificar.
  saveAccountsState({
    version: 1,
    accounts: st.accounts,
    activeId: st.activeId,
  });
  try {
    void st.shellView.webContents.send("accounts:listChanged", st.accounts);
    void st.shellView.webContents.send("accounts:activeChanged", st.activeId);
  } catch {
    /* ignore */
  }
  broadcastSuspensionIfChanged();

  // 7. Si quedó otra cuenta activa, atacharla en el área principal.
  if (st.activeId && st.chrome.mode === "browser" && !rendererModalOpen) {
    setActiveAccount(st.activeId);
  }

  refreshMenus();
  dbgEmbed("accounts:delete done", {
    id,
    newActiveId: st.activeId,
    remaining: st.accounts.length,
  });
  return true;
});

ipcMain.handle("chat:openByPhone", (_evt, phoneRaw: string) => {
  openChatByPhone(phoneRaw);
});

ipcMain.handle("chat:openByName", (_evt, accountId: string, chatName: string) => {
  openChatByName(accountId, chatName);
});

ipcMain.handle("chat:triggerNewChat", () => {
  triggerNewChatInActiveView();
});

ipcMain.handle("incomingLink:confirmAccount", (_evt, accountId: string) => {
  const pending = pendingIncomingPicker;
  if (!pending || typeof accountId !== "string" || !accountId.trim()) return false;
  pendingIncomingPicker = null;
  loadWhatsAppIncomingInAccount(accountId.trim(), pending.link);
  return true;
});

ipcMain.handle("incomingLink:cancel", () => {
  pendingIncomingPicker = null;
  return true;
});

if (E2E_MODE) {
  ipcMain.handle("e2e:getLastIncomingNavigation", () => e2eLastIncomingNavigation);
  ipcMain.handle("e2e:parseWhatsAppUrl", (_evt, raw: string) =>
    parseWhatsAppIncomingUrl(typeof raw === "string" ? raw : ""),
  );
  ipcMain.handle("e2e:simulateIncomingUrl", (_evt, raw: string) => {
    queueOrHandleIncomingWhatsAppUrl(typeof raw === "string" ? raw : "");
    return true;
  });
}

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

ipcMain.handle("desktop:registerWhatsAppProtocol", async () => {
  if (app.isPackaged) {
    return runBundledRegisterScript();
  }
  return registerWhatsAppProtocolForUser();
});

ipcMain.handle("accounts:getStatus", () => {
  const st = ensureState();
  return st.accountStatusById;
});

ipcMain.handle("accounts:getSuspended", () => {
  const st = ensureState();
  return getSuspendedMapForState(st);
});

ipcMain.handle("dialog:selectDownloadsDirectory", async () => {
  const st = ensureState();
  const res = await dialog.showOpenDialog(st.win, {
    title: tMain("main.dialogs.chooseDownloads"),
    properties: ["openDirectory", "createDirectory"],
  });
  if (res.canceled) return null;
  return res.filePaths[0] || null;
});

ipcMain.handle("ui:setChromeMetrics", (_evt, m: { sidebarWidth: number; topHeight: number }) => {
  const st = ensureState();
  const sw = Number.isFinite(m.sidebarWidth) ? Math.max(0, Math.min(400, m.sidebarWidth)) : 72;
  const th = Number.isFinite(m.topHeight) ? Math.max(0, Math.min(200, m.topHeight)) : 0;
  dbgEmbed("ipc ui:setChromeMetrics", { raw: m, clamped: { sidebarWidth: sw, topHeight: th } });
  st.chrome.sidebarWidth = sw;
  st.chrome.topHeight = th;
  layoutActiveView();
});

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
  syncAllWhatsAppViewThrottles();
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
  restartBackgroundHeartbeat();
  if (next === "browser") void tickActiveAccountHeartbeat();
  layoutActiveView();
});
