# Empaquetado Flatpak — Catrip Connect

Guía inicial para construir e instalar el Flatpak de Catrip Connect. Basada en la [documentación oficial de Flatpak para Electron](https://docs.flatpak.org/en/latest/electron.html).

## Requisitos del sistema de build

```bash
sudo apt install flatpak flatpak-builder python3-pil python3-venv
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.freedesktop.Platform//24.08 org.freedesktop.Sdk//24.08 \
  org.freedesktop.Sdk.Extension.node22//24.08 org.electronjs.Electron2.BaseApp//24.08
```

## Archivos del paquete

| Archivo | Propósito |
| --- | --- |
| `flatpak/com.catrip.catrip-multichat-electron.yml` | Manifest principal (`flatpak-builder`) |
| `flatpak/generated-sources.json` | Dependencias npm offline (generado) |
| `flatpak/run.sh` | Wrapper `zypak-wrapper` + `CHROME_DESKTOP` |
| `flatpak/com.catrip.catrip-multichat-electron.desktop` | Entrada de escritorio (ID Flatpak) |
| `flatpak/com.catrip.catrip-multichat-electron.metainfo.xml` | Metadatos AppStream |

## Regenerar dependencias npm

Cuando cambie `package-lock.json`:

```bash
rm -rf node_modules
bash _scripts/flatpak-prepare-sources.sh
git add flatpak/generated-sources.json
```

## Build e instalación local

```bash
# Sin node_modules en el árbol (flatpak-builder copia el directorio tal cual)
rm -rf node_modules
bash _scripts/flatpak-build.sh
flatpak run com.catrip.catrip-multichat-electron
```

Artefactos intermedios: `flatpak/.flatpak-builder/` y `flatpak/repo/`.

> **Nota:** el build Flatpak no ejecuta `generate-app-icons.mjs` (requiere Pillow en el host); usa los PNG ya versionados en `assets/icons/`. La salida de `electron-builder --linux dir` va a `release/linux-unpacked`.

## Diferencias respecto a deb / AppImage

- **Runtime**: Freedesktop 24.08 + Electron BaseApp (zypak).
- **Sandbox**: permisos declarados en `finish-args` del manifest.
- **Desktop ID**: `com.catrip.catrip-multichat-electron.desktop` (deb/AppImage siguen usando `catrip-connect.desktop`).
- **Actualizaciones**: vía `flatpak update`, no `electron-updater`.
- **Build**: `electron-builder --linux dir` dentro del sandbox, no genera `.deb` ni AppImage.

## Publicación en Flathub (pendiente)

1. Sustituir la fuente `type: dir` por `type: git` con tag/commit fijo.
2. Abrir PR en [flathub/flathub](https://github.com/flathub/flathub).
3. Añadir capturas de pantalla al `.metainfo.xml` (URLs en `https://dl.flathub.org/media/`).

## Referencias

- [Flatpak — Electron](https://docs.flatpak.org/en/latest/electron.html)
- [Flatpak — Manifests](https://docs.flatpak.org/en/latest/manifests.html)
- [Flatpak — Sandbox permissions](https://docs.flatpak.org/en/latest/sandbox-permissions.html)
