import { app, dialog } from "electron";
import { autoUpdater } from "electron-updater";

const E2E_MODE = process.env.CATRIP_E2E === "1";

function log(...parts: unknown[]) {
  if (process.env.CATRIP_DEBUG_UPDATER === "1" || !app.isPackaged) {
    console.log("[catrip-updater]", ...parts);
  }
}

/** Comprueba actualizaciones en GitHub Releases (solo app empaquetada). */
export function setupAutoUpdater() {
  if (!app.isPackaged || E2E_MODE) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => log("checking"));
  autoUpdater.on("update-available", (info) => log("available", info?.version));
  autoUpdater.on("update-not-available", () => log("not available"));
  autoUpdater.on("error", (err) => log("error", err?.message ?? err));

  autoUpdater.on("update-downloaded", (info) => {
    const version = info?.version ?? "";
    void dialog
      .showMessageBox({
        type: "info",
        title: "Actualización disponible",
        message: `Catrip Connect ${version} está listo para instalar.`,
        detail: "La aplicación se reiniciará para aplicar la actualización.",
        buttons: ["Reiniciar ahora", "Más tarde"],
        defaultId: 0,
        cancelId: 1,
      })
      .then((r) => {
        if (r.response === 0) autoUpdater.quitAndInstall(false, true);
      });
  });

  // Tras el arranque, sin bloquear la UI.
  setTimeout(() => {
    void autoUpdater.checkForUpdatesAndNotify().catch((err) => log("check failed", err));
  }, 12_000);
}
