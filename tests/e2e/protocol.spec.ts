import { test, expect } from "@playwright/test";
import { launchApp, closeApp } from "./helpers/launch";

test.describe("enlaces WhatsApp entrantes", () => {
  test("parser e2e: whatsapp:// con texto", async () => {
    const launched = await launchApp();
    try {
      const { shell } = launched;
      await expect(shell.locator(".catrip-rail-account-btn").first()).toBeVisible({
        timeout: 15_000,
      });
      const parsed = await shell.evaluate(async () => {
        return window.catrip.e2eParseWhatsAppUrl("whatsapp://send?phone=34600111222&text=Hola");
      });
      expect(parsed).toMatchObject({
        kind: "phone",
        digits: "34600111222",
        text: "Hola",
      });
    } finally {
      await closeApp(launched);
    }
  });

  test("enlace entrante abre send URL con texto en cuenta activa", async () => {
    const launched = await launchApp({
      settingsPatch: {
        general: { incomingLinkMode: "active" },
      },
    });
    try {
      const { shell } = launched;
      await expect(shell.locator(".catrip-rail-account-btn").first()).toBeVisible({
        timeout: 15_000,
      });
      await shell.evaluate(async () => {
        await window.catrip.e2eSimulateIncomingUrl(
          "whatsapp://send?phone=34600999888&text=PruebaE2E",
        );
      });
      await expect
        .poll(
          async () => shell.evaluate(async () => window.catrip.e2eGetLastIncomingNavigation()),
          { timeout: 10_000 },
        )
        .toMatchObject({
          accountId: expect.any(String),
          url: expect.stringContaining("web.whatsapp.com/send?phone=34600999888"),
        });
      const nav = await shell.evaluate(async () => window.catrip.e2eGetLastIncomingNavigation());
      expect(nav?.url).toContain("text=PruebaE2E");
    } finally {
      await closeApp(launched);
    }
  });

  test("invitación a grupo chat.whatsapp.com", async () => {
    const launched = await launchApp({
      settingsPatch: { general: { incomingLinkMode: "active" } },
    });
    try {
      const { shell } = launched;
      await expect(shell.locator(".catrip-rail-account-btn").first()).toBeVisible({
        timeout: 15_000,
      });
      await shell.evaluate(async () => {
        await window.catrip.e2eSimulateIncomingUrl("https://chat.whatsapp.com/InviteE2EGroup99");
      });
      await expect
        .poll(
          async () => shell.evaluate(async () => window.catrip.e2eGetLastIncomingNavigation()),
          { timeout: 10_000 },
        )
        .toMatchObject({
          url: expect.stringMatching(/web\.whatsapp\.com\/accept\?code=InviteE2EGroup99/),
        });
    } finally {
      await closeApp(launched);
    }
  });

  test("modo fixed abre en la cuenta configurada", async () => {
    const launched = await launchApp({
      settingsPatch: { general: { incomingLinkMode: "fixed" } },
    });
    try {
      const { shell } = launched;
      await expect(shell.locator(".catrip-rail-account-btn").first()).toBeVisible({
        timeout: 15_000,
      });
      const secondAccountId = await shell.evaluate(async () => {
        const acc = await window.catrip.createAccount("Cuenta E2E enlace");
        const settings = (await window.catrip.getSettings()) as {
          general: Record<string, unknown>;
        };
        await window.catrip.setSettings({
          ...settings,
          general: {
            ...settings.general,
            incomingLinkMode: "fixed",
            incomingLinkFixedAccountId: acc.id,
          },
        });
        return acc.id;
      });
      await shell.evaluate(async () => {
        await window.catrip.e2eSimulateIncomingUrl("https://wa.me/34600777666?text=Fixed");
      });
      await expect
        .poll(
          async () => shell.evaluate(async () => window.catrip.e2eGetLastIncomingNavigation()),
          { timeout: 20_000 },
        )
        .toMatchObject({
          accountId: secondAccountId,
          url: expect.stringMatching(/phone=34600777666/),
        });
      const nav = await shell.evaluate(async () => window.catrip.e2eGetLastIncomingNavigation());
      expect(nav?.url).toContain("text=Fixed");
    } finally {
      await closeApp(launched);
    }
  });
});
