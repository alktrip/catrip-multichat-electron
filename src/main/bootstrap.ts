/**
 * Cargar **antes** que `main.ts` para que las variables de entorno estén
 * fijadas cuando Chromium arranca. `CHROME_DESKTOP` enlaza la ventana con el
 * fichero .desktop (icono en dock / conmutador, sobre todo bajo Wayland);
 * ver comentario en `main.ts` sobre `StartupWMClass` y `desktopName`.
 */
if (process.platform === "linux") {
  if (!process.env.CHROME_DESKTOP) {
    process.env.CHROME_DESKTOP = "catrip-connect.desktop";
  }
}

require("./main");
