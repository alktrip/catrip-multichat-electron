import React from "react";
import { Overlay } from "./Overlay";
import SettingsView from "./SettingsView";
import SystemIconImg from "./SystemIconImg";
import AccountAvatar from "./AccountAvatar";

declare global {
  interface Window {
    catrip: {
      getVersion: () => Promise<string>;
      listAccounts: () => Promise<{ id: string; label: string; icon: string }[]>;
      createAccount: (label?: string) => Promise<{ id: string; label: string; icon: string }>;
      regenerateAccountIcon: (id: string) => Promise<{ id: string; label: string; icon: string } | null>;
      setActiveAccount: (id: string) => Promise<void>;
      getActiveAccountId: () => Promise<string | null>;
      onAccountsListChanged: (
        cb: (accounts: { id: string; label: string; icon: string }[]) => void
      ) => () => void;
      onActiveAccountChanged: (cb: (id: string | null) => void) => () => void;
      openChatByPhone: (phoneRaw: string) => Promise<void>;
      triggerNewChat: () => Promise<void>;
      getSettings: () => Promise<any>;
      setSettings: (next: any) => Promise<void>;
      setChromeMetrics: (m: { sidebarWidth: number; topHeight: number }) => Promise<void>;
      setRendererModalOpen: (open: boolean) => Promise<void>;
      setTrayBadgeCount: (count: number) => Promise<void>;
      setZenMode: (enabled: boolean) => Promise<void>;
      setMode: (mode: "browser" | "settings") => Promise<void>;
      onOpenSettings: (cb: () => void) => () => void;
      onOpenQuickSwitcher: (cb: () => void) => () => void;
      onOpenPhoneChat: (cb: () => void) => () => void;
      onZenChanged: (cb: (enabled: boolean) => void) => () => void;
      onOpenShortcutsHelp: (cb: () => void) => () => void;
      onOpenAbout: (cb: () => void) => () => void;
      runWhatsAppMediaDiagnostics: () => Promise<
        | { ok: true; data: Record<string, unknown> }
        | { ok: false; code: string; message: string; url?: string }
      >;
      selectDownloadsDirectory: () => Promise<string | null>;
    };
  }
}

const modalKbd: React.CSSProperties = {
  display: "inline-block",
  flexShrink: 0,
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  fontSize: 12,
  fontWeight: 600,
  padding: "3px 8px",
  borderRadius: 6,
  background: "rgba(0,0,0,0.5)",
  border: "1px solid rgba(255,255,255,0.16)",
  color: "#f8fcfb",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
};

const modalSectionTitle: React.CSSProperties = {
  marginTop: 16,
  marginBottom: 6,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#21c063",
};

function ShortcutRow({ keys, children }: { keys: string; children: React.ReactNode }) {
  return (
    <dd
      style={{
        margin: 0,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        color: "#eef2f2",
        fontSize: 14,
        lineHeight: 1.5,
      }}
    >
      <span style={modalKbd}>{keys}</span>
      <span style={{ flex: 1, minWidth: 0 }}>{children}</span>
    </dd>
  );
}

export default function App() {
  const [version, setVersion] = React.useState<string>("");
  const [accounts, setAccounts] = React.useState<
    { id: string; label: string; icon: string }[]
  >([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickQuery, setQuickQuery] = React.useState("");
  const quickInputRef = React.useRef<HTMLInputElement | null>(null);
  const [phoneOpen, setPhoneOpen] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState("+");
  const phoneInputRef = React.useRef<HTMLInputElement | null>(null);
  const [sidebarWide, setSidebarWide] = React.useState(false);
  const [zen, setZen] = React.useState(false);
  const [mode, setMode] = React.useState<"browser" | "settings">("browser");
  const [settings, setSettings] = React.useState<any>(null);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const api = window.catrip;
    api
      .getVersion()
      .then((v) => mounted && setVersion(v))
      .catch(() => mounted && setVersion("unknown"));

    api
      .listAccounts()
      .then((a) => mounted && setAccounts(a))
      .catch(() => {});
    api
      .getActiveAccountId()
      .then((id) => mounted && setActiveId(id))
      .catch(() => {});

    const offList = api.onAccountsListChanged((a) => setAccounts(a));
    const offActive = api.onActiveAccountChanged((id) => setActiveId(id));
    return () => {
      offList();
      offActive();
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    window.catrip
      .getSettings()
      .then((s) => mounted && setSettings(s))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    const off = window.catrip.onOpenSettings(() => setMode("settings"));
    return () => off();
  }, []);

  React.useEffect(() => {
    const offQuick = window.catrip.onOpenQuickSwitcher(() => {
      setQuickQuery("");
      setQuickOpen(true);
      setPhoneOpen(false);
    });
    const offPhone = window.catrip.onOpenPhoneChat(() => {
      setPhoneValue("+");
      setPhoneOpen(true);
      setQuickOpen(false);
    });
    const offZen = window.catrip.onZenChanged((enabled) => {
      setZen(enabled);
    });
    const offShortcuts = window.catrip.onOpenShortcutsHelp(() => setShortcutsOpen(true));
    const offAbout = window.catrip.onOpenAbout(() => setAboutOpen(true));
    return () => {
      offQuick();
      offPhone();
      offZen();
      offShortcuts();
      offAbout();
    };
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && zen) {
        e.preventDefault();
        setZen(false);
        void window.catrip.setZenMode(false);
        return;
      }
      const ctrlOrMeta = e.ctrlKey || e.metaKey;
      if (!ctrlOrMeta) return;
      const k = e.key.toLowerCase();
      if (k === "p") {
        e.preventDefault();
        setMode("settings");
        return;
      }
      if (mode === "browser" && k === "n" && !e.shiftKey) {
        e.preventDefault();
        void window.catrip.triggerNewChat();
        return;
      }
      if (mode === "browser" && k === "z" && e.shiftKey) {
        e.preventDefault();
        setZen((z) => {
          const next = !z;
          void window.catrip.setZenMode(next);
          return next;
        });
        return;
      }
      if (k === "k") {
        e.preventDefault();
        setQuickQuery("");
        setQuickOpen(true);
        setPhoneOpen(false);
        return;
      }
      if (k === "m") {
        e.preventDefault();
        setPhoneValue("+");
        setPhoneOpen(true);
        setQuickOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [zen, mode]);

  React.useEffect(() => {
    if (!quickOpen) return;
    const t = setTimeout(() => quickInputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [quickOpen]);

  React.useEffect(() => {
    if (!phoneOpen) return;
    const t = setTimeout(() => phoneInputRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [phoneOpen]);

  const filtered = accounts.filter((a) =>
    a.label.toLowerCase().includes(quickQuery.trim().toLowerCase())
  );

  React.useEffect(() => {
    const railHidden =
      mode === "settings" || zen || settings?.general?.showSidebar === false;
    const sidebarWidth = railHidden ? 0 : sidebarWide ? 88 : 72;
    const metrics = { sidebarWidth, topHeight: 0 };
    if (import.meta.env.DEV) {
      console.log("[catrip-embed-renderer]", "setChromeMetrics", {
        ...metrics,
        railHidden,
        sidebarWide,
        zen,
        mode,
        showSidebar: settings?.general?.showSidebar,
      });
    }
    void window.catrip.setChromeMetrics(metrics);
  }, [sidebarWide, zen, mode, settings]);

  React.useEffect(() => {
    if (mode === "settings" && zen) {
      setZen(false);
      void window.catrip.setZenMode(false);
    }
    const modalBlocking =
      mode === "browser" &&
      (quickOpen || phoneOpen || shortcutsOpen || aboutOpen);
    if (import.meta.env.DEV) {
      console.log("[catrip-embed-renderer]", "setMode+modal", { mode, modalBlocking });
    }
    void (async () => {
      await window.catrip.setMode(mode);
      await window.catrip.setRendererModalOpen(modalBlocking);
    })();
  }, [mode, quickOpen, phoneOpen, shortcutsOpen, aboutOpen, zen]);

  const sidebarAllowed = settings?.general?.showSidebar !== false;

  const railActionBtn: React.CSSProperties = {
    height: 35,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };

  const helpOverlays = (
    <>
      <Overlay open={shortcutsOpen} onClose={() => setShortcutsOpen(false)}>
        <div style={{ padding: "20px 22px 22px" }}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 4,
              fontSize: 18,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Atajos de teclado
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "#b8c4c4", lineHeight: 1.5 }}>
            Referencia rápida; también están en el menú superior.
          </p>
          <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <dt style={{ ...modalSectionTitle, marginTop: 0 }}>Archivo</dt>
            <ShortcutRow keys="Ctrl+P">Ajustes</ShortcutRow>
            <ShortcutRow keys="Ctrl+W">Ocultar ventana</ShortcutRow>
            <ShortcutRow keys="Ctrl+Q">Salir</ShortcutRow>
            <dt style={modalSectionTitle}>Ver</dt>
            <ShortcutRow keys="Ctrl+K">Cambio rápido de cuenta</ShortcutRow>
            <ShortcutRow keys="F11">Pantalla completa</ShortcutRow>
            <ShortcutRow keys="Ctrl+Shift+Z">Modo Zen</ShortcutRow>
            <ShortcutRow keys="Esc">Salir del modo Zen</ShortcutRow>
            <dt style={modalSectionTitle}>Chat</dt>
            <ShortcutRow keys="F5">Recargar WhatsApp Web</ShortcutRow>
            <ShortcutRow keys="Ctrl+Shift+O">
              Abrir la URL actual en el navegador del sistema
            </ShortcutRow>
            <ShortcutRow keys="Ctrl+N">Nuevo chat (WhatsApp Web)</ShortcutRow>
            <ShortcutRow keys="Ctrl+M">Chat por número de teléfono</ShortcutRow>
            <dt style={modalSectionTitle}>Cuentas</dt>
            <ShortcutRow keys="Ctrl+U">Nueva cuenta</ShortcutRow>
            <ShortcutRow keys="Ctrl+1–9">Cambiar de cuenta (posición en la lista)</ShortcutRow>
          </dl>
          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.12)",
              fontSize: 12,
              color: "#9aa6a6",
              lineHeight: 1.45,
            }}
          >
            Esc cierra este cuadro. Clic fuera del panel también lo cierra.
          </div>
        </div>
      </Overlay>
      <Overlay open={aboutOpen} onClose={() => setAboutOpen(false)}>
        <div style={{ padding: "22px 22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <img
              src={`${import.meta.env.BASE_URL}org.k3p.catrip-multichat.svg`}
              width={52}
              height={52}
              alt=""
              draggable={false}
              style={{ flexShrink: 0, borderRadius: 12 }}
            />
            <div
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
              }}
            >
              Acerca de catrip_multichat_electron
            </div>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#dce4e4", lineHeight: 1.65 }}>
            Cliente de escritorio para WhatsApp Web con varias cuentas y sesiones aisladas.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(33,192,99,0.12)",
              border: "1px solid rgba(33,192,99,0.45)",
              color: "#c8f5dc",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Versión <span style={{ color: "#ffffff" }}>{version || "…"}</span>
          </div>
          <p style={{ margin: "18px 0 0", fontSize: 12, color: "#9aa6a6", lineHeight: 1.55 }}>
            Electron + Chromium embebido para reproducir audio y vídeo de forma fiable.
          </p>
        </div>
      </Overlay>
    </>
  );

  if (mode === "settings") {
    return (
      <>
        <SettingsView
          onBack={() => {
            setMode("browser");
            void window.catrip.getSettings().then((s) => setSettings(s));
          }}
        />
        {helpOverlays}
      </>
    );
  }

  return (
    <>
    <div style={{ fontFamily: "system-ui, sans-serif", height: "100vh", display: "flex" }}>
      {zen || !sidebarAllowed ? null : (
      <div
        onMouseEnter={() => setSidebarWide(true)}
        onMouseLeave={() => setSidebarWide(false)}
        style={{
          width: sidebarWide ? 88 : 72,
          transition: "width 170ms ease",
          background: "#1d1f1f",
          padding: "6px 8px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {accounts.map((a) => {
            const selected = a.id === activeId;
            return (
              <button
                key={a.id}
                title={`${a.label} · Clic derecho: nuevo ícono de color`}
                onClick={() => {
                  setActiveId(a.id);
                  void window.catrip.setActiveAccount(a.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  void window.catrip.regenerateAccountIcon(a.id);
                }}
                style={{
                  height: 40,
                  width: "100%",
                  borderRadius: 10,
                  border: "none",
                  background: selected ? "rgba(255,255,255,0.10)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: selected ? "rgba(33,192,99,0.12)" : "rgba(255,255,255,0.04)",
                    border: selected ? "1px solid rgba(33,192,99,0.75)" : "1px solid rgba(255,255,255,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <AccountAvatar icon={a.icon} labelFallback={a.label} size={40} />
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.10)", marginTop: 6 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
          <button
            title="Nueva cuenta"
            onClick={() => void window.catrip.createAccount()}
            style={railActionBtn}
          >
            <SystemIconImg name="new-account" size={22} />
          </button>
          <div style={{ flex: 1 }} />
          <button
            title="Nuevo chat por número de teléfono"
            onClick={() => {
              setPhoneValue("+");
              setPhoneOpen(true);
            }}
            style={railActionBtn}
          >
            <SystemIconImg name="new-chat-number" size={22} />
          </button>
          <button
            title="Nuevo chat (WhatsApp Web)"
            onClick={() => {
              void window.catrip.triggerNewChat();
            }}
            style={railActionBtn}
          >
            <SystemIconImg name="new-chat" size={22} />
          </button>
          <div style={{ height: 1, background: "rgba(255,255,255,0.10)" }} />
          <button
            title="Ajustes"
            onClick={() => {
              setMode("settings");
            }}
            style={railActionBtn}
          >
            <SystemIconImg name="open-settings" size={22} />
          </button>
          <button
            title="Modo Zen (Esc para salir)"
            onClick={() => {
              setZen(true);
              void window.catrip.setZenMode(true);
            }}
            style={railActionBtn}
          >
            <SystemIconImg name="zen-mode" size={22} />
          </button>
        </div>
      </div>
      )}

      <Overlay
        open={quickOpen}
        onClose={() => {
          setQuickOpen(false);
          setQuickQuery("");
        }}
      >
        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Cambiar de cuenta</div>
          <input
            ref={quickInputRef}
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Buscar cuentas…"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const first = filtered[0];
                if (!first) return;
                setActiveId(first.id);
                void window.catrip.setActiveAccount(first.id);
                setQuickOpen(false);
              }
            }}
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
          <div style={{ marginTop: 10, maxHeight: 320, overflow: "auto" }}>
            {filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setActiveId(a.id);
                  void window.catrip.setActiveAccount(a.id);
                  setQuickOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderRadius: 10,
                  padding: "8px 10px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    a.id === activeId
                      ? "rgba(33,192,99,0.18)"
                      : "rgba(255,255,255,0.04)",
                  color: "inherit",
                  cursor: "pointer",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <AccountAvatar icon={a.icon} labelFallback={a.label} size={28} />
                <span style={{ flex: 1 }}>{a.label}</span>
              </button>
            ))}
            {filtered.length === 0 ? (
              <div style={{ opacity: 0.7, padding: "10px 2px" }}>
                Sin resultados
              </div>
            ) : null}
          </div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>
            Intro para cambiar • Esc para cerrar
          </div>
        </div>
      </Overlay>

      <Overlay
        open={phoneOpen}
        onClose={() => {
          setPhoneOpen(false);
          setPhoneValue("+");
        }}
      >
        <div style={{ padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Enviar mensaje a…</div>
          <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 8 }}>
            Introduzca el número de teléfono con código de país (ej.: +5511999999999):
          </div>
          <input
            ref={phoneInputRef}
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            placeholder="+5511999999999"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setPhoneOpen(false);
                window.setTimeout(() => void window.catrip.openChatByPhone(phoneValue), 0);
              }
            }}
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
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            <button
              onClick={() => setPhoneOpen(false)}
              style={{
                borderRadius: 10,
                padding: "8px 12px",
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.04)",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setPhoneOpen(false);
                window.setTimeout(() => void window.catrip.openChatByPhone(phoneValue), 0);
              }}
              style={{
                borderRadius: 10,
                padding: "8px 12px",
                border: "1px solid rgba(33,192,99,0.50)",
                background: "rgba(33,192,99,0.18)",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              Aceptar
            </button>
          </div>
          <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>
            Intro para abrir el chat • Esc para cerrar
          </div>
        </div>
      </Overlay>
    </div>
    {helpOverlays}
    </>
  );
}

