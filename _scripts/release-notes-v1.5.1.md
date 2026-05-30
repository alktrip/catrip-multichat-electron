## Catrip Connect 1.5.1

Corrección centrada en el **diálogo de actualización**: las notas de cada release ya no quedan recortadas ni fuera de pantalla.

### Correcciones

- **Panel con scroll**: al detectar una versión nueva (`.deb` o AppImage), las notas se muestran en un diálogo integrado con zona central desplazable; la ventana no crece y los botones de acción siguen visibles.
- **Entrega fiable al renderer**: el aviso se envía al shell React (`WebContentsView`), no al proceso vacío de la ventana principal.
- **Visible en Ajustes**: el diálogo aparece también si estabas en la pantalla de preferencias.

### Cómo actualizar

#### Si instalaste el `.deb`

1. Con **Buscar actualizaciones al iniciar** activo, usa el diálogo (**Descargar…**, **Solo enlace** o **Más tarde**).
2. Instala el paquete descargado:

```bash
sudo apt install ./catrip-connect_1.5.1_amd64.deb
```

#### Si usas AppImage

1. Deja que la app descargue la actualización o descarga el AppImage de esta release.
2. Pulsa **Reiniciar ahora** cuando esté lista.

### Archivos de esta release

| Archivo | Uso |
|---------|-----|
| `catrip-connect_1.5.1_amd64.deb` | Instalación en Debian/Ubuntu (`sudo apt install ./…`) |
| `catrip-connect_1.5.1_x86_64.AppImage` | Ejecutable portable (`chmod +x` y ejecutar) |
| `latest-linux.yml` | Metadatos para actualización automática (AppImage) |

### Requisitos habituales

- **`.deb`**: `libgtk-3-0`, `libnotify4`, `libnss3`; bandeja: `libappindicator3-1` recomendado.
- **AppImage**: **libfuse2** en muchos sistemas (`sudo apt install libfuse2` o `libfuse2t64`).

Documentación: [USAGE.md](https://github.com/alktrip/catrip-multichat-electron/blob/master/USAGE.md) · [CHANGELOG](https://github.com/alktrip/catrip-multichat-electron/blob/master/CHANGELOG.md#151--2026-05-31)
