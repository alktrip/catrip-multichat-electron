/** Idiomas soportados por Catrip Connect (sin "system"). */
export type AppLocale = "es" | "en" | "pt" | "fr" | "de" | "ko" | "ja" | "it" | "zh";

export type LanguageSetting = AppLocale | "system";

export const APP_LOCALES: readonly AppLocale[] = [
  "es",
  "en",
  "pt",
  "fr",
  "de",
  "ko",
  "ja",
  "it",
  "zh",
] as const;

/** Locale cuando el idioma del sistema no está soportado o la preferencia es inválida. */
export const DEFAULT_LOCALE: AppLocale = "en";

/** Fallback i18next para claves faltantes en un locale concreto. */
export const FALLBACK_LOCALE: AppLocale = "en";
