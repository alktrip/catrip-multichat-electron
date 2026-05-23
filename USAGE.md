# Guía de uso — Catrip Connect

Cliente de escritorio para **WhatsApp Web** con **varias cuentas** en paralelo. Cada cuenta tiene su propia sesión aislada (cookies y datos locales independientes).

**Versión de esta guía:** **1.4.2**

---

## 1. Conceptos básicos

| Concepto | Descripción |
|----------|-------------|
| **Cuenta** | Perfil de WhatsApp Web identificado por un nombre visible y un avatar generado por la aplicación. |
| **Cuenta activa** | La sesión cuyo chat se muestra en el área principal. |
| **Rail (barra lateral)** | Columna izquierda con avatares de cuentas, accesos rápidos y estado de no leídos. |
| **Modo navegador** | Vista principal con WhatsApp Web y rail (salvo modo Zen u opción de ocultar barra). |
| **Modo ajustes** | Pantalla de preferencias con menú lateral por secciones. |

Los datos de la aplicación en Linux se guardan bajo `~/.config/catrip_multichat_electron/` (identificador técnico histórico).

---

## 2. Primer uso

1. **Instala y lanza** la aplicación (menú de aplicaciones, `catrip-connect` en terminal o AppImage).
2. Si no hay cuentas, la interfaz invita a **crear la primera cuenta**.
3. Tras crear una cuenta, se carga **WhatsApp Web** en esa sesión: escanea el código QR con el teléfono como en el navegador.
4. Para **otra cuenta**, usa **Nueva cuenta** (`Ctrl+U` o desde la paleta de comandos).

---

## 3. Barra lateral (rail)

- **Clic en un avatar**: cambia a esa cuenta (la convierte en activa).
- **Orden**: arrastra un avatar verticalmente para **reordenar** las cuentas (el orden define también `Ctrl+1` … `Ctrl+9`).
- **Indicador de no leídos**: punto o número cuando hay mensajes pendientes en esa cuenta (según datos que expone WhatsApp Web).
- **Botón Zen** (icono dedicado): alterna el **modo Zen** (equivalente a `Ctrl+Shift+Z`).

Si en **Ajustes → General** desactivas **Mostrar barra lateral**, el rail desaparece hasta que lo vuelvas a activar (también desde la paleta: “Ocultar/Mostrar barra lateral”).

---

## 4. Vista de WhatsApp Web

- El comportamiento es el de **WhatsApp Web oficial** (chats, llamadas según soporte del navegador embebido, archivos, etc.).
- **Tema**: se usa el **modo oscuro nativo** de WhatsApp Web; no se inyecta CSS de terceros para forzar tema.
- **Recarga**: `F5` o menú **Chat → Recargar**.

---

## 5. Paleta de comandos (`Ctrl+K` o `Cmd+K` en macOS)

Abre un buscador unificado de acciones:

- Escribe para **filtrar** (varias palabras; todas deben aparecer en etiqueta, descripción o palabras clave).
- **Flechas arriba/abajo** para moverte por la lista.
- **Enter** ejecuta el comando resaltado.
- **Escape** cierra la paleta.

Incluye (entre otras): cambiar de cuenta por nombre, **Nueva cuenta**, **Nuevo chat**, **Chat por número**, entrar en **Ajustes** por sección, activar/desactivar **modo Zen**, alternar **barra lateral**, **notificaciones del sistema** y **escala de interfaz** (100 % … 200 %).

---

## 6. Atajos de teclado principales

En Linux y Windows se usa **Ctrl**; en macOS suele usarse **Cmd** donde el sistema lo mapea desde el menú nativo.

| Atajo | Acción |
|-------|--------|
| `Ctrl+K` | Abrir paleta de comandos |
| `Ctrl+P` | Abrir Ajustes (General) |
| `Ctrl+1` … `Ctrl+9` | Cambiar a la cuenta en esa posición en la lista (hasta 9) |
| `Ctrl+N` | Nuevo chat (WhatsApp Web) |
| `Ctrl+M` | Diálogo “Chat por número de teléfono” |
| `Ctrl+U` | Nueva cuenta |
| `Ctrl+Shift+Z` | Alternar modo Zen |
| `Escape` | Salir del modo Zen (si está activo) |
| `Ctrl+W` | Ocultar ventana |
| `Ctrl+Q` | Salir de la aplicación |
| `F5` | Recargar la vista de WhatsApp Web |
| `F11` | Pantalla completa |

Los mismos atajos aparecen reflejados en el **menú nativo** de la ventana (Archivo, Ver, Chat, Cuentas, Ayuda).

---

## 7. Modo Zen

- Oculta el **rail** y maximiza el espacio para el chat.
- Activación: **Ver → Modo Zen**, `Ctrl+Shift+Z`, o la paleta (“Activar modo Zen”).
- Desactivación: **Escape**, o el comando “Salir del modo Zen” en la paleta si el modo Zen sigue activo según el estado mostrado.

Al entrar en **Ajustes**, el modo Zen se desactiva automáticamente.

---

## 8. Chat por número de teléfono

1. Pulsa `Ctrl+M` o el comando equivalente en la paleta.
2. Introduce el número en formato internacional (p. ej. `+34…`).
3. Confirma para abrir la conversación en la cuenta activa.

### Enlaces desde Internet (`whatsapp://`, `wa.me`, …)

Catrip Connect puede abrir un chat en la **cuenta activa** cuando el sistema o una página web lanzan un enlace compatible:

- `whatsapp://send?phone=…`
- `https://wa.me/…`
- `https://api.whatsapp.com/send?phone=…`
- `https://web.whatsapp.com/send?phone=…`
- `https://chat.whatsapp.com/…` (invitación a grupo)

**Configuración en Linux (una vez por usuario):**

1. Instala el **`.deb`** (el postinst registra `whatsapp://`) o integra el AppImage:
   ```bash
   _scripts/install-appimage.sh /ruta/a/catrip-connect_*.AppImage
   ```
2. Si el navegador muestra *«No hay aplicaciones disponibles»*, usa **Ajustes → General → Registrar como app predeterminada (whatsapp://)** o ejecuta:
   ```bash
   npm run register:whatsapp
   # o: bash _scripts/register-whatsapp-protocol.sh
   ```
   Cierra el navegador y vuelve a probar el enlace.
3. Opcional: **Ajustes del sistema → Aplicaciones predeterminadas** → **WhatsApp** → **Catrip Connect**.
4. En **Ajustes → General → Enlaces WhatsApp entrantes** elige:
   - **Preguntar si hay varias cuentas** (por defecto),
   - **Siempre la cuenta activa**, o
   - **Cuenta fija** (lista desplegable).

Los enlaces pueden incluir **mensaje precargado** (`?text=…` en `wa.me` o `whatsapp://`). Los `https://wa.me/…` abiertos **solo en el navegador** siguen yendo al navegador salvo redirección a `whatsapp://`; también puedes usar `Ctrl+M`.

---

## 9. Ajustes (resumen por sección)

### General

- **Iniciar minimizada**
- **Mostrar barra lateral**
- **Mostrar barra de menú**
- **Al cerrar, minimizar a la bandeja**
- **Iniciar automáticamente con el sistema** (Linux): al activar el toggle, la app crea o actualiza `~/.config/autostart/catrip-connect.desktop` con la ruta correcta al ejecutable (entrecomillada si hay espacios, p. ej. instalación `.deb` en `/opt/Catrip Connect/`). **Si actualizaste desde 1.4.0 y el autoinicio no funcionaba:** abre Ajustes → desactiva esta opción → vuelve a activarla → cierra sesión y prueba de nuevo. En AppImage debe quedar la ruta absoluta del fichero `.AppImage`, no un montaje temporal.
- **Preguntar siempre “Guardar como…”** al descargar
- **Carpeta de descargas** (ruta de texto o selección con el diálogo del sistema)
- **Escala de interfaz** (100 % a 200 %)
- **Badge del tray** y **badge en el dock** (Linux) según no leídos de **todas** las cuentas (y badge manual para pruebas)
- **Enlaces WhatsApp entrantes** (cuenta destino), **registrar protocolo** en el escritorio y **buscar actualizaciones** al iniciar (canal **estable** o **beta**)
- **Abrir descargas** con la aplicación predeterminada del sistema (`xdg-open` / portal)

#### Actualizaciones desde GitHub (Ajustes → General)

Activa **Buscar actualizaciones al iniciar** y elige canal **estable** (releases) o **beta** (pre-releases). El resumen del changelog en los diálogos se muestra en **texto plano** (sin HTML de GitHub).

| Forma de instalación | Comportamiento al haber una versión nueva |
|----------------------|-------------------------------------------|
| **`.deb`** (instalado con apt en `/opt/Catrip Connect/`) | Diálogo con el changelog y tres opciones: **Descargar…** (eliges carpeta y se guarda el `.deb`; opcional verificación SHA-512), **Solo enlace de descarga** (URL de GitHub y abrir en el navegador) o **Más tarde**. La app **no** reinicia ni instala sola. |
| **AppImage** | Descarga automática en segundo plano; al terminar, **Reiniciar ahora** o **Más tarde** para aplicar la actualización. |

Tras descargar un `.deb` manualmente:

```bash
cd /ruta/donde/guardaste/el/paquete
sudo apt install ./catrip-connect_1.4.2_amd64.deb
```

### Cuentas

- **Renombrar** cuenta
- **Regenerar icono** / **variantes de color** del avatar
- **Notificaciones habilitadas** por cuenta (cuando la opción global lo permite)
- **Eliminar** cuenta (con confirmación)

### Notificaciones

- **Notificaciones del sistema** (activar/desactivar)
- **Mostrar nombre de la cuenta** en la notificación
- **Mostrar detalle (preview)**
- **No molestar** (sin avisos nativos; el badge del tray/dock sigue activo)
- **Sonido del sistema** en notificaciones
- Aviso cuando suben no leídos en **cualquier cuenta**; al pulsar la notificación se activa esa cuenta

### Red

- **Proxy de red** activado/desactivado
- **Reglas del proxy** en texto (formato Chromium/Electron)

### Rendimiento

- **Refuerzo GPU al arrancar** (experimental): VA-API para vídeo en Linux, rasterización y zero-copy. Requiere **reiniciar** la app.
- **Límite de procesos del renderer** (0 = predeterminado de Electron; 3–6 útil con varias cuentas). También requiere reinicio.
- **Evitar suspensión durante videollamada** (bloqueo de energía mientras WhatsApp Web detecta una llamada).
- Limpieza de caché HTTP y diagnósticos de medios (códecs WhatsApp Web).

Los cambios se guardan en el almacenamiento local de la aplicación.

---

## 10. Bandeja del sistema (tray)

- Al **cerrar** la ventana, según configuración la app puede **quedar en la bandeja** en lugar de salir.
- El icono puede mostrar **badge** con el número de conversaciones no leídas (según las cuentas y la configuración).
- En **Linux**, el menú de bandeja lista **cuentas** con estado (conectada / QR / sin red) y no leídos; el tooltip del icono resume el mismo estado por cuenta.
- El **rail** muestra en el tooltip de cada cuenta el estado de sesión y los no leídos.
- En algunos entornos Wayland el backend puede ser SNI/AppIndicator; el clic en el icono sigue permitiendo **restaurar** la ventana.
- Clic en una **notificación** del sistema: enfoca la ventana y activa la cuenta (con pulso always-on-top en Wayland).
- En GNOME/KDE, el menú del **lanzador** puede mostrar acciones: *Abrir*, *Enfocar ventana*, *Nueva cuenta* (tras `npm run register:whatsapp` o reinstalar el `.desktop`).

---

## 11. Ayuda integrada

- **Ayuda → Atajos de teclado**: lista rápida dentro de la aplicación.
- **Ayuda → Acerca de**: información de versión.

---

## 12. Variables de entorno (referencia)

| Variable | Efecto |
|----------|--------|
| `CATRIP_DISABLE_GPU=1` | Desactiva aceleración por GPU antes del arranque (útil si la vista embebida sale en negro en algunos controladores Linux/Wayland). |
| `CATRIP_GPU_BOOST=1` | Activa flags GPU extra (VA-API, zero-copy); también en **Ajustes → Rendimiento**. |
| `CATRIP_OZONE_PLATFORM=wayland\|x11` | Backend gráfico de Chromium (prueba si el compositor va lento). |
| `CATRIP_TRANSPARENT_WINDOW=0\|1` | Fuerza ventana opaca o transparente. |
| `CATRIP_DEBUG_EMBED=0\|1` | Logs de diagnóstico del embebido (en desarrollo suele estar activo salvo `0`). |
| `CATRIP_E2E=1` | Modo pruebas automatizadas (no usar en uso normal). |

---

## 13. Buenas prácticas

- Mantén la aplicación **actualizada** para obtener correcciones de Electron y del runtime embebido.
- Si una cuenta deja de responder, prueba **Recargar** (`F5`) antes de borrar la cuenta.
- En **portátil**, revisa **Rendimiento** y **Red** si usas proxy corporativo.

Para instalación, paquetes y detalles del proyecto, consulta el **[README](README.md)** y el **[CHANGELOG](CHANGELOG.md)**.

---

## 14. Linux: AppImage, `.deb` y arranque

- **Actualizaciones**: véase la tabla en **§9 General → Actualizaciones desde GitHub** (flujo distinto para `.deb` y AppImage).
- **AppImage y FUSE**: muchos AppImage necesitan **libfuse2** en el sistema. Si ves `dlopen(): error loading libfuse.so.2`, instálala (p. ej. `sudo apt install libfuse2` o `libfuse2t64` en Ubuntu reciente). Como alternativa: `./MiApp.AppImage --appimage-extract-and-run`.
- **Ejecutar desde terminal**: usa la ruta del binario o del fichero `.AppImage`. El sufijo **`%U`** solo pertenece al campo **`Exec=`** del fichero `.desktop`, no lo escribas al lanzar a mano.
- **Enlaces WhatsApp (desde 1.2.0, cuenta destino y texto en 1.3.0)**: tras instalar el `.deb` o integrar el AppImage, configura **Catrip Connect** para `whatsapp://` (véase §8). Los `https://wa.me/…` en el navegador no delegan solos a la app.
- **Sandbox Chromium**: en **1.1.1** y posteriores (**1.3.0**, etc.), los switches (`disable-setuid-sandbox`, clase X11) se aplican en `bootstrap.ts` **antes** de cargar el resto del proceso principal; en **1.1.0** el switch en `main.ts` podía aplicarse demasiado tarde (después de los `import`), de modo que el arranque no reflejaba el cambio.
