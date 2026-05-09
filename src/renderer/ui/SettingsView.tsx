import React from "react";

type SettingsPage = "general" | "notifications" | "network" | "performance";

type Settings = {
  version: 1;
  performance: { rendererProcessLimit: number };
  network: { proxyEnabled: boolean; proxyRules: string };
  general: {
    startMinimized: boolean;
    showSidebar: boolean;
    showMenuBar: boolean;
    downloadsDirectory: string | null;
    downloadsAskSaveAs: boolean;
    closeToTray: boolean;
    autoStart: boolean;
    trayUnreadBadge: boolean;
    trayBadgeManual: number | null;
  };
  notifications: { enabled: boolean };
};

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16 }}
      />
      <span>{label}</span>
    </label>
  );
}

function SidebarButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      disabled={active}
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 15px",
        border: "none",
        borderRadius: 4,
        background: "transparent",
        color: active ? "#21c063" : "#E1E1E1",
        cursor: active ? "default" : "pointer",
        borderLeft: `3px solid ${active ? "#21c063" : "transparent"}`,
        opacity: active ? 0.95 : 1,
      }}
    >
      {label}
    </button>
  );
}

export default function SettingsView({
  onBack,
}: {
  onBack: () => void;
}) {
  const [page, setPage] = React.useState<SettingsPage>("general");
  const [fadeKey, setFadeKey] = React.useState(0);
  const [settings, setSettings] = React.useState<Settings | null>(null);
  const [mediaDiagBusy, setMediaDiagBusy] = React.useState(false);
  const [mediaDiagText, setMediaDiagText] = React.useState<string | null>(null);

  React.useEffect(() => {
    setFadeKey((x) => x + 1);
  }, [page]);

  React.useEffect(() => {
    let mounted = true;
    window.catrip
      .getSettings()
      .then((s: Settings) => mounted && setSettings(s))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const update = (next: Settings) => {
    setSettings(next);
    void window.catrip.setSettings(next);
  };

  const runMediaDiag = () => {
    setMediaDiagBusy(true);
    setMediaDiagText(null);
    void window.catrip
      .runWhatsAppMediaDiagnostics()
      .then((r) => {
        setMediaDiagBusy(false);
        if (r.ok) {
          setMediaDiagText(JSON.stringify(r.data, null, 2));
        } else {
          setMediaDiagText(
            [r.message, r.url ? `URL: ${r.url}` : "", `(código: ${r.code})`].filter(Boolean).join("\n")
          );
        }
      })
      .catch(() => setMediaDiagBusy(false));
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#242626", color: "#E1E1E1" }}>
      <div
        id="sidebar"
        style={{
          width: 300,
          minWidth: 300,
          maxWidth: 300,
          background: "#1d1f1f",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: 10 }}>
          <button
            onClick={onBack}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 15px",
              border: "none",
              background: "transparent",
              color: "#E1E1E1",
              cursor: "pointer",
            }}
          >
            Atrás
          </button>
          <div style={{ fontSize: 12, opacity: 0.7, padding: "0 15px 10px" }}>AJUSTES</div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 0 10px" }} />
          <SidebarButton active={page === "general"} label="General" onClick={() => setPage("general")} />
          <div style={{ fontSize: 12, opacity: 0.7, padding: "14px 15px 6px" }}>HERRAMIENTAS</div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "6px 0 10px" }} />
          <SidebarButton
            active={page === "notifications"}
            label="Notificaciones"
            onClick={() => setPage("notifications")}
          />
          <SidebarButton
            active={page === "performance"}
            label="Rendimiento"
            onClick={() => setPage("performance")}
          />
          <SidebarButton active={page === "network"} label="Red" onClick={() => setPage("network")} />
        </div>

        <div style={{ marginTop: "auto", padding: 10 }}>
          <button
            onClick={() => window.close()}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 15px",
              border: "none",
              background: "transparent",
              color: "#E1E1E1",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <div
          key={fadeKey}
          style={{
            animation: "fadeIn220ms 220ms cubic-bezier(0.215, 0.61, 0.355, 1)",
          }}
        >
          <div style={{ padding: 18 }}>
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
                {page === "general"
                  ? "General"
                  : page === "notifications"
                    ? "Notificaciones"
                    : page === "network"
                      ? "Red"
                      : "Rendimiento (experimental)"}
              </div>
              {!settings ? (
                <div style={{ opacity: 0.8 }}>Cargando…</div>
              ) : page === "general" ? (
                <div style={{ opacity: 0.92 }}>
                  <ToggleRow
                    label="Iniciar minimizada"
                    checked={settings.general.startMinimized}
                    onChange={(v) => update({ ...settings, general: { ...settings.general, startMinimized: v } })}
                  />
                  <ToggleRow
                    label="Mostrar barra lateral"
                    checked={settings.general.showSidebar}
                    onChange={(v) => update({ ...settings, general: { ...settings.general, showSidebar: v } })}
                  />
                  <ToggleRow
                    label="Mostrar barra de menú"
                    checked={settings.general.showMenuBar}
                    onChange={(v) => update({ ...settings, general: { ...settings.general, showMenuBar: v } })}
                  />
                  <ToggleRow
                    label="Al cerrar, minimizar a la bandeja (tray)"
                    checked={settings.general.closeToTray}
                    onChange={(v) => update({ ...settings, general: { ...settings.general, closeToTray: v } })}
                  />
                  <ToggleRow
                    label="Iniciar automáticamente con el sistema"
                    checked={settings.general.autoStart}
                    onChange={(v) => update({ ...settings, general: { ...settings.general, autoStart: v } })}
                  />
                  <div style={{ height: 1, background: "rgba(255,255,255,0.10)", margin: "10px 0" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>Descargas</div>
                  <ToggleRow
                    label="Preguntar siempre “Guardar como…”"
                    checked={settings.general.downloadsAskSaveAs}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, downloadsAskSaveAs: v } })
                    }
                  />
                  <div style={{ padding: "6px 0 10px", opacity: 0.92 }}>
                    <div style={{ fontSize: 13, marginBottom: 6 }}>Carpeta de descargas</div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      <input
                        value={settings.general.downloadsDirectory || ""}
                        placeholder="(usar la carpeta del sistema)"
                        onChange={(e) =>
                          update({
                            ...settings,
                            general: { ...settings.general, downloadsDirectory: e.target.value || null },
                          })
                        }
                        style={{
                          flex: "1 1 360px",
                          borderRadius: 10,
                          padding: "10px 12px",
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(255,255,255,0.06)",
                          color: "inherit",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => {
                          void window.catrip.selectDownloadsDirectory().then((p) => {
                            if (!p) return;
                            update({ ...settings, general: { ...settings.general, downloadsDirectory: p } });
                          });
                        }}
                        style={{
                          borderRadius: 10,
                          padding: "10px 12px",
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(255,255,255,0.04)",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        Elegir…
                      </button>
                      <button
                        onClick={() =>
                          update({ ...settings, general: { ...settings.general, downloadsDirectory: null } })
                        }
                        style={{
                          borderRadius: 10,
                          padding: "10px 12px",
                          border: "1px solid rgba(255,255,255,0.14)",
                          background: "rgba(255,255,255,0.04)",
                          color: "inherit",
                          cursor: "pointer",
                        }}
                      >
                        Restablecer
                      </button>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                      WhatsApp Web controla el nombre del archivo. Si un archivo existe, se generará un nombre alternativo.
                    </div>
                  </div>
                  <ToggleRow
                    label="Badge del tray según WhatsApp Web (no leídos)"
                    checked={settings.general.trayUnreadBadge}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, trayUnreadBadge: v } })
                    }
                  />
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      padding: "8px 0",
                      opacity: 0.92,
                    }}
                  >
                    <span>Badge manual (prueba; vacío = automático)</span>
                    <input
                      type="number"
                      min={0}
                      max={999}
                      placeholder="Automático"
                      value={
                        settings.general.trayBadgeManual === null ||
                        settings.general.trayBadgeManual === undefined
                          ? ""
                          : String(settings.general.trayBadgeManual)
                      }
                      onChange={(e) => {
                        const raw = e.target.value.trim();
                        if (raw === "") {
                          update({
                            ...settings,
                            general: { ...settings.general, trayBadgeManual: null },
                          });
                          return;
                        }
                        const n = parseInt(raw, 10);
                        if (!Number.isFinite(n)) return;
                        update({
                          ...settings,
                          general: {
                            ...settings.general,
                            trayBadgeManual: Math.max(0, Math.min(999, n)),
                          },
                        });
                      }}
                      style={{
                        maxWidth: 120,
                        padding: "6px 8px",
                        borderRadius: 4,
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(0,0,0,0.25)",
                        color: "#E1E1E1",
                      }}
                    />
                  </label>
                </div>
              ) : page === "network" ? (
                <div style={{ opacity: 0.92 }}>
                  <ToggleRow
                    label="Proxy de red"
                    checked={settings.network.proxyEnabled}
                    onChange={(v) => update({ ...settings, network: { ...settings.network, proxyEnabled: v } })}
                  />
                  <div style={{ marginTop: 10, opacity: 0.85 }}>Reglas del proxy</div>
                  <input
                    value={settings.network.proxyRules}
                    onChange={(e) =>
                      update({ ...settings, network: { ...settings.network, proxyRules: e.target.value } })
                    }
                    placeholder='Ej: "http=127.0.0.1:8080;https=127.0.0.1:8080"'
                    style={{
                      width: "100%",
                      marginTop: 6,
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.06)",
                      color: "inherit",
                      outline: "none",
                    }}
                  />
                  <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>
                    Se aplica al guardar (no hay botón Apply aún).
                  </div>
                </div>
              ) : page === "notifications" ? (
                <div style={{ opacity: 0.92 }}>
                  <ToggleRow
                    label="Notificaciones del sistema"
                    checked={settings.notifications.enabled}
                    onChange={(v) =>
                      update({ ...settings, notifications: { ...settings.notifications, enabled: v } })
                    }
                  />
                </div>
              ) : (
                <div style={{ opacity: 0.92 }}>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>Límite de procesos del renderer</div>
                  <select
                    value={String(settings.performance.rendererProcessLimit)}
                    onChange={(e) =>
                      update({
                        ...settings,
                        performance: { ...settings.performance, rendererProcessLimit: Number(e.target.value) },
                      })
                    }
                    style={{
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.06)",
                      color: "inherit",
                      outline: "none",
                    }}
                  >
                    <option value="0">Predeterminado</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>

                  <div
                    style={{
                      marginTop: 28,
                      paddingTop: 18,
                      borderTop: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Diagnóstico multimedia (WhatsApp Web)</div>
                    <p style={{ margin: "0 0 12px", opacity: 0.82, fontSize: 13, lineHeight: 1.55 }}>
                      Comprueba si Chromium puede reproducir códecs típicos de vídeo/audio en la sesión de la cuenta
                      activa (misma ventana que WhatsApp Web). Funciona aunque estés en esta pantalla de ajustes.
                    </p>
                    <button
                      type="button"
                      disabled={mediaDiagBusy}
                      onClick={runMediaDiag}
                      style={{
                        borderRadius: 10,
                        padding: "10px 16px",
                        border: "1px solid rgba(33,192,99,0.45)",
                        background: mediaDiagBusy ? "rgba(255,255,255,0.04)" : "rgba(33,192,99,0.14)",
                        color: "#e8f8ef",
                        cursor: mediaDiagBusy ? "wait" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {mediaDiagBusy ? "Comprobando…" : "Comprobar códecs ahora"}
                    </button>
                    {mediaDiagText ? (
                      <pre
                        style={{
                          marginTop: 14,
                          padding: 12,
                          borderRadius: 10,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(0,0,0,0.35)",
                          color: "#dce8e8",
                          fontSize: 11,
                          lineHeight: 1.45,
                          overflow: "auto",
                          maxHeight: 280,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {mediaDiagText}
                      </pre>
                    ) : null}
                    <p style={{ margin: "12px 0 0", opacity: 0.65, fontSize: 12, lineHeight: 1.45 }}>
                      Si{" "}
                      <code style={{ color: "#b8e8cc" }}>decodingInfo_mp4_h264_aac.supported</code> es{" "}
                      <strong>false</strong> o MediaSource rechaza los MIME de MP4, audio/vídeo en WhatsApp pueden
                      fallar.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <style>{`
@keyframes fadeIn220ms {
  from { opacity: 0; }
  to { opacity: 1; }
}
        `}</style>
      </div>
    </div>
  );
}

