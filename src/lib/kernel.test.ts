import { test } from "node:test";
import assert from "node:assert/strict";
import { enforce } from "./enforce.ts";
import { gatedCall, runAttackPack } from "./kernel.ts";

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
