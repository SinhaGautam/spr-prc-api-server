import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("V1 does not contain removed feature modules", () => {
  for (const feature of ["reading", "songs", "favorites"]) {
    assert.equal(fs.existsSync(path.join(root, "src", "modules", feature)), false, feature + " module must not exist");
  }
});

test("V1 route registry does not register removed features", () => {
  const routes = fs.readFileSync(path.join(root, "src", "routes", "index.ts"), "utf8");
  assert.doesNotMatch(routes, /modules\/(reading|songs|favorites)/);
  assert.doesNotMatch(routes, /\/(readings|songs|favorites)/);
});

test("V1 practice contracts contain only Naam Jap and meditation", () => {
  const types = fs.readFileSync(path.join(root, "src", "shared", "domain", "types.ts"), "utf8");
  const preferences = fs.readFileSync(path.join(root, "src", "modules", "preferences", "routes.ts"), "utf8");
  const bootstrap = fs.readFileSync(path.join(root, "src", "modules", "bootstrap", "application", "BootstrapService.ts"), "utf8");
  assert.doesNotMatch(types, /"reading"/);
  assert.doesNotMatch(preferences, /"reading"/);
  assert.doesNotMatch(bootstrap, /"reading"/);
});

test("V1 seed contains no removed feature collections", () => {
  const seed = fs.readFileSync(path.join(root, "scripts", "seed-mongo.mjs"), "utf8");
  assert.doesNotMatch(seed, /\b(readings|reading_progress|songs|favorites|playback_history)\s*:/);
  assert.doesNotMatch(seed, /\breading\b/);
});
