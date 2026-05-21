/**
 * Script evaluado en WhatsApp Web para estimar mensajes no leídos.
 * Varias heurísticas (título, badges en lista, aria-label) porque el DOM cambia con frecuencia.
 */
export const WHATSAPP_UNREAD_COUNT_JS = `(() => {
  function parseTitleCount(title) {
    if (!title) return 0;
    var patterns = [
      /\\((\\d+)\\)/,
      /(\\d+)\\s+unread/i,
      /(\\d+)\\s+no\\s+le[ií]d/i,
      /(\\d+)\\s+sin\\s+leer/i,
      /(\\d+)\\s+mensajes?\\s+no\\s+le[ií]dos?/i,
    ];
    for (var i = 0; i < patterns.length; i++) {
      var m = title.match(patterns[i]);
      if (m) {
        var n = parseInt(m[1], 10);
        if (!isNaN(n) && n > 0) return n;
      }
    }
    return 0;
  }

  function countFromBadgeEl(el) {
    if (!el || el.closest('[data-testid="status-v3-outgoing"]')) return 0;
    var aria = (el.getAttribute("aria-label") || el.getAttribute("title") || "").trim();
    var txt = (el.textContent || "").trim();
    var combined = aria + " " + txt;
    var m = combined.match(/(\\d+)/);
    if (m) {
      var n = parseInt(m[1], 10);
      if (!isNaN(n) && n > 0) return n;
    }
    var digits = txt.replace(/\\D/g, "");
    if (digits) {
      var n2 = parseInt(digits, 10);
      if (!isNaN(n2) && n2 > 0) return n2;
    }
    if (/unread|no le[ií]d|sin leer|no leído/i.test(combined)) return 1;
    return 0;
  }

  function sumChatListBadges() {
    var sum = 0;
    var seen = new Set();
    var rowSelectors = [
      '[data-testid="cell-frame-container"]',
      '[role="listitem"]',
    ];
    for (var r = 0; r < rowSelectors.length; r++) {
      var rows = document.querySelectorAll(rowSelectors[r]);
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (seen.has(row)) continue;
        var badge = row.querySelector(
          '[data-testid="icon-unread-count"], [data-testid="unread-count"], [data-icon="unread-count"]'
        );
        if (!badge) continue;
        seen.add(row);
        sum += countFromBadgeEl(badge);
      }
    }
    if (sum > 0) return sum;

    var badgeSelectors = [
      'span[data-testid="icon-unread-count"]',
      'span[data-testid="unread-count"]',
      '[data-testid="unread-count"]',
      'span[data-icon="unread-count"]',
    ];
    for (var s = 0; s < badgeSelectors.length; s++) {
      var nodes = document.querySelectorAll(badgeSelectors[s]);
      for (var j = 0; j < nodes.length; j++) {
        var el = nodes[j];
        if (seen.has(el)) continue;
        seen.add(el);
        sum += countFromBadgeEl(el);
      }
    }
    return sum;
  }

  function countMutedUnreadRows() {
    var sum = 0;
    var labels = document.querySelectorAll('[aria-label]');
    for (var i = 0; i < labels.length; i++) {
      var aria = (labels[i].getAttribute("aria-label") || "").trim();
      if (!/unread message|mensajes? no le[ií]dos?|mensaje no le[ií]do/i.test(aria)) continue;
      var m = aria.match(/(\\d+)/);
      sum += m ? Math.max(1, parseInt(m[1], 10) || 1) : 1;
    }
    return sum;
  }

  try {
    var fromTitle = parseTitleCount(document.title || "");
    if (fromTitle > 0) return fromTitle;
    var fromList = sumChatListBadges();
    if (fromList > 0) return fromList;
    var fromAria = countMutedUnreadRows();
    return fromAria > 0 ? fromAria : 0;
  } catch (_e) {
    return 0;
  }
})()`;
