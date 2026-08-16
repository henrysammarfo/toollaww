# TOOLLAW handbook (GOAI Track 1 Agent Infra)

Accra Technical University · Apache-2.0

## Product

TOOLLAW is Agent Infra for **tools**. It compiles *who may call which Skill or MCP tool, with which arguments,* into a fail-closed allowlist. Policy Compiler writes a hashed artifact. Red Team must lose in the Matrix room. Gateway Auditor proves forbidden calls did not execute and emits receipts. Human ALLOW is L3-only.

Moat: traces show what happened; TOOLLAW decides what is allowed.

Not a trading bot. Not handbook Direction 1 ITSM. Not AgentTeams demo 4.

## Live surfaces

| Surface | URL |
|---|---|
| Product / MCP | https://toollaww.vercel.app · `/api/mcp` |
| Sidecar health | http://34.89.119.128:8787/health |
| Dashboard | http://34.89.119.128:13000 |
| Element | http://34.89.119.128:18088 |
| Higress | http://34.89.119.128:18001 |
| Matrix CS API | http://34.89.119.128:18080/_matrix/client/versions |

## Crew (Appendix A)

| ID | Role | May | Must not |
|---|---|---|---|
| mgr | Manager | Create Team, track state | Fire tools |
| pol | Policy Compiler | Compile YAML → allowlist | Execute risky tools |
| red | Red Team | Attack with forbidden Skills | Self-approve |
| aud | Gateway Auditor | Match traces, evidence | Weaken allowlist |
| hum | Human L3 | ALLOW / DENY | Be optional on high-risk |

State: `OPEN → COMPILING → ATTACKING → BLOCKED | AWAITING_APPROVAL → VERIFYING → CLOSED`

## Skills (mandatory)

`toollaw.compile` · `toollaw.enforce` · `toollaw.redteam` · `toollaw.evidence` · `toollaw.approve` · `toollaw.health` · `toollaw.deny-unhalt`

Specs: `skills/`. Attack fixtures (not product Skills): `fixture.unhalt`, `fixture.redeem`, `fixture.env.patch`.

## Closed loop

1. Compiler hashes the allowlist.
2. Red Team submits a fixture.
3. Enforce returns BLOCK (or REQUIRE_APPROVAL). `executed: false` on BLOCK.
4. Auditor writes policyHash + sha256 receipt.
5. Human L3 may ALLOW only a read (`toollaw.health`).
6. Capture `toollaw.deny-unhalt` after a BLOCK.

Default is fail-closed. Unknown tool, peer-env path, unsettled redeem, and Red Team calling approve are BLOCK.

## Contracts and evidence

JSON Schema for `ToolLaw` and compiled policy live in `contracts/`. Expected BLOCK/ALLOW cases in `fixtures/EXPECTED.md`. Sidecar MCP tools include compile, enforce, redteam, evidence, approve, health, gateway, crew, sidecar, film, otel.

## Semi / finals demo

Red Team fires unhalt → BLOCK + receipt → Human ALLOW on health → peer env.patch BLOCK → Auditor zip. Same loop on 3 Sep and 22 Sep.
