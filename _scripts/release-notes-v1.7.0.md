## Catrip Connect 1.7.0

**Todas tus cuentas de WhatsApp Web, en un solo escritorio Linux.**

Esta versión lleva **Catrip Connect** al siguiente nivel de adopción global: interfaz en **9 idiomas**, **manual integrado** traducido y **atajos de teclado** que no pierden el foco cuando escribes en un chat. Ideal para soporte, ventas y uso personal con varias sesiones aisladas.

<p align="center">
  <a href="https://github.com/alktrip/catrip-multichat-electron/blob/master/README.md">
    <strong>Ver README con capturas y guía de instalación →</strong>
  </a>
</p>

---

### Lo más destacado

| Área              | Qué incluye                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Multi-idioma**  | Español, inglés, portugués, francés, alemán, coreano, japonés, italiano y chino simplificado + **idioma del sistema** |
| **Productividad** | `Ctrl+K`, `Ctrl+P`, `Ctrl+1`–`9`, `Ctrl+Shift+A`, `F5`… **activos con foco en WhatsApp Web**                          |
| **Documentación** | Manual de usuario en la app (**Ayuda → Manual de usuario**) en los 9 idiomas                                          |
| **Pendientes**    | **«Ahora mismo»** abre la bandeja unificada de acciones pendientes                                                    |

---

### Novedades

- **9 idiomas + sistema**: selector en **Ajustes → General → Idioma de la interfaz**.
- **Por defecto**: idioma del **sistema operativo**; si no está soportado → **inglés**.
- **Manual multilingüe** con sección de **llamadas y videollamadas** (activar BETA en WhatsApp Web).
- **Aviso al cambiar idioma** (WhatsApp Web mantiene su idioma aparte).
- **Atajos globales con foco en WhatsApp**: `Ctrl+K`, `Ctrl+P`, `Ctrl+N`, `Ctrl+M`, `Ctrl+U`, `Ctrl+1`–`9`, `Ctrl+Shift+Z`, `Ctrl+Shift+A`, `F5`, `F11`, etc.

### Mejoras

- Menús nativos, bandeja del sistema, notificaciones y diálogos de actualización traducidos.
- **«Ahora mismo»** unificado con la bandeja de pendientes (mejor maquetado).

### Correcciones

- **Pantalla negra / menú bloqueado** tras cambios de i18n (artefactos `.js` obsoletos).
- Flujo unificado del botón ⚡ y **Ver → Ahora mismo**.

---

### Descarga

| Archivo                                | Uso                                                                 |
| -------------------------------------- | ------------------------------------------------------------------- |
| `catrip-connect_1.7.0_amd64.deb`       | Debian/Ubuntu — `sudo apt install ./catrip-connect_1.7.0_amd64.deb` |
| `catrip-connect_1.7.0_x86_64.AppImage` | Portable — `chmod +x` y ejecutar                                    |
| `latest-linux.yml`                     | Actualización automática (AppImage)                                 |

**Instalación nueva:** descarga el artefacto, instala o ejecuta, crea tu primera cuenta y escanea el QR de WhatsApp Web.

---

### Cómo actualizar desde 1.6.x

#### `.deb`

1. Activa **Buscar actualizaciones al iniciar** en **Ajustes → General** (o descarga manualmente desde esta release).
2. Instala el paquete:

```bash
sudo apt install ./catrip-connect_1.7.0_amd64.deb
```

#### AppImage

1. Deja que la app descargue la actualización o sustituye el AppImage por el de esta release.
2. Pulsa **Reiniciar ahora** cuando esté lista.

---

### Requisitos

- **`.deb`**: `libgtk-3-0`, `libnotify4`, `libnss3`; bandeja: `libappindicator3-1` recomendado.
- **AppImage**: **libfuse2** (`sudo apt install libfuse2` o `libfuse2t64` en Ubuntu 24+).

---

### Documentación

- [README](https://github.com/alktrip/catrip-multichat-electron/blob/master/README.md) — visión general, capturas e instalación
- [USAGE.md](https://github.com/alktrip/catrip-multichat-electron/blob/master/USAGE.md) — guía de uso detallada
- [CHANGELOG 1.7.0](https://github.com/alktrip/catrip-multichat-electron/blob/master/CHANGELOG.md#170--2026-05-31)

---

<p align="center"><sub>Catrip Connect · WhatsApp Web multi-cuenta para Linux · MIT</sub></p>
