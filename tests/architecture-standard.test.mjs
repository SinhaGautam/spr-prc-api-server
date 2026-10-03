import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("core architecture primitives exist", () => {
  for (const file of [
    "src/core/application/BaseApiService.ts",
    "src/core/application/Service.ts",
    "src/core/persistence/Repository.ts",
    "src/core/http/BaseController.ts",
    "src/core/config/Environment.ts",
    "src/core/logging/Logger.ts",
    "src/infrastructure/mongodb/MongoDatabase.ts",
    "src/infrastructure/mongodb/MongoIndexes.ts",
    "src/middleware/AsyncHandler.ts",
    "src/middleware/RequestValidation.ts",
  ]) {
    assert.equal(fs.existsSync(path.join(root, file)), true, file);
  }
});

test("all V1 feature boundaries have module composition roots", () => {
  for (const module of [
    "auth", "users", "preferences", "content", "naam-jap", "meditation",
    "daily-practice", "progress", "notifications", "admin-content", "bootstrap", "home", "health",
  ]) {
    assert.equal(fs.existsSync(path.join(root, "src/modules", module, "index.ts")), true, module);
  }
});

test("users is the reference controller-service module", () => {
  const controller = fs.readFileSync(path.join(root, "src/modules/users/controllers/UserController.ts"), "utf8");
  const service = fs.readFileSync(path.join(root, "src/modules/users/application/UserService.ts"), "utf8");
  const routes = fs.readFileSync(path.join(root, "src/modules/users/routes.ts"), "utf8");
  assert.match(controller, /extends BaseController/);
  assert.match(controller, /userService\.getProfile/);
  assert.match(controller, /userService\.updateProfile/);
  assert.doesNotMatch(controller, /MongoClient|collection\(|findOne\(|updateOne\(/);
  assert.match(service, /extends BaseApiService/);
  assert.match(service, /userRepository\.findById/);
  assert.match(service, /userRepository\.update/);
  assert.doesNotMatch(service, /Request|Response/);
  assert.match(routes, /createUserRoutes/);
  assert.doesNotMatch(routes, /new UserService/);
  assert.doesNotMatch(routes, /z\.object/);
});

test("legacy user service is removed", () => {
  assert.equal(fs.existsSync(path.join(root, "src/modules/users/application/UsersService.ts")), false);
});
