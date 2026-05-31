## Catrip Connect 1.6.0

Release centrada en **productividad multi-cuenta** y **menor consumo de RAM** con varias sesiones abiertas.

### Novedades

- **«Ahora mismo»**: panel compacto anclado al rail con los **3 chats más urgentes** de todas las cuentas; no tapa WhatsApp. Accesos: botón del rail, `Ctrl+Shift+A`, **Ver → Ahora mismo** o paleta `Ctrl+K`.
- **Búsqueda de chats en `Ctrl+K`**: escribe un contacto, fragmento del último mensaje o nombre de cuenta; la sección **Chats** abre la conversación en la cuenta correcta.
- **Suspensión de cuentas inactivas** (**Ajustes → Rendimiento**): tras X minutos sin usar una cuenta (5–60, por defecto 15), se libera memoria cerrando su vista interna; la **sesión se conserva** en disco. El avatar aparece atenuado («en reposo»); un clic la reactiva al instante.
- **Manual de usuario integrado**: **Ayuda → Manual de usuario** — guía con índice, ilustraciones y secciones para cuentas, «Ahora mismo», reposo, bandeja, ajustes y problemas frecuentes.

### Mejoras

- Icono **SVG** coherente para «Ahora mismo» en el rail (sustituye el emoji ⚡ desalineado).
- Overlay **Ayuda → Atajos de teclado** incluye `Ctrl+Shift+A`.

### Cómo actualizar

#### Si instalaste el `.deb`

1. Con **Buscar actualizaciones al iniciar** activo, usa el diálogo (**Descargar…**, **Solo enlace** o **Más tarde**).
2. Instala el paquete descargado:

```bash
sudo apt install ./catrip-connect_1.6.0_amd64.deb
```

#### Si usas AppImage

1. Deja que la app descargue la actualización o descarga el AppImage de esta release.
2. Pulsa **Reiniciar ahora** cuando esté lista.

### Archivos de esta release

| Archivo                                | Uso                                                   |
| -------------------------------------- | ----------------------------------------------------- |
| `catrip-connect_1.6.0_amd64.deb`       | Instalación en Debian/Ubuntu (`sudo apt install ./…`) |
| `catrip-connect_1.6.0_x86_64.AppImage` | Ejecutable portable (`chmod +x` y ejecutar)           |
| `latest-linux.yml`                     | Metadatos para actualización automática (AppImage)    |

### Requisitos habituales

- **`.deb`**: `libgtk-3-0`, `libnotify4`, `libnss3`; bandeja: `libappindicator3-1` recomendado.
- **AppImage**: **libfuse2** en muchos sistemas (`sudo apt install libfuse2` o `libfuse2t64`).

Documentación: [USAGE.md](https://github.com/alktrip/catrip-multichat-electron/blob/master/USAGE.md) · [CHANGELOG](https://github.com/alktrip/catrip-multichat-electron/blob/master/CHANGELOG.md#160--2026-05-30)
