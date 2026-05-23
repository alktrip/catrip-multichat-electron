# Publicar release 1.4.1

## Comprobaciones locales

```bash
npm ci
npm run lint
npm run test:unit
npm run dist:linux
```

Artefactos en `release/`:

- `catrip-connect_1.4.1_amd64.deb`
- `catrip-connect_1.4.1_x86_64.AppImage`
- `latest-linux.yml`

## Git y tag

```bash
git add -A
git commit -m "release: v1.4.1 — autoinicio Linux"
git tag -a v1.4.1 -m "Catrip Connect 1.4.1"
git push origin HEAD
git push origin v1.4.1
```

El workflow **Release Linux** publica artefactos al pushear `v*`. Opcional: `gh release create` con notas explícitas (ver CHANGELOG § 1.4.1).
