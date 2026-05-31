import { test } from "node:test";
import assert from "node:assert/strict";
import {
  WHATSAPP_ACTIVITY_JS,
  normalizeWhatsAppActivityRaw,
} from "../../dist/main/whatsappActivity.js";
import { buildActivitySnapshot, activityMapsEqual } from "../../dist/main/accountActivity.js";

test("normalizeWhatsAppActivityRaw sanea datos crudos", () => {
  const out = normalizeWhatsAppActivityRaw({
    unread: 3.9,
    unreadChats: [{ name: " Ana ", preview: " Hola ", unreadCount: 2 }],
    lastSender: null,
    lastPreview: null,
  });
  assert.equal(out.unread, 3);
  assert.equal(out.lastSender, "Ana");
  assert.equal(out.lastPreview, "Hola");
  assert.equal(out.unreadChats[0].name, "Ana");
});

test("buildActivitySnapshot actualiza lastActivityAt al cambiar preview", () => {
  const first = buildActivitySnapshot(
    { unread: 1, unreadChats: [], lastSender: "Bob", lastPreview: "Hi" },
    "connected",
  );
  assert.ok(first.lastActivityAt);
  const second = buildActivitySnapshot(
    { unread: 1, unreadChats: [], lastSender: "Bob", lastPreview: "Hi" },
    "connected",
    first,
  );
  assert.equal(second.lastActivityAt, first.lastActivityAt);
  const third = buildActivitySnapshot(
    { unread: 2, unreadChats: [], lastSender: "Bob", lastPreview: "New" },
    "connected",
    second,
  );
  assert.notEqual(third.lastActivityAt, second.lastActivityAt);
});

test("activityMapsEqual compara chats sin leer", () => {
  const a = {
    x: buildActivitySnapshot(
      {
        unread: 2,
        unreadChats: [{ name: "A", preview: "p", unreadCount: 2 }],
        lastSender: "A",
        lastPreview: "p",
      },
      "connected",
    ),
  };
  const b = {
    x: buildActivitySnapshot(
      {
        unread: 2,
        unreadChats: [{ name: "A", preview: "p", unreadCount: 2 }],
        lastSender: "A",
        lastPreview: "p",
      },
      "connected",
    ),
  };
  assert.equal(activityMapsEqual(a, b), true);
});

test("WHATSAPP_ACTIVITY_JS devuelve preview desde fila con badge", () => {
  const badge = {
    getAttribute() {
      return null;
    },
    closest() {
      return null;
    },
    textContent: "2",
  };
  const row = {
    getAttribute(name) {
      if (name === "aria-label") return "María, ¿Quedamos hoy?, 2 unread messages, 10:30";
      return null;
    },
    querySelector(sel) {
      if (String(sel).includes("unread-count")) return badge;
      if (String(sel).includes('span[title][dir="auto"]')) return null;
      return null;
    },
    querySelectorAll() {
      return [];
    },
  };
  const chatList = {
    querySelectorAll(sel) {
      if (String(sel).includes("cell-frame-container")) return [row];
      return [];
    },
  };
  const doc = {
    title: "(2) WhatsApp",
    querySelector(sel) {
      if (String(sel).includes("chat-list") || sel === "#pane-side") return chatList;
      return null;
    },
  };
  const fn = new Function("document", `return ${WHATSAPP_ACTIVITY_JS}`);
  const raw = fn(doc);
  assert.equal(raw.unread, 2);
  assert.equal(raw.unreadChats.length, 1);
  assert.equal(raw.unreadChats[0].name, "María");
  assert.equal(raw.unreadChats[0].preview, "¿Quedamos hoy?");
});
