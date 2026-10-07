#!/bin/bash
# On a back-screen Pi: bash install.sh <bundle.tgz> "<screen name>" [password]
# Replaces app/ and dist/ only; data/ (published content, drafts, uploads, backups) is never touched.
# The password is set on first install and kept afterwards unless a new one is given.
set -e
BUNDLE=$1; NAME=$2; PASSWORD=$3
ROOT=/opt/backscreen-editor
STAGE=$(mktemp -d)
tar xzf "$BUNDLE" -C "$STAGE"
sudo mkdir -p "$ROOT/data"
for d in app dist; do
  sudo rm -rf "$ROOT/$d.old"
  [ -d "$ROOT/$d" ] && sudo mv "$ROOT/$d" "$ROOT/$d.old"
  sudo mv "$STAGE/$d" "$ROOT/$d"
done
if [ -n "$PASSWORD" ] || ! sudo test -f "$ROOT/.env"; then
  [ -n "$PASSWORD" ] || { echo "first install needs a password" >&2; exit 1; }
  printf 'KIOSK_EDIT_PASSWORD=%s\nSCREEN_NAME=%s\n' "$PASSWORD" "$NAME" | sudo tee "$ROOT/.env" >/dev/null
else
  sudo sed -i "s|^SCREEN_NAME=.*|SCREEN_NAME=$NAME|" "$ROOT/.env"
fi
sudo chown -R techmania:techmania "$ROOT"
sudo chmod 600 "$ROOT/.env"
sudo install -m 0644 "$ROOT/app/deploy/backscreen-editor.service" /etc/systemd/system/backscreen-editor.service
sudo systemctl daemon-reload
sudo systemctl enable backscreen-editor >/dev/null 2>&1
sudo systemctl restart backscreen-editor
rm -rf "$STAGE"
for i in $(seq 1 20); do curl -sf http://127.0.0.1:8081/healthz >/dev/null && break; sleep 1; done
echo "$(hostname): $(systemctl is-active backscreen-editor) | content $(curl -s -o /dev/null -w %{http_code} http://127.0.0.1:8081/data/content.json) | cards $(curl -s http://127.0.0.1:8081/data/content.json | python3 -c 'import json,sys;print(len(json.load(sys.stdin)["cards"]))')"
