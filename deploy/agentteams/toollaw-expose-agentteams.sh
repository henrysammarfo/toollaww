#!/bin/bash
sysctl -w net.ipv4.conf.all.route_localnet=1 >/dev/null
# Dashboard public port goes through host nginx :13009 (setup/status stub).
for spec in 18088:18088 18080:18080 18001:18001 13000:13009; do
  src="${spec%%:*}"
  dst="${spec##*:}"
  iptables -t nat -D PREROUTING -p tcp --dport "$src" -j DNAT --to-destination "127.0.0.1:13000" 2>/dev/null || true
  iptables -t nat -C PREROUTING -p tcp --dport "$src" -j DNAT --to-destination "127.0.0.1:$dst" 2>/dev/null \
    || iptables -t nat -I PREROUTING -p tcp --dport "$src" -j DNAT --to-destination "127.0.0.1:$dst"
done
iptables -t nat -C POSTROUTING -p tcp -d 127.0.0.1 -j MASQUERADE 2>/dev/null \
  || iptables -t nat -A POSTROUTING -p tcp -d 127.0.0.1 -j MASQUERADE

# Re-apply Element public homeserver if the controller recreated config.json.
if docker ps --format '{{.Names}}' | grep -qx agentteams-controller && test -f /var/lib/toollaw/element-web-config.json; then
  docker cp /var/lib/toollaw/element-web-config.json agentteams-controller:/opt/element-web/config.json || true
fi
