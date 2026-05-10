import React from "react";
import ReactDOM from "react-dom/client";
import App from "./ui/App";
import { ToastsProvider } from "./ui/Toasts";
import "./ui/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastsProvider>
      <App />
    </ToastsProvider>
  </React.StrictMode>,
);
