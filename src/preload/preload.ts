import { contextBridge, ipcRenderer } from "electron";

export type AccountDto = {
  id: string;
  label: string;
  icon: string;
  notificationsEnabled?: boolean;
};

export type AccountUnreadMap = Record<string, number>;

export type AccountSessionStatus = "loading" | "qr" | "connected" | "offline";
export type AccountStatusMap = Record<string, AccountSessionStatus>;

export type RegisterProtocolResult = { ok: boolean; message: string };

export type AppApi = {
  getVersion: () => Promise<string>;
  listAccounts: () => Promise<AccountDto[]>;
  getAccountsUnread: () => Promise<AccountUnreadMap>;
  onAccountsUnreadChanged: (cb: (map: AccountUnreadMap) => void) => () => void;
  getAccountsStatus: () => Promise<AccountStatusMap>;
  onAccountsStatusChanged: (cb: (map: AccountStatusMap) => void) => () => void;
  createAccount: (label?: string) => Promise<AccountDto>;
  createAccountV2: (payload?: { label?: string; icon?: unknown }) => Promise<AccountDto>;
  regenerateAccountIcon: (id: string) => Promise<AccountDto | null>;
  renameAccount: (id: string, nextLabel: string) => Promise<AccountDto | null>;
  getAccountIconVariants: (id: string) => Promise<string[] | null>;
  setAccountIconVariant: (id: string, idx: number) => Promise<AccountDto | null>;
  setAccountNotificationsEnabled: (id: string, enabled: boolean) => Promise<AccountDto | null>;
  deleteAccount: (id: string) => Promise<boolean>;
  setActiveAccount: (id: string) => Promise<void>;
  reorderAccounts: (orderedIds: string[]) => Promise<boolean>;
  getActiveAccountId: () => Promise<string | null>;
  onAccountsListChanged: (cb: (accounts: AccountDto[]) => void) => () => void;
  onActiveAccountChanged: (cb: (id: string | null) => void) => () => void;
  openChatByPhone: (phoneRaw: string) => Promise<void>;
  triggerNewChat: () => Promise<void>;
  confirmIncomingLinkAccount: (accountId: string) => Promise<boolean>;
  cancelIncomingLink: () => Promise<boolean>;
  onPickAccountForIncomingLink: (
    cb: (payload: { preview: string; hasText?: boolean }) => void,
  ) => () => void;
  e2eGetLastIncomingNavigation: () => Promise<{ accountId: string; url: string } | null>;
  e2eParseWhatsAppUrl: (raw: string) => Promise<unknown>;
  e2eSimulateIncomingUrl: (raw: string) => Promise<boolean>;
  getSettings: () => Promise<unknown>;
  setSettings: (next: unknown) => Promise<void>;
  setChromeMetrics: (m: { sidebarWidth: number; topHeight: number }) => Promise<void>;
  setRendererModalOpen: (open: boolean) => Promise<void>;
  setTrayBadgeCount: (count: number) => Promise<void>;
  setZenMode: (enabled: boolean) => Promise<void>;
  setMode: (mode: "browser" | "settings") => Promise<void>;
  onModeChanged: (cb: (mode: "browser" | "settings") => void) => () => void;
  onOpenSettings: (cb: () => void) => () => void;
  onOpenQuickSwitcher: (cb: () => void) => () => void;
  onOpenPhoneChat: (cb: () => void) => () => void;
  onZenChanged: (cb: (enabled: boolean) => void) => () => void;
  onOpenShortcutsHelp: (cb: () => void) => () => void;
  onOpenAbout: (cb: () => void) => () => void;
  runWhatsAppMediaDiagnostics: () => Promise<WhatsAppMediaDiagnosticsResult>;
  selectDownloadsDirectory: () => Promise<string | null>;
  clearHttpCacheAllAccounts: () => Promise<boolean>;
  registerWhatsAppProtocol: () => Promise<RegisterProtocolResult>;
};

export type WhatsAppMediaDiagnosticsResult =
  | {
      ok: true;
      data: Record<string, unknown>;
    }
  | {
      ok: false;
      code: string;
      message: string;
      url?: string;
    };

const api: AppApi = {
  getVersion: () => ipcRenderer.invoke("app:getVersion"),
  listAccounts: () => ipcRenderer.invoke("accounts:list"),
  getAccountsUnread: () => ipcRenderer.invoke("accounts:getUnread"),
  onAccountsUnreadChanged: (cb) => {
    const listener = (_evt: unknown, map: AccountUnreadMap) => cb(map ?? {});
    ipcRenderer.on("accounts:unreadChanged", listener);
    return () => ipcRenderer.removeListener("accounts:unreadChanged", listener);
  },
  getAccountsStatus: () =>
    ipcRenderer.invoke("accounts:getStatus") as Promise<AccountStatusMap>,
  onAccountsStatusChanged: (cb) => {
    const listener = (_evt: unknown, map: AccountStatusMap) => cb(map ?? {});
    ipcRenderer.on("accounts:statusChanged", listener);
    return () => ipcRenderer.removeListener("accounts:statusChanged", listener);
  },
  createAccount: (label?: string) => ipcRenderer.invoke("accounts:create", label),
  createAccountV2: (payload?: { label?: string; icon?: unknown }) =>
    ipcRenderer.invoke("accounts:createV2", payload),
  regenerateAccountIcon: (id: string) => ipcRenderer.invoke("accounts:regenerateIcon", id),
  renameAccount: (id: string, nextLabel: string) =>
    ipcRenderer.invoke("accounts:rename", id, nextLabel),
  getAccountIconVariants: (id: string) => ipcRenderer.invoke("accounts:getIconVariants", id),
  setAccountIconVariant: (id: string, idx: number) =>
    ipcRenderer.invoke("accounts:setIconVariant", id, idx),
  setAccountNotificationsEnabled: (id: string, enabled: boolean) =>
    ipcRenderer.invoke("accounts:setNotificationsEnabled", id, enabled),
  deleteAccount: (id: string) => ipcRenderer.invoke("accounts:delete", id) as Promise<boolean>,
  setActiveAccount: (id: string) => ipcRenderer.invoke("accounts:setActive", id),
  reorderAccounts: (orderedIds: string[]) =>
    ipcRenderer.invoke("accounts:reorder", orderedIds) as Promise<boolean>,
  getActiveAccountId: () => ipcRenderer.invoke("accounts:getActiveId"),
  onAccountsListChanged: (cb) => {
    const listener = (_evt: unknown, accounts: AccountDto[]) => cb(accounts);
    ipcRenderer.on("accounts:listChanged", listener);
    return () => ipcRenderer.removeListener("accounts:listChanged", listener);
  },
  onActiveAccountChanged: (cb) => {
    const listener = (_evt: unknown, id: string | null) => cb(id);
    ipcRenderer.on("accounts:activeChanged", listener);
    return () => ipcRenderer.removeListener("accounts:activeChanged", listener);
  },
  openChatByPhone: (phoneRaw: string) => ipcRenderer.invoke("chat:openByPhone", phoneRaw),
  triggerNewChat: () => ipcRenderer.invoke("chat:triggerNewChat"),
  confirmIncomingLinkAccount: (accountId: string) =>
    ipcRenderer.invoke("incomingLink:confirmAccount", accountId),
  cancelIncomingLink: () => ipcRenderer.invoke("incomingLink:cancel"),
  onPickAccountForIncomingLink: (cb) => {
    const listener = (_evt: unknown, payload: { preview: string; hasText?: boolean }) =>
      cb(payload ?? { preview: "" });
    ipcRenderer.on("ui:pickAccountForIncomingLink", listener);
    return () => ipcRenderer.removeListener("ui:pickAccountForIncomingLink", listener);
  },
  e2eGetLastIncomingNavigation: () =>
    ipcRenderer.invoke("e2e:getLastIncomingNavigation") as Promise<{
      accountId: string;
      url: string;
    } | null>,
  e2eParseWhatsAppUrl: (raw: string) => ipcRenderer.invoke("e2e:parseWhatsAppUrl", raw),
  e2eSimulateIncomingUrl: (raw: string) => ipcRenderer.invoke("e2e:simulateIncomingUrl", raw),
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSettings: (next: unknown) => ipcRenderer.invoke("settings:set", next),
  setChromeMetrics: (m: { sidebarWidth: number; topHeight: number }) =>
    ipcRenderer.invoke("ui:setChromeMetrics", m),
  setRendererModalOpen: (open: boolean) => ipcRenderer.invoke("ui:setRendererModalOpen", open),
  setTrayBadgeCount: (count: number) => ipcRenderer.invoke("tray:setBadgeCount", count),
  setZenMode: (enabled: boolean) => ipcRenderer.invoke("ui:setZenMode", enabled),
  setMode: (mode: "browser" | "settings") => ipcRenderer.invoke("ui:setMode", mode),
  onModeChanged: (cb) => {
    const listener = (_evt: unknown, mode: "browser" | "settings") => {
      cb(mode === "settings" ? "settings" : "browser");
    };
    ipcRenderer.on("ui:modeChanged", listener);
    return () => ipcRenderer.removeListener("ui:modeChanged", listener);
  },
  onOpenSettings: (cb) => {
    const listener = () => cb();
    ipcRenderer.on("ui:openSettings", listener);
    return () => ipcRenderer.removeListener("ui:openSettings", listener);
  },
  onOpenQuickSwitcher: (cb) => {
    const listener = () => cb();
    ipcRenderer.on("ui:openQuickSwitcher", listener);
    return () => ipcRenderer.removeListener("ui:openQuickSwitcher", listener);
  },
  onOpenPhoneChat: (cb) => {
    const listener = () => cb();
    ipcRenderer.on("ui:openPhoneChat", listener);
    return () => ipcRenderer.removeListener("ui:openPhoneChat", listener);
  },
  onZenChanged: (cb) => {
    const listener = (_evt: unknown, enabled: boolean) => cb(!!enabled);
    ipcRenderer.on("ui:zenChanged", listener);
    return () => ipcRenderer.removeListener("ui:zenChanged", listener);
  },
  onOpenShortcutsHelp: (cb) => {
    const listener = () => cb();
    ipcRenderer.on("ui:openShortcutsHelp", listener);
    return () => ipcRenderer.removeListener("ui:openShortcutsHelp", listener);
  },
  onOpenAbout: (cb) => {
    const listener = () => cb();
    ipcRenderer.on("ui:openAbout", listener);
    return () => ipcRenderer.removeListener("ui:openAbout", listener);
  },
  runWhatsAppMediaDiagnostics: () =>
    ipcRenderer.invoke("diagnostics:whatsappMedia") as Promise<WhatsAppMediaDiagnosticsResult>,
  selectDownloadsDirectory: () =>
    ipcRenderer.invoke("dialog:selectDownloadsDirectory") as Promise<string | null>,
  clearHttpCacheAllAccounts: () =>
    ipcRenderer.invoke("storage:clearHttpCacheAll") as Promise<boolean>,
  registerWhatsAppProtocol: () =>
    ipcRenderer.invoke("desktop:registerWhatsAppProtocol") as Promise<RegisterProtocolResult>,
};

contextBridge.exposeInMainWorld("catrip", api);
