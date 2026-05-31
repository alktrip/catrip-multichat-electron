import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import App from "./ui/App";
import DevBanner from "./ui/DevBanner";
import BrowserPreviewNotice from "./ui/BrowserPreviewNotice";
import { ToastsProvider } from "./ui/Toasts";
import { installBrowserPreviewIfNeeded } from "./dev/installBrowserPreview";
import i18n, { initRendererI18nSync, changeRendererLanguage } from "./i18n";
import "./ui/theme.css";

initRendererI18nSync(undefined, navigator.language);

const appVersion = typeof __CATRIP_APP_VERSION__ === "string" ? __CATRIP_APP_VERSION__ : "0.0.0";
const isBrowserPreview = installBrowserPreviewIfNeeded(appVersion);

function LanguageFromSettings() {
  React.useEffect(() => {
    void (async () => {
      try {
        const settings = (await window.catrip.getSettings()) as {
          general?: { language?: string };
        };
        await changeRendererLanguage(settings?.general?.language, navigator.language);
      } catch {
        /* idioma por defecto (es) ya aplicado */
      }
    })();
  }, []);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ToastsProvider>
        <LanguageFromSettings />
        {isBrowserPreview ? <BrowserPreviewNotice /> : null}
        <App />
        {import.meta.env.DEV ? <DevBanner /> : null}
      </ToastsProvider>
    </I18nextProvider>
  </React.StrictMode>,
);
