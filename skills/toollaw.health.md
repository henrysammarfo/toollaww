# Skill: toollaw.health

- **Name:** `toollaw.health`
- **Purpose:** Read-only fixture so the film has an ALLOW path. Proves the gate is not “block everything.”
- **Inputs:** `{ agent?: string }`
- **Outputs:** `{ ok: true, halted: boolean, note }` — synthetic fixture health, not a live production agent.
- **Invocation:** after compile; Auditor or Red Team may call if policy allows.
- **Depends:** `fixtures/allow-health.json` values. No production HTTP.
- **Failure:** if enforce BLOCK (wrong principal) → do not fabricate ok.
- **Security:** no mutate. No secrets.
- **Reuse:** replace body with a real read MCP later; keep the same Skill name.
- **Loop slot:** verify.
