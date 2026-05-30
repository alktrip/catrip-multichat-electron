import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildSuspendedMap,
  normalizeSuspendAfterMinutes,
  shouldSuspendAccount,
} from "../../dist/main/accountSuspension.js";

test("normalizeSuspendAfterMinutes acepta opciones válidas y usa default", () => {
  assert.equal(normalizeSuspendAfterMinutes(15), 15);
  assert.equal(normalizeSuspendAfterMinutes(5), 5);
  assert.equal(normalizeSuspendAfterMinutes("30"), 30);
  assert.equal(normalizeSuspendAfterMinutes(99), 15);
  assert.equal(normalizeSuspendAfterMinutes(undefined), 15);
});

test("shouldSuspendAccount respeta cuenta activa, llamada y umbral", () => {
  const now = 1_000_000;
  const base = {
    enabled: true,
    accountId: "a2",
    activeAccountId: "a1",
    hasLiveView: true,
    alreadySuspended: false,
    lastActiveAtMs: now - 20 * 60 * 1000,
    nowMs: now,
    suspendAfterMinutes: 15,
    callActive: false,
  };
  assert.equal(shouldSuspendAccount(base), true);
  assert.equal(shouldSuspendAccount({ ...base, accountId: "a1", activeAccountId: "a1" }), false);
  assert.equal(shouldSuspendAccount({ ...base, callActive: true }), false);
  assert.equal(shouldSuspendAccount({ ...base, hasLiveView: false }), false);
  assert.equal(
    shouldSuspendAccount({ ...base, lastActiveAtMs: now - 5 * 60 * 1000 }),
    false,
  );
  assert.equal(shouldSuspendAccount({ ...base, enabled: false }), false);
});

test("buildSuspendedMap marca solo ids suspendidos", () => {
  const map = buildSuspendedMap(["a1", "a2", "a3"], new Set(["a2"]));
  assert.deepEqual(map, { a1: false, a2: true, a3: false });
});
