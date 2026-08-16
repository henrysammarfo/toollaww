# HANDBOOK LOCK — Track 1 Agent Infra

Source: GOAI Track 1 handbook (Henry paste 2026-08-16) + FACT_CHECK.md.

## What we are

**TOOLLAW** — compile who may call which tool with which args into a fail-closed Skill. Red Team loses. Auditor proves non-execution.

Not OpsPilot Zero. Not Direction 1 zero-touch ops. Not demo 4 incident chat.

## Must (handbook)

- ≥3 distinct Agents + identity list (we have 5: mgr, pol, red, aud, hum)
- AgentTeams as collaboration **design baseline**
- Skills **mandatory** (I/O, fail, security, reuse, loop slot)
- Closed loop: input · decompose · context · tools · verify · evidence · approve/rollback · capture
- High-risk: approval, rollback, audit
- Semi: executable AgentTeams package + runnable demo/video
- Finals: live demo (Element room **or** our console — we ship both)

## Recommended (Henry: all mandatory in TOOLLAW)

MCP (we have live JSON-RPC) · observability (OTLP JSON) · RAG (we use typed ToolLaw object + captures instead of a fake knowledge base; remaining two of three: shared state + trace — **yes**)

## Scoring

Scenario 25 · multi-agent loop 25 · Skill engineering 25 · landing/audit 20 · OSS 5.

Recommended Aliyun logos (Nacos, PolarDB, RocketMQ) are **not** scored by count.

## Kill

Direction 1 / demo 4 clone. Trading bot as the product. Auth/tenants. Writing peer fleet paths.

## Prelim pack (already)

Intro ≤500 chars · PPT/PDF · identities · Skills · contracts. Code optional; we already shipped live `toollaww.vercel.app`.
