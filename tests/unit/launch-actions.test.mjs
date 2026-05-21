import test from "node:test";
import assert from "node:assert/strict";
import { parseLaunchAction } from "../../dist/main/launchActions.js";

test("parseLaunchAction detecta acciones del lanzador", () => {
  assert.equal(parseLaunchAction(["--catrip-action=focus"]), "focus");
  assert.equal(parseLaunchAction(["--catrip-action=new-account"]), "new-account");
  assert.equal(parseLaunchAction(["--catrip-focus"]), "focus");
  assert.equal(parseLaunchAction(["whatsapp://send?phone=1"]), null);
});
