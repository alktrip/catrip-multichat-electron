"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHELL_MENU_CHANNELS = void 0;
exports.dispatchShellMenuEvent = dispatchShellMenuEvent;
exports.subscribeShellMenuChannel = subscribeShellMenuChannel;
/** Canales de menú nativo → shell React (main process envía IPC o CustomEvent). */
exports.SHELL_MENU_CHANNELS = [
  "ui:openSettings",
  "ui:openQuickSwitcher",
  "ui:openActivityCenter",
  "ui:openPendingInbox",
  "ui:openUrgentNow",
  "ui:openPhoneChat",
  "ui:openShortcutsHelp",
  "ui:openAbout",
  "ui:openUserManual",
];
function dispatchShellMenuEvent(channel) {
  window.dispatchEvent(new CustomEvent("catrip:shell-menu", { detail: { channel } }));
}
function subscribeShellMenuChannel(channel, cb) {
  const listener = (ev) => {
    const detail = ev.detail;
    if (detail?.channel === channel) cb();
  };
  window.addEventListener("catrip:shell-menu", listener);
  return () => window.removeEventListener("catrip:shell-menu", listener);
}
//# sourceMappingURL=shellMenuBridge.js.map
