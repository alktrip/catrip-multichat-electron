#!/usr/bin/env bash
# Registra un AppImage de Catrip Connect en el menú de aplicaciones del usuario,
# instalando su `.desktop` y todos los iconos en `~/.local/share/`. Equivale a
# lo que hace AppImageLauncher pero sin dependencias extra.
#
# Uso:
#   _scripts/install-appimage.sh /ruta/al/catrip-connect_X.Y.Z_x86_64.AppImage
#   _scripts/install-appimage.sh --uninstall

set -euo pipefail

APP_BIN_DIR="$HOME/.local/bin"
APPS_DIR="$HOME/.local/share/applications"
ICONS_ROOT="$HOME/.local/share/icons/hicolor"
DESKTOP_FILE="$APPS_DIR/catrip-connect.desktop"
tmp=""
cleanup() {
  if [[ -n "${tmp:-}" && -d "$tmp" ]]; then
    rm -rf "$tmp"
  fi
}
trap cleanup EXIT

uninstall() {
  echo "→ Desinstalando lanzador local de Catrip Connect…"
  rm -f "$DESKTOP_FILE"
  for size in 16 32 48 64 128 256 512 1024; do
    rm -f "$ICONS_ROOT/${size}x${size}/apps/catrip-connect.png"
  done
  if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$APPS_DIR" 2>/dev/null || true
  fi
  if command -v gtk-update-icon-cache >/dev/null 2>&1; then
    gtk-update-icon-cache -f -t "$ICONS_ROOT" 2>/dev/null || true
  fi
  echo "✔ Listo. El AppImage en disco no se borra; sólo se quitó el lanzador."
}

install() {
  local appimage="$1"
  if [[ ! -f "$appimage" ]]; then
    echo "✗ No se encontró el AppImage: $appimage" >&2
    exit 2
  fi
  appimage="$(readlink -f "$appimage")"
  chmod +x "$appimage"

  tmp="$(mktemp -d -t catrip-appimage.XXXXXX)"

  echo "→ Extrayendo recursos del AppImage en $tmp…"
  ( cd "$tmp" && "$appimage" --appimage-extract '*.desktop' >/dev/null )
  ( cd "$tmp" && "$appimage" --appimage-extract 'usr/share/icons/*' >/dev/null )

  mkdir -p "$APPS_DIR" "$APP_BIN_DIR"
  for size in 16 32 48 64 128 256 512 1024; do
    mkdir -p "$ICONS_ROOT/${size}x${size}/apps"
    src="$tmp/squashfs-root/usr/share/icons/hicolor/${size}x${size}/apps/catrip-connect.png"
    if [[ -f "$src" ]]; then
      cp -f "$src" "$ICONS_ROOT/${size}x${size}/apps/catrip-connect.png"
    fi
  done

  echo "→ Generando $DESKTOP_FILE…"
  cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Name=Catrip Connect
GenericName=Mensajería
Comment=Cliente multi-cuenta de WhatsApp Web
Exec="$appimage" %U
Terminal=false
Type=Application
Icon=catrip-connect
StartupWMClass=catrip-connect
StartupNotify=true
Categories=Network;Chat;InstantMessaging;
Keywords=whatsapp;chat;mensajería;multi-cuenta;catrip;
MimeType=x-scheme-handler/whatsapp;
EOF
  chmod 644 "$DESKTOP_FILE"

  if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "$APPS_DIR" 2>/dev/null || true
  fi
  if command -v gtk-update-icon-cache >/dev/null 2>&1; then
    gtk-update-icon-cache -f -t "$ICONS_ROOT" 2>/dev/null || true
  fi

  echo
  echo "✔ Catrip Connect registrado para tu usuario."
  echo "  Lanzador:  $DESKTOP_FILE"
  echo "  Iconos:    $ICONS_ROOT/<size>x<size>/apps/catrip-connect.png"
  echo
  echo "Cierra y vuelve a abrir la sesión (o reinicia el shell del entorno"
  echo "gráfico) si el icono aún no aparece en el dock."
}

case "${1:-}" in
  --uninstall|-u) uninstall ;;
  --help|-h|"")
    echo "Uso: $0 <ruta-al-AppImage>"
    echo "     $0 --uninstall"
    ;;
  *) install "$1" ;;
esac
