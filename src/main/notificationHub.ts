import { Notification } from "electron";
import type { Settings } from "./settings";

export type NotificationAccount = {
  id: string;
  label: string;
  notificationsEnabled?: boolean;
};

export type ActivityNotifyPayload = {
  unread: number;
  lastSender: string | null;
  lastPreview: string | null;
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

function buildNotificationBody(
  settings: Settings,
  payload: ActivityNotifyPayload,
): string {
  const showPreview = settings.notifications.showPreview !== false;
  if (showPreview && payload.lastPreview) {
    if (payload.lastSender) return `${payload.lastSender}: ${payload.lastPreview}`;
    return payload.lastPreview;
  }
  if (showPreview) {
    return payload.unread === 1
      ? "Tienes 1 chat sin leer."
      : `Tienes ${payload.unread} chats sin leer.`;
  }
  return "Tienes chats sin leer.";
}

/**
 * Aviso nativo si el contador de no leídos sube. Usa remitente/preview cuando
 * están disponibles desde WhatsApp Web.
 */
export function maybeNotifyActivityIncrease(
  accountId: string,
  prevCount: number,
  payload: ActivityNotifyPayload,
): void {
  if (!deps) return;
  const settings = deps.getSettings();
  if (!settings.notifications.enabled) return;
  if (settings.notifications.doNotDisturb) return;
  if (payload.unread <= prevCount) return;

  const acc = deps.getAccounts().find((a) => a.id === accountId);
  if (!acc || acc.notificationsEnabled === false) return;

  const now = Date.now();
  if (now - lastGlobalNotifyAt < GLOBAL_THROTTLE_MS) return;
  const lastAcc = lastNotifyAtByAccount.get(accountId) ?? 0;
  if (now - lastAcc < PER_ACCOUNT_THROTTLE_MS) return;

  const lastNotified = lastNotifiedCountByAccount.get(accountId) ?? 0;
  if (payload.unread <= lastNotified && prevCount >= lastNotified) return;

  lastGlobalNotifyAt = now;
  lastNotifyAtByAccount.set(accountId, now);
  lastNotifiedCountByAccount.set(accountId, payload.unread);

  const showAcc = !!settings.notifications.showAccountName;
  const title = showAcc ? `WhatsApp · ${acc.label}` : "WhatsApp";
  const body = buildNotificationBody(settings, payload);

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

/** @deprecated Usar maybeNotifyActivityIncrease; conservado como alias. */
export function maybeNotifyUnreadIncrease(
  accountId: string,
  prevCount: number,
  nextCount: number,
): void {
  maybeNotifyActivityIncrease(accountId, prevCount, {
    unread: nextCount,
    lastSender: null,
    lastPreview: null,
  });
}
