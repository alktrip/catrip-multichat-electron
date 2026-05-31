import type { TFunction } from "i18next";

/** Formatea tiempo relativo usando claves i18n. */
export function formatRelativeTimeI18n(t: TFunction, ts: number | null): string {
  if (!ts) return t("common.dash");
  const diff = Date.now() - ts;
  if (diff < 45_000) return t("common.now");
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return t("common.minutesAgo", { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("common.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("common.daysAgo", { count: days });
}

export type CommandGroupKey = "chats" | "accounts" | "actions" | "navigation" | "appearance";

export const COMMAND_GROUP_KEYS: CommandGroupKey[] = [
  "chats",
  "accounts",
  "actions",
  "navigation",
  "appearance",
];

export function commandGroupLabel(t: TFunction, group: CommandGroupKey): string {
  return t(`commandGroups.${group}`);
}

export type SessionStatusKey = "loading" | "qr" | "connected" | "offline";

export function sessionStatusLabel(t: TFunction, status: SessionStatusKey): string {
  return t(`sessionStatus.${status}`);
}
