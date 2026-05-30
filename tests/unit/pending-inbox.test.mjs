import { test } from "node:test";
import assert from "node:assert/strict";
import { buildPendingChatItems, pickTopUrgentChats } from "../../dist/main/pendingInboxModel.js";

test("buildPendingChatItems ordena por urgencia (más no leídos primero)", () => {
  const now = Date.now();
  const items = buildPendingChatItems(
    [
      { id: "a1", label: "Personal", icon: "x" },
      { id: "a2", label: "Trabajo", icon: "y" },
    ],
    {
      a1: {
        unread: 2,
        status: "connected",
        lastSender: "Ana",
        lastPreview: "Hola",
        lastActivityAt: now - 60_000,
        unreadChats: [{ name: "Ana", preview: "Hola", unreadCount: 2 }],
      },
      a2: {
        unread: 5,
        status: "connected",
        lastSender: "Cliente",
        lastPreview: "Urgente",
        lastActivityAt: now - 10_000,
        unreadChats: [
          { name: "Cliente", preview: "Urgente", unreadCount: 5 },
          { name: "Equipo", preview: "Sync", unreadCount: 1 },
        ],
      },
    },
  );
  assert.equal(items.length, 3);
  assert.equal(items[0].chatName, "Cliente");
  assert.equal(items[0].unreadCount, 5);
  assert.equal(items[1].chatName, "Ana");
});

test("pickTopUrgentChats devuelve como máximo N chats ordenados", () => {
  const now = Date.now();
  const top = pickTopUrgentChats(
    [
      { id: "a1", label: "Personal", icon: "x" },
      { id: "a2", label: "Trabajo", icon: "y" },
    ],
    {
      a1: {
        unread: 2,
        unreadChats: [
          { name: "Ana", preview: "Hola", unreadCount: 2 },
          { name: "Luis", preview: "Ok", unreadCount: 1 },
        ],
        lastActivityAt: now,
      },
      a2: {
        unread: 5,
        unreadChats: [{ name: "Cliente", preview: "Urgente", unreadCount: 5 }],
        lastActivityAt: now - 10_000,
      },
    },
    2,
  );
  assert.equal(top.length, 2);
  assert.equal(top[0].chatName, "Cliente");
  assert.equal(top[1].chatName, "Ana");
});
