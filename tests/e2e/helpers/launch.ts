import { _electron as electron, type ElectronApplication, type Page } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const projectRoot = path.resolve(__dirname, "..", "..", "..");

export interface LaunchedApp {
  app: ElectronApplication;
  shell: Page;
  userDataDir: string;
}

/**
 * Lanza la app de Electron en modo E2E, con un `userData` aislado en /tmp y
 * sin tocar el del usuario real.
 *
 * - `--user-data-dir=<tmp>` lo respeta Electron/Chromium nativamente, así que
 *   `app.getPath("userData")` devolverá esa ruta.
 * - `CATRIP_E2E=1` hace que cada cuenta cargue `about:blank` (sin red) y que
 *   no se cree el icono de bandeja.
 */
export async function launchApp(): Promise<LaunchedApp> {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "catrip-e2e-"));

  const app = await electron.launch({
    args: [".", `--user-data-dir=${userDataDir}`, "--no-sandbox"],
    cwd: projectRoot,
    env: {
      ...process.env,
      CATRIP_E2E: "1",
      CATRIP_DEBUG_EMBED: "0",
      CATRIP_DISABLE_GPU: "1",
      CATRIP_TRANSPARENT_WINDOW: "0",
    },
    timeout: 30_000,
  });

  const shell = await findShellPage(app);
  await shell.waitForLoadState("domcontentloaded");
  return { app, shell, userDataDir };
}

export async function closeApp(launched: LaunchedApp | undefined): Promise<void> {
  if (!launched) return;
  try {
    await launched.app.close();
  } catch {
    // ignore
  }
  if (launched.userDataDir) {
    try {
      fs.rmSync(launched.userDataDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }
}

/**
 * Localiza la `Page` cuyo URL apunta al `dist/renderer/index.html` cargado por
 * el `WebContentsView` del shell. La `BrowserWindow` principal tiene
 * `webContents` vacíos (ver `createMainWindow` en `src/main/main.ts`) y se debe
 * filtrar.
 */
async function findShellPage(app: ElectronApplication, timeoutMs = 20_000): Promise<Page> {
  const deadline = Date.now() + timeoutMs;
  let lastUrls: string[] = [];
  while (Date.now() < deadline) {
    const pages = app.windows();
    lastUrls = pages.map((p) => p.url());
    for (const p of pages) {
      const url = p.url();
      if (url.includes("index.html") || /\bcatrip[-_]/.test(url)) {
        return p;
      }
    }
    // Esperamos a que aparezca; las nuevas Pages se crean asíncronamente.
    await Promise.race([
      app.waitForEvent("window", { timeout: 1_000 }).catch(() => null),
      new Promise<void>((r) => setTimeout(r, 250)),
    ]);
  }
  throw new Error(
    `No se encontró el shell (index.html) entre las ventanas de la app.\n` +
      `URLs vistas: ${JSON.stringify(lastUrls)}`,
  );
}
