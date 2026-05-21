#!/bin/bash
set -e

# Actualizar el icon cache de GTK para que GNOME/KDE encuentren los PNGs
# recién instalados en /usr/share/icons/hicolor/.
if hash gtk-update-icon-cache 2>/dev/null; then
    gtk-update-icon-cache -f -t /usr/share/icons/hicolor || true
fi

# Base de datos de entradas .desktop (menú / búsqueda de aplicaciones).
if hash update-desktop-database 2>/dev/null; then
    update-desktop-database -q /usr/share/applications || true
fi

# Registrar Catrip Connect como manejador predeterminado de whatsapp:// (enlaces entrantes).
DESKTOP_FILE=""
for candidate in \
    /usr/share/applications/catrip-connect.desktop \
    /usr/share/applications/catrip_multichat_electron.desktop; do
    if [ -f "$candidate" ]; then
        DESKTOP_FILE="$candidate"
        break
    fi
done

if [ -n "$DESKTOP_FILE" ] && hash xdg-mime 2>/dev/null; then
    xdg-mime default "$(basename "$DESKTOP_FILE")" x-scheme-handler/whatsapp || true
fi

# Refrescar asociaciones MIME del usuario que ejecutó apt (puede ser root en postinst).
if [ -n "$SUDO_USER" ] && [ -n "$DESKTOP_FILE" ] && hash xdg-mime 2>/dev/null; then
    sudo -u "$SUDO_USER" DISPLAY="${DISPLAY:-:0}" \
        xdg-mime default "$(basename "$DESKTOP_FILE")" x-scheme-handler/whatsapp 2>/dev/null || true
fi
