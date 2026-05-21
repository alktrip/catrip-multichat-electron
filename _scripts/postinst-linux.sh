#!/bin/bash
set -e

DESKTOP_NAME="catrip-connect.desktop"
MIME="x-scheme-handler/whatsapp"
EXEC_PATH="/opt/Catrip Connect/catrip-connect"

if hash gtk-update-icon-cache 2>/dev/null; then
    gtk-update-icon-cache -f -t /usr/share/icons/hicolor || true
fi

if hash update-desktop-database 2>/dev/null; then
    update-desktop-database -q /usr/share/applications 2>/dev/null || true
fi

register_apps_dir() {
    local apps_dir="$1"
    local desktop="$apps_dir/$DESKTOP_NAME"
    [[ -f "$desktop" ]] || return 1
    if hash update-desktop-database 2>/dev/null; then
        update-desktop-database -q "$apps_dir" 2>/dev/null || update-desktop-database "$apps_dir" 2>/dev/null || true
    fi
    if hash xdg-mime 2>/dev/null; then
        xdg-mime default "$DESKTOP_NAME" "$MIME" 2>/dev/null || true
    fi
    if hash gio 2>/dev/null; then
        gio mime "$MIME" "$DESKTOP_NAME" 2>/dev/null || true
    fi
    if hash xdg-settings 2>/dev/null; then
        xdg-settings set default-url-scheme-handler whatsapp "$DESKTOP_NAME" 2>/dev/null || true
    fi
}

# GNOME indexa mejor un .desktop en ~/.local del usuario que instaló.
if [[ -n "${SUDO_USER:-}" && "$SUDO_USER" != "root" ]]; then
    USER_HOME="$(getent passwd "$SUDO_USER" | cut -d: -f6 || true)"
    if [[ -n "$USER_HOME" && -x "$EXEC_PATH" ]]; then
        USER_APPS="$USER_HOME/.local/share/applications"
        mkdir -p "$USER_APPS"
        cat >"$USER_APPS/$DESKTOP_NAME" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=Catrip Connect
GenericName=Mensajería
Comment=Cliente multi-cuenta de WhatsApp Web
Exec="$EXEC_PATH" %U
Terminal=false
Icon=catrip-connect
Categories=Network;Chat;InstantMessaging;
Keywords=whatsapp;chat;wa.me;catrip;
MimeType=$MIME;
StartupWMClass=catrip-connect
StartupNotify=true
Actions=Open;Focus;NewAccount;

[Desktop Action Open]
Name=Abrir Catrip Connect
Exec="$EXEC_PATH" --catrip-action=open
Terminal=false

[Desktop Action Focus]
Name=Enfocar ventana
Exec="$EXEC_PATH" --catrip-action=focus
Terminal=false

[Desktop Action NewAccount]
Name=Nueva cuenta
Exec="$EXEC_PATH" --catrip-action=new-account
Terminal=false
EOF
        chown "$SUDO_USER:$SUDO_USER" "$USER_APPS/$DESKTOP_NAME" 2>/dev/null || true
        chmod 644 "$USER_APPS/$DESKTOP_NAME"
        sudo -u "$SUDO_USER" update-desktop-database "$USER_APPS" 2>/dev/null || true
        sudo -u "$SUDO_USER" xdg-mime default "$DESKTOP_NAME" "$MIME" 2>/dev/null || true
        sudo -u "$SUDO_USER" gio mime "$MIME" "$DESKTOP_NAME" 2>/dev/null || true
    fi
fi

register_apps_dir "/usr/share/applications" || true
