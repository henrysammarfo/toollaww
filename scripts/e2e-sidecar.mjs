import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = process.env.PORT ?? "8791";
const home = process.env.TOOLLAW_SIDECAR_HOME ?? "/var/lib/toollaw";
const base = `http://127.0.0.1:${port}`;

const child = spawn(process.execPath, ["--experimental-strip-types", "sidecar/server.ts"], {
  env: { ...process.env, PORT: port, TOOLLAW_SIDECAR_HOME: home },
  stdio: ["ignore", "pipe", "pipe"],
  cwd: process.cwd(),
});

let out = "";
child.stdout?.on("data", (b) => {
  out += String(b);
});
child.stderr?.on("data", (b) => {
  out += String(b);
});

function fail(msg) {
  console.error(out);
  throw new Error(msg);
}

async function json(path, method = "GET") {
  const res = await fetch(`${base}${path}`, { method });
  if (!res.ok) fail(`${method} ${path} -> ${res.status}`);
  return res.json();
}

try {
  for (let i = 0; i < 40; i++) {
    try {
      const health = await json("/health");
      if (health.ok) break;
    } catch {
      await delay(150);
    }
    if (i === 39) fail("sidecar did not become healthy");
  }

  const sidecar = await json("/api/sidecar", "POST");
  if (sidecar.state !== "CLOSED") fail(`sidecar state ${sidecar.state}`);
  if (sidecar.namespace !== "toollaw-sidecar") fail("wrong namespace");
  if (sidecar.auditor.blocked !== 3 || sidecar.auditor.allowed !== 1) fail("auditor mismatch");
  if (!sidecar.auditor.allBlocksUnexecuted) fail("block executed");

  const film = await json("/api/film");
  if (film.state !== "CLOSED") fail(`film ${film.state}`);

  const zip = await fetch(`${base}/api/film`, { method: "POST" });
  if (!zip.ok) fail(`zip ${zip.status}`);
  const bytes = new Uint8Array(await zip.arrayBuffer());
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) fail("zip not PK");

  const otel = await json("/api/otel");
  if (!otel.resourceSpans?.length) fail("empty otlp");

  const mcp = await fetch(`${base}/api/mcp`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
  });
  const listed = await mcp.json();
  const names = new Set((listed.result?.tools ?? []).map((t) => t.name));
  for (const need of ["toollaw.sidecar", "toollaw.film", "toollaw.otel", "toollaw.enforce"]) {
    if (!names.has(need)) fail(`missing mcp tool ${need}`);
  }

  console.log("e2e sidecar OK", {
    state: sidecar.state,
    blocked: sidecar.auditor.blocked,
    allowed: sidecar.auditor.allowed,
    zipBytes: bytes.length,
    tools: names.size,
  });
} finally {
  try {
    child.kill();
  } catch {
    /* ignore */
  }
}
