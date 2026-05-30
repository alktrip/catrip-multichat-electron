import { test } from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppOpenChatByNameJs } from "../../dist/main/whatsappOpenChat.js";

test("buildWhatsAppOpenChatByNameJs abre chat por nombre", () => {
  const row = {
    getAttribute(name) {
      if (name === "aria-label") return "María López, ¿Quedamos?, 2 unread, 10:30";
      return null;
    },
    querySelector(sel) {
      if (String(sel).includes("role")) return { click: () => true };
      return null;
    },
  };
  const chatList = {
    querySelectorAll(sel) {
      if (String(sel).includes("cell-frame-container")) return [row];
      return [];
    },
  };
  const doc = {
    querySelector(sel) {
      if (String(sel).includes("chat-list") || sel === "#pane-side") return chatList;
      return null;
    },
  };
  const fn = new Function("document", `return ${buildWhatsAppOpenChatByNameJs("María López")}`);
  assert.equal(fn(doc), true);
});
