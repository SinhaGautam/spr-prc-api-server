import assert from "node:assert/strict";
import test from "node:test";
import { startServer } from "../dist/index.mjs";

async function getServerPort(server) {
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Server did not bind to a TCP port.");
  return address.port;
}

test("health live endpoint reports service liveness", async (t) => {
  const server = await startServer(0);
  t.after(() => server.close());
  const port = await getServerPort(server);
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/health/live`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
});

test("bootstrap endpoint exposes only V1 onboarding practices", async (t) => {
  const server = await startServer(0);
  t.after(() => server.close());
  const port = await getServerPort(server);
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/bootstrap`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(body.traditions));
  assert.deepEqual(body.practices, ["naam_jap", "meditation"]);
  assert.ok(!body.practices.includes("reading"));
});
