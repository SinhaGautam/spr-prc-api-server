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
  const preferences = fs.readFileSync(path.join(root, "src", "modules", "preferences", "schemas", "PreferencesSchema.ts"), "utf8");
  const bootstrap = fs.readFileSync(path.join(root, "src", "modules", "bootstrap", "application", "BootstrapService.ts"), "utf8");
  assert.doesNotMatch(types, /"reading"/);
  assert.doesNotMatch(preferences, /"reading"/);
  assert.doesNotMatch(bootstrap, /"reading"/);
});

test("V1 seed contains no removed feature collections", () => {
  const seed = fs.readFileSync(path.join(root, "scripts", "seed-mongo.mjs"), "utf8");
  assert.doesNotMatch(seed, /\b(readings|reading_progress|songs|favorites|playback_history)\s*:/);
  assert.match(seed, /_id: 'spr-reading-enabled',[\s\S]*?isActive: false/);
  assert.match(seed, /_id: 'spr-song-enabled',[\s\S]*?isActive: false/);
});

test("feature availability is MongoDB-backed and V1 seed includes active feature records", () => {
  const service = fs.readFileSync(path.join(root, "src", "modules", "features", "application", "FeaturesService.ts"), "utf8");
  const repository = fs.readFileSync(path.join(root, "src", "modules", "features", "infrastructure", "MongoFeaturesRepository.ts"), "utf8");
  const schema = fs.readFileSync(path.join(root, "src", "modules", "features", "schemas.ts"), "utf8");
  const index = fs.readFileSync(path.join(root, "src", "infrastructure", "mongodb", "MongoIndexes.ts"), "utf8");
  const seed = fs.readFileSync(path.join(root, "scripts", "seed-mongo.mjs"), "utf8");
  assert.match(service, /repository\.listAll\(\)/);
  assert.doesNotMatch(service, /V1_ENABLED_FEATURES/);
  assert.match(repository, /collection<FeatureDocument>\("features"\)/);
  assert.match(repository, /document\.isActive !== "boolean"/);
  assert.match(schema, /isActive: z\.boolean\(\)/);
  assert.match(index, /\["features", \{ key: 1 \}, \{ unique: true \}\]/);
  assert.match(seed, /_id: 'spr-naamjaap-enabled',[\s\S]*?isActive: true/);
  assert.match(seed, /_id: 'spr-meditation-enabled',[\s\S]*?isActive: true/);
  assert.match(seed, /_id: 'spr-reading-enabled',[\s\S]*?isActive: false/);
  assert.match(seed, /_id: 'spr-song-enabled',[\s\S]*?isActive: false/);
  assert.match(seed, /collectionName === 'features'/);
});


test("Naam Jap V1 does not expose or depend on a mantra catalogue", () => {
  const routes = fs.readFileSync(path.join(root, "src", "modules", "naam-jap", "routes.ts"), "utf8");
  const service = fs.readFileSync(path.join(root, "src", "modules", "naam-jap", "application", "NaamJapService.ts"), "utf8");
  const repository = fs.readFileSync(path.join(root, "src", "modules", "naam-jap", "application", "NaamJapRepository.ts"), "utf8");
  const home = fs.readFileSync(path.join(root, "src", "modules", "home", "application", "HomeService.ts"), "utf8");
  const schema = fs.readFileSync(path.join(root, "src", "modules", "naam-jap", "schemas", "NaamJapSchema.ts"), "utf8");
  const openapi = fs.readFileSync(path.join(root, "src", "openapi", "v1.ts"), "utf8");
  const seed = fs.readFileSync(path.join(root, "scripts", "seed-mongo.mjs"), "utf8");
  const indexes = fs.readFileSync(path.join(root, "src", "infrastructure", "mongodb", "MongoIndexes.ts"), "utf8");

  assert.doesNotMatch(routes, /\/mantras/);
  assert.doesNotMatch(service, /listMantras|request\.mantraId|request\.mantraText|mantras/);
  assert.doesNotMatch(repository, /listMantras|MantraEntity|mantras/);
  assert.doesNotMatch(home, /listMantras|defaultMantra/);
  assert.doesNotMatch(schema.split("export const naamJapSessionResponseSchema")[0], /mantraId|mantraText|mantraResponseSchema/);
  assert.doesNotMatch(openapi, /"\/mantras"|summary: "List published mantras"|mantra-hare-krishna/);
  assert.doesNotMatch(seed, /^\s*mantras:\s*\[/m);
  assert.doesNotMatch(indexes, /\["mantras"/);
});
