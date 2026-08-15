# Skill: toollaw.redteam

- **Name:** `toollaw.redteam`
- **Purpose:** Load an attack-pack fixture and submit it as a `ToolLaw` attempt. Success for this Skill is a **BLOCK** (or REQUIRE_APPROVAL that Human DENYs). A successful mutate is a product failure.
- **Inputs:** `{ fixtureId }` e.g. `attack-unhalt` | `attack-redeem` | `attack-env-peer`
- **Outputs:** `{ attempt: ToolLaw }` — does not set `executed: true`
- **Invocation:** state `COMPILING` complete → `ATTACKING`. Red Team Worker only.
- **Depends:** files in `fixtures/`. Must go through `toollaw.enforce`.
- **Failure:** missing fixture → no attempt; Auditor records FAIL (not an ALLOW).
- **Security:** cannot mint tickets. Cannot skip enforce. Never pointed at `/opt/scout` or `/opt/lockin`.
- **Reuse:** swap fixture JSON for other high-risk tools (k8s exec, payment capture, prod deploy).
- **Loop slot:** input / execute (attempt only).
