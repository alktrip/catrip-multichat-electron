import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppWebUserAgent } from "../../dist/main/chromiumUserAgent.js";
import {
  normalizeWhatsAppHeartbeatRaw,
  WHATSAPP_HEARTBEAT_FULL_JS,
  WHATSAPP_HEARTBEAT_LIGHT_JS,
} from "../../dist/main/whatsappHeartbeat.js";
import { resolveEffectiveChromiumProfile, resolveOzonePlatform } from "../../dist/main/chromiumLaunch.js";
import { resolveBackgroundThrottleTier } from "../../dist/main/whatsappViewRuntime.js";

test("buildWhatsAppWebUserAgent usa la versión de Chrome indicada", () => {
  const ua = buildWhatsAppWebUserAgent("142.0.7444.52");
  assert.match(ua, /Chrome\/142\.0\.7444\.52/);
  assert.match(ua, /Safari\/537\.36$/);
});

test("normalizeWhatsAppHeartbeatRaw combina actividad, estado y llamada", () => {
  const out = normalizeWhatsAppHeartbeatRaw({
    unread: 2,
    unreadChats: [{ name: "Ana", preview: "Hola", unreadCount: 2 }],
    lastSender: "Ana",
    lastPreview: "Hola",
    status: "connected",
    callActive: true,
  });
  assert.ok(out);
  assert.equal(out.unread, 2);
  assert.equal(out.status, "connected");
  assert.equal(out.callActive, true);
});

test("WHATSAPP_HEARTBEAT_LIGHT_JS devuelve unread desde el título", () => {
  const doc = {
    title: "(3) WhatsApp",
    location: { href: "https://web.whatsapp.com/" },
    querySelector: () => null,
    querySelectorAll: () => [],
  };
  const fn = new Function("document", "navigator", "location", `return ${WHATSAPP_HEARTBEAT_LIGHT_JS}`);
  const raw = fn(doc, { onLine: true }, doc.location);
  assert.equal(raw.unread, 3);
  assert.equal(raw.status, "loading");
  assert.equal(raw.callActive, false);
});

test("WHATSAPP_HEARTBEAT_FULL_JS detecta lista de chats conectada", () => {
  const chatList = { querySelectorAll: () => [] };
  const doc = {
    title: "WhatsApp",
    location: { href: "https://web.whatsapp.com/" },
    body: { innerText: "" },
    querySelector: (sel) =>
      String(sel).includes("chat-list") || sel === "#pane-side" ? chatList : null,
    querySelectorAll: () => [],
  };
  const fn = new Function("document", "navigator", "location", `return ${WHATSAPP_HEARTBEAT_FULL_JS}`);
  const raw = fn(doc, { onLine: true }, doc.location);
  assert.equal(raw.status, "connected");
});

test("resolveEffectiveChromiumProfile respeta gpuBoost legacy", () => {
  assert.equal(
    resolveEffectiveChromiumProfile({ chromiumProfile: "default", gpuBoost: true }),
    "aggressive",
  );
  assert.equal(
    resolveEffectiveChromiumProfile({ chromiumProfile: "conservative", gpuBoost: true }),
    "conservative",
  );
});

test("resolveOzonePlatform prioriza entorno y ajuste", () => {
  const prevOzone = process.env.CATRIP_OZONE_PLATFORM;
  const prevSession = process.env.XDG_SESSION_TYPE;
  const prevWayland = process.env.WAYLAND_DISPLAY;
  const prevDisplay = process.env.DISPLAY;
  try {
    delete process.env.CATRIP_OZONE_PLATFORM;
    process.env.XDG_SESSION_TYPE = "wayland";
    process.env.WAYLAND_DISPLAY = "wayland-0";
    process.env.DISPLAY = ":0";
    assert.equal(resolveOzonePlatform("auto"), "wayland");
    assert.equal(resolveOzonePlatform("x11"), "x11");
  } finally {
    if (prevOzone === undefined) delete process.env.CATRIP_OZONE_PLATFORM;
    else process.env.CATRIP_OZONE_PLATFORM = prevOzone;
    if (prevSession === undefined) delete process.env.XDG_SESSION_TYPE;
    else process.env.XDG_SESSION_TYPE = prevSession;
    if (prevWayland === undefined) delete process.env.WAYLAND_DISPLAY;
    else process.env.WAYLAND_DISPLAY = prevWayland;
    if (prevDisplay === undefined) delete process.env.DISPLAY;
    else process.env.DISPLAY = prevDisplay;
  }
});

test("resolveBackgroundThrottleTier endurece en modo Zen", () => {
  assert.equal(resolveBackgroundThrottleTier(false), "background");
  assert.equal(resolveBackgroundThrottleTier(true), "zen-background");
});
