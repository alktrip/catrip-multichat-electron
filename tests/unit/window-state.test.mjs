import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applySavedWindowBounds,
  captureWindowBounds,
  shouldPersistWindowBounds,
} from "../../dist/main/windowState.js";

function mockWindow(state) {
  const bounds = state.bounds ?? { x: 10, y: 20, width: 1200, height: 800 };
  const normalBounds = state.normalBounds ?? bounds;
  const calls = [];
  const win = {
    isDestroyed: () => !!state.destroyed,
    isMinimized: () => !!state.minimized,
    isVisible: () => state.visible !== false,
    isMaximized: () => !!state.maximized,
    getBounds: () => ({ ...bounds }),
    getNormalBounds: () => ({ ...normalBounds }),
    setBounds(b) {
      calls.push(`setBounds:${b.width}x${b.height}@${b.x},${b.y}`);
      Object.assign(bounds, b);
    },
    maximize() {
      calls.push("maximize");
      state.maximized = true;
    },
    unmaximize() {
      calls.push("unmaximize");
      state.maximized = false;
    },
    calls,
  };
  return win;
}

test("shouldPersistWindowBounds ignora ventana oculta o minimizada", () => {
  assert.equal(shouldPersistWindowBounds(mockWindow({ visible: false })), false);
  assert.equal(shouldPersistWindowBounds(mockWindow({ minimized: true })), false);
  assert.equal(shouldPersistWindowBounds(mockWindow({ visible: true })), true);
});

test("captureWindowBounds usa normal bounds cuando está maximizada", () => {
  const win = mockWindow({
    maximized: true,
    bounds: { x: 0, y: 0, width: 1920, height: 1080 },
    normalBounds: { x: 100, y: 80, width: 1180, height: 760 },
  });
  const captured = captureWindowBounds(win);
  assert.deepEqual(captured.bounds, { x: 100, y: 80, width: 1180, height: 760 });
  assert.equal(captured.maximized, true);
});

test("applySavedWindowBounds restaura posición y tamaño al mostrar", () => {
  const win = mockWindow({
    visible: false,
    bounds: { x: 0, y: 0, width: 640, height: 480 },
  });
  applySavedWindowBounds(
    win,
    { x: 240, y: 120, width: 1180, height: 760 },
    false,
  );
  assert.deepEqual(win.getBounds(), { x: 240, y: 120, width: 1180, height: 760 });
});

test("applySavedWindowBounds restaura estado maximizado", () => {
  const win = mockWindow({
    bounds: { x: 0, y: 0, width: 640, height: 480 },
  });
  applySavedWindowBounds(
    win,
    { x: 100, y: 80, width: 1180, height: 760 },
    true,
  );
  assert.deepEqual(win.calls, [
    "setBounds:1180x760@100,80",
    "maximize",
  ]);
});
