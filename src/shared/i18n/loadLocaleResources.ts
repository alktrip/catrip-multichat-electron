import fs from "node:fs";
import path from "node:path";
import type { AppLocale } from "./types";
import { localeFallbackChain } from "./localeMeta";

export type LocaleBundle = Record<string, unknown>;

function readJsonFile(filePath: string): Record<string, unknown> | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function mergeDeep(base: Record<string, unknown>, overlay: Record<string, unknown>) {
  for (const [key, value] of Object.entries(overlay)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      mergeDeep(base[key] as Record<string, unknown>, value as Record<string, unknown>);
    } else {
      base[key] = value;
    }
  }
}

/** Carga translation.json + manual.json desde disco (proceso main). */
export function loadLocaleResourcesFromDir(
  localesRoot: string,
  locale: AppLocale,
): LocaleBundle {
  let merged: Record<string, unknown> = {};
  // Fallbacks primero; el locale objetivo al final para que prevalezca sobre los demás.
  const chain = localeFallbackChain(locale);
  for (const lang of chain.slice().reverse()) {
    const dir = path.join(localesRoot, lang);
    const translation = readJsonFile(path.join(dir, "translation.json"));
    const manual = readJsonFile(path.join(dir, "manual.json"));
    if (translation) mergeDeep(merged, translation);
    if (manual) mergeDeep(merged, { manual });
  }
  return merged;
}

/** Raíz de locales empaquetada junto al main compilado. */
export function packagedLocalesRoot(mainDirname: string): string {
  return path.join(mainDirname, "../shared/locales");
}
