import type { AccountSessionStatus } from "./accountSessionStatus";
import { normalizeWhatsAppActivityRaw, type WhatsAppActivityRaw } from "./whatsappActivity";

export type WhatsAppHeartbeatMode = "full" | "light";

export type WhatsAppHeartbeatRaw = WhatsAppActivityRaw & {
  status: AccountSessionStatus;
  callActive: boolean;
};

const HEARTBEAT_STATUS_AND_CALL_JS = `
  function catripSessionStatus() {
    try {
      if (typeof navigator !== "undefined" && navigator.onLine === false) return "offline";
      var href = String(location.href || "");
      if (!href.includes("web.whatsapp.com")) return "loading";
      var chatList =
        document.querySelector('[data-testid="chat-list"]') ||
        document.querySelector("#pane-side") ||
        document.querySelector('[aria-label="Chat list"]') ||
        document.querySelector('[aria-label="Lista de chats"]');
      if (chatList) return "connected";
      var qr =
        document.querySelector('[data-testid="qrcode"]') ||
        document.querySelector('[data-testid="intro-md-beta"]') ||
        document.querySelector('canvas[aria-label*="QR"]') ||
        document.querySelector('canvas[aria-label*="qr"]');
      if (qr) return "qr";
      var body = (document.body && document.body.innerText) || "";
      if (/escanea|scan this code|use whatsapp on your phone/i.test(body)) return "qr";
      return "loading";
    } catch (e) {
      return "loading";
    }
  }

  function catripCallActive() {
    try {
      var selectors = [
        '[data-testid="call-container"]',
        '[data-testid="call-controls"]',
        '[data-testid="call-info"]',
        '[data-testid="ongoing-call"]',
        'button[aria-label*="End call"]',
        'button[aria-label*="Finalizar"]',
        'button[aria-label*="Colgar"]',
        '[aria-label*="en llamada"]',
        '[aria-label*="ongoing call"]'
      ];
      for (var i = 0; i < selectors.length; i++) {
        if (document.querySelector(selectors[i])) return true;
      }
      var videos = document.querySelectorAll("video");
      for (var j = 0; j < videos.length; j++) {
        var v = videos[j];
        if (!v || v.readyState < 2) continue;
        var stream = v.srcObject;
        if (stream && typeof stream.getAudioTracks === "function") {
          var tracks = stream.getAudioTracks();
          if (tracks && tracks.length > 0 && tracks.some(function (t) { return t && t.enabled; })) {
            return true;
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  function catripParseTitleUnread(title) {
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
`;

const HEARTBEAT_ACTIVITY_JS = `
  function catripGetChatListRoot() {
    return (
      document.querySelector('[data-testid="chat-list"]') ||
      document.querySelector("#pane-side") ||
      document.querySelector('[aria-label="Chat list"]') ||
      document.querySelector('[aria-label="Lista de chats"]')
    );
  }

  function catripCountFromBadgeEl(el) {
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

  function catripSumChatListBadges() {
    var root = catripGetChatListRoot();
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
      sum += catripCountFromBadgeEl(el);
    }
    return sum;
  }

  function catripParseUnreadTotal() {
    var fromTitle = catripParseTitleUnread(document.title || "");
    if (fromTitle !== null) return fromTitle;
    return catripSumChatListBadges();
  }

  function catripParseAriaLabel(aria) {
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

  function catripReadRowName(row) {
    var aria = (row.getAttribute("aria-label") || "").trim();
    if (aria) {
      var parsed = catripParseAriaLabel(aria);
      if (parsed.name) return parsed.name;
    }
    var titleEl = row.querySelector('span[title][dir="auto"]');
    if (titleEl) {
      var t = (titleEl.getAttribute("title") || titleEl.textContent || "").trim();
      if (t) return t;
    }
    return "";
  }

  function catripReadRowPreview(row, name) {
    var aria = (row.getAttribute("aria-label") || "").trim();
    if (aria) {
      var parsed = catripParseAriaLabel(aria);
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

  function catripScrapeUnreadChats(limit) {
    var root = catripGetChatListRoot();
    if (!root) return [];
    var rows = root.querySelectorAll('[data-testid="cell-frame-container"]');
    var out = [];
    for (var i = 0; i < rows.length && out.length < limit; i++) {
      var row = rows[i];
      var badge = row.querySelector(
        '[data-testid="icon-unread-count"], [data-testid="unread-count"], [data-icon="unread-count"]'
      );
      if (!badge) continue;
      var unreadCount = catripCountFromBadgeEl(badge);
      if (unreadCount <= 0) continue;
      var name = catripReadRowName(row) || "Chat";
      var preview = catripReadRowPreview(row, name);
      out.push({
        name: name.slice(0, 80),
        preview: preview.slice(0, 160),
        unreadCount: unreadCount,
      });
    }
    return out;
  }

  function catripActivityPayload() {
    var unread = catripParseUnreadTotal();
    var unreadChats = catripScrapeUnreadChats(5);
    var top = unreadChats.length > 0 ? unreadChats[0] : null;
    return {
      unread: unread,
      unreadChats: unreadChats,
      lastSender: top ? top.name : null,
      lastPreview: top ? top.preview : null,
    };
  }
`;

function buildHeartbeatScript(mode: WhatsAppHeartbeatMode): string {
  const activityBlock =
    mode === "full"
      ? `
    var activity = catripActivityPayload();
    return {
      status: status,
      callActive: callActive,
      unread: activity.unread,
      unreadChats: activity.unreadChats,
      lastSender: activity.lastSender,
      lastPreview: activity.lastPreview,
    };
`
      : `
    var titleUnread = catripParseTitleUnread(document.title || "");
    var unread = titleUnread !== null ? titleUnread : 0;
    return {
      status: status,
      callActive: callActive,
      unread: unread,
      unreadChats: [],
      lastSender: null,
      lastPreview: null,
    };
`;

  return `(() => {
  ${HEARTBEAT_STATUS_AND_CALL_JS}
  ${mode === "full" ? HEARTBEAT_ACTIVITY_JS : ""}
  try {
    var status = catripSessionStatus();
    var callActive = catripCallActive();
    ${activityBlock}
  } catch (_e) {
    return {
      status: "loading",
      callActive: false,
      unread: 0,
      unreadChats: [],
      lastSender: null,
      lastPreview: null,
    };
  }
})()`;
}

/** Un solo round-trip: estado de sesión, llamada activa y actividad (completa o ligera). */
export const WHATSAPP_HEARTBEAT_FULL_JS = buildHeartbeatScript("full");

/** Solo título + estado + llamada; para cuentas inactivas con vista viva. */
export const WHATSAPP_HEARTBEAT_LIGHT_JS = buildHeartbeatScript("light");

const SESSION_STATUSES = new Set<AccountSessionStatus>(["loading", "qr", "connected", "offline"]);

export function normalizeWhatsAppHeartbeatRaw(raw: unknown): WhatsAppHeartbeatRaw | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const statusRaw = o.status;
  const status =
    typeof statusRaw === "string" && SESSION_STATUSES.has(statusRaw as AccountSessionStatus)
      ? (statusRaw as AccountSessionStatus)
      : "loading";
  const activity = normalizeWhatsAppActivityRaw(raw);
  const callActive = o.callActive === true;
  return { ...activity, status, callActive };
}
