import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import test from "node:test";
import { startServer } from "../dist/index.mjs";

async function getServerPort(server) {
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Server did not bind to a TCP port.");
  return address.port;
}

test("anonymous installation session is stable, revocable, and does not require a display name", async (t) => {
  const server = await startServer(0);
  t.after(() => server.close());
  const port = await getServerPort(server);
  const baseUrl = `http://127.0.0.1:${port}/api/v1`;
  const installationId = randomUUID();
  const installationSecret = randomBytes(32).toString("base64url");
  const requestBody = {
    installationId,
    installationSecret,
    platform: "android",
    appVersion: "1.0.0",
    language: "en",
    timezone: "Asia/Kolkata",
  };

  const firstResponse = await fetch(`${baseUrl}/auth/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  assert.equal(firstResponse.status, 201);
  const first = await firstResponse.json();
  assert.match(first.user.username, /^seeker-[A-F0-9]{16}$/);
  assert.equal(Object.hasOwn(first.user, "displayName"), false);
  assert.equal(first.installation.installationId, installationId);
  assert.ok(Date.parse(first.session.expiresAt) > Date.now());

  const secondResponse = await fetch(`${baseUrl}/auth/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  assert.equal(secondResponse.status, 201);
  const second = await secondResponse.json();
  assert.equal(second.user.id, first.user.id);
  assert.equal(second.user.username, first.user.username);
  assert.notEqual(second.session.token, first.session.token);

  const invalidSecretResponse = await fetch(`${baseUrl}/auth/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...requestBody, installationSecret: randomBytes(32).toString("base64url") }),
  });
  assert.equal(invalidSecretResponse.status, 401);

  const profileResponse = await fetch(`${baseUrl}/me`, {
    headers: { authorization: `Bearer ${second.session.token}` },
  });
  assert.equal(profileResponse.status, 200);

  const logoutResponse = await fetch(`${baseUrl}/auth/session`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${second.session.token}` },
  });
  assert.equal(logoutResponse.status, 204);

  const revokedProfileResponse = await fetch(`${baseUrl}/me`, {
    headers: { authorization: `Bearer ${second.session.token}` },
  });
  assert.equal(revokedProfileResponse.status, 401);
});
