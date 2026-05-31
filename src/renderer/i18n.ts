import i18next, { type InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";
import type { AppLocale } from "../shared/i18n/types";
import { APP_LOCALES, FALLBACK_LOCALE } from "../shared/i18n/types";
import { resolveLocale } from "../shared/i18n/localeMeta";

const localeModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "../shared/locales/*/translation.json",
  { eager: true },
);
const manualModules = import.meta.glob<{ default: Record<string, unknown> }>(
  "../shared/locales/*/manual.json",
  { eager: true },
);

function loadResourcesForLocale(locale: AppLocale): Record<string, unknown> {
  const translationPath = `../shared/locales/${locale}/translation.json`;
  const manualPath = `../shared/locales/${locale}/manual.json`;
  const translation = localeModules[translationPath]?.default ?? {};
  const manual = manualModules[manualPath]?.default;
  return manual ? { ...translation, manual } : { ...translation };
}

function buildResources(): Record<string, { translation: Record<string, unknown> }> {
  const resources: Record<string, { translation: Record<string, unknown> }> = {};
  for (const locale of APP_LOCALES) {
    resources[locale] = { translation: loadResourcesForLocale(locale) };
  }
  return resources;
}

let initPromise: Promise<AppLocale> | null = null;

/** Inicialización síncrona para montar React de inmediato (como en v1.6.0 remota). */
export function initRendererI18nSync(languageSetting?: string, osLocale?: string): AppLocale {
  const locale = resolveLocale(languageSetting as Parameters<typeof resolveLocale>[0], osLocale);
  if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
      lng: locale,
      fallbackLng: [FALLBACK_LOCALE],
      resources: buildResources(),
      interpolation: { escapeValue: false },
      returnNull: false,
      initImmediate: false,
    } as InitOptions);
    document.documentElement.lang = locale;
  }
  return locale;
}

export async function initRendererI18n(
  languageSetting: string | undefined,
  osLocale?: string,
): Promise<AppLocale> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const locale = resolveLocale(languageSetting as Parameters<typeof resolveLocale>[0], osLocale);
    await i18next.use(initReactI18next).init({
      lng: locale,
      fallbackLng: [FALLBACK_LOCALE],
      resources: buildResources(),
      interpolation: { escapeValue: false },
      returnNull: false,
    });
    document.documentElement.lang = locale;
    return locale;
  })();

  return initPromise;
}

export async function changeRendererLanguage(
  languageSetting: string | undefined,
  osLocale?: string,
): Promise<AppLocale> {
  const locale = resolveLocale(languageSetting as Parameters<typeof resolveLocale>[0], osLocale);
  await i18next.changeLanguage(locale);
  document.documentElement.lang = locale;
  return locale;
}

export default i18next;
