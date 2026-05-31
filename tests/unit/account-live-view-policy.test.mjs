import { test } from "node:test";
import assert from "node:assert/strict";
import {
  accountsToSuspendForLiveLimit,
  normalizeMaxLiveAccounts,
} from "../../dist/main/accountLiveViewPolicy.js";

test("normalizeMaxLiveAccounts acepta opciones válidas", () => {
  assert.equal(normalizeMaxLiveAccounts(2), 2);
  assert.equal(normalizeMaxLiveAccounts(0), 0);
  assert.equal(normalizeMaxLiveAccounts(99), 0);
});

test("accountsToSuspendForLiveLimit respeta activa y orden por uso", () => {
  const out = accountsToSuspendForLiveLimit({
    maxLiveAccounts: 2,
    activeAccountId: "b",
    liveAccountIds: ["a", "b", "c"],
    lastActiveAtMs: { a: 100, b: 300, c: 200 },
    callActiveIds: new Set(),
  });
  assert.deepEqual(out, ["a"]);
});

test("accountsToSuspendForLiveLimit no suspende cuentas en llamada", () => {
  const out = accountsToSuspendForLiveLimit({
    maxLiveAccounts: 1,
    activeAccountId: "b",
    liveAccountIds: ["a", "b"],
    lastActiveAtMs: { a: 100, b: 300 },
    callActiveIds: new Set(["a"]),
  });
  assert.deepEqual(out, []);
});

test("accountsToSuspendForLiveLimit con 0 es ilimitado", () => {
  const out = accountsToSuspendForLiveLimit({
    maxLiveAccounts: 0,
    activeAccountId: "a",
    liveAccountIds: ["a", "b", "c"],
    lastActiveAtMs: {},
    callActiveIds: new Set(),
  });
  assert.deepEqual(out, []);
});
