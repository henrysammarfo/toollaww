# TOOLLAW

**GOAI 2026 · Track 1 Agent Infra** · Accra Technical University

GitHub: [henrysammarfo/toollaww](https://github.com/henrysammarfo/toollaww) (Lovable). Product name is **TOOLLAW**.

**Live:** [https://toollaww.vercel.app](https://toollaww.vercel.app)  
**MCP:** [https://toollaww.vercel.app/api/mcp](https://toollaww.vercel.app/api/mcp) · [health](https://toollaww.vercel.app/api/health)

Prelim clock (Hangzhou): **2026-08-16 23:59 China Standard Time** = **15:59 Ghana (UTC+0)** same day. US Central is not the official clock.

Tool-level allowlist + fail-closed red team on AgentTeams.

**Phases:** [`docs/PHASES.md`](docs/PHASES.md) — 0–2 done · **3 sidecar in repo** · 4 Hangzhou  
**Prelim submit:** [`docs/SUBMIT.md`](docs/SUBMIT.md) · zip on Desktop `TOOLLAW-GOAI-prelim.zip`

Not a trading bot. Not handbook ITSM. Not AgentTeams demo 4. Apache-2.0. No secrets in git.

## Dev

```sh
npm i
npm test
npm run dev
```

MCP (stdio):

```sh
npm run mcp
```

Sidecar (isolated; never `/opt/scout` or `/opt/lockin`):

```sh
npm test
npm run e2e
npm run sidecar
docker compose -f deploy/agentteams/docker-compose.yml up --build
```

Console: `/dashboard/sidecar` · film zip: `POST /api/film` · OTLP: `GET /api/otel`


```sh
curl -s https://toollaww.vercel.app/api/mcp
curl -s -H "content-type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}" https://toollaww.vercel.app/api/mcp
```

```sh
npm run build
```

This project is connected to [Lovable](https://lovable.dev/projects/2527e2a4-8b32-4bc3-b3c5-b9dfd5b632d5). Do not force-push or rewrite published git history.
