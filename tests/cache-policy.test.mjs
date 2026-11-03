import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const index = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../dist/src/app.js", import.meta.url), "utf8");
const worker = await readFile(new URL("../dist/sw.js", import.meta.url), "utf8");

test("core browser assets use the current rule-version query", () => {
  assert.match(index, /src\/app\.js\?v=20261022/);
  assert.match(index, /assets\/styles\.css\?v=20261022/);
  assert.match(app, /scoring\.js\?v=20261022/);
});

test("service worker refreshes pages, code and rules from the network", () => {
  assert.match(worker, /clinical5-20261103-v2/);
  assert.match(worker, /NETWORK_FIRST_DESTINATIONS/);
  assert.match(worker, /cache: "reload"/);
  assert.match(app, /updateViaCache: "none"/);
});
