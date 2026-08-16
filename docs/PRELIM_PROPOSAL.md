# TOOLLAW — GOAI Agent Infra Preliminary Proposal

**GOAI 2026 · Track 1 Agent Infra** · Accra Technical University · 2026-08-16

**One sentence.** TOOLLAW compiles *who may call which Skill or MCP tool, with which arguments,* into a fail-closed allowlist. Policy Compiler writes the artifact; Red Team must lose in the Matrix room; Gateway Auditor proves the forbidden call did not execute and emits hashed evidence. Human ALLOW is L3-only.

## Demo (running)

| Surface | URL |
|---|---|
| Product + MCP | https://toollaww.vercel.app · `/api/mcp` |
| Policy sidecar | http://34.89.119.128:8787/health |
| AgentTeams dashboard | http://34.89.119.128:13000 |
| Element (Matrix) | http://34.89.119.128:18088 |
| Higress console | http://34.89.119.128:18001 |

## 1. Scenario and value (25%)

**Problem.** OSS agent gateways typically ACL at **server** level. A Worker that may talk to an MCP server can still fire the wrong **tool** with the wrong **args**. Traces show the blast after it happens. Platform teams need enforcement: AppArmor/IAM for agent tools.

**Users.** Platform, SRE, and security teams running multi-agent fleets.

**Value.** Compiled tool-level law + red-team proof + hashed evidence. Replicable: swap fixtures; keep roles, Skills, and fail-closed default.

**Not this idea.** A logo stack. A LangGraph SRE crew. Official AgentTeams demo 4 (incident chat). A trading product.

## 2. Solution

TOOLLAW: Policy Compiler writes an allowlist Skill; Red Team attacks with a fixture pack; Auditor matches policy hash to the attempt; Human L3 is required on high-risk and cannot be the attacker.

Halt / redeem / peer-env events are **attack fixtures**, not the product.

**Moat.** Traces show what happened. TOOLLAW decides what is allowed to happen.

## 3. Multi-agent closed loop (25%)

Baseline: AgentTeams Manager–Workers in a Matrix room. Humans are first-class (L3 on high-risk).

| Step | Who | AgentTeams mapping |
|---|---|---|
| Task input | Red Team fixture JSON | Worker posts `ToolLaw` attempt |
| Decomposition | Manager + Policy Compiler | TeamHarness assigns compile vs attack vs audit |
| Context passing | Shared `ToolLaw` object | Files / artifacts, not a 20k-token dump |
| Tool calling | Skills + MCP-shaped catalog | Gateway holds secrets |
| Result verification | Auditor | `executed: false` on BLOCK; ALLOW on health read |
| Evidence | Auditor | policyHash + sha256 receipt |
| Approval / rollback | Human L3 | No ticket → BLOCK (prevent, not undo) |
| Experience capture | Auditor | Writes `toollaw.deny-unhalt` |

**Exception branches.** Unknown tool: BLOCK. Peer path in env args: BLOCK. Unsettled redeem: BLOCK. Red Team calling approve: BLOCK. Compiler error: BLOCKED, do not load stale policy.

## 4. Agent identity list (Appendix A)

| ID | Role | AgentTeams | May | Must not |
|---|---|---|---|---|
| mgr | Manager | Manager | Create Team, track state | Fire tools |
| pol | Policy Compiler | Leader or Worker | Compile YAML → allowlist | Execute risky tools |
| red | Red Team | Worker | Attack with forbidden Skills | Self-approve |
| aud | Gateway Auditor | Worker | Match traces, evidence | Weaken allowlist |
| hum | Human | Matrix Human | ALLOW / DENY | Be optional on high-risk |

State: `OPEN → COMPILING → ATTACKING → BLOCKED | AWAITING_APPROVAL → VERIFYING → CLOSED`

## 5. Skills (mandatory, 25%)

| Skill | Purpose | Mutate | Approval |
|---|---|---|---|
| toollaw.compile | Hash allowlist artifact | artifact only | no |
| toollaw.enforce | ALLOW / BLOCK / REQUIRE_APPROVAL | no | n/a |
| toollaw.redteam | Submit attack fixture | attempts only | must fail closed |
| toollaw.evidence | Receipt sha256 | evidence store | no |
| toollaw.approve | Human ticket | ticket | human-only |
| toollaw.health | Read fixture | no | no |
| toollaw.deny-unhalt | Capture after BLOCK | no | n/a |

Attack surface (not product Skills): `fixture.unhalt`, `fixture.redeem`, `fixture.env.patch`.

## 6. Engineering / audit (20%) and OSS (5%)

- Typed JSON Schema for `ToolLaw` and policy.
- Default fail-closed. Evidence zip for judges.
- Apache-2.0. No secrets in git. Fixtures are synthetic.

## 7. Demo loop (semi 3 Sep, reused 22 Sep)

Red Team fires unhalt → BLOCK + receipt → Human ALLOW on health → peer env.patch BLOCK → Auditor zip.

## 8. Honest limits

Prelim is completeness + scenario. Semi is a runnable fail-closed loop on AgentTeams. Higress OSS vs Enterprise tool ACL is treated as a gap we close with Skills — we do not overclaim the gateway already does tool-arg IAM.
