## catrip_multichat_electron

Cliente de escritorio (Electron) para WhatsApp Web con múltiples cuentas (sesiones aisladas).

### Desarrollo

```bash
npm install
npm run dev
```

### Empaquetado

```bash
npm run dist
```

### Variables de entorno útiles

- **`CATRIP_DISABLE_GPU=1`**: desactiva aceleración por GPU antes de `app.whenReady()`. Útil en Linux/Wayland si la vista embebida se ve negra.
- **`CATRIP_TRANSPARENT_WINDOW=0|1`**: fuerza ventana opaca/transparente (por defecto: opaca en Linux).
- **`CATRIP_DEBUG_EMBED=0|1`**: controla logs de diagnóstico (en dev está activo salvo `0`).

### Tema oscuro

Se usa **solo** el modo oscuro nativo de WhatsApp Web. No se inyecta CSS de terceros (DarkReader deshabilitado para sesiones de WhatsApp).

