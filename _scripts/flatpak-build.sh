#!/usr/bin/env bash
# Build e instalación local del Flatpak de Catrip Connect.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$ROOT/flatpak/com.catrip.catrip-multichat-electron.yml"
BUILD_DIR="$ROOT/flatpak/.flatpak-builder"
REPO_DIR="$ROOT/flatpak/repo"
APP_ID="com.catrip.catrip-multichat-electron"
INSTALL="${FLATPAK_INSTALL:-user}"

for cmd in flatpak flatpak-builder; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "error: falta $cmd (p. ej. sudo apt install flatpak flatpak-builder)" >&2
    exit 1
  fi
done

if [[ ! -f "$ROOT/flatpak/generated-sources.json" ]]; then
  echo "error: falta flatpak/generated-sources.json — ejecuta _scripts/flatpak-prepare-sources.sh" >&2
  exit 1
fi

if [[ -d "$ROOT/node_modules" ]]; then
  echo "error: elimina node_modules antes del build Flatpak (copiaría el árbol completo al sandbox)" >&2
  exit 1
fi

flatpak remote-add --if-not-exists --user flathub https://flathub.org/repo/flathub.flatpakrepo

flatpak-builder \
  --force-clean \
  --install-deps-from=flathub \
  --$INSTALL \
  --install \
  --repo="$REPO_DIR" \
  "$BUILD_DIR" \
  "$MANIFEST"

echo
echo "Instalado. Ejecutar con:"
echo "  flatpak run $APP_ID"
