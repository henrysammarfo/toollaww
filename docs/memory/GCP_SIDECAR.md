# GCP — TOOLLAW sidecar (never SCOUT)

Updated **2026-08-16 11:07 UTC**.

## Account

Project **`covenant-502517`**. Zone **europe-west2-c**.

| Name | Status | NAT | Rule |
|---|---|---|---|
| **toollaw-sidecar** | RUNNING e2-medium | **34.89.119.128** | TOOLLAW only. systemd `:8787`. Home `/var/lib/toollaw`. |
| scout-trader | RUNNING | 34.142.119.214 | **DO NOT TOUCH** |
| covenant-api | RUNNING | 34.142.102.113 | Not TOOLLAW |

Firewall: `allow-toollaw-sidecar` tcp 8787,18080,18088,18001,13000 target-tag `toollaw-sidecar`.

Health: `http://34.89.119.128:8787/health`  
Film: `POST http://34.89.119.128:8787/api/sidecar` → CLOSED 3/1.

Isolation: no `/opt/scout`, no `/opt/lockin`. Code in `/opt/toollaw`.

Official AgentTeams (2026-08-16): **controller + manager + dashboard running** on GCE `toollaw-sidecar`. Element http://34.89.119.128:18088/#/login · Higress console :18001 · dashboard :13000. Bind was localhost; DNAT expose is on. Manager `default` PHASE Running, model gpt-4o. TOOLLAW gate still :8787. LLM key lives only on the VM (`/root/agentteams-secrets.env`), not in git.

SSH: `ssh -i ~/.ssh/google_compute_engine jessi@34.89.119.128`
