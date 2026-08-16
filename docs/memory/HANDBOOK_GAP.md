# Handbook vs shipped — honest

Henry bar: optionals are mandatory. This is the gap list, not marketing.

## Exceeded / done (prelim + engineering)

| Handbook | TOOLLAW |
|---|---|
| ≥3 distinct Agents | **5** (mgr, pol, red, aud, hum) + identity list |
| AgentTeams as design baseline | CRs `agentteams.io/v1beta1`, Team `workerMembers`, Human, Manager |
| Skills mandatory | compile, enforce, redteam, evidence, approve, health, sidecar, film, deny-* |
| 8-loop slots | mapped in architecture + crew/sidecar film |
| MCP recommended | live JSON-RPC `/api/mcp` + stdio |
| Observability recommended | traceId/spanId + OTLP JSON `/api/otel` |
| Evidence / audit | sha256 receipts + film zip |
| Approval / high-risk | Human-only approve; mutate fixtures **never execute** |
| Open source plan | Apache-2.0, GitHub `toollaww` |
| Prelim intro + PDF | shipped |
| Live demo URL | https://toollaww.vercel.app |
| RAG alternative (if no vector KB) | traces + shared ToolLaw/crew state (2 of remaining 3) |

## Not done yet (semi / finals / Henry-bar leftover)

| Gap | Why it still matters |
|---|---|
| Official AgentTeams controller + Matrix + Higress **binaries** | **running** on GCE 2026-08-16. Apply TOOLLAW Worker/Team YAML via `agt` next. |
| Film **video** file | Semi: runnable demo **or** video. Live Element + TOOLLAW film exist; MP4 not in repo. |
| Real Vector RAG / PolarDB | Optional. We did not fake a knowledge base. Fine if we keep the alternative honest. |
| Nacos / RocketMQ / official Cloud Skills portal | Recommended, **not scored by count**. Skip as the pitch. |
| Official installer LLM on the VM | **on VM only**, not in git |
| Hangzhou on-site 22 Sep | Phase 4. Same loop live. |
| Rollback of a live mutate | By design mutate never fires. Rollback is “did not execute,” not “undo a write.” |

## Bottom line

Prelim handbook: **covered and exceeded** (code + live MCP, which was optional).

Semi handbook (3 Sep): AgentTeams binaries **are up**. Remaining: attach TOOLLAW CRs/Skills in the Matrix room + film/video for judges.
