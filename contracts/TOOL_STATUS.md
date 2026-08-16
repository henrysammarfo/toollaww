# Tool / MCP status (honest)

Handbook: **Skill mandatory, MCP recommended.**

Live JSON-RPC MCP: `GET/POST https://toollaww.vercel.app/api/mcp`  
Local stdio: `npm run mcp`

| Name | Kind | Now | Semi (3 Sep) |
|---|---|---|---|
| `toollaw.compile` | Skill + MCP tool | HTTP + sha256 | Worker `toollaw-pol` |
| `toollaw.enforce` | Skill + MCP tool | HTTP fail-closed | Higress-shaped `/api/gateway` |
| `toollaw.redteam` | Skill + MCP tool | HTTP attack pack | Worker `toollaw-red` |
| `toollaw.evidence` | Skill + MCP tool | hashed receipts | zip via `POST /api/film` |
| `toollaw.approve` | Skill + MCP tool | Human-only; mutate fixtures stay BLOCK | Human CR `toollaw-hum` |
| `toollaw.health` | Skill + MCP tool | ALLOW read | same |
| `toollaw.sidecar` | Skill + MCP tool | CRs + room + gate | Docker `:8787` |
| `toollaw.film` | Skill + MCP tool | BLOCK→ALLOW→BLOCK→zip | 3 Sep video |
| `toollaw.otel` | Skill + MCP tool | OTLP JSON | collector on compose |
| `fixture.*` | Attack surface | never executes | never live `/opt` |
| Higress OSS | Gateway | console on the sidecar VM; tool-arg IAM is TOOLLAW Skills | same |

Default for unknown tools: **BLOCK**.
