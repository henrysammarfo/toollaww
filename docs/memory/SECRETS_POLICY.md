# SECRETS POLICY

**Never commit API keys. Never write them into `docs/memory/`.**

## Research (already have)

| Key | Where | Use |
|---|---|---|
| `TAVILY_API_KEY` | `scoutbot/agent/.env` | Fact-check only |
| `TINYFISH_API_KEY` | same, header `X-API-Key` | Page scrape only |

Do not wire these into `toollaw.enforce`. Gate stays deterministic.

## AgentTeams LLM (Henry 2026-08-16)

- Provider: **OpenAI-compatible** (`https://api.openai.com/v1`)
- A project key was **pasted in chat**. Treat as **leaked**.
- **Rotate it now** at https://platform.openai.com/api-keys then put the **new** key only in a gitignored file:
  - `toollaww/deploy/agentteams/.env` (see `env.example`)
- Do not reuse the leaked string. Do not put it on `scout-trader`. Do not put it in GitHub Actions logs.

## Hangzhou / Higress registry

Not a key. Image pull. Prefer `higress-registry.us-west-1.cr.aliyuncs.com` from Ghana/US if Hangzhou is slow.

## GitHub PAT

Optional. Skip unless Workers must talk to GitHub.
