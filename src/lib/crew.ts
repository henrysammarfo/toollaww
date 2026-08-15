import { attackPack, compileArtifact } from "./kernel.ts";
import { policy } from "./enforce.ts";
import { gatewayDispatch, type GatewayResult } from "./gateway.ts";
import { canonicalJson, sha256Hex } from "./hash.ts";
import type { DenySkill } from "./capture.ts";
import { newTraceId, type Span } from "./trace.ts";

export type CrewRun = {
  runId: string;
  state: "CLOSED" | "BLOCKED";
  roles: string[];
  policyHash: string;
  attacks: GatewayResult[];
  captures: DenySkill[];
  spans: Span[];
  auditor: { blocked: number; allowed: number; allBlocksUnexecuted: boolean };
};

export async function runCrew(): Promise<CrewRun> {
  const source = JSON.stringify(policy);
  const compiled = await compileArtifact(source);
  const runId = `run-${compiled.policyHash.slice(0, 12)}`;
  const traceId = newTraceId();
  const attacks: GatewayResult[] = [];
  for (const fixture of attackPack) {
    attacks.push(
      await gatewayDispatch({
        principal: fixture.principal,
        tool: fixture.tool,
        args: fixture.args as Record<string, unknown>,
        skill: fixture.skill,
        traceId,
      }),
    );
  }
  const captures = attacks.map((a) => a.captured).filter((x): x is DenySkill => x !== null);
  const blocked = attacks.filter((a) => a.receipt.decision === "BLOCK");
  const allowed = attacks.filter((a) => a.receipt.decision === "ALLOW");
  const allBlocksUnexecuted = blocked.every((a) => a.receipt.executed === false);
  const auditorOk = allBlocksUnexecuted && allowed.length === 1 && blocked.length === 3;
  return {
    runId,
    state: auditorOk ? "CLOSED" : "BLOCKED",
    roles: ["mgr", "pol", "red", "aud", "hum"],
    policyHash: compiled.policyHash,
    attacks,
    captures,
    spans: attacks.map((a) => a.span),
    auditor: {
      blocked: blocked.length,
      allowed: allowed.length,
      allBlocksUnexecuted,
    },
  };
}

export async function proposeFixture(input: {
  tool: string;
  args: Record<string, unknown>;
  note?: string;
}): Promise<{ id: string; sha256: string; tool: string; args: Record<string, unknown>; note: string }> {
  const body = {
    tool: input.tool,
    args: input.args,
    note: input.note ?? "",
    ts: new Date().toISOString(),
  };
  const sha256 = await sha256Hex(canonicalJson(body));
  return { id: `prop-${sha256.slice(0, 12)}`, sha256, ...body };
}
