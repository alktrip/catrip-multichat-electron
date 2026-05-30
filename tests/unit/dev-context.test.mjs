import { test } from "node:test";
import assert from "node:assert/strict";
import { buildDevContext } from "../../dist/main/devContext.js";

test("buildDevContext incluye flags CATRIP_ activos", () => {
  const prev = process.env.CATRIP_E2E;
  process.env.CATRIP_E2E = "1";
  process.env.CATRIP_DEBUG_EMBED = "1";
  try {
    const ctx = buildDevContext(true);
    assert.equal(ctx.e2eMode, true);
    assert.equal(ctx.catripEnv.CATRIP_E2E, "1");
    assert.equal(ctx.catripEnv.CATRIP_DEBUG_EMBED, "1");
    assert.equal(typeof ctx.platform, "string");
    assert.equal(typeof ctx.arch, "string");
  } finally {
    if (prev === undefined) delete process.env.CATRIP_E2E;
    else process.env.CATRIP_E2E = prev;
    delete process.env.CATRIP_DEBUG_EMBED;
  }
});
