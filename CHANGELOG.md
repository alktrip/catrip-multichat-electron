# Historial de cambios

Todos los cambios relevantes del proyecto se documentan en este archivo.

El formato está inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [Unreleased]

## [1.7.0] — 2026-05-31

### Añadido

- **Internacionalización (i18n)** en **9 idiomas**: español, inglés, portugués, francés, alemán, coreano, japonés, italiano y chino simplificado, más la opción **Idioma del sistema** (**Ajustes → General → Idioma de la interfaz**).
- Traducción de la **interfaz de Catrip Connect**: menús nativos, bandeja del sistema (tray/SNI), notificaciones, diálogos de actualización, integración Linux y textos del shell React.
- **Manual de usuario multilingüe** (**Ayuda → Manual de usuario**): contenido en los 9 idiomas, generado desde catálogos (`manual.json` por locale); sección **Llamadas y videollamadas en WhatsApp Web** (activar beta BETA encima del avatar).
- **Aviso al cambiar idioma**: modal que explica que WhatsApp Web usa un idioma independiente y cómo cambiarlo dentro de WhatsApp.
- **Atajos de teclado con foco en WhatsApp Web**: interceptación en el proceso principal (`before-input-event`) para que `Ctrl+K`, `Ctrl+P`, `Ctrl+1`–`9`, `F5`, etc. funcionen aunque el cursor esté en un chat o campo de texto de WhatsApp Web.
- Tests unitarios: paridad de claves i18n (`i18n-locale`), detección de atajos (`catrip-shortcuts`).

### Cambiado

- **Idioma por defecto**: **idioma del sistema**; si no está soportado, la interfaz se muestra en **inglés** (antes el fallback implícito era español).
- **«Ahora mismo»** (`Ctrl+Shift+A`, botón ⚡ del rail, **Ver → Ahora mismo**): abre la **bandeja de acciones pendientes** (`PendingInbox`) en lugar del popover lateral que podía quedar recortado.
- Paleta de comandos, ajustes, centro de actividad, bandeja pendiente, toasts y diálogos migrados a **react-i18next**.

### Corregido

- **Pantalla negra o menú sin respuesta** tras cambios de i18n: eliminados artefactos `.js` obsoletos en `src/shared/i18n/`; `.gitignore` y `vite.config.ts` priorizan fuentes `.ts`.
- Unificación del flujo **Ver → Ahora mismo** con el botón ⚡ del rail (mismo overlay de pendientes).

### Documentación

- **README.md** con imágenes explicativas (`docs/images/`), **USAGE.md** y manual actualizados a **1.7.0**.

## [1.6.0] — 2026-05-30

### Añadido

- **«Ahora mismo»**: panel compacto junto al rail con los **3 chats más urgentes** de todas las cuentas (sin overlay a pantalla completa); botón del rail, `Ctrl+Shift+A`, menú **Ver → Ahora mismo** y comando en la paleta `Ctrl+K`.
- **Búsqueda de chats en la paleta** (`Ctrl+K`): sección **Chats** con conversaciones sin leer; filtro por nombre, preview o cuenta; Enter abre el chat vía `openChatByName`.
- **Suspensión inteligente de cuentas inactivas** (**Ajustes → Rendimiento**): tras N minutos sin seleccionar una cuenta (5, 10, 15, 30 o 60; por defecto 15), se destruye su `WebContentsView` para ahorrar RAM manteniendo la sesión en la partición Electron; avatar atenuado en el rail; reactivación al cambiar de cuenta o abrir un chat.
- **Manual de usuario integrado** (**Ayuda → Manual de usuario**): visor con índice, ilustraciones SVG y secciones para cuentas, «Ahora mismo», reposo, paleta, bandeja, ajustes y problemas frecuentes.
- Icono de sistema **`urgent-now.svg`** para el botón del rail y la paleta (estilo coherente con el resto de acciones).
- Tests unitarios: `accountSuspension`, `chatSearchModel`, ampliación de `pending-inbox` (`pickTopUrgentChats`).

### Cambiado

- Overlay **Ayuda → Atajos de teclado** incluye `Ctrl+Shift+A` («Ahora mismo»).
- Botones de acción del rail con ancho uniforme (`width: 100%`).

### Documentación

- **README.md**, **USAGE.md** y manual integrado actualizados a **1.6.0** (Ahora mismo, búsqueda Ctrl+K, cuentas en reposo, manual de usuario).

## [1.5.1] — 2026-05-31

### Corregido

- **Diálogo de actualización**: las notas de la release ya no se recortan en un `MessageBox` nativo demasiado pequeño; ahora se muestran en un panel con **scroll interno** (cabecera y botones fijos, ventana sin agrandar).
- **Entrega del diálogo al renderer**: el evento IPC se envía al `WebContentsView` del shell React (no al `webContents` vacío de la ventana principal), de modo que el aviso aparece correctamente.
- **Visibilidad en Ajustes**: el diálogo de actualización también se muestra cuando la interfaz está en la pantalla de preferencias.

### Cambiado

- Flujos **`.deb`** y **AppImage**: notas completas en el panel con enlace «Ver release completa en GitHub»; resumen corto solo como respaldo si el renderer no está disponible.

### Documentación

- **README.md**, **USAGE.md**: versión 1.5.1 y descripción del nuevo diálogo de actualización.

## [1.5.0] — 2026-05-30

### Añadido

- **Centro de actividad**: panel con resumen por cuenta (no leídos, último remitente y vista previa del mensaje); acceso desde el rail (▤), paleta de comandos (`Ctrl+K`) y evento IPC `accounts:activityChanged`.
- **Bandeja de acciones pendientes**: lista unificada de chats sin leer en **todas** las cuentas, ordenada por urgencia; botón ✉ en el rail, comando en la paleta y `chat:openByName` para abrir el chat en WhatsApp Web al pulsar una fila.
- **Notificaciones enriquecidas**: al subir no leídos se incluye remitente y preview del último mensaje (cuando WhatsApp Web los expone).
- **Modo preview en navegador** (`npm run dev` → `http://localhost:5173`): mock de `window.catrip` con cuentas demo, aviso visual y fondo oscuro para desarrollar la UI sin Electron.
- **DevBanner** (solo desarrollo): contexto de runtime (versión, Electron/Chromium, rutas, modo preview) vía `dev:getContext`.
- Tests unitarios: contador de no leídos, estado de ventana (tray), actividad WhatsApp, inbox pendiente, apertura de chat por nombre y contexto dev.

### Corregido

- **Contador de no leídos**: alineado con WhatsApp Web (prioridad al título de la pestaña; suma de badges sin duplicar filas).
- **Ventana al minimizar a bandeja**: se conservan tamaño, posición y estado maximizado al restaurar desde el icono de bandeja o al cerrar la ventana (si «minimizar a bandeja» está activo).

### Cambiado

- Polling de actividad unificado (`whatsappActivity.ts`, `accountActivity.ts`) para tray, notificaciones, centro de actividad y bandeja pendiente.

### Documentación

- **README.md**, **USAGE.md**: versión 1.5.0, centro de actividad, acciones pendientes, preview en navegador y DevBanner.

## [1.4.2] — 2026-05-20

### Corregido

- **Notas de actualización legibles**: el changelog de GitHub ya no se muestra con etiquetas HTML crudas en los diálogos; se convierte a texto plano (`releaseNotesFormat.ts`).

### Cambiado

- **Actualizaciones en instalación `.deb` (menos invasivo)**: al detectar una nueva versión, la app **pregunta** si quieres descargar el `.deb` a una **carpeta que elijas**; si no, ofrece solo el **enlace** de GitHub para descarga manual. No se descarga ni instala en segundo plano ni se reinicia sola.
- **Actualizaciones en AppImage**: sin cambios respecto a versiones anteriores (descarga automática, diálogo «Reiniciar ahora» e instalación al salir).

### Documentación

- **README.md**, **USAGE.md**: flujos de actualización diferenciados (`.deb` vs AppImage).

## [1.4.1] — 2026-05-22

### Corregido

- **Autoinicio al iniciar sesión (Linux)**: la opción «Iniciar automáticamente con el sistema» no lanzaba la app porque el fichero `~/.config/autostart/` tenía un `Exec` sin comillas (falla con la ruta `/opt/Catrip Connect/…` del `.deb`) y faltaba `--disable-setuid-sandbox` en AppImage. Ahora se genera `catrip-connect.desktop` con formato XDG/GNOME válido y se elimina el autostart legacy.

### Documentación

- **README.md**, **USAGE.md**: instrucciones para regenerar el autostart (desactivar y volver a activar el toggle tras actualizar desde 1.4.0).

## [1.4.0] — 2026-05-21

### Añadido

- **Notificaciones**: avisos cuando suben no leídos en **cualquier cuenta** (throttle por cuenta); clic enfoca la ventana y **activa esa cuenta**; opciones **No molestar** y **sonido** en Ajustes.
- **Estado de sesión por cuenta** (conectada / QR / sin red) en tooltips del rail, menú de bandeja y tooltip SNI.
- **Actualizaciones**: canal **estable / beta**, changelog resumido en el diálogo de actualización y verificación **SHA-512** del `.deb` descargado.
- **Linux / Wayland**: **Desktop Actions** en el lanzador (_Abrir_, _Enfocar ventana_, _Nueva cuenta_); botón **Registrar protocolo WhatsApp** en Ajustes; guía ampliada para enlaces `https://wa.me` en el navegador.
- **Rendimiento**: flags Chromium al arranque (`chromiumLaunch.ts`) — rasterización GPU, VA-API en Linux, límite de procesos del renderer aplicado desde Ajustes; toggle **Refuerzo GPU** y **Evitar suspensión durante videollamada** (`powerSaveBlocker`).
- **Descargas**: abrir archivos completados con la app predeterminada del sistema (`xdg-open` / portal).
- **UI**: verde de marca unificado (`#25D366`), `:focus-visible`, switches y campos de formulario, toasts con iconos SVG, blur en overlays; menú contextual del `<select>` legible en tema oscuro (`color-scheme: dark`).
- Tests unitarios para acciones de lanzador (`launchActions`).

### Cambiado

- **Bandeja**: menú con etiquetas de cuenta (estado + no leídos); tooltip SNI dinámico por cuenta.
- **Enfoque de ventana** al pulsar notificaciones o segunda instancia: `app.focus({ steal: true })` y pulso breve de always-on-top (mejor en Wayland).
- Eliminado del menú **Chat** la opción «Abrir WhatsApp Web en el navegador del sistema» (`Ctrl+Shift+O`).

### Corregido

- Desplegables de Ajustes con lista **blanca sobre texto claro** en Linux/Wayland.

### Documentación

- **USAGE.md** y **README.md** actualizados (variables `CATRIP_GPU_BOOST`, `CATRIP_OZONE_PLATFORM`, bandeja, rendimiento, Wayland).

## [1.3.2] — 2026-05-20

### Añadido

- **No leídos más fiables**: heurísticas ampliadas (título multidioma, filas de chat, `aria-label`) y total sumado en **todas** las cuentas para tray y dock.
- **Invitaciones a grupo** (`chat.whatsapp.com`, `web.whatsapp.com/accept?code=`).
- **Badge en el dock** (Linux, `app.setBadgeCount`) configurable en Ajustes.
- **CI**: job que construye **AppImage** + `latest-linux.yml` en cada push a `master`; workflow **Release** en tags `v*`.

### Corregido

- **Salir desde el icono de bandeja (SNI / D-Bus)**: al elegir «Salir» ya no aparece el diálogo _Cannot send message, stream is closed_; el tray D-Bus se cierra de forma ordenada antes de terminar el proceso.

## [1.3.1] — 2026-05-21

### Corregido

- **Enlaces `whatsapp://` en GNOME**: el sistema mostraba _«No hay aplicaciones disponibles»_ porque faltaba indexar el lanzador (`update-desktop-database`). Nuevo script `register-whatsapp-protocol.sh`, postinst del `.deb` que crea el `.desktop` en `~/.local/share/applications` del usuario, registro al arrancar la app y `npm run register:whatsapp`.

## [1.3.0] — 2026-05-21

### Añadido

- **Actualizaciones automáticas** desde GitHub Releases (`electron-updater`), activables en Ajustes → General.
- **Enlaces entrantes**: mensaje precargado (`?text=`), elección de cuenta (automático / activa / fija) y diálogo si hay varias cuentas.
- **CI** en cada push/PR (lint, formato, typecheck, build, tests unitarios y E2E).
- **Tests E2E** del protocolo y parser de enlaces WhatsApp (`src/main/whatsappLinks.ts`).

### Cambiado

- **postinst (.deb)**: registra `Catrip Connect` como manejador predeterminado de `whatsapp://` vía `xdg-mime`.

## [1.2.0] — 2026-05-20

### Añadido

- **Enlaces WhatsApp entrantes**: registro del protocolo `whatsapp://`, `MimeType` en el lanzador Linux (`x-scheme-handler/whatsapp`) y apertura del chat en la **cuenta activa** al recibir `whatsapp://`, `wa.me`, `api.whatsapp.com` o `web.whatsapp.com/send` (arranque con `%U`, segunda instancia y macOS `open-url`).
- Sincronización del renderer con el proceso principal vía `ui:modeChanged` cuando un enlace entrante sale del modo Ajustes.

### Documentación

- **USAGE.md**: sección de configuración del protocolo WhatsApp en Linux.
- **README.md**: versión y artefactos **1.2.0**.

## [1.1.2] — 2026-05-12

### Cambiado

- **Versión y artefactos**: incremento a **1.1.2** para empaquetado y documentación; sin cambios de código respecto a **1.1.1** (fix Linux sandbox / `AppRun`).

## [1.1.1] — 2026-05-11

### Corregido

- **Linux — orden de arranque**: `disable-setuid-sandbox` y `--class` estaban en `main.ts`, **después** de todos los `import` del proceso principal. Chromium puede inicializar el sandbox setuid antes de ejecutar el cuerpo de ese módulo → los switches no aplicaban y seguía apareciendo `setuid_sandbox_host.cc`. Los mismos `appendSwitch` se ejecutan ahora en **`bootstrap.ts`** (entrada real del proceso), inmediatamente tras `require("electron")` y **antes** de `require("./main")`.

## [1.1.0] — 2026-05-10

### Corregido

- **Linux (AppImage y `.deb`)**: arranque estable sin depender del binario **setuid** `chrome-sandbox`. Se aplica `disable-setuid-sandbox` en el proceso principal antes de `app.whenReady()`, evitando fallos habituales en AppImage (permisos SUID en el FS montado) y en instalaciones `.deb` sin postinst que configure `4755` sobre `chrome-sandbox`.

### Cambiado

- **AppImage**: el lanzador `catrip-connect.desktop` incluido en el paquete ya no fuerza `--no-sandbox` en la línea `Exec`; la política de sandbox queda alineada con el proceso principal (solo se desactiva el sandbox setuid de Chromium, no el sandbox por namespaces cuando el kernel lo permite).

## [1.0.4] — 2026-05-10

### Corregido

- **Acerca de**: la versión mostrada coincide siempre con la del artefacto (`package.json` del build). En **AppImage** (y algunos entornos Linux) `app.getVersion()` podía devolver un valor antiguo; el texto de «Acerca de» usa la versión inyectada en el bundle del renderer y el IPC lee el `package.json` embebido en el asar.

## [1.0.3] — 2026-05-10

Versión de mantenimiento.

## [1.0.2] — 2026-05-10

Corrección del **icono genérico en el dock** al usar el AppImage en Linux.

### Corregido

- **AppImage y estándar XDG**: electron-builder solo colocaba `catrip-connect.desktop` en la raíz del AppDir; el `AppRun` añade `$APPDIR/usr/share` a `XDG_DATA_DIRS`, donde deben estar las entradas en `applications/`. Sin fichero ahí, GNOME/GTK no enlazan la ventana con el lanzador. Se añade `assets/packaging/catrip-connect.desktop` y el hook **`afterPack`** (`_scripts/after-pack-linux.js`) lo copia a `usr/share/applications/` dentro del paquete empaquetado.
- **`CHROME_DESKTOP`**: `bootstrap.ts` vuelve a definir `CHROME_DESKTOP=catrip-connect.desktop` en todo Linux ahora que el AppImage expone el `.desktop` en la ruta resoluble por Chromium.

## [1.0.1] — 2026-05-10

Corrección de integración con el escritorio Linux (menú de aplicaciones e icono en dock / conmutador).

### Corregido

- **Menú de aplicaciones tras instalar el `.deb`**: el `postinst` ahora ejecuta también `update-desktop-database` sobre `/usr/share/applications`, además de `gtk-update-icon-cache`, para que la entrada **Catrip Connect** aparezca correctamente en el listado y la búsqueda.
- **Icono genérico en dock / AppImage (sobre todo en Wayland)**: nuevo punto de entrada `bootstrap.ts` que define `CHROME_DESKTOP=catrip-connect.desktop` **antes** de cargar Electron, de modo que Chromium asocie la ventana al mismo ID que el fichero `.desktop` (`desktopName` / `StartupWMClass`).

### Cambiado

- **`package.json` → `main`**: `dist/main/bootstrap.js` en lugar de `dist/main/main.js`.

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

[1.7.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.7.0
[1.6.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.6.0
[1.5.1]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.5.1
[1.5.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.5.0
[1.4.2]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.4.2
[1.4.1]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.4.1
[1.4.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.4.0
[1.3.2]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.3.2
[1.3.1]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.3.1
[1.3.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.3.0
[1.2.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.2.0
[1.1.2]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.1.2
[1.1.1]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.1.1
[1.1.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.1.0
[1.0.4]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.0.4
[1.0.3]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.0.3
[1.0.2]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.0.2
[1.0.1]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.0.1
[1.0.0]: https://github.com/alktrip/catrip-multichat-electron/releases/tag/v1.0.0
