# TOOLLAW phases (locked)

No auth. No sessions. No tenants. No login cookies. Open console. Fixtures never write `/opt/scout` or `/opt/lockin`.

**Clock:** Prelim **2026-08-16 23:59 China Standard Time** = **15:59 Ghana**. Semi demo **3 Sep**. Hangzhou **22–23 Sep**.

**Henry bar:** every optional is mandatory. Industry / enterprise / production grade. Ship the complex loop fully.

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

## Phase 1 — Law in the path (DONE)

Gateway sits **in front of** tools. BLOCK becomes a captured deny Skill. Every call gets a trace.

| Build | Done when | Status |
|---|---|---|
| Gateway | `POST /api/gateway` → enforce → stub execute only if ALLOW | **done** |
| Capture | BLOCK writes `toollaw.deny-<tool>` markdown + hash | **done** |
| Traces | `traceId` + `spanId` on every gateway call | **done** |
| Contact | No email. POST hashes a proposed fixture | **done** |

---

## Phase 2 — In-process crew (DONE)

Five roles as a typed loop. Same object the sidecar carries.

| Role | Job |
|---|---|
| `mgr` | Open run, assign steps, close |
| `pol` | Compile policy hash |
| `red` | Attack via gateway |
| `aud` | Match executed=false on BLOCK, emit captures |
| `hum` | ALLOW health only; mutate fixtures stay BLOCK |

Done: `POST /api/crew` runs compile → attack → audit → capture in one response.

---

## Phase 3 — AgentTeams sidecar (NOW → 3 Sep)

Own namespace **`toollaw-sidecar`**. Own volume **`/var/lib/toollaw`**. Never `/opt/scout` or `/opt/lockin`.

| Build | Done when | Status |
|---|---|---|
| CRs | Worker / Team / Human / Manager `agentteams.io/v1beta1` | **done** |
| Skills on Workers | `spec.skills` + MCP `toollaw` server | **done** |
| Matrix-shaped room | `!toollaw-crew:toollaw.local` event log | **done** |
| Higress-shaped gate | MCP in → enforce → stub; credentials never leave Worker | **done** |
| OTLP | `GET /api/otel` JSON export | **done** |
| Evidence zip | `POST /api/film` | **done** |
| Docker compose | gateway + MinIO + collector, isolated volumes | **done** |
| Official Hangzhou images | `kubectl apply -f deploy/agentteams/toollaw-crew.yaml` on dedicated VM | **YAML ready — images not pulled here** |
| Film | BLOCK unhalt → ALLOW health → BLOCK peer → zip | **e2e OK** `npm run e2e` · `/dashboard/sidecar` |

---

## Phase 4 — Hangzhou (10–23 Sep)

Same loop live. No new product. Attach official AgentTeams controller if the VM is up.

---

## Never

- Login / OAuth / multi-tenant / session cookies
- Trading bot / PROOFLOOP revival
- Live unhalt / live redeem / live env patch
- Nacos+Higress logo stack as the pitch
- Writing `/opt/scout` or `/opt/lockin`
