import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");

test("core architecture primitives exist", () => {
  assert.equal(fs.existsSync(path.join(root, "src/core/application/BaseApiService.ts")), true);
  assert.equal(fs.existsSync(path.join(root, "src/core/application/Service.ts")), true);
  assert.equal(fs.existsSync(path.join(root, "src/core/persistence/Repository.ts")), true);
  assert.equal(fs.existsSync(path.join(root, "src/core/http/BaseController.ts")), true);
});

test("users is the reference controller-service module", () => {
  const controller = fs.readFileSync(
    path.join(root, "src/modules/users/controllers/UserController.ts"),
    "utf8",
  );
  const service = fs.readFileSync(
    path.join(root, "src/modules/users/application/UserService.ts"),
    "utf8",
  );
  const routes = fs.readFileSync(
    path.join(root, "src/modules/users/routes.ts"),
    "utf8",
  );

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
  assert.equal(
    fs.existsSync(path.join(root, "src/modules/users/application/UsersService.ts")),
    false,
  );
});
