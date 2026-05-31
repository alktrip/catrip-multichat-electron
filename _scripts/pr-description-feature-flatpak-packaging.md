# Pull Request: Empaquetado Flatpak (inicial)

**Rama:** `feature/flatpak-packaging` → `master`  
**Tipo:** feature / empaquetado  
**Versión de app:** 1.7.0 (sin bump; cambios bajo `[Unreleased]` en CHANGELOG)

---

## Summary

- Añade la infraestructura inicial para empaquetar **Catrip Connect** como **Flatpak** siguiendo la [guía oficial de Electron](https://docs.flatpak.org/en/latest/electron.html).
- No sustituye ni modifica los flujos existentes de **`.deb`** y **AppImage**; es un canal adicional orientado a sandbox, distribución universal y futura publicación en **Flathub**.
- Incluye manifest, metadatos AppStream, wrapper **zypak**, dependencias npm offline y scripts de build local verificados en Ubuntu.

---

## Motivación

El proyecto ya publica `.deb` y AppImage en GitHub Releases. Flatpak aporta:

- Sandbox con permisos declarados (`finish-args`)
- Runtime compartido (Freedesktop + Electron BaseApp)
- Camino hacia Flathub y actualizaciones con `flatpak update`

Este PR establece la **base reproducible** para iterar (CI, Flathub, bundle `.flatpak`) sin romper instalaciones actuales.

---

## Cambios principales

### Nuevo directorio `flatpak/`

| Archivo | Descripción |
| --- | --- |
| `com.catrip.catrip-multichat-electron.yml` | Manifest `flatpak-builder` (runtime 24.08, Electron BaseApp, Node 22) |
| `generated-sources.json` | ~708 KB — dependencias npm offline (`flatpak-node-generator`) |
| `run.sh` | Wrapper `zypak-wrapper` + `CHROME_DESKTOP=com.catrip.catrip-multichat-electron.desktop` |
| `com.catrip.catrip-multichat-electron.desktop` | Lanzador con ID Flatpak y handler `whatsapp://` |
| `com.catrip.catrip-multichat-electron.metainfo.xml` | Metadatos AppStream (Flathub-ready, sin screenshots aún) |

### Scripts

| Script | Función |
| --- | --- |
| `_scripts/flatpak-prepare-sources.sh` | Regenera `generated-sources.json` desde `package-lock.json` |
| `_scripts/flatpak-build.sh` | Build + instalación `--user` con `--install-deps-from=flathub` |

### `package.json`

- `dist:flatpak-dir` — `electron-builder --linux dir` (salida en `release/linux-unpacked`)
- `flatpak:sources` / `flatpak:build` — atajos a los scripts anteriores

### Documentación

- **docs/FLATPAK.md** — guía de build local
- **README.md** — tabla de formatos, coexistencia deb/Flatpak, comandos npm
- **USAGE.md** — §14 ampliado (Flatpak, actualizaciones, no mezclar con `.deb`)
- **CHANGELOG.md** — entrada `[Unreleased]`

### Otros

- `.gitignore` — `flatpak/.flatpak-builder/`, `flatpak/repo/`, `.flatpak-builder/`

---

## Permisos sandbox (`finish-args`)

- `--share=ipc`, `--device=dri`, `--socket=x11`, `--socket=pulseaudio`, `--share=network`
- `--env=ELECTRON_TRASH=gio`, `--env=XCURSOR_PATH=…`
- `--talk-name=org.kde.StatusNotifierWatcher` (bandeja SNI)
- `--talk-name=com.canonical.Unity` (badge/progress en icono)

---

## Build verificado

En Ubuntu con:

```bash
sudo apt install flatpak flatpak-builder python3-pil python3-venv
flatpak install flathub org.freedesktop.Platform//24.08 org.freedesktop.Sdk//24.08 \
  org.freedesktop.Sdk.Extension.node22//24.08 org.electronjs.Electron2.BaseApp//24.08
rm -rf node_modules
npm run flatpak:build
flatpak run com.catrip.catrip-multichat-electron
```

**Notas del build:**

- No se ejecuta `generate-app-icons.mjs` dentro del sandbox (Pillow no está en el SDK); se usan PNG ya versionados en `assets/icons/`.
- `electron-builder --linux dir` escribe en `release/linux-unpacked` (no `dist/`).
- El `.desktop` Flatpak usa `Exec=run.sh` (comando del manifest).

---

## Coexistencia con `.deb` / AppImage

| Aspecto | `.deb` / AppImage | Flatpak |
| --- | --- | --- |
| Desktop ID | `catrip-connect.desktop` | `com.catrip.catrip-multichat-electron.desktop` |
| Datos usuario | `~/.config/catrip_multichat_electron/` | Igual (mismo `appId` interno) |
| Actualizaciones | `electron-updater` / diálogo `.deb` | `flatpak update` (cuando haya repo remoto) |
| Releases GitHub | Sí | **No** (pendiente) |

**Recomendación:** no instalar `.deb` y Flatpak a la vez en el mismo usuario si se quiere un único lanzador en el menú.

---

## Fuera de alcance (PRs futuros)

- [ ] Job CI que construya Flatpak en GitHub Actions
- [ ] Artefacto Flatpak en GitHub Releases
- [ ] PR en [flathub/flathub](https://github.com/flathub/flathub) con fuente `git` + tag fijo
- [ ] Screenshots en `.metainfo.xml`
- [ ] Sustituir `type: dir` por `type: git` en el manifest (requerido por Flathub)
- [ ] Wayland nativo por defecto (`--socket=wayland` + `--socket=fallback-x11`)

---

## Test plan

- [ ] `npm run lint` / `npm run typecheck` / `npm run build` — sin regresiones
- [ ] `npm run dist:linux` — `.deb` y AppImage siguen generándose
- [ ] `rm -rf node_modules && npm run flatpak:build` — build Flatpak OK
- [ ] `flatpak run com.catrip.catrip-multichat-electron` — arranque en sesión de escritorio
- [ ] Login WhatsApp Web (QR), cambio de cuenta, bandeja SNI
- [ ] Enlace `whatsapp://` abre la app (Flatpak exporta MimeType)
- [ ] Desinstalar Flatpak: `flatpak uninstall --user com.catrip.catrip-multichat-electron`
- [ ] Confirmar que `.deb` instalado no entra en conflicto tras desinstalar Flatpak

---

## Cómo crear el PR manualmente

1. Abre: https://github.com/alktrip/catrip-multichat-electron/compare/master...feature/flatpak-packaging
2. **Título sugerido:** `feat(flatpak): empaquetado inicial con flatpak-builder y zypak`
3. Pega el cuerpo de este archivo (desde `## Summary` hasta `## Test plan`) en la descripción del PR.
4. Etiquetas sugeridas: `enhancement`, `linux`, `packaging`

Comando alternativo con GitHub CLI:

```bash
gh pr create --base master --head feature/flatpak-packaging \
  --title "feat(flatpak): empaquetado inicial con flatpak-builder y zypak" \
  --body-file _scripts/pr-description-feature-flatpak-packaging.md
```

---

## Referencias

- [Flatpak — Electron](https://docs.flatpak.org/en/latest/electron.html)
- [Flatpak — Manifests](https://docs.flatpak.org/en/latest/manifests.html)
- [docs/FLATPAK.md](../docs/FLATPAK.md)
