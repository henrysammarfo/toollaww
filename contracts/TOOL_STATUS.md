# Tool / MCP status (honest)

Handbook: **Skill mandatory, MCP recommended.**

Live JSON-RPC MCP: `GET/POST https://toollaww.vercel.app/api/mcp`  
Local stdio: `npm run mcp`

| Name | Kind | Now | Semi (3 Sep) |
|---|---|---|---|
| `toollaw.compile` | Skill + MCP tool | HTTP + sha256 | AgentTeams Worker |
| `toollaw.enforce` | Skill + MCP tool | HTTP fail-closed | Higress adapter |
| `toollaw.redteam` | Skill + MCP tool | HTTP attack pack | Matrix Worker |
| `toollaw.evidence` | Skill + MCP tool | hashed receipts | object store |
| `toollaw.approve` | Skill + MCP tool | Human-only; mutate fixtures stay BLOCK | L3 Matrix |
| `toollaw.health` | Skill + MCP tool | ALLOW read | same |
| `fixture.*` | Attack surface | never executes | never live `/opt` |
| Higress | Gateway | not required yet | optional |
| SCOUT/LOCKIN APIs | out of scope | never wired | never wired |

Default for unknown tools: **BLOCK**.
