import { enforce, policy, type EnforceAttempt, type EnforceResult } from "./enforce.ts";
import { canonicalJson, sha256Hex } from "./hash.ts";
import unhalt from "../../fixtures/attack-unhalt.json" with { type: "json" };
import redeem from "../../fixtures/attack-redeem.json" with { type: "json" };
import peer from "../../fixtures/attack-env-peer.json" with { type: "json" };
import health from "../../fixtures/allow-health.json" with { type: "json" };

export const attackPack = [unhalt, redeem, peer, health] as const;

export type Receipt = {
  id: string;
  principal: string;
  skill: string;
  tool: string;
  args: Record<string, unknown>;
  policyHash: string;
  decision: EnforceResult["decision"];
  reasons: string[];
  risk: EnforceResult["risk"];
  mutate: boolean;
  executed: boolean;
  ticketId: string | null;
  ts: string;
  evidenceSha256: string;
};

let cachedPolicyHash: string | null = null;

export async function policyHash(): Promise<string> {
  if (cachedPolicyHash) return cachedPolicyHash;
  cachedPolicyHash = await sha256Hex(canonicalJson(policy));
  return cachedPolicyHash;
}

export async function compileArtifact(source: string): Promise<{ policyHash: string; bytes: number }> {
  const trimmed = source.trim();
  if (!trimmed) {
    throw new Error("empty-policy");
  }
  return { policyHash: await sha256Hex(trimmed), bytes: trimmed.length };
}

export async function gatedCall(
  attempt: EnforceAttempt & { skill?: string; id?: string },
): Promise<Receipt> {
  const result = enforce(attempt);
  const hash = await policyHash();
  const ts = new Date().toISOString();
  const id = attempt.id ?? `tl-${ts.replace(/[-:.TZ]/g, "").slice(0, 14)}`;
  const unsigned = {
    id,
    principal: attempt.principal,
    skill: attempt.skill ?? "toollaw.enforce",
    tool: attempt.tool,
    args: attempt.args,
    policyHash: hash,
    decision: result.decision,
    reasons: result.reasons,
    risk: result.risk,
    mutate: result.mutate,
    executed: result.executed,
    ticketId: attempt.ticketId ?? null,
    ts,
  };
  const evidenceSha256 = await sha256Hex(canonicalJson(unsigned));
  return { ...unsigned, evidenceSha256 };
}

export async function runAttackPack(): Promise<Receipt[]> {
  const out: Receipt[] = [];
  for (const fixture of attackPack) {
    out.push(
      await gatedCall({
        id: fixture.id,
        principal: fixture.principal,
        skill: fixture.skill,
        tool: fixture.tool,
        args: fixture.args as Record<string, unknown>,
      }),
    );
  }
  return out;
}

export function issueTicket(principal: string, tool: string): { ticketId: string; ok: boolean; reason?: string } {
  if (principal !== "hum") {
    return { ticketId: "", ok: false, reason: "human-only" };
  }
  if (tool === "fixture.unhalt" || tool === "fixture.redeem" || tool === "fixture.env.patch") {
    return { ticketId: "", ok: false, reason: "demo-tickets-do-not-authorize-mutate-fixtures" };
  }
  return { ticketId: `TKT-${Date.now().toString(36).toUpperCase()}`, ok: true };
}
