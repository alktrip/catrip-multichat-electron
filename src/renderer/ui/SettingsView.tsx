import React from "react";
import AccountAvatar from "./AccountAvatar";
import { Overlay } from "./Overlay";
import { useToasts } from "./Toasts";

export type SettingsPage = "general" | "accounts" | "notifications" | "network" | "performance";

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
    uiScale: number;
  };
  notifications: { enabled: boolean; showAccountName: boolean; showPreview: boolean };
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

type SidebarButtonProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

const SidebarButton = React.forwardRef<HTMLButtonElement, SidebarButtonProps>(
  function SidebarButton({ active, label, onClick }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="catrip-sidebar-btn"
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
          // Reservamos los 3 px del lado izquierdo siempre para que la
          // tipografía no salte 3 px al activarse: el indicador "viajero"
          // ocupa ese hueco con su animación.
          borderLeft: "3px solid transparent",
          opacity: active ? 0.95 : 1,
        }}
      >
        {label}
      </button>
    );
  },
);

export default function SettingsView({
  page,
  onPageChange,
  onBack,
}: {
  page: SettingsPage;
  onPageChange: (p: SettingsPage) => void;
  onBack: () => void;
}) {
  const setPage = onPageChange;
  const [fadeKey, setFadeKey] = React.useState(0);
  const [settings, setSettings] = React.useState<Settings | null>(null);
  // Indicador "viajero" del sidebar: su posición Y y altura se calculan
  // midiendo el botón activo en el DOM, así no dependemos de números
  // mágicos por item ni por padding del contenedor.
  const sidebarNavRef = React.useRef<HTMLDivElement>(null);
  const sidebarButtonRefs = React.useRef<Record<SettingsPage, HTMLButtonElement | null>>({
    general: null,
    accounts: null,
    notifications: null,
    network: null,
    performance: null,
  });
  const [travelerStyle, setTravelerStyle] = React.useState<{
    top: number;
    height: number;
    visible: boolean;
  }>({ top: 0, height: 0, visible: false });
  const [mediaDiagBusy, setMediaDiagBusy] = React.useState(false);
  const [mediaDiagText, setMediaDiagText] = React.useState<string | null>(null);
  const [cacheBusy, setCacheBusy] = React.useState(false);
  const [cacheMsg, setCacheMsg] = React.useState<string | null>(null);
  const [accounts, setAccounts] = React.useState<
    { id: string; label: string; icon: string; notificationsEnabled?: boolean }[]
  >([]);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editLabel, setEditLabel] = React.useState("");
  const [variantsById, setVariantsById] = React.useState<Record<string, string[]>>({});
  const [variantsOpenFor, setVariantsOpenFor] = React.useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [deletingInFlight, setDeletingInFlight] = React.useState(false);
  const toasts = useToasts();

  React.useEffect(() => {
    setFadeKey((x) => x + 1);
  }, [page]);

  // Mide la posición del botón activo y mueve el indicador "viajero".
  // useLayoutEffect garantiza que la medición sucede tras el commit del DOM,
  // así el `getBoundingClientRect` ve dimensiones definitivas.
  React.useLayoutEffect(() => {
    const btn = sidebarButtonRefs.current[page];
    const nav = sidebarNavRef.current;
    if (!btn || !nav) return;
    const btnRect = btn.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    // Centrado vertical del indicador en el botón, con margen de 6 px arriba
    // y abajo para que sea más corto que el item (estética "pill").
    const inset = 6;
    setTravelerStyle({
      top: btnRect.top - navRect.top + inset,
      height: Math.max(8, btnRect.height - inset * 2),
      visible: true,
    });
  }, [page]);

  React.useEffect(() => {
    let mounted = true;
    window.catrip
      .getSettings()
      .then((s) => mounted && setSettings(s as Settings))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    void window.catrip
      .listAccounts()
      .then((a) => mounted && setAccounts(a))
      .catch(() => {});
    const off = window.catrip.onAccountsListChanged((a) => setAccounts(a));
    return () => {
      off();
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
            [r.message, r.url ? `URL: ${r.url}` : "", `(código: ${r.code})`]
              .filter(Boolean)
              .join("\n"),
          );
        }
      })
      .catch(() => setMediaDiagBusy(false));
  };

  const clearCacheAll = () => {
    setCacheBusy(true);
    setCacheMsg(null);
    void window.catrip
      .clearHttpCacheAllAccounts()
      .then((ok) => {
        setCacheBusy(false);
        if (ok) {
          setCacheMsg("Caché HTTP limpiada.");
          toasts.success(
            `Caché HTTP limpiada (${accounts.length} cuenta${accounts.length === 1 ? "" : "s"}).`,
          );
        } else {
          setCacheMsg("No se pudo limpiar la caché.");
          toasts.error("No se pudo limpiar la caché.");
        }
      })
      .catch(() => {
        setCacheBusy(false);
        setCacheMsg("No se pudo limpiar la caché.");
        toasts.error("No se pudo limpiar la caché.");
      });
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
        <div ref={sidebarNavRef} style={{ padding: 10, position: "relative" }}>
          <button
            type="button"
            className="catrip-sidebar-btn"
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
          <div className="catrip-gradient-divider" style={{ margin: "6px 0 10px" }} />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.general = el;
            }}
            active={page === "general"}
            label="General"
            onClick={() => setPage("general")}
          />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.accounts = el;
            }}
            active={page === "accounts"}
            label="Cuentas"
            onClick={() => setPage("accounts")}
          />
          <div style={{ fontSize: 12, opacity: 0.7, padding: "14px 15px 6px" }}>HERRAMIENTAS</div>
          <div className="catrip-gradient-divider" style={{ margin: "6px 0 10px" }} />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.notifications = el;
            }}
            active={page === "notifications"}
            label="Notificaciones"
            onClick={() => setPage("notifications")}
          />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.performance = el;
            }}
            active={page === "performance"}
            label="Rendimiento"
            onClick={() => setPage("performance")}
          />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.network = el;
            }}
            active={page === "network"}
            label="Red"
            onClick={() => setPage("network")}
          />
          <div
            className={`catrip-settings-traveler${travelerStyle.visible ? " is-visible" : ""}`}
            style={{
              top: travelerStyle.top,
              height: travelerStyle.height,
            }}
            aria-hidden
          />
        </div>

        <div style={{ marginTop: "auto", padding: 10 }}>
          <button
            type="button"
            className="catrip-sidebar-btn"
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
                  : page === "accounts"
                    ? "Cuentas"
                    : page === "notifications"
                      ? "Notificaciones"
                      : page === "network"
                        ? "Red"
                        : "Rendimiento (experimental)"}
              </div>
              {!settings ? (
                <div style={{ opacity: 0.8 }}>Cargando…</div>
              ) : page === "accounts" ? (
                <div style={{ opacity: 0.92 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="catrip-btn catrip-btn-accent"
                      onClick={() => {
                        void window.catrip.createAccountV2({}).then((acc) => {
                          setEditId(acc.id);
                          setEditLabel(acc.label);
                        });
                      }}
                      style={{
                        borderRadius: 10,
                        padding: "10px 12px",
                        border: "1px solid rgba(33,192,99,0.45)",
                        background: "rgba(33,192,99,0.14)",
                        color: "#e8f8ef",
                        cursor: "pointer",
                        fontWeight: 650,
                      }}
                    >
                      Nueva cuenta
                    </button>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>
                      Renombra y selecciona un ícono por cuenta. El rail usa estos mismos datos.
                    </div>
                  </div>

                  <div className="catrip-gradient-divider" style={{ margin: "14px 0" }} />

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                      gap: 10,
                      alignItems: "start",
                    }}
                  >
                    {accounts.map((a) => {
                      const editing = editId === a.id;
                      const variants = variantsById[a.id] || [];
                      return (
                        <div
                          key={a.id}
                          className="catrip-panel-elevation"
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "center",
                            flexWrap: "wrap",
                            padding: 10,
                            borderRadius: 12,
                            border: "1px solid rgba(255,255,255,0.10)",
                            background: "rgba(255,255,255,0.03)",
                          }}
                        >
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              overflow: "hidden",
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.10)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <AccountAvatar icon={a.icon} labelFallback={a.label} size={44} />
                          </div>

                          <div style={{ flex: "1 1 320px", minWidth: 240 }}>
                            {editing ? (
                              <input
                                type="text"
                                aria-label="Nombre de la cuenta"
                                autoFocus
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                style={{
                                  width: "100%",
                                  borderRadius: 10,
                                  padding: "10px 12px",
                                  border: "1px solid rgba(255,255,255,0.14)",
                                  background: "rgba(255,255,255,0.06)",
                                  color: "inherit",
                                  outline: "none",
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  fontWeight: 750,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {a.label}
                              </div>
                            )}
                            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>{a.id}</div>
                            <label
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                marginTop: 8,
                                fontSize: 12,
                                opacity: 0.9,
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={a.notificationsEnabled !== false}
                                onChange={(e) =>
                                  void window.catrip.setAccountNotificationsEnabled(
                                    a.id,
                                    e.target.checked,
                                  )
                                }
                              />
                              Notificaciones para esta cuenta
                            </label>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                              justifyContent: "flex-end",
                              flex: "0 0 auto",
                              marginLeft: "auto",
                            }}
                          >
                            {editing ? (
                              <>
                                <button
                                  type="button"
                                  className="catrip-btn catrip-btn-accent"
                                  onClick={() => {
                                    const original = a.label;
                                    const next = editLabel.trim();
                                    void window.catrip
                                      .renameAccount(a.id, editLabel)
                                      .then((res) => {
                                        setEditId(null);
                                        setEditLabel("");
                                        if (res && next && next !== original) {
                                          toasts.success(
                                            `Cuenta «${original}» renombrada a «${res.label}».`,
                                          );
                                        }
                                      });
                                  }}
                                  style={{
                                    borderRadius: 10,
                                    padding: "10px 12px",
                                    border: "1px solid rgba(33,192,99,0.45)",
                                    background: "rgba(33,192,99,0.14)",
                                    color: "#e8f8ef",
                                    cursor: "pointer",
                                    fontWeight: 650,
                                  }}
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  className="catrip-btn"
                                  onClick={() => {
                                    setEditId(null);
                                    setEditLabel("");
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
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="catrip-btn"
                                onClick={() => {
                                  setEditId(a.id);
                                  setEditLabel(a.label);
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
                                Renombrar
                              </button>
                            )}

                            <button
                              type="button"
                              className="catrip-btn"
                              onClick={() => {
                                if (variantsOpenFor === a.id) {
                                  setVariantsOpenFor(null);
                                  return;
                                }
                                void window.catrip.getAccountIconVariants(a.id).then((v) => {
                                  if (!v) return;
                                  setVariantsById((prev) => ({ ...prev, [a.id]: v }));
                                  setVariantsOpenFor(a.id);
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
                              Elegir ícono
                            </button>
                            <button
                              type="button"
                              className="catrip-btn"
                              onClick={() => void window.catrip.regenerateAccountIcon(a.id)}
                              style={{
                                borderRadius: 10,
                                padding: "10px 12px",
                                border: "1px solid rgba(255,255,255,0.14)",
                                background: "rgba(255,255,255,0.04)",
                                color: "inherit",
                                cursor: "pointer",
                              }}
                              title="Volver al ícono generado (variante)"
                            >
                              Variante
                            </button>
                            <button
                              type="button"
                              className="catrip-btn"
                              onClick={() => setConfirmDeleteId(a.id)}
                              style={{
                                borderRadius: 10,
                                padding: "10px 12px",
                                border: "1px solid rgba(220, 38, 38, 0.45)",
                                background: "rgba(220, 38, 38, 0.10)",
                                color: "#fecaca",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                              title="Eliminar esta cuenta y todos sus datos"
                            >
                              Eliminar
                            </button>
                          </div>

                          {variantsOpenFor === a.id && variants.length ? (
                            <div
                              style={{
                                width: "100%",
                                marginTop: 8,
                                paddingTop: 10,
                                borderTop: "1px solid rgba(255,255,255,0.10)",
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              {variants.map((svg, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="catrip-btn"
                                  onClick={() =>
                                    void window.catrip.setAccountIconVariant(a.id, idx)
                                  }
                                  style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 12,
                                    border:
                                      a.icon === svg
                                        ? "1px solid rgba(33,192,99,0.75)"
                                        : "1px solid rgba(255,255,255,0.12)",
                                    background:
                                      a.icon === svg
                                        ? "rgba(33,192,99,0.12)"
                                        : "rgba(255,255,255,0.04)",
                                    cursor: "pointer",
                                    padding: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                  }}
                                  title={`Variante ${idx + 1}`}
                                >
                                  <AccountAvatar icon={svg} labelFallback={a.label} size={44} />
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : page === "general" ? (
                <div style={{ opacity: 0.92 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>Escala</div>
                  <select
                    value={String(settings.general.uiScale ?? 1)}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (!Number.isFinite(n)) return;
                      update({
                        ...settings,
                        general: { ...settings.general, uiScale: Math.max(0.75, Math.min(2, n)) },
                      });
                    }}
                    style={{
                      borderRadius: 10,
                      padding: "10px 12px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.06)",
                      color: "inherit",
                      outline: "none",
                      minWidth: 220,
                      marginBottom: 8,
                    }}
                  >
                    <option value="1">100%</option>
                    <option value="1.1">110%</option>
                    <option value="1.25">125%</option>
                    <option value="1.5">150%</option>
                    <option value="1.75">175%</option>
                    <option value="2">200%</option>
                  </select>
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 10 }}>
                    Afecta la UI y WhatsApp Web. Se aplica al instante.
                  </div>
                  <ToggleRow
                    label="Iniciar minimizada"
                    checked={settings.general.startMinimized}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, startMinimized: v } })
                    }
                  />
                  <ToggleRow
                    label="Mostrar barra lateral"
                    checked={settings.general.showSidebar}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, showSidebar: v } })
                    }
                  />
                  <ToggleRow
                    label="Mostrar barra de menú"
                    checked={settings.general.showMenuBar}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, showMenuBar: v } })
                    }
                  />
                  <ToggleRow
                    label="Al cerrar, minimizar a la bandeja (tray)"
                    checked={settings.general.closeToTray}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, closeToTray: v } })
                    }
                  />
                  <ToggleRow
                    label="Iniciar automáticamente con el sistema"
                    checked={settings.general.autoStart}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, autoStart: v } })
                    }
                  />
                  <div className="catrip-gradient-divider" style={{ margin: "10px 0" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>
                    Descargas
                  </div>
                  <ToggleRow
                    label="Preguntar siempre “Guardar como…”"
                    checked={settings.general.downloadsAskSaveAs}
                    onChange={(v) =>
                      update({
                        ...settings,
                        general: { ...settings.general, downloadsAskSaveAs: v },
                      })
                    }
                  />
                  <div style={{ padding: "6px 0 10px", opacity: 0.92 }}>
                    <div style={{ fontSize: 13, marginBottom: 6 }}>Carpeta de descargas</div>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
                    >
                      <input
                        value={settings.general.downloadsDirectory || ""}
                        placeholder="(usar la carpeta del sistema)"
                        onChange={(e) =>
                          update({
                            ...settings,
                            general: {
                              ...settings.general,
                              downloadsDirectory: e.target.value || null,
                            },
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
                        type="button"
                        className="catrip-btn"
                        onClick={() => {
                          void window.catrip.selectDownloadsDirectory().then((p) => {
                            if (!p) return;
                            update({
                              ...settings,
                              general: { ...settings.general, downloadsDirectory: p },
                            });
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
                        type="button"
                        className="catrip-btn"
                        onClick={() =>
                          update({
                            ...settings,
                            general: { ...settings.general, downloadsDirectory: null },
                          })
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
                      WhatsApp Web controla el nombre del archivo. Si un archivo existe, se generará
                      un nombre alternativo.
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
                    onChange={(v) =>
                      update({ ...settings, network: { ...settings.network, proxyEnabled: v } })
                    }
                  />
                  <div style={{ marginTop: 10, opacity: 0.85 }}>Reglas del proxy</div>
                  <input
                    value={settings.network.proxyRules}
                    onChange={(e) =>
                      update({
                        ...settings,
                        network: { ...settings.network, proxyRules: e.target.value },
                      })
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
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, enabled: v },
                      })
                    }
                  />
                  <ToggleRow
                    label="Mostrar nombre de la cuenta"
                    checked={!!settings.notifications.showAccountName}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, showAccountName: v },
                      })
                    }
                  />
                  <ToggleRow
                    label="Mostrar detalle (preview)"
                    checked={!!settings.notifications.showPreview}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, showPreview: v },
                      })
                    }
                  />
                  <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
                    Actualmente las notificaciones nativas se basan en el contador de no leídos.
                  </div>
                </div>
              ) : (
                <div style={{ opacity: 0.92 }}>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>
                    Límite de procesos del renderer
                  </div>
                  <select
                    value={String(settings.performance.rendererProcessLimit)}
                    onChange={(e) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          rendererProcessLimit: Number(e.target.value),
                        },
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
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Almacenamiento</div>
                    <p
                      style={{ margin: "0 0 12px", opacity: 0.82, fontSize: 13, lineHeight: 1.55 }}
                    >
                      Limpia la caché HTTP de todas las cuentas (reduce espacio; normalmente
                      mantiene la sesión).
                    </p>
                    <button
                      type="button"
                      className="catrip-btn"
                      disabled={cacheBusy}
                      onClick={clearCacheAll}
                      style={{
                        borderRadius: 10,
                        padding: "10px 16px",
                        border: "1px solid rgba(255,255,255,0.14)",
                        background: cacheBusy ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.04)",
                        color: "inherit",
                        cursor: cacheBusy ? "wait" : "pointer",
                        fontWeight: 600,
                        marginRight: 10,
                      }}
                    >
                      {cacheBusy ? "Limpiando…" : "Limpiar caché HTTP (todas las cuentas)"}
                    </button>
                    {cacheMsg ? (
                      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>{cacheMsg}</div>
                    ) : null}

                    <div className="catrip-gradient-divider" style={{ margin: "18px 0" }} />
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>
                      Diagnóstico multimedia (WhatsApp Web)
                    </div>
                    <p
                      style={{ margin: "0 0 12px", opacity: 0.82, fontSize: 13, lineHeight: 1.55 }}
                    >
                      Comprueba si Chromium puede reproducir códecs típicos de vídeo/audio en la
                      sesión de la cuenta activa (misma ventana que WhatsApp Web). Funciona aunque
                      estés en esta pantalla de ajustes.
                    </p>
                    <button
                      type="button"
                      className="catrip-btn catrip-btn-accent"
                      disabled={mediaDiagBusy}
                      onClick={runMediaDiag}
                      style={{
                        borderRadius: 10,
                        padding: "10px 16px",
                        border: "1px solid rgba(33,192,99,0.45)",
                        background: mediaDiagBusy
                          ? "rgba(255,255,255,0.04)"
                          : "rgba(33,192,99,0.14)",
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
                    <p
                      style={{ margin: "12px 0 0", opacity: 0.65, fontSize: 12, lineHeight: 1.45 }}
                    >
                      Si{" "}
                      <code style={{ color: "#b8e8cc" }}>decodingInfo_mp4_h264_aac.supported</code>{" "}
                      es <strong>false</strong> o MediaSource rechaza los MIME de MP4, audio/vídeo
                      en WhatsApp pueden fallar.
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
      <Overlay
        open={confirmDeleteId !== null}
        onClose={() => {
          if (deletingInFlight) return;
          setConfirmDeleteId(null);
        }}
      >
        <div style={{ padding: "22px 22px 22px" }}>
          {(() => {
            const target = accounts.find((a) => a.id === confirmDeleteId);
            const label = target?.label ?? "esta cuenta";
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  {target ? (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        overflow: "hidden",
                        flexShrink: 0,
                        boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.10)",
                      }}
                    >
                      <AccountAvatar icon={target.icon} labelFallback={target.label} size={44} />
                    </div>
                  ) : null}
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      color: "#ffffff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.25,
                    }}
                  >
                    ¿Eliminar la cuenta «{label}»?
                  </div>
                </div>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "#dce4e4",
                  }}
                >
                  Se borrará permanentemente <strong>toda su sesión</strong> de WhatsApp Web
                  (cookies, almacenamiento local, IndexedDB, Service Workers y caché HTTP). Esta
                  acción no se puede deshacer.
                </p>
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "#9aa6a6",
                  }}
                >
                  Si solo quieres dejar de recibir notificaciones, puedes desactivarlas desde la
                  tarjeta sin perder la sesión.
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="catrip-btn"
                    disabled={deletingInFlight}
                    onClick={() => setConfirmDeleteId(null)}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      border: "1px solid rgba(255,255,255,0.14)",
                      background: "rgba(255,255,255,0.04)",
                      color: "inherit",
                      cursor: deletingInFlight ? "default" : "pointer",
                      opacity: deletingInFlight ? 0.6 : 1,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="catrip-btn"
                    disabled={deletingInFlight || !confirmDeleteId}
                    onClick={async () => {
                      if (!confirmDeleteId) return;
                      const target = accounts.find((acc) => acc.id === confirmDeleteId);
                      const targetLabel = target?.label ?? "la cuenta";
                      setDeletingInFlight(true);
                      try {
                        const ok = await window.catrip.deleteAccount(confirmDeleteId);
                        if (ok) {
                          toasts.success(`Cuenta «${targetLabel}» eliminada.`);
                        } else {
                          console.warn("[catrip] deleteAccount returned false", {
                            id: confirmDeleteId,
                          });
                          toasts.error(`No se pudo eliminar «${targetLabel}».`);
                        }
                      } catch (err) {
                        console.error("[catrip] deleteAccount failed", err);
                        toasts.error(`Error al eliminar «${targetLabel}». Revisa la consola.`);
                      } finally {
                        setDeletingInFlight(false);
                        setConfirmDeleteId(null);
                      }
                    }}
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      border: "1px solid rgba(220, 38, 38, 0.6)",
                      background: "rgba(220, 38, 38, 0.18)",
                      color: "#fecaca",
                      cursor: deletingInFlight ? "wait" : "pointer",
                      fontWeight: 700,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {deletingInFlight ? "Eliminando…" : "Eliminar definitivamente"}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      </Overlay>
    </div>
  );
}
