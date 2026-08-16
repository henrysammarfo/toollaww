#!/bin/bash
set -euxo pipefail
# Run on toollaw-sidecar only. Secrets come from /root/agentteams-secrets.env
umask 077
test -f /root/agentteams-secrets.env
set -a
# shellcheck disable=SC1091
source /root/agentteams-secrets.env
set +a
test -n "${AGENTTEAMS_LLM_API_KEY:-}"

export AGENTTEAMS_NON_INTERACTIVE=1
export AGENTTEAMS_LANGUAGE=en
export AGENTTEAMS_LLM_PROVIDER=openai-compat
export AGENTTEAMS_OPENAI_BASE_URL=https://api.openai.com/v1
export AGENTTEAMS_DEFAULT_MODEL=gpt-4o
export AGENTTEAMS_EMBEDDING_MODEL=text-embedding-3-small
export AGENTTEAMS_REGISTRY=higress-registry.cn-hangzhou.cr.aliyuncs.com
export AGENTTEAMS_VERSION=v1.2.2
export AGENTTEAMS_WORKSPACE_DIR=/var/lib/toollaw/agentteams-manager
export AGENTTEAMS_DATA_DIR=toollaw-agentteams-data
export AGENTTEAMS_ADMIN_USER=admin
export AGENTTEAMS_ADMIN_PASSWORD="${AGENTTEAMS_ADMIN_PASSWORD}"
export AGENTTEAMS_DASHBOARD=1
export AGENTTEAMS_UPGRADE_KEEP_ALL=1
mkdir -p /var/lib/toollaw/agentteams-manager
# never scout/lockin
test ! -d /opt/scout
test ! -d /opt/lockin

if ! docker compose version >/dev/null 2>&1; then
  apt-get update
  apt-get install -y docker-compose-v2
fi
usermod -aG docker jessi || true

cd /tmp
curl -fsSL https://raw.githubusercontent.com/agentscope-ai/AgentTeams/main/install/agentteams-install.sh -o /tmp/agentteams-install.sh
chmod +x /tmp/agentteams-install.sh
bash /tmp/agentteams-install.sh manager
