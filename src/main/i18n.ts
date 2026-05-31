import i18next from "i18next";
import type { AppLocale } from "../shared/i18n/types";
import { resolveLocale } from "../shared/i18n/localeMeta";
import {
  loadLocaleResourcesFromDir,
  packagedLocalesRoot,
} from "../shared/i18n/loadLocaleResources";

let initialized = false;
let initPromise: Promise<void> | null = null;

function buildMainResources(locale: AppLocale) {
  const localesRoot = packagedLocalesRoot(__dirname);
  return {
    [locale]: { translation: loadLocaleResourcesFromDir(localesRoot, locale) },
  };
}

export async function initMainI18n(
  languageSetting: string | undefined,
  osLocale?: string,
): Promise<AppLocale> {
  const locale = resolveLocale(
    languageSetting as Parameters<typeof resolveLocale>[0],
    osLocale,
  );
  const resources = buildMainResources(locale);

  if (!initialized) {
    if (!initPromise) {
      initPromise = i18next
        .init({
          lng: locale,
          fallbackLng: ["en"],
          resources,
          interpolation: { escapeValue: false },
        })
        .then(() => {
          initialized = true;
        });
    }
    await initPromise;
  } else {
    for (const [lng, bundle] of Object.entries(resources)) {
      i18next.addResourceBundle(lng, "translation", bundle.translation, true, true);
    }
    await i18next.changeLanguage(locale);
  }

  return locale;
}

export async function changeMainLanguage(
  languageSetting: string | undefined,
  osLocale?: string,
): Promise<AppLocale> {
  return initMainI18n(languageSetting, osLocale);
}

export function tMain(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options ?? {});
}

export function getMainLocale(): AppLocale {
  return (i18next.language || "en") as AppLocale;
}
