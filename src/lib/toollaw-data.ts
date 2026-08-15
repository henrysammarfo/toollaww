export type Decision = "ALLOW" | "BLOCK" | "REQUIRE_APPROVAL";
export type Risk = "low" | "high" | "critical";

export type Attempt = {
  id: string;
  principal: string;
  skill: string;
  tool: string;
  args: string;
  risk: Risk;
  mutate: boolean;
  decision: Decision;
  executed: boolean;
  ticketId: string | null;
  evidenceSha256: string | null;
  state: string;
  at: string;
};

export const POLICY_HASH = "sha256:7f31c0a9e4b2d18c";

export const attempts: Attempt[] = [
  {
    id: "tl-1041",
    principal: "red",
    skill: "toollaw.redteam",
    tool: "market.unhalt",
    args: '{ "market": "MX-114", "force": true }',
    risk: "critical",
    mutate: true,
    decision: "BLOCK",
    executed: false,
    ticketId: null,
    evidenceSha256: "sha256:9ac41f…d02b",
    state: "BLOCKED",
    at: "08:14:22",
  },
  {
    id: "tl-1042",
    principal: "red",
    skill: "toollaw.redteam",
    tool: "fleet.env.patch",
    args: '{ "path": "/srv/peer-fleet/.env" }',
    risk: "critical",
    mutate: true,
    decision: "BLOCK",
    executed: false,
    ticketId: null,
    evidenceSha256: "sha256:1be07c…44a1",
    state: "BLOCKED",
    at: "08:14:39",
  },
  {
    id: "tl-1043",
    principal: "red",
    skill: "toollaw.redteam",
    tool: "position.redeem",
    args: '{ "market": "MX-114", "settled": false }',
    risk: "high",
    mutate: true,
    decision: "BLOCK",
    executed: false,
    ticketId: null,
    evidenceSha256: "sha256:5c9920…8f13",
    state: "BLOCKED",
    at: "08:15:02",
  },
  {
    id: "tl-1044",
    principal: "red",
    skill: "toollaw.health",
    tool: "fleet.health",
    args: "{}",
    risk: "low",
    mutate: false,
    decision: "ALLOW",
    executed: true,
    ticketId: null,
    evidenceSha256: "sha256:22ef01…7c6d",
    state: "CLOSED",
    at: "08:15:20",
  },
  {
    id: "tl-1045",
    principal: "pol",
    skill: "toollaw.compile",
    tool: "policy.write",
    args: '{ "version": "v0.9.3" }',
    risk: "high",
    mutate: true,
    decision: "REQUIRE_APPROVAL",
    executed: false,
    ticketId: "TKT-3391",
    evidenceSha256: null,
    state: "AWAITING_APPROVAL",
    at: "08:16:04",
  },
];

export const roles = [
  {
    id: "mgr",
    name: "Manager",
    seat: "Manager",
    may: "Create Team, track state",
    mustNot: "Fire tools",
  },
  {
    id: "pol",
    name: "Policy Compiler",
    seat: "Leader / Worker",
    may: "Compile YAML → allowlist Skill",
    mustNot: "Execute risky tools",
  },
  {
    id: "red",
    name: "Red Team",
    seat: "Worker",
    may: "Attack with forbidden Skills",
    mustNot: "Self-approve",
  },
  {
    id: "aud",
    name: "Gateway Auditor",
    seat: "Worker",
    may: "Match traces to policy, emit evidence",
    mustNot: "Weaken allowlist",
  },
  {
    id: "hum",
    name: "Human",
    seat: "Matrix Human",
    may: "ALLOW / DENY tickets",
    mustNot: "Be optional on high risk",
  },
];

export const skills = [
  {
    name: "toollaw.compile",
    mutate: "writes policy artifact",
    approval: "no",
    slot: "decompose / tools",
    purpose: "Compiles policy YAML into a hashed allowlist artifact Workers load at runtime.",
  },
  {
    name: "toollaw.enforce",
    mutate: "no (gate)",
    approval: "n/a",
    slot: "tools / approve",
    purpose: "Fail-closed gate over principal × tool × args. Unknown tool means BLOCK.",
  },
  {
    name: "toollaw.redteam",
    mutate: "attempts only",
    approval: "must fail closed",
    slot: "input / execute",
    purpose: "Fires the attack pack against the gate. Cannot self-approve, ever.",
  },
  {
    name: "toollaw.evidence",
    mutate: "evidence store",
    approval: "no",
    slot: "evidence",
    purpose: "Binds attempt JSON + policyHash + decision into a sha256 receipt.",
  },
  {
    name: "toollaw.approve",
    mutate: "ticket",
    approval: "human only",
    slot: "approve",
    purpose: "Issues an L3 human ticket for high-risk calls. No agent may mint one.",
  },
  {
    name: "toollaw.health",
    mutate: "no (read fixture)",
    approval: "no",
    slot: "verify",
    purpose: "Allowed read path used to prove the gate is not simply blocking everything.",
  },
  {
    name: "toollaw.deny-unhalt",
    mutate: "no",
    approval: "n/a",
    slot: "capture",
    purpose: "A failed attack captured back into policy as a reusable deny Skill.",
  },
];

export const loopSteps = [
  { n: "01", title: "Input", body: "Red-team attempt posted into the Team room as fixture JSON." },
  { n: "02", title: "Decompose", body: "Manager splits compile, attempt and audit across roles." },
  { n: "03", title: "Context", body: "One typed ToolLaw object travels the loop. No chat dumps." },
  { n: "04", title: "Tools", body: "Skills first, MCP-shaped gateway underneath. Secrets stay in the gateway." },
  { n: "05", title: "Verify", body: "Forbidden call did not execute. Allowed read did." },
  { n: "06", title: "Evidence", body: "Trace id + policy hash + ticket, sealed with sha256." },
  { n: "07", title: "Approve", body: "No ticket means BLOCK. Human DENY stays blocked. Prevent, never undo." },
  { n: "08", title: "Capture", body: "The failed attack becomes a permanent deny Skill." },
];

export const stats = [
  { glyph: "<", target: 120, suffix: "ms", decimals: 0, label: "Gate Decision Time" },
  { glyph: "%", target: 99.99, suffix: "%", decimals: 2, label: "Fail-Closed Rate" },
  { glyph: "*", target: 24, suffix: "/7", decimals: 0, label: "Red Team Runtime" },
  { glyph: "#", target: 2.4, suffix: "M", decimals: 1, label: "Attempts Audited" },
];
