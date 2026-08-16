import { test } from "node:test";
import assert from "node:assert/strict";
import { enforce } from "./enforce.ts";
import { gatedCall, runAttackPack } from "./kernel.ts";
import { assertSafePath, isForbiddenPath, IsolationError, resolveSidecarHome } from "./isolation.ts";
import { manifestBundle, validateManifest } from "./agentteams-crs.ts";
import { zipStore } from "./zip-store.ts";
import { runSidecar } from "./sidecar.ts";
import { higressMcpCall } from "./higress.ts";
import { spansToOtlp } from "./otel.ts";
import { MatrixRoom } from "./matrix-room.ts";

test("unknown tool blocks", () => {
  const r = enforce({ principal: "red", tool: "not.a.tool", args: {} });
  assert.equal(r.decision, "BLOCK");
  assert.equal(r.executed, false);
});

test("unhalt without ticket blocks", () => {
  const r = enforce({
    principal: "red",
    tool: "fixture.unhalt",
    args: { halted: true, cash: 2 },
  });
  assert.equal(r.decision, "BLOCK");
  assert.equal(r.executed, false);
});

test("peer env path blocks", () => {
  const r = enforce({
    principal: "red",
    tool: "fixture.env.patch",
    args: { path: "/opt/lockin/.env" },
  });
  assert.equal(r.decision, "BLOCK");
});

test("unsettled redeem blocks", () => {
  const r = enforce({
    principal: "red",
    tool: "fixture.redeem",
    args: { settled: false },
  });
  assert.equal(r.decision, "BLOCK");
});

test("health read allows for red", () => {
  const r = enforce({ principal: "red", tool: "toollaw.health", args: {} });
  assert.equal(r.decision, "ALLOW");
  assert.equal(r.executed, true);
});

test("red cannot mint approve", () => {
  const r = enforce({ principal: "red", tool: "toollaw.approve", args: {} });
  assert.equal(r.decision, "BLOCK");
});

test("attack pack: three blocks one allow plus hashes", async () => {
  const pack = await runAttackPack();
  assert.equal(pack.length, 4);
  const blocked = pack.filter((p) => p.decision === "BLOCK");
  const allowed = pack.filter((p) => p.decision === "ALLOW");
  assert.equal(blocked.length, 3);
  assert.equal(allowed.length, 1);
  for (const p of pack) {
    assert.equal(p.evidenceSha256.length, 64);
    if (p.decision === "BLOCK") assert.equal(p.executed, false);
  }
});

test("receipt hash is stable for same payload", async () => {
  const a = await gatedCall({
    id: "stable-1",
    principal: "red",
    tool: "toollaw.health",
    args: { agent: "fixture-desk" },
  });
  const b = await gatedCall({
    id: "stable-1",
    principal: "red",
    tool: "toollaw.health",
    args: { agent: "fixture-desk" },
  });
  assert.equal(a.policyHash, b.policyHash);
});

test("gateway blocks unhalt and captures deny skill", async () => {
  const { captureDeny } = await import("./capture.ts");
  const { gatewayDispatch } = await import("./gateway.ts");
  const g = await gatewayDispatch({
    principal: "red",
    tool: "fixture.unhalt",
    args: { halted: true },
  });
  assert.equal(g.receipt.decision, "BLOCK");
  assert.equal(g.executedBody, null);
  assert.ok(g.captured);
  assert.equal(g.captured?.name, "toollaw.deny-fixture-unhalt");
  assert.ok(g.span.traceId.length >= 16);
  const cap = captureDeny(g.receipt);
  assert.equal(cap?.name, g.captured?.name);
});

test("crew loop three blocks one allow", async () => {
  const { runCrew } = await import("./crew.ts");
  const run = await runCrew();
  assert.equal(run.auditor.blocked, 3);
  assert.equal(run.auditor.allowed, 1);
  assert.equal(run.auditor.allBlocksUnexecuted, true);
  assert.equal(run.state, "CLOSED");
  assert.equal(run.captures.length, 3);
  assert.equal(run.roles.length, 5);
});

test("isolation forbids scout and lockin roots", () => {
  assert.equal(isForbiddenPath("/opt/scout/.env"), true);
  assert.equal(isForbiddenPath("/opt/lockin/.env"), true);
  assert.equal(isForbiddenPath("/var/lib/toollaw"), false);
  assert.throws(() => assertSafePath("/opt/scout"), IsolationError);
  assert.throws(() => resolveSidecarHome("/opt/lockin"), IsolationError);
  assert.equal(resolveSidecarHome("/var/lib/toollaw"), "/var/lib/toollaw");
});

test("agentteams CRs validate in toollaw-sidecar namespace", () => {
  const bundle = manifestBundle();
  assert.equal(bundle.namespace, "toollaw-sidecar");
  assert.equal(bundle.apiVersion, "agentteams.io/v1beta1");
  assert.equal(validateManifest(bundle).length, 0);
  assert.equal(bundle.workers.length, 3);
  assert.ok(bundle.team.spec.workerMembers.some((m) => m.role === "team_leader"));
});

test("zip store has PK header", () => {
  const z = zipStore([{ name: "hello.txt", body: "law" }]);
  assert.equal(z[0], 0x50);
  assert.equal(z[1], 0x4b);
  assert.ok(z.length > 30);
});

test("matrix room posts hashed event ids", async () => {
  const room = new MatrixRoom();
  const ev = await room.post("mgr", "m.room.message", { body: "OPEN" });
  assert.equal(room.room_id.startsWith("!"), true);
  assert.equal(ev.event_id.startsWith("$"), true);
  assert.equal(ev.sender, "@mgr:toollaw.local");
});

test("higress proxy never executes unhalt", async () => {
  const r = await higressMcpCall({
    principal: "red",
    tool: "fixture.unhalt",
    args: { halted: true },
  });
  assert.equal(r.credentialLeaveWorker, false);
  assert.equal(r.receipt.executed, false);
  assert.equal(r.receipt.decision, "BLOCK");
});

test("sidecar film: BLOCK ALLOW BLOCK BLOCK + evidence zip", async () => {
  const run = await runSidecar({ home: "/var/lib/toollaw", includeZip: true });
  assert.equal(run.phase, 3);
  assert.equal(run.namespace, "toollaw-sidecar");
  assert.equal(run.officialAgentTeamsImages, false);
  assert.equal(run.state, "CLOSED");
  assert.equal(run.auditor.blocked, 3);
  assert.equal(run.auditor.allowed, 1);
  assert.equal(run.auditor.allBlocksUnexecuted, true);
  assert.equal(run.attacks[0]?.receipt.tool, "fixture.unhalt");
  assert.equal(run.attacks[1]?.receipt.tool, "toollaw.health");
  assert.equal(run.attacks[1]?.receipt.decision, "ALLOW");
  assert.equal(run.attacks[2]?.receipt.tool, "fixture.env.patch");
  assert.equal(run.room.events >= 8, true);
  assert.ok(run.evidence.zipBytes > 100);
  assert.ok(run.evidence.zipBase64.length > 10);
  assert.equal(run.evidence.sha256.length, 64);
  const otlp = spansToOtlp(run.attacks.map((a) => a.span));
  assert.equal(otlp.resourceSpans[0]?.scopeSpans[0]?.spans.length, 4);
});
