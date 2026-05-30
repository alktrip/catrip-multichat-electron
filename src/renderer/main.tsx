import React from "react";
import ReactDOM from "react-dom/client";
import App from "./ui/App";
import DevBanner from "./ui/DevBanner";
import BrowserPreviewNotice from "./ui/BrowserPreviewNotice";
import { ToastsProvider } from "./ui/Toasts";
import { installBrowserPreviewIfNeeded } from "./dev/installBrowserPreview";
import "./ui/theme.css";

const appVersion =
  typeof __CATRIP_APP_VERSION__ === "string" ? __CATRIP_APP_VERSION__ : "0.0.0";
const isBrowserPreview = installBrowserPreviewIfNeeded(appVersion);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastsProvider>
      {isBrowserPreview ? <BrowserPreviewNotice /> : null}
      <App />
      {import.meta.env.DEV ? <DevBanner /> : null}
    </ToastsProvider>
  </React.StrictMode>,
);
