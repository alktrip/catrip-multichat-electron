import { test, expect } from "@playwright/test";
import { launchApp, closeApp, type LaunchedApp } from "./helpers/launch";

let launched: LaunchedApp | undefined;

test.beforeAll(async () => {
  launched = await launchApp();
  // Reenviamos los logs/errores del renderer al stdout del runner para que un
  // fallo intermitente sea diagnosticable sin tener que abrir el trace.
  launched.shell.on("console", (msg) => {
    const text = msg.text();
    if (text.includes("[catrip") || text.includes("[E2E]")) {
      console.log(`[renderer:${msg.type()}]`, text);
    }
  });
  launched.shell.on("pageerror", (err) => {
    console.error("[renderer:error]", err.message);
  });
});

test.afterAll(async () => {
  await closeApp(launched);
  launched = undefined;
});

const NEW_NAME = "Cuenta E2E renombrada";

const newAccountBtn =
  'button[title="Nueva cuenta"], button[title="New account"], button[title="Crear tu primera cuenta"], button[title="Create your first account"]';
const settingsBtn = 'button[title="Ajustes"], button[title="Settings"]';

test("crear → renombrar → eliminar una cuenta desde Ajustes", async () => {
  const { shell } = launched!;

  // 1. Estado inicial: la app crea automáticamente "Cuenta 1" si no hay ninguna.
  const railAccounts = shell.locator(".catrip-rail-account-btn");
  await expect(railAccounts.first()).toBeVisible({ timeout: 15_000 });
  const initialCount = await railAccounts.count();
  expect(initialCount).toBeGreaterThanOrEqual(1);

  // 2. Crear una cuenta nueva con el botón "+" del rail.
  await expect(shell.locator(newAccountBtn).first()).toBeVisible({ timeout: 15_000 });
  await shell.locator(newAccountBtn).first().click();
  await expect(railAccounts).toHaveCount(initialCount + 1);

  // 3. Abrir Ajustes y navegar a "Cuentas".
  await shell.locator(settingsBtn).click();
  await shell.locator("#sidebar").waitFor({ state: "visible" });
  await shell.getByRole("button", { name: /^(Cuentas|Accounts)$/ }).click();

  // 4. La última card es la cuenta recién creada → click en "Renombrar".
  const renombrarBtns = shell.getByRole("button", { name: /^(Renombrar|Rename)$/ });
  await expect(renombrarBtns).toHaveCount(initialCount + 1);
  await renombrarBtns.last().click();

  // 5. Sustituir el texto del input visible y guardar.
  const editInput = shell.getByLabel(/^(Nombre de la cuenta|Account name)$/);
  await expect(editInput).toBeVisible();
  await editInput.fill(NEW_NAME);
  await shell.getByRole("button", { name: /^(Guardar|Save)$/ }).click();

  // 6. Toast de éxito y label nuevo en la lista.
  await expect(shell.locator(".catrip-toast--success .catrip-toast-message").last()).toContainText(
    /renombrad/i,
    { timeout: 8_000 },
  );
  await expect(shell.getByText(NEW_NAME, { exact: true }).first()).toBeVisible();

  // 7. Eliminar la cuenta renombrada → confirmar en el modal.
  const eliminarBtns = shell.getByRole("button", { name: /^(Eliminar|Delete)$/ });
  await eliminarBtns.last().click();
  await expect(shell.getByText(new RegExp(`[«"]${NEW_NAME}[»"]`))).toBeVisible();
  await shell
    .getByRole("button", { name: /^(Eliminar definitivamente|Delete permanently)$/ })
    .click();

  // 8. Toast de éxito de eliminación.
  await expect(shell.locator(".catrip-toast--success .catrip-toast-message").last()).toContainText(
    /eliminad/i,
    { timeout: 8_000 },
  );

  // 9. La lista de cuentas vuelve al conteo inicial y el label desaparece.
  await expect(shell.getByRole("button", { name: /^(Renombrar|Rename)$/ })).toHaveCount(
    initialCount,
  );
  await expect(shell.getByText(NEW_NAME, { exact: true })).toHaveCount(0);
});
