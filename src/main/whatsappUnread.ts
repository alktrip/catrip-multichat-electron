/**
 * Script evaluado en WhatsApp Web para estimar mensajes no leídos.
 * Fuente principal: `document.title` (mismo total que muestra WhatsApp Web).
 * Respaldo: suma de badges en la lista de chats, sin duplicar nodos.
 */
export const WHATSAPP_UNREAD_COUNT_JS = `(() => {
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

  try {
    var fromTitle = parseTitleUnread(document.title || "");
    if (fromTitle !== null) return fromTitle;
    return sumChatListBadges();
  } catch (_e) {
    return 0;
  }
})()`;
