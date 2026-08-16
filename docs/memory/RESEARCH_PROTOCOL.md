# RESEARCH PROTOCOL — TOOLLAW

Keys: `scoutbot/agent/.env` (gitignored). Never commit. Never paste into git or memory files.

## Order

1. **Tavily** `POST https://api.tavily.com/search` (`TAVILY_API_KEY`)
2. **TinyFish** `POST https://agent.tinyfish.ai/v1/automation/run-sse` header **`X-API-Key`**
3. Official pages (goaihz.com, AgentTeams GitHub, handbook PDF)
4. Persist into `docs/memory/` with date + URL

## Rules

- Do not invent deadlines, prizes, MCP-vs-Skill, or AgentTeams behavior.
- Tavily **answers** can be wrong (example 2026-08-16: mixed “agent skills career” blogs into GOAI). Prefer citations + TinyFish + handbook.
- If tools fail → **unverified**. Do not guess.
- TOOLLAW gate is deterministic. Tavily/TinyFish are for **research**, not for `toollaw.enforce`.

Helper: `docs/memory/research-raw/goai-handbook-pass.mjs`
