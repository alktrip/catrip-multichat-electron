import React from "react";
import AccountAvatar from "./AccountAvatar";
import { Overlay } from "./Overlay";
import { ToggleRow } from "./primitives";
import { useToasts } from "./Toasts";

export type SettingsPage = "general" | "accounts" | "notifications" | "network" | "performance";

type Settings = {
  version: 1;
  performance: {
    rendererProcessLimit: number;
    gpuBoost: boolean;
    inhibitSleepDuringCall: boolean;
  };
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
    dockUnreadBadge: boolean;
    trayBadgeManual: number | null;
    uiScale: number;
    incomingLinkMode: "auto" | "active" | "fixed";
    incomingLinkFixedAccountId: string | null;
    checkForUpdates: boolean;
    updateChannel: "stable" | "beta";
    openDownloadsWithDefaultApp: boolean;
  };
  notifications: {
    enabled: boolean;
    showAccountName: boolean;
    showPreview: boolean;
    doNotDisturb: boolean;
    playSound: boolean;
  };
};

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
          color: active ? "var(--catrip-accent)" : "#E1E1E1",
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
                        border: "1px solid var(--catrip-accent-border)",
                        background: "var(--catrip-accent-soft)",
                        color: "#e8f8ef",
                        cursor: "pointer",
                        fontWeight: 650,
                      }}
                    >
                      Nueva cuenta
                    </button>
                    <div className="catrip-text-hint">
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
                                className="catrip-field"
                                aria-label="Nombre de la cuenta"
                                autoFocus
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                style={{ width: "100%" }}
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
                            <details className="catrip-settings-id">
                              <summary>Identificador interno</summary>
                              {a.id}
                            </details>
                            <div style={{ marginTop: 4 }}>
                              <ToggleRow
                                label="Notificaciones para esta cuenta"
                                checked={a.notificationsEnabled !== false}
                                onChange={(v) =>
                                  void window.catrip.setAccountNotificationsEnabled(a.id, v)
                                }
                              />
                            </div>
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
                                    border: "1px solid var(--catrip-accent-border)",
                                    background: "var(--catrip-accent-soft)",
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
                                        ? "1px solid var(--catrip-accent-border-strong)"
                                        : "1px solid rgba(255,255,255,0.12)",
                                    background:
                                      a.icon === svg
                                        ? "var(--catrip-accent-soft)"
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
                    className="catrip-select"
                    value={String(settings.general.uiScale ?? 1)}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (!Number.isFinite(n)) return;
                      update({
                        ...settings,
                        general: { ...settings.general, uiScale: Math.max(0.75, Math.min(2, n)) },
                      });
                    }}
                    style={{ minWidth: 220, marginBottom: 8 }}
                  >
                    <option value="1">100%</option>
                    <option value="1.1">110%</option>
                    <option value="1.25">125%</option>
                    <option value="1.5">150%</option>
                    <option value="1.75">175%</option>
                    <option value="2">200%</option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginBottom: 10 }}>
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
                    Enlaces WhatsApp entrantes
                  </div>
                  <div className="catrip-text-hint" style={{ marginBottom: 8 }}>
                    Al abrir <code style={{ fontSize: 11 }}>whatsapp://</code> o{" "}
                    <code style={{ fontSize: 11 }}>wa.me</code> desde el sistema.
                  </div>
                  <select
                    className="catrip-select"
                    value={settings.general.incomingLinkMode ?? "auto"}
                    onChange={(e) => {
                      const mode = e.target.value as "auto" | "active" | "fixed";
                      update({
                        ...settings,
                        general: {
                          ...settings.general,
                          incomingLinkMode: mode,
                          incomingLinkFixedAccountId:
                            mode === "fixed"
                              ? settings.general.incomingLinkFixedAccountId ||
                                accounts[0]?.id ||
                                null
                              : settings.general.incomingLinkFixedAccountId,
                        },
                      });
                    }}
                    style={{ minWidth: 280, marginBottom: 8 }}
                  >
                    <option value="auto">Preguntar si hay varias cuentas</option>
                    <option value="active">Siempre la cuenta activa</option>
                    <option value="fixed">Cuenta fija</option>
                  </select>
                  {(settings.general.incomingLinkMode ?? "auto") === "fixed" ? (
                    <select
                      className="catrip-select"
                      value={settings.general.incomingLinkFixedAccountId || ""}
                      onChange={(e) =>
                        update({
                          ...settings,
                          general: {
                            ...settings.general,
                            incomingLinkFixedAccountId: e.target.value || null,
                          },
                        })
                      }
                      style={{ minWidth: 280, marginBottom: 8 }}
                    >
                      {accounts.length === 0 ? (
                        <option value="">(sin cuentas)</option>
                      ) : (
                        accounts.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label}
                          </option>
                        ))
                      )}
                    </select>
                  ) : null}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                    <button
                      type="button"
                      className="catrip-btn"
                      onClick={() => {
                        void window.catrip.registerWhatsAppProtocol().then((r) => {
                          if (r.ok) toasts.success(r.message);
                          else toasts.error(r.message, { duration: 6000 });
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
                      Registrar como app predeterminada (whatsapp://)
                    </button>
                  </div>
                  <div
                    className="catrip-text-hint"
                    style={{ marginBottom: 10, lineHeight: 1.5 }}
                  >
                    <strong>whatsapp://</strong> — Tras registrar, el sistema puede abrir enlaces
                    compatibles directamente en Catrip.
                    <br />
                    <strong>https://wa.me en el navegador</strong> — En Wayland/Linux el navegador
                    no delega HTTPS a apps arbitrarias. Opciones reales:
                    <ol style={{ margin: "8px 0 0 18px", padding: 0 }}>
                      <li>
                        Usar enlaces que redirijan a <code style={{ fontSize: 11 }}>whatsapp://</code>{" "}
                        (p. ej. desde otra app o marcador).
                      </li>
                      <li>
                        En el navegador: menú del enlace → <em>Abrir con…</em> → Catrip Connect (si
                        aparece tras registrar).
                      </li>
                      <li>
                        Extensión del navegador que envíe <code style={{ fontSize: 11 }}>wa.me</code> al
                        protocolo (no incluida en Catrip).
                      </li>
                      <li>
                        Dentro de la app: <kbd>Ctrl+M</kbd> (chat por número) o pegar el enlace si
                        el sistema lo entrega a Catrip.
                      </li>
                    </ol>
                    También puedes ejecutar en terminal:{" "}
                    <code style={{ fontSize: 11 }}>npm run register:whatsapp</code>
                  </div>
                  <ToggleRow
                    label="Buscar actualizaciones al iniciar (GitHub Releases)"
                    checked={settings.general.checkForUpdates !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        general: { ...settings.general, checkForUpdates: v },
                      })
                    }
                  />
                  {settings.general.checkForUpdates !== false ? (
                    <div style={{ padding: "6px 0 10px", opacity: 0.92 }}>
                      <div style={{ fontSize: 13, marginBottom: 6 }}>Canal de actualización</div>
                      <select
                        className="catrip-select"
                        value={settings.general.updateChannel === "beta" ? "beta" : "stable"}
                        onChange={(e) =>
                          update({
                            ...settings,
                            general: {
                              ...settings.general,
                              updateChannel: e.target.value === "beta" ? "beta" : "stable",
                            },
                          })
                        }
                        style={{ minWidth: 280 }}
                      >
                        <option value="stable">Estable (releases)</option>
                        <option value="beta">Beta (pre-releases)</option>
                      </select>
                      <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                        El diálogo de actualización incluye un resumen del changelog de GitHub y
                        verifica SHA-512 del .deb cuando está publicado.
                      </div>
                    </div>
                  ) : null}
                  <div className="catrip-gradient-divider" style={{ margin: "10px 0" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>
                    Descargas
                  </div>
                  <ToggleRow
                    label="Abrir archivos descargados con la app predeterminada"
                    checked={settings.general.openDownloadsWithDefaultApp !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        general: { ...settings.general, openDownloadsWithDefaultApp: v },
                      })
                    }
                  />
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
                        className="catrip-field"
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
                        style={{ flex: "1 1 360px" }}
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
                    <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                      WhatsApp Web controla el nombre del archivo. Si un archivo existe, se generará
                      un nombre alternativo.
                    </div>
                  </div>
                  <ToggleRow
                    label="Badge del tray según WhatsApp Web (no leídos)"
                    checked={settings.general.trayUnreadBadge}
                    onChange={(v) =>
                      update({
                        ...settings,
                        general: {
                          ...settings.general,
                          trayUnreadBadge: v,
                          dockUnreadBadge: v ? settings.general.dockUnreadBadge : false,
                        },
                      })
                    }
                  />
                  <ToggleRow
                    label="Badge en el icono del dock / lanzador (Linux)"
                    checked={settings.general.dockUnreadBadge !== false}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, dockUnreadBadge: v } })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginBottom: 8 }}>
                    Suma no leídos de todas las cuentas. Requiere soporte del entorno (GNOME/KDE).
                  </div>
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
                      className="catrip-field catrip-field--narrow"
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
                    className="catrip-field"
                    value={settings.network.proxyRules}
                    onChange={(e) =>
                      update({
                        ...settings,
                        network: { ...settings.network, proxyRules: e.target.value },
                      })
                    }
                    placeholder='Ej: "http=127.0.0.1:8080;https=127.0.0.1:8080"'
                    style={{ width: "100%", marginTop: 6 }}
                  />
                  <div className="catrip-text-hint" style={{ marginTop: 8 }}>
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
                  <ToggleRow
                    label="No molestar (sin avisos nativos)"
                    checked={!!settings.notifications.doNotDisturb}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, doNotDisturb: v },
                      })
                    }
                  />
                  <ToggleRow
                    label="Sonido del sistema en notificaciones"
                    checked={settings.notifications.playSound !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, playSound: v },
                      })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                    Aviso cuando suben los no leídos en cualquier cuenta (con límite por cuenta). Al
                    pulsar la notificación se enfoca la ventana y se activa esa cuenta.
                  </div>
                </div>
              ) : (
                <div style={{ opacity: 0.92 }}>
                  <div className="catrip-text-hint" style={{ marginBottom: 14 }}>
                    Catrip Connect usa la GPU de Chromium para dibujar la ventana, el rail y cada
                    cuenta de WhatsApp Web. En Linux la ventana va <strong>opaca</strong> por
                    defecto (mejor composición). Solo desactiva la GPU si ves pantalla negra:{" "}
                    <code style={{ fontSize: 11 }}>CATRIP_DISABLE_GPU=1</code>.
                  </div>
                  <ToggleRow
                    label="Refuerzo GPU al arrancar (experimental)"
                    checked={!!settings.performance.gpuBoost}
                    onChange={(v) =>
                      update({
                        ...settings,
                        performance: { ...settings.performance, gpuBoost: v },
                      })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginBottom: 12 }}>
                    Activa rasterización reforzada, zero-copy y VA-API ampliado en Linux. Reinicia
                    la app tras cambiar esta opción o el límite de procesos.
                  </div>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>
                    Límite de procesos del renderer
                  </div>
                  <select
                    className="catrip-select"
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
                  >
                    <option value="0">Predeterminado</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 16 }}>
                    Más procesos pueden ayudar con varias cuentas abiertas a la vez; consume más RAM.
                    Valor 0 = política por defecto de Electron.
                  </div>
                  <ToggleRow
                    label="Evitar suspensión durante videollamada"
                    checked={settings.performance.inhibitSleepDuringCall !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          inhibitSleepDuringCall: v,
                        },
                      })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginBottom: 16 }}>
                    Usa el bloqueo de energía de Electron (equivalente a portal/systemd-inhibit en
                    Linux) mientras WhatsApp Web detecta una llamada activa.
                  </div>

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
                      <div className="catrip-text-hint" style={{ marginTop: 10 }}>
                        {cacheMsg}
                      </div>
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
                        border: "1px solid var(--catrip-accent-border)",
                        background: mediaDiagBusy
                          ? "rgba(255,255,255,0.04)"
                          : "var(--catrip-accent-soft)",
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
                      className="catrip-text-hint"
                      style={{ margin: "12px 0 0", lineHeight: 1.45 }}
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
                    color: "var(--catrip-text-hint)",
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
