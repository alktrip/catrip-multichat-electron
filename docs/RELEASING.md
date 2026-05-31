# Guía para publicar una versión — Catrip Connect

Checklist para **mantenedores**: alinear cambios de código, documentación, CI y publicación en GitHub Releases. No sustituye al historial público ([CHANGELOG.md](../CHANGELOG.md) ni a las notas por versión en `_scripts/release-notes-v*.md`).

---

## Panorama de automatización

| Workflow                                              | Disparador                          | Qué hace                                                                    |
| ----------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| **[CI](../.github/workflows/ci.yml)**                 | Push/PR a `master` o `main`         | Lint, formato, typecheck, build, tests unitarios, E2E (con `xvfb-run`)      |
| **CI → `package-appimage`**                           | Push a `master`/`main` (tras CI OK) | Construye AppImage + `latest-linux.yml` y los sube como artefacto (14 días) |
| **[Release Linux](../.github/workflows/release.yml)** | Push de tag `v*` (p. ej. `v1.8.0`)  | `.deb` + AppImage + `latest-linux.yml` → **GitHub Release**                 |

La versión de los paquetes sale de **`package.json`** (`version`). El renderer lee esa versión vía `__CATRIP_APP_VERSION__` en `vite.config.ts`.

---

## 1. Antes de versionar (local)

Reproduce lo que exige el CI:

```bash
npm ci
npm run lint
npm run format:check
npm run typecheck
npm run build
npm run test:unit
npx playwright install chromium --with-deps
xvfb-run --auto-servernum --server-args='-screen 0 1280x960x24' npm run test:e2e
```

Atajo equivalente al empaquetado local:

```bash
npm run dist:linux   # requiere: sudo apt install dpkg fakeroot python3-pil
```

Comprueba que existan en `release/`:

- `catrip-connect_<versión>_amd64.deb`
- `catrip-connect_<versión>_x86_64.AppImage`
- `latest-linux.yml`

> En CI, `electron-builder` usa `--publish never` para no exigir `GH_TOKEN`. El workflow **Release Linux** publica los archivos con `softprops/action-gh-release@v2`.

---

## 2. Actualizar metadatos de versión

Sustituye `<versión>` por la nueva (SemVer, p. ej. `1.8.0`).

| Archivo / lugar                          | Acción                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                           | Campo `"version"` (y `npm install` actualizará `package-lock.json` si aplica)                                                            |
| `CHANGELOG.md`                           | Sección `## [<versión>] — YYYY-MM-DD` bajo `[Unreleased]`; enlace al final `[<versión>]: https://github.com/.../releases/tag/v<versión>` |
| `USAGE.md`                               | Línea **Versión de esta guía** y ejemplos `catrip-connect_<versión>_…` si cambian                                                        |
| `README.md`                              | Badge/enlaces de versión actual, ejemplos de instalación                                                                                 |
| `_scripts/build-manual-locale-files.mjs` | Constante `MANUAL_VERSION`                                                                                                               |
| `_scripts/release-notes-v<versión>.md`   | **Nuevo** archivo con notas para GitHub (plantilla: copiar el de la versión anterior)                                                    |

Si tocaste traducciones o manual:

```bash
node _scripts/build-locale-files.mjs
node _scripts/build-manual-locale-files.mjs
```

Incluye los JSON generados en el commit si forman parte del release.

---

## 3. Commit en `master`

Un commit de release coherente con el historial del repo:

```bash
git add -A   # revisa antes: no subir secretos ni artefactos de _scripts temporales
git commit -m "release: v<versión> — <resumen breve en una línea>"
git push origin master
```

Espera a que el workflow **CI** termine en verde en GitHub Actions.

---

## 4. Tag y publicación automática

```bash
git tag -a v<versión> -m "Catrip Connect <versión>"
git push origin v<versión>
```

Al pushear el tag:

1. Arranca **Release Linux** (~45 min máx.).
2. Sube `.deb`, AppImage y `latest-linux.yml` a una release asociada al tag.
3. Con `generate_release_notes: true`, GitHub puede añadir notas automáticas **además** del cuerpo por defecto.

Verifica en: `https://github.com/alktrip/catrip-multichat-electron/releases/tag/v<versión>`

---

## 5. Notas de release en GitHub (recomendado)

El cuerpo promocional conviene alinearlo con [README.md](../README.md) usando el script local:

```bash
gh release edit v<versión> \
  --title "Catrip Connect <versión> — <frase destacada>" \
  --notes-file _scripts/release-notes-v<versión>.md
```

Opcional: alinear descripción del repositorio si cambió el mensaje principal:

```bash
gh repo edit alktrip/catrip-multichat-electron \
  --description "Catrip Connect — WhatsApp Web multi-cuenta para Linux. …"
```

---

## 6. Comprobaciones post-release

- [ ] Los tres artefactos están adjuntos en la release.
- [ ] `latest-linux.yml` referencia la versión y el SHA correctos (actualizaciones AppImage).
- [ ] Instalación de prueba del `.deb`: `sudo apt install ./release/catrip-connect_<versión>_amd64.deb`
- [ ] AppImage ejecutable: `chmod +x` y `./catrip-connect_<versión>_x86_64.AppImage`
- [ ] Diálogo de actualización en app (si aplica) muestra notas legibles.

---

## Referencia rápida de comandos npm

| Comando                 | Uso                                                       |
| ----------------------- | --------------------------------------------------------- |
| `npm run dist:deb`      | Solo `.deb`                                               |
| `npm run dist:appimage` | Solo AppImage                                             |
| `npm run dist:linux`    | `.deb` + AppImage                                         |
| `npm run dist`          | Todos los targets de `electron-builder` en `package.json` |

Dependencias de empaquetado en la máquina build:

```bash
sudo apt install dpkg fakeroot python3-pil
```

---

## Documentación relacionada

- [CHANGELOG.md](../CHANGELOG.md) — historial detallado
- [README.md](../README.md) — instalación y difusión
- [USAGE.md](../USAGE.md) — guía de usuario
- `_scripts/release-notes-v*.md` — plantillas de notas por versión
