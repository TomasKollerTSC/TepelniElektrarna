import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const require = createRequire(new URL("../server/package.json", import.meta.url));
const { WebSocket } = require("ws");

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const statusUrl = "http://127.0.0.1:8765/status";

async function waitForStatus(expected) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(statusUrl);
      const status = await response.json();
      if (status.connected === expected) return status;
    } catch {
      // The child process may still be binding its listener.
    }
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`relay did not report ${expected} connected clients`);
}

function openSocket(clientId) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket("ws://127.0.0.1:8765", {
      headers: { "x-client-id": clientId },
    });
    socket.once("open", () => resolve(socket));
    socket.once("error", reject);
  });
}

test("relay counts sockets independently when client ids overlap during reconnect", async () => {
  const server = spawn(process.execPath, ["server/index.js"], {
    cwd: repository,
    stdio: ["ignore", "pipe", "pipe"],
  });
  const sockets = [];
  try {
    await waitForStatus(0);
    sockets.push(await openSocket("reconnecting-display"));
    sockets.push(await openSocket("reconnecting-display"));

    const connected = await waitForStatus(2);
    assert.deepEqual(connected.clients, ["reconnecting-display", "reconnecting-display"]);

    sockets[0].close();
    await waitForStatus(1);
    assert.equal(sockets[1].readyState, WebSocket.OPEN);
  } finally {
    for (const socket of sockets) socket.terminate();
    if (server.exitCode === null) {
      const exited = once(server, "exit");
      server.kill("SIGTERM");
      await exited;
    }
  }
});
