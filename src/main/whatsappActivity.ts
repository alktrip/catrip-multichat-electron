/** Resultado crudo del script evaluado en WhatsApp Web. */
export type WhatsAppActivityRaw = {
  unread: number;
  unreadChats: Array<{ name: string; preview: string; unreadCount: number }>;
  lastSender: string | null;
  lastPreview: string | null;
};

/**
 * Script evaluado en WhatsApp Web: contador de no leídos + chats recientes con preview.
 * Reutiliza la misma fuente de verdad que `whatsappUnread.ts` para el total.
 */
export const WHATSAPP_ACTIVITY_JS = `(() => {
  function parseTitleUnread(title) {
    if (!title) return null;
    var t = String(title).trim();
    var patterns = [
      /^\\((\\d+)\\)\\s/,
      /^(\\d+)\\s+unread\\b/i,
      /^(\\d+)\\s+no\\s+le[ií]d/i,
      /^(\\d+)\\s+sin\\s+leer/i,
      /^(\\d+)\\s+mensajes?\\s+no\\s+le[ií]dos?/i,
      /^\\((\\d+)\\)/,
      /(\\d+)\\s+unread\\b/i,
      /(\\d+)\\s+no\\s+le[ií]d/i,
      /(\\d+)\\s+sin\\s+leer/i,
      /(\\d+)\\s+mensajes?\\s+no\\s+le[ií]dos?/i,
    ];
    for (var i = 0; i < patterns.length; i++) {
      var m = t.match(patterns[i]);
      if (m) {
        var n = parseInt(m[1], 10);
        if (!isNaN(n) && n >= 0) return n;
      }
    }
    if (/whatsapp/i.test(t)) return 0;
    return null;
  }

  function getChatListRoot() {
    return (
      document.querySelector('[data-testid="chat-list"]') ||
      document.querySelector("#pane-side") ||
      document.querySelector('[aria-label="Chat list"]') ||
      document.querySelector('[aria-label="Lista de chats"]')
    );
  }

  function countFromBadgeEl(el) {
    if (!el || el.closest('[data-testid="status-v3-outgoing"]')) return 0;
    var aria = (el.getAttribute("aria-label") || el.getAttribute("title") || "").trim();
    var txt = (el.textContent || "").trim();
    var unreadPatterns = [
      /(\\d+)\\s+unread\\b/i,
      /(\\d+)\\s+no\\s+le[ií]d/i,
      /(\\d+)\\s+sin\\s+leer/i,
      /(\\d+)\\s+mensajes?\\s+no\\s+le[ií]dos?/i,
      /unread\\s+(\\d+)/i,
      /no\\s+le[ií]d[oa]s?\\s+(\\d+)/i,
    ];
    for (var p = 0; p < unreadPatterns.length; p++) {
      var am = aria.match(unreadPatterns[p]);
      if (am) {
        var an = parseInt(am[1], 10);
        if (!isNaN(an) && an > 0) return an;
      }
    }
    if (/^\\d+$/.test(txt)) {
      var nTxt = parseInt(txt, 10);
      if (!isNaN(nTxt) && nTxt > 0) return nTxt;
    }
    var digits = txt.replace(/\\D/g, "");
    if (digits) {
      var n2 = parseInt(digits, 10);
      if (!isNaN(n2) && n2 > 0) return n2;
    }
    if (/unread|no le[ií]d|sin leer|no leído/i.test(aria)) return 1;
    return 0;
  }

  function sumChatListBadges() {
    var root = getChatListRoot();
    if (!root) return 0;
    var sum = 0;
    var seen = new Set();
    var badges = root.querySelectorAll(
      '[data-testid="icon-unread-count"], [data-testid="unread-count"], [data-icon="unread-count"]'
    );
    for (var i = 0; i < badges.length; i++) {
      var el = badges[i];
      if (seen.has(el)) continue;
      seen.add(el);
      sum += countFromBadgeEl(el);
    }
    return sum;
  }

  function parseUnreadTotal() {
    var fromTitle = parseTitleUnread(document.title || "");
    if (fromTitle !== null) return fromTitle;
    return sumChatListBadges();
  }

  function parseAriaLabel(aria) {
    var clean = String(aria || "")
      .replace(/,?\\s*\\d+\\s+unread\\b[^,]*/gi, "")
      .replace(/,?\\s*\\d+\\s+mensajes?\\s+no\\s+le[ií]dos?[^,]*/gi, "")
      .replace(/,?\\s*\\d+\\s+sin\\s+leer[^,]*/gi, "")
      .replace(/,?\\s*\\d{1,2}:\\d{2}(\\s*(AM|PM|a\\.\\s*m\\.\\s*|p\\.\\s*m\\.\\s*))?[^,]*$/i, "")
      .trim();
    var parts = clean.split(",").map(function (s) {
      return s.trim();
    }).filter(Boolean);
    return { name: parts[0] || "", preview: parts[1] || "" };
  }

  function readRowName(row) {
    var aria = (row.getAttribute("aria-label") || "").trim();
    if (aria) {
      var parsed = parseAriaLabel(aria);
      if (parsed.name) return parsed.name;
    }
    var titleEl = row.querySelector('span[title][dir="auto"]');
    if (titleEl) {
      var t = (titleEl.getAttribute("title") || titleEl.textContent || "").trim();
      if (t) return t;
    }
    return "";
  }

  function readRowPreview(row, name) {
    var aria = (row.getAttribute("aria-label") || "").trim();
    if (aria) {
      var parsed = parseAriaLabel(aria);
      if (parsed.preview) return parsed.preview;
    }
    var statusEl = row.querySelector('[data-testid="last-msg-status"]');
    if (statusEl && statusEl.parentElement) {
      var parentText = (statusEl.parentElement.textContent || "").trim();
      if (parentText) return parentText;
    }
    var titled = row.querySelectorAll("span[title]");
    for (var i = 0; i < titled.length; i++) {
      var el = titled[i];
      var t = (el.getAttribute("title") || "").trim();
      if (!t || t === name) continue;
      if (t.length > 180) continue;
      return t;
    }
    return "";
  }

  function scrapeUnreadChats(limit) {
    var root = getChatListRoot();
    if (!root) return [];
    var rows = root.querySelectorAll('[data-testid="cell-frame-container"]');
    var out = [];
    for (var i = 0; i < rows.length && out.length < limit; i++) {
      var row = rows[i];
      var badge = row.querySelector(
        '[data-testid="icon-unread-count"], [data-testid="unread-count"], [data-icon="unread-count"]'
      );
      if (!badge) continue;
      var unreadCount = countFromBadgeEl(badge);
      if (unreadCount <= 0) continue;
      var name = readRowName(row) || "Chat";
      var preview = readRowPreview(row, name);
      out.push({
        name: name.slice(0, 80),
        preview: preview.slice(0, 160),
        unreadCount: unreadCount,
      });
    }
    return out;
  }

  try {
    var unread = parseUnreadTotal();
    var unreadChats = scrapeUnreadChats(5);
    var top = unreadChats.length > 0 ? unreadChats[0] : null;
    return {
      unread: unread,
      unreadChats: unreadChats,
      lastSender: top ? top.name : null,
      lastPreview: top ? top.preview : null,
    };
  } catch (_e) {
    return { unread: 0, unreadChats: [], lastSender: null, lastPreview: null };
  }
})()`;

export function normalizeWhatsAppActivityRaw(raw: unknown): WhatsAppActivityRaw {
  if (!raw || typeof raw !== "object") {
    return { unread: 0, unreadChats: [], lastSender: null, lastPreview: null };
  }
  const o = raw as Record<string, unknown>;
  const unread =
    typeof o.unread === "number" && Number.isFinite(o.unread)
      ? Math.max(0, Math.floor(o.unread))
      : 0;
  const unreadChats = Array.isArray(o.unreadChats)
    ? o.unreadChats
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const c = item as Record<string, unknown>;
          const name = typeof c.name === "string" ? c.name.trim().slice(0, 80) : "";
          const preview = typeof c.preview === "string" ? c.preview.trim().slice(0, 160) : "";
          const unreadCount =
            typeof c.unreadCount === "number" && Number.isFinite(c.unreadCount)
              ? Math.max(1, Math.floor(c.unreadCount))
              : 1;
          if (!name) return null;
          return { name, preview, unreadCount };
        })
        .filter((x): x is { name: string; preview: string; unreadCount: number } => x != null)
        .slice(0, 5)
    : [];
  const lastSender =
    typeof o.lastSender === "string" && o.lastSender.trim()
      ? o.lastSender.trim().slice(0, 80)
      : null;
  const lastPreview =
    typeof o.lastPreview === "string" && o.lastPreview.trim()
      ? o.lastPreview.trim().slice(0, 160)
      : null;
  return {
    unread,
    unreadChats,
    lastSender: lastSender ?? unreadChats[0]?.name ?? null,
    lastPreview: lastPreview ?? unreadChats[0]?.preview ?? null,
  };
}
