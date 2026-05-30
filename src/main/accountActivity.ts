import type { AccountSessionStatus } from "./accountSessionStatus";
import { normalizeWhatsAppActivityRaw, type WhatsAppActivityRaw } from "./whatsappActivity";

export type AccountUnreadChat = {
  name: string;
  preview: string;
  unreadCount: number;
};

export type AccountActivitySnapshot = {
  unread: number;
  status: AccountSessionStatus;
  lastSender: string | null;
  lastPreview: string | null;
  /** Epoch ms de la última actividad detectada (mensaje / cambio de no leídos). */
  lastActivityAt: number | null;
  unreadChats: AccountUnreadChat[];
};

export type AccountActivityMap = Record<string, AccountActivitySnapshot>;

export function buildActivitySnapshot(
  raw: WhatsAppActivityRaw,
  status: AccountSessionStatus,
  prev?: AccountActivitySnapshot,
): AccountActivitySnapshot {
  const normalized = normalizeWhatsAppActivityRaw(raw);
  const lastSender = normalized.lastSender;
  const lastPreview = normalized.lastPreview;
  const unread = normalized.unread;
  const unreadChats = normalized.unreadChats;

  const contentChanged =
    (prev?.lastSender ?? null) !== lastSender ||
    (prev?.lastPreview ?? null) !== lastPreview ||
    (prev?.unread ?? 0) !== unread ||
    prev?.status !== status;

  const now = Date.now();
  const lastActivityAt = contentChanged
    ? Math.max(now, (prev?.lastActivityAt ?? 0) + 1)
    : (prev?.lastActivityAt ?? null);

  return {
    unread,
    status,
    lastSender,
    lastPreview,
    lastActivityAt,
    unreadChats,
  };
}

export function activityMapsEqual(a: AccountActivityMap, b: AccountActivityMap): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    const x = a[k];
    const y = b[k];
    if (!y) return false;
    if (
      x.unread !== y.unread ||
      x.status !== y.status ||
      x.lastSender !== y.lastSender ||
      x.lastPreview !== y.lastPreview ||
      x.lastActivityAt !== y.lastActivityAt ||
      x.unreadChats.length !== y.unreadChats.length
    ) {
      return false;
    }
    for (let i = 0; i < x.unreadChats.length; i++) {
      const c = x.unreadChats[i];
      const d = y.unreadChats[i];
      if (c.name !== d.name || c.preview !== d.preview || c.unreadCount !== d.unreadCount) {
        return false;
      }
    }
  }
  return true;
}
