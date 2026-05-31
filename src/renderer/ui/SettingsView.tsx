import React from "react";
import { useTranslation } from "react-i18next";
import AccountAvatar from "./AccountAvatar";
import { Overlay } from "./Overlay";
import { ToggleRow } from "./primitives";
import { useToasts } from "./Toasts";
import type { LanguageSetting } from "../../shared/i18n/types";
import { LANGUAGE_SETTING_OPTIONS } from "../../shared/i18n/localeMeta";
import { changeRendererLanguage } from "../i18n";

export type SettingsPage = "general" | "accounts" | "notifications" | "network" | "performance";

type Settings = {
  version: 1;
  performance: {
    rendererProcessLimit: number;
    gpuBoost: boolean;
    chromiumProfile: "default" | "conservative" | "aggressive";
    ozonePlatform: "auto" | "wayland" | "x11";
    inhibitSleepDuringCall: boolean;
    suspendInactiveAccounts: boolean;
    suspendAfterMinutes: number;
    maxLiveAccounts: number;
    prewarmOnHover: boolean;
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
    language: LanguageSetting;
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
  const { t } = useTranslation();
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
  const [perfDiagBusy, setPerfDiagBusy] = React.useState(false);
  const [perfDiagText, setPerfDiagText] = React.useState<string | null>(null);
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
  const [whatsappLangNoticeOpen, setWhatsappLangNoticeOpen] = React.useState(false);
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
    const prevLang = settings?.general?.language;
    setSettings(next);
    void window.catrip.setSettings(next);
    if (next.general.language !== prevLang) {
      void (async () => {
        await changeRendererLanguage(next.general.language, navigator.language);
        setWhatsappLangNoticeOpen(true);
      })();
    }
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

  const runPerfDiag = () => {
    setPerfDiagBusy(true);
    setPerfDiagText(null);
    void window.catrip
      .runPerformanceDiagnostics()
      .then((r) => {
        setPerfDiagBusy(false);
        if (r.ok) {
          setPerfDiagText(JSON.stringify(r.data, null, 2));
        } else {
          setPerfDiagText([r.message, `(código: ${r.code})`].filter(Boolean).join("\n"));
        }
      })
      .catch(() => setPerfDiagBusy(false));
  };

  const clearCacheAll = () => {
    setCacheBusy(true);
    setCacheMsg(null);
    void window.catrip
      .clearHttpCacheAllAccounts()
      .then((ok) => {
        setCacheBusy(false);
        if (ok) {
          setCacheMsg(t("settings.performance.cacheCleared"));
          toasts.success(t("settings.performance.cacheCleared"));
        } else {
          setCacheMsg(t("settings.performance.cacheFailed"));
          toasts.error(t("settings.performance.cacheFailed"));
        }
      })
      .catch(() => {
        setCacheBusy(false);
        setCacheMsg(t("settings.performance.cacheFailed"));
        toasts.error(t("settings.performance.cacheFailed"));
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
            {t("common.back")}
          </button>
          <div style={{ fontSize: 12, opacity: 0.7, padding: "0 15px 10px" }}>
            {t("settings.title")}
          </div>
          <div className="catrip-gradient-divider" style={{ margin: "6px 0 10px" }} />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.general = el;
            }}
            active={page === "general"}
            label={t("settings.pages.general")}
            onClick={() => setPage("general")}
          />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.accounts = el;
            }}
            active={page === "accounts"}
            label={t("settings.pages.accounts")}
            onClick={() => setPage("accounts")}
          />
          <div style={{ fontSize: 12, opacity: 0.7, padding: "14px 15px 6px" }}>
            {t("settings.tools")}
          </div>
          <div className="catrip-gradient-divider" style={{ margin: "6px 0 10px" }} />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.notifications = el;
            }}
            active={page === "notifications"}
            label={t("settings.pages.notifications")}
            onClick={() => setPage("notifications")}
          />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.performance = el;
            }}
            active={page === "performance"}
            label={t("settings.pages.performance")}
            onClick={() => setPage("performance")}
          />
          <SidebarButton
            ref={(el) => {
              sidebarButtonRefs.current.network = el;
            }}
            active={page === "network"}
            label={t("settings.pages.network")}
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
            {t("common.exit")}
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
                {t(`settings.pages.${page}`)}
              </div>
              {!settings ? (
                <div style={{ opacity: 0.8 }}>{t("common.loading")}</div>
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
                      {t("settings.accounts.newAccount")}
                    </button>
                    <div className="catrip-text-hint">{t("settings.accounts.hint")}</div>
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
                                aria-label={t("settings.accounts.accountName")}
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
                              <summary>{t("settings.accounts.internalId")}</summary>
                              {a.id}
                            </details>
                            <div style={{ marginTop: 4 }}>
                              <ToggleRow
                                label={t("settings.accounts.notifications")}
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
                                            t("settings.accounts.renamed", {
                                              from: original,
                                              to: res.label,
                                            }),
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
                                  {t("common.save")}
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
                                  {t("common.cancel")}
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
                                {t("common.rename")}
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
                              {t("settings.accounts.chooseIcon")}
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
                              title={t("settings.accounts.regenerateIconTitle")}
                            >
                              {t("settings.accounts.regenerateIcon")}
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
                              title={t("settings.accounts.deleteTitle")}
                            >
                              {t("common.delete")}
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
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>
                    {t("settings.language.label")}
                  </div>
                  <select
                    className="catrip-select"
                    value={settings.general.language ?? "system"}
                    onChange={(e) =>
                      update({
                        ...settings,
                        general: {
                          ...settings.general,
                          language: e.target.value as LanguageSetting,
                        },
                      })
                    }
                    style={{ minWidth: 280, marginBottom: 8 }}
                  >
                    {LANGUAGE_SETTING_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.useI18n ? t(opt.label) : opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="catrip-text-hint" style={{ marginBottom: 14 }}>
                    {t("settings.language.hint")}
                  </div>
                  <div className="catrip-gradient-divider" style={{ margin: "10px 0" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>
                    {t("settings.scale.title")}
                  </div>
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
                    {t("settings.scale.hint")}
                  </div>
                  <ToggleRow
                    label={t("settings.general.startMinimized")}
                    checked={settings.general.startMinimized}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, startMinimized: v } })
                    }
                  />
                  <ToggleRow
                    label={t("settings.general.showSidebar")}
                    checked={settings.general.showSidebar}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, showSidebar: v } })
                    }
                  />
                  <ToggleRow
                    label={t("settings.general.showMenuBar")}
                    checked={settings.general.showMenuBar}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, showMenuBar: v } })
                    }
                  />
                  <ToggleRow
                    label={t("settings.general.closeToTray")}
                    checked={settings.general.closeToTray}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, closeToTray: v } })
                    }
                  />
                  <ToggleRow
                    label={t("settings.general.autoStart")}
                    checked={settings.general.autoStart}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, autoStart: v } })
                    }
                  />
                  <div className="catrip-gradient-divider" style={{ margin: "10px 0" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>
                    {t("settings.general.incomingLinks")}
                  </div>
                  <div className="catrip-text-hint" style={{ marginBottom: 8 }}>
                    {t("settings.general.incomingLinksHint")}
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
                    <option value="auto">{t("settings.general.incomingLinkAuto")}</option>
                    <option value="active">{t("settings.general.incomingLinkActive")}</option>
                    <option value="fixed">{t("settings.general.incomingLinkFixed")}</option>
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
                        <option value="">{t("common.noAccounts")}</option>
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
                      {t("settings.general.registerProtocol")}
                    </button>
                  </div>
                  <div className="catrip-text-hint" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                    {t("settings.general.registerProtocolHint")}
                    <br />
                    <strong>{t("settings.general.waylandBrowserTitle")}</strong> —{" "}
                    {t("settings.general.waylandBrowserIntro")}
                    <ol style={{ margin: "8px 0 0 18px", padding: 0 }}>
                      <li>{t("settings.general.waylandOption1")}</li>
                      <li>{t("settings.general.waylandOption2")}</li>
                      <li>{t("settings.general.waylandOption3")}</li>
                      <li>{t("settings.general.waylandOption4")}</li>
                    </ol>
                    {t("settings.general.waylandTerminal")}
                  </div>
                  <ToggleRow
                    label={t("settings.general.checkUpdates")}
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
                      <div style={{ fontSize: 13, marginBottom: 6 }}>
                        {t("settings.general.updateChannel")}
                      </div>
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
                        <option value="stable">{t("settings.general.updateChannelStable")}</option>
                        <option value="beta">{t("settings.general.updateChannelBeta")}</option>
                      </select>
                      <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                        {t("settings.general.updateChannelHint")}
                      </div>
                    </div>
                  ) : null}
                  <div className="catrip-gradient-divider" style={{ margin: "10px 0" }} />
                  <div style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 6px" }}>
                    {t("settings.general.downloadsSection")}
                  </div>
                  <ToggleRow
                    label={t("settings.general.openDownloads")}
                    checked={settings.general.openDownloadsWithDefaultApp !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        general: { ...settings.general, openDownloadsWithDefaultApp: v },
                      })
                    }
                  />
                  <ToggleRow
                    label={t("settings.general.askSaveAs")}
                    checked={settings.general.downloadsAskSaveAs}
                    onChange={(v) =>
                      update({
                        ...settings,
                        general: { ...settings.general, downloadsAskSaveAs: v },
                      })
                    }
                  />
                  <div style={{ padding: "6px 0 10px", opacity: 0.92 }}>
                    <div style={{ fontSize: 13, marginBottom: 6 }}>
                      {t("settings.general.downloadsFolder")}
                    </div>
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}
                    >
                      <input
                        className="catrip-field"
                        value={settings.general.downloadsDirectory || ""}
                        placeholder={t("settings.general.downloadsPlaceholder")}
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
                        {t("settings.general.chooseDownloadsFolder")}
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
                        {t("settings.general.resetDownloads")}
                      </button>
                    </div>
                    <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                      {t("settings.general.downloadsFilenameHint")}
                    </div>
                  </div>
                  <ToggleRow
                    label={t("settings.notifications.trayBadge")}
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
                    label={t("settings.notifications.dockBadge")}
                    checked={settings.general.dockUnreadBadge !== false}
                    onChange={(v) =>
                      update({ ...settings, general: { ...settings.general, dockUnreadBadge: v } })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginBottom: 8 }}>
                    {t("settings.notifications.badgeSumHint")}
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
                    <span>{t("settings.notifications.manualBadgeLabel")}</span>
                    <input
                      type="number"
                      className="catrip-field catrip-field--narrow"
                      min={0}
                      max={999}
                      placeholder={t("common.automatic")}
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
                    label={t("settings.network.proxy")}
                    checked={settings.network.proxyEnabled}
                    onChange={(v) =>
                      update({ ...settings, network: { ...settings.network, proxyEnabled: v } })
                    }
                  />
                  <div style={{ marginTop: 10, opacity: 0.85 }}>
                    {t("settings.network.proxyRulesLabel")}
                  </div>
                  <input
                    className="catrip-field"
                    value={settings.network.proxyRules}
                    onChange={(e) =>
                      update({
                        ...settings,
                        network: { ...settings.network, proxyRules: e.target.value },
                      })
                    }
                    placeholder={t("settings.network.proxyPlaceholder")}
                    style={{ width: "100%", marginTop: 6 }}
                  />
                  <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                    {t("settings.network.applyOnSaveHint")}
                  </div>
                </div>
              ) : page === "notifications" ? (
                <div style={{ opacity: 0.92 }}>
                  <ToggleRow
                    label={t("settings.notifications.enabled")}
                    checked={settings.notifications.enabled}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, enabled: v },
                      })
                    }
                  />
                  <ToggleRow
                    label={t("settings.notifications.showAccountName")}
                    checked={!!settings.notifications.showAccountName}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, showAccountName: v },
                      })
                    }
                  />
                  <ToggleRow
                    label={t("settings.notifications.showPreview")}
                    checked={!!settings.notifications.showPreview}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, showPreview: v },
                      })
                    }
                  />
                  <ToggleRow
                    label={t("settings.notifications.doNotDisturb")}
                    checked={!!settings.notifications.doNotDisturb}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, doNotDisturb: v },
                      })
                    }
                  />
                  <ToggleRow
                    label={t("settings.notifications.playSound")}
                    checked={settings.notifications.playSound !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        notifications: { ...settings.notifications, playSound: v },
                      })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginTop: 8 }}>
                    {t("settings.notifications.riseHint")}
                  </div>
                </div>
              ) : (
                <div style={{ opacity: 0.92 }}>
                  <div className="catrip-text-hint" style={{ marginBottom: 14 }}>
                    {t("settings.performance.gpuInfo")}{" "}
                    <code style={{ fontSize: 11 }}>CATRIP_DISABLE_GPU=1</code>.
                  </div>
                  <ToggleRow
                    label={t("settings.performance.gpuBoost")}
                    checked={!!settings.performance.gpuBoost}
                    onChange={(v) =>
                      update({
                        ...settings,
                        performance: { ...settings.performance, gpuBoost: v },
                      })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginBottom: 12 }}>
                    {t("settings.performance.gpuBoostHint")}
                  </div>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>
                    {t("settings.performance.chromiumProfileLabel")}
                  </div>
                  <select
                    className="catrip-select"
                    value={settings.performance.chromiumProfile ?? "default"}
                    onChange={(e) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          chromiumProfile: e.target.value as
                            | "default"
                            | "conservative"
                            | "aggressive",
                        },
                      })
                    }
                  >
                    <option value="default">
                      {t("settings.performance.chromiumProfileDefault")}
                    </option>
                    <option value="conservative">
                      {t("settings.performance.chromiumProfileConservative")}
                    </option>
                    <option value="aggressive">
                      {t("settings.performance.chromiumProfileAggressive")}
                    </option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 12 }}>
                    {t("settings.performance.chromiumProfileHint")}
                  </div>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>
                    {t("settings.performance.ozonePlatformLabel")}
                  </div>
                  <select
                    className="catrip-select"
                    value={settings.performance.ozonePlatform ?? "auto"}
                    onChange={(e) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          ozonePlatform: e.target.value as "auto" | "wayland" | "x11",
                        },
                      })
                    }
                  >
                    <option value="auto">{t("settings.performance.ozonePlatformAuto")}</option>
                    <option value="wayland">
                      {t("settings.performance.ozonePlatformWayland")}
                    </option>
                    <option value="x11">{t("settings.performance.ozonePlatformX11")}</option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 12 }}>
                    {t("settings.performance.ozonePlatformHint")}
                  </div>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>
                    {t("settings.performance.rendererLimit")}
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
                    <option value="0">{t("settings.performance.rendererDefault")}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 16 }}>
                    {t("settings.performance.rendererLimitHint")}
                  </div>
                  <ToggleRow
                    label={t("settings.performance.suspendInactive")}
                    checked={settings.performance.suspendInactiveAccounts !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          suspendInactiveAccounts: v,
                        },
                      })
                    }
                  />
                  <div style={{ opacity: 0.85, marginBottom: 8, marginTop: 4 }}>
                    {t("settings.performance.suspendAfterLabel")}
                  </div>
                  <select
                    className="catrip-select"
                    value={String(settings.performance.suspendAfterMinutes ?? 15)}
                    disabled={settings.performance.suspendInactiveAccounts === false}
                    onChange={(e) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          suspendAfterMinutes: Number(e.target.value),
                        },
                      })
                    }
                  >
                    <option value="5">
                      {t("settings.performance.minutesOption", { count: 5 })}
                    </option>
                    <option value="10">
                      {t("settings.performance.minutesOption", { count: 10 })}
                    </option>
                    <option value="15">
                      {t("settings.performance.minutesOption", { count: 15 })}
                    </option>
                    <option value="30">
                      {t("settings.performance.minutesOption", { count: 30 })}
                    </option>
                    <option value="60">
                      {t("settings.performance.minutesOption", { count: 60 })}
                    </option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 16 }}>
                    {t("settings.performance.suspendHint")}
                  </div>
                  <div style={{ opacity: 0.85, marginBottom: 8 }}>
                    {t("settings.performance.maxLiveAccountsLabel")}
                  </div>
                  <select
                    className="catrip-select"
                    value={String(settings.performance.maxLiveAccounts ?? 0)}
                    onChange={(e) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          maxLiveAccounts: Number(e.target.value),
                        },
                      })
                    }
                  >
                    <option value="0">{t("settings.performance.maxLiveAccountsUnlimited")}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 16 }}>
                    {t("settings.performance.maxLiveAccountsHint")}
                  </div>
                  <ToggleRow
                    label={t("settings.performance.prewarmOnHover")}
                    checked={settings.performance.prewarmOnHover !== false}
                    onChange={(v) =>
                      update({
                        ...settings,
                        performance: {
                          ...settings.performance,
                          prewarmOnHover: v,
                        },
                      })
                    }
                  />
                  <div className="catrip-text-hint" style={{ marginTop: 8, marginBottom: 16 }}>
                    {t("settings.performance.prewarmOnHoverHint")}
                  </div>
                  <ToggleRow
                    label={t("settings.performance.inhibitSleep")}
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
                    {t("settings.performance.inhibitSleepHint")}
                  </div>

                  <div
                    style={{
                      marginTop: 28,
                      paddingTop: 18,
                      borderTop: "1px solid rgba(255,255,255,0.10)",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>
                      {t("settings.performance.storageSection")}
                    </div>
                    <p
                      style={{ margin: "0 0 12px", opacity: 0.82, fontSize: 13, lineHeight: 1.55 }}
                    >
                      {t("settings.performance.storageHint")}
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
                      {cacheBusy ? t("common.cleaning") : t("settings.performance.clearCache")}
                    </button>
                    {cacheMsg ? (
                      <div className="catrip-text-hint" style={{ marginTop: 10 }}>
                        {cacheMsg}
                      </div>
                    ) : null}

                    <div className="catrip-gradient-divider" style={{ margin: "18px 0" }} />
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>
                      {t("settings.performance.mediaDiagSection")}
                    </div>
                    <p
                      style={{ margin: "0 0 12px", opacity: 0.82, fontSize: 13, lineHeight: 1.55 }}
                    >
                      {t("settings.performance.mediaDiagHint")}
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
                      {mediaDiagBusy ? t("common.checking") : t("settings.performance.checkCodecs")}
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
                      {t("settings.performance.mediaDiagFootnote")}
                    </p>

                    <div className="catrip-gradient-divider" style={{ margin: "18px 0" }} />
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>
                      {t("settings.performance.perfDiagSection")}
                    </div>
                    <p
                      style={{ margin: "0 0 12px", opacity: 0.82, fontSize: 13, lineHeight: 1.55 }}
                    >
                      {t("settings.performance.perfDiagHint")}
                    </p>
                    <button
                      type="button"
                      className="catrip-btn catrip-btn-accent"
                      disabled={perfDiagBusy}
                      onClick={runPerfDiag}
                      style={{
                        borderRadius: 10,
                        padding: "10px 16px",
                        border: "1px solid var(--catrip-accent-border)",
                        background: perfDiagBusy
                          ? "rgba(255,255,255,0.04)"
                          : "var(--catrip-accent-soft)",
                        color: "#e8f8ef",
                        cursor: perfDiagBusy ? "wait" : "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {perfDiagBusy ? t("common.checking") : t("settings.performance.runPerfDiag")}
                    </button>
                    {perfDiagText ? (
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
                        {perfDiagText}
                      </pre>
                    ) : null}
                    <p
                      className="catrip-text-hint"
                      style={{ margin: "12px 0 0", lineHeight: 1.45 }}
                    >
                      {t("settings.performance.perfDiagFootnote")}
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
      <Overlay open={whatsappLangNoticeOpen} onClose={() => setWhatsappLangNoticeOpen(false)}>
        <div style={{ padding: "22px 22px 20px" }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              marginBottom: 12,
            }}
          >
            {t("settings.language.whatsappNotice.title")}
          </div>
          <p
            style={{
              margin: "0 0 14px",
              fontSize: 14,
              lineHeight: 1.55,
              color: "#dce4e4",
            }}
          >
            {t("settings.language.whatsappNotice.intro")}
          </p>
          <div
            role="note"
            style={{
              margin: "0 0 16px",
              padding: "12px 14px",
              borderRadius: 10,
              border: "1px solid rgba(251, 191, 36, 0.45)",
              background: "rgba(251, 191, 36, 0.10)",
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "#fde68a",
              fontWeight: 600,
            }}
          >
            {t("settings.language.whatsappNotice.metaRestriction")}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: 8,
            }}
          >
            {t("settings.language.whatsappNotice.stepsTitle")}
          </div>
          <ol
            style={{
              margin: "0 0 18px",
              paddingLeft: 20,
              fontSize: 13,
              lineHeight: 1.55,
              color: "#dce4e4",
            }}
          >
            <li style={{ marginBottom: 6 }}>{t("settings.language.whatsappNotice.step1")}</li>
            <li style={{ marginBottom: 6 }}>{t("settings.language.whatsappNotice.step2")}</li>
            <li>{t("settings.language.whatsappNotice.step3")}</li>
          </ol>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="catrip-btn catrip-btn-accent"
              onClick={() => setWhatsappLangNoticeOpen(false)}
              style={{
                borderRadius: 10,
                padding: "10px 18px",
                border: "1px solid var(--catrip-accent-border)",
                background: "var(--catrip-accent-soft)",
                color: "#c8f5dc",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              {t("common.accept")}
            </button>
          </div>
        </div>
      </Overlay>
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
            const label = target?.label ?? t("common.thisAccount");
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
                    {t("settings.accounts.deleteConfirm", { name: label })}
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
                  {t("settings.accounts.deleteWarning")}
                </p>
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--catrip-text-hint)",
                  }}
                >
                  {t("settings.accounts.deleteHint")}
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
                    {t("common.cancel")}
                  </button>
                  <button
                    type="button"
                    className="catrip-btn"
                    disabled={deletingInFlight || !confirmDeleteId}
                    onClick={async () => {
                      if (!confirmDeleteId) return;
                      const target = accounts.find((acc) => acc.id === confirmDeleteId);
                      const targetLabel = target?.label ?? t("common.theAccount");
                      setDeletingInFlight(true);
                      try {
                        const ok = await window.catrip.deleteAccount(confirmDeleteId);
                        if (ok) {
                          toasts.success(t("settings.accounts.deleted", { name: targetLabel }));
                        } else {
                          console.warn("[catrip] deleteAccount returned false", {
                            id: confirmDeleteId,
                          });
                          toasts.error(t("settings.accounts.deleteFailed", { name: targetLabel }));
                        }
                      } catch (err) {
                        console.error("[catrip] deleteAccount failed", err);
                        toasts.error(t("settings.accounts.deleteError", { name: targetLabel }));
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
                    {deletingInFlight ? t("common.deleting") : t("common.deletePermanently")}
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
