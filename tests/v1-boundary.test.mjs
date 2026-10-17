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


test("registered profile and preference routes match the OpenAPI paths", () => {
  const routes = fs.readFileSync(path.join(root, "src", "routes", "index.ts"), "utf8");
  const userRoutes = fs.readFileSync(path.join(root, "src", "modules", "users", "routes.ts"), "utf8");
  const preferenceRoutes = fs.readFileSync(path.join(root, "src", "modules", "preferences", "routes.ts"), "utf8");
  const openapi = fs.readFileSync(path.join(root, "src", "openapi", "v1.ts"), "utf8");

  assert.match(routes, /v1Router\.use\("\/user", usersRouter\)/);
  assert.match(routes, /v1Router\.use\("\/preferences", preferencesRouter\)/);
  assert.match(userRoutes, /router\.get\("\/"/);
  assert.match(userRoutes, /router\.put\("\/"/);
  assert.match(preferenceRoutes, /router\.get\("\/preferences"/);
  assert.match(preferenceRoutes, /router\.put\("\/preferences"/);
  assert.match(openapi, /"\/user":/);
  assert.match(openapi, /"\/preferences\/preferences":/);
});

test("OpenAPI documents concrete response contracts for bootstrap, home, and goals", () => {
  const openapi = fs.readFileSync(path.join(root, "src", "openapi", "v1.ts"), "utf8");
  assert.match(openapi, /BootstrapResponse: object/);
  assert.match(openapi, /HomeTodayResponse: object/);
  assert.match(openapi, /DailyGoals: object/);
  assert.match(openapi, /tags: \{ type: "array", items: object\(\{ id: string\(\), key: string\(\), name: string\(\), type: string\(\) \}/);
  assert.match(openapi, /"\/bootstrap":[\s\S]*?\$ref: "#\/components\/schemas\/BootstrapResponse"/);
  assert.match(openapi, /"\/home\/today":[\s\S]*?\$ref: "#\/components\/schemas\/HomeTodayResponse"/);
  assert.match(openapi, /"\/goals\/today":[\s\S]*?\$ref: "#\/components\/schemas\/DailyGoals"/);
  assert.match(openapi, /"\/progress\/today":[\s\S]*?\$ref: "#\/components\/schemas\/ProgressToday"/);
  assert.match(openapi, /spr-reading-enabled", isActive: false/);
  assert.match(openapi, /spr-song-enabled", isActive: false/);
});
