/**
 * Cargar **antes** que `main.ts` para fijar `CHROME_DESKTOP` lo antes posible.
 * En Electron Linux, `wayland_app_id` sólo se asigna si existe `CHROME_DESKTOP`
 * (`GetXdgAppId()` en `platform_util_linux.cc`).
 *
 * **AppImage:** `assets/packaging/AppRun` (hook after-pack) ya exporta esta variable
 * **antes** de `exec` del binario; Chromium lo necesita al arrancar el proceso nativo,
 * antes de ejecutar JS. Este bloque cubre `.deb` y ejecución directa del binario.
 *
 * El `.desktop` debe ser resoluble vía `XDG_DATA_DIRS` (`after-pack` coloca
 * `usr/share/applications/catrip-connect.desktop` en el AppDir). El tema `hicolor`
 * debe incluir `index.theme` para que GTK resuelva `Icon=catrip-connect`.
 */
if (process.platform === "linux") {
  if (!process.env.CHROME_DESKTOP) {
    process.env.CHROME_DESKTOP = "catrip-connect.desktop";
  }
}

require("./main");
