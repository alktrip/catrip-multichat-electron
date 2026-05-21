# Publicar release 1.4.0

## Comprobaciones locales

```bash
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run dist:linux
```

Artefactos esperados en `release/`:

- `catrip-connect_1.4.0_amd64.deb`
- `catrip-connect_1.4.0_x86_64.AppImage`
- `latest-linux.yml` (para `electron-updater`)

## Git y GitHub Release

```bash
git add -A
git status   # revisar que no entren secretos ni artefactos no deseados
git commit -m "$(cat <<'EOF'
chore: release 1.4.0

Notificaciones multi-cuenta, integración Wayland, actualizaciones beta/estable,
rendimiento GPU y refinamientos de UI.
EOF
)"
git tag -a v1.4.0 -m "Catrip Connect 1.4.0"
git push origin HEAD
git push origin v1.4.0
```

El workflow [`.github/workflows/release.yml`](.github/workflows/release.yml) construye y publica `.deb`, AppImage y `latest-linux.yml` al pushear el tag `v*`.

## Notas de la release (copiar a GitHub)

Título: **Catrip Connect 1.4.0**

Cuerpo: ver sección **[1.4.0]** en [CHANGELOG.md](CHANGELOG.md).

## Tras publicar

1. Probar instalación del `.deb` en una máquina limpia o VM.
2. Probar AppImage con `_scripts/install-appimage.sh`.
3. Verificar actualización desde 1.3.x con Ajustes → buscar actualizaciones (canal estable).
