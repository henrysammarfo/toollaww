import { createServer } from "node:http";
import { runSidecar, filmSidecar } from "../src/lib/sidecar.ts";
import { handleMcp, type JsonRpcReq } from "../src/lib/mcp-protocol.ts";
import { spansToOtlp } from "../src/lib/otel.ts";
import { resolveSidecarHome } from "../src/lib/isolation.ts";

const port = Number(process.env["PORT"] ?? 8787);
const home = resolveSidecarHome();

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  const send = (code: number, body: unknown, type = "application/json") => {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    res.writeHead(code, { "content-type": type, "access-control-allow-origin": "*" });
    res.end(data);
  };

  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type",
      });
      res.end();
      return;
    }
    if (url.pathname === "/health" || url.pathname === "/api/health") {
      send(200, { ok: true, product: "TOOLLAW", home, namespace: "toollaw-sidecar" });
      return;
    }
    if (url.pathname === "/api/sidecar" && (req.method === "GET" || req.method === "POST")) {
      const run = await runSidecar({ home, includeZip: false });
      send(200, { ...run, evidence: { ...run.evidence, zipBase64: "" } });
      return;
    }
    if (url.pathname === "/api/film" && req.method === "GET") {
      const run = await filmSidecar({ home, includeZip: false });
      send(200, {
        film: ["BLOCK unhalt", "ALLOW health", "BLOCK peer env", "BLOCK redeem", "evidence zip"],
        state: run.state,
        auditor: run.auditor,
        room: run.room,
        tools: run.attacks.map((a) => ({
          tool: a.receipt.tool,
          decision: a.receipt.decision,
          executed: a.receipt.executed,
        })),
        evidence: { ...run.evidence, zipBase64: "" },
      });
      return;
    }
    if (url.pathname === "/api/film" && req.method === "POST") {
      const run = await filmSidecar({ home, includeZip: true });
      const bytes = Buffer.from(run.evidence.zipBase64, "base64");
      res.writeHead(200, {
        "content-type": "application/zip",
        "content-disposition": `attachment; filename="${run.runId}.zip"`,
      });
      res.end(bytes);
      return;
    }
    if (url.pathname === "/api/otel") {
      const run = await runSidecar({ home, includeZip: false });
      send(200, spansToOtlp(run.attacks.map((a) => a.span)));
      return;
    }
    if (url.pathname === "/api/mcp" && req.method === "GET") {
      send(200, { product: "TOOLLAW", transport: "json-rpc", endpoint: "/api/mcp" });
      return;
    }
    if (url.pathname === "/api/mcp" && req.method === "POST") {
      const chunks: Buffer[] = [];
      for await (const c of req) chunks.push(c as Buffer);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as JsonRpcReq;
      send(200, await handleMcp(body));
      return;
    }
    send(404, { error: "not-found" });
  } catch (err) {
    send(500, { error: err instanceof Error ? err.message : "internal" });
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`toollaw sidecar ${port} home=${home}`);
});
