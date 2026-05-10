# Historial de cambios

Todos los cambios relevantes del proyecto se documentan en este archivo.

El formato está inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [1.0.0] — 2026-05-10

Primera versión estable publicada de **Catrip Connect** como cliente de escritorio para WhatsApp Web multi‑cuenta sobre Electron.

### Añadido

- **Varias cuentas de WhatsApp Web** en una sola aplicación, con sesiones de navegador aisladas por cuenta (cookies y almacenamiento independientes).
- **Interfaz en React**: barra lateral (rail) con avatares por cuenta, indicadores de no leídos y orden de cuentas arrastrando y soltando.
- **Paleta de comandos** (`Ctrl+K` / `Cmd+K`): búsqueda por texto con filtrado por palabras; incluye cambio de cuenta, acciones rápidas, acceso a ajustes y toggles de apariencia (barra lateral, notificaciones, escala de interfaz).
- **Modo Zen** (`Ctrl+Shift+Z`): oculta el rail para centrarse en el chat; **Escape** lo desactiva.
- **Ajustes** con secciones: General, Cuentas, Notificaciones, Red y Rendimiento (incluye diagnósticos de medios de WhatsApp Web, limpieza de caché HTTP y opciones de proceso/renderer).
- **Atajos de teclado** documentados en la app (Ayuda → Atajos) y **menú nativo** (Archivo, Ver, Chat, Cuentas, Ayuda) con las mismas acciones aceleradas.
- **Chat por número** (`Ctrl+M`): diálogo para abrir conversación por teléfono con formato internacional.
- **Iconos de cuenta** generados como SVG con variantes de color; regeneración y selección de variante desde Ajustes → Cuentas.
- **Bandeja del sistema (tray)** con icono y badge de no leídos; en Linux se usa un camino compatible con **StatusNotifierItem** (`systray2` / D‑Bus) cuando aplica, para evitar iconos vacíos en entornos Wayland.
- **Notificaciones nativas** configurables (activación global, nombre de cuenta en el texto, vista previa).
- **Preferencias generales**: iniciar minimizada, barra lateral, barra de menú, cerrar a bandeja, inicio automático, carpeta de descargas, “Guardar como…”, escala de interfaz (100–200 %), badge del tray automático o manual.
- **Proxy de red** opcional con reglas en texto para sesiones de WhatsApp Web.
- **Empaquetado Linux**: `.deb` (Ubuntu/Debian y derivados) y **AppImage** portable x86_64; iconos en tema **hicolor** y lanzador `catrip-connect.desktop`.
- Script **`_scripts/generate-app-icons.mjs`**: rasteriza el SVG principal a PNG en tamaños estándar para ventana, instalador y tema de iconos.
- Script **`_scripts/postinst-linux.sh`**: ejecuta `gtk-update-icon-cache` tras instalar el `.deb`.
- Script **`_scripts/install-appimage.sh`**: opción para integrar el AppImage en el menú del usuario (`~/.local/share/`) para icono y lanzador coherentes.
- **Pruebas E2E** con Playwright (`tests/e2e/`) para flujos básicos y cuentas.
- **Calidad de código**: ESLint 9 (flat config), Prettier, TypeScript estricto en main/preload/renderer según configuración del repo.

### Cambiado

- Identidad visible unificada como **Catrip Connect** (`build.productName`), manteniendo el nombre técnico npm `catrip_multichat_electron` y el directorio de datos `~/.config/catrip_multichat_electron/` para no romper instalaciones previas.
- Ejecutable y aplicación de escritorio bajo el nombre **`catrip-connect`** (`executableName`).
- Integración con el escritorio Linux mediante **`desktopName`: `catrip-connect.desktop`** en `package.json`, alineado con el fichero instalado y con **`StartupWMClass`** para asociación ventana ↔ lanzador.

### Corregido

- **Icono genérico en el dock / barra de tareas** en Linux (deb y AppImage) cuando el ID de aplicación que usa Electron no coincidía con el nombre real del fichero `.desktop` instalado; resuelto al fijar `desktopName` acorde a `catrip-connect.desktop`.

### Notas técnicas

- Electron **42.x**, React **19**, Vite **8**.
- Ventana principal con **WebContentsView** para separar shell React y vistas de WhatsApp Web.
- Variables de entorno documentadas en el README (GPU, ventana transparente, depuración de vistas embebidas).

[1.0.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.0.0
