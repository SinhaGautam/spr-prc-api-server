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

test("V1 common route registry is the API composition point", () => {
  const routes = fs.readFileSync(path.join(root, "src", "routes", "index.ts"), "utf8");
  assert.match(routes, /Router/);
  assert.doesNotMatch(routes, /modules\/(reading|songs|favorites)/);
  assert.doesNotMatch(routes, /service\./);
});

test("Every V1 API module has a controller and module routes", () => {
  const modules = ["auth", "bootstrap", "content", "daily-practice", "health", "home", "meditation", "naam-jap", "notifications", "preferences", "progress", "users"];
  for (const moduleName of modules) {
    assert.equal(fs.existsSync(path.join(root, "src", "modules", moduleName, "routes.ts")), true, moduleName + " routes.ts missing");
    assert.equal(fs.existsSync(path.join(root, "src", "modules", moduleName, "controllers")), true, moduleName + " controllers directory missing");
    const controllerFiles = fs.readdirSync(path.join(root, "src", "modules", moduleName, "controllers"));
    assert.ok(controllerFiles.some((file) => file.endsWith("Controller.ts")), moduleName + " controller missing");
  }
});

test("Business entities are module-owned", () => {
  assert.equal(fs.existsSync(path.join(root, "src", "shared", "domain", "entities.ts")), false);
  for (const expected of [
    ["users", "UserEntity.ts"],
    ["preferences", "UserPreferencesEntity.ts"],
    ["content", "TraditionEntity.ts"],
    ["naam-jap", "NaamJapSessionEntity.ts"],
    ["meditation", "MeditationSessionEntity.ts"],
    ["daily-practice", "DailyGoalSnapshotEntity.ts"],
  ]) {
    assert.equal(fs.existsSync(path.join(root, "src", "modules", expected[0], "entities", expected[1])), true, expected.join("/") + " missing");
  }
});

test("V1 practice contracts contain only Naam Jap and meditation", () => {
  const types = fs.readFileSync(path.join(root, "src", "shared", "domain", "types.ts"), "utf8");
  const preferences = fs.readFileSync(path.join(root, "src", "modules", "preferences", "routes.ts"), "utf8");
  const bootstrap = fs.readFileSync(path.join(root, "src", "modules", "bootstrap", "application", "BootstrapService.ts"), "utf8");
  const dailyPractice = fs.readFileSync(path.join(root, "src", "modules", "daily-practice", "domain", "daily-practice.ts"), "utf8");
  assert.doesNotMatch(types, /"reading"/);
  assert.doesNotMatch(preferences, /"reading"/);
  assert.doesNotMatch(bootstrap, /"reading"/);
  assert.doesNotMatch(dailyPractice, /reading/);
});

test("V1 seed contains no removed feature collections", () => {
  const seed = fs.readFileSync(path.join(root, "scripts", "seed-mongo.mjs"), "utf8");
  assert.doesNotMatch(seed, /\b(readings|reading_progress|songs|favorites|playback_history)\s*:/);
  assert.doesNotMatch(seed, /\breading\b/);
});
