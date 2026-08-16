# TOOLLAW

**GOAI 2026 · Track 1 Agent Infra** · Accra Technical University

Tool-level allowlist + fail-closed red team on AgentTeams.

**Live:** [https://toollaww.vercel.app](https://toollaww.vercel.app)  
**MCP:** [https://toollaww.vercel.app/api/mcp](https://toollaww.vercel.app/api/mcp)

Prelim clock: **2026-08-16 23:59 China Standard Time**.

Submit pack: [`docs/SUBMIT.md`](docs/SUBMIT.md) · handbook [`docs/PRELIM_HANDBOOK.md`](docs/PRELIM_HANDBOOK.md) · proposal [`docs/PRELIM_PROPOSAL.md`](docs/PRELIM_PROPOSAL.md)

Apache-2.0. No secrets in git.

## Dev

```sh
npm i
npm test
npm run e2e
npm run sidecar
```

MCP (HTTP):

```sh
curl -s -H "content-type: application/json" -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}" https://toollaww.vercel.app/api/mcp
```
