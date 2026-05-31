## Catrip Connect 1.7.0

Release centrada en **internacionalización**, **manual multilingüe** y **atajos de teclado fiables** con el foco en WhatsApp Web.

### Novedades

- **9 idiomas + sistema**: español, inglés, portugués, francés, alemán, coreano, japonés, italiano y chino simplificado. Selector en **Ajustes → General → Idioma de la interfaz**.
- **Por defecto** se usa el **idioma del sistema**; si no está soportado, la interfaz cae en **inglés**.
- **Manual de usuario** traducido en los 9 idiomas (**Ayuda → Manual de usuario**), con nueva sección sobre **llamadas y videollamadas** (opción BETA de WhatsApp Web).
- **Aviso al cambiar idioma** con instrucciones para configurar el idioma de WhatsApp Web por separado.
- **Atajos globales con foco en WhatsApp**: `Ctrl+K`, `Ctrl+P`, `Ctrl+N`, `Ctrl+M`, `Ctrl+U`, `Ctrl+1`–`9`, `Ctrl+Shift+Z`, `Ctrl+Shift+A`, `F5`, `F11`, etc. funcionan aunque estés escribiendo en un chat.

### Mejoras

- Menús nativos, bandeja, notificaciones y diálogos de actualización traducidos desde el proceso principal.
- **«Ahora mismo»** abre la bandeja completa de pendientes (mejor maquetado que el panel lateral anterior).

### Correcciones

- **Pantalla negra / menú bloqueado** en algunos entornos de desarrollo tras i18n (artefactos `.js` obsoletos).
- Flujo unificado del botón ⚡ y **Ver → Ahora mismo**.

### Cómo actualizar

#### Si instalaste el `.deb`

1. Con **Buscar actualizaciones al iniciar** activo, usa el diálogo (**Descargar…**, **Solo enlace** o **Más tarde**).
2. Instala el paquete descargado:

```bash
sudo apt install ./catrip-connect_1.7.0_amd64.deb
```

#### Si usas AppImage

1. Deja que la app descargue la actualización o descarga el AppImage de esta release.
2. Pulsa **Reiniciar ahora** cuando esté lista.

### Archivos de esta release

| Archivo                                | Uso                                                   |
| -------------------------------------- | ----------------------------------------------------- |
| `catrip-connect_1.7.0_amd64.deb`       | Instalación en Debian/Ubuntu (`sudo apt install ./…`) |
| `catrip-connect_1.7.0_x86_64.AppImage` | Ejecutable portable (`chmod +x` y ejecutar)           |
| `latest-linux.yml`                     | Metadatos para actualización automática (AppImage)    |

### Requisitos habituales

- **`.deb`**: `libgtk-3-0`, `libnotify4`, `libnss3`; bandeja: `libappindicator3-1` recomendado.
- **AppImage**: **libfuse2** en muchos sistemas (`sudo apt install libfuse2` o `libfuse2t64`).

Documentación: [USAGE.md](https://github.com/alktrip/catrip-multichat-electron/blob/master/USAGE.md) · [CHANGELOG](https://github.com/alktrip/catrip-multichat-electron/blob/master/CHANGELOG.md#170--2026-05-31)
