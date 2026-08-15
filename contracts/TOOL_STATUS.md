# Tool / MCP status (honest)

Handbook: **Skill mandatory, MCP recommended.** Equivalent typed contracts are OK if a later Higress MCP adapter is mechanical.

| Name | Kind | Prelim | Semi (3 Sep) |
|---|---|---|---|
| `toollaw.compile` | Skill + MCP-shaped | Spec + schema | Callable from Policy Compiler Worker |
| `toollaw.enforce` | Skill + pure function | Spec + schema | Gateway hook; default BLOCK |
| `toollaw.redteam` | Skill | Spec + fixtures | Red Team Worker posts attempts |
| `toollaw.evidence` | Skill | Spec | Append-only store + zip |
| `toollaw.approve` | Skill | Spec | Matrix Human L3 only |
| `toollaw.health` | Skill (read fixture) | Spec + fixture | ALLOW path in the film |
| `fixture.unhalt` / `redeem` / `env.patch` | Attack surface | JSON fixtures | Stub tools that **must not** execute without ticket |
| Higress MCP | Gateway | Documented, not required | Optional adapter; secrets stay in gateway |
| Production SCOUT/LOCKIN APIs | **out of scope** | never wired | never wired |

Default for unknown tools: **BLOCK**.
