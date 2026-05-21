/** Estado de sesión de WhatsApp Web por cuenta (heurística DOM / red). */
export type AccountSessionStatus = "loading" | "qr" | "connected" | "offline";

export const ACCOUNT_SESSION_STATUS_LABEL: Record<AccountSessionStatus, string> = {
  loading: "Cargando…",
  qr: "Esperando QR",
  connected: "Conectada",
  offline: "Sin red",
};

export const WHATSAPP_SESSION_STATUS_JS = `(() => {
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
})()`;
