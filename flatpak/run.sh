#!/bin/sh
# Wrapper Flatpak: zypak + ID de escritorio alineado con el .desktop exportado.
export CHROME_DESKTOP="${CHROME_DESKTOP:-com.catrip.catrip-multichat-electron.desktop}"
exec zypak-wrapper /app/main/catrip-connect "$@"
