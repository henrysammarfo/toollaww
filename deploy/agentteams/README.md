# AgentTeams sidecar (Phase 3)

Namespace **`toollaw-sidecar`**. Data volume **`/var/lib/toollaw`**.

**Never** mount, write, or symlink:

- `/opt/scout`
- `/opt/lockin`

Those trees belong to other fleets. Peer-env attack fixtures must BLOCK.

## What is running now

| Piece | Status |
|---|---|
| Worker / Team / Human / Manager CRs (`agentteams.io/v1beta1`) | **Shipped** in `toollaw-crew.yaml` + typed in `src/lib/agentteams-crs.ts` |
| Matrix-shaped room bus | **Shipped** (`!toollaw-crew:toollaw.local`) |
| Higress-shaped MCP gate | **Shipped** (`src/lib/higress.ts` → enforce then stub) |
| OTLP/HTTP JSON | **Shipped** `GET /api/otel` |
| Evidence zip | **Shipped** `POST /api/film` |
| Docker compose (gateway + MinIO + collector) | **Shipped** |
| Official `agentteams-controller` / Worker images from Hangzhou registry | **YAML ready, images not pulled in this repo** — attach on the dedicated VM |

Honest: this sidecar **is** the fail-closed loop with AgentTeams CR shape. It is **not** a silent claim that Synapse + Higress OSS binaries are already running in Ghana.

## Local Docker

From repo root:

```sh
docker compose -f deploy/agentteams/docker-compose.yml up --build
curl -s http://127.0.0.1:8787/health
curl -s -X POST http://127.0.0.1:8787/api/sidecar
curl -s -OJ -X POST http://127.0.0.1:8787/api/film
```

## Film (3 Sep)

BLOCK `fixture.unhalt` → ALLOW `toollaw.health` → BLOCK `fixture.env.patch` (`/opt/lockin`) → BLOCK unsettled redeem → zip.

Live without Docker: https://toollaww.vercel.app/dashboard/sidecar
