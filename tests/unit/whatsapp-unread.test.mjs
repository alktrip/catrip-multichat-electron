import { test } from "node:test";
import assert from "node:assert/strict";
import { WHATSAPP_UNREAD_COUNT_JS } from "../../dist/main/whatsappUnread.js";

function makeElement({
  tag = "span",
  testid,
  icon,
  aria,
  text = "",
  parent,
  children = [],
  querySelector,
  querySelectorAll,
}) {
  const el = {
    tagName: tag.toUpperCase(),
    getAttribute(name) {
      if (name === "data-testid") return testid ?? null;
      if (name === "data-icon") return icon ?? null;
      if (name === "aria-label") return aria ?? null;
      if (name === "title") return null;
      return null;
    },
    textContent: text,
    closest(sel) {
      if (sel === '[data-testid="status-v3-outgoing"]') return null;
      return parent ?? null;
    },
    querySelector:
      querySelector ??
      function () {
        return null;
      },
    querySelectorAll:
      querySelectorAll ??
      function () {
        return [];
      },
    children,
  };
  for (const c of children) {
    if (!c.parent) c.parent = el;
  }
  return el;
}

function runUnreadScript({ title, chatList }) {
  const doc = {
    title,
    querySelector(sel) {
      if (
        sel === '[data-testid="chat-list"]' ||
        sel === "#pane-side" ||
        sel === '[aria-label="Chat list"]' ||
        sel === '[aria-label="Lista de chats"]'
      ) {
        return chatList ?? null;
      }
      return null;
    },
  };
  const fn = new Function("document", `return ${WHATSAPP_UNREAD_COUNT_JS}`);
  return fn(doc);
}

test("usa el contador del título de WhatsApp Web", () => {
  assert.equal(runUnreadScript({ title: "(7) WhatsApp" }), 7);
  assert.equal(runUnreadScript({ title: "(3) WhatsApp Business" }), 3);
  assert.equal(runUnreadScript({ title: "12 unread messages" }), 12);
});

test("título sin paréntesis implica cero no leídos", () => {
  assert.equal(runUnreadScript({ title: "WhatsApp" }), 0);
});

test("no duplica badges dentro de la misma fila de chat", () => {
  const badge = makeElement({
    testid: "unread-count",
    text: "4",
  });
  const chatList = makeElement({
    tag: "div",
    testid: "chat-list",
    querySelectorAll(sel) {
      if (sel.includes("unread-count")) return [badge];
      return [];
    },
  });
  badge.parent = chatList;

  assert.equal(runUnreadScript({ title: "", chatList }), 4, "un solo badge debe contarse una vez");
});

test("no infla con aria-labels globales fuera de badges", () => {
  const chatList = makeElement({
    tag: "div",
    testid: "chat-list",
    querySelectorAll() {
      return [];
    },
  });
  assert.equal(runUnreadScript({ title: "", chatList }), 0);
});
