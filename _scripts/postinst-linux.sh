#!/bin/bash
# Actualizar el icon cache de GTK para que GNOME/KDE encuentren los PNGs
# recién instalados en /usr/share/icons/hicolor/.
if hash gtk-update-icon-cache 2>/dev/null; then
    gtk-update-icon-cache -f -t /usr/share/icons/hicolor || true
fi
# Base de datos de entradas .desktop (menú / búsqueda de aplicaciones).
if hash update-desktop-database 2>/dev/null; then
    update-desktop-database -q /usr/share/applications || true
fi
