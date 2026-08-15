import { compileArtifact, gatedCall, issueTicket, policyHash, runAttackPack } from "./kernel.ts";
import { policy } from "./enforce.ts";
import { gatewayDispatch } from "./gateway.ts";
import { runCrew, proposeFixture } from "./crew.ts";

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
          serverInfo: { name: "toollaw", version: "0.1.0" },
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
