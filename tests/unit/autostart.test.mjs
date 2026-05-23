import test from "node:test";
import assert from "node:assert/strict";
import { buildAutostartDesktopContent } from "../../dist/main/desktopIntegration.js";

test("buildAutostartDesktopContent entrecomilla rutas con espacios", () => {
  const body = buildAutostartDesktopContent("/opt/Catrip Connect/catrip-connect");
  assert.match(body, /Exec="\/opt\/Catrip Connect\/catrip-connect" --disable-setuid-sandbox/);
  assert.match(body, /Hidden=false/);
  assert.match(body, /X-GNOME-Autostart-enabled=true/);
});

test("buildAutostartDesktopContent sin comillas si no hay espacios", () => {
  const body = buildAutostartDesktopContent("/usr/bin/catrip-connect");
  assert.match(body, /Exec=\/usr\/bin\/catrip-connect --disable-setuid-sandbox/);
});
