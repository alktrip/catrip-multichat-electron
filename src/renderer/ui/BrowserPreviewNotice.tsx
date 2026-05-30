import React from "react";

export default function BrowserPreviewNotice() {
  return (
    <div className="catrip-browser-preview-notice" role="status">
      <strong>Modo preview del navegador</strong>
      <span>
        Datos simulados para revisar la UI. WhatsApp Web, sesiones reales e IPC requieren la ventana
        Electron (<code>npm run dev</code>).
      </span>
    </div>
  );
}
