import type {
  AccountActivityMap,
  AccountDto,
  AccountSessionStatus,
  AccountStatusMap,
  AccountUnreadMap,
  AppApi,
  DevContextDto,
  RegisterProtocolResult,
  WhatsAppMediaDiagnosticsResult,
} from "../../preload/preload";

const PREVIEW_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#25D366"/><text x="32" y="40" text-anchor="middle" font-size="28" fill="#fff" font-family="sans-serif">C</text></svg>',
)}`;

const PREVIEW_ICON_ALT = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#128C7E"/><text x="32" y="40" text-anchor="middle" font-size="28" fill="#fff" font-family="sans-serif">W</text></svg>',
)}`;

type Listener = (...args: unknown[]) => void;

function createBus() {
  const map = new Map<string, Set<Listener>>();
  return {
    on(channel: string, cb: Listener) {
      let set = map.get(channel);
      if (!set) {
        set = new Set();
        map.set(channel, set);
      }
      set.add(cb);
      return () => set!.delete(cb);
    },
    emit(channel: string, ...args: unknown[]) {
      const set = map.get(channel);
      if (!set) return;
      for (const cb of set) cb(...args);
    },
  };
}

function defaultSettings() {
  return {
    version: 1,
    performance: { rendererProcessLimit: 3, gpuBoost: false, inhibitSleepDuringCall: true },
    network: { proxyEnabled: false, proxyRules: "" },
    general: {
      startMinimized: false,
      showSidebar: true,
      showMenuBar: true,
      zen: false,
      windowBounds: null,
      windowMaximized: false,
      downloadsDirectory: null,
      downloadsAskSaveAs: false,
      closeToTray: true,
      autoStart: false,
      trayUnreadBadge: true,
      dockUnreadBadge: true,
      trayBadgeManual: null,
      uiScale: 1,
      incomingLinkMode: "auto" as const,
      incomingLinkFixedAccountId: null,
      checkForUpdates: true,
      updateChannel: "stable" as const,
      openDownloadsWithDefaultApp: true,
    },
    notifications: {
      enabled: true,
      showAccountName: true,
      showPreview: true,
      doNotDisturb: false,
      playSound: true,
    },
  };
}

function defaultActivity(now: number): AccountActivityMap {
  return {
    "preview-personal": {
      unread: 3,
      status: "connected",
      lastSender: "María López",
      lastPreview: "¿Quedamos hoy a las 18:00?",
      lastActivityAt: now - 120_000,
      unreadChats: [
        {
          name: "María López",
          preview: "¿Quedamos hoy a las 18:00?",
          unreadCount: 2,
        },
        { name: "Grupo Familia", preview: "Pedro: Fotos del viaje", unreadCount: 1 },
      ],
    },
    "preview-trabajo": {
      unread: 5,
      status: "connected",
      lastSender: "Cliente ACME",
      lastPreview: "Necesitamos confirmar el pedido #4421",
      lastActivityAt: now - 45_000,
      unreadChats: [
        {
          name: "Cliente ACME",
          preview: "Necesitamos confirmar el pedido #4421",
          unreadCount: 3,
        },
        { name: "Equipo Ventas", preview: "Ana: Actualicé la propuesta", unreadCount: 2 },
      ],
    },
  };
}

export function createBrowserPreviewApi(appVersion: string): AppApi {
  const bus = createBus();
  const now = Date.now();
  let accounts: AccountDto[] = [
    {
      id: "preview-personal",
      label: "Personal (preview)",
      icon: PREVIEW_ICON,
      notificationsEnabled: true,
    },
    {
      id: "preview-trabajo",
      label: "Trabajo (preview)",
      icon: PREVIEW_ICON_ALT,
      notificationsEnabled: true,
    },
  ];
  let activeId: string | null = "preview-personal";
  let unread: AccountUnreadMap = { "preview-personal": 3, "preview-trabajo": 5 };
  let status: AccountStatusMap = {
    "preview-personal": "connected",
    "preview-trabajo": "connected",
  };
  let activity = defaultActivity(now);
  let settings = defaultSettings();
  let zen = false;
  let mode: "browser" | "settings" = "browser";

  const noop = () => undefined;
  const ok = async () => true;
  const nullOk = async () => null;

  const previewDevContext = (): DevContextDto => ({
    appVersion,
    electronVersion: "preview",
    chromeVersion: "preview",
    nodeVersion: "preview",
    platform: "browser",
    arch: "preview",
    isPackaged: false,
    userData: "(solo preview — usa npm run dev + ventana Electron)",
    e2eMode: false,
    catripEnv: { CATRIP_BROWSER_PREVIEW: "1" },
  });

  const api: AppApi = {
    getVersion: async () => appVersion,
    getDevContext: async () => previewDevContext(),
    listAccounts: async () => accounts.slice(),
    getAccountsUnread: async () => ({ ...unread }),
    onAccountsUnreadChanged: (cb) => {
      const w = (m: AccountUnreadMap) => cb(m);
      return bus.on("accounts:unreadChanged", w as Listener);
    },
    getAccountsStatus: async () => ({ ...status }),
    onAccountsStatusChanged: (cb) => {
      const w = (m: AccountStatusMap) => cb(m);
      return bus.on("accounts:statusChanged", w as Listener);
    },
    getAccountsActivity: async () => structuredClone(activity),
    onAccountsActivityChanged: (cb) => {
      const w = (m: AccountActivityMap) => cb(m);
      return bus.on("accounts:activityChanged", w as Listener);
    },
    createAccount: async (label?: string) => {
      const acc: AccountDto = {
        id: `preview-${crypto.randomUUID().slice(0, 8)}`,
        label: label?.trim() || `Cuenta ${accounts.length + 1}`,
        icon: PREVIEW_ICON,
        notificationsEnabled: true,
      };
      accounts = [...accounts, acc];
      status = { ...status, [acc.id]: "qr" as AccountSessionStatus };
      unread = { ...unread, [acc.id]: 0 };
      bus.emit("accounts:listChanged", accounts);
      bus.emit("accounts:statusChanged", status);
      return acc;
    },
    createAccountV2: async (payload) => api.createAccount(payload?.label),
    regenerateAccountIcon: async (id) => accounts.find((a) => a.id === id) ?? null,
    renameAccount: async (id, nextLabel) => {
      accounts = accounts.map((a) => (a.id === id ? { ...a, label: nextLabel.trim() || a.label } : a));
      bus.emit("accounts:listChanged", accounts);
      return accounts.find((a) => a.id === id) ?? null;
    },
    getAccountIconVariants: async () => [PREVIEW_ICON, PREVIEW_ICON_ALT],
    setAccountIconVariant: async (id) => accounts.find((a) => a.id === id) ?? null,
    setAccountNotificationsEnabled: async (id, enabled) => {
      accounts = accounts.map((a) => (a.id === id ? { ...a, notificationsEnabled: enabled } : a));
      bus.emit("accounts:listChanged", accounts);
      return accounts.find((a) => a.id === id) ?? null;
    },
    deleteAccount: async (id) => {
      if (!accounts.some((a) => a.id === id)) return false;
      accounts = accounts.filter((a) => a.id !== id);
      if (activeId === id) activeId = accounts[0]?.id ?? null;
      bus.emit("accounts:listChanged", accounts);
      bus.emit("accounts:activeChanged", activeId);
      return true;
    },
    setActiveAccount: async (id) => {
      activeId = id;
      bus.emit("accounts:activeChanged", id);
    },
    reorderAccounts: async (orderedIds) => {
      const map = new Map(accounts.map((a) => [a.id, a]));
      const next = orderedIds.map((id) => map.get(id)).filter(Boolean) as AccountDto[];
      if (next.length !== accounts.length) return false;
      accounts = next;
      bus.emit("accounts:listChanged", accounts);
      return true;
    },
    getActiveAccountId: async () => activeId,
    onAccountsListChanged: (cb) => bus.on("accounts:listChanged", cb as Listener),
    onActiveAccountChanged: (cb) => bus.on("accounts:activeChanged", cb as Listener),
    openChatByPhone: async () => {
      console.info("[catrip-preview] openChatByPhone — solo disponible en Electron");
    },
    openChatByName: async (_accountId, chatName) => {
      console.info("[catrip-preview] openChatByName — solo disponible en Electron:", chatName);
    },
    triggerNewChat: async () => {
      console.info("[catrip-preview] triggerNewChat — solo disponible en Electron");
    },
    confirmIncomingLinkAccount: ok,
    cancelIncomingLink: ok,
    onPickAccountForIncomingLink: (cb) =>
      bus.on("ui:pickAccountForIncomingLink", cb as Listener),
    e2eGetLastIncomingNavigation: nullOk,
    e2eParseWhatsAppUrl: async () => null,
    e2eSimulateIncomingUrl: ok,
    getSettings: async () => structuredClone(settings),
    setSettings: async (next) => {
      settings = next as typeof settings;
    },
    setChromeMetrics: async () => undefined,
    setRendererModalOpen: async () => undefined,
    setTrayBadgeCount: async () => undefined,
    setZenMode: async (enabled) => {
      zen = enabled;
      bus.emit("ui:zenChanged", enabled);
    },
    setMode: async (next) => {
      mode = next;
      bus.emit("ui:modeChanged", next);
    },
    onModeChanged: (cb) => bus.on("ui:modeChanged", cb as Listener),
    onOpenSettings: (cb) => bus.on("ui:openSettings", cb as Listener),
    onOpenQuickSwitcher: (cb) => bus.on("ui:openQuickSwitcher", cb as Listener),
    onOpenActivityCenter: (cb) => bus.on("ui:openActivityCenter", cb as Listener),
    onOpenPendingInbox: (cb) => bus.on("ui:openPendingInbox", cb as Listener),
    onOpenPhoneChat: (cb) => bus.on("ui:openPhoneChat", cb as Listener),
    onZenChanged: (cb) => bus.on("ui:zenChanged", cb as Listener),
    onOpenShortcutsHelp: (cb) => bus.on("ui:openShortcutsHelp", cb as Listener),
    onOpenAbout: (cb) => bus.on("ui:openAbout", cb as Listener),
    runWhatsAppMediaDiagnostics: async (): Promise<WhatsAppMediaDiagnosticsResult> => ({
      ok: false,
      code: "preview",
      message: "Diagnóstico de medios no disponible en modo preview del navegador.",
    }),
    selectDownloadsDirectory: nullOk,
    clearHttpCacheAllAccounts: ok,
    registerWhatsAppProtocol: async (): Promise<RegisterProtocolResult> => ({
      ok: false,
      message: "Registro de protocolo solo disponible en Electron.",
    }),
    onShowUpdateDialog: (cb) => bus.on("ui:showUpdateDialog", cb as Listener),
    respondUpdateDialog: async () => {},
    previewUpdateDialog: async () => false,
  };

  void zen;
  void mode;
  void noop;

  return api;
}
