/**
 * Punto de entrada real (`package.json` → `main`). Aquí **solo** `electron` y este
 * archivo corren antes que `main.ts`. Los `import` de `main.ts` se evalúan todos
 * antes de su cuerpo: si los switches de Chromium van ahí, el sandbox setuid puede
 * inicializarse antes de `appendSwitch` → `setuid_sandbox_host.cc`.
 *
 * Orden obligatorio: `CHROME_DESKTOP` → `appendSwitch` → `require("./main")`.
 *
 * **AppImage:** `AppRun` ya exporta `CHROME_DESKTOP` antes del binario; este bloque
 * cubre `.deb` y ejecución directa.
 */
import { app } from "electron";
import { applyChromiumLaunchSwitches } from "./chromiumLaunch";

applyChromiumLaunchSwitches(app);

if (process.platform === "linux") {
  if (!process.env.CHROME_DESKTOP) {
    process.env.CHROME_DESKTOP = "catrip-connect.desktop";
  }
  // Antes de cargar main (y sus imports); Chromium parsea esto antes del helper setuid.
  app.commandLine.appendSwitch("disable-setuid-sandbox");
  // X11: WM_CLASS; debe ir también antes de `require("./main")`.
  app.commandLine.appendSwitch("class", "catrip-connect");
}

require("./main");
