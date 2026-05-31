import type { AppLocale, LanguageSetting } from "./types";
import { APP_LOCALES, FALLBACK_LOCALE } from "./types";

/** Nombre nativo de cada idioma (siempre en su propio idioma). */
export const LOCALE_NATIVE_NAMES: Record<AppLocale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
  fr: "Français",
  de: "Deutsch",
  ko: "한국어",
  ja: "日本語",
  it: "Italiano",
  zh: "简体中文",
};

export const LANGUAGE_SETTING_OPTIONS: ReadonlyArray<{
  value: LanguageSetting;
  /** Etiqueta nativa (no requiere traducción). */
  label: string;
  /** true si la etiqueta viene de i18n (`settings.language.system`). */
  useI18n?: boolean;
}> = [
  { value: "system", label: "settings.language.system", useI18n: true },
  ...APP_LOCALES.map((locale) => ({
    value: locale as LanguageSetting,
    label: LOCALE_NATIVE_NAMES[locale],
  })),
];

function normalizeOsLocale(raw: string | undefined): AppLocale | null {
  if (!raw) return null;
  const base = raw.toLowerCase().replace("_", "-").split("-")[0];
  if (base === "es") return "es";
  if (base === "en") return "en";
  if (base === "pt") return "pt";
  if (base === "fr") return "fr";
  if (base === "de") return "de";
  if (base === "ko") return "ko";
  if (base === "ja") return "ja";
  if (base === "it") return "it";
  if (base === "zh") return "zh";
  return null;
}

/** Resuelve la preferencia guardada al locale efectivo. */
export function resolveLocale(setting: LanguageSetting | undefined, osLocale?: string): AppLocale {
  if (setting === "system" || setting === undefined) {
    return normalizeOsLocale(osLocale) ?? FALLBACK_LOCALE;
  }
  if (setting && APP_LOCALES.includes(setting as AppLocale)) {
    return setting as AppLocale;
  }
  return FALLBACK_LOCALE;
}

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (APP_LOCALES as readonly string[]).includes(value);
}

export function localeFallbackChain(locale: AppLocale): AppLocale[] {
  if (locale === FALLBACK_LOCALE) return [FALLBACK_LOCALE];
  return [locale, FALLBACK_LOCALE];
}
