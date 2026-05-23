## Catrip Connect

Cliente de escritorio (**Electron**) para WhatsApp Web con **varias cuentas** y sesiones aisladas.

| Documentación | Contenido |
|---------------|-----------|
| **[USAGE.md](USAGE.md)** | Guía detallada de uso: interfaz, atajos, ajustes, bandeja, enlaces `whatsapp://` y consejos. |
| **[CHANGELOG.md](CHANGELOG.md)** | Historial de versiones y cambios destacados. |

**Versión actual:** **1.4.2** — actualizaciones menos invasivas en `.deb`, changelog legible en diálogos; incluye 1.4.1 (autoinicio Linux) y 1.4.0 (notificaciones, Wayland, rendimiento GPU).

> El identificador técnico del paquete npm sigue siendo `catrip_multichat_electron` para no romper la persistencia existente (`~/.config/catrip_multichat_electron/`). El nombre visible (**Catrip Connect**), el ejecutable **`catrip-connect`** y el lanzador del escritorio están alineados para integración en Linux.

Este proyecto toma **ideas y enfoque** del cliente [**ZapZap**](https://github.com/rafatosta/zapzap) (PyQt6 + WebEngine); Catrip Connect es una implementación distinta en **Electron** y no comparte código con ZapZap.

---

### Requisitos

- **Node.js** 22+ (recomendado; ver `engines` en `package.json` si se añade).
- Construcción de paquetes Linux: herramientas del sistema indicadas abajo.

---

### Desarrollo

```bash
npm install
npm run dev
```

Otros comandos útiles: `npm run build`, `npm run lint`, `npm run test:unit`, `npm run test:e2e`, `npm run typecheck`.

En cada push a `master`/`main`, GitHub Actions ejecuta lint, formato, typecheck, build y tests (ver `.github/workflows/ci.yml`).

---

### Empaquetado para Linux

En la máquina que **construye** los paquetes:

```bash
sudo apt install dpkg fakeroot
```

| Comando | Salida |
|---------|--------|
| `npm run dist:deb` | Solo `.deb` |
| `npm run dist:appimage` | Solo `.AppImage` |
| `npm run dist:linux` | Ambos |
| `npm run dist` | Todos los targets definidos en `package.json` → `build` |

Artefactos en **`release/`** (versión actual en `package.json`, **1.4.2**):

```
release/
├── catrip-connect_1.4.2_amd64.deb
└── catrip-connect_1.4.2_x86_64.AppImage
```

Los iconos PNG se generan antes del empaquetado (`_scripts/generate-app-icons.mjs`).

#### `.deb` — instalación

```bash
sudo apt install ./release/catrip-connect_1.4.2_amd64.deb
```

Dependencias habituales las resuelve `apt` (`libgtk-3-0`, `libnotify4`, `libnss3`, …; recomendable `libappindicator3-1` para bandeja).

Tras instalar:

- Binario en `/opt/Catrip Connect/catrip-connect` y enlace en `/usr/bin/catrip-connect`.
- Entrada de menú **Catrip Connect** y tema de iconos en `/usr/share/icons/hicolor/.../catrip-connect.png`.
- El **postinst** actualiza cachés de iconos/desktop y registra `whatsapp://` con `xdg-mime` (`_scripts/postinst-linux.sh`).

**Actualizaciones (`.deb`):** con la opción activa en **Ajustes → General**, la app avisa si hay una versión nueva en GitHub. Puedes **descargar el `.deb` a la carpeta que elijas**, abrir **solo el enlace** de la release para bajarlo tú mismo, o posponer. Tras descargar, instala con `sudo apt install ./catrip-connect_*_amd64.deb`. El diálogo muestra un resumen del changelog (texto plano) y verifica **SHA-512** si está publicado.

**Actualizaciones (AppImage):** descarga automática en segundo plano; cuando termina, se ofrece **Reiniciar ahora** para aplicar la actualización (comportamiento habitual de `electron-updater` con `latest-linux.yml`).

Desinstalar (nombre del paquete Debian):

```bash
sudo apt remove catrip-multichat-electron
```

#### `.AppImage` — uso portable

Ejecutable autocontenido; permisos de ejecución:

```bash
chmod +x release/catrip-connect_1.4.2_x86_64.AppImage
./release/catrip-connect_1.4.2_x86_64.AppImage
```

Para integrar menú e iconos en el escritorio del usuario (opcional pero recomendable si no usas AppImageLauncher):

```bash
_scripts/install-appimage.sh release/catrip-connect_1.4.2_x86_64.AppImage
# revertir:
_scripts/install-appimage.sh --uninstall
```

Si FUSE no está disponible: `./Catrip.AppImage --appimage-extract-and-run`.

En sistemas recientes, si el AppImage no monta (error `libfuse.so.2`), instala **FUSE 2** en el host, p. ej. `sudo apt install libfuse2` o, en Ubuntu 24+, `sudo apt install libfuse2t64`.

---

### Variables de entorno (resumen)

| Variable | Uso |
|----------|-----|
| `CATRIP_DISABLE_GPU=1` | Evita aceleración GPU si la vista embebida falla (p. ej. negro en Wayland). |
| `CATRIP_GPU_BOOST=1` | Fuerza flags GPU extra al arrancar (equivalente al toggle en Ajustes → Rendimiento). |
| `CATRIP_OZONE_PLATFORM=wayland\|x11` | Fija el backend gráfico de Chromium (solo si el escritorio lo requiere). |
| `CATRIP_TRANSPARENT_WINDOW=0\|1` | Fuerza ventana opaca o transparente. |
| `CATRIP_DEBUG_EMBED=0\|1` | Logs de diagnóstico del contenido embebido. |

Más detalle en **[USAGE.md](USAGE.md)**.

---

### Tema oscuro

Se usa el **modo oscuro nativo de WhatsApp Web**; no se inyecta CSS de terceros para forzar tema.

---

### Licencia

MIT (véase el campo `license` en `package.json`).
