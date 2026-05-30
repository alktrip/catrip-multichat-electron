import { app } from "electron";

export type DevContextDto = {
  appVersion: string;
  electronVersion: string;
  chromeVersion: string;
  nodeVersion: string;
  platform: string;
  arch: string;
  isPackaged: boolean;
  userData: string;
  e2eMode: boolean;
  catripEnv: Record<string, string>;
};

export function buildDevContext(e2eMode: boolean): DevContextDto {
  const catripEnv: Record<string, string> = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (!v) continue;
    if (k.startsWith("CATRIP_") || k === "VITE_DEV_SERVER_URL") {
      catripEnv[k] = v;
    }
  }
  let appVersion = "0.0.0";
  let userData = "";
  let isPackaged = false;
  try {
    appVersion = app.getVersion();
    userData = app.getPath("userData");
    isPackaged = app.isPackaged;
  } catch {
    // Fuera del runtime de Electron (p. ej. tests unitarios).
  }
  return {
    appVersion,
    electronVersion: process.versions.electron ?? "—",
    chromeVersion: process.versions.chrome ?? "—",
    nodeVersion: process.versions.node ?? "—",
    platform: process.platform,
    arch: process.arch,
    isPackaged,
    userData,
    e2eMode,
    catripEnv,
  };
}
