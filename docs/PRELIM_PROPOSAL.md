# TOOLLAW — GOAI Agent Infra Preliminary Proposal

**GOAI 2026 · Track 1 Agent Infra** · Accra Technical University · 2026-08-14  
Sources: GOAI handbook · goaihz.com · AgentTeams (formerly HiClaw) · idea search T1 lock

**One sentence.** Agent Infra for tools: compile who may call which Skill/MCP tool with which args into a fail-closed allowlist; Red Team must lose in the Matrix room; Gateway Auditor proves the forbidden call did not execute.

Prelim does not require runnable code. Semi-final (2026-09-03) ships an AgentTeams demo. This is not a trading bot, not handbook Direction 1 ITSM, not AgentTeams demo 4.

## 1. Scenario and value (25%)

**Problem.** OSS agent gateways typically ACL at **server** level. A Worker that may talk to an MCP server can still fire the wrong **tool** with the wrong **args**. Traces show the blast after it happens. Enterprises need enforcement: AppArmor/IAM for agent tools.

**Users.** Platform, SRE, and security teams running multi-agent fleets. Not retail chat. Not traders.

**Value.** Compiled tool-level law + red-team proof + hashed evidence. Replicable: swap fixtures; keep roles, Skills, and fail-closed default.

**Not this idea:** Nacos+Higress logo stack; LangGraph SRE crew; incident-chat clone of official demo 4.

## 2. Solution

TOOLLAW: Policy Compiler writes an allowlist Skill; Red Team attacks with a fixture pack; Auditor matches policy hash to the attempt; Human L3 is required on high-risk and cannot be the attacker.

Lived halt/redeem/env-mix events are **attack fixtures**, not the product.

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

## 7. Demo (3 Sep, reused 22 Sep)

Red Team fires unhalt → BLOCK + receipt → Human ALLOW on health → peer env.patch BLOCK → Auditor zip.

## 8. Honest limits

Idea does not guarantee Top 15. Prelim is completeness + scenario. Semi is a runnable fail-closed loop. Higress OSS vs Enterprise tool ACL is **partially** documented (HiClaw 1.0.6 blog); we do not overclaim Tavily proved it.
