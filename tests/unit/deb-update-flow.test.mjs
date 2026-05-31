import test from "node:test";
import assert from "node:assert/strict";
import { resolveDebDownloadUrl } from "../../dist/main/debUpdateFlow.js";

test("resolveDebDownloadUrl usa URL absoluta del .deb", () => {
  const url = resolveDebDownloadUrl({
    version: "1.4.1",
    files: [
      {
        url: "https://github.com/alktrip/catrip-multichat-electron/releases/download/v1.4.1/catrip-connect_1.4.1_amd64.deb",
      },
    ],
  });
  assert.ok(url.endsWith(".deb"));
  assert.match(url, /catrip-connect_1\.4\.1_amd64\.deb/);
});

test("resolveDebDownloadUrl construye URL por convención si falta files", () => {
  const url = resolveDebDownloadUrl({ version: "1.5.0" });
  assert.equal(
    url,
    "https://github.com/alktrip/catrip-multichat-electron/releases/download/v1.5.0/catrip-connect_1.5.0_amd64.deb",
  );
});
