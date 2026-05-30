import { app, BrowserWindow, dialog, shell } from "electron";
import fs from "node:fs";
import path from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import type { UpdateInfo } from "electron-updater";
import {
  formatReleaseNotesBrief,
  formatReleaseNotesForUpdateDialog,
  releaseNotesGithubUrl,
} from "./releaseNotesFormat";
import { showUpdateDialogRequest, type UpdateDialogRequest } from "./updateDialogBridge";
type UpdateChannel = "stable" | "beta";

const GITHUB_REPO = "alktrip/catrip-multichat-electron";

export function isLinuxDebPackagedInstall(): boolean {
  if (process.platform !== "linux" || !app.isPackaged) return false;
  if (process.env.APPIMAGE && fs.existsSync(process.env.APPIMAGE)) return false;
  return true;
}

export function isLinuxAppImageInstall(): boolean {
  return !!(
    process.platform === "linux" &&
    app.isPackaged &&
    process.env.APPIMAGE &&
    fs.existsSync(process.env.APPIMAGE)
  );
}

function dialogParent(): BrowserWindow | undefined {
  const wins = BrowserWindow.getAllWindows().filter((w) => !w.isDestroyed());
  return wins.find((w) => w.isVisible()) ?? wins[0];
}

function showMessageBox(
  options: Electron.MessageBoxOptions,
): Promise<Electron.MessageBoxReturnValue> {
  const parent = dialogParent();
  return parent ? dialog.showMessageBox(parent, options) : dialog.showMessageBox(options);
}

async function askUpdateDialog(req: UpdateDialogRequest): Promise<string> {
  try {
    return await showUpdateDialogRequest(req);
  } catch {
    const brief = formatReleaseNotesBrief(req.releaseNotes);
    const detail = [brief, req.footerHint].filter(Boolean).join("\n\n");
    const labels = req.buttons.map((b) => b.label);
    const r = await showMessageBox({
      type: "info",
      title: req.title,
      message: req.message,
      detail,
      buttons: labels,
      defaultId: Math.max(0, req.buttons.findIndex((b) => b.primary)),
      cancelId: Math.max(0, req.buttons.findIndex((b) => b.id === "later")),
    });
    const picked = req.buttons[r.response]?.id ?? req.buttons[req.buttons.length - 1]?.id ?? "later";
    if (picked === "open-release-url" && req.releaseUrl) {
      void shell.openExternal(req.releaseUrl);
    }
    return picked;
  }
}

/** URL del .deb en GitHub Releases a partir de metadatos de electron-updater. */
export function resolveDebDownloadUrl(info: UpdateInfo): string {
  const version = (info.version ?? "").trim();
  const tag = version.startsWith("v") ? version : `v${version}`;
  const plain = version.replace(/^v/i, "");

  const files = (info as { files?: Array<{ url?: string }> }).files ?? [];
  const deb = files.find((f) => f.url?.includes(".deb"));
  if (deb?.url) {
    if (/^https?:\/\//i.test(deb.url)) return deb.url;
    return `https://github.com/${GITHUB_REPO}/releases/download/${tag}/${path.basename(deb.url)}`;
  }

  return `https://github.com/${GITHUB_REPO}/releases/download/${tag}/catrip-connect_${plain}_amd64.deb`;
}

export function resolveDebSha512(info: UpdateInfo): string | undefined {
  const files = (info as { files?: Array<{ url?: string; sha512?: string }> }).files ?? [];
  const deb = files.find((f) => f.url?.includes(".deb"));
  return deb?.sha512;
}

async function downloadUrlToFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`No se pudo descargar (${res.status} ${res.statusText})`);
  }
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  await pipeline(Readable.fromWeb(res.body as import("stream/web").ReadableStream), createWriteStream(destPath));
}

async function verifySha512(filePath: string, expected: string | undefined): Promise<string> {
  if (!expected) return "";
  const crypto = await import("node:crypto");
  const hash = crypto.createHash("sha512");
  await new Promise<void>((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    stream.on("data", (c) => hash.update(c));
    stream.on("end", () => resolve());
    stream.on("error", reject);
  });
  const actual = hash.digest("base64");
  if (actual === expected) return "\n\nIntegridad verificada (SHA-512).";
  return "\n\n⚠ La suma SHA-512 no coincide con la publicada en GitHub.";
}

async function promptDownloadToFolder(
  version: string,
  debUrl: string,
  sha512: string | undefined,
): Promise<void> {
  const parent = dialogParent();
  const dirPick = parent
    ? await dialog.showOpenDialog(parent, {
        title: "Elegir carpeta para guardar el .deb",
        properties: ["openDirectory", "createDirectory"],
      })
    : await dialog.showOpenDialog({
        title: "Elegir carpeta para guardar el .deb",
        properties: ["openDirectory", "createDirectory"],
      });
  if (dirPick.canceled || !dirPick.filePaths[0]) return;

  const plain = version.replace(/^v/i, "");
  const destPath = path.join(dirPick.filePaths[0], `catrip-connect_${plain}_amd64.deb`);

  try {
    await downloadUrlToFile(debUrl, destPath);
    const integrity = await verifySha512(destPath, sha512);
    const done = await showMessageBox({
      type: "info",
      title: "Descarga completada",
      message: "Paquete .deb guardado",
      detail: `${destPath}${integrity}\n\nInstálalo con:\nsudo apt install ./${path.basename(destPath)}`,
      buttons: parent ? ["Abrir carpeta", "Entendido"] : ["Entendido"],
    });
    if (done.response === 0 && parent) void shell.showItemInFolder(destPath);
  } catch (err) {
    await showMessageBox({
      type: "error",
      title: "Error al descargar",
      message: "No se pudo guardar el .deb",
      detail: err instanceof Error ? err.message : String(err),
      buttons: ["Entendido"],
    });
  }
}

async function showManualDownloadUrl(version: string, debUrl: string, changelog: string): Promise<void> {
  const action = await askUpdateDialog({
    title: "Descarga manual",
    message: `Catrip Connect ${version}`,
    releaseNotes: changelog,
    footerHint: `Descarga el instalador .deb desde:\n${debUrl}\n\nLuego instálalo con apt o tu gestor de paquetes.`,
    releaseUrl: releaseNotesGithubUrl(version),
    buttons: [
      { id: "open-browser", label: "Abrir enlace en el navegador", primary: true },
      { id: "ack", label: "Entendido" },
    ],
  });
  if (action === "open-browser" || action === "open-release-url") {
    void shell.openExternal(debUrl);
  }
}

let debPromptShownForVersion: string | null = null;

/**
 * Flujo .deb: aviso, pregunta si descargar; carpeta elegida por el usuario o solo URL.
 */
export async function handleDebUpdateAvailable(
  info: UpdateInfo,
  changelogPlain: string,
): Promise<void> {
  const version = info.version ?? "";
  if (!version) return;
  if (debPromptShownForVersion === version) return;
  debPromptShownForVersion = version;

  const debUrl = resolveDebDownloadUrl(info);
  const sha512 = resolveDebSha512(info);
  const action = await askUpdateDialog({
    title: "Nueva versión disponible",
    message: `Hay una actualización: Catrip Connect ${version}`,
    releaseNotes: changelogPlain,
    footerHint:
      "¿Quieres descargar el paquete .deb a una carpeta de tu elección?\n(Si prefieres no descargar desde la app, podrás abrir el enlace de GitHub.)",
    releaseUrl: releaseNotesGithubUrl(version),
    buttons: [
      { id: "download", label: "Descargar…", primary: true },
      { id: "link", label: "Solo enlace de descarga" },
      { id: "later", label: "Más tarde" },
    ],
  });

  if (action === "download") {
    await promptDownloadToFolder(version, debUrl, sha512);
  } else if (action === "link" || action === "open-release-url") {
    await showManualDownloadUrl(version, debUrl, changelogPlain);
  }
}

export async function buildChangelogForUpdate(
  info: UpdateInfo,
  fetchNotes: (version: string, channel: UpdateChannel) => Promise<string>,
  channel: UpdateChannel,
): Promise<string> {
  const version = info.version ?? "";
  const raw = info.releaseNotes ?? (version ? await fetchNotes(version, channel) : "");
  return formatReleaseNotesForUpdateDialog(raw);
}
