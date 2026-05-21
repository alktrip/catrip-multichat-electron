#!/usr/bin/env bash
# Registra Catrip Connect como aplicación para enlaces whatsapp:// (GNOME/KDE/XDG).
# Uso: _scripts/register-whatsapp-protocol.sh
#      sudo _scripts/register-whatsapp-protocol.sh   # tras instalar el .deb

set -euo pipefail

APP_NAME="Catrip Connect"
DESKTOP_NAME="catrip-connect.desktop"
MIME="x-scheme-handler/whatsapp"

resolve_exec() {
  if [[ -n "${APPIMAGE:-}" && -x "${APPIMAGE}" ]]; then
    printf '%s' "$APPIMAGE"
    return 0
  fi
  if [[ -x /opt/Catrip\ Connect/catrip-connect ]]; then
    printf '%s' "/opt/Catrip Connect/catrip-connect"
    return 0
  fi
  if command -v catrip-connect >/dev/null 2>&1; then
    command -v catrip-connect
    return 0
  fi
  return 1
}

write_user_desktop() {
  local apps_dir="$1"
  local exec_path="$2"
  mkdir -p "$apps_dir"
  cat >"$apps_dir/$DESKTOP_NAME" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=$APP_NAME
GenericName=Mensajería
Comment=Cliente multi-cuenta de WhatsApp Web
Exec="$exec_path" %u
Terminal=false
Icon=catrip-connect
Categories=Network;Chat;InstantMessaging;
Keywords=whatsapp;chat;mensajería;multi-cuenta;catrip;
MimeType=$MIME;
StartupWMClass=catrip-connect
StartupNotify=true
EOF
  chmod 644 "$apps_dir/$DESKTOP_NAME"
}

register_apps_dir() {
  local apps_dir="$1"
  local desktop="$apps_dir/$DESKTOP_NAME"
  if [[ ! -f "$desktop" ]]; then
    return 1
  fi
  if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database -q "$apps_dir" 2>/dev/null || update-desktop-database "$apps_dir" 2>/dev/null || true
  fi
  if command -v xdg-mime >/dev/null 2>&1; then
    xdg-mime default "$DESKTOP_NAME" "$MIME" 2>/dev/null || true
  fi
  if command -v gio >/dev/null 2>&1; then
    gio mime "$MIME" "$DESKTOP_NAME" 2>/dev/null || true
  fi
  if command -v xdg-settings >/dev/null 2>&1; then
    xdg-settings set default-url-scheme-handler whatsapp "$DESKTOP_NAME" 2>/dev/null || true
  fi
  return 0
}

main() {
  local exec_path=""
  exec_path="$(resolve_exec)" || {
    echo "✗ No se encontró catrip-connect ni APPIMAGE. Instala el .deb o indica APPIMAGE=." >&2
    exit 1
  }

  local target_user="${SUDO_USER:-${USER:-}}"
  local home_dir=""
  if [[ -n "$target_user" && "$target_user" != "root" ]]; then
    home_dir="$(getent passwd "$target_user" | cut -d: -f6 || true)"
  fi
  if [[ -z "$home_dir" ]]; then
    home_dir="${HOME:-}"
  fi

  if [[ -n "$home_dir" ]]; then
    local user_apps="$home_dir/.local/share/applications"
    echo "→ Lanzador de usuario: $user_apps/$DESKTOP_NAME"
    if [[ "$(id -u)" -eq 0 && -n "${SUDO_USER:-}" ]]; then
      write_user_desktop "$user_apps" "$exec_path"
      chown "$SUDO_USER:$(id -gn "$SUDO_USER" 2>/dev/null || echo "$SUDO_USER")" \
        "$user_apps/$DESKTOP_NAME" 2>/dev/null || true
      sudo -u "$SUDO_USER" env APPIMAGE="${APPIMAGE:-}" HOME="$home_dir" \
        bash -c "$(declare -f register_apps_dir); register_apps_dir '$user_apps'" || true
    else
      write_user_desktop "$user_apps" "$exec_path"
      register_apps_dir "$user_apps" || true
    fi
  fi

  if [[ -f "/usr/share/applications/$DESKTOP_NAME" ]]; then
    echo "→ Registrando también /usr/share/applications/$DESKTOP_NAME"
    register_apps_dir "/usr/share/applications" || true
  fi

  if command -v gio >/dev/null 2>&1; then
    echo
    echo "Estado actual (gio):"
    gio mime "$MIME" 2>/dev/null || true
  fi
  echo
  echo "✔ Registro de whatsapp:// completado. Cierra el navegador y prueba de nuevo un enlace WhatsApp."
}

main "$@"
