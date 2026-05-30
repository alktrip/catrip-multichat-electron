import type { BrowserWindow } from "electron";
import type { Settings } from "./settings";

export type SavedWindowBounds = NonNullable<Settings["general"]["windowBounds"]>;

export function captureWindowBounds(win: BrowserWindow): {
  bounds: SavedWindowBounds;
  maximized: boolean;
} {
  const maximized = win.isMaximized();
  const b = maximized ? win.getNormalBounds() : win.getBounds();
  return {
    bounds: {
      x: Math.floor(b.x),
      y: Math.floor(b.y),
      width: Math.floor(b.width),
      height: Math.floor(b.height),
    },
    maximized,
  };
}

/** Evita guardar bounds mientras la ventana no refleja el tamaño elegido por el usuario. */
export function shouldPersistWindowBounds(win: BrowserWindow): boolean {
  if (win.isDestroyed()) return false;
  if (win.isMinimized()) return false;
  if (!win.isVisible()) return false;
  return true;
}

export function applySavedWindowBounds(
  win: BrowserWindow,
  bounds: SavedWindowBounds | null,
  maximized: boolean,
): void {
  if (win.isDestroyed()) return;
  if (!bounds && !maximized) return;
  try {
    if (maximized) {
      if (bounds) {
        if (win.isMaximized()) win.unmaximize();
        win.setBounds(bounds);
      }
      if (!win.isMaximized()) win.maximize();
      return;
    }
    if (win.isMaximized()) win.unmaximize();
    if (bounds) win.setBounds(bounds);
  } catch {
    // ignore — el WM puede rechazar posiciones fuera de pantalla
  }
}
