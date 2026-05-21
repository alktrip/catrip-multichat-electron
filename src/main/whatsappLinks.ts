export const WHATSAPP_SEND_URL = "https://web.whatsapp.com/send?phone=";

export type WhatsAppIncomingLink =
  | { kind: "phone"; digits: string; text?: string }
  | { kind: "webSend"; url: string };

export function normalizeE164Digits(input: string): string | null {
  const raw = (input || "").trim();
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length < 9 || digits.length > 15) return null;
  return digits;
}

/** Enlace entrante (`whatsapp://`, `wa.me`, API/Web) → teléfono (y texto opcional) o URL de envío. */
export function parseWhatsAppIncomingUrl(raw: string): WhatsAppIncomingLink | null {
  const s = (raw || "").trim();
  if (!s) return null;
  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./i, "").toLowerCase();
  const proto = url.protocol.replace(/:$/, "").toLowerCase();

  const textParam = url.searchParams.get("text")?.trim() || undefined;

  if (proto === "whatsapp") {
    const phone =
      url.searchParams.get("phone") ||
      url.pathname.replace(/^\/+/, "").split("/")[0] ||
      "";
    const digits = normalizeE164Digits(phone);
    if (digits) return { kind: "phone", digits, text: textParam };
    return null;
  }

  if (host === "wa.me" || host === "wa.link") {
    const seg = url.pathname.replace(/^\/+/, "").split("/")[0] || "";
    const digits = normalizeE164Digits(seg);
    if (digits) return { kind: "phone", digits, text: textParam };
    return null;
  }

  if (host === "api.whatsapp.com" || host === "web.whatsapp.com") {
    const phone = url.searchParams.get("phone");
    if (phone) {
      const digits = normalizeE164Digits(phone);
      if (digits) return { kind: "phone", digits, text: textParam };
    }
    if (host === "web.whatsapp.com" && /^\/send\b/i.test(url.pathname)) {
      return { kind: "webSend", url: url.toString() };
    }
  }

  return null;
}

export function buildWhatsAppSendUrl(digits: string, text?: string): string {
  const base = `${WHATSAPP_SEND_URL}${digits}`;
  if (!text) return base;
  return `${base}&text=${encodeURIComponent(text)}`;
}

export function resolveTargetUrl(link: WhatsAppIncomingLink): string {
  if (link.kind === "webSend") return link.url;
  return buildWhatsAppSendUrl(link.digits, link.text);
}

export function extractWhatsAppUrlFromArgv(argv: string[]): string | null {
  for (let i = argv.length - 1; i >= 0; i--) {
    const a = argv[i];
    if (!a || a.startsWith("-")) continue;
    if (
      /^whatsapp:/i.test(a) ||
      /wa\.me/i.test(a) ||
      /wa\.link/i.test(a) ||
      /web\.whatsapp\.com/i.test(a) ||
      /api\.whatsapp\.com/i.test(a)
    ) {
      return a;
    }
  }
  return null;
}
