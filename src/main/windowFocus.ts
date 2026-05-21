import { app, type BrowserWindow } from "electron";

/** Pulso breve de always-on-top para que Wayland/Mutter eleve la ventana al foco. */
const RAISE_PULSE_MS = 320;

/**
 * Enfoca la ventana principal de forma agresiva (notificaciones, second-instance, tray).
 * En Wayland `show()` + `focus()` a veces no bastan; `steal` y always-on-top ayudan.
 */
export function raiseMainWindow(win: BrowserWindow): void {
  try {
    const focusApp = app.focus as ((opts?: { steal?: boolean }) => void) | undefined;
    if (typeof focusApp === "function") {
      focusApp.call(app, { steal: true });
    }
  } catch {
    try {
      app.focus();
    } catch {
      // ignore
    }
  }

  try {
    if (win.isDestroyed()) return;
    if (win.isMinimized()) win.restore();
    if (!win.isVisible()) win.show();
    win.setAlwaysOnTop(true, "screen-saver");
    win.show();
    win.moveTop();
    win.focus();
    setTimeout(() => {
      try {
        if (!win.isDestroyed()) win.setAlwaysOnTop(false);
      } catch {
        // ignore
      }
    }, RAISE_PULSE_MS);
  } catch {
    // ignore
  }
}
