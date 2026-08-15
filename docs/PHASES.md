# TOOLLAW phases (locked)

No auth. No sessions. No tenants. No login cookies. Open console. Fixtures never write `/opt/scout` or `/opt/lockin`.

**Clock:** Prelim **2026-08-16 23:59 China Standard Time** = **15:59 Ghana**. Semi demo **3 Sep**. Hangzhou **22–23 Sep**.

---

## Phase 0 — Prelim kernel (DONE)

Live site + fail-closed MCP.

- [x] Landing / product / architecture / skills
- [x] `toollaw.enforce` default BLOCK
- [x] Attack fixtures: unhalt, unsettled redeem, peer env
- [x] MCP JSON-RPC `GET/POST /api/mcp`
- [x] Console Red Team → live MCP
- [x] sha256 receipts
- [x] Vercel production

---

## Phase 1 — Law in the path (NOW)

Gateway sits **in front of** tools. BLOCK becomes a captured deny Skill. Every call gets a trace.

| Build | Done when | Status |
|---|---|---|
| Gateway | `POST /api/gateway` → enforce → stub execute only if ALLOW | **done** |
| Capture | BLOCK writes `toollaw.deny-<tool>` markdown + hash | **done** |
| Traces | `traceId` + `spanId` on every gateway call | **done** |
| Contact | No email. POST hashes a proposed fixture | **done** |

Phase 2 in-process crew: `POST /api/crew` + console **Loop** / **Capture** pages — **started and runnable**. AgentTeams CRs still Phase 3.

---

## Phase 2 — In-process crew (NOW → 24 Aug)

Five roles as a **typed loop**, not K8s yet. Same object AgentTeams will carry later.

| Role | Job |
|---|---|
| `mgr` | Open run, assign steps, close |
| `pol` | Compile policy hash |
| `red` | Attack via gateway |
| `aud` | Match executed=false on BLOCK, emit captures |
| `hum` | ALLOW health only; mutate fixtures stay BLOCK |

Done when: `POST /api/crew` runs compile → attack → audit → capture in one response.

---

## Phase 3 — AgentTeams sidecar (25 Aug → 3 Sep)

Real Matrix room. Never overwrite `/opt/scout` or `/opt/lockin`. Own VM or local Docker.

- Worker / Team / Human CRs
- Skills attached to Workers
- Film: BLOCK → ALLOW health → peer BLOCK → evidence zip

---

## Phase 4 — Hangzhou (10–23 Sep)

Same loop live. No new product.

---

## Never

- Login / OAuth / multi-tenant / session cookies
- Trading bot / PROOFLOOP revival
- Live unhalt / live redeem / live env patch
- Nacos+Higress logo stack as the pitch
