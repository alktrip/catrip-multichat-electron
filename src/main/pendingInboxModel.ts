export type PendingInboxActivitySnapshot = {
  unread: number;
  unreadChats: Array<{ name: string; preview: string; unreadCount: number }>;
  lastActivityAt: number | null;
};

export type PendingChatItem = {
  accountId: string;
  accountLabel: string;
  accountIcon: string;
  chatName: string;
  preview: string;
  unreadCount: number;
  lastActivityAt: number | null;
  urgency: number;
};

export type PendingAccountRef = {
  id: string;
  label: string;
  icon: string;
  notificationsEnabled?: boolean;
};

export function buildPendingChatItems(
  accounts: PendingAccountRef[],
  activityByAccount: Record<string, PendingInboxActivitySnapshot>,
): PendingChatItem[] {
  const items: PendingChatItem[] = [];
  for (const account of accounts) {
    const snap = activityByAccount[account.id];
    if (!snap || snap.unreadChats.length === 0) continue;
    for (const chat of snap.unreadChats) {
      if (chat.unreadCount <= 0) continue;
      const lastActivityAt = snap.lastActivityAt;
      items.push({
        accountId: account.id,
        accountLabel: account.label,
        accountIcon: account.icon,
        chatName: chat.name,
        preview: chat.preview,
        unreadCount: chat.unreadCount,
        lastActivityAt,
        urgency: chat.unreadCount * 1000 + (lastActivityAt ?? 0) / 1_000_000,
      });
    }
  }
  return items.sort((a, b) => {
    if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
    return (b.lastActivityAt ?? 0) - (a.lastActivityAt ?? 0);
  });
}

export function formatRelativeTime(ts: number | null): string {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  if (diff < 45_000) return "Ahora";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}
