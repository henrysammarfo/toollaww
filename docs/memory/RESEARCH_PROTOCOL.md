# RESEARCH PROTOCOL — TOOLLAW

Research keys live in a local gitignored `.env`. Never commit. Never paste into git.

## Order

1. **Tavily** `POST https://api.tavily.com/search`
2. **TinyFish** `POST https://agent.tinyfish.ai/v1/automation/run-sse` header **`X-API-Key`**
3. Official pages (goaihz.com, AgentTeams GitHub, handbook PDF)
4. Persist into `docs/memory/` with date + URL

## Rules

- Do not invent deadlines, prizes, MCP-vs-Skill, or AgentTeams behavior.
- Tavily **answers** can be wrong. Prefer citations + TinyFish + handbook.
- If tools fail → **unverified**. Do not guess.
- TOOLLAW gate is deterministic. Tavily/TinyFish are for **research**, not for `toollaw.enforce`.
