import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";
import fs from "node:fs";
import crypto from "node:crypto";
import type { Settings } from "./settings";
import { formatReleaseNotesForDialog } from "./releaseNotesFormat";
import {
  buildChangelogForUpdate,
  handleDebUpdateAvailable,
  isLinuxDebPackagedInstall,
} from "./debUpdateFlow";

const E2E_MODE = process.env.CATRIP_E2E === "1";

export type UpdateChannel = "stable" | "beta";

type PendingUpdate = {
  version: string;
  changelog: string;
  filePath: string | null;
};

let pendingUpdate: PendingUpdate | null = null;
let getChannel: () => UpdateChannel = () => "stable";

function log(...parts: unknown[]) {
  if (process.env.CATRIP_DEBUG_UPDATER === "1" || !app.isPackaged) {
    console.log("[catrip-updater]", ...parts);
  }
}

function applyChannel(channel: UpdateChannel) {
  autoUpdater.allowPrerelease = channel === "beta";
  autoUpdater.channel = channel === "beta" ? "beta" : "latest";
}

async function fetchGithubReleaseNotes(version: string, channel: UpdateChannel): Promise<string> {
  const tag = version.startsWith("v") ? version : `v${version}`;
  const repo = "alktrip/catrip-multichat-electron";
  try {
    const url =
      channel === "beta"
        ? `https://api.github.com/repos/${repo}/releases?per_page=8`
        : `https://api.github.com/repos/${repo}/releases/tags/${tag}`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "CatripConnect" },
    });
    if (!res.ok) return "";
    const data = await res.json();
    if (channel === "beta" && Array.isArray(data)) {
      const hit = data.find((r: { tag_name?: string }) => r?.tag_name === tag);
      return typeof hit?.body === "string" ? hit.body.trim().slice(0, 1200) : "";
    }
    return typeof (data as { body?: string })?.body === "string"
      ? (data as { body: string }).body.trim().slice(0, 1200)
      : "";
  } catch {
    return "";
  }
}

function sha512File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha512");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("base64")));
    stream.on("error", reject);
  });
}

async function verifyDownloadedArtifact(
  filePath: string,
  expectedSha512: string | undefined,
): Promise<{ ok: boolean; message: string }> {
  if (!expectedSha512 || !fs.existsSync(filePath)) {
    return { ok: true, message: "" };
  }
  try {
    const actual = await sha512File(filePath);
    if (actual === expectedSha512) {
      return { ok: true, message: "Integridad verificada (SHA-512)." };
    }
    return {
      ok: false,
      message: "La suma SHA-512 del archivo descargado no coincide con la publicada en GitHub.",
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/** AppImage / Windows / macOS: descarga automática e instalación al reiniciar. */
function setupAppImageStyleUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("update-available", async (info) => {
    log("available", info?.version);
    const version = info?.version ?? "";
    const changelog = await buildChangelogForUpdate(info, fetchGithubReleaseNotes, getChannel());
    pendingUpdate = { version, changelog, filePath: null };
  });

  autoUpdater.on("update-downloaded", async (info) => {
    const version = info?.version ?? pendingUpdate?.version ?? "";
    let changelog = pendingUpdate?.changelog ?? "";
    if ((!changelog || changelog === "Sin notas de la versión.") && version) {
      changelog = await buildChangelogForUpdate(info, fetchGithubReleaseNotes, getChannel());
    }

    const files = (info as { files?: Array<{ url?: string; sha512?: string }> })?.files ?? [];
    const deb =
      files.find((f) => f.url?.endsWith(".deb")) ??
      files.find((f) => (info as { path?: string }).path?.endsWith?.(".deb"));
    const filePath =
      (info as { downloadedFile?: string })?.downloadedFile ??
      (info as { path?: string })?.path ??
      null;

    let integrityLine = "";
    if (filePath && deb?.sha512 && filePath.endsWith(".deb")) {
      const v = await verifyDownloadedArtifact(filePath, deb.sha512);
      integrityLine = v.ok ? `\n\n${v.message}` : `\n\n⚠ ${v.message}`;
      if (!v.ok) {
        await dialog.showMessageBox({
          type: "warning",
          title: "Verificación de descarga",
          message: "No se pudo verificar el paquete .deb",
          detail: v.message,
          buttons: ["Entendido"],
        });
      }
    }

    const detail = `${changelog}${integrityLine}\n\nLa aplicación se reiniciará para aplicar la actualización.`;

    void dialog
      .showMessageBox({
        type: "info",
        title: "Actualización disponible",
        message: `Catrip Connect ${version} está listo para instalar.`,
        detail,
        buttons: ["Reiniciar ahora", "Más tarde"],
        defaultId: 0,
        cancelId: 1,
      })
      .then((r) => {
        if (r.response === 0) autoUpdater.quitAndInstall(false, true);
      });

    pendingUpdate = { version, changelog, filePath };
  });
}

/** .deb instalado: sin descarga automática; el usuario elige carpeta o solo el enlace. */
function setupDebManualUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on("update-available", async (info) => {
    log("available (deb manual)", info?.version);
    const changelog = await buildChangelogForUpdate(info, fetchGithubReleaseNotes, getChannel());
    await handleDebUpdateAvailable(info, changelog);
  });

  autoUpdater.on("update-downloaded", () => {
    log("update-downloaded ignored (deb manual flow)");
  });
}

/** Comprueba actualizaciones en GitHub Releases (solo app empaquetada). */
export function setupAutoUpdater(opts?: { getUpdateChannel?: () => UpdateChannel }) {
  if (!app.isPackaged || E2E_MODE) return;

  if (opts?.getUpdateChannel) getChannel = opts.getUpdateChannel;

  applyChannel(getChannel());

  const debMode = isLinuxDebPackagedInstall();
  log("mode", debMode ? "deb-manual" : "auto");

  if (debMode) setupDebManualUpdater();
  else setupAppImageStyleUpdater();

  autoUpdater.on("checking-for-update", () => log("checking"));
  autoUpdater.on("update-not-available", () => log("not available"));
  autoUpdater.on("error", (err) => log("error", err?.message ?? err));

  setTimeout(() => {
    applyChannel(getChannel());
    const check = debMode
      ? () => autoUpdater.checkForUpdates()
      : () => autoUpdater.checkForUpdatesAndNotify();
    void check().catch((err) => log("check failed", err));
  }, 12_000);
}

export function refreshUpdaterChannel(channel: UpdateChannel) {
  applyChannel(channel);
}
