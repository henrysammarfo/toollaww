import { compileArtifact, gatedCall, issueTicket, policyHash, runAttackPack } from "./kernel.ts";
import { policy } from "./enforce.ts";
import { gatewayDispatch } from "./gateway.ts";
import { runCrew, proposeFixture } from "./crew.ts";
import { runSidecar, filmSidecar } from "./sidecar.ts";
import { spansToOtlp } from "./otel.ts";
import { manifestBundle } from "./agentteams-crs.ts";

export type JsonRpcReq = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
};

export type JsonRpcRes = {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
};

const tools = [
  {
    name: "toollaw.compile",
    description: "Hash a policy document into a policyHash artifact",
    inputSchema: {
      type: "object",
      properties: { source: { type: "string" } },
      required: ["source"],
    },
  },
  {
    name: "toollaw.enforce",
    description: "Fail-closed gate: ALLOW / BLOCK / REQUIRE_APPROVAL. Default BLOCK.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "string" },
        tool: { type: "string" },
        args: { type: "object" },
        ticketId: { type: ["string", "null"] },
      },
      required: ["principal", "tool"],
    },
  },
  {
    name: "toollaw.redteam",
    description: "Run the fixture attack pack. Mutating calls must BLOCK.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "toollaw.health",
    description: "Allowed read path for principal red/aud/pol",
    inputSchema: {
      type: "object",
      properties: { principal: { type: "string" }, agent: { type: "string" } },
    },
  },
  {
    name: "toollaw.approve",
    description: "Human L3 ticket. Cannot authorize unhalt/redeem/env.patch in v0 demo.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "string" },
        tool: { type: "string" },
      },
      required: ["principal", "tool"],
    },
  },
  {
    name: "toollaw.evidence",
    description: "Return active policyHash (receipts are returned on each enforce/redteam call)",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "toollaw.gateway",
    description: "Enforce then stub-execute only on ALLOW. BLOCK captures a deny Skill.",
    inputSchema: {
      type: "object",
      properties: {
        principal: { type: "string" },
        tool: { type: "string" },
        args: { type: "object" },
      },
      required: ["principal", "tool"],
    },
  },
  {
    name: "toollaw.crew",
    description: "In-process Manager/Compiler/Red/Auditor closed loop",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "toollaw.propose",
    description: "Hash a proposed attack fixture. No email, no auth.",
    inputSchema: {
      type: "object",
      properties: {
        tool: { type: "string" },
        args: { type: "object" },
        note: { type: "string" },
      },
      required: ["tool"],
    },
  },
  {
    name: "toollaw.sidecar",
    description: "AgentTeams sidecar: CRs, Matrix room, Higress-shaped gate, OTLP. Never /opt/scout or /opt/lockin.",
    inputSchema: { type: "object", properties: { home: { type: "string" } } },
  },
  {
    name: "toollaw.film",
    description: "Film path: BLOCK unhalt → ALLOW health → BLOCK peer env → evidence zip.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "toollaw.otel",
    description: "Export last sidecar film as OTLP/HTTP JSON.",
    inputSchema: { type: "object", properties: {} },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "toollaw.compile":
      return compileArtifact(String(args["source"] ?? ""));
    case "toollaw.enforce":
      return gatedCall({
        principal: String(args["principal"] ?? ""),
        tool: String(args["tool"] ?? ""),
        args: (args["args"] as Record<string, unknown> | undefined) ?? {},
        ticketId: (args["ticketId"] as string | null | undefined) ?? null,
      });
    case "toollaw.redteam":
      return runAttackPack();
    case "toollaw.health":
      return gatedCall({
        principal: String(args["principal"] ?? "red"),
        skill: "toollaw.health",
        tool: "toollaw.health",
        args: { agent: args["agent"] ?? "fixture-desk" },
      });
    case "toollaw.approve":
      return issueTicket(String(args["principal"] ?? ""), String(args["tool"] ?? ""));
    case "toollaw.evidence":
      return { policyHash: await policyHash(), tools: policy.tools.map((t) => t.name) };
    case "toollaw.gateway":
      return gatewayDispatch({
        principal: String(args["principal"] ?? "red"),
        tool: String(args["tool"] ?? ""),
        args: (args["args"] as Record<string, unknown> | undefined) ?? {},
        ticketId: (args["ticketId"] as string | null | undefined) ?? null,
      });
    case "toollaw.crew":
      return runCrew();
    case "toollaw.propose":
      return proposeFixture({
        tool: String(args["tool"] ?? "fixture.custom"),
        args: (args["args"] as Record<string, unknown> | undefined) ?? {},
        note: String(args["note"] ?? ""),
      });
    case "toollaw.sidecar": {
      const run = await runSidecar({
        home: typeof args["home"] === "string" ? args["home"] : undefined,
        includeZip: false,
      });
      return { ...run, crds: manifestBundle(), evidence: { ...run.evidence, zipBase64: "" } };
    }
    case "toollaw.film": {
      const run = await filmSidecar({ includeZip: false });
      return {
        state: run.state,
        auditor: run.auditor,
        room: run.room,
        evidence: { ...run.evidence, zipBase64: "" },
        zip: "POST /api/film",
        tools: run.attacks.map((a) => ({ tool: a.receipt.tool, decision: a.receipt.decision })),
      };
    }
    case "toollaw.otel": {
      const run = await runSidecar({ includeZip: false });
      return spansToOtlp(run.attacks.map((a) => a.span));
    }
    default:
      throw new Error(`unknown-tool:${name}`);
  }
}

export async function handleMcp(req: JsonRpcReq): Promise<JsonRpcRes> {
  const id = req.id ?? null;
  const method = req.method ?? "";
  const params = req.params ?? {};
  try {
    if (method === "initialize") {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: { name: "toollaw", version: "0.3.0" },
          capabilities: { tools: {} },
        },
      };
    }
    if (method === "tools/list" || method === "list_tools") {
      return { jsonrpc: "2.0", id, result: { tools } };
    }
    if (method === "tools/call" || method === "call_tool") {
      const name = String(params["name"] ?? "");
      const arguments_ = (params["arguments"] as Record<string, unknown> | undefined) ?? {};
      const data = await callTool(name, arguments_);
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
          isError: false,
        },
      };
    }
    return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "internal";
    return { jsonrpc: "2.0", id, error: { code: -32000, message } };
  }
}

export { tools };
