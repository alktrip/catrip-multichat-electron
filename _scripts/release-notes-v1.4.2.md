## Catrip Connect 1.4.2

Esta versión mejora cómo se informa y aplica una **nueva versión** según el tipo de instalación en Linux.

### Novedades y correcciones

- **Changelog legible**: las notas de la release de GitHub ya no aparecen con etiquetas HTML (`<h2>`, `<ul>`, etc.) en los diálogos; se muestran en texto plano.
- **Instalación `.deb` (menos invasivo)**:
  - Al detectar una actualización, la app **pregunta** antes de descargar nada.
  - **Descargar…** → eliges la carpeta y se guarda `catrip-connect_1.4.2_amd64.deb` (con verificación SHA-512 si está publicada).
  - **Solo enlace de descarga** → ves la URL de GitHub y puedes abrirla en el navegador.
  - **Más tarde** → sin descarga.
  - La aplicación **no** se reinicia ni instala el paquete por ti; debes instalar con apt o tu gestor de paquetes.
- **AppImage**: sin cambios — descarga automática y opción **Reiniciar ahora** cuando la actualización está lista.

### Cómo actualizar

#### Si instalaste el `.deb`

1. Abre **Catrip Connect** (versión anterior) con **Buscar actualizaciones al iniciar** activo en Ajustes, o espera el aviso al arrancar.
2. Cuando aparezca **1.4.2**, elige **Descargar…** o **Solo enlace de descarga**.
3. Instala el paquete descargado:

```bash
sudo apt install ./catrip-connect_1.4.2_amd64.deb
```

#### Si usas AppImage

1. Deja que la app descargue la actualización (o descarga el AppImage de esta release).
2. Pulsa **Reiniciar ahora** en el diálogo, o cierra la app y vuelve a abrir el AppImage actualizado.

### Archivos de esta release

| Archivo | Uso |
|---------|-----|
| `catrip-connect_1.4.2_amd64.deb` | Instalación en Debian/Ubuntu y derivados (`sudo apt install ./…`) |
| `catrip-connect_1.4.2_x86_64.AppImage` | Ejecutable portable (permiso de ejecución: `chmod +x`) |
| `latest-linux.yml` | Metadatos para el actualizador automático (AppImage) |

### Requisitos habituales

- **`.deb`**: `libgtk-3-0`, `libnotify4`, `libnss3`; bandeja: `libappindicator3-1` recomendado.
- **AppImage**: en muchos sistemas hace falta **libfuse2** (`sudo apt install libfuse2` o `libfuse2t64`).

Documentación completa: [USAGE.md](https://github.com/alktrip/catrip-multichat-electron/blob/master/USAGE.md) · [CHANGELOG](https://github.com/alktrip/catrip-multichat-electron/blob/master/CHANGELOG.md#142--2026-05-20)
