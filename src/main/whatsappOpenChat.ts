/**
 * Script evaluado en WhatsApp Web para abrir un chat de la lista por nombre.
 */
export function buildWhatsAppOpenChatByNameJs(chatName: string): string {
  const nameJson = JSON.stringify(String(chatName).slice(0, 80));
  return `(() => {
    function norm(s) {
      return String(s || "").trim().toLowerCase();
    }
    var target = norm(${nameJson});
    if (!target) return false;

    function readRowName(row) {
      var aria = (row.getAttribute("aria-label") || "").trim();
      if (aria) {
        var clean = aria.replace(/,?\\s*\\d+\\s+unread\\b[^,]*/gi, "")
          .replace(/,?\\s*\\d+\\s+mensajes?\\s+no\\s+le[ií]dos?[^,]*/gi, "")
          .replace(/,?\\s*\\d{1,2}:\\d{2}[^,]*$/i, "")
          .trim();
        var parts = clean.split(",").map(function (p) { return p.trim(); }).filter(Boolean);
        if (parts[0]) return norm(parts[0]);
      }
      var titleEl = row.querySelector('span[title][dir="auto"]');
      if (titleEl) {
        return norm(titleEl.getAttribute("title") || titleEl.textContent || "");
      }
      return "";
    }

    function rowMatches(row) {
      var name = readRowName(row);
      if (!name) return false;
      return name === target || name.indexOf(target) >= 0 || target.indexOf(name) >= 0;
    }

    function clickRow(row) {
      var btn = row.querySelector('[role="button"]') || row.querySelector('[tabindex="0"]') || row;
      if (btn && typeof btn.click === "function") {
        btn.click();
        return true;
      }
      return false;
    }

    var root =
      document.querySelector('[data-testid="chat-list"]') ||
      document.querySelector("#pane-side") ||
      document.querySelector('[aria-label="Chat list"]') ||
      document.querySelector('[aria-label="Lista de chats"]');
    if (!root) return false;

    var rows = root.querySelectorAll('[data-testid="cell-frame-container"]');
    for (var i = 0; i < rows.length; i++) {
      if (rowMatches(rows[i]) && clickRow(rows[i])) return true;
    }
    return false;
  })()`;
}
