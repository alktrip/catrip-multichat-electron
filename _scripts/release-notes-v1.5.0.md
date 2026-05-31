## Catrip Connect 1.5.0

Versión centrada en **productividad multi-cuenta**: resumen de actividad, bandeja de chats pendientes, notificaciones más informativas y correcciones de contador de no leídos y ventana al usar la bandeja.

### Novedades

- **Centro de actividad** (rail ▤ o paleta `Ctrl+K` → «Centro de actividad»): vista por cuenta con total de no leídos, último remitente y preview del mensaje.
- **Acciones pendientes** (rail ✉ o paleta): lista unificada de conversaciones sin leer en todas las cuentas, ordenadas por urgencia; un clic abre el chat en WhatsApp Web.
- **Notificaciones enriquecidas**: cuando suben los no leídos, el aviso nativo puede incluir remitente y texto del último mensaje (si WhatsApp Web lo expone).
- **Modo preview en navegador** para desarrolladores: al abrir `http://localhost:5173` con `npm run dev` se simula la API con cuentas demo (sin sesiones reales).
- **DevBanner** en builds de desarrollo: contexto técnico (versión, runtime, rutas).

### Correcciones

- **Contador de no leídos** alineado con WhatsApp Web (título de pestaña + badges sin duplicar).
- **Ventana y bandeja**: al minimizar a bandeja y restaurar, se conservan tamaño, posición y estado maximizado.

### Cómo actualizar

#### Si instalaste el `.deb`

1. Con **Buscar actualizaciones al iniciar** activo, usa el diálogo (**Descargar…**, **Solo enlace** o **Más tarde**).
2. Instala el paquete descargado:

```bash
sudo apt install ./catrip-connect_1.5.0_amd64.deb
```

#### Si usas AppImage

1. Deja que la app descargue la actualización o descarga el AppImage de esta release.
2. Pulsa **Reiniciar ahora** cuando esté lista, o sustituye el fichero `.AppImage` y vuelve a ejecutarlo.

### Archivos de esta release

| Archivo                                | Uso                                                   |
| -------------------------------------- | ----------------------------------------------------- |
| `catrip-connect_1.5.0_amd64.deb`       | Instalación en Debian/Ubuntu (`sudo apt install ./…`) |
| `catrip-connect_1.5.0_x86_64.AppImage` | Ejecutable portable (`chmod +x` y ejecutar)           |
| `latest-linux.yml`                     | Metadatos para actualización automática (AppImage)    |

### Requisitos habituales

- **`.deb`**: `libgtk-3-0`, `libnotify4`, `libnss3`; bandeja: `libappindicator3-1` recomendado.
- **AppImage**: **libfuse2** en muchos sistemas (`sudo apt install libfuse2` o `libfuse2t64`).

Documentación: [USAGE.md](https://github.com/alktrip/catrip-multichat-electron/blob/master/USAGE.md) · [CHANGELOG](https://github.com/alktrip/catrip-multichat-electron/blob/master/CHANGELOG.md#150--2026-05-30)
