import React from "react";
import { useTranslation } from "react-i18next";
import { Overlay } from "./Overlay";
import SettingsView, { type SettingsPage } from "./SettingsView";
import SystemIconImg from "./SystemIconImg";
import AccountAvatar from "./AccountAvatar";
import { extractAccountAccentRgb } from "./accountColors";
import {
  buildCommands,
  buildChatSearchCommands,
  filterCommands,
  COMMAND_GROUPS,
  commandGroupLabel,
  type Command,
  type CommandIcon,
} from "./commands";
import { filterChatSearchItems } from "../../main/chatSearchModel";
import type {
  AccountSessionStatus,
  AppApi,
  AccountActivityMap,
  UpdateDialogPayload,
} from "../../preload/preload";
import ActivityCenter from "./ActivityCenter";
import PendingInbox from "./PendingInbox";
import UpdateDialog from "./UpdateDialog";
import UserManual from "./UserManual";
import { pickTopUrgentChats } from "../../main/pendingInboxModel";
import { sessionStatusLabel } from "../../shared/i18n/formatters";
import { changeRendererLanguage } from "../i18n";

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
  color: "var(--catrip-accent)",
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
        background: "var(--catrip-accent-softer)",
        border: "1px solid rgb(var(--catrip-accent-rgb) / 0.3)",
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
  const { t, i18n } = useTranslation();
  /** Versión de la raíz `package.json` inyectada en `vite build` (coherente con el artefacto empaquetado). */
  const version = __CATRIP_APP_VERSION__;
  const [accounts, setAccounts] = React.useState<
    { id: string; label: string; icon: string; notificationsEnabled?: boolean }[]
  >([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [unreadByAccount, setUnreadByAccount] = React.useState<Record<string, number>>({});
  const [accountStatusById, setAccountStatusById] = React.useState<
    Record<string, AccountSessionStatus>
  >({});
  const [suspendedByAccount, setSuspendedByAccount] = React.useState<Record<string, boolean>>({});
  const [activityByAccount, setActivityByAccount] = React.useState<AccountActivityMap>({});
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
  const [activityOpen, setActivityOpen] = React.useState(false);
  const [pendingInboxOpen, setPendingInboxOpen] = React.useState(false);
  const [quickQuery, setQuickQuery] = React.useState("");
  const quickInputRef = React.useRef<HTMLInputElement | null>(null);
  const [phoneOpen, setPhoneOpen] = React.useState(false);
  const [phoneValue, setPhoneValue] = React.useState("+");
  const phoneInputRef = React.useRef<HTMLInputElement | null>(null);
  const [incomingLinkOpen, setIncomingLinkOpen] = React.useState(false);
  const [incomingLinkPreview, setIncomingLinkPreview] = React.useState("");
  const [incomingLinkHasText, setIncomingLinkHasText] = React.useState(false);
  const sidebarWidthPx = 72;
  const [zen, setZen] = React.useState(false);
  const [mode, setMode] = React.useState<"browser" | "settings">("browser");
  const [settingsPage, setSettingsPage] = React.useState<SettingsPage>("general");
  const [settings, setSettings] = React.useState<any>(null);
  const [shortcutsOpen, setShortcutsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);
  const [manualOpen, setManualOpen] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState<UpdateDialogPayload | null>(null);
  const [paletteIndex, setPaletteIndex] = React.useState(0);
  const paletteListRef = React.useRef<HTMLDivElement | null>(null);

  const enterSettings = React.useCallback((page: SettingsPage = "general") => {
    setSettingsPage(page);
    setMode("settings");
  }, []);

  const applySettingsRemote = React.useCallback(
    (next: any) => {
      setSettings(next);
      void window.catrip.setSettings(next);
      const prevLang = settings?.general?.language;
      const nextLang = next?.general?.language;
      if (nextLang && nextLang !== prevLang) {
        void changeRendererLanguage(nextLang, navigator.language);
      }
    },
    [settings?.general?.language],
  );

  React.useEffect(() => {
    let mounted = true;
    const api = window.catrip;
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
    api
      .getAccountsStatus()
      .then((m) => mounted && setAccountStatusById(m ?? {}))
      .catch(() => {});
    api
      .getAccountsActivity()
      .then((m) => mounted && setActivityByAccount(m ?? {}))
      .catch(() => {});
    api
      .getAccountsSuspended()
      .then((m) => mounted && setSuspendedByAccount(m ?? {}))
      .catch(() => {});

    const offList = api.onAccountsListChanged((a) => setAccounts(a));
    const offActive = api.onActiveAccountChanged((id) => setActiveId(id));
    const offUnread = api.onAccountsUnreadChanged((m) => setUnreadByAccount(m ?? {}));
    const offStatus = api.onAccountsStatusChanged((m) => setAccountStatusById(m ?? {}));
    const offActivity = api.onAccountsActivityChanged((m) => setActivityByAccount(m ?? {}));
    const offSuspended = api.onAccountsSuspendedChanged((m) => setSuspendedByAccount(m ?? {}));
    return () => {
      offList();
      offActive();
      offUnread();
      offStatus();
      offActivity();
      offSuspended();
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
    const off = window.catrip.onOpenSettings(() => {
      if (import.meta.env.DEV) console.log("[catrip-embed-renderer]", "menu:openSettings");
      enterSettings("general");
    });
    return () => off();
  }, [enterSettings]);

  React.useEffect(() => {
    const offMode = window.catrip.onModeChanged((next) => setMode(next));
    return () => offMode();
  }, []);

  React.useEffect(() => {
    const offQuick = window.catrip.onOpenQuickSwitcher(() => {
      setQuickQuery("");
      setQuickOpen(true);
      setPhoneOpen(false);
      setActivityOpen(false);
    });
    const offActivity = window.catrip.onOpenActivityCenter(() => {
      setActivityOpen(true);
      setQuickOpen(false);
      setPhoneOpen(false);
      setPendingInboxOpen(false);
    });
    const offPending = window.catrip.onOpenPendingInbox(() => {
      setPendingInboxOpen(true);
      setQuickOpen(false);
      setPhoneOpen(false);
      setActivityOpen(false);
    });
    const offUrgent = window.catrip.onOpenUrgentNow(() => {
      setPendingInboxOpen(true);
      setQuickOpen(false);
      setPhoneOpen(false);
      setActivityOpen(false);
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
    const offAbout = window.catrip.onOpenAbout(() => {
      if (import.meta.env.DEV) console.log("[catrip-embed-renderer]", "menu:openAbout");
      setAboutOpen(true);
    });
    const offManual = window.catrip.onOpenUserManual(() => {
      if (import.meta.env.DEV) console.log("[catrip-embed-renderer]", "menu:openUserManual");
      setManualOpen(true);
      setQuickOpen(false);
      setPhoneOpen(false);
    });
    const offIncoming = window.catrip.onPickAccountForIncomingLink((payload) => {
      setIncomingLinkPreview(payload.preview || "");
      setIncomingLinkHasText(!!payload.hasText);
      setIncomingLinkOpen(true);
      setQuickOpen(false);
      setPhoneOpen(false);
    });
    const offUpdate = window.catrip.onShowUpdateDialog((payload) => {
      setUpdateDialog(payload);
      setQuickOpen(false);
      setPhoneOpen(false);
      setActivityOpen(false);
      setPendingInboxOpen(false);
    });
    return () => {
      offQuick();
      offActivity();
      offPending();
      offUrgent();
      offPhone();
      offZen();
      offShortcuts();
      offAbout();
      offManual();
      offIncoming();
      offUpdate();
    };
  }, []);

  const dismissUpdateDialog = React.useCallback(() => {
    setUpdateDialog((current) => {
      if (current) void window.catrip.respondUpdateDialog("later", current.releaseUrl);
      return null;
    });
  }, []);

  const handleUpdateDialogAction = React.useCallback((buttonId: string) => {
    setUpdateDialog((current) => {
      if (!current) return null;
      if (buttonId === "open-release-url") {
        void window.catrip.respondUpdateDialog(buttonId, current.releaseUrl);
        return current;
      }
      void window.catrip.respondUpdateDialog(buttonId, current.releaseUrl);
      return null;
    });
  }, []);

  const updateDialogOverlay =
    updateDialog != null ? (
      <UpdateDialog
        payload={updateDialog}
        onAction={handleUpdateDialogAction}
        onDismiss={dismissUpdateDialog}
      />
    ) : null;

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
      if (mode === "browser" && k === "a" && e.shiftKey && !e.altKey) {
        e.preventDefault();
        setPendingInboxOpen((open) => !open);
        setQuickOpen(false);
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
    setActivityOpen(false);
  }, []);

  const openActivityCenter = React.useCallback(() => {
    setActivityOpen(true);
    setQuickOpen(false);
    setPhoneOpen(false);
    setPendingInboxOpen(false);
  }, []);

  const openPendingInbox = React.useCallback(() => {
    setPendingInboxOpen(true);
    setQuickOpen(false);
    setPhoneOpen(false);
    setActivityOpen(false);
  }, []);

  const openUrgentNow = React.useCallback(() => {
    setPendingInboxOpen((open) => !open);
    setQuickOpen(false);
    setPhoneOpen(false);
    setActivityOpen(false);
  }, []);

  const urgentTopItems = React.useMemo(
    () => pickTopUrgentChats(accounts, activityByAccount, 3),
    [accounts, activityByAccount],
  );

  const hasUrgentChats = urgentTopItems.length > 0;

  const openChatFromPending = React.useCallback((accountId: string, chatName: string) => {
    setActiveId(accountId);
    void window.catrip.setActiveAccount(accountId);
    void window.catrip.openChatByName(accountId, chatName);
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
        t,
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
        openActivityCenter,
        openPendingInbox,
        openUrgentNow,
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
      openActivityCenter,
      openPendingInbox,
      openUrgentNow,
      applySettingsRemote,
      t,
      i18n.language,
    ],
  );

  const openChatFromPalette = React.useCallback((accountId: string, chatName: string) => {
    setActiveId(accountId);
    void window.catrip.setActiveAccount(accountId);
    void window.catrip.openChatByName(accountId, chatName);
  }, []);

  const chatSearchCommands = React.useMemo(() => {
    if (!quickQuery.trim()) return [];
    const matches = filterChatSearchItems(accounts, activityByAccount, quickQuery);
    return buildChatSearchCommands(matches, openChatFromPalette, t);
  }, [accounts, activityByAccount, quickQuery, openChatFromPalette, t]);

  const filteredCommands = React.useMemo(() => {
    const actionMatches = filterCommands(commands, quickQuery);
    if (chatSearchCommands.length === 0) return actionMatches;
    return [...chatSearchCommands, ...actionMatches];
  }, [commands, quickQuery, chatSearchCommands]);

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

  React.useLayoutEffect(() => {
    if (mode === "settings" && zen) {
      setZen(false);
      void window.catrip.setZenMode(false);
    }
    const modalBlocking =
      updateDialog != null ||
      manualOpen ||
      (mode === "browser" &&
        (quickOpen ||
          phoneOpen ||
          incomingLinkOpen ||
          shortcutsOpen ||
          aboutOpen ||
          activityOpen ||
          pendingInboxOpen));
    if (import.meta.env.DEV) {
      console.log("[catrip-embed-renderer]", "setMode+modal", { mode, modalBlocking });
    }
    void (async () => {
      await window.catrip.setMode(mode);
      await window.catrip.setRendererModalOpen(modalBlocking);
    })();
  }, [
    mode,
    quickOpen,
    phoneOpen,
    incomingLinkOpen,
    shortcutsOpen,
    aboutOpen,
    activityOpen,
    pendingInboxOpen,
    updateDialog,
    manualOpen,
    zen,
  ]);

  const manualOverlay = manualOpen ? <UserManual onClose={() => setManualOpen(false)} /> : null;

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
            {t("app.shortcuts.title")}
          </div>
          <dl style={{ margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <dt style={{ ...modalSectionTitle, marginTop: 0 }}>{t("app.shortcuts.file")}</dt>
            <ShortcutRow keys="Ctrl+P">{t("app.shortcuts.settings")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+W">{t("app.shortcuts.hideWindow")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+Q">{t("app.shortcuts.quit")}</ShortcutRow>
            <dt style={modalSectionTitle}>{t("app.shortcuts.view")}</dt>
            <ShortcutRow keys="Ctrl+K">{t("app.shortcuts.quickSwitch")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+Shift+A">{t("app.shortcuts.urgentNow")}</ShortcutRow>
            <ShortcutRow keys="F11">{t("app.shortcuts.fullscreen")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+Shift+Z">{t("app.shortcuts.zenMode")}</ShortcutRow>
            <ShortcutRow keys="Esc">{t("app.shortcuts.exitZen")}</ShortcutRow>
            <dt style={modalSectionTitle}>{t("app.shortcuts.chat")}</dt>
            <ShortcutRow keys="F5">{t("app.shortcuts.reload")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+N">{t("app.shortcuts.newChat")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+M">{t("app.shortcuts.phoneChat")}</ShortcutRow>
            <dt style={modalSectionTitle}>{t("app.shortcuts.accounts")}</dt>
            <ShortcutRow keys="Ctrl+U">{t("app.shortcuts.newAccount")}</ShortcutRow>
            <ShortcutRow keys="Ctrl+1–9">{t("app.shortcuts.switchAccount")}</ShortcutRow>
          </dl>
          <div
            style={{
              marginTop: 20,
              paddingTop: 14,
              borderTop: "1px solid rgba(255,255,255,0.12)",
              fontSize: 12,
              color: "var(--catrip-text-hint)",
              lineHeight: 1.45,
            }}
          >
            {t("app.shortcuts.footer")}
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
              {t("app.about.title")}
            </div>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#dce4e4", lineHeight: 1.65 }}>
            {t("app.about.description")}
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 10,
              background: "var(--catrip-accent-soft)",
              border: "1px solid var(--catrip-accent-border)",
              color: "#c8f5dc",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {t("common.version")} <span style={{ color: "#ffffff" }}>{version || "…"}</span>
          </div>
          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--catrip-text-hint)",
                marginBottom: 10,
              }}
            >
              {t("app.about.developerHeading")}
            </div>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "#dce4e4", lineHeight: 1.5 }}>
              {t("app.about.author")}:{" "}
              <a
                href="https://github.com/alktrip"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#7dd3a8", textDecoration: "underline" }}
              >
                {t("app.about.authorLink")}
              </a>
            </p>
            <p
              style={{
                margin: "0 0 8px",
                fontSize: 12,
                color: "var(--catrip-text-hint)",
                lineHeight: 1.5,
              }}
            >
              {t("app.about.copyright")}
            </p>
            <a
              href="https://github.com/alktrip/catrip-multichat-electron"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "#7dd3a8", textDecoration: "underline" }}
            >
              {t("app.about.projectLink")}
            </a>
          </div>
          <p className="catrip-text-hint" style={{ margin: "18px 0 0", lineHeight: 1.55 }}>
            {t("app.about.electronNote")}
          </p>
          <p className="catrip-text-hint" style={{ margin: "12px 0 0", lineHeight: 1.55 }}>
            {t("app.about.inspired")}{" "}
            <a
              href="https://github.com/rafatosta/zapzap"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#7dd3a8", textDecoration: "underline" }}
            >
              ZapZap
            </a>
            .
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
        {updateDialogOverlay}
        {manualOverlay}
        {helpOverlays}
      </>
    );
  }

  return (
    <>
      <div style={{ height: "100vh", display: "flex", background: "#1d1f1f" }}>
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
                const status = accountStatusById[a.id] ?? "loading";
                const isSuspended = suspendedByAccount[a.id] === true;
                const statusLabel = sessionStatusLabel(t, status);
                const unreadPart = showUnreadDot
                  ? t("commands.unreadSuffix", { count: unread })
                  : "";
                const suspendPart = isSuspended ? t("app.rail.suspended") : "";
                const tooltip = t("app.rail.tooltip", {
                  label: a.label,
                  status: statusLabel,
                  unread: unreadPart,
                  suspended: suspendPart,
                });
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
                        opacity: isDragging ? 0.35 : isSuspended && !selected ? 0.55 : 1,
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
                            aria-label={t("common.messagesUnread", { count: unread })}
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
                title={accounts.length === 0 ? t("app.rail.createFirst") : t("app.rail.newAccount")}
                onClick={() => void window.catrip.createAccount()}
              >
                <SystemIconImg name="new-account" size={22} />
              </button>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                className="catrip-rail-action-btn"
                title={t("app.rail.phoneChat")}
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
                title={t("app.rail.newChat")}
                onClick={() => {
                  void window.catrip.triggerNewChat();
                }}
              >
                <SystemIconImg name="new-chat" size={22} />
              </button>
              <div className="catrip-rail-urgent-anchor">
                <button
                  type="button"
                  className={`catrip-rail-action-btn${pendingInboxOpen ? " is-active" : ""}`}
                  title={t("app.rail.urgentNow")}
                  aria-expanded={pendingInboxOpen}
                  onClick={() => openUrgentNow()}
                >
                  <SystemIconImg name="urgent-now" size={22} />
                  {hasUrgentChats ? <span className="catrip-rail-urgent-dot" aria-hidden /> : null}
                </button>
              </div>
              <button
                type="button"
                className="catrip-rail-action-btn"
                title={t("app.rail.pending")}
                onClick={() => openPendingInbox()}
              >
                <span
                  aria-hidden
                  style={{
                    fontSize: 16,
                    lineHeight: 1,
                    fontWeight: 700,
                    color: "#dce4e4",
                    userSelect: "none",
                  }}
                >
                  ✉
                </span>
              </button>
              <button
                type="button"
                className="catrip-rail-action-btn"
                title={t("app.rail.activity")}
                onClick={() => openActivityCenter()}
              >
                <span
                  aria-hidden
                  style={{
                    fontSize: 17,
                    lineHeight: 1,
                    fontWeight: 700,
                    color: "#dce4e4",
                    userSelect: "none",
                  }}
                >
                  ▤
                </span>
              </button>
              <div style={{ height: 1, background: "rgba(255,255,255,0.10)" }} />
              <button
                type="button"
                className="catrip-rail-action-btn"
                title={t("app.rail.settings")}
                onClick={() => {
                  enterSettings("general");
                }}
              >
                <SystemIconImg name="open-settings" size={22} />
              </button>
              <button
                type="button"
                className="catrip-rail-action-btn"
                title={t("app.rail.zen")}
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
          <div
            className="catrip-onboarding-wrap"
            role="region"
            aria-label={t("app.onboarding.aria")}
          >
            <div className="catrip-onboarding-card">
              <img
                src={`${import.meta.env.BASE_URL}org.k3p.catrip-multichat.svg`}
                width={88}
                height={88}
                alt=""
                draggable={false}
                className="catrip-onboarding-logo"
              />
              <h1 className="catrip-onboarding-title">{t("app.onboarding.title")}</h1>
              <p className="catrip-onboarding-subtitle">{t("app.onboarding.subtitle")}</p>
              <button
                type="button"
                className="catrip-btn catrip-btn-accent"
                onClick={() => void window.catrip.createAccount()}
                style={{
                  marginTop: 6,
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "var(--catrip-accent)",
                  border: "1px solid rgb(var(--catrip-accent-rgb) / 0.85)",
                  borderRadius: 12,
                  padding: "12px 22px",
                  cursor: "pointer",
                  letterSpacing: "-0.005em",
                }}
              >
                {t("app.onboarding.addFirst")}
              </button>
              <p className="catrip-onboarding-hint">{t("app.onboarding.hint")}</p>
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
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{t("app.palette.title")}</div>
            <input
              ref={quickInputRef}
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder={t("app.palette.placeholder")}
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
                <div className="catrip-text-hint" style={{ padding: "10px 2px" }}>
                  {t("common.noResults")}
                </div>
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
                        <div className="catrip-cmd-group-title">{commandGroupLabel(t, group)}</div>
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
                                    className="catrip-text-hint"
                                    style={{
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
            <div className="catrip-text-hint" style={{ marginTop: 8 }}>
              {t("app.palette.hint")}
            </div>
          </div>
        </Overlay>

        <Overlay open={activityOpen} onClose={() => setActivityOpen(false)}>
          <ActivityCenter
            accounts={accounts}
            activeId={activeId}
            activityByAccount={activityByAccount}
            onSelectAccount={(id) => {
              setActivityOpen(false);
              setActiveId(id);
              void window.catrip.setActiveAccount(id);
            }}
          />
        </Overlay>

        <Overlay open={pendingInboxOpen} onClose={() => setPendingInboxOpen(false)}>
          <PendingInbox
            accounts={accounts}
            activityByAccount={activityByAccount}
            onOpenChat={(accountId, chatName) => {
              setPendingInboxOpen(false);
              openChatFromPending(accountId, chatName);
            }}
          />
        </Overlay>

        {updateDialogOverlay}

        {manualOverlay}

        <Overlay
          open={incomingLinkOpen}
          onClose={() => {
            setIncomingLinkOpen(false);
            void window.catrip.cancelIncomingLink();
          }}
        >
          <div style={{ padding: 12, minWidth: 320 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{t("app.incomingLink.title")}</div>
            <div style={{ opacity: 0.85, fontSize: 13, marginBottom: 10 }}>
              {t("app.incomingLink.destination")} <strong>{incomingLinkPreview}</strong>
              {incomingLinkHasText ? (
                <span className="catrip-text-hint" style={{ display: "block", marginTop: 4 }}>
                  {t("app.incomingLink.preloaded")}
                </span>
              ) : null}
            </div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>
              {t("app.incomingLink.chooseAccount")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {accounts.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className="catrip-btn"
                  onClick={() => {
                    setIncomingLinkOpen(false);
                    void window.catrip.confirmIncomingLinkAccount(a.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    borderRadius: 10,
                    padding: "10px 12px",
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.04)",
                    color: "inherit",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <AccountAvatar icon={a.icon} labelFallback={a.label} size={36} />
                  <span>{a.label}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button
                type="button"
                className="catrip-btn"
                onClick={() => {
                  setIncomingLinkOpen(false);
                  void window.catrip.cancelIncomingLink();
                }}
                style={{
                  borderRadius: 10,
                  padding: "8px 12px",
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.04)",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {t("common.cancel")}
              </button>
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
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{t("app.phone.title")}</div>
            <div style={{ opacity: 0.8, fontSize: 13, marginBottom: 8 }}>{t("app.phone.hint")}</div>
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
                {t("common.cancel")}
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
                  border: "1px solid rgb(var(--catrip-accent-rgb) / 0.5)",
                  background: "var(--catrip-accent-muted)",
                  color: "inherit",
                  cursor: "pointer",
                }}
              >
                {t("common.accept")}
              </button>
            </div>
            <div className="catrip-text-hint" style={{ marginTop: 8 }}>
              {t("app.phone.footer")}
            </div>
          </div>
        </Overlay>
      </div>
      {helpOverlays}
    </>
  );
}
