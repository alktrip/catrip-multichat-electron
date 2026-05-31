import { app, shell } from "electron";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile, execSync } from "node:child_process";
import { promisify } from "node:util";
import { tMain } from "./i18n";

const execFileAsync = promisify(execFile);

const APP_NAME = "Catrip Connect";
export const DESKTOP_NAME = "catrip-connect.desktop";
const MIME_WHATSAPP = "x-scheme-handler/whatsapp";

function quoteExec(execPath: string): string {
  return execPath.includes(" ") ? `"${execPath}"` : execPath;
}

/** Contenido completo del `.desktop` con Desktop Actions (GNOME/KDE). */
export function buildDesktopEntryContent(execPath: string): string {
  const exec = quoteExec(execPath);
  return [
    "[Desktop Entry]",
    "Version=1.0",
    "Type=Application",
    `Name=${APP_NAME}`,
    `GenericName=${tMain("main.desktop.genericName")}`,
    `Comment=${tMain("main.desktop.comment")}`,
    `Exec=${exec} %U`,
    "Terminal=false",
    "Icon=catrip-connect",
    "Categories=Network;Chat;InstantMessaging;",
    "Keywords=whatsapp;chat;wa.me;catrip;",
    `MimeType=${MIME_WHATSAPP};`,
    "StartupWMClass=catrip-connect",
    "StartupNotify=true",
    "Actions=Open;Focus;NewAccount;",
    "",
    "[Desktop Action Open]",
    `Name=${tMain("main.desktop.actionOpen")}`,
    `Exec=${exec} --catrip-action=open`,
    "Terminal=false",
    "",
    "[Desktop Action Focus]",
    `Name=${tMain("main.desktop.actionFocus")}`,
    `Exec=${exec} --catrip-action=focus`,
    "Terminal=false",
    "",
    "[Desktop Action NewAccount]",
    `Name=${tMain("main.desktop.actionNewAccount")}`,
    `Exec=${exec} --catrip-action=new-account`,
    "Terminal=false",
  ].join("\n");
}

/** Abre un archivo con la aplicación predeterminada del sistema (portal / xdg-open). */
export async function openPathWithDefaultApp(filePath: string): Promise<boolean> {
  const p = (filePath || "").trim();
  if (!p || !fs.existsSync(p)) return false;
  try {
    const err = await shell.openPath(p);
    return !err;
  } catch {
    return false;
  }
}

/** Ruta del binario o AppImage que debe persistir en .desktop / autostart. */
export function resolveLinuxLaunchExecutable(): string | null {
  if (process.env.APPIMAGE && fs.existsSync(process.env.APPIMAGE)) return process.env.APPIMAGE;
  if (app.isPackaged) {
    const deb = "/opt/Catrip Connect/catrip-connect";
    if (fs.existsSync(deb)) return deb;
  }
  try {
    const exec = process.execPath;
    if (exec && fs.existsSync(exec)) return exec;
  } catch {
    // ignore
  }
  return null;
}

const LEGACY_AUTOSTART_NAME = "com.catrip.catrip-multichat-electron.desktop";

/** `~/.config/autostart/catrip-connect.desktop` (especificación XDG). */
export function linuxAutostartDesktopPath(): string {
  const cfg = process.env.XDG_CONFIG_HOME?.trim() || path.join(os.homedir(), ".config");
  return path.join(cfg, "autostart", DESKTOP_NAME);
}

function legacyAutostartDesktopPath(): string {
  const cfg = process.env.XDG_CONFIG_HOME?.trim() || path.join(os.homedir(), ".config");
  return path.join(cfg, "autostart", LEGACY_AUTOSTART_NAME);
}

/**
 * Entrada de autostart para GNOME/KDE. Exec entrecomillado (rutas con espacios en .deb),
 * `--disable-setuid-sandbox` para AppImage y binarios Electron recientes.
 */
export function buildAutostartDesktopContent(execPath: string): string {
  const exec = quoteExec(execPath);
  return [
    "[Desktop Entry]",
    "Version=1.0",
    "Type=Application",
    `Name=${APP_NAME}`,
    `Exec=${exec} --disable-setuid-sandbox`,
    "Hidden=false",
    "NoDisplay=false",
    "X-GNOME-Autostart-enabled=true",
    "Terminal=false",
    "StartupNotify=false",
    "Icon=catrip-connect",
    "Categories=Network;Chat;",
  ].join("\n");
}

/** Crea o elimina el .desktop en ~/.config/autostart. */
export function applyLinuxSessionAutostart(enabled: boolean): { ok: boolean; message: string } {
  const target = linuxAutostartDesktopPath();
  const legacy = legacyAutostartDesktopPath();
  try {
    if (!enabled) {
      for (const p of [target, legacy]) {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
      return { ok: true, message: tMain("main.integrations.autostartOff") };
    }
    const execPath = resolveLinuxLaunchExecutable();
    if (!execPath) {
      return { ok: false, message: tMain("main.integrations.exeNotFound") };
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, buildAutostartDesktopContent(execPath) + "\n", "utf-8");
    if (fs.existsSync(legacy) && legacy !== target) {
      try {
        fs.unlinkSync(legacy);
      } catch {
        // ignore
      }
    }
    return { ok: true, message: tMain("main.integrations.autostartOn", { path: target }) };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

function writeDesktopFile(desktopPath: string, execPath: string) {
  fs.mkdirSync(path.dirname(desktopPath), { recursive: true });
  fs.writeFileSync(desktopPath, buildDesktopEntryContent(execPath) + "\n", "utf-8");
}

/** Registra whatsapp:// y refresca bases XDG del usuario. */
export function registerWhatsAppProtocolForUser(): { ok: boolean; message: string } {
  if (process.platform !== "linux") {
    return { ok: false, message: tMain("main.integrations.linuxOnly") };
  }
  const execPath = resolveLinuxLaunchExecutable();
  if (!execPath) {
    return { ok: false, message: tMain("main.integrations.exeNotFound") };
  }

  try {
    const dataHome = process.env.XDG_DATA_HOME?.trim() || path.join(os.homedir(), ".local", "share");
    const appsDir = path.join(dataHome, "applications");
    const desktopPath = path.join(appsDir, DESKTOP_NAME);
    writeDesktopFile(desktopPath, execPath);

    try {
      execSync(`update-desktop-database "${appsDir}" 2>/dev/null || true`, {
        timeout: 10_000,
        stdio: "ignore",
      });
    } catch {
      // ignore
    }
    const cmds = [
      `xdg-mime default ${DESKTOP_NAME} ${MIME_WHATSAPP}`,
      `gio mime ${MIME_WHATSAPP} ${DESKTOP_NAME}`,
      `xdg-settings set default-url-scheme-handler whatsapp ${DESKTOP_NAME}`,
    ];
    for (const c of cmds) {
      try {
        execSync(`${c} 2>/dev/null || true`, { timeout: 8000, stdio: "ignore" });
      } catch {
        // ignore
      }
    }

    return {
      ok: true,
      message: tMain("main.integrations.protocolRegistered"),
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Ejecuta el script empaquetado (misma lógica que `npm run register:whatsapp`). */
export async function runBundledRegisterScript(): Promise<{ ok: boolean; message: string }> {
  const script = path.join(app.getAppPath(), "_scripts/register-whatsapp-protocol.sh");
  if (!fs.existsSync(script)) {
    return registerWhatsAppProtocolForUser();
  }
  try {
    const { stdout, stderr } = await execFileAsync("bash", [script], {
      timeout: 25_000,
      env: { ...process.env, APPIMAGE: process.env.APPIMAGE || resolveLinuxLaunchExecutable() || "" },
    });
    const out = (stdout || stderr || "").trim();
    return { ok: true, message: out || tMain("main.integrations.protocolRegisteredShort") };
  } catch (err) {
    const fallback = registerWhatsAppProtocolForUser();
    if (fallback.ok) return fallback;
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
