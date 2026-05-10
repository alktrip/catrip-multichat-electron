/**
 * Cargar **antes** que `main.ts` para que las variables de entorno estén
 * fijadas cuando Chromium arranca. `CHROME_DESKTOP` enlaza la ventana con el
 * ID del `.desktop` (icono en dock / conmutador, sobre todo bajo Wayland).
 *
 * Debe existir un fichero resoluble vía `XDG_DATA_DIRS`, p. ej.
 * `usr/share/applications/catrip-connect.desktop` (lo añade `after-pack-linux.js`
 * al AppImage; el `.deb` instala el mismo nombre en el sistema).
 */
if (process.platform === "linux") {
  if (!process.env.CHROME_DESKTOP) {
    process.env.CHROME_DESKTOP = "catrip-connect.desktop";
  }
}

require("./main");
