import React from "react";
import { Overlay } from "./Overlay";
import SettingsView, { type SettingsPage } from "./SettingsView";
import SystemIconImg from "./SystemIconImg";
import AccountAvatar from "./AccountAvatar";
import { extractAccountAccentRgb } from "./accountColors";
import {
  buildCommands,
  filterCommands,
  COMMAND_GROUPS,
  type Command,
  type CommandIcon,
} from "./commands";
import type { AppApi } from "../../preload/preload";

declare global {
  interface Window {
    catrip: AppApi;
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

/**
 * Render del shortcut de la paleta de comandos como keycaps individuales,
 * estilo macOS Spotlight / Linear: cada modificador y cada tecla se pinta en
 * su propio "kbd" pequeño, separados por `+`.
 *
 * Reemplaza alias verbosos por símbolos compactos (`↑`, `↓`, `Esc`, `Enter`,
 * `Tab`) para reducir el ruido visual cuando hay shortcuts largos.
 */
const KEY_GLYPHS: Record<string, string> = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Up: "↑",
  Down: "↓",
  Left: "←",
  Right: "→",
  Enter: "⏎",
  Return: "⏎",
  Escape: "Esc",
  Tab: "⇥",
  Space: "Space",
  Backspace: "⌫",
  Delete: "⌦",
};

function CommandShortcut({ shortcut }: { shortcut: string }) {
  const tokens = shortcut
    .split("+")
    .map((t) => t.trim())
    .filter(Boolean);
  return (
    <span className="catrip-cmd-kbd-group" aria-label={shortcut}>
      {tokens.map((tok, i) => {
        const display = KEY_GLYPHS[tok] ?? tok;
        return (
          <React.Fragment key={i}>
            <kbd className="catrip-cmd-kbd">{display}</kbd>
            {i < tokens.length - 1 ? (
              <span className="catrip-cmd-kbd-sep" aria-hidden>
                +
              </span>
            ) : null}
          </React.Fragment>
        );
      })}
    </span>
  );
}

function CommandIconView({ icon, size }: { icon: CommandIcon; size: number }) {
  if (icon.kind === "system") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <SystemIconImg name={icon.name} size={Math.round(size * 0.62)} />
      </div>
    );
  }
  if (icon.kind === "avatar") {
    return <AccountAvatar icon={icon.data} labelFallback={icon.fallback} size={size} />;
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        background: "rgba(33,192,99,0.10)",
        border: "1px solid rgba(33,192,99,0.30)",
        color: "#c8f5dc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: Math.round(size * 0.5),
        flexShrink: 0,
      }}
      aria-hidden
    >
      {icon.char}
    </div>
  );
}

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
    { id: string; label: string; icon: string; notificationsEnabled?: boolean }[]
  >([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [unreadByAccount, setUnreadByAccount] = React.useState<Record<string, number>>({});
  /**
   * Token por cuenta que se incrementa cada vez que su contador de no leídos
   * SUBE. Se usa como `key` del `<span>` del unread-dot para forzar remount
   * y re-disparar la animación de pulso (one-shot). Evita el pulso infinito.
   */
  const [unreadPulseTokens, setUnreadPulseTokens] = React.useState<Record<string, number>>({});
  const prevUnreadRef = React.useRef<Record<string, number>>({});
  React.useEffect(() => {
    const prev = prevUnreadRef.current;
    const incremented: string[] = [];
    for (const id of Object.keys(unreadByAccount)) {
      const next = unreadByAccount[id] ?? 0;
      const previous = prev[id] ?? 0;
      if (next > previous) incremented.push(id);
    }
    prevUnreadRef.current = { ...unreadByAccount };
    if (incremented.length > 0) {
      setUnreadPulseTokens((tok) => {
        const out = { ...tok };
        for (const id of incremented) out[id] = (out[id] ?? 0) + 1;
        return out;
      });
    }
  }, [unreadByAccount]);
  const [dragId, setDragId] = React.useState<string | null>(null);
  const [dropIndex, setDropIndex] = React.useState<number | null>(null);
  const [quickOpen, setQuickOpen] = React.useState(false);
  const [quickQuery, setQuickQuery] = React.useState("");
  const quickInputRef = React.useRef<HTMLInputElement | null>(null);
  const [phoneOpen, setPhoneOpen] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState("+");
  const phoneInputRef = React.useRef<HTMLInputElement | null>(null);
  const sidebarWidthPx = 72;
  const [zen, setZen] = React.useState(false);
  const [mode, setMode] = React.useState<"browser" | "settings">("browser");
  const [settingsPage, setSettingsPage] = React.useState<SettingsPage>("general");
  const [settings, setSettings] = React.useState<any>(null);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const paletteListRef = React.useRef<HTMLDivElement | null>(null);

  const enterSettings = React.useCallback((page: SettingsPage = "general") => {
    setSettingsPage(page);
    setMode("settings");
  }, []);

  const applySettingsRemote = React.useCallback((next: any) => {
    setSettings(next);
    void window.catrip.setSettings(next);
  }, []);

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

    api
      .getAccountsUnread()
      .then((m) => mounted && setUnreadByAccount(m ?? {}))
      .catch(() => {});

    const offList = api.onAccountsListChanged((a) => setAccounts(a));
    const offActive = api.onActiveAccountChanged((id) => setActiveId(id));
    const offUnread = api.onAccountsUnreadChanged((m) => setUnreadByAccount(m ?? {}));
    return () => {
      offList();
      offActive();
      offUnread();
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
    const off = window.catrip.onOpenSettings(() => enterSettings("general"));
    return () => off();
  }, [enterSettings]);

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
        enterSettings("general");
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
  }, [zen, mode, enterSettings]);

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

  const openPhoneDialog = React.useCallback(() => {
    setPhoneValue("+");
    setPhoneOpen(true);
    setQuickOpen(false);
  }, []);

  const toggleZen = React.useCallback((next: boolean) => {
    setZen(next);
    void window.catrip.setZenMode(next);
  }, []);

  const commands = React.useMemo<Command[]>(
    () =>
      buildCommands({
        accounts,
        activeAccountId: activeId,
        settings,
        zen,
        mode,
        setActiveAccount: (id) => {
          setActiveId(id);
          void window.catrip.setActiveAccount(id);
        },
        goToSettings: (page) => enterSettings(page ?? "general"),
        toggleZen,
        openPhoneDialog,
        triggerNewChat: () => {
          void window.catrip.triggerNewChat();
        },
        createAccount: () => {
          void window.catrip.createAccount();
        },
        applySettings: applySettingsRemote,
      }),
    [
      accounts,
      activeId,
      settings,
      zen,
      mode,
      enterSettings,
      toggleZen,
      openPhoneDialog,
      applySettingsRemote,
    ],
  );

  const filteredCommands = React.useMemo(
    () => filterCommands(commands, quickQuery),
    [commands, quickQuery],
  );

  React.useEffect(() => {
    setPaletteIndex(0);
  }, [quickQuery, quickOpen]);

  React.useEffect(() => {
    if (!quickOpen) return;
    const root = paletteListRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(`[data-cmd-index="${paletteIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [paletteIndex, quickOpen, filteredCommands.length]);

  const runCommand = React.useCallback((cmd: Command) => {
    setQuickOpen(false);
    setQuickQuery("");
    void cmd.perform();
  }, []);

  React.useEffect(() => {
    const railHidden = mode === "settings" || zen || settings?.general?.showSidebar === false;
    const sidebarWidth = railHidden ? 0 : sidebarWidthPx;
    const metrics = { sidebarWidth, topHeight: 0 };
    if (import.meta.env.DEV) {
      console.log("[catrip-embed-renderer]", "setChromeMetrics", {
        ...metrics,
        railHidden,
        zen,
        mode,
        showSidebar: settings?.general?.showSidebar,
      });
    }
    void window.catrip.setChromeMetrics(metrics);
  }, [zen, mode, settings]);

  React.useEffect(() => {
    if (mode === "settings" && zen) {
      setZen(false);
      void window.catrip.setZenMode(false);
    }
    const modalBlocking =
      mode === "browser" && (quickOpen || phoneOpen || shortcutsOpen || aboutOpen);
    if (import.meta.env.DEV) {
      console.log("[catrip-embed-renderer]", "setMode+modal", { mode, modalBlocking });
    }
    void (async () => {
      await window.catrip.setMode(mode);
      await window.catrip.setRendererModalOpen(modalBlocking);
    })();
  }, [mode, quickOpen, phoneOpen, shortcutsOpen, aboutOpen, zen]);

  const sidebarAllowed = settings?.general?.showSidebar !== false;

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
              Acerca de Catrip Connect
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
          <p style={{ margin: "12px 0 0", fontSize: 12, color: "#9aa6a6", lineHeight: 1.55 }}>
            Inspirado en ideas del proyecto{" "}
            <a
              href="https://github.com/rafatosta/zapzap"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#7dd3a8", textDecoration: "underline" }}
            >
              ZapZap
            </a>{" "}
            (PyQt6 + WebEngine). Implementación independiente en Electron.
          </p>
        </div>
      </Overlay>
    </>
  );

  if (mode === "settings") {
    return (
      <>
        <SettingsView
          page={settingsPage}
          onPageChange={setSettingsPage}
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
      <div style={{ height: "100vh", display: "flex" }}>
        {zen || !sidebarAllowed ? null : (
          <div
            style={{
              width: sidebarWidthPx,
              background: "#1d1f1f",
              padding: "6px 8px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              position: "relative",
            }}
          >
            <div className="catrip-rail-edge" aria-hidden />
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {accounts.map((a, idx) => {
                const selected = a.id === activeId;
                const unread = unreadByAccount[a.id] ?? 0;
                const showUnreadDot = unread > 0 && a.notificationsEnabled !== false;
                const tooltip = showUnreadDot
                  ? `${a.label} · ${unread} sin leer · Arrastrar para reordenar`
                  : `${a.label} · Arrastrar para reordenar · Clic derecho: variante`;
                const isDragging = dragId === a.id;
                const showSlotBefore = dropIndex === idx;
                const accentRgb = extractAccountAccentRgb(a.icon);
                return (
                  <React.Fragment key={a.id}>
                    {showSlotBefore ? <div className="catrip-drop-slot is-active" /> : null}
                    <button
                      className={`catrip-rail-account-btn${selected ? " is-selected" : ""}`}
                      title={tooltip}
                      draggable
                      onClick={() => {
                        setActiveId(a.id);
                        void window.catrip.setActiveAccount(a.id);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        void window.catrip.regenerateAccountIcon(a.id);
                      }}
                      onDragStart={(e) => {
                        setDragId(a.id);
                        setDropIndex(null);
                        try {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", a.id);
                        } catch {
                          /* algunas plataformas exigen al menos un setData */
                        }
                      }}
                      onDragOver={(e) => {
                        if (!dragId) return;
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        const rect = e.currentTarget.getBoundingClientRect();
                        const before = e.clientY - rect.top < rect.height / 2;
                        const next = before ? idx : idx + 1;
                        const draggedIdx = accounts.findIndex((x) => x.id === dragId);
                        if (draggedIdx === -1 || draggedIdx === next || draggedIdx === next - 1) {
                          if (dropIndex !== null) setDropIndex(null);
                          return;
                        }
                        if (dropIndex !== next) setDropIndex(next);
                      }}
                      onDrop={(e) => {
                        if (!dragId) return;
                        e.preventDefault();
                        const draggedIdx = accounts.findIndex((x) => x.id === dragId);
                        if (draggedIdx === -1) {
                          setDragId(null);
                          setDropIndex(null);
                          return;
                        }
                        const rect = e.currentTarget.getBoundingClientRect();
                        const before = e.clientY - rect.top < rect.height / 2;
                        const targetIndex = before ? idx : idx + 1;
                        if (targetIndex === draggedIdx || targetIndex === draggedIdx + 1) {
                          setDragId(null);
                          setDropIndex(null);
                          return;
                        }
                        const next = accounts.slice();
                        const [moved] = next.splice(draggedIdx, 1);
                        const adjustedTo = targetIndex > draggedIdx ? targetIndex - 1 : targetIndex;
                        next.splice(adjustedTo, 0, moved);
                        const prev = accounts;
                        setAccounts(next);
                        setDragId(null);
                        setDropIndex(null);
                        void window.catrip
                          .reorderAccounts(next.map((x) => x.id))
                          .then((ok) => {
                            if (!ok) setAccounts(prev);
                          })
                          .catch(() => setAccounts(prev));
                      }}
                      onDragEnd={() => {
                        setDragId(null);
                        setDropIndex(null);
                      }}
                      style={{
                        position: "relative",
                        height: 40,
                        width: "100%",
                        borderRadius: 10,
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: dragId ? "grabbing" : "grab",
                        opacity: isDragging ? 0.35 : 1,
                        transition: "opacity 120ms ease-out",
                        ...(accentRgb
                          ? ({ "--catrip-accent-rgb": accentRgb } as React.CSSProperties)
                          : {}),
                      }}
                    >
                      <div
                        className="catrip-rail-account-inner"
                        style={{
                          position: "relative",
                          width: 40,
                          height: 40,
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <AccountAvatar icon={a.icon} labelFallback={a.label} size={40} />
                        </div>
                        {showUnreadDot ? (
                          <span
                            key={`unread-${a.id}-${unreadPulseTokens[a.id] ?? 0}`}
                            className="catrip-unread-dot"
                            data-count={unread > 99 ? "99+" : unread}
                            aria-label={`${unread} mensajes sin leer`}
                          />
                        ) : null}
                      </div>
                    </button>
                  </React.Fragment>
                );
              })}
              {dropIndex === accounts.length ? (
                <div className="catrip-drop-slot is-active" />
              ) : null}
            </div>

            <div className="catrip-gradient-divider" style={{ marginTop: 6 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
              <button
                type="button"
                className={`catrip-rail-action-btn${accounts.length === 0 ? " is-pulsing" : ""}`}
                title={accounts.length === 0 ? "Crear tu primera cuenta" : "Nueva cuenta"}
                onClick={() => void window.catrip.createAccount()}
              >
                <SystemIconImg name="new-account" size={22} />
              </button>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                className="catrip-rail-action-btn"
                title="Nuevo chat por número de teléfono"
                onClick={() => {
                  setPhoneValue("+");
                  setPhoneOpen(true);
                }}
              >
                <SystemIconImg name="new-chat-number" size={22} />
              </button>
              <button
                type="button"
                className="catrip-rail-action-btn"
                title="Nuevo chat (WhatsApp Web)"
                onClick={() => {
                  void window.catrip.triggerNewChat();
                }}
              >
                <SystemIconImg name="new-chat" size={22} />
              </button>
              <div style={{ height: 1, background: "rgba(255,255,255,0.10)" }} />
              <button
                type="button"
                className="catrip-rail-action-btn"
                title="Ajustes"
                onClick={() => {
                  enterSettings("general");
                }}
              >
                <SystemIconImg name="open-settings" size={22} />
              </button>
              <button
                type="button"
                className="catrip-rail-action-btn"
                title="Modo Zen (Esc para salir)"
                onClick={() => {
                  setZen(true);
                  void window.catrip.setZenMode(true);
                }}
              >
                <SystemIconImg name="zen-mode" size={22} />
              </button>
            </div>
          </div>
        )}

        {accounts.length === 0 && !zen ? (
          <div className="catrip-onboarding-wrap" role="region" aria-label="Bienvenida">
            <div className="catrip-onboarding-card">
              <img
                src={`${import.meta.env.BASE_URL}org.k3p.catrip-multichat.svg`}
                width={88}
                height={88}
                alt=""
                draggable={false}
                className="catrip-onboarding-logo"
              />
              <h1 className="catrip-onboarding-title">Bienvenido a Catrip Connect</h1>
              <p className="catrip-onboarding-subtitle">
                Cliente multicuenta de WhatsApp Web. Añade tu primera cuenta para empezar a chatear
                desde el escritorio.
              </p>
              <button
                type="button"
                className="catrip-btn catrip-btn-accent"
                onClick={() => void window.catrip.createAccount()}
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "rgb(33, 192, 99)",
                  border: "1px solid rgba(33, 192, 99, 0.85)",
                  borderRadius: 12,
                  padding: "12px 22px",
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                }}
              >
                Añadir tu primera cuenta
              </button>
              <p className="catrip-onboarding-hint">
                También puedes pulsar el botón <strong>+</strong> del rail (lateral izquierdo,
                parpadea en verde).
              </p>
            </div>
          </div>
        ) : null}

        <Overlay
          open={quickOpen}
          onClose={() => {
            setQuickOpen(false);
            setQuickQuery("");
          }}
        >
          <div style={{ padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Paleta de comandos</div>
            <input
              ref={quickInputRef}
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Buscar cuentas, acciones, ajustes…"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setPaletteIndex((i) =>
                    filteredCommands.length === 0
                      ? 0
                      : Math.min(i + 1, filteredCommands.length - 1),
                  );
                  return;
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setPaletteIndex((i) => Math.max(i - 1, 0));
                  return;
                }
                if (e.key === "Home") {
                  e.preventDefault();
                  setPaletteIndex(0);
                  return;
                }
                if (e.key === "End") {
                  e.preventDefault();
                  setPaletteIndex(Math.max(0, filteredCommands.length - 1));
                  return;
                }
                if (e.key === "Enter") {
                  e.preventDefault();
                  const cmd = filteredCommands[paletteIndex];
                  if (cmd) runCommand(cmd);
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
            <div ref={paletteListRef} style={{ marginTop: 10, maxHeight: 360, overflow: "auto" }}>
              {filteredCommands.length === 0 ? (
                <div style={{ opacity: 0.7, padding: "10px 2px" }}>Sin resultados</div>
              ) : (
                (() => {
                  const indexByCmd = new Map<string, number>(
                    filteredCommands.map((c, i) => [c.id, i]),
                  );
                  return COMMAND_GROUPS.map((group) => {
                    const items = filteredCommands.filter((c) => c.group === group);
                    if (items.length === 0) return null;
                    return (
                      <div key={group}>
                        <div className="catrip-cmd-group-title">{group}</div>
                        {items.map((cmd) => {
                          const idx = indexByCmd.get(cmd.id) ?? 0;
                          const isActive = idx === paletteIndex;
                          return (
                            <button
                              key={cmd.id}
                              type="button"
                              data-cmd-index={idx}
                              className={"catrip-cmd-row" + (isActive ? " is-active" : "")}
                              onMouseEnter={() => setPaletteIndex(idx)}
                              onClick={() => runCommand(cmd)}
                              style={{ marginBottom: 4 }}
                            >
                              <CommandIconView icon={cmd.icon} size={28} />
                              <div
                                style={{
                                  flex: 1,
                                  minWidth: 0,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 2,
                                }}
                              >
                                <span
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {cmd.label}
                                </span>
                                {cmd.description ? (
                                  <span
                                    style={{
                                      fontSize: 12,
                                      opacity: 0.7,
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {cmd.description}
                                  </span>
                                ) : null}
                              </div>
                              {cmd.shortcut ? <CommandShortcut shortcut={cmd.shortcut} /> : null}
                            </button>
                          );
                        })}
                      </div>
                    );
                  });
                })()
              )}
            </div>
            <div style={{ opacity: 0.7, fontSize: 12, marginTop: 8 }}>
              ↑ ↓ para navegar • Intro para ejecutar • Esc para cerrar
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
                type="button"
                className="catrip-btn"
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
                type="button"
                className="catrip-btn catrip-btn-accent"
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
