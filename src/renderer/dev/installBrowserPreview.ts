import { createBrowserPreviewApi } from "./browserPreviewApi";

declare global {
  interface Window {
    __CATRIP_BROWSER_PREVIEW__?: boolean;
  }
}

export function isBrowserPreviewActive(): boolean {
  return !!window.__CATRIP_BROWSER_PREVIEW__;
}

/** Instala API simulada cuando el renderer corre en Vite sin preload de Electron. */
export function installBrowserPreviewIfNeeded(appVersion: string): boolean {
  if (!import.meta.env.DEV) return false;
  if (typeof window.catrip?.listAccounts === "function" && !isBrowserPreviewActive()) {
    return false;
  }
  if (window.__CATRIP_BROWSER_PREVIEW__ && window.catrip) return true;

  window.catrip = createBrowserPreviewApi(appVersion);
  window.__CATRIP_BROWSER_PREVIEW__ = true;
  document.documentElement.classList.add("catrip-browser-preview");
  return true;
}
