#!/usr/bin/env node
/**
 * Local stdio MCP (JSON-RPC). Same tools as POST /api/mcp.
 * Usage: node --experimental-strip-types mcp/stdio.ts
 */
import readline from "node:readline";
import { handleMcp } from "../src/lib/mcp-protocol.ts";

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });

for await (const line of rl) {
  const trimmed = line.trim();
  if (!trimmed) continue;
  let req: { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> };
  try {
    req = JSON.parse(trimmed) as typeof req;
  } catch {
    process.stdout.write(
      `${JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "parse error" } })}\n`,
    );
    continue;
  }
  const res = await handleMcp(req);
  process.stdout.write(`${JSON.stringify(res)}\n`);
}
