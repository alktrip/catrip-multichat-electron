import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveLocale } from "../../dist/shared/i18n/localeMeta.js";
import { loadLocaleResourcesFromDir } from "../../dist/shared/i18n/loadLocaleResources.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const localesRoot = path.join(root, "dist/shared/locales");

test("resolveLocale usa idioma del sistema por defecto y inglés si no está soportado", () => {
  assert.equal(resolveLocale(undefined, "en-US"), "en");
  assert.equal(resolveLocale(undefined, "es-MX"), "es");
  assert.equal(resolveLocale(undefined, "ru-RU"), "en");
  assert.equal(resolveLocale(undefined, undefined), "en");
  assert.equal(resolveLocale("system", "fr-FR"), "fr");
  assert.equal(resolveLocale("system", "xx-YY"), "en");
});

test("resolveLocale respeta un idioma explícito", () => {
  assert.equal(resolveLocale("pt", "en-US"), "pt");
  assert.equal(resolveLocale("invalid", "es-MX"), "en");
});

test("loadLocaleResourcesFromDir prioriza el locale objetivo sobre fallbacks", () => {
  const es = loadLocaleResourcesFromDir(localesRoot, "es");
  const pt = loadLocaleResourcesFromDir(localesRoot, "pt");
  assert.equal(es.main.menus.file, "Archivo");
  assert.equal(pt.main.menus.file, "Arquivo");
});

test("todos los locales comparten las mismas claves de traducción", () => {
  const locales = ["es", "en", "pt", "fr", "de", "ko", "ja", "it", "zh"];
  const flatten = (obj, prefix = "", out = {}) => {
    for (const [key, value] of Object.entries(obj || {})) {
      const pathKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === "object" && !Array.isArray(value)) flatten(value, pathKey, out);
      else out[pathKey] = value;
    }
    return out;
  };
  const baseKeys = Object.keys(flatten(loadLocaleResourcesFromDir(localesRoot, "es"))).sort();
  for (const locale of locales) {
    const keys = Object.keys(flatten(loadLocaleResourcesFromDir(localesRoot, locale))).sort();
    assert.deepEqual(keys, baseKeys, `claves distintas en ${locale}`);
  }
});

test("settings.language.hint documenta idioma del sistema con fallback a inglés", () => {
  const en = loadLocaleResourcesFromDir(localesRoot, "en");
  const es = loadLocaleResourcesFromDir(localesRoot, "es");
  assert.match(en.settings.language.hint, /system language/i);
  assert.match(en.settings.language.hint, /english/i);
  assert.match(es.settings.language.hint, /idioma del sistema/i);
  assert.match(es.settings.language.hint, /inglés/i);
});
