# Skill: toollaw.sidecar

- **Name:** `toollaw.sidecar`
- **Purpose:** Reconcile AgentTeams CRs in namespace `toollaw-sidecar`, open a Matrix-shaped room, run the fail-closed film through the Higress-shaped gate.
- **Inputs:** `{ home?: string }` default `/var/lib/toollaw`. Rejects `/opt/scout` and `/opt/lockin`.
- **Outputs:** CR bundle, room event count, attacks, captures, OTLP, evidence hash.
- **Rules:** never write peer fleet paths. Official Hangzhou Worker images are attach-only.
- **Invocation:** `POST /api/sidecar` · MCP `toollaw.sidecar` · Docker port 8787.
- **Depends:** compiled policy, gateway, capture.
- **Failure:** invalid CR or forbidden home → error, no execute.
- **Security:** no auth cookies. No live unhalt.
- **Reuse:** any AgentTeams crew that needs an isolated sidecar.
- **Loop slot:** context / tools / verify / evidence.
