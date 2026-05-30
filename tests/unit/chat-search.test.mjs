import test from "node:test";
import assert from "node:assert/strict";
import { filterChatSearchItems } from "../../dist/main/chatSearchModel.js";

const accounts = [
  { id: "a1", label: "Personal", icon: "icon-a" },
  { id: "a2", label: "Trabajo", icon: "icon-b" },
];

const activity = {
  a1: {
    unread: 2,
    unreadChats: [{ name: "Ana García", preview: "¿Quedamos hoy?", unreadCount: 2 }],
    lastActivityAt: 1000,
  },
  a2: {
    unread: 1,
    unreadChats: [{ name: "Cliente Norte", preview: "Presupuesto enviado", unreadCount: 1 }],
    lastActivityAt: 2000,
  },
};

test("filterChatSearchItems devuelve vacío sin consulta", () => {
  assert.deepEqual(filterChatSearchItems(accounts, activity, ""), []);
  assert.deepEqual(filterChatSearchItems(accounts, activity, "   "), []);
});

test("filterChatSearchItems encuentra por nombre de chat", () => {
  const hits = filterChatSearchItems(accounts, activity, "ana");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].chatName, "Ana García");
  assert.equal(hits[0].accountLabel, "Personal");
});

test("filterChatSearchItems encuentra por cuenta y preview", () => {
  const byAccount = filterChatSearchItems(accounts, activity, "trabajo");
  assert.equal(byAccount.length, 1);
  assert.equal(byAccount[0].chatName, "Cliente Norte");

  const byPreview = filterChatSearchItems(accounts, activity, "presupuesto");
  assert.equal(byPreview.length, 1);
  assert.equal(byPreview[0].accountId, "a2");
});

test("filterChatSearchItems exige todas las palabras (AND)", () => {
  const hits = filterChatSearchItems(accounts, activity, "ana personal");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].chatName, "Ana García");

  assert.deepEqual(filterChatSearchItems(accounts, activity, "ana trabajo"), []);
});
