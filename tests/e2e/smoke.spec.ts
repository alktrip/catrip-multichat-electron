import { test, expect } from "@playwright/test";
import { launchApp, closeApp, type LaunchedApp } from "./helpers/launch";

let launched: LaunchedApp | undefined;

test.beforeAll(async () => {
  launched = await launchApp();
});

test.afterAll(async () => {
  await closeApp(launched);
  launched = undefined;
});

test("smoke: el shell renderiza el rail con al menos una cuenta", async () => {
  const { shell } = launched!;
  await expect(shell.locator(".catrip-rail-account-btn").first()).toBeVisible({
    timeout: 15_000,
  });
});
