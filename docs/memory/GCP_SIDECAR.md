# GCP — TOOLLAW sidecar

Dedicated VM for TOOLLAW + AgentTeams. Isolated home: `/var/lib/toollaw`. Code: `/opt/toollaw`.

Public HTTP (demo):

| Surface | URL |
|---|---|
| Sidecar health | http://34.89.119.128:8787/health |
| Dashboard | http://34.89.119.128:13000 |
| Element | http://34.89.119.128:18088 |
| Higress | http://34.89.119.128:18001 |
| Matrix CS | http://34.89.119.128:18080/_matrix/client/versions |

Firewall allows tcp 8787, 18080, 18088, 18001, 13000 on this instance only.

LLM keys and admin passwords live on the VM, never in git.
