import { ipcMain, shell, type WebContents } from "electron";

export type UpdateDialogButton = {
  id: string;
  label: string;
  primary?: boolean;
};

export type UpdateDialogRequest = {
  title: string;
  message: string;
  releaseNotes: string;
  footerHint?: string;
  releaseUrl?: string;
  buttons: UpdateDialogButton[];
};

let pending: {
  resolve: (buttonId: string) => void;
  reject: (err: Error) => void;
} | null = null;

/** WebContents del shell React (WebContentsView), no el de la BrowserWindow vacía. */
let getShellWebContents: () => WebContents | undefined = () => undefined;

export function setUpdateDialogShellTarget(getter: () => WebContents | undefined) {
  getShellWebContents = getter;
}

function resolveShellWebContents(): WebContents | undefined {
  const wc = getShellWebContents();
  if (wc && !wc.isDestroyed()) return wc;
  return undefined;
}

export function initUpdateDialogBridge() {
  ipcMain.handle("updater:dialogResponse", (_evt, action: unknown) => {
    const buttonId =
      typeof action === "string"
        ? action
        : action &&
            typeof action === "object" &&
            typeof (action as { buttonId?: string }).buttonId === "string"
          ? (action as { buttonId: string }).buttonId
          : null;
    const releaseUrl =
      action &&
      typeof action === "object" &&
      typeof (action as { releaseUrl?: string }).releaseUrl === "string"
        ? (action as { releaseUrl: string }).releaseUrl
        : "";

    if (buttonId === "open-release-url") {
      if (releaseUrl.startsWith("http")) void shell.openExternal(releaseUrl);
      return;
    }

    if (!buttonId || !pending) return;
    const p = pending;
    pending = null;
    p.resolve(buttonId);
  });
}

let focusAppWindow: () => void = () => {};

export function setUpdateDialogWindowFocus(fn: () => void) {
  focusAppWindow = fn;
}

export function showUpdateDialogRequest(req: UpdateDialogRequest): Promise<string> {
  const wc = resolveShellWebContents();
  if (!wc) {
    return Promise.reject(new Error("no-renderer"));
  }

  if (pending) {
    pending.reject(new Error("dialog-superseded"));
    pending = null;
  }

  return new Promise((resolve, reject) => {
    pending = { resolve, reject };
    wc.send("ui:showUpdateDialog", req);
    focusAppWindow();
  });
}

export function cancelPendingUpdateDialog() {
  if (!pending) return;
  pending.reject(new Error("dialog-cancelled"));
  pending = null;
}
