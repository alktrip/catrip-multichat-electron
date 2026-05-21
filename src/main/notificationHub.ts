import { Notification } from "electron";
import type { Settings } from "./settings";

export type NotificationAccount = {
  id: string;
  label: string;
  notificationsEnabled?: boolean;
};

export type NotificationHubDeps = {
  getSettings: () => Settings;
  getAccounts: () => NotificationAccount[];
  focusAndActivateAccount: (accountId: string) => void;
};

let deps: NotificationHubDeps | null = null;

/** Última notificación global (evita ráfagas entre cuentas). */
let lastGlobalNotifyAt = 0;
/** Por cuenta: último aviso y último contador notificado. */
const lastNotifyAtByAccount = new Map<string, number>();
const lastNotifiedCountByAccount = new Map<string, number>();

const GLOBAL_THROTTLE_MS = 8000;
const PER_ACCOUNT_THROTTLE_MS = 12_000;

export function initNotificationHub(next: NotificationHubDeps) {
  deps = next;
}

export function resetNotificationHub() {
  lastGlobalNotifyAt = 0;
  lastNotifyAtByAccount.clear();
  lastNotifiedCountByAccount.clear();
}

/**
 * Aviso nativo si el contador de no leídos sube. Respeta DND, cuenta con notificaciones
 * desactivadas y throttle global / por cuenta.
 */
export function maybeNotifyUnreadIncrease(
  accountId: string,
  prevCount: number,
  nextCount: number,
): void {
  if (!deps) return;
  const settings = deps.getSettings();
  if (!settings.notifications.enabled) return;
  if (settings.notifications.doNotDisturb) return;
  if (nextCount <= prevCount) return;

  const acc = deps.getAccounts().find((a) => a.id === accountId);
  if (!acc || acc.notificationsEnabled === false) return;

  const now = Date.now();
  if (now - lastGlobalNotifyAt < GLOBAL_THROTTLE_MS) return;
  const lastAcc = lastNotifyAtByAccount.get(accountId) ?? 0;
  if (now - lastAcc < PER_ACCOUNT_THROTTLE_MS) return;

  const lastNotified = lastNotifiedCountByAccount.get(accountId) ?? 0;
  if (nextCount <= lastNotified && prevCount >= lastNotified) return;

  lastGlobalNotifyAt = now;
  lastNotifyAtByAccount.set(accountId, now);
  lastNotifiedCountByAccount.set(accountId, nextCount);

  const showAcc = !!settings.notifications.showAccountName;
  const showPreview = settings.notifications.showPreview !== false;
  const title = showAcc ? `WhatsApp · ${acc.label}` : "WhatsApp";
  const body = showPreview
    ? nextCount === 1
      ? "Tienes 1 chat sin leer."
      : `Tienes ${nextCount} chats sin leer.`
    : "Tienes chats sin leer.";

  try {
    const notif = new Notification({
      title,
      body,
      silent: !settings.notifications.playSound,
    });
    notif.on("click", () => {
      deps?.focusAndActivateAccount(accountId);
    });
    notif.show();
  } catch {
    // ignore — entorno sin soporte de notificaciones
  }
}
