import { app, shell } from "electron";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFile, execSync } from "node:child_process";
import { promisify } from "node:util";

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
    "GenericName=Mensajería",
    "Comment=Cliente multi-cuenta de WhatsApp Web",
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
    "Name=Abrir Catrip Connect",
    `Exec=${exec} --catrip-action=open`,
    "Terminal=false",
    "",
    "[Desktop Action Focus]",
    "Name=Enfocar ventana",
    `Exec=${exec} --catrip-action=focus`,
    "Terminal=false",
    "",
    "[Desktop Action NewAccount]",
    "Name=Nueva cuenta",
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

function resolveExecPath(): string | null {
  if (process.env.APPIMAGE && fs.existsSync(process.env.APPIMAGE)) return process.env.APPIMAGE;
  if (app.isPackaged) {
    const deb = "/opt/Catrip Connect/catrip-connect";
    if (fs.existsSync(deb)) return deb;
  }
  try {
    return process.execPath;
  } catch {
    return null;
  }
}

function writeDesktopFile(desktopPath: string, execPath: string) {
  fs.mkdirSync(path.dirname(desktopPath), { recursive: true });
  fs.writeFileSync(desktopPath, buildDesktopEntryContent(execPath) + "\n", "utf-8");
}

/** Registra whatsapp:// y refresca bases XDG del usuario. */
export function registerWhatsAppProtocolForUser(): { ok: boolean; message: string } {
  if (process.platform !== "linux") {
    return { ok: false, message: "Solo disponible en Linux." };
  }
  const execPath = resolveExecPath();
  if (!execPath) {
    return { ok: false, message: "No se encontró el ejecutable de Catrip Connect." };
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
      message:
        "Registrado whatsapp:// y acciones del lanzador. Los https://wa.me abiertos en el navegador no pasan solos a Catrip: usa whatsapp://, el botón «Abrir con…» del navegador o una extensión.",
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
      env: { ...process.env, APPIMAGE: process.env.APPIMAGE || resolveExecPath() || "" },
    });
    const out = (stdout || stderr || "").trim();
    return { ok: true, message: out || "Protocolo registrado." };
  } catch (err) {
    const fallback = registerWhatsAppProtocolForUser();
    if (fallback.ok) return fallback;
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}
