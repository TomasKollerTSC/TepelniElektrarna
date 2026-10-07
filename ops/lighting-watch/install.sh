#!/bin/bash
# Run on an exhibit master: copy this folder there, then `bash install.sh`. Safe to re-run.
set -e
cd "$(dirname "$0")"
. /etc/techmania/backend.env
sudo install -d -m 0755 /usr/local/lib/techmania-extra
sudo install -m 0644 lighting_watch.py /usr/local/lib/techmania-extra/lighting_watch.py
sudo install -m 0644 techmania-lighting-watch.service /etc/systemd/system/techmania-lighting-watch.service
sudo systemctl daemon-reload
sudo systemctl enable techmania-lighting-watch.service >/dev/null 2>&1
sudo systemctl restart techmania-lighting-watch.service
sleep 3
echo "$(hostname) ($EXHIBIT_ID): $(systemctl is-active techmania-lighting-watch)"
sudo journalctl -u techmania-lighting-watch -n 1 --no-pager -o cat
