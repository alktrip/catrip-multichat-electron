/**
 * electron-builder (AppImage) escribe el .desktop solo en la raíz del AppDir
 * (`appImageUtil.js`: `path.join(stageDir, desktopFileName)`). `AppRun` añade
 * `$APPDIR/usr/share` a `XDG_DATA_DIRS`, por lo que GTK/GNOME y Chromium
 * buscan entradas en `usr/share/applications/`. Si no existen, no enlazan
 * `app_id` / `StartupWMClass` con un `.desktop` y el dock muestra un icono
 * genérico. El `.deb` ya instala vía FPM en `/usr/share/applications/`; esto
 * alinea el layout del AppImage con el estándar XDG dentro del SquashFS.
 */
const fs = require("node:fs/promises");
const path = require("node:path");

module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== "linux") return;

  const projectDir = context.packager.projectDir;
  const appOutDir = context.appOutDir;
  const src = path.join(projectDir, "assets", "packaging", "catrip-connect.desktop");
  const destDir = path.join(appOutDir, "usr", "share", "applications");
  const dest = path.join(destDir, "catrip-connect.desktop");

  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(src, dest);
};
