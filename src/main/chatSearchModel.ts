import {
  buildPendingChatItems,
  type PendingAccountRef,
  type PendingChatItem,
  type PendingInboxActivitySnapshot,
} from "./pendingInboxModel";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function searchScore(item: PendingChatItem, tokens: string[], fullQuery: string): number {
  const name = normalize(item.chatName);
  const preview = normalize(item.preview);
  const account = normalize(item.accountLabel);
  let score = item.unreadCount * 10;

  if (name.startsWith(fullQuery)) score += 200;
  for (const t of tokens) {
    if (name.startsWith(t)) score += 80;
    else if (name.includes(t)) score += 40;
    if (preview.includes(t)) score += 15;
    if (account.includes(t)) score += 10;
  }
  return score;
}

/** Chats con mensajes sin leer, filtrados por consulta de la paleta (Ctrl+K). */
export function filterChatSearchItems(
  accounts: PendingAccountRef[],
  activityByAccount: Record<string, PendingInboxActivitySnapshot>,
  query: string,
  maxResults = 12,
): PendingChatItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const tokens = normalize(trimmed).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const catalog = buildPendingChatItems(accounts, activityByAccount);
  const fullQuery = tokens.join(" ");

  const matched = catalog.filter((item) => {
    const haystack = normalize([item.chatName, item.preview, item.accountLabel].join(" "));
    return tokens.every((t) => haystack.includes(t));
  });

  return matched
    .sort((a, b) => searchScore(b, tokens, fullQuery) - searchScore(a, tokens, fullQuery))
    .slice(0, maxResults);
}
