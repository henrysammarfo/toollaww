#!/bin/bash
set -euxo pipefail
ls -la /opt/toollaw/sidecar
cp /tmp/toollaw-sidecar.service /etc/systemd/system/toollaw-sidecar.service
systemctl daemon-reload
systemctl enable --now toollaw-sidecar
sleep 3
systemctl --no-pager --full status toollaw-sidecar || true
echo '---health---'
curl -sS http://127.0.0.1:8787/health
echo
echo '---sidecar---'
curl -sS -X POST http://127.0.0.1:8787/api/sidecar | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("state"), d.get("namespace"), d.get("auditor"))'
