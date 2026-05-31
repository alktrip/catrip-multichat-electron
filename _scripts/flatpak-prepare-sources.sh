#!/usr/bin/env bash
# Regenera flatpak/generated-sources.json con flatpak-node-generator.
# Requisitos: Python 3.11+, venv o pipx. Ver docs/FLATPAK.md
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/flatpak/generated-sources.json"
TOOLS_REPO="${FLATPAK_BUILDER_TOOLS_REPO:-https://github.com/flatpak/flatpak-builder-tools.git}"
TOOLS_DIR="${FLATPAK_BUILDER_TOOLS_DIR:-/tmp/flatpak-builder-tools}"
VENV_DIR="${FLATPAK_NODE_GENERATOR_VENV:-/tmp/flatpak-node-generator-venv}"
NODE_SDK="${FLATPAK_NODE_SDK_EXTENSION:-org.freedesktop.Sdk.Extension.node22//24.08}"

mkdir -p "$ROOT/flatpak"

if [[ ! -d "$TOOLS_DIR/.git" ]]; then
  git clone --depth 1 "$TOOLS_REPO" "$TOOLS_DIR"
fi

if [[ ! -x "$VENV_DIR/bin/flatpak-node-generator" ]]; then
  python3 -m venv "$VENV_DIR"
  "$VENV_DIR/bin/pip" install -q "$TOOLS_DIR/node"
fi

if [[ -d "$ROOT/node_modules" ]]; then
  echo "error: elimina node_modules antes de regenerar generated-sources.json" >&2
  exit 1
fi

"$VENV_DIR/bin/flatpak-node-generator" npm "$ROOT/package-lock.json" \
  -o "$OUT" \
  --electron-node-headers \
  --node-sdk-extension "$NODE_SDK"

echo "Generado: $OUT ($(wc -c < "$OUT") bytes)"
