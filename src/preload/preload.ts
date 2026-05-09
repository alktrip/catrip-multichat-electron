import { contextBridge, ipcRenderer } from "electron";

export type AccountDto = { id: string; label: string; icon: string };

export type AppApi = {
  getVersion: () => Promise<string>;
  listAccounts: () => Promise<AccountDto[]>;
  createAccount: (label?: string) => Promise<AccountDto>;
  regenerateAccountIcon: (id: string) => Promise<AccountDto | null>;
  setActiveAccount: (id: string) => Promise<void>;
  getActiveAccountId: () => Promise<string | null>;
  onAccountsListChanged: (cb: (accounts: AccountDto[]) => void) => () => void;
  onActiveAccountChanged: (cb: (id: string | null) => void) => () => void;
  openChatByPhone: (phoneRaw: string) => Promise<void>;
  triggerNewChat: () => Promise<void>;
  getSettings: () => Promise<unknown>;
  setSettings: (next: unknown) => Promise<void>;
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
  runWhatsAppMediaDiagnostics: () => Promise<WhatsAppMediaDiagnosticsResult>;
  selectDownloadsDirectory: () => Promise<string | null>;
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
  createAccount: (label?: string) => ipcRenderer.invoke("accounts:create", label),
  regenerateAccountIcon: (id: string) => ipcRenderer.invoke("accounts:regenerateIcon", id),
  setActiveAccount: (id: string) => ipcRenderer.invoke("accounts:setActive", id),
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
  getSettings: () => ipcRenderer.invoke("settings:get"),
  setSettings: (next: unknown) => ipcRenderer.invoke("settings:set", next),
  setChromeMetrics: (m: { sidebarWidth: number; topHeight: number }) =>
    ipcRenderer.invoke("ui:setChromeMetrics", m),
  setRendererModalOpen: (open: boolean) => ipcRenderer.invoke("ui:setRendererModalOpen", open),
  setTrayBadgeCount: (count: number) => ipcRenderer.invoke("tray:setBadgeCount", count),
  setZenMode: (enabled: boolean) => ipcRenderer.invoke("ui:setZenMode", enabled),
  setMode: (mode: "browser" | "settings") => ipcRenderer.invoke("ui:setMode", mode),
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
};

contextBridge.exposeInMainWorld("catrip", api);

