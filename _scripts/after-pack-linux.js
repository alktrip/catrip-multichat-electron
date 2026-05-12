/**
 * Complementos al layout Linux tras empaquetar `linux-unpacked`.
 *
 * 1) **applications:** electron-builder (AppImage) solo escribe el `.desktop` en
 *    la raíz del AppDir (`appImageUtil.js`). `AppRun` antepone `$APPDIR/usr/share`
 *    a `XDG_DATA_DIRS`; las entradas deben estar en `applications/`.
 *
 * 2) **hicolor/index.theme:** electron-builder copia los PNG bajo cada carpeta
 *    …/hicolor/NxN/apps/ pero no incluye index.theme. Sin ese
 *    fichero, GTK no trata `hicolor` como tema de iconos válido y la resolución
 *    de `Icon=catrip-connect` desde el `.desktop` falla → icono genérico en el
 *    dock / lista de aplicaciones aunque existan los PNG.
 *
 * 3) **gtk-update-icon-cache** (si existe en el sistema de build): genera la
 *    caché opcional que algunos lectores de temas usan.
 *
 * 4) **AppRun:** la plantilla de electron-builder no exporta `CHROME_DESKTOP`;
 *    debe estar definida **antes** de `exec catrip-connect`. Si sólo se fija en
 *    `bootstrap.ts` (JS), el proceso nativo de Chromium puede inicializarse sin
 *    ella. Copiamos `assets/packaging/AppRun` sobre `linux-unpacked/AppRun`; al
 *    empaquetar el AppImage, `copyDir(appDir, stageDir)` sustituye el AppRun
 *    generado por uno que exporta `CHROME_DESKTOP` antes del binario.
 *    Además, el AppRun antepone `--disable-setuid-sandbox` en argv: en Electron
 *    reciente la comprobación de `chrome-sandbox` (4755) ocurre en el binario
 *    **antes** de ejecutar JS; sin este flag, AppImage en FS montado falla con
 *    `setuid_sandbox_host.cc` (p. ej. Ubuntu 24+).
 *
 * Referencia Electron v42: `wayland_app_id` solo se rellena si existe la
 * variable de entorno `CHROME_DESKTOP` (`platform_util_linux.cc` → `GetXdgAppId`).
 */
const fs = require("node:fs/promises");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

/** Coincidir con los tamaños que genera `_scripts/generate-app-icons.mjs` / builder. */
const HICOLOR_APP_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];

function minimalHicolorIndexTheme() {
  const dirs = HICOLOR_APP_SIZES.map((s) => `${s}x${s}/apps`).join(",");
  let out = `[Icon Theme]
Name=Hicolor
Comment=Fallback icon theme (bundled for AppImage)
Hidden=true
Directories=${dirs}

`;
  for (const s of HICOLOR_APP_SIZES) {
    out += `[${s}x${s}/apps]
Size=${s}
Context=Applications
Type=Threshold

`;
  }
  return out;
}

module.exports = async function afterPack(context) {
  if (context.electronPlatformName !== "linux") return;

  const projectDir = context.packager.projectDir;
  const appOutDir = context.appOutDir;

  const desktopSrc = path.join(projectDir, "assets", "packaging", "catrip-connect.desktop");
  const appDir = path.join(appOutDir, "usr", "share", "applications");
  await fs.mkdir(appDir, { recursive: true });
  await fs.copyFile(desktopSrc, path.join(appDir, "catrip-connect.desktop"));

  const hicolorRoot = path.join(appOutDir, "usr", "share", "icons", "hicolor");
  await fs.mkdir(hicolorRoot, { recursive: true });
  await fs.writeFile(path.join(hicolorRoot, "index.theme"), minimalHicolorIndexTheme(), "utf-8");

  spawnSync("gtk-update-icon-cache", ["-f", "-t", hicolorRoot], { stdio: "ignore" });

  const appRunSrc = path.join(projectDir, "assets", "packaging", "AppRun");
  const appRunDest = path.join(appOutDir, "AppRun");
  await fs.copyFile(appRunSrc, appRunDest);
  await fs.chmod(appRunDest, 0o755);
};
