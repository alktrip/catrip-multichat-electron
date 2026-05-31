import test from "node:test";
import assert from "node:assert/strict";
import { matchCatripShortcut } from "../../dist/main/catripShortcuts.js";

/** @param {Partial<import("electron").Input>} overrides */
function keyDown(overrides) {
  return {
    type: "keyDown",
    key: "",
    code: "",
    control: false,
    meta: false,
    shift: false,
    alt: false,
    ...overrides,
  };
}

test("matchCatripShortcut reconoce atajos con Ctrl", () => {
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "k", control: true })), {
    type: "quickSwitcher",
  });
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "P", control: true })), {
    type: "settings",
  });
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "3", control: true })), {
    type: "switchAccount",
    index: 2,
  });
});

test("matchCatripShortcut reconoce Meta en macOS", () => {
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "k", meta: true })), {
    type: "quickSwitcher",
  });
});

test("matchCatripShortcut reconoce combinaciones con Shift", () => {
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "z", control: true, shift: true })), {
    type: "toggleZen",
  });
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "A", control: true, shift: true })), {
    type: "urgentNow",
  });
});

test("matchCatripShortcut reconoce F5 y F11 sin modificador", () => {
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "F5" })), { type: "reload" });
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "F11" })), { type: "fullscreen" });
});

test("matchCatripShortcut reconoce Escape para salir de Zen", () => {
  assert.deepEqual(matchCatripShortcut(keyDown({ key: "Escape" })), { type: "exitZen" });
});

test("matchCatripShortcut ignora keyUp y teclas sin atajo", () => {
  assert.equal(matchCatripShortcut(keyDown({ type: "keyUp", key: "k", control: true })), null);
  assert.equal(matchCatripShortcut(keyDown({ key: "a", control: true })), null);
  assert.equal(matchCatripShortcut(keyDown({ key: "Enter", control: true })), null);
});
