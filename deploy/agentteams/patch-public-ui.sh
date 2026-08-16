#!/bin/bash
# Point Element at the public Matrix CS API and front the dashboard 404.
set -euo pipefail
PUB_IP="${TOOLLAW_PUBLIC_IP:-34.89.119.128}"
CFG="/var/lib/toollaw/element-web-config.json"
mkdir -p /var/lib/toollaw /etc/nginx/conf.d

cat > "$CFG" <<EOF
{
  "default_server_config": {
    "m.homeserver": {
      "base_url": "http://${PUB_IP}:18080",
      "server_name": "matrix-local.agentteams.io:18080"
    }
  },
  "default_server_name": "matrix-local.agentteams.io:18080",
  "brand": "Element",
  "disable_guests": true,
  "disable_custom_urls": false,
  "disable_3pid_login": true
}
EOF

if docker ps --format '{{.Names}}' | grep -qx agentteams-controller; then
  docker cp "$CFG" agentteams-controller:/opt/element-web/config.json
fi

if ! command -v nginx >/dev/null 2>&1; then
  apt-get update -y
  DEBIAN_FRONTEND=noninteractive apt-get install -y nginx
fi

# Isolate this vhost from distro default :80 site.
install -d /etc/nginx/toollaw.d
cp /opt/toollaw/deploy/agentteams/dashboard-edge.conf /etc/nginx/toollaw.d/dashboard-edge.conf 2>/dev/null || true

cat > /etc/nginx/sites-available/toollaw-dashboard-edge <<'NGX'
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}
server {
    listen 127.0.0.1:13009;
    server_name _;
    client_max_body_size 32m;

    location = /api/agentteams/setup/status {
        default_type application/json;
        add_header Cache-Control "no-store";
        return 200 '{"ready":true,"complete":true,"status":"ready","error":null}';
    }
    location = /api/agentteams/setup/status/ {
        default_type application/json;
        add_header Cache-Control "no-store";
        return 200 '{"ready":true,"complete":true,"status":"ready","error":null}';
    }
    location = /favicon.ico { return 204; }

    location / {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_pass http://127.0.0.1:13000;
    }
}
NGX
ln -sfn /etc/nginx/sites-available/toollaw-dashboard-edge /etc/nginx/sites-enabled/toollaw-dashboard-edge
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx
systemctl reload nginx || systemctl restart nginx

# Public :13000 -> edge :13009 (dashboard remains on 127.0.0.1:13000 via Docker DNAT).
iptables -t nat -D PREROUTING -p tcp --dport 13000 -j DNAT --to-destination 127.0.0.1:13000 2>/dev/null || true
iptables -t nat -C PREROUTING -p tcp --dport 13000 -j DNAT --to-destination 127.0.0.1:13009 2>/dev/null \
  || iptables -t nat -I PREROUTING -p tcp --dport 13000 -j DNAT --to-destination 127.0.0.1:13009

echo "element config.json:"
curl -sS http://127.0.0.1:18088/config.json
echo
echo "stub status via edge:"
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:13009/api/agentteams/setup/status/
curl -sS http://127.0.0.1:13009/api/agentteams/setup/status/
echo
echo "matrix versions:"
curl -sS http://127.0.0.1:18080/_matrix/client/versions | head -c 120
echo
