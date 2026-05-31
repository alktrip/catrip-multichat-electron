import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseWhatsAppIncomingUrl,
  buildWhatsAppSendUrl,
  normalizeE164Digits,
  extractWhatsAppUrlFromArgv,
} from "../../dist/main/whatsappLinks.js";

test("parse whatsapp:// con teléfono y texto", () => {
  const link = parseWhatsAppIncomingUrl("whatsapp://send?phone=34600111222&text=Hola%20mundo");
  assert.equal(link?.kind, "phone");
  if (link?.kind === "phone") {
    assert.equal(link.digits, "34600111222");
    assert.equal(link.text, "Hola mundo");
  }
});

test("parse wa.me con texto en query", () => {
  const link = parseWhatsAppIncomingUrl("https://wa.me/5215512345678?text=Ping");
  assert.equal(link?.kind, "phone");
  if (link?.kind === "phone") {
    assert.equal(link.digits, "5215512345678");
    assert.equal(link.text, "Ping");
  }
});

test("buildWhatsAppSendUrl codifica texto", () => {
  const url = buildWhatsAppSendUrl("34600", "Hola & adiós");
  assert.ok(url.includes("phone=34600"));
  assert.ok(url.includes("text=Hola%20%26%20adi%C3%B3s"));
});

test("normalizeE164Digits rechaza números cortos", () => {
  assert.equal(normalizeE164Digits("123"), null);
  assert.equal(normalizeE164Digits("+34600111222"), "34600111222");
});

test("parse chat.whatsapp.com como invitación a grupo", () => {
  const link = parseWhatsAppIncomingUrl("https://chat.whatsapp.com/AbCdEfGhIjKlMnOpQr");
  assert.equal(link?.kind, "groupInvite");
  if (link?.kind === "groupInvite") {
    assert.ok(link.url.includes("web.whatsapp.com/accept"));
    assert.ok(link.url.includes("AbCdEfGhIjKlMnOpQr"));
  }
});

test("parse web.whatsapp.com/accept?code=", () => {
  const link = parseWhatsAppIncomingUrl("https://web.whatsapp.com/accept?code=InviteCode123");
  assert.equal(link?.kind, "groupInvite");
});

test("extractWhatsAppUrlFromArgv toma el último enlace", () => {
  const url = extractWhatsAppUrlFromArgv([
    "electron",
    ".",
    "--no-sandbox",
    "whatsapp://send?phone=34600111222",
  ]);
  assert.equal(url, "whatsapp://send?phone=34600111222");
});
