#!/bin/bash
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive
# TOOLLAW only. Never create or write /opt/scout or /opt/lockin.
mkdir -p /var/lib/toollaw /opt/toollaw
echo "home=/var/lib/toollaw" >/var/lib/toollaw/ISOLATION
echo "never=/opt/scout" >>/var/lib/toollaw/ISOLATION
echo "never=/opt/lockin" >>/var/lib/toollaw/ISOLATION
apt-get update
apt-get install -y ca-certificates curl gnupg docker.io
systemctl enable --now docker
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
touch /var/lib/toollaw/READY
