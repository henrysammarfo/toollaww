# Skill: toollaw.film

- **Name:** `toollaw.film`
- **Purpose:** Judge-facing sequence: BLOCK unhalt → ALLOW health → BLOCK peer env → BLOCK unsettled redeem → evidence zip.
- **Inputs:** none.
- **Outputs:** decisions + `POST /api/film` zip bytes.
- **Rules:** mutate fixtures executed=false. Health is the only ALLOW.
- **Invocation:** console Sidecar page, MCP `toollaw.film`, `POST /api/film`.
- **Depends:** `toollaw.sidecar`.
- **Failure:** auditor mismatch → state BLOCKED, zip still hashed.
- **Security:** zip contains receipts and isolation note, not secrets.
- **Reuse:** Hangzhou live loop uses the same Skill.
- **Loop slot:** evidence / capture.
